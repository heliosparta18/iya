# Website Perayaan 4th Anniversary 🤎 (10 November 2021)

Selamat ulang tahun hubungan yang ke-4 tahun! Website ini dirancang khusus untuk merayakan perjalanan cinta kalian dengan tampilan editorial vintage romantis bertema **Warm Brown, Caramel Latte, & Roasted Mocha**.

Kini kode sumber (*source code*) telah dipisah-pisahkan secara rapi dan modular ke dalam beberapa portal halaman mandiri yang saling terhubung!

---

## 🚪 Portal-Portal Kenangan ("Pintu Dimensi Cinta")

Website ini terbagi menjadi 5 halaman terpisah dengan navigasi portal di masing-masingnya:

1. **`index.html` (Portal Utama / Grand Memory Hub)**
   - Gerbang Bunga Pembuka (*Floral Curtain Gate*) dengan alunan lagu romantis `magnolia.mp3`.
   - Sanctuary utama berisi **Hitungan Waktu Cinta Realtime** sejak 10 November 2021.
   - Pintu gerbang utama menuju ke 4 portal lainnya.

2. **`cerita.html` (Portal Kisah & Perjalanan Kita)**
   - 5 Slide Chapter perjalanan cinta interaktif:
     - **Slide 1**: *Milad Cinta Keempat & Live Counter*.
     - **Slide 2**: *Jejak Langkah & Ribuan Tawa*.
     - **Slide 3**: *Tumbuh Bersama & Melewati Badai*.
     - **Slide 4**: *Hal-Hal Kecil yang Bikin Jatuh Cinta*.
     - **Slide 5**: *Menuju Selamanya (Celebration Climax)*.
   - Koreografi dinamis foto melayang (A &rarr; B) saat berganti slide dan diam saat idle.
   - Interaksi zoom & fokus foto saat diklik.

3. **`surat.html` (Portal Surat Cinta Rahasia)**
   - Desain 3D amplop vintage berlogo lilin karamel hangat.
   - Efek ujung kertas mengintip (*peeking card*).
   - Animasi membentangkan kertas surat lipat otentik dan tombol *"Lipat ke Amplop ✉️"*.

4. **`game.html` (Portal Pavilion Game Berdua)**
   - **Mode 1: Royal Tic-Tac-Toe** (Mahkota 👑 vs Hati 💖) dilengkapi papan skor dan kartu hadiah romantis bagi pemenang.
   - **Mode 2: Kartu Rahasia Cinta** (18 kartu 3D berputar berisi pertanyaan intim, deep talk, dan tantangan manis bergantian).

5. **`editor.html` (Portal Galeri Foto Dump & Editor Teks)**
   - Koleksi 13 foto dump kenangan.
   - Form kustomisasi judul, quotes, nama panggilan, isi surat, dan unggah foto baru dari HP/Laptop.
   - Tersimpan otomatis di *Local Storage* peramban.

---

## 🌀 Fitur Portal & Musik Seamless (Tanpa Jeda / Cut)

Di setiap halaman dan di portal utama terdapat:
- **Musik Mengalun Terus (Continuous Audio)**: Lagu romantis `magnolia.mp3` terus berputar tanpa henti (*zero interruption / no cut*). Pindah portal tidak lagi memotong lagu atau mengulang dari awal.
- **Gerbang Bunga 60 FPS**: Gerbang kenangan terbuka ke kiri dan kanan dengan mulus tanpa lag di perangkat seluler.
- **Navbar Universal**: Tombol langsung menuju setiap portal (*Portal Utama, Kisah Kita, Surat Rahasia, Main Berdua, Galeri & Edit*).
- **Tombol "Portal Kenangan"**: Membuka modal teleportasi instan ke ruang cinta mana pun.
- **Pengontrol Musik Magnolia**: Memutar/menjeda lagu latar di mana saja.
- **Bar Portal Bawah**: Rekomendasi pintu menuju portal berikutnya.

---

## 📂 Struktur File Modular

```text
anniv/
├── index.html        # Portal Utama & Gerbang Bunga
├── cerita.html       # Bab Cerita & Slide Kenangan
├── surat.html        # Surat Cinta Rahasia & Amplop 3D
├── game.html         # Pavilion Game Berdua (Tic-Tac-Toe & Kartu)
├── editor.html       # Galeri Foto Dump & Editor Teks
│
├── common.css        # Gaya dasar, variabel, partikel, & navbar portal
├── portal.css        # Gaya kartu hub gerbang utama
├── cerita.css        # Gaya slide, polaroid, & animasi dinamis
├── surat.css         # Gaya amplop 3D & lipatan kertas surat
├── game.css          # Gaya papan permainan & kartu 3D
├── editor.css        # Gaya galeri foto & formulir pengeditan
│
├── common.js         # Audio engine, partikel kelopak, & sinkronisasi data
├── portal.js         # Logika gerbang bunga & hitungan hub
├── cerita.js         # Mesin slide 5 babak, swipe & photo zoom
├── surat.js          # Logika animasi buka/lipat amplop surat
├── game.js           # Logika Tic-Tac-Toe & kartu cinta
├── editor.js         # Logika ganti teks/foto & penyimpanan lokal
│
├── magnolia.mp3      # Lagu latar romantis
└── foto1.jpg - 13.jpg# Foto kenangan berdua
```

---

## 🚀 Cara Menjalankan

Cukup buka file `index.html` langsung di browser favoritmu (Google Chrome, Edge, Safari, Firefox):
1. Dobel klik file `index.html`.
2. Klik tombol *"Buka Pintu Kenangan"*.
3. Jelajahi setiap portal kenangan dengan alunan musik romantis! 🤎
