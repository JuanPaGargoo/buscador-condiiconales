import { useState } from 'react'
import { ManualRegexEngine } from './regexEngine'

interface RegexSearcherProps {
  words: string[]
  onMatchesChange: (matches: string[]) => void
}

export function RegexSearcher({ words, onMatchesChange }: RegexSearcherProps) {
  const [regex, setRegex] = useState('')
  const [regexError, setRegexError] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)

  // Función para validar y buscar coincidencias con nuestro motor regex manual
  const searchWithRegex = (regexPattern: string, wordsList: string[]) => {
    if (!regexPattern.trim()) {
      const emptyMatches: string[] = []
      setMatches(emptyMatches)
      setRegexError('')
      onMatchesChange(emptyMatches)
      return
    }

    try {
      // Usar nuestro motor manual (simplificado para números)
      const regexEngine = new ManualRegexEngine(regexPattern)
      
      // Buscar coincidencias en cada palabra
      const foundMatches = wordsList.filter(word => regexEngine.test(word))
      setMatches(foundMatches)
      setRegexError('')
      onMatchesChange(foundMatches)
    } catch (error) {
      setRegexError('Expresión regular inválida: ' + (error as Error).message)
      const emptyMatches: string[] = []
      setMatches(emptyMatches)
      onMatchesChange(emptyMatches)
    }
  }

  // Manejar cambios en el regex
  const handleRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRegex = e.target.value
    setRegex(newRegex)
    searchWithRegex(newRegex, words)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="border-b border-gray-200 pb-3 flex justify-between h-12">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center ">
          Expresión Regular para Números
        </h2>

        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          Guía
        </button>
      </div>
      
      {/* Campo de Regex */}
      <div className="space-y-2">
        <input
          type="text"
          value={regex}
          onChange={handleRegexChange}
          placeholder="Escribe tu expresión regular para números... (ej: ^\d{3}$)"
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            regexError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />
        
        {regexError && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            ⚠️ {regexError}
          </p>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {regex && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
             Coincidencias Encontradas
          </label>
          {matches.length === 0 ? (
            <div className="text-center py-6 text-gray-500 bg-red-50 rounded-lg border border-red-200">
              
              <p>No se encontraron coincidencias</p>
              <p className="text-sm">Prueba con otra expresión regular</p>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600 font-medium">
                  {matches.length} coincidencia{matches.length !== 1 ? 's' : ''} encontrada{matches.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matches.map((match, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-300"
                  >
                    {match}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Modal de ejemplos */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header fijo del modal */}
            <div className="p-6 border-b border-b-gray-300 bg-white rounded-t-xl sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                   Guía de Expresiones Regulares para Números
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido scrolleable del modal */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Introducción */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">¿Qué son las expresiones regulares?</h4>
                  <p className="text-blue-700 text-sm">
                    Las expresiones regulares (regex) son patrones que te permiten buscar, validar y manipular texto de manera muy específica. 
                    Son especialmente útiles para encontrar números con características particulares.
                  </p>
                </div>

                {/* Ejemplos básicos */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Ejemplos Básicos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="font-mono text-green-600 font-semibold mb-2">^\d{"{3}"}$</div>
                      <p className="text-sm text-gray-600 mb-2">Busca números de exactamente 3 dígitos</p>
                      <div className="text-xs text-blue-600">Ejemplo: 123, 456, 789</div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="font-mono text-green-600 font-semibold mb-2">^[1-5]\d{"{2}"}$</div>
                      <p className="text-sm text-gray-600 mb-2">Números de 3 dígitos que empiecen con 1-5</p>
                      <div className="text-xs text-blue-600">Ejemplo: 123, 456, 321</div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="font-mono text-green-600 font-semibold mb-2">^\d*0$</div>
                      <p className="text-sm text-gray-600 mb-2">Números que terminan en 0</p>
                      <div className="text-xs text-blue-600">Ejemplo: 120, 450, 000</div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="font-mono text-green-600 font-semibold mb-2">^[13579]\d*$</div>
                      <p className="text-sm text-gray-600 mb-2">Números que empiecen con dígito impar</p>
                      <div className="text-xs text-blue-600">Ejemplo: 123, 345, 789</div>
                    </div>
                  </div>
                </div>

                {/* Símbolos importantes */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Símbolos Importantes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="font-mono font-bold text-lg text-yellow-800">^</span>
                      <span className="text-sm text-gray-700">Indica el inicio del texto</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="font-mono font-bold text-lg text-yellow-800">$</span>
                      <span className="text-sm text-gray-700">Indica el final del texto</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="font-mono font-bold text-lg text-yellow-800">\d</span>
                      <span className="text-sm text-gray-700">Cualquier dígito del 0 al 9</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="font-mono font-bold text-lg text-yellow-800">{"{n}"}</span>
                      <span className="text-sm text-gray-700">Exactamente n repeticiones</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="font-mono font-bold text-lg text-yellow-800">*</span>
                      <span className="text-sm text-gray-700">Cero o más repeticiones</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="font-mono font-bold text-lg text-yellow-800">[1-5]</span>
                      <span className="text-sm text-gray-700">Cualquier dígito del 1 al 5</span>
                    </div>
                  </div>
                </div>

                {/* Ejemplos avanzados */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Ejemplos Avanzados</h4>
                  <div className="space-y-3">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="font-mono text-purple-600 font-semibold mb-2">^0{"{2,3}"}$</div>
                      <p className="text-sm text-gray-600">Busca solo ceros (2 o 3 dígitos)</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="font-mono text-purple-600 font-semibold mb-2">^\d{"{3}"}$</div>
                      <p className="text-sm text-gray-600">Números de exactamente 3 dígitos</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="font-mono text-purple-600 font-semibold mb-2">^[2468]\d*$</div>
                      <p className="text-sm text-gray-600">Números que empiecen con dígito par</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
