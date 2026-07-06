import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { BoardImage, BoardSection } from '@/types'
import { useBoardStore } from '@/store/boardStore'
import { ImageCard } from './ImageCard'

/**
 * Props untuk DragDropContainer Component
 */
interface DragDropContainerProps {
  sections: BoardSection[]
  onSectionReorder?: (sections: BoardSection[]) => void
  onImageMove?: (fromSectionId: string, toSectionId: string, imageId: string) => void
}

/**
 * State untuk tracking drag operation
 */
interface DragState {
  activeId: string | null
  activeSectionId: string | null
  activeImage: BoardImage | null
}

/**
 * DragDropContainer Component
 * Menguruskan drag & drop functionality antara sections dan images
 * Menggunakan dnd-kit library untuk smooth dan accessible drag experience
 */
export const DragDropContainer: React.FC<DragDropContainerProps> = ({
  sections,
  onSectionReorder,
  onImageMove,
}) => {
  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    activeSectionId: null,
    activeImage: null,
  })

  // Get store actions
  const { reorderImages, reorderSections } = useBoardStore()

  /**
   * Configure sensors untuk drag detection
   * PointerSensor: Detect mouse/touch dengan delay untuk menghindari accidental drags
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8, // Minimum distance before drag starts (pixels)
      activationConstraint: {
        delay: 250, // Delay sebelum drag dimulai (ms)
        tolerance: 5,
      },
    })
  )

  /**
   * Handle drag start event
   * Save informasi tentang item yang sedang di-drag
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeId = active.id as string

    // Find section and image yang di-drag
    let activeImage: BoardImage | null = null
    let activeSectionId: string | null = null

    for (const section of sections) {
      const image = section.images.find((img) => img.id === activeId)
      if (image) {
        activeImage = image
        activeSectionId = section.id
        break
      }
    }

    setDragState({
      activeId,
      activeSectionId,
      activeImage,
    })
  }

  /**
   * Handle drag end event
   * Proses permindahan item atau reordering
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // Reset drag state
    setDragState({
      activeId: null,
      activeSectionId: null,
      activeImage: null,
    })

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Jika drop di lokasi yang sama, tidak perlu lakukan apa-apa
    if (activeId === overId) return

    // Case 1: Drag image dalam section yang sama (reorder)
    // Format ID: "section-{sectionId}-image-{imageId}"
    if (activeId.startsWith('image-') && overId.startsWith('image-')) {
      const activeSectionId = active.data.current?.sectionId
      const overSectionId = over.data.current?.sectionId

      if (activeSectionId === overSectionId) {
        // Reorder images dalam section
        const section = sections.find((s) => s.id === activeSectionId)
        if (section) {
          const oldIndex = section.images.findIndex((img) => img.id === activeId)
          const newIndex = section.images.findIndex((img) => img.id === overId)

          if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedImages = arrayMove(section.images, oldIndex, newIndex)
            reorderImages(activeSectionId, reorderedImages)
          }
        }
      } else if (activeSectionId && overSectionId) {
        // Move image ke section lain
        onImageMove?.(activeSectionId, overSectionId, activeId)
      }
    }

    // Case 2: Drag section untuk reorder sections
    if (activeId.startsWith('section-') && overId.startsWith('section-')) {
      const oldIndex = sections.findIndex((s) => s.id === activeId)
      const newIndex = sections.findIndex((s) => s.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedSections = arrayMove(sections, oldIndex, newIndex)
        reorderSections(reorderedSections)
        onSectionReorder?.(reorderedSections)
      }
    }
  }

  // Get all section IDs untuk SortableContext
  const sectionIds = sections.map((section) => section.id)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Render sections with images */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            data-section-id={section.id}
            className="bg-white rounded-lg shadow-card p-6 hover:shadow-elegant transition-shadow duration-300"
          >
            {/* Section Header */}
            <h3 className="text-2xl font-serif font-semibold text-wedding-dark mb-6">
              {section.title}
            </h3>

            {/* Images Grid with Sortable Context */}
            <SortableContext
              items={section.images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 min-h-48 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-wedding-gold transition-colors duration-300">
                {section.images.length > 0 ? (
                  section.images.map((image) => (
                    <div
                      key={image.id}
                      id={`image-${image.id}`}
                      data-section-id={section.id}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <ImageCard
                        image={image}
                        isDragging={dragState.activeId === image.id}
                      />
                    </div>
                  ))
                ) : (
                  // Empty State
                  <div className="col-span-full flex items-center justify-center h-48 text-gray-400">
                    <div className="text-center">
                      <p className="text-sm font-medium">Tarik gambar ke sini</p>
                      <p className="text-xs mt-1">atau upload gambar baru</p>
                    </div>
                  </div>
                )}
              </div>
            </SortableContext>

            {/* Image Count */}
            <div className="mt-4 text-sm text-gray-600">
              {section.images.length} gambar dalam seksyen ini
            </div>
          </div>
        ))}
      </div>

      {/* Drag Overlay - Shows what's being dragged */}
      <DragOverlay>
        {dragState.activeImage ? (
          <div className="opacity-80 scale-110">
            <ImageCard image={dragState.activeImage} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
