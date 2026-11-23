import dotenv from 'dotenv';

dotenv.config();

export class NeonAiService {
  private static readonly baseUrl = process.env.NEON_AI_GATEWAY_BASE_URL || '';
  private static readonly token = process.env.NEON_AI_GATEWAY_TOKEN || '';

  public static async listModels() {
    if (!this.baseUrl || !this.token) {
      throw new Error('Neon AI Gateway credentials not configured in environment.');
    }

    const res = await fetch(`${this.baseUrl}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Neon AI Gateway returned status ${res.status}: ${err}`);
    }

    return res.json();
  }

  public static async consultMachinery(prompt: string, model: string = 'gpt-4o-mini') {
    if (!this.baseUrl || !this.token) {
      throw new Error('Neon AI Gateway credentials not configured in environment.');
    }

    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert agronomy machinery and spare parts advisor for Arveer Impex and AGROVÉ (Agroveer & Sawking equipment lines). Give concise, technical, and accurate engineering recommendations for petrol engines, tillers, pumps, and harvesters.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Neon AI Gateway chat failed [Status ${res.status}]: ${err}`);
    }

    return res.json();
  }
}

