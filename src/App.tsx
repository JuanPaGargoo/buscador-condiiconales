import { useState } from 'react'
import './App.css'
import { RegexSearcher } from './RegexSearcher'
import { NumberManager } from './NumberManager'

function App() {
  const [words, setWords] = useState<string[]>([
    '123', '456', '789', '012', '999', '000'
  ])
  const [matches, setMatches] = useState<string[]>([])

  // Manejar cambios en la lista de palabras
  const handleWordsChange = (newWords: string[]) => {
    setWords(newWords)
  }

  // Manejar cambios en las coincidencias
  const handleMatchesChange = (newMatches: string[]) => {
    setMatches(newMatches)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
           Buscador con Expresiones Regulares
        </h1>
        
        <div className="flex gap-8 w-full max-w-[90%] mx-auto">
          {/* Componente de búsqueda regex */}
          <div className="flex-1">
            <RegexSearcher
              words={words}
              onMatchesChange={handleMatchesChange}
            />
          </div>
          
          {/* Componente de gestión de números */}
          <div className="flex-1">
            <NumberManager
              words={words}
              matches={matches}
              onWordsChange={handleWordsChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
