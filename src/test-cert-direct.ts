import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';
import { NuvemFiscal } from './client';
import { readFileSync } from 'fs';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function testCertificateDirect() {
  const client = new NuvemFiscal({ environment: 'homologacao' });
  
  try {
    const empresaList = await client.empresa.list({ top: 1 });
    const cpfCnpj = empresaList.data[0].cpf_cnpj;
    
    const certificadoPath = resolve(__dirname, '../digital_certificate/590c2503255ebeb6.pfx');
    const certificadoBuffer = readFileSync(certificadoPath);
    const certificadoBase64 = certificadoBuffer.toString('base64');
    
    // Try sending just the Base64 string directly as the body
    console.log('Testing: sending Base64 string directly');
    try {
      const response1 = await client.request(`/empresas/${cpfCnpj}/certificado?senha=Thejon@0923`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: certificadoBase64,
      });
      console.log('✓ Success with query param + plain text!');
      console.log(JSON.stringify(response1, null, 2));
      return;
    } catch (e) {
      console.log('✗ Failed:', e instanceof Error ? e.message.substring(0, 100) : String(e));
    }
    
    // Try with form data structure
    console.log('\nTesting: form-like structure');
    try {
      const response2 = await client.request(`/empresas/${cpfCnpj}/certificado`, {
        method: 'PUT',
        body: JSON.stringify({
          certificado_arquivo: certificadoBase64,
          certificado_senha: 'Thejon@0923',
        }),
      });
      console.log('✓ Success with certificado_arquivo!');
      console.log(JSON.stringify(response2, null, 2));
      return;
    } catch (e) {
      console.log('✗ Failed:', e instanceof Error ? e.message.substring(0, 100) : String(e));
    }
    
    console.log('\nAll attempts failed. The API might require a different approach.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testCertificateDirect();
