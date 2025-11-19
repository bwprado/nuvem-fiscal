import { describe, it, expect, vi } from 'vitest';
import { NuvemFiscal } from './client';

describe('NuvemFiscal Client', () => {
  it('should initialize with config', () => {
    const client = new NuvemFiscal({
      clientId: 'test-id',
      clientSecret: 'test-secret',
    });
    expect(client).toBeDefined();
  });

  it('should initialize with env vars (mocked)', () => {
    vi.stubEnv('NUVEM_FISCAL_CLIENT_ID', 'env-id');
    vi.stubEnv('NUVEM_FISCAL_CLIENT_SECRET', 'env-secret');
    
    const client = new NuvemFiscal();
    expect(client).toBeDefined();
    
    vi.unstubAllEnvs();
  });

  it('should have resources initialized', () => {
    const client = new NuvemFiscal({ clientId: 'id', clientSecret: 'secret' });
    expect(client.empresa).toBeDefined();
    expect(client.nfce).toBeDefined();
  });
});
