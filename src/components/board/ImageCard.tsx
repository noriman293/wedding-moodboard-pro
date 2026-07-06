import React from 'react'
import { BoardImage } from '@/types'
import { Trash2 } from 'lucide-react'

interface ImageCardProps {
  image: BoardImage
  onDelete?: (id: string) => void
  isDragging?: boolean
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete, isDragging }) => {
  return (
    <div
      className={`relative group rounded-lg overflow-hidden shadow-card transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-elegant'
      }`}
    >
      <img
        src={image.url}
        alt={image.title || 'Mood board image'}
        className="w-full h-full object-cover"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-end justify-between p-3">
        {image.title && (
          <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            {image.title}
          </p>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(image.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 p-2 rounded-lg"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
