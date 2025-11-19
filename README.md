# Nuvem Fiscal SDK (TypeScript)

SDK não-oficial para integração com a API da [Nuvem Fiscal](https://nuvemfiscal.com.br/).
Desenvolvido em TypeScript, com validação de dados via Zod e suporte a Promises.

## Funcionalidades

- **Empresas**: CRUD completo (Criar, Listar, Consultar, Atualizar, Excluir).
- **NFC-e**: Emissão, Consulta, Cancelamento, Listagem, Download de XML e PDF.
- **Autenticação**: Gerenciamento automático de tokens OAuth2 (Client Credentials).
- **Tipagem Forte**: Interfaces TypeScript e validação em tempo de execução com Zod.

## Instalação

```bash
npm install nuvem-fiscal-sdk
# ou
pnpm add nuvem-fiscal-sdk
# ou
yarn add nuvem-fiscal-sdk
```

## Configuração

Você pode configurar o cliente passando as credenciais no construtor ou usando variáveis de ambiente.

### Variáveis de Ambiente (Recomendado)

Crie um arquivo `.env` na raiz do seu projeto:

```env
NUVEM_FISCAL_CLIENT_ID=seu_client_id
NUVEM_FISCAL_CLIENT_SECRET=seu_client_secret
```

### Uso Básico

```typescript
import { NuvemFiscal } from 'nuvem-fiscal-sdk';

const client = new NuvemFiscal();

// Listar empresas
const empresas = await client.empresa.list({ top: 10 });
console.log(empresas.data);

// Emitir NFC-e
const nfce = await client.nfce.emitir({
  ambiente: 'homologacao',
  infNFe: {
    // ... dados da nota
  }
});
```

## Documentação

A documentação completa dos métodos está disponível via JSDoc (autocomplete no VS Code).
Para detalhes da API, consulte a [Documentação Oficial da Nuvem Fiscal](https://dev.nuvemfiscal.com.br/docs/api/).

## Licença

MIT
