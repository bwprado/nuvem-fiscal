import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NuvemFiscal } from '../client';
import { PedidoEmissaoNfce } from '../types';

describe('NfceResource', () => {
  let client: NuvemFiscal;

  beforeEach(() => {
    client = new NuvemFiscal({
      clientId: 'test-id',
      clientSecret: 'test-secret',
    });
  });

  it('should emitir NFCe successfully', async () => {
    const mockResponse = {
      id: 'nfce_test_123',
      ambiente: 'homologacao',
      status: 'autorizada',
      data_emissao: new Date().toISOString(),
      chave: '35231000000000000000650010000000011000000001',
      link_xml: 'https://api.nuvemfiscal.com.br/nfce/xml',
      link_pdf: 'https://api.nuvemfiscal.com.br/nfce/pdf',
    };

    // Spy on the client.request method to mock the API call
    const requestSpy = vi.spyOn(client, 'request').mockResolvedValue(mockResponse);

    const pedido: PedidoEmissaoNfce = {
      ambiente: 'homologacao',
      referencia: 'ref-123',
      infNFe: {
        ide: {
          nNF: '1',
          serie: '1',
        },
        emit: {
          CNPJ: '00000000000000',
        },
        dest: {
          CPF: '00000000000',
        },
        det: [],
        total: {},
        transp: {},
        pag: {},
      },
    };

    const result = await client.nfce.emitir(pedido);

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith('/nfce', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });

    expect(result).toEqual(mockResponse);
  });
});
