import { NuvemFiscal } from '../client';
import { Empresa, EmpresaListResponse } from '../types';
import { EmpresaSchema, EmpresaListResponseSchema } from '../schemas';

export class EmpresaResource {
  constructor(private client: NuvemFiscal) {}

  /**
   * Cria uma nova empresa na Nuvem Fiscal.
   * @param data Dados da empresa a ser criada.
   * @returns A empresa criada.
   */
  async create(data: Empresa): Promise<Empresa> {
    const validatedData = EmpresaSchema.parse(data);
    const response = await this.client.request<Empresa>('/empresas', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
    return EmpresaSchema.parse(response);
  }

  /**
   * Lista empresas cadastradas.
   * @param params Parâmetros de paginação e filtro ($top, $skip, q).
   * @returns Lista de empresas e contagem total.
   */
  async list(params?: { top?: number; skip?: number; q?: string }): Promise<EmpresaListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.top) searchParams.append('$top', params.top.toString());
    if (params?.skip) searchParams.append('$skip', params.skip.toString());
    if (params?.q) searchParams.append('q', params.q);

    const response = await this.client.request<EmpresaListResponse>(`/empresas?${searchParams.toString()}`);
    return EmpresaListResponseSchema.parse(response);
  }

  /**
   * Obtém os detalhes de uma empresa pelo CPF ou CNPJ.
   * @param cpfCnpj CPF ou CNPJ da empresa (apenas números).
   * @returns Dados da empresa.
   */
  async get(cpfCnpj: string): Promise<Empresa> {
    const response = await this.client.request<Empresa>(`/empresas/${cpfCnpj}`);
    return EmpresaSchema.parse(response);
  }

  /**
   * Atualiza os dados de uma empresa existente.
   * @param cpfCnpj CPF ou CNPJ da empresa a ser atualizada.
   * @param data Dados a serem atualizados (parcial).
   * @returns A empresa atualizada.
   */
  async update(cpfCnpj: string, data: Partial<Empresa>): Promise<Empresa> {
    const validatedData = EmpresaSchema.partial().parse(data);
    const response = await this.client.request<Empresa>(`/empresas/${cpfCnpj}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData),
    });
    return EmpresaSchema.parse(response);
  }

  /**
   * Remove uma empresa.
   * @param cpfCnpj CPF ou CNPJ da empresa a ser removida.
   */
  async delete(cpfCnpj: string): Promise<void> {
    return this.client.request<void>(`/empresas/${cpfCnpj}`, {
      method: 'DELETE',
    });
  }
}
