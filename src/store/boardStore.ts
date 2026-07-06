import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MoodBoard, BoardSection, BoardImage } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * Board Store State Interface
 * Mendefinisikan semua state dan methods yang diperlukan untuk menguruskan mood board
 */
interface BoardStoreState {
  // State
  currentBoard: MoodBoard | null
  boards: MoodBoard[]
  isLoading: boolean
  error: string | null

  // Board Management
  setCurrentBoard: (board: MoodBoard) => void
  createBoard: (coupleName: string, weddingDate: Date) => void
  deleteBoard: (boardId: string) => void
  updateBoardMetadata: (boardId: string, data: Partial<MoodBoard>) => void

  // Section Management
  addSection: (section: BoardSection) => void
  updateSection: (sectionId: string, data: Partial<BoardSection>) => void
  removeSection: (sectionId: string) => void
  reorderSections: (sections: BoardSection[]) => void

  // Image Management
  addImage: (sectionId: string, image: BoardImage) => void
  updateImage: (sectionId: string, imageId: string, data: Partial<BoardImage>) => void
  removeImage: (sectionId: string, imageId: string) => void
  reorderImages: (sectionId: string, images: BoardImage[]) => void

  // Color Palette Management
  updateColorPalette: (colors: string[]) => void
  addColorToBoard: (color: string) => void
  removeColorFromBoard: (color: string) => void

  // Persistence & Sync
  saveBoard: () => Promise<void>
  loadBoard: (boardId: string) => Promise<void>
  clearError: () => void
}

/**
 * Zustand Board Store
 * Menguruskan state global untuk mood board application dengan persistence
 */
export const useBoardStore = create<BoardStoreState>(
  persist(
    (set, get) => ({
      // Initial State
      currentBoard: null,
      boards: [],
      isLoading: false,
      error: null,

      /**
       * Set current board yang sedang diedit
       */
      setCurrentBoard: (board) => {
        set({ currentBoard: board })
      },

      /**
       * Create new mood board dengan metadata awal
       */
      createBoard: (coupleName, weddingDate) => {
        const newBoard: MoodBoard = {
          id: generateId(),
          couple_name: coupleName,
          wedding_date: weddingDate,
          theme_color_palette: [],
          sections: [
            {
              id: generateId(),
              title: 'Bridal Look',
              images: [],
            },
            {
              id: generateId(),
              title: 'Venue & Decor',
              images: [],
            },
            {
              id: generateId(),
              title: 'Photography',
              images: [],
            },
          ],
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 'current-user', // TODO: Replace with actual user ID
          collaborators: [],
        }

        set((state) => ({
          currentBoard: newBoard,
          boards: [...state.boards, newBoard],
        }))
      },

      /**
       * Delete mood board dari list
       */
      deleteBoard: (boardId) => {
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== boardId),
          currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard,
        }))
      },

      /**
       * Update metadata mood board (couple name, wedding date, etc.)
       */
      updateBoardMetadata: (boardId, data) => {
        set((state) => {
          const updatedBoards = state.boards.map((board) =>
            board.id === boardId
              ? { ...board, ...data, updated_at: new Date() }
              : board
          )

          return {
            boards: updatedBoards,
            currentBoard:
              state.currentBoard?.id === boardId
                ? { ...state.currentBoard, ...data, updated_at: new Date() }
                : state.currentBoard,
          }
        })
      },

      /**
       * Tambah section baru ke current board
       * Contoh: "Makeup", "Reception", "Photography", etc.
       */
      addSection: (section) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections: [...state.currentBoard.sections, section],
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Update section (e.g., ubah title)
       */
      updateSection: (sectionId, data) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections: state.currentBoard.sections.map((section) =>
              section.id === sectionId ? { ...section, ...data } : section
            ),
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Remove section dari board
       * Semua images dalam section akan dihapus
       */
      removeSection: (sectionId) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections: state.currentBoard.sections.filter(
              (section) => section.id !== sectionId
            ),
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Reorder sections (untuk drag & drop functionality)
       */
      reorderSections: (sections) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections,
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Tambah image ke section tertentu
       * Image akan ditambah dengan ID unik
       */
      addImage: (sectionId, image) => {
        set((state) => {
          if (!state.currentBoard) return state

          const imageWithId: BoardImage = {
            ...image,
            id: image.id || generateId(),
          }

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections: state.currentBoard.sections.map((section) =>
              section.id === sectionId
                ? { ...section, images: [...section.images, imageWithId] }
                : section
            ),
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Update image metadata (title, description, position)
       */
      updateImage: (sectionId, imageId, data) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections: state.currentBoard.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    images: section.images.map((img) =>
                      img.id === imageId ? { ...img, ...data } : img
                    ),
                  }
                : section
            ),
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Remove image dari section
       */
      removeImage: (sectionId, imageId) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections: state.currentBoard.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    images: section.images.filter((img) => img.id !== imageId),
                  }
                : section
            ),
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Reorder images dalam section (untuk drag & drop)
       */
      reorderImages: (sectionId, images) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            sections: state.currentBoard.sections.map((section) =>
              section.id === sectionId
                ? { ...section, images }
                : section
            ),
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Update color palette (replace semua warna)
       */
      updateColorPalette: (colors) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            theme_color_palette: colors,
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Tambah warna baru ke palette (max 6 warna)
       */
      addColorToBoard: (color) => {
        set((state) => {
          if (!state.currentBoard) return state
          if (state.currentBoard.theme_color_palette.length >= 6) return state
          if (state.currentBoard.theme_color_palette.includes(color)) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            theme_color_palette: [...state.currentBoard.theme_color_palette, color],
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Remove warna dari palette
       */
      removeColorFromBoard: (color) => {
        set((state) => {
          if (!state.currentBoard) return state

          const updatedBoard: MoodBoard = {
            ...state.currentBoard,
            theme_color_palette: state.currentBoard.theme_color_palette.filter(
              (c) => c !== color
            ),
            updated_at: new Date(),
          }

          return {
            currentBoard: updatedBoard,
            boards: state.boards.map((b) =>
              b.id === updatedBoard.id ? updatedBoard : b
            ),
          }
        })
      },

      /**
       * Save board ke Supabase
       * TODO: Integrate dengan Supabase API
       */
      saveBoard: async () => {
        const state = get()
        if (!state.currentBoard) return

        set({ isLoading: true, error: null })
        try {
          // Simulated API call - Replace dengan Supabase integration
          await new Promise((resolve) => setTimeout(resolve, 500))
          console.log('Board saved:', state.currentBoard)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to save board'
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      /**
       * Load board dari Supabase berdasarkan ID
       * TODO: Integrate dengan Supabase API
       */
      loadBoard: async (boardId) => {
        set({ isLoading: true, error: null })
        try {
          // Simulated API call - Replace dengan Supabase integration
          await new Promise((resolve) => setTimeout(resolve, 500))
          console.log('Board loaded:', boardId)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load board'
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'board-store', // LocalStorage key
      partialize: (state) => ({
        boards: state.boards,
        currentBoard: state.currentBoard,
      }),
    }
  )
)

/**
 * Convenience hooks untuk component-level usage
 */
export const useBoard = () => useBoardStore((state) => state.currentBoard)
export const useBoards = () => useBoardStore((state) => state.boards)
export const useBoardLoading = () => useBoardStore((state) => state.isLoading)
export const useBoardError = () => useBoardStore((state) => state.error)
