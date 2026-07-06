import React, { useState, useRef } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { useBoardStore } from '@/store/boardStore'
import { BoardImage } from '@/types'
import { generateId } from '@/lib/utils'
import {
  cloudinaryConfig,
  validateCloudinaryConfig,
  CloudinaryUploadResponse,
} from '@/lib/cloudinary'
import { Upload, X, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props untuk ImageUpload Component
 */
interface ImageUploadProps {
  sectionId: string // ID section tempat image akan ditambah
  onUploadSuccess?: (image: BoardImage) => void // Callback setelah upload berhasil
  onUploadError?: (error: string) => void // Callback jika upload gagal
  multiple?: boolean // Allow multiple file uploads sekaligus
}

/**
 * Upload State untuk tracking proses upload
 */
interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  success: boolean
}

/**
 * ImageUpload Component
 * Komponen untuk upload gambar ke Cloudinary dan automatik add ke mood board
 * Menggunakan CldUploadWidget dari next-cloudinary untuk UI yang rapi
 * 
 * Features:
 * - Drag & drop upload
 * - Click to select file
 * - Progress tracking
 * - Error handling dengan user-friendly messages
 * - Image validation (format, size)
 * - Auto-integration dengan Zustand store
 * - Wedding-themed styling
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  sectionId,
  onUploadSuccess,
  onUploadError,
  multiple = false,
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  // Reference ke CldUploadWidget untuk manual trigger
  const widgetRef = useRef<any>(null)

  // Get Zustand store actions
  const { addImage } = useBoardStore()

  // Validate Cloudinary config saat component mount
  React.useEffect(() => {
    if (!validateCloudinaryConfig()) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error:
          'Konfigurasi Cloudinary tidak lengkap. Sila check .env.local file anda.',
        success: false,
      })
    }
  }, [])

  /**
   * Handle successful upload dari Cloudinary
   * Extract image data dan add ke board via Zustand
   */
  const handleUploadSuccess = (result: any) => {
    try {
      const uploadResponse: CloudinaryUploadResponse = result
      const info = uploadResponse.info

      // Create BoardImage object dari Cloudinary response
      const newImage: BoardImage = {
        id: generateId(),
        url: info.secure_url, // Gunakan HTTPS URL
        cloudinaryId: info.public_id, // Simpan public ID untuk delete/update nanti
        title: info.original_filename.replace(/\.[^/.]+$/, ''), // Remove file extension
        description: `Ukuran: ${info.width}x${info.height}px`,
      }

      // Add image ke board melalui Zustand store
      addImage(sectionId, newImage)

      // Update state
      setUploadState({
        isUploading: false,
        progress: 0,
        error: null,
        success: true,
      })

      // Callback
      onUploadSuccess?.(newImage)

      // Reset success state selepas 2 seconds
      setTimeout(() => {
        setUploadState((prev) => ({ ...prev, success: false }))
      }, 2000)

      console.log('✅ Gambar berjaya dimuat naik:', newImage.title)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ralat semasa memproses gambar'
      handleUploadError(errorMessage)
    }
  }

  /**
   * Handle upload error
   */
  const handleUploadError = (error: string) => {
    console.error('❌ Upload error:', error)
    setUploadState({
      isUploading: false,
      progress: 0,
      error: error,
      success: false,
    })
    onUploadError?.(error)
  }

  /**
   * Trigger manual file select via button click
   */
  const handleManualUpload = () => {
    widgetRef.current?.open()
  }

  return (
    <div className="w-full">
      {/* Cloudinary Upload Widget - Hidden but accessible */}
      <CldUploadWidget
        uploadPreset={cloudinaryConfig.uploadPreset}
        onSuccess={handleUploadSuccess}
        onError={(error: any) => handleUploadError(error?.message || 'Upload failed')}
        options={{
          folder: 'wedding-moodboard/uploads', // Organize uploads dalam Cloudinary
          resourceType: 'auto',
          clientAllowedFormats: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
          maxFileSize: 10485760, // 10MB
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          cropping: true, // Allow user to crop before upload
          croppingAspectRatio: 1, // Square aspect ratio
          showAdvancedOptions: false,
          croppingShowDimensions: true,
          removeAllowedFormats: false,
          multiple: multiple,
          tags: ['wedding', 'moodboard'],
        }}
      >
        {({ open }) => {
          // Store reference untuk access dari button click
          if (widgetRef.current === null) {
            widgetRef.current = { open }
          }

          return (
            <div className="space-y-4">
              {/* Upload Area - Clickable box */}
              <button
                onClick={() => open()}
                disabled={uploadState.isUploading}
                className={cn(
                  'w-full p-8 border-2 border-dashed rounded-lg transition-all duration-300',
                  'flex flex-col items-center justify-center gap-3',
                  uploadState.isUploading
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-75'
                    : 'border-wedding-gold bg-wedding-gold bg-opacity-5 hover:bg-opacity-10 hover:border-wedding-dark cursor-pointer'
                )}
              >
                {/* Icon */}
                <div className="text-wedding-gold">
                  {uploadState.isUploading ? (
                    <Loader className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                {/* Text */}
                <div className="text-center">
                  <p className="font-semibold text-wedding-dark">
                    {uploadState.isUploading ? 'Memuat naik...' : 'Klik untuk pilih gambar'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    atau seret gambar ke sini
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    JPEG, PNG, WebP, GIF | Maksimum 10MB
                  </p>
                </div>
              </button>

              {/* Progress Bar */}
              {uploadState.isUploading && uploadState.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Sedang memuat naik...
                    </span>
                    <span className="text-sm text-gray-600">{uploadState.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-wedding-gold transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {uploadState.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Ralat Muat Naik</p>
                    <p className="text-sm text-red-700 mt-1">{uploadState.error}</p>
                  </div>
                  <button
                    onClick={() =>
                      setUploadState({ ...uploadState, error: null })
                    }
                    className="text-red-600 hover:text-red-900 ml-auto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Success Message */}
              {uploadState.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-900">
                    ✅ Gambar berjaya dimuat naik!
                  </p>
                </div>
              )}
            </div>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload
