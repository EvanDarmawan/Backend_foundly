import prisma from '../config/database.js';
import axios from 'axios';

// 1. Fungsi Internal: Membuat Notifikasi In-App sekaligus memicu kiriman WhatsApp (jika diaktifkan)
export const createNotification = async (id_user: number, pesan: string) => {
  // A. Simpan ke database tb_notifikasi (In-App)
  const notif = await prisma.notifikasi.create({
    data: {
      id_user,
      pesan,
      status: 'BELUM',
      waktu: new Date()
    }
  });

  // B. Integrasi Pihak Ketiga: Kirim WhatsApp API secara Asynchronous
  // Kita bungkus di try-catch tersendiri agar jika gateway WA down, notifikasi sistem tidak ikut crash
  try {
    const user = await prisma.user.findUnique({ where: { id_user }, select: { kontak: true } });
    if (user && user.kontak) {
      // Panggil fungsi eksternal WhatsApp Gateway (Simulasi/Persiapan)
      sendWhatsAppMessage(user.kontak, pesan);
    }
  } catch (waError) {
    console.error('[WhatsApp Gateway Error]: Gagal mengirim pesan WA:', waError);
  }

  return notif;
};

// 2. Mengambil semua notifikasi milik user tertentu (Untuk dikonsumsi React Frontend)
export const getUserNotifications = async (id_user: number) => {
  return await prisma.notifikasi.findMany({
    where: { id_user },
    orderBy: { waktu: 'desc' }
  });
};

// 3. Menandai satu notifikasi tertentu sebagai telah dibaca
export const markAsRead = async (id_notifikasi: number, id_user: number) => {
  const notif = await prisma.notifikasi.findUnique({ where: { id_notifikasi } });
  
  if (!notif) throw new Error('Notifikasi tidak ditemukan');
  if (notif.id_user !== id_user) throw new Error('Akses ilegal ke notifikasi user lain');

  return await prisma.notifikasi.update({
    where: { id_notifikasi },
    data: { status: 'DIBACA' }
  });
};

// 4. PERSIAPAN WHATSAPP API GATEWAY (Fungsi Helper Eksternal)
const sendWhatsAppMessage = async (nomor_wa: string, pesan: string) => {
  const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL;
  const WA_API_KEY = process.env.WA_API_KEY;

  if (!WA_GATEWAY_URL || !WA_API_KEY) {
    // Jika env belum diset, cukup log di konsol server saja (Graceful degradation)
    console.log(`[WA Gateway Simulation] Mengirim ke ${nomor_wa}: "${pesan}"`);
    return;
  }

  // Jika sudah berlangganan vendor WA Gateway (seperti Fonnte/Wootalk/Flespi), kodenya seperti ini:
  await axios.post(WA_GATEWAY_URL, {
    target: nomor_wa,
    message: pesan
  }, {
    headers: { 'Authorization': WA_API_KEY }
  });
};