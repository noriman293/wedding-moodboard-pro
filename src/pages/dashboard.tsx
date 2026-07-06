import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Edit2, Share2, Trash2, Calendar, Clock, Heart } from 'lucide-react'

// Mock data - Replace with real data from Supabase
const mockBoards = [
  {
    id: '1',
    couple_name: 'Sarah & John',
    wedding_date: '2024-06-15',
    sections: 3,
    collaborators: 2,
    lastModified: '2 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    couple_name: 'Emma & Michael',
    wedding_date: '2024-08-20',
    sections: 5,
    collaborators: 1,
    lastModified: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    couple_name: 'Lisa & David',
    wedding_date: '2024-09-10',
    sections: 4,
    collaborators: 3,
    lastModified: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
  },
]

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: { couple_name: string; wedding_date: string }) => void
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [coupleName, setCoupleName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!coupleName.trim() || !weddingDate) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      onCreate({ couple_name: coupleName, wedding_date: weddingDate })
      setCoupleName('')
      setWeddingDate('')
      setIsLoading(false)
      onClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-elegant max-w-md w-full p-8 animate-in slide-in">
        <h2 className="text-2xl font-serif font-bold text-wedding-dark mb-6">Create New Mood Board</h2>

        <div className="space-y-4 mb-8">
          <Input
            label="Couple's Names"
            placeholder="e.g., Sarah & John"
            value={coupleName}
            onChange={(e) => setCoupleName(e.target.value)}
          />
          <Input
            label="Wedding Date"
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={!coupleName.trim() || !weddingDate}
          >
            Create Board
          </Button>
        </div>
      </div>
    </div>
  )
}

interface BoardCardProps {
  board: typeof mockBoards[0]
  onEdit: (id: string) => void
  onShare: (id: string) => void
  onDelete: (id: string) => void
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onEdit, onShare, onDelete }) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/board/${board.id}`)
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
      {/* Thumbnail */}
      <div
        className="h-48 bg-gray-200 cursor-pointer relative group overflow-hidden"
        onClick={handleCardClick}
      >
        <img
          src={board.thumbnail}
          alt={board.couple_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold text-wedding-dark mb-2">
          {board.couple_name}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-wedding-gold" />
            <span>{new Date(board.wedding_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-wedding-gold" />
            <span>Updated {board.lastModified}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-wedding-gold" />
            <span>{board.sections} sections • {board.collaborators} collaborators</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => onEdit(board.id)}
          >
            <Edit2 size={16} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => onShare(board.id)}
          >
            <Share2 size={16} />
            Share
          </Button>
          <button
            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
            onClick={() => onDelete(board.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [boards, setBoards] = useState(mockBoards)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCreateBoard = (data: { couple_name: string; wedding_date: string }) => {
    // Here you would call your API to create a board
    console.log('Creating board:', data)
    // For now, just redirect to the board editor
    router.push('/board/new')
  }

  const handleEditBoard = (id: string) => {
    router.push(`/board/${id}`)
  }

  const handleShareBoard = (id: string) => {
    // TODO: Implement share functionality
    alert(`Share board ${id}`)
  }

  const handleDeleteBoard = (id: string) => {
    if (confirm('Are you sure you want to delete this mood board?')) {
      setBoards(boards.filter((b) => b.id !== id))
    }
  }

  const filteredBoards = boards.filter((board) =>
    board.couple_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>Dashboard - Wedding Mood Board Pro</title>
        <meta name="description" content="Manage your wedding mood boards" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header isLoggedIn={true} userName="Sarah" />

      <main className="min-h-screen bg-wedding-cream">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-serif font-bold text-wedding-dark mb-2">
                  Your Mood Boards
                </h1>
                <p className="text-gray-600">
                  You have {boards.length} mood board{boards.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                New Mood Board
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative">
            <Input
              placeholder="Search mood boards by couple name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4"
            />
          </div>
        </div>

        {/* Boards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {filteredBoards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onEdit={handleEditBoard}
                  onShare={handleShareBoard}
                  onDelete={handleDeleteBoard}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-serif font-semibold text-gray-600 mb-2">
                No mood boards found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first mood board to get started!'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Create Your First Board
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBoard}
      />

      <Footer />
    </>
  )
}
