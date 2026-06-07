import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. MODIFIKASI: Memastikan folder 'uploads/' otomatis dibuat di root project jika belum ada
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. MODIFIKASI: Konvensi Penamaan File Baru (Naming Convention)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // FORMAT BARU: foundly_img_[timestamp]_[angka_random][ekstensi_asli]
    // Contoh hasil: foundly_img_1717752123_4829.png
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E4);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `foundly_img_${uniqueSuffix}${ext}`);
  }
});

// 3. MODIFIKASI: Pengamanan Super Ketat (Security Upload Validation)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Hanya izinkan format gambar standar demi keamanan server kampus
  const allowedExtensions = /jpeg|jpg|png/;
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const extCheck = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimeCheck = allowedMimeTypes.includes(file.mimetype);

  if (extCheck && mimeCheck) {
    return cb(null, true); // Lolos verifikasi, file aman untuk disimpan
  } else {
    // Tolak file jika mencoba memalsukan ekstensi (Mencegah serangan Remote Code Execution)
    return cb(new Error('Akses ditolak! Format file tidak didukung. Hanya boleh mengunggah gambar (JPG, JPEG, PNG).') as any, false);
  }
};

// 4. MODIFIKASI: Batasi ukuran file maksimal 2MB untuk menghemat ruang penyimpanan server
export const uploadFoto = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 Megabytes
  }
});