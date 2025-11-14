☕ WarungKU — Aplikasi Kasir & Pemesanan Berbasis Mobile (React Native + QRIS Dummy)

WarungKU adalah aplikasi kasir modern untuk warung, kedai kopi, atau usaha kuliner kecil yang membutuhkan sistem pemesanan cepat, pencatatan pesanan, dan proses pembayaran menggunakan QR Code (QRIS Dummy).
Aplikasi ini dibuat dengan React Native, React Navigation, dan MockAPI sebagai backend menu.

🚀 Fitur Utama
✔️ 1. Dashboard Warung

Tampilan awal berisi akses cepat ke:

Pesan Baru

Daftar Pesanan

Laporan / Riwayat Pesanan

✔️ 2. Pemesanan Menu

Mengambil data menu dari MockAPI (otomatis update tanpa rebuild).

Fitur pencarian menu.

Kategori Makanan & Minuman.

Setiap item memiliki:

Nama

Harga

Gambar

Deskripsi

✔️ 3. Keranjang Pesanan

Tambah item ke keranjang.

Hitung total otomatis.

Sebelum checkout, pembeli diminta mengisi:

Nama pembeli (wajib)

Nomor kursi/meja (opsional)

✔️ 4. Pembayaran via QR Code (QRIS Dummy)

Setelah konfirmasi pesanan, aplikasi akan menghasilkan QR Code pembayaran.

QR berisi link ke halaman pembayaran:

https://warungtestipay.vercel.app/?order=xxx&name=xxx&amount=xxxx


Halaman web menampilkan:

Nama pembeli

Jumlah yang harus dibayar

Status “Pembayaran Berhasil” (Dummy)

✔️ 5. Laporan / Riwayat Pemesanan

Menampilkan daftar pesanan yang sudah dibuat.

Detail pemesanan tampil lengkap:

Nama pelanggan

Menu yang dipesan

Total harga

Nomor meja

Notifikasi: "Tunggu barista memanggil nama kamu"

🛠 Teknologi yang Digunakan
Teknologi	Fungsi
React Native	Framework utama aplikasi
Expo	Build, testing, dan environment RN
React Navigation	Routing & Bottom Tabs
MockAPI.io	Database menu (REST API)
react-native-qrcode-svg	Generate QR Code pembayaran
Vercel	Hosting halaman pembayaran dummy
📌 Struktur Fitur Utama
/screens
  ├── DashboardScreen.js
  ├── PesanScreen.js      → ambil menu + kategori + keranjang
  ├── BayarScreen.js      → kelola pesanan masuk
  ├── PaymentQrScreen.js  → generate QR Code 
  └── LaporanScreen.js    → riwayat pemesanan

/api
  └── menuService.js      → fetch menu dari MockAPI

/context
  └── CartContext.js      → keranjang & fungsi makeOrder()

⚙️ Cara Menjalankan
npm install
npm start


Scan QR dengan aplikasi Expo Go untuk menjalankan di HP.

🧩 Tujuan Aplikasi

Aplikasi ini dibuat untuk:

Mempermudah proses pemesanan di warung.

Mengurangi penulisan manual di kertas.

Mempercepat kasir saat mencatat & memproses pesanan.

Memberikan pengalaman modern pada pelanggan (QRIS, digital queue).

Menjadi contoh project React Native dengan sistem kasir sederhana.
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
