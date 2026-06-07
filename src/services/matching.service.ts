import prisma from '../config/database.js';
import axios from 'axios';

// Definisikan URL API Python ML Service dari Environment Variable
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/api/v1/predict';

// 1. Fungsi Utama: Memicu Pencocokan Otomatis ketika ada BARANG HILANG baru dimasukkan
export const triggerMatchingForLostItem = async (id_barang_hilang: number) => {
  try {
    // A. Ambil detail data barang hilang yang baru dibuat
    const lostItem = await prisma.barangHilang.findUnique({ where: { id_barang_hilang } });
    if (!lostItem) return;

    // B. Ambil semua barang temuan yang statusnya masih 'DISIMPAN' atau 'MENUNGGU' sebagai pembanding
    const availableFoundItems = await prisma.barangTemuan.findMany({
      where: {
        status: { in: ['DISIMPAN', 'MENUNGGU'] },
        kategori: lostItem.kategori // Optimasi awal: Hanya bandingkan yang kategorinya sama
      }
    });

    // C. Iterasi dan tembak ke Python ML Service untuk dihitung skor kemiripannya
    for (const foundItem of availableFoundItems) {
      try {
        // Mengirimkan data kontrak API ke Python ML Service
        const response = await axios.post(ML_SERVICE_URL, {
          lost_properties: {
            nama: lostItem.nama_barang,
            deskripsi: lostItem.deskripsi,
            foto: lostItem.foto_barang
          },
          found_properties: {
            nama: foundItem.nama_barang,
            deskripsi: foundItem.deskripsi,
            foto: foundItem.foto_barang
          }
        });

        const similarityScore = response.data.similarity_score; // Nilai integer (%) dari Python

        // Standardisasi Industri: Hanya simpan jika skor kemiripan cukup tinggi (misal >= 50%)
        if (similarityScore >= 50) {
          await prisma.pencocokan.create({
            data: {
              id_barang_hilang: lostItem.id_barang_hilang,
              id_temuan: foundItem.id_temuan,
              tingkat_kemiripan: similarityScore,
              status: false // Default false, menunggu verifikasi fisik dari Admin di Phase 10
            }
          });
        }
      } catch (mlError) {
        // Fail-safe: Jika satu request ke ML gagal, jangan gagalkan seluruh perulangan
        console.error(`[ML Integration Error] Gagal menghitung item temuan ID ${foundItem.id_temuan}:`, mlError);
      }
    }
  } catch (error) {
    console.error('[Matching Service Error]:', error);
  }
};

// 2. Fungsi untuk mengambil hasil pencocokan dari suatu barang hilang (Untuk konsumsi Frontend Pelapor)
export const getMatchResultsForLostItem = async (id_barang_hilang: number) => {
  return await prisma.pencocokan.findMany({
    where: { id_barang_hilang },
    include: {
      barang_temuan: true // Sertakan data barang temuan yang mirip agar pelapor bisa melihat fotonya
    },
    orderBy: { tingkat_kemiripan: 'desc' } // Urutkan dari yang paling mirip/akurat
  });
};