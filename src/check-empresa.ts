import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';
import { NuvemFiscal } from './client';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function checkEmpresa() {
  const client = new NuvemFiscal({ environment: 'homologacao' });
  
  try {
    console.log('Fetching empresas...');
    const empresaList = await client.empresa.list({ top: 1 });
    
    if (empresaList.data.length === 0) {
      throw new Error('No empresas found');
    }
    
    const empresa = empresaList.data[0];
    console.log('Empresa data:');
    console.log(JSON.stringify(empresa, null, 2));
    
    // Check if we need to map the address
    if (empresa.endereco) {
      console.log('\nAddress mapping needed:');
      console.log('logradouro ->', empresa.endereco.logradouro);
      console.log('numero ->', empresa.endereco.numero);
      console.log('bairro ->', empresa.endereco.bairro);
      console.log('codigo_municipio ->', empresa.endereco.codigo_municipio);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEmpresa();
