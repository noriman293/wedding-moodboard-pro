# 🖼️ PANDUAN SETUP CLOUDINARY UNTUK WEDDING MOOD BOARD PRO

## Panduan Lengkap Setup Cloudinary dengan Unsigned Upload

---

## LANGKAH 1: DAFTAR AKAUN CLOUDINARY

1. Buka https://cloudinary.com/users/register/free
2. Daftar dengan email anda (atau sign up dengan GitHub/Google)
3. Confirm email anda
4. Login ke Cloudinary dashboard

---

## LANGKAH 2: DAPATKAN CLOUD NAME

1. Di dashboard, pergi ke **Settings** (ikon gear di corner atas kanan)
2. Buka tab **Account** atau **General**
3. Lihat field **Cloud Name** - ini adalah unique identifier anda
4. Copy nilai ini dan simpan di `.env.local` sebagai:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   ```

**Contoh:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=d5p9k3m1q
```

---

## LANGKAH 3: BUAT UNSIGNED UPLOAD PRESET (PENTING!)

Upload Preset ini membenarkan client-side upload tanpa backend authentication.
Ini adalah method terbaik untuk aplikasi yang berjalan di browser user.

### Steps:

1. Di Cloudinary dashboard, pergi ke **Settings** > **Upload**
2. Scroll down ke **Upload presets** section
3. Klik **Add upload preset** (atau **Create upload preset**)
4. Set field-field berikut:

   | Field | Value | Keterangan |
   |-------|-------|------------|
   | **Preset name** | `wedding_moodboard_upload` | Nama pilihan anda, pastikan memorable |
   | **Signing Mode** | **UNSIGNED** | ⚠️ SANGAT PENTING - Pilih "Unsigned" bukan "Signed" |
   | **Folder** | `wedding-moodboard/uploads` | Optional, untuk organize files |

5. Scroll down, klik **Save**
6. Copy preset name dan simpan di `.env.local` sebagai:
   ```
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=wedding_moodboard_upload
   ```

**Screenshot Guide:**
```
Settings > Upload > Upload presets > Add upload preset
┌─────────────────────────────────────────┐
│ Preset name:        wedding_moodboard_u │  ← Your preset name
│ Signing Mode:       ○ Signed            │
│                     ● UNSIGNED  ← PILIH │
│ Folder:             wedding-moodboard/u │
│ [Save]                                   │
└─────────────────────────────────────────┘
```

---

## LANGKAH 4: (OPTIONAL) SETUP API KEY UNTUK SERVER-SIDE OPERATIONS

Jika anda nak delete/update images dari server nanti, anda perlu API credentials.

### Steps:

1. Di Settings > **API Keys**
2. Copy **API Key** dan **API Secret**
3. Simpan di `.env.local` (JANGAN expose di `.env.example`!):
   ```
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**Catatan:** API Secret sangat sensitif - jangan commit ke GitHub!

---

## LANGKAH 5: UPDATE .env.local FILE

File `.env.local` anda sepatutnya seperti ini:

```bash
# ===== CLOUDINARY CONFIGURATION =====
# Required untuk image uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=d5p9k3m1q
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=wedding_moodboard_upload

# Optional - untuk server-side operations (jangan expose!)
CLOUDINARY_API_KEY=12345678901234567890
CLOUDINARY_API_SECRET=aBcDeFgHiJkLmNoPqRsT
```

**PENTING:** Jangan pernah commit `.env.local` ke Git!

---

## LANGKAH 6: RESTART DEVELOPMENT SERVER

1. Jika dev server sudah berjalan, stop dengan **Ctrl+C**
2. Jalankan:
   ```bash
   npm run dev
   ```
3. Next.js akan reload dengan environment variables baru
4. Buka http://localhost:3000 di browser

---

## LANGKAH 7: TEST IMAGE UPLOAD

1. Buka aplikasi anda di browser
2. Navigate ke dashboard atau board editor page
3. Cari button **"Klik untuk pilih gambar"** (atau drag & drop area)
4. Click dan pilih gambar dari komputer anda (JPEG/PNG/WebP/GIF, max 10MB)
5. Tunggu upload selesai
6. Jika berjaya, anda akan lihat:
   - ✅ Gambar muncul di Canvas
   - ✅ Gambar muncul di Cloudinary Media Library
   - ✅ Gambar tersimpan dalam Zustand store (local state)

---

## 🐛 TROUBLESHOOTING

### Error: "Konfigurasi Cloudinary tidak lengkap"

**Penyebab:** .env.local tidak properly configured

**Solution:**
1. Pastikan `.env.local` file wujud (bukan `.env.example`)
2. Check format:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-value
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-value
   ```
3. Pastikan tiada spacing sebelum/selepas `=`
4. Restart dev server: `Ctrl+C` then `npm run dev`
5. Clear browser cache: `Ctrl+Shift+Delete`

### Error: "Upload failed" atau widget tidak muncul

**Penyebab:** Upload preset tidak betul atau tidak "Unsigned"

**Solution:**
1. Pergi ke Cloudinary dashboard > Settings > Upload > Upload presets
2. Verify preset name match dengan `.env.local`
3. **CRITICAL:** Pastikan Signing Mode adalah **"UNSIGNED"**
4. Check console DevTools (F12 > Console tab) untuk error message

