/**
 * Konfigurasi Cloudinary
 * File ini menguruskan semua konfigurasi dan fungsi utiliti untuk Cloudinary
 * Termasuk upload presets, image optimization, dan helper functions
 */

/**
 * Cloudinary Configuration Object
 * Simpan credentials di dalam .env.local (jangan expose di frontend)
 */
export const cloudinaryConfig = {
  // Cloud name - Boleh didapati dari Cloudinary dashboard > Settings > Cloud name
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  
  // Upload Preset (Unsigned) - Untuk client-side uploads tanpa backend authentication
  // Buat di Cloudinary dashboard > Settings > Upload > Add upload preset
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  
  // API Key (hanya untuk server-side operations)
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  
  // API Secret (JANGAN expose ke frontend - server side only)
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
}

/**
 * Validation untuk Cloudinary Config
 * Pastikan credentials sudah di-setup dengan betul
 */
export const validateCloudinaryConfig = (): boolean => {
  if (!cloudinaryConfig.cloudName) {
    console.warn('❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME tidak di-set di .env.local')
    return false
  }
  if (!cloudinaryConfig.uploadPreset) {
    console.warn('❌ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET tidak di-set di .env.local')
    return false
  }
  return true
}

/**
 * Image Upload Response dari Cloudinary
 * Struktur data yang dikembalikan setelah upload berhasil
 */
export interface CloudinaryUploadResponse {
  event?: string
  info: {
    public_id: string // Unique ID untuk gambar di Cloudinary
    secure_url: string // URL HTTPS untuk gambar
    url: string // URL HTTP untuk gambar
    width: number // Lebar gambar dalam pixels
    height: number // Tinggi gambar dalam pixels
    format: string // Format gambar (jpg, png, etc)
    resource_type: string // Jenis resource (image, video, etc)
    original_filename: string // Nama file original
    size: number // Ukuran file dalam bytes
    created_at: string // Timestamp creation
    [key: string]: any // Properties lain dari Cloudinary
  }
}

/**
 * Generate Optimized Image URL dari Cloudinary
 * Menggunakan transformasi Cloudinary untuk optimization
 * 
 * @param publicId - Public ID dari gambar di Cloudinary
 * @param options - Transformation options (width, height, crop, quality, etc)
 * @returns URL gambar yang sudah di-optimize
 * 
 * @example
 * getOptimizedImageUrl('my-image-id', { width: 400, height: 300, crop: 'fill' })
 * // Returns: https://res.cloudinary.com/cloud-name/image/upload/w_400,h_300,c_fill/my-image-id
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options?: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'pad' | 'thumb' // Jenis cropping
    quality?: number // 1-100, default 85
    fetch_format?: 'auto' | 'jpg' | 'png' | 'webp' // Auto-format untuk best performance
    gravity?: 'auto' | 'face' | 'center' // Focus point untuk crop
  }
): string => {
  if (!cloudinaryConfig.cloudName) {
    console.warn('Cloudinary cloud name tidak di-set')
    return ''
  }

  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`
  const transformations: string[] = []

  // Build transformation string
  if (options?.width) transformations.push(`w_${options.width}`)
  if (options?.height) transformations.push(`h_${options.height}`)
  if (options?.crop) transformations.push(`c_${options.crop}`)
  if (options?.quality) transformations.push(`q_${options.quality}`)
  if (options?.fetch_format) transformations.push(`f_${options.fetch_format}`)
  if (options?.gravity) transformations.push(`g_${options.gravity}`)

  const transformationString = transformations.join(',')
  
  return transformationString
    ? `${baseUrl}/${transformationString}/${publicId}`
    : `${baseUrl}/${publicId}`
}

/**
 * Get Thumbnail URL untuk preview
 * Optimize gambar untuk display sebagai thumbnail
 */
export const getThumbnailUrl = (publicId: string): string => {
  return getOptimizedImageUrl(publicId, {
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 80,
    fetch_format: 'auto',
    gravity: 'auto',
  })
}

/**
 * Get Medium Quality URL untuk grid display
 * Balance antara quality dan performance
 */
export const getMediumQualityUrl = (publicId: string): string => {
  return getOptimizedImageUrl(publicId, {
    width: 600,
    height: 600,
    crop: 'fill',
    quality: 85,
    fetch_format: 'auto',
  })
}

/**
 * Get Full Quality URL untuk preview/editing
 * Highest quality untuk detail viewing
 */
export const getFullQualityUrl = (publicId: string): string => {
  return getOptimizedImageUrl(publicId, {
    width: 1200,
    height: 1200,
    crop: 'fit',
    quality: 90,
    fetch_format: 'auto',
  })
}

/**
 * Format file size untuk display
 * @param bytes - Ukuran file dalam bytes
 * @returns Formatted string (KB, MB, etc)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate image file sebelum upload
 * @param file - File object dari input
 * @returns Object dengan valid status dan error message jika ada
 */
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  // Max file size: 10MB
  const maxSize = 10 * 1024 * 1024

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak disokong. Sila gunakan JPEG, PNG, WebP, atau GIF.',
    }
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Saiz file terlalu besar. Maksimum 10MB, anda muat naik ${formatFileSize(file.size)}.`,
    }
  }

  return { valid: true }
}

/**
 * Get image dimensions dari URL
 * Berguna untuk knowing aspect ratio sebelum render
 */
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = () => reject(new Error('Gagal memuatkan gambar'))
    img.src = url
  })
}

/**
 * Delete image dari Cloudinary (server-side operation)
 * Memerlukan API Key dan API Secret
 * 
 * @param publicId - Public ID dari gambar untuk dihapus
 * @returns Promise dengan result dari deletion
 * 
 * NOTE: Ini hanya boleh dipanggil dari server-side (API route)
 * Jangan expose API Secret di client-side!
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<any> => {
  // This should be called from an API route on the server
  // Example: POST /api/cloudinary/delete
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}

/**
 * Upload Progress Callback Type
 * Digunakan untuk tracking upload progress
 */
export type UploadProgressCallback = (progress: {
  loaded: number
  total: number
  percentage: number
}) => void
