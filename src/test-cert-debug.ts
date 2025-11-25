import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';
import { NuvemFiscal } from './client';
import { readFileSync } from 'fs';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function testCertificateRaw() {
  const client = new NuvemFiscal({ environment: 'homologacao' });
  
  try {
    console.log('Fetching empresas...');
    const empresaList = await client.empresa.list({ top: 1 });
    
    if (empresaList.data.length === 0) {
      throw new Error('No empresas found');
    }
    
    const empresa = empresaList.data[0];
    const cpfCnpj = empresa.cpf_cnpj;
    console.log(`Using empresa: ${cpfCnpj}`);
    
    // Read certificate and encode to Base64
    const certificadoPath = resolve(__dirname, '../digital_certificate/590c2503255ebeb6.pfx');
    const certificadoBuffer = readFileSync(certificadoPath);
    const certificadoBase64 = certificadoBuffer.toString('base64');
    
    console.log('\nTrying upload with different payload structures...\n');
    
    // Try structure 1: certificado + senha
    try {
      console.log('Attempt 1: { certificado, senha }');
      const response1 = await client.request(`/empresas/${cpfCnpj}/certificado`, {
        method: 'PUT',
        body: JSON.stringify({
          certificado: certificadoBase64,
          senha: 'Thejon@0923',
        }),
      });
      console.log('✓ Success with structure 1!');
      console.log(JSON.stringify(response1, null, 2));
    } catch (e1) {
      console.log('✗ Failed:', e1 instanceof Error ? e1.message : String(e1));
    }
    
    // Try structure 2: arquivo + senha
    try {
      console.log('\nAttempt 2: { arquivo, senha }');
      const response2 = await client.request(`/empresas/${cpfCnpj}/certificado`, {
        method: 'PUT',
        body: JSON.stringify({
          arquivo: certificadoBase64,
          senha: 'Thejon@0923',
        }),
      });
      console.log('✓ Success with structure 2!');
      console.log(JSON.stringify(response2, null, 2));
    } catch (e2) {
      console.log('✗ Failed:', e2 instanceof Error ? e2.message : String(e2));
    }
    
    // Try structure 3: just senha
    try {
      console.log('\nAttempt 3: { senha } only');
      const response3 = await client.request(`/empresas/${cpfCnpj}/certificado`, {
        method: 'PUT',
        body: JSON.stringify({
          senha: 'Thejon@0923',
        }),
      });
      console.log('✓ Success with structure 3!');
      console.log(JSON.stringify(response3, null, 2));
    } catch (e3) {
      console.log('✗ Failed:', e3 instanceof Error ? e3.message : String(e3));
    }
    
  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  }
}

testCertificateRaw();
