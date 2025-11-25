import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { NuvemFiscal } from './client';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function testCertificate() {
  const client = new NuvemFiscal({ environment: 'homologacao' });
  
  try {
    console.log('1. Fetching empresas...');
    const empresaList = await client.empresa.list({ top: 1 });
    
    if (empresaList.data.length === 0) {
      throw new Error('No empresas found');
    }
    
    const empresa = empresaList.data[0];
    const cpfCnpj = empresa.cpf_cnpj;
    console.log(`✓ Using empresa: ${cpfCnpj} - ${empresa.nome_razao_social}`);
    
    // Upload certificate
    console.log('\n2. Uploading digital certificate...');
    const certificadoPath = resolve(__dirname, '../digital_certificate/590c2503255ebeb6.pfx');
    const certificadoBuffer = readFileSync(certificadoPath);
    const certificado = certificadoBuffer.toString('base64');
    const senha = 'Thejon@0923';
    
    const uploadResult = await client.certificado.upload(cpfCnpj, certificado, senha);
    console.log('✓ Certificate uploaded successfully!');
    console.log('  - Valid:', uploadResult.certificado_valido);
    console.log('  - Expiration:', uploadResult.certificado_vencimento);
    console.log('  - CNPJ:', uploadResult.certificado_cnpj);
    
    // Get certificate info
    console.log('\n3. Getting certificate info...');
    const certInfo = await client.certificado.get(cpfCnpj);
    console.log('✓ Certificate info retrieved:');
    console.log('  - Valid:', certInfo.certificado_valido);
    console.log('  - Expiration:', certInfo.certificado_vencimento);
    console.log('  - CNPJ:', certInfo.certificado_cnpj);
    
    // Now try to emit NFCe with certificate
    console.log('\n4. Attempting to emit NFCe with certificate...');
    const nfceData = {
      ambiente: 'homologacao' as const,
      referencia: `test-with-cert-${Date.now()}`,
      infNFe: {
        versao: '4.00',
        ide: {
          cUF: 21, // Maranhão (based on empresa location)
          natOp: 'VENDA',
          mod: 65,
          serie: 1,
          nNF: Math.floor(Math.random() * 999999) + 1,
          dhEmi: new Date().toISOString(),
          tpNF: 1,
          idDest: 1,
          cMunFG: 2111300, // São Luís
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
            cMun: 2111300,
            xMun: 'São Luís',
            UF: 'MA',
            CEP: '65000000',
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
          modFrete: 9,
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
    };
    
    const nfce = await client.nfce.emitir(nfceData);
    console.log('✓ NFCe emitted successfully!');
    console.log('  - ID:', nfce.id);
    console.log('  - Status:', nfce.status);
    console.log('  - Chave:', nfce.chave);
    
    // Optionally delete certificate (commented out to keep it for future tests)
    // console.log('\n5. Deleting certificate...');
    // await client.certificado.delete(cpfCnpj);
    // console.log('✓ Certificate deleted successfully!');
    
    console.log('\n✅ All certificate operations completed successfully!');
  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error(error);
    if (error instanceof Error) {
      console.error('\nError message:', error.message);
    }
    process.exit(1);
  }
}

testCertificate();
