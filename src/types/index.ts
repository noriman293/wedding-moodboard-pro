// Board Types
export interface BoardSection {
  id: string
  title: string
  images: BoardImage[]
  color?: string
}

export interface BoardImage {
  id: string
  url: string
  cloudinaryId?: string
  title?: string
  description?: string
  position?: { x: number; y: number }
}

export interface MoodBoard {
  id: string
  couple_name: string
  wedding_date: Date
  theme_color_palette: string[]
  sections: BoardSection[]
  created_at: Date
  updated_at: Date
  created_by: string
  collaborators?: string[]
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'couple' | 'designer' | 'admin'
}

// PDF Export Types
export interface PDFExportOptions {
  filename: string
  includeColorPalette: boolean
  includeNotes: boolean
}
