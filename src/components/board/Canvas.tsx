import React, { useEffect } from 'react'
import { BoardSection } from '@/types'
import { useBoardStore, useBoard } from '@/store/boardStore'
import { DragDropContainer } from './DragDropContainer'
import { Palette, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * Props untuk Canvas Component
 */
interface CanvasProps {
  isEditable?: boolean
  onColorPaletteChange?: (colors: string[]) => void
}

/**
 * Canvas Component
 * Komponen utama untuk menampilkan dan mengedit mood board
 * Mengintegrasikan dengan useBoardStore untuk real-time data synchronization
 * Menampilkan sections dengan images dalam layout yang terorganisir
 */
export const Canvas: React.FC<CanvasProps> = ({
  isEditable = true,
  onColorPaletteChange,
}) => {
  // Get board data dari Zustand store
  const board = useBoard()
  const {
    updateColorPalette,
    addColorToBoard,
    removeColorFromBoard,
    reorderSections,
    addImage,
  } = useBoardStore()

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-white rounded-lg shadow-card">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">Tidak ada mood board yang dipilih</p>
          <p className="text-gray-400 text-sm mt-2">Sila buat atau buka mood board untuk memulai</p>
        </div>
      </div>
    )
  }

  /**
   * Handle image move antara sections
   * @param fromSectionId - ID section asal
   * @param toSectionId - ID section tujuan
   * @param imageId - ID image yang dipindahkan
   */
  const handleImageMove = (fromSectionId: string, toSectionId: string, imageId: string) => {
    // Find image dari section asal
    const fromSection = board.sections.find((s) => s.id === fromSectionId)
    const image = fromSection?.images.find((img) => img.id === imageId)

    if (image) {
      // Remove dari section asal
      const fromSectionUpdated = {
        ...fromSection!,
        images: fromSection!.images.filter((img) => img.id !== imageId),
      }

      // Add ke section baru
      addImage(toSectionId, image)

      console.log(`Image '${image.title}' dipindahkan dari '${fromSection?.title}' ke section lain`)
    }
  }

  /**
   * Handle section reorder
   */
  const handleSectionReorder = (reorderedSections: BoardSection[]) => {
    console.log('Sections reordered:', reorderedSections.map((s) => s.title))
  }

  return (
    <div className="w-full space-y-8">
      {/* Canvas Header */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h1 className="text-4xl font-serif font-bold text-wedding-dark mb-2">
          {board.couple_name}
        </h1>
        <p className="text-gray-600 mb-4">
          Tarikh Perkahwinan: {board.wedding_date.toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Seksyen</p>
            <p className="text-2xl font-bold text-wedding-gold">{board.sections.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Jumlah Gambar</p>
            <p className="text-2xl font-bold text-wedding-gold">
              {board.sections.reduce((acc, sec) => acc + sec.images.length, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Warna Tema</p>
            <p className="text-2xl font-bold text-wedding-gold">
              {board.theme_color_palette.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Canvas with Drag & Drop */}
      <div className="bg-gradient-to-b from-wedding-cream to-white rounded-lg shadow-card p-8">
        <DragDropContainer
          sections={board.sections}
          onSectionReorder={handleSectionReorder}
          onImageMove={handleImageMove}
        />
      </div>

      {/* Color Palette Section */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-wedding-dark flex items-center gap-2">
            <Palette size={24} className="text-wedding-gold" />
            Palet Warna Tema
          </h2>
          <span className="text-sm text-gray-600">
            {board.theme_color_palette.length} / 6 warna
          </span>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
          {board.theme_color_palette.map((color, idx) => (
            <div key={idx} className="relative group">
              {/* Color Square */}
              <div
                className={cn(
                  'w-full aspect-square rounded-lg shadow-card border-2 border-gray-200 transition-all duration-200 cursor-pointer hover:border-wedding-gold hover:shadow-elegant'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />

              {/* Color Code on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-lg">
                <span className="text-white text-xs font-mono font-semibold">{color}</span>
              </div>

              {/* Remove Button */}
              {isEditable && (
                <button
                  onClick={() => removeColorFromBoard(color)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  title="Buang warna"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}

          {/* Add Color Button - Show if less than 6 colors */}
          {isEditable && board.theme_color_palette.length < 6 && (
            <div>
              <label htmlFor="color-input" className="cursor-pointer">
                <div className="w-full aspect-square rounded-lg shadow-card border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-wedding-gold hover:bg-gray-50 transition-all duration-200">
                  <span className="text-2xl text-gray-400">+</span>
                </div>
              </label>
              <input
                id="color-input"
                type="color"
                defaultValue="#D4AF37"
                onChange={(e) => addColorToBoard(e.target.value)}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Color Palette Info */}
        {board.theme_color_palette.length === 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 Tambah warna tema untuk mood board anda. Ini akan membantu memandu keputusan perancangan anda.
            </p>
          </div>
        )}
      </div>

      {/* Canvas Footer - Stats & Info */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Created Info */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Dibuat pada</p>
            <p className="font-semibold text-wedding-dark">
              {board.created_at.toLocaleDateString('ms-MY')}
            </p>
          </div>

          {/* Updated Info */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Dikemas kini terakhir</p>
            <p className="font-semibold text-wedding-dark">
              {board.updated_at.toLocaleDateString('ms-MY')}
            </p>
          </div>

          {/* Collaborators Info */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Kolaborator</p>
            <p className="font-semibold text-wedding-dark">
              {board.collaborators?.length || 0} orang
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
