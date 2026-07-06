import React from 'react'
import { BoardSection } from '@/types'

interface CanvasProps {
  sections: BoardSection[]
  colorPalette: string[]
}

export const Canvas: React.FC<CanvasProps> = ({ sections, colorPalette }) => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-elegant p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-4">
            <h3 className="text-2xl font-serif text-wedding-dark">{section.title}</h3>
            <div className="grid grid-cols-2 gap-4 min-h-96 bg-gray-50 rounded-lg p-4">
              {/* Images will be placed here via drag and drop */}
            </div>
          </div>
        ))}
      </div>

      {/* Color Palette Preview */}
      {colorPalette.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="text-lg font-serif text-wedding-dark mb-4">Color Palette</h4>
          <div className="flex gap-4">
            {colorPalette.map((color, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-lg shadow-card border-2 border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
