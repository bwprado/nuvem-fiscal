import { z } from 'zod';
import { 
  EmpresaSchema, 
  NfceSchema, 
  PedidoEmissaoNfceSchema,
  EmpresaListResponseSchema,
  NfceListResponseSchema
} from './schemas';

export interface NuvemFiscalConfig {
  clientId?: string;
  clientSecret?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  expires_at?: number;
}

export interface NuvemFiscalError {
  error: string;
  error_description?: string;
  message?: string;
}

export type Empresa = z.infer<typeof EmpresaSchema>;
export type Nfce = z.infer<typeof NfceSchema>;
export type PedidoEmissaoNfce = z.infer<typeof PedidoEmissaoNfceSchema>;
export type EmpresaListResponse = z.infer<typeof EmpresaListResponseSchema>;
export type NfceListResponse = z.infer<typeof NfceListResponseSchema>;
