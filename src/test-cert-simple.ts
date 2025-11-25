import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';
import { NuvemFiscal } from './client';
import { readFileSync } from 'fs';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function testCertificateSimple() {
  const client = new NuvemFiscal({ environment: 'homologacao' });
  
  try {
    const empresaList = await client.empresa.list({ top: 1 });
    const cpfCnpj = empresaList.data[0].cpf_cnpj;
    
    const certificadoPath = resolve(__dirname, '../digital_certificate/590c2503255ebeb6.pfx');
    const certificadoBuffer = readFileSync(certificadoPath);
    const certificadoBase64 = certificadoBuffer.toString('base64');
    
    console.log('Testing: { arquivo, senha }');
    const response = await client.request(`/empresas/${cpfCnpj}/certificado`, {
      method: 'PUT',
      body: JSON.stringify({
        arquivo: certificadoBase64,
        senha: 'Thejon@0923',
      }),
    });
    
    console.log('✓ Success!');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

testCertificateSimple();
