import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { FileSystemImageStorageAdapter } from './adapters/file-system-image-storage.adapter';
import { ImageController } from './controllers/image.controller';

const app = express();

// ตั้งค่า CORS
app.use(cors({
  origin: '*', // อนุญาตทุกโดเมน (ในการใช้งานจริงควรระบุเฉพาะโดเมนที่อนุญาต)
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

const upload = multer({ storage: multer.memoryStorage() });
const imageStorage = new FileSystemImageStorageAdapter();
const imageController = new ImageController(imageStorage);

app.post('/images', upload.single('image'), (req, res) => imageController.uploadImage(req, res));
app.get('/images/:filename', (req, res) => imageController.getImage(req, res));
app.delete('/images/:filename', (req, res) => imageController.deleteImage(req, res));
app.get('/images', (req, res) => imageController.listImages(req, res));

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 