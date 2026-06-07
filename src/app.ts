import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());

// Mapping Route Utama
app.use('/api/v1/auth', authRoutes);

// Jalankan Server jika tidak dalam mode testing
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Foundly Server Ready]: Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

export default app;
//end

//2
// Tambahkan import di bagian atas src/app.ts
import userRoutes from './routes/user.routes.js';

// Daftarkan di bawah rute auth yang kemarin
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes); // <--- Tambahkan baris ini
//end


//file gerbang utama
import itemRoutes from './routes/item.routes.js'; // <--- Tambah import ini di bagian atas

// Daftarkan di bawah rute user kemarin
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/items', itemRoutes); // <--- Tambah baris ini

// Sediakan akses folder statis agar foto yang diupload bisa diakses langsung via browser
app.use('/uploads', express.static('uploads'));
//end

//4
import foundItemRoutes from './routes/foundItem.routes.js'; // <--- Tambah import ini di atas

// Daftarkan di bawah rute item hilang (lost) kemarin
app.use('/api/v1/items', itemRoutes); 
app.use('/api/v1/items-found', foundItemRoutes); // <--- Tambah baris ini



//routing ML
import matchingRoutes from './routes/matching.routes.js'; // <--- Import di atas

// Daftarkan di bawah rute found item kemarin
app.use('/api/v1/items-found', foundItemRoutes);
app.use('/api/v1/matching', matchingRoutes); // <--- Tambah baris ini
//end

//rute admin
import adminRoutes from './routes/admin.routes.js'; // <--- Impor rute admin baru di atas

// Letakkan di bawah rute matching kemarin
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/admin', adminRoutes); // <--- Tambah baris ini
//end

//rute ker server utama
import notificationRoutes from './routes/notification.routes.js'; // <--- Import di bagian atas

// Daftarkan di bawah rute admin kemarin
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes); // <--- Tambah baris ini
//end

//claim management
import claimRoutes from './routes/claim.routes.js'; // <--- Import di paling atas file app.ts

// Daftarkan di bawah rute notifikasi kemarin
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/claims', claimRoutes); // <--- Tambah baris ini
//end


//file storage
import path from 'path'; // <--- Pastikan path sudah di-import

app.use(cors());
app.use(express.json());

// EXPOSE STATIC STORAGE: Mengizinkan akses publik ke file foto terunggah secara aman
// Akses via browser: http://localhost:5000/uploads/foundly_img_xxx.png
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
//end