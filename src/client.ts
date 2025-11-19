import 'dotenv/config';
import { NuvemFiscalConfig, Token, NuvemFiscalError } from './types';
import { EmpresaResource } from './resources/empresa';
import { NfceResource } from './resources/nfce';

/**
 * Cliente principal para interação com a API da Nuvem Fiscal.
 * Gerencia autenticação e acesso aos recursos (Empresa, NFCe, etc).
 */
export class NuvemFiscal {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private timeout: number;
  private token: Token | null = null;

  public empresa: EmpresaResource;
  public nfce: NfceResource;

  /**
   * Inicializa o cliente da SDK.
   * @param config Configurações opcionais (clientId, clientSecret, baseUrl). 
   *               Se não fornecido, tentará ler das variáveis de ambiente NUVEM_FISCAL_*.
   */
  constructor(config?: NuvemFiscalConfig) {
    this.clientId = config?.clientId || process.env.NUVEM_FISCAL_CLIENT_ID || '';
    this.clientSecret = config?.clientSecret || process.env.NUVEM_FISCAL_CLIENT_SECRET || '';
    this.baseUrl = config?.baseUrl || process.env.NUVEM_FISCAL_BASE_URL || 'https://api.nuvemfiscal.com.br';
    this.timeout = config?.timeout || 30000;

    if (!this.clientId || !this.clientSecret) {
      console.warn('NuvemFiscal: Client ID or Secret not provided. API calls requiring auth will fail.');
    }

    this.empresa = new EmpresaResource(this);
    this.nfce = new NfceResource(this);
  }

  private async authenticate(): Promise<void> {
    if (this.token && this.token.expires_at && Date.now() < this.token.expires_at) {
      return;
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('scope', 'empresa nfce'); // Default scopes, can be expanded

    try {
      const response = await fetch('https://auth.nuvemfiscal.com.br/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!response.ok) {
        const error = await response.json() as NuvemFiscalError;
        throw new Error(`Authentication failed: ${error.error_description || error.error || response.statusText}`);
      }

      const data = await response.json() as Token;
      this.token = {
        ...data,
        expires_at: Date.now() + (data.expires_in * 1000) - 60000, // Expire 1 minute early for safety
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await this.authenticate();

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token?.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorData = await response.json() as any;
            errorMessage = errorData.message || errorData.error_description || JSON.stringify(errorData);
        } catch (e) {
            // Ignore JSON parse error if response is not JSON
        }
        throw new Error(`API Error ${response.status}: ${errorMessage}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }
}
