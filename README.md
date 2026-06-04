# AI Agent Deskripsi & Hashtag Produk

Aplikasi mobile-first/PWA sederhana untuk membuat deskripsi dan hashtag otomatis berdasarkan nama produk. Nama produk wajib diisi, sedangkan deskripsi tambahan opsional.

Output yang dibuat:

- TikTok
- Shopee
- FB Reels
- Threads

Catatan khusus: hashtag Shopee otomatis dibatasi maksimal 150 karakter.

Fitur tambahan:

- Kategori produk untuk membuat angle dan hashtag lebih relevan.
- Preset campaign: soft selling, hard selling, produk viral, affiliate review, promo, dan edukasi produk.
- Generator 1 sampai 5 variasi output.
- Riwayat hasil tersimpan di browser dan bisa dimuat ulang.
- Copy per platform atau copy semua variasi sekaligus.
- Integrasi Gemini API opsional dengan fallback ke generator lokal.
- AI provider selector: Local generator atau Gemini.
- Opsi menyimpan Gemini API key di browser untuk pemakaian pribadi.
- Input detail jualan: harga, promo, target pembeli, varian/bahan, keunggulan, dan link produk.
- Export hasil ke TXT atau CSV.

## Menjalankan

```bash
npm install
npm run dev
```

Di Windows PowerShell dengan execution policy ketat, gunakan:

```bash
npm.cmd install
npm.cmd run dev
```

## Cara Pakai

1. Isi nama produk.
2. Tambahkan deskripsi tambahan jika ada.
3. Tambahkan detail jualan jika ada.
4. Pilih kategori produk dan preset campaign.
5. Pilih AI provider: Local generator atau Gemini.
6. Jika memakai Gemini, isi API key dan model.
7. Pilih gaya tulisan, jumlah hashtag, dan jumlah variasi.
8. Klik Generate.
9. Copy output atau export ke TXT/CSV.

## Gemini

Default model di form adalah:

```text
gemini-2.0-flash
```

Field Gemini API key bersifat opsional. Jika kosong, aplikasi memakai generator lokal. Karena aplikasi ini berjalan di browser, API key hanya cocok untuk penggunaan pribadi/lokal.

## Mobile dan Ollama

Ollama gratis karena model berjalan di perangkat sendiri, tetapi untuk aplikasi mobile biasanya tidak berjalan langsung di HP. Pola yang lebih masuk akal:

- Ollama berjalan di laptop/PC/server lokal.
- Aplikasi mobile memanggil endpoint Ollama dari jaringan yang sama.
- Untuk rilis publik, gunakan backend proxy agar koneksi, CORS, dan keamanan lebih rapi.

Aplikasi ini sudah mobile-first dan punya manifest PWA. Jika ingin dibuat APK/native, langkah berikutnya adalah membungkusnya dengan Capacitor atau memindahkan UI ke React Native/Flutter.
