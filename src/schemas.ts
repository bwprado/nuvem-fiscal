import { z } from 'zod';

export const EnderecoSchema = z.object({
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string().optional(),
  bairro: z.string(),
  codigo_municipio: z.string(),
  cidade: z.string(),
  uf: z.string(),
  cep: z.string(),
  pais: z.string().optional(),
});

export const EmpresaSchema = z.object({
  cpf_cnpj: z.string(),
  nome_razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  endereco: EnderecoSchema.optional(),
}).passthrough(); // Allow other properties

export const PedidoEmissaoNfceSchema = z.object({
  ambiente: z.enum(['homologacao', 'producao']),
  referencia: z.string().optional(),
  infNFe: z.any(), // Complex object, keeping as any for now
}).passthrough();

export const NfceSchema = z.object({
  id: z.string(),
  ambiente: z.enum(['homologacao', 'producao']),
  status: z.string(),
  data_emissao: z.string(),
  chave: z.string().optional(),
  link_xml: z.string().optional(),
  link_pdf: z.string().optional(),
}).passthrough();

export const NfceListResponseSchema = z.object({
  data: z.array(NfceSchema),
  count: z.number().optional(),
});

export const EmpresaListResponseSchema = z.object({
  data: z.array(EmpresaSchema),
  count: z.number().optional(),
});

export const CertificadoUploadSchema = z.object({
  certificado: z.string(), // Base64 string
  senha: z.string(),
});

export const CertificadoInfoSchema = z.object({
  cpf_cnpj: z.string(),
  certificado_valido: z.boolean(),
  certificado_vencimento: z.string().optional(),
  certificado_cnpj: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).passthrough();
