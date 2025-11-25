import { NuvemFiscal } from '../client';
import { CertificadoInfo } from '../types';
import { CertificadoInfoSchema } from '../schemas';

/**
 * Resource for managing digital certificates for empresas.
 * Certificates are required for emitting fiscal documents like NFCe.
 */
export class CertificadoResource {
  constructor(private client: NuvemFiscal) {}

  /**
   * Uploads or updates a digital certificate for an empresa.
   * 
   * **Important**: The certificate must be base64-encoded before passing to this method.
   * The certificate file should be a valid .pfx or .p12 file, and its CNPJ must match
   * the empresa's CNPJ.
   * 
   * @param cpfCnpj - CPF or CNPJ of the empresa (without masks).
   * @param certificado - Digital certificate file (.pfx or .p12) encoded as a base64 string.
   * @param senha - Certificate password.
   * @returns Certificate information including validity and expiration.
   * 
   * @throws Error if the certificate CNPJ doesn't match the empresa CNPJ
   * @throws Error if the password is incorrect
   * @throws Error if the certificate file is invalid or corrupted
   * 
   * @example
   * ```typescript
   * import { readFileSync } from 'fs';
   * 
   * // Read the certificate file and encode it to base64
   * const certBuffer = readFileSync('./certificate.pfx');
   * const certBase64 = certBuffer.toString('base64');
   * 
   * // Upload the certificate
   * const result = await client.certificado.upload(
   *   '12345678000190',
   *   certBase64,
   *   'certificate_password'
   * );
   * 
   * console.log('Certificate valid:', result.certificado_valido);
   * console.log('Expires on:', result.certificado_vencimento);
   * ```
   */
  async upload(cpfCnpj: string, certificado: string, senha: string): Promise<CertificadoInfo> {
    try {
      const response = await this.client.request<CertificadoInfo>(`/empresas/${cpfCnpj}/certificado`, {
        method: 'PUT',
        body: JSON.stringify({
          certificado: certificado,
          password: senha,
        }),
      });
      
      return CertificadoInfoSchema.parse(response);
    } catch (error) {
      // Provide more user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('certificado possui um CPF/CNPJ diferente')) {
          throw new Error(
            `Certificate validation failed: The certificate's CNPJ does not match the company's CNPJ (${cpfCnpj}). ` +
            `Please ensure you're using a certificate issued for this specific company.`
          );
        }
        if (error.message.includes('senha') || error.message.includes('password')) {
          throw new Error(
            `Certificate upload failed: Invalid password. Please verify the certificate password and try again.`
          );
        }
        if (error.message.includes('certificado inválido') || error.message.includes('invalid certificate')) {
          throw new Error(
            `Certificate upload failed: The certificate file is invalid or corrupted. ` +
            `Please ensure you're uploading a valid .pfx or .p12 certificate file.`
          );
        }
      }
      // Re-throw the original error if we don't have a specific message for it
      throw error;
    }
  }

  /**
   * Gets certificate information for an empresa.
   * @param cpfCnpj CPF or CNPJ of the empresa (without masks).
   * @returns Certificate information including validity and expiration.
   */
  async get(cpfCnpj: string): Promise<CertificadoInfo> {
    const response = await this.client.request<CertificadoInfo>(`/empresas/${cpfCnpj}/certificado`);
    return CertificadoInfoSchema.parse(response);
  }

  /**
   * Deletes the digital certificate for an empresa.
   * @param cpfCnpj CPF or CNPJ of the empresa (without masks).
   */
  async delete(cpfCnpj: string): Promise<void> {
    return this.client.request<void>(`/empresas/${cpfCnpj}/certificado`, {
      method: 'DELETE',
    });
  }
}
