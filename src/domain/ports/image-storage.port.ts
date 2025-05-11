export interface ImageStoragePort {
  saveImage(file: Express.Multer.File): Promise<string>;
  getImage(filename: string): Promise<Buffer>;
  deleteImage(filename: string): Promise<void>;
  listImages(): Promise<string[]>;
} 