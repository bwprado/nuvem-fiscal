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
  environment?: 'homologacao' | 'producao';
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

export interface CertificadoUpload {
  certificado: string; // Base64 encoded certificate
  senha: string; // Certificate password
}

export interface CertificadoInfo {
  cpf_cnpj: string;
  certificado_valido: boolean;
  certificado_vencimento?: string;
  certificado_cnpj?: string;
  created_at?: string;
  updated_at?: string;
}
