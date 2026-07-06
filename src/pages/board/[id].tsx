import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Canvas } from '@/components/board/Canvas'
import { useBoardStore } from '@/store/boardStore'
import { MoodBoard, BoardSection } from '@/types'
import { Download, Save, Plus, X } from 'lucide-react'

// Mock board data - Replace with Supabase query
const getMockBoard = (id: string): MoodBoard => ({
  id,
  couple_name: 'Sarah & John',
  wedding_date: new Date('2024-06-15'),
  theme_color_palette: ['#D4AF37', '#F5F5F0', '#2D2D2D', '#E8D5B7'],
  sections: [
    {
      id: 'bridal',
      title: 'Bridal Look',
      images: [
        {
          id: 'img1',
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
          title: 'White Gown',
        },
        {
          id: 'img2',
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop',
          title: 'Veil & Accessories',
        },
      ],
    },
    {
      id: 'venue',
      title: 'Venue & Decor',
      images: [
        {
          id: 'img3',
          url: 'https://images.unsplash.com/photo-1519167258519-34d08b72f816?w=400&h=500&fit=crop',
          title: 'Garden Venue',
        },
      ],
    },
    {
      id: 'photography',
      title: 'Photography',
      images: [],
    },
  ],
  created_at: new Date(),
  updated_at: new Date(),
  created_by: 'user-1',
})

const ColorPalettePicker: React.FC<{ colors: string[]; onChange: (colors: string[]) => void }> = ({
  colors,
  onChange,
}) => {
  const [newColor, setNewColor] = useState('#D4AF37')

  const addColor = () => {
    if (!colors.includes(newColor)) {
      onChange([...colors, newColor])
    }
  }

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h3 className="text-lg font-serif font-semibold text-wedding-dark mb-4">Color Palette</h3>
      <div className="flex items-end gap-3 mb-6">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-16 h-10 rounded-lg cursor-pointer"
        />
        <Button size="sm" onClick={addColor}>
          <Plus size={16} className="mr-1" />
          Add Color
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, idx) => (
          <div key={idx} className="relative group">
            <div
              className="w-12 h-12 rounded-lg shadow-card border-2 border-gray-200"
              style={{ backgroundColor: color }}
            />
            <button
              onClick={() => removeColor(idx)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <X size={12} />
            </button>
            <span className="text-xs text-gray-500 text-center mt-1 block">{color}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface BoardEditorProps {}

const BoardEditor: React.FC<BoardEditorProps> = () => {
  const router = useRouter()
  const { id } = router.query
  const [board, setBoard] = useState<MoodBoard | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const updateColorPalette = useBoardStore((state) => state.updateColorPalette)

  useEffect(() => {
    if (id && typeof id === 'string') {
      const mockBoard = getMockBoard(id)
      setBoard(mockBoard)
    }
  }, [id])

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement Supabase save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Mood board saved!')
  }

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export coming soon!')
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading mood board...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{board.couple_name} - Wedding Mood Board Pro</title>
        <meta name="description" content={`${board.couple_name}'s wedding mood board`} />
      </Head>

      <Header isLoggedIn={true} userName="Sarah" />

      <main className="min-h-screen bg-wedding-cream px-4 py-8">
        {/* Toolbar */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-wedding-dark">{board.couple_name}</h1>
            <p className="text-gray-600 mt-1">
              Wedding Date: {board.wedding_date.toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download size={18} className="mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <Canvas sections={board.sections} colorPalette={board.theme_color_palette} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ColorPalettePicker
              colors={board.theme_color_palette}
              onChange={(colors) => {
                setBoard({ ...board, theme_color_palette: colors })
                updateColorPalette(colors)
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default BoardEditor