### Error: "CORS error" / "Failed to fetch"

**Penyebab:** Cloudinary CORS issue

**Solution:**
Cloudinary CORS sudah di-enable by default. Jika still error:
1. Pergi ke Settings > **Security**
2. Pastikan "Allowed request origins" termasuk:
   - `http://localhost:3000` (development)
   - Your domain name (production)

### Gambar upload tapi tidak muncul di Canvas

**Penyebab:** Zustand store tidak update atau section ID tidak match

**Solution:**
1. Check console untuk error messages
2. Verify section ID correct: `console.log(sectionId)` dalam ImageUpload component
3. Check Zustand store state: install Redux DevTools extension untuk debugging

### Upload very slow atau timeout

**Penyebab:** File size too large atau network issues

**Solution:**
1. Compress image sebelum upload (gunakan online tool atau local software)
2. Check internet connection
3. Cloudinary free tier ada monthly transfer limit - check Usage dashboard

---

## 📚 FILE STRUKTUR SELEPAS SETUP

```
wedding-moodboard-pro/
├── .env.example              # Template (commit ke Git)
├── .env.local                # Actual credentials (jangan commit!)
├── src/
│   ├── components/board/
│   │   ├── ImageUpload.tsx   # ← Component untuk upload
│   │   ├── Canvas.tsx
│   │   └── DragDropContainer.tsx
│   ├── lib/
│   │   ├── cloudinary.ts     # ← Configuration & utilities
│   │   └── utils.ts
│   └── pages/
│       └── board/[id].tsx
├── CLOUDINARY_SETUP.md       # Panduan ini
└── package.json
```

---

## 🔒 SECURITY BEST PRACTICES

1. **Jangan expose API_SECRET di frontend** - only gunakan di server-side API routes
2. **Gunakan Unsigned presets untuk client-side uploads** - ini sudah secure
3. **Setup folder structure** untuk organize uploads dan easier management
4. **Enable virus scanning** di Cloudinary settings untuk security
5. **Monitor bandwidth usage** - Cloudinary free tier ada monthly limits
6. **Never commit .env.local** - add ke `.gitignore` (sudah ada by default)

---

## 🎨 CLOUDINARY FEATURES YANG KAMI GUNAKAN

### Dalam ImageUpload.tsx:

1. **CldUploadWidget**
   - Drag & drop interface
   - Beautiful default UI

2. **Image Cropping**
   - Allow users to crop sebelum upload
   - Aspect ratio locking (1:1)

3. **Folder Organization**
   - Images tersimpan dalam `wedding-moodboard/uploads/`
   - Easier management di Cloudinary dashboard

4. **File Validation**
   - Accept: JPEG, PNG, WebP, GIF
   - Max size: 10MB

5. **Image Metadata**
   - Capture public_id, original_filename, dimensions, etc
   - Store dalam BoardImage object

### Dalam cloudinary.ts:

1. **Image Transformation**
   - Automatic optimization
   - Responsive formats (auto WebP)

2. **URL Generation**
   - getThumbnailUrl() - Small preview (300x300)
   - getMediumQualityUrl() - Grid display (600x600)
   - getFullQualityUrl() - Detail viewing (1200x1200)

3. **Configuration Validation**
   - validateCloudinaryConfig() - Check setup
   - formatFileSize() - User-friendly file sizes

---

## 📖 DOKUMENTASI LENGKAP

- **Cloudinary Main Docs**: https://cloudinary.com/documentation
- **next-cloudinary Library**: https://next.cloudinary.dev/
- **Upload Widget Guide**: https://cloudinary.com/documentation/upload_widget
- **API Reference**: https://cloudinary.com/documentation/cloudinary_api
- **Transformation Cookbook**: https://cloudinary.com/cookbook

---

## 🚀 NEXT STEPS

Selepas setup Cloudinary:

1. ✅ Upload images berjaya
2. 🔄 Integrate dengan Canvas component (drag & drop)
3. 💾 Setup Supabase untuk save boards ke database
4. 📄 Implement PDF export functionality
5. 🔐 Add authentication (login/signup)
6. 🌐 Deploy ke production (Vercel)

---

## ❓ FAQ

**Q: Berapa cost untuk Cloudinary?**
A: Free tier includes 25 GB storage dan 25 GB monthly transfer. Lebih dari cukup untuk development dan small production apps.

**Q: Boleh kah change upload preset nanti?**
A: Ya, boleh. Tinggal update .env.local dan restart server.

**Q: Kalau lupa API credentials?**
A: Boleh regenerate di dashboard > Settings > API Keys

**Q: Boleh kah upload dari mobile app?**
A: Ya, CldUploadWidget works di mobile via responsive design.

**Q: Bagaimana delete image dari Cloudinary?**
A: Kena guna server-side API route dengan API_SECRET (dijelaskan dalam deleteImageFromCloudinary() function).

---

## 📞 SOKONGAN

Jika ada issues:
1. Check console DevTools (F12)
2. Refer troubleshooting section
3. Check Cloudinary dashboard > Analytics untuk errors
4. Buka issue di GitHub repo

---

**Happy uploading! 🎉**
