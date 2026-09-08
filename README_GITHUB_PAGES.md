# LMS Qur’an Hadis MA Al-Huda V2.2 — GitHub Pages

Versi ini disiapkan untuk dipublikasikan sebagai website statis melalui GitHub Pages.

## Isi
- `index.html`
- `style.css`
- `js/` — aplikasi, data, materi, dan konfigurasi Supabase
- `sql/` — SQL database
- `DAFTAR_AKUN_SISWA_158.csv`

## Catatan
LMS menggunakan Supabase untuk autentikasi dan penyimpanan data. `js/config.js` berisi Project URL dan Publishable/Anon Key. Jangan pernah memasukkan `service_role` key ke file frontend.

## Publikasi GitHub Pages
1. Buat repository GitHub baru, misalnya `lms-quran-hadis`.
2. Upload seluruh isi folder ini ke repository (bukan folder luarnya).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu **Save**.
6. Setelah beberapa saat, GitHub akan memberikan alamat website Pages.

Semua file website dibuat dengan path relatif sehingga dapat dijalankan dari GitHub Pages.


## LKPD Word
File `files/LKPD_AlQuran_Hadis_Kelas_XII_Bab_II_Sabar_Lengkap.docx` dapat diunduh langsung dari tombol LKPD Bab II untuk siswa dan dari Dashboard Guru.
