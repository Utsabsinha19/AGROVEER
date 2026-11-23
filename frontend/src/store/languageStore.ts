import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  AGRICULTURAL_REGIONS, 
  RegionLocation, 
  TRANSLATIONS 
} from '@/lib/translations';

export interface LiveLocationInfo {
  city?: string;
  state?: string;
  country?: string;
  isRealGPS: boolean;
  latitude?: number;
  longitude?: number;
}

interface LanguageState {
  currentLanguage: SupportedLanguage;
  detectedRegion: RegionLocation | null;
  liveLocationInfo: LiveLocationInfo | null;
  gpsStatus: 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';
  hasBannerDismissed: boolean;
  isCatalogModalOpen: boolean;
  isLocationModalOpen: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  setRegion: (regionId: string) => void;
  detectLocation: () => Promise<void>;
  requestLiveLocation: (autoSwitchLang?: boolean) => Promise<{ success: boolean; region?: RegionLocation; error?: string }>;
  dismissBanner: () => void;
  openCatalogModal: () => void;
  closeCatalogModal: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  t: (key: string) => string;
}

// Distance helper between two geographic coordinates in kilometers
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Match coordinates to the closest Indian Agricultural Hub
function findClosestRegion(lat: number, lon: number, stateName?: string): RegionLocation {
  // If state name is known from reverse geocoding, match by state/alias first
  if (stateName) {
    const sLow = stateName.toLowerCase();
    const matched = AGRICULTURAL_REGIONS.find((r) =>
      r.stateAliases?.some((alias) => sLow.includes(alias.toLowerCase())) ||
      r.state.toLowerCase().includes(sLow)
    );
    if (matched) return matched;
  }

  // Fallback: Haversine distance to approx center of agricultural hubs
  let closest = AGRICULTURAL_REGIONS[0];
  let minDistance = Infinity;

  for (const reg of AGRICULTURAL_REGIONS) {
    if (reg.approxCenter) {
      const dist = getHaversineDistance(lat, lon, reg.approxCenter[0], reg.approxCenter[1]);
      if (dist < minDistance) {
        minDistance = dist;
        closest = reg;
      }
    }
  }

  return closest;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      detectedRegion: AGRICULTURAL_REGIONS[0],
      liveLocationInfo: null,
      gpsStatus: 'idle',
      hasBannerDismissed: false,
      isCatalogModalOpen: false,
      isLocationModalOpen: false,

      setLanguage: (lang: SupportedLanguage) => {
        set({ currentLanguage: lang, hasBannerDismissed: true });
      },

      setRegion: (regionId: string) => {
        const found = AGRICULTURAL_REGIONS.find((r) => r.id === regionId);
        if (found) {
          set({ 
            detectedRegion: found, 
            currentLanguage: found.suggestedLang,
            hasBannerDismissed: false,
            liveLocationInfo: {
              city: found.city || '',
              state: found.state,
              country: 'India',
              isRealGPS: false,
              latitude: found.approxCenter?.[0],
              longitude: found.approxCenter?.[1]
            }
          });
        }
      },

      detectLocation: async () => {
        if (typeof window === 'undefined') return;
        const state = get();
        // If user already has real GPS granted, do not overwrite with IP
        if (state.gpsStatus === 'granted' && state.liveLocationInfo?.isRealGPS) {
          return;
        }

        try {
          // Fast client IP lookup
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          let data: {
            city?: string;
            region?: string;
            country?: string;
            latitude?: number;
            longitude?: number;
          } | null = null;

          try {
            const res = await fetch('https://ipwho.is/', { signal: controller.signal });
            if (res.ok) {
              const d = await res.json();
              if (d && (d.region || d.city)) {
                data = {
                  city: d.city,
                  region: d.region,
                  country: d.country,
                  latitude: d.latitude,
                  longitude: d.longitude,
                };
              }
            }
          } catch {
            // fallback
            try {
              const res2 = await fetch('https://freeipapi.com/api/json', { signal: controller.signal });
              if (res2.ok) {
                const d2 = await res2.json();
                data = {
                  city: d2.cityName,
                  region: d2.regionName,
                  country: d2.countryName,
                  latitude: d2.latitude,
                  longitude: d2.longitude,
                };
              }
            } catch {}
          }
          clearTimeout(timeoutId);

          if (data && (data.region || data.city)) {
            const city = data.city || '';
            const stName = data.region || '';
            const lat = Number(data.latitude) || 20.5937;
            const lon = Number(data.longitude) || 78.9629;

            const matched = findClosestRegion(lat, lon, stName || city);
            set({
              detectedRegion: matched,
              liveLocationInfo: {
                city,
                state: stName || matched.state,
                country: data.country || 'India',
                isRealGPS: false,
                latitude: lat,
                longitude: lon,
              },
            });
          }
        } catch (e) {
          console.warn('IP location detection notice:', e);
        }
      },

      requestLiveLocation: async (autoSwitchLang: boolean = true) => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
          set({ gpsStatus: 'unsupported' });
          return { success: false, error: 'Geolocation is not supported by your browser.' };
        }

        set({ gpsStatus: 'requesting' });

        return new Promise<{ success: boolean; region?: RegionLocation; error?: string }>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              let detectedCity = '';
              let detectedState = '';
              let detectedCountry = 'India';

              // Perform client reverse geocoding via public BigDataCloud client API
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);

                const res = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
                  { signal: controller.signal }
                );
                clearTimeout(timeoutId);

                if (res.ok) {
                  const data = await res.json();
                  detectedCity = data.locality || data.city || '';
                  detectedState = data.principalSubdivision || '';
                  detectedCountry = data.countryName || 'India';
                }
              } catch (e) {
                console.warn('Reverse geocode error:', e);
              }

              // Fallback to OpenStreetMap Nominatim if needed
              if (!detectedState) {
                try {
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 4000);
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                    { signal: controller.signal }
                  );
                  clearTimeout(timeoutId);
                  if (res.ok) {
                    const data = await res.json();
                    detectedCity = data.address?.city || data.address?.town || data.address?.district || '';
                    detectedState = data.address?.state || '';
                  }
                } catch {}
              }

              const matchedRegion = findClosestRegion(latitude, longitude, detectedState || detectedCity);

              const locationInfo: LiveLocationInfo = {
                city: detectedCity || matchedRegion.city,
                state: detectedState || matchedRegion.state,
                country: detectedCountry,
                isRealGPS: true,
                latitude,
                longitude,
              };

              set({
                gpsStatus: 'granted',
                liveLocationInfo: locationInfo,
                detectedRegion: matchedRegion,
                ...(autoSwitchLang ? { currentLanguage: matchedRegion.suggestedLang } : {}),
                hasBannerDismissed: false,
              });

              resolve({ success: true, region: matchedRegion });
            },
            (err) => {
              const isDenied = err.code === err.PERMISSION_DENIED;
              set({ gpsStatus: isDenied ? 'denied' : 'idle' });
              resolve({ 
                success: false, 
                error: isDenied ? 'Location access was declined by the user.' : err.message 
              });
            },
            {
              enableHighAccuracy: true,
              timeout: 12000,
              maximumAge: 0,
            }
          );
        });
      },

      dismissBanner: () => set({ hasBannerDismissed: true }),
      openCatalogModal: () => set({ isCatalogModalOpen: true }),
      closeCatalogModal: () => set({ isCatalogModalOpen: false }),
      openLocationModal: () => set({ isLocationModalOpen: true }),
      closeLocationModal: () => set({ isLocationModalOpen: false }),

      t: (key: string): string => {
        const { currentLanguage } = get();
        const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
        return langDict[key] || TRANSLATIONS.en[key] || key;
      },
    }),
    {
      name: 'agrove-language-settings-v1',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        hasBannerDismissed: state.hasBannerDismissed,
        liveLocationInfo: state.liveLocationInfo,
        gpsStatus: state.gpsStatus
      }),
    }
  )
);

