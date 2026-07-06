import { CldUploadWidget } from 'next-cloudinary'

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
}

export const getOptimizedImageUrl = (publicId: string, options?: any) => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`
  const params = new URLSearchParams()

  if (options?.width) params.append('w', options.width.toString())
  if (options?.height) params.append('h', options.height.toString())
  if (options?.crop) params.append('c', options.crop)
  if (options?.quality) params.append('q', options.quality.toString())

  return `${baseUrl}/${params.toString()}/${publicId}`
}
