import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';
import { NuvemFiscal } from './client';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function testNFCe() {
  const client = new NuvemFiscal({ environment: 'homologacao' });
  
  try {
    console.log('Fetching empresas...');
    const empresaList = await client.empresa.list({ top: 1 });
    
    if (empresaList.data.length === 0) {
      throw new Error('No empresas found');
    }
    
    const empresa = empresaList.data[0];
    console.log('Using empresa:', JSON.stringify(empresa, null, 2));
    
    console.log('\nAttempting to create NFCe...');
    const nfce = await client.nfce.emitir({
      ambiente: 'homologacao',
      referencia: `test-${Date.now()}`,
      infNFe: {
        versao: '4.00', // NFCe version
        ide: {
          cUF: 35,
          natOp: 'VENDA',
          mod: 65,
          serie: 1,
          nNF: Math.floor(Math.random() * 999999) + 1,
          dhEmi: new Date().toISOString(),
          tpNF: 1,
          idDest: 1,
          cMunFG: 3550308,
          tpImp: 4,
          tpEmis: 1,
          tpAmb: 2,
          finNFe: 1,
          indFinal: 1,
          indPres: 1,
          procEmi: 0,
          verProc: '1.0.0',
        },
        emit: {
          CNPJ: empresa.cpf_cnpj,
          xNome: empresa.nome_razao_social || 'Empresa Teste',
          xFant: empresa.nome_fantasia || 'Teste',
          enderEmit: empresa.endereco ? {
            xLgr: empresa.endereco.logradouro,
            nro: empresa.endereco.numero,
            xBairro: empresa.endereco.bairro,
            cMun: parseInt(empresa.endereco.codigo_municipio),
            xMun: empresa.endereco.cidade,
            UF: empresa.endereco.uf,
            CEP: empresa.endereco.cep,
            cPais: 1058,
            xPais: 'Brasil',
          } : {
            xLgr: 'Rua Teste',
            nro: '123',
            xBairro: 'Centro',
            cMun: 3550308,
            xMun: 'São Paulo',
            UF: 'SP',
            CEP: '01000000',
            cPais: 1058,
            xPais: 'Brasil',
          },
          IE: empresa.inscricao_estadual || 'ISENTO',
          CRT: 1,
        },
        dest: {
          indIEDest: 9,
        },
        det: [
          {
            nItem: 1,
            prod: {
              cProd: 'PROD001',
              cEAN: 'SEM GTIN',
              xProd: 'Produto Teste NFCe',
              NCM: '84714900',
              CFOP: 5102,
              uCom: 'UN',
              qCom: 1.00,
              vUnCom: 10.00,
              vProd: 10.00,
              cEANTrib: 'SEM GTIN',
              uTrib: 'UN',
              qTrib: 1.00,
              vUnTrib: 10.00,
              indTot: 1,
            },
            imposto: {
              ICMS: {
                ICMSSN102: {
                  orig: 0,
                  CSOSN: 102,
                },
              },
              PIS: {
                PISNT: {
                  CST: '07',
                },
              },
              COFINS: {
                COFINSNT: {
                  CST: '07',
                },
              },
            },
          },
        ],
        total: {
          ICMSTot: {
            vBC: 0.00,
            vICMS: 0.00,
            vICMSDeson: 0.00,
            vFCP: 0.00,
            vBCST: 0.00,
            vST: 0.00,
            vFCPST: 0.00,
            vFCPSTRet: 0.00,
            vProd: 10.00,
            vFrete: 0.00,
            vSeg: 0.00,
            vDesc: 0.00,
            vII: 0.00,
            vIPI: 0.00,
            vIPIDevol: 0.00,
            vPIS: 0.00,
            vCOFINS: 0.00,
            vOutro: 0.00,
            vNF: 10.00,
          },
        },
        transp: {
          modFrete: 9, // 9 = Sem frete
        },
        pag: {
          detPag: [
            {
              tPag: '01',
              vPag: 10.00,
            },
          ],
        },
      },
    });
    
    console.log('\nNFCe created successfully!');
    console.log(JSON.stringify(nfce, null, 2));
  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error(error);
    if (error instanceof Error) {
      console.error('\nError message:', error.message);
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

testNFCe();
