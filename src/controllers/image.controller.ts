import { Request, Response } from 'express';
import { ImageStoragePort } from '../domain/ports/image-storage.port';

export class ImageController {
  constructor(private readonly imageStorage: ImageStoragePort) {}

  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const filename = await this.imageStorage.saveImage(req.file);
      res.status(201).json({ filename });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }

  async getImage(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;
      const imageBuffer = await this.imageStorage.getImage(filename);
      res.set('Content-Type', 'image/jpeg');
      res.send(imageBuffer);
    } catch (error) {
      res.status(404).json({ error: 'Image not found' });
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;
      await this.imageStorage.deleteImage(filename);
      res.status(200).json({ message: `Image ${filename} deleted successfully` });
    } catch (error) {
      res.status(404).json({ error: 'Failed to delete image' });
    }
  }

  async listImages(req: Request, res: Response): Promise<void> {
    try {
      const images = await this.imageStorage.listImages();
      res.status(200).json({ images });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list images' });
    }
  }
} 