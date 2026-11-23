'use client';

import React from 'react';
import { MachineryInspectionScene, InspectableMachineType } from './MachineryInspectionScene';

export const ProductShowcaseScene = ({ 
  machineType = 'engine-170f',
  activeHotspot = null,
  onSelectHotspot = () => {}
}: { 
  machineType?: InspectableMachineType;
  activeHotspot?: string | null;
  onSelectHotspot?: (id: string) => void;
  isHovered?: boolean;
}) => {
  return (
    <MachineryInspectionScene 
      machineType={machineType}
      activeHotspot={activeHotspot}
      onSelectHotspot={onSelectHotspot}
    />
  );
};
