import fs from 'fs/promises';
import path from 'path';
import { ImageStoragePort } from '../domain/ports/image-storage.port';

export class FileSystemImageStorageAdapter implements ImageStoragePort {
  private readonly uploadDir: string;

  constructor(uploadDir: string = 'uploads') {
    this.uploadDir = uploadDir;
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    
    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.writeFile(filepath, file.buffer);
    
    return filename;
  }

  async getImage(filename: string): Promise<Buffer> {
    const filepath = path.join(this.uploadDir, filename);
    try {
      return await fs.readFile(filepath);
    } catch (error) {
      throw new Error(`Image not found: ${filename}`);
    }
  }

  async deleteImage(filename: string): Promise<void> {
    const filepath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      throw new Error(`Failed to delete image: ${filename}`);
    }
  }

  async listImages(): Promise<string[]> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      const files = await fs.readdir(this.uploadDir);
      return files;
    } catch (error) {
      throw new Error('Failed to list images');
    }
  }
} 