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

## Desenvolvimento e Testes

### Testes de Integração com Sandbox

Este projeto inclui testes de integração que fazem chamadas reais à API sandbox da Nuvem Fiscal.

#### Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e adicione suas credenciais de sandbox:
   ```env
   NUVEM_FISCAL_CLIENT_ID=seu_client_id_sandbox
   NUVEM_FISCAL_CLIENT_SECRET=seu_client_secret_sandbox
   ```

3. Execute os testes de integração:
   ```bash
   pnpm test src/integration.test.ts
   ```

#### O que os testes fazem

Os testes de integração (`src/integration.test.ts`) executam:

- **Listar Empresas**: Busca empresas cadastradas no ambiente sandbox
- **Consultar Empresa**: Obtém detalhes de uma empresa específica
- **Criar NFCe**: Emite uma nota fiscal de consumidor eletrônica de teste
- **Listar NFCe**: Lista notas fiscais emitidas
- **Download de XML**: Baixa o XML de uma NFCe autorizada (se disponível)

> **Nota**: Os testes fazem chamadas reais à API e podem levar alguns segundos para executar. Certifique-se de ter pelo menos uma empresa cadastrada no ambiente sandbox antes de executar o teste de criação de NFCe.

### Executar Todos os Testes

```bash
# Testes unitários e de integração
pnpm test

# Apenas testes unitários (mocks)
pnpm test src/client.test.ts
```

## Licença

MIT
