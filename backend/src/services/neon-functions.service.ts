import dotenv from 'dotenv';

dotenv.config();

export class NeonFunctionsService {
  private static readonly suffix = process.env.NEON_FUNCTION_HOST_SUFFIX || '.compute.c-2.ap-southeast-1.aws.neon.tech';
  private static readonly branchId = process.env.NEON_BRANCH_ID || 'br-shiny-rice-ao91h4gu';

  public static getFunctionUrl(functionName: string = 'hello'): string {
    return `https://${this.branchId}-${functionName}${this.suffix}/`;
  }

  public static async invokeFunction(functionName: string = 'hello', payload?: any) {
    const url = this.getFunctionUrl(functionName);
    const options: RequestInit = {
      method: payload ? 'POST' : 'GET',
      headers: payload ? { 'Content-Type': 'application/json' } : {},
      body: payload ? JSON.stringify(payload) : undefined,
    };

    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await res.json() : await res.text();

    return {
      status: res.status,
      ok: res.ok,
      data: body,
      url,
    };
  }
}

