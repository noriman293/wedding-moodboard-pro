import { create } from 'zustand'
import { MoodBoard, BoardSection, BoardImage } from '@/types'

interface BoardStoreState {
  currentBoard: MoodBoard | null
  setCurrentBoard: (board: MoodBoard) => void
  addImage: (sectionId: string, image: BoardImage) => void
  removeImage: (sectionId: string, imageId: string) => void
  updateColorPalette: (colors: string[]) => void
  addSection: (section: BoardSection) => void
  removeSection: (sectionId: string) => void
  saveBoard: () => Promise<void>
  loadBoard: (boardId: string) => Promise<void>
}

export const useBoardStore = create<BoardStoreState>((set, get) => ({
  currentBoard: null,

  setCurrentBoard: (board) => {
    set({ currentBoard: board })
  },

  addImage: (sectionId, image) => {
    set((state) => {
      if (!state.currentBoard) return state
      return {
        currentBoard: {
          ...state.currentBoard,
          sections: state.currentBoard.sections.map((section) =>
            section.id === sectionId
              ? { ...section, images: [...section.images, image] }
              : section
          ),
        },
      }
    })
  },

  removeImage: (sectionId, imageId) => {
    set((state) => {
      if (!state.currentBoard) return state
      return {
        currentBoard: {
          ...state.currentBoard,
          sections: state.currentBoard.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  images: section.images.filter((img) => img.id !== imageId),
                }
              : section
          ),
        },
      }
    })
  },

  updateColorPalette: (colors) => {
    set((state) => {
      if (!state.currentBoard) return state
      return {
        currentBoard: {
          ...state.currentBoard,
          theme_color_palette: colors,
        },
      }
    })
  },

  addSection: (section) => {
    set((state) => {
      if (!state.currentBoard) return state
      return {
        currentBoard: {
          ...state.currentBoard,
          sections: [...state.currentBoard.sections, section],
        },
      }
    })
  },

  removeSection: (sectionId) => {
    set((state) => {
      if (!state.currentBoard) return state
      return {
        currentBoard: {
          ...state.currentBoard,
          sections: state.currentBoard.sections.filter((s) => s.id !== sectionId),
        },
      }
    })
  },

  saveBoard: async () => {
    const state = get()
    if (!state.currentBoard) return

    try {
      // TODO: Implement Supabase save
      console.log('Saving board:', state.currentBoard)
    } catch (error) {
      console.error('Error saving board:', error)
    }
  },

  loadBoard: async (boardId) => {
    try {
      // TODO: Implement Supabase load
      console.log('Loading board:', boardId)
    } catch (error) {
      console.error('Error loading board:', error)
    }
  },
}))
