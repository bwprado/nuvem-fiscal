import { config } from 'dotenv';
config({ path: '.env.local' });
import { NuvemFiscal } from '../src';

async function main() {
  // Initialize client (loads from ENV by default)
  const client = new NuvemFiscal();

  console.log('Authenticating and listing companies...');

  try {
    // Example: List companies
    const empresas = await client.empresa.list({ top: 5 });
    console.log(`Found ${empresas.count} companies.`);
    console.log(empresas.data);

    // Example: Create a company (commented out to avoid accidental creation)
    /*
    const newEmpresa = await client.empresa.create({
      cpf_cnpj: '12345678901234',
      nome_razao_social: 'Empresa Teste SDK',
      endereco: {
        logradouro: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        codigo_municipio: '3550308',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01001000'
      }
    });
    console.log('Created company:', newEmpresa);
    */

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
