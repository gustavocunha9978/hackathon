import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

class UploadService {
  /**
   * Move um arquivo enviado para a pasta de uploads
   * @param file Arquivo enviado (multer)
   * @param subDirectory Subdiretório dentro da pasta uploads (opcional)
   * @returns Caminho do arquivo salvo
   */
  async saveFile(file: Express.Multer.File, subDirectory?: string): Promise<string> {
    try {
      // Diretório base de uploads
      const uploadDir = path.join(__dirname, '../../', config.uploadDir);
      
      // Se houver subdiretório, cria a pasta se não existir
      let targetDir = uploadDir;
      if (subDirectory) {
        targetDir = path.join(uploadDir, subDirectory);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
      }
      
      // Gera um nome único para o arquivo
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      
      // Caminho completo do arquivo
      const filePath = path.join(targetDir, fileName);
      
      // Move o arquivo para o diretório de destino
      fs.writeFileSync(filePath, file.buffer);
      
      // Retorna o caminho relativo do arquivo (para salvar no banco de dados)
      const relativePath = subDirectory
        ? `/uploads/${subDirectory}/${fileName}`
        : `/uploads/${fileName}`;
        
      return relativePath;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao salvar arquivo: ${error.message}`);
      }
      throw new Error('Erro ao salvar arquivo');
    }
  }

  /**
   * Remove um arquivo do sistema de arquivos
   * @param filePath Caminho relativo do arquivo (a partir da pasta uploads)
   * @returns Verdadeiro se o arquivo foi removido com sucesso
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      // Remove o prefixo '/uploads/' do caminho
      const relativePath = filePath.startsWith('/uploads/')
        ? filePath.substring(9) // Remove '/uploads/'
        : filePath;
      
      // Caminho completo do arquivo
      const fullPath = path.join(__dirname, '../../', config.uploadDir, relativePath);
      
      // Verifica se o arquivo existe
      if (fs.existsSync(fullPath)) {
        // Remove o arquivo
        fs.unlinkSync(fullPath);
        return true;
      }
      
      return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao excluir arquivo: ${error.message}`);
      }
      throw new Error('Erro ao excluir arquivo');
    }
  }

  /**
   * Verifica se um arquivo existe
   * @param filePath Caminho relativo do arquivo (a partir da pasta uploads)
   * @returns Verdadeiro se o arquivo existe
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      // Remove o prefixo '/uploads/' do caminho
      const relativePath = filePath.startsWith('/uploads/')
        ? filePath.substring(9) // Remove '/uploads/'
        : filePath;
      
      // Caminho completo do arquivo
      const fullPath = path.join(__dirname, '../../', config.uploadDir, relativePath);
      
      // Verifica se o arquivo existe
      return fs.existsSync(fullPath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém informações sobre um arquivo
   * @param filePath Caminho relativo do arquivo (a partir da pasta uploads)
   * @returns Informações sobre o arquivo (tamanho, data de modificação, etc.)
   */
  async getFileInfo(filePath: string): Promise<fs.Stats | null> {
    try {
      // Remove o prefixo '/uploads/' do caminho
      const relativePath = filePath.startsWith('/uploads/')
        ? filePath.substring(9) // Remove '/uploads/'
        : filePath;
      
      // Caminho completo do arquivo
      const fullPath = path.join(__dirname, '../../', config.uploadDir, relativePath);
      
      // Verifica se o arquivo existe
      if (fs.existsSync(fullPath)) {
        // Obtém informações sobre o arquivo
        return fs.statSync(fullPath);
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new UploadService();