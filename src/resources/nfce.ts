import { NuvemFiscal } from '../client';
import { Nfce, PedidoEmissaoNfce, NfceListResponse } from '../types';
import { NfceSchema, PedidoEmissaoNfceSchema, NfceListResponseSchema } from '../schemas';

export class NfceResource {
  constructor(private client: NuvemFiscal) {}

  /**
   * Emite uma nova NFC-e.
   * @param data Dados do pedido de emissão.
   * @returns A NFC-e emitida (autorizada ou rejeitada).
   */
  async emitir(data: PedidoEmissaoNfce): Promise<Nfce> {
    const validatedData = PedidoEmissaoNfceSchema.parse(data);
    const response = await this.client.request<Nfce>('/nfce', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
    return NfceSchema.parse(response);
  }

  /**
   * Consulta uma NFC-e pelo ID.
   * @param id ID único da NFC-e.
   * @returns Dados da NFC-e.
   */
  async consultar(id: string): Promise<Nfce> {
    const response = await this.client.request<Nfce>(`/nfce/${id}`);
    return NfceSchema.parse(response);
  }

  /**
   * Cancela uma NFC-e autorizada.
   * @param id ID da NFC-e a ser cancelada.
   * @param justificativa Justificativa do cancelamento (mínimo 15 caracteres).
   * @returns Resultado do cancelamento.
   */
  async cancelar(id: string, justificativa: string): Promise<any> {
    // Justificativa validation could be added here if needed
    return this.client.request<any>(`/nfce/${id}/cancelamento`, {
      method: 'POST',
      body: JSON.stringify({ justificativa }),
    });
  }

  /**
   * Baixa o XML de uma NFC-e.
   * @param id ID da NFC-e.
   * @returns Conteúdo do XML (string).
   */
  async baixarXml(id: string): Promise<string> {
    return this.client.request<string>(`/nfce/${id}/xml`, { responseType: 'text' });
  }

  /**
   * Baixa o PDF (DANFE) de uma NFC-e.
   * @param id ID da NFC-e.
   * @returns Buffer do arquivo PDF.
   */
  async baixarPdf(id: string): Promise<ArrayBuffer> {
     return this.client.request<ArrayBuffer>(`/nfce/${id}/pdf`, { responseType: 'arraybuffer' });
  }
  
  /**
   * Lista notas fiscais (NFC-e).
   * @param params Parâmetros de filtro e paginação.
   * @returns Lista de notas.
   */
  async listar(params?: { top?: number; skip?: number; cpf_cnpj?: string }): Promise<NfceListResponse> {
      const searchParams = new URLSearchParams();
      if (params?.top) searchParams.append('$top', params.top.toString());
      if (params?.skip) searchParams.append('$skip', params.skip.toString());
      if (params?.cpf_cnpj) searchParams.append('cpf_cnpj', params.cpf_cnpj);
  
      const response = await this.client.request<NfceListResponse>(`/nfce?${searchParams.toString()}`);
      return NfceListResponseSchema.parse(response);
    }
}
