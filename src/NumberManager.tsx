import { useState } from 'react'

interface NumberManagerProps {
  words: string[]
  matches: string[]
  onWordsChange: (words: string[]) => void
}

export function NumberManager({ words, matches, onWordsChange }: NumberManagerProps) {
  const [newWord, setNewWord] = useState('')

  // Validar si el input actual es válido
  const isValidInput = newWord.trim() === '' || /^\d+$/.test(newWord.trim())

  // Agregar nueva palabra (solo números)
  const addWord = () => {
    const trimmedWord = newWord.trim()
    
    // Validar que solo contenga números
    if (trimmedWord && /^\d+$/.test(trimmedWord) && !words.includes(trimmedWord)) {
      const updatedWords = [...words, trimmedWord]
      onWordsChange(updatedWords)
      setNewWord('')
    }
  }

  // Eliminar palabra
  const removeWord = (wordToRemove: string) => {
    const updatedWords = words.filter(word => word !== wordToRemove)
    onWordsChange(updatedWords)
  }

  // Manejar Enter en el campo de nueva palabra
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidInput && newWord.trim()) {
      addWord()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="border-b border-gray-200 pb-3 flex justify-between h-12">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center ">
        Agregar Números
        </h2>
        
      </div>

      {/* Campo para agregar palabras */}
      <div className="space-y-2">
        
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un número y presiona Enter..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                isValidInput 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200' 
                  : 'border-red-300 focus:border-red-500 focus:ring-red-200'
              }`}
            />
            {/* Contenedor con altura fija para el mensaje de error */}
            <div className="h-6 mt-1">
              {!isValidInput && (
                <p className="text-sm text-red-600 font-medium">
                    Solo se pueden escribir números
                </p>
              )}
            </div>
          </div>
          <button
            onClick={addWord}
            disabled={!newWord.trim() || !/^\d+$/.test(newWord.trim())}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de palabras */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Lista de Números ({words.length})
        </label>
        {words.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            
            <p>No hay números en la lista</p>
            <p className="text-sm">Agrega algunos números para comenzar</p>
          </div>
        ) : (
          <div className={`space-y-2 p-4 bg-gray-50 rounded-lg border ${words.length > 4 ? 'max-h-70 overflow-y-auto' : ''}`}>
            {words.map((word, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  matches.includes(word)
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <span className="font-mono text-lg">{word}</span>
                <button
                  onClick={() => removeWord(word)}
                  className="ml-2 px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar número"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
