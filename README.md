# WarungKU — Aplikasi Kasir & Pemesanan Warung Berbasis Mobile

WarungKU adalah aplikasi kasir sederhana untuk warung, kedai kopi, atau usaha kuliner kecil.
Aplikasi ini mempermudah proses pemesanan, pencatatan pesanan, dan pembayaran menggunakan QR Code (QRIS Dummy).
Dibangun menggunakan React Native, MockAPI, dan Expo.


# 🚀 Fitur Utama
✔️ Dashboard Warung

 Menampilkan navigasi cepat ke:

- Pesan Baru
- Daftar Pesanan
- Laporan / Riwayat

✔️ Pemesanan Menu

- Menu diambil dari MockAPI (real-time update).
- Tersedia kategori Makanan & Minuman.
- Pencarian menu.
Menampilkan:
- Nama
- Gambar
- Harga
  
✔️ Keranjang Pesanan

- Tambah item ke keranjang.
- Hitung total otomatis.
- Form konfirmasi:
  - Nama Pembeli (wajib)
  - Nomor Kursi / Meja (opsional)

✔️ Pembayaran QR Code (QRIS Dummy)
Setelah pesanan dibuat:
- App menampilkan QR Code pembayaran.
- QR berisi link seperti:
    https://warungtestipay.vercel.app/?order=xxx&name=xxx&amount=xxxx

Halaman web berisi:
  - Nama Pembeli
  - Total Pembayaran
  - Status: “Pembayaran Berhasil” (dummy)

✔️ Laporan / Riwayat Pemesanan
Menampilkan riwayat semua pesanan:
- Nama pembeli
- Total pembayaran
- Menu yang dibeli
- Notifikasi: "Tunggu pramusaji memanggil nama kamu"

| Teknologi            | Deskripsi                       |
| -------------------- | ------------------------------- |
| **React Native**     | Framework aplikasi mobile       |
| **Expo**             | Environment & tools RN          |
| **React Navigation** | Sistem routing & bottom tabs    |
| **MockAPI.io**       | Database menu berbasis REST API |
| **QRCode SVG**       | Generate QR Code pembayaran     |
| **Vercel**           | Hosting halaman pembayaran      |

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
>>>>>>> 908421b (Upload folder warung)
