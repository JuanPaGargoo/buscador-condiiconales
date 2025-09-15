// Motor de Regex Manual para Números - Sin usar funciones nativas
// Solo implementa patrones necesarios para números

export interface MatchResult {
  found: boolean;
  matches: string[];
  positions: Array<{ start: number; end: number; value: string }>;
}

// Tokens del parser - solo los relevantes para números
interface Token {
  type: 'digit' | 'dot' | 'start' | 'end' | 'star' | 'plus' | 'question' | 'quantifier' | 
        'charClass' | 'negCharClass' | 'literal';
  value: string;
  min?: number;
  max?: number;
  chars?: string[];
  negate?: boolean;
}

export class ManualRegexEngine {
  private pattern: string;
  private tokens: Token[] = [];

  constructor(pattern: string) {
    this.pattern = pattern;
    this.parsePattern();
  }

  // Parser del patrón regex - solo para patrones numéricos
  private parsePattern(): void {
    this.tokens = [];
    let i = 0;

    while (i < this.pattern.length) {
      const char = this.pattern[i];

      switch (char) {
        case '^':
          this.tokens.push({ type: 'start', value: '^' });
          i++;
          break;

        case '$':
          this.tokens.push({ type: 'end', value: '$' });
          i++;
          break;

        case '.':
          this.tokens.push({ type: 'dot', value: '.' });
          i++;
          break;

        case '*':
          this.tokens.push({ type: 'star', value: '*' });
          i++;
          break;

        case '+':
          this.tokens.push({ type: 'plus', value: '+' });
          i++;
          break;

        case '?':
          this.tokens.push({ type: 'question', value: '?' });
          i++;
          break;

        case '\\':
          i++;
          if (i < this.pattern.length) {
            const nextChar = this.pattern[i];
            if (nextChar === 'd') {
              this.tokens.push({ type: 'digit', value: '\\d' });
            } else {
              // Carácter escapado literal
              this.tokens.push({ type: 'literal', value: nextChar });
            }
            i++;
          }
          break;

        case '[': {
          const classResult = this.parseCharacterClass(i);
          this.tokens.push(classResult.token);
          i = classResult.newIndex;
          break;
        }

        case '{': {
          const quantResult = this.parseQuantifier(i);
          if (quantResult) {
            this.tokens.push(quantResult.token);
            i = quantResult.newIndex;
          } else {
            this.tokens.push({ type: 'literal', value: char });
            i++;
          }
          break;
        }

        default:
          this.tokens.push({ type: 'literal', value: char });
          i++;
      }
    }
  }

  // Parser de clases de caracteres [0-9] o [^0-9] - solo para números
  private parseCharacterClass(startIndex: number): { token: Token; newIndex: number } {
    let i = startIndex + 1; // Saltar '['
    const chars: string[] = [];
    let negate = false;

    if (i < this.pattern.length && this.pattern[i] === '^') {
      negate = true;
      i++;
    }

    while (i < this.pattern.length && this.pattern[i] !== ']') {
      const char = this.pattern[i];
      
      if (char === '-' && chars.length > 0 && i + 1 < this.pattern.length) {
        // Rango de caracteres como 0-9
        const start = chars[chars.length - 1];
        const end = this.pattern[i + 1];
        chars.pop(); // Remover el carácter de inicio
        
        const startCode = start.charCodeAt(0);
        const endCode = end.charCodeAt(0);
        
        for (let code = startCode; code <= endCode; code++) {
          chars.push(String.fromCharCode(code));
        }
        i += 2;
      } else {
        chars.push(char);
        i++;
      }
    }

    return {
      token: {
        type: negate ? 'negCharClass' : 'charClass',
        value: this.pattern.substring(startIndex, i + 1),
        chars,
        negate
      },
      newIndex: i + 1
    };
  }

  // Parser de cuantificadores {n}, {n,}, {n,m}, {,n}
  private parseQuantifier(startIndex: number): { token: Token; newIndex: number } | null {
    let i = startIndex + 1; // Saltar '{'
    let numberStr = '';

    // Verificar si empieza directamente con coma {,n}
    if (i < this.pattern.length && this.pattern[i] === ',') {
      // Caso {,n} - min = 0, max = n
      i++; // Saltar la coma
      let maxStr = '';
      
      // Leer el número después de la coma
      while (i < this.pattern.length && this.isDigit(this.pattern[i])) {
        maxStr += this.pattern[i];
        i++;
      }

      if (maxStr === '') return null; // {,} no es válido

      // Verificar cierre '}'
      if (i < this.pattern.length && this.pattern[i] === '}') {
        return {
          token: {
            type: 'quantifier',
            value: this.pattern.substring(startIndex, i + 1),
            min: 0,
            max: parseInt(maxStr, 10)
          },
          newIndex: i + 1
        };
      }

      return null;
    }

    // Leer primer número (caso normal)
    while (i < this.pattern.length && this.isDigit(this.pattern[i])) {
      numberStr += this.pattern[i];
      i++;
    }

    if (numberStr === '') return null; // {} no es válido

    const min = parseInt(numberStr, 10);
    let max = min;

    // Verificar si hay coma
    if (i < this.pattern.length && this.pattern[i] === ',') {
      i++;
      let maxStr = '';
      
      // Leer segundo número (opcional para {n,})
      while (i < this.pattern.length && this.isDigit(this.pattern[i])) {
        maxStr += this.pattern[i];
        i++;
      }

      max = maxStr === '' ? Infinity : parseInt(maxStr, 10);
    }

    // Verificar cierre '}'
    if (i < this.pattern.length && this.pattern[i] === '}') {
      return {
        token: {
          type: 'quantifier',
          value: this.pattern.substring(startIndex, i + 1),
          min,
          max
        },
        newIndex: i + 1
      };
    }

    return null;
  }

  // Función auxiliar para verificar dígitos
  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  // Motor de matching principal - simplificado para números
  public match(text: string): MatchResult {
    const result: MatchResult = {
      found: false,
      matches: [],
      positions: []
    };

    if (this.tokens.length === 0) return result;

    // Buscar todas las coincidencias
    for (let i = 0; i <= text.length; i++) {
      const matchResult = this.matchAtPosition(text, i);
      if (matchResult.success) {
        result.found = true;
        result.matches.push(matchResult.match);
        result.positions.push({
          start: i,
          end: i + matchResult.match.length,
          value: matchResult.match
        });
        break; // Solo la primera coincidencia para simplicidad
      }
    }

    return result;
  }

  // Matching en una posición específica - con backtracking mejorado
  private matchAtPosition(text: string, startPos: number): { success: boolean; match: string } {
    return this.matchTokensRecursive(this.tokens, text, startPos, 0);
  }

  // Método recursivo para matching con backtracking
  private matchTokensRecursive(tokens: Token[], text: string, pos: number, tokenIndex: number): { success: boolean; match: string } {
    // Caso base: hemos procesado todos los tokens
    if (tokenIndex >= tokens.length) {
      return { success: true, match: text.substring(0, pos) };
    }

    const token = tokens[tokenIndex];
    const nextToken = tokenIndex + 1 < tokens.length ? tokens[tokenIndex + 1] : null;

    if (nextToken && this.isQuantifierToken(nextToken)) {
      // Manejar token con cuantificador usando backtracking
      return this.handleQuantifierWithBacktrack(token, nextToken, tokens, text, pos, tokenIndex);
    } else {
      // Token simple sin cuantificador
      const matchResult = this.matchToken(token, text, pos);
      if (!matchResult.success) {
        return { success: false, match: '' };
      }

      const newPos = pos + matchResult.consumed.length;
      const remainingResult = this.matchTokensRecursive(tokens, text, newPos, tokenIndex + 1);
      
      if (remainingResult.success) {
        // El match total es desde el inicio hasta donde terminamos
        return { success: true, match: text.substring(0, newPos) };
      } else {
        return { success: false, match: '' };
      }
    }
  }

  // Manejar cuantificadores con backtracking real
  private handleQuantifierWithBacktrack(baseToken: Token, quantToken: Token, allTokens: Token[], text: string, startPos: number, tokenIndex: number): { success: boolean; match: string } {
    let targetMin = quantToken.min || 0;
    let targetMax = quantToken.max || Infinity;

    if (quantToken.type === 'star') {
      targetMin = 0;
      targetMax = Infinity;
    } else if (quantToken.type === 'plus') {
      targetMin = 1;
      targetMax = Infinity;
    } else if (quantToken.type === 'question') {
      targetMin = 0;
      targetMax = 1;
    }

    // Calcular cuántos tokens podemos consumir como máximo
    const maxPossible = Math.min(targetMax, text.length - startPos);
    
    // Intentar desde el máximo hacia el mínimo (backtracking)
    for (let tryCount = maxPossible; tryCount >= targetMin; tryCount--) {
      let pos = startPos;
      let actualCount = 0;

      // Intentar consumir exactamente tryCount tokens
      while (actualCount < tryCount && pos < text.length) {
        const tokenResult = this.matchToken(baseToken, text, pos);
        if (!tokenResult.success) break;

        pos += tokenResult.consumed.length;
        actualCount++;
      }

      // Si logramos consumir lo esperado, intentar con el resto del patrón
      if (actualCount === tryCount) {
        const remainingResult = this.matchTokensRecursive(allTokens, text, pos, tokenIndex + 2);
        if (remainingResult.success) {
          // El match es el texto completo que hemos procesado hasta ahora
          return { success: true, match: remainingResult.match };
        }
      }
    }

    return { success: false, match: '' };
  }

  // Matching de un token individual - solo para números
  private matchToken(token: Token, text: string, pos: number): { success: boolean; consumed: string } {
    if (pos >= text.length && token.type !== 'end') {
      return { success: false, consumed: '' };
    }

    switch (token.type) {
      case 'start':
        return { success: pos === 0, consumed: '' };

      case 'end':
        return { success: pos === text.length, consumed: '' };

      case 'literal': {
        const char = text[pos];
        return { success: char === token.value, consumed: char === token.value ? char : '' };
      }

      case 'dot': {
        const dotChar = text[pos];
        return { success: true, consumed: dotChar };
      }

      case 'digit': {
        const digitChar = text[pos];
        const isDigitMatch = this.isDigit(digitChar);
        return { success: isDigitMatch, consumed: isDigitMatch ? digitChar : '' };
      }

      case 'charClass': {
        const classChar = text[pos];
        const inClass = token.chars?.includes(classChar) || false;
        return { success: inClass, consumed: inClass ? classChar : '' };
      }

      case 'negCharClass': {
        const negClassChar = text[pos];
        const notInClass = !(token.chars?.includes(negClassChar) || false);
        return { success: notInClass, consumed: notInClass ? negClassChar : '' };
      }

      default:
        return { success: false, consumed: '' };
    }
  }

  private isQuantifierToken(token: Token): boolean {
    return ['star', 'plus', 'question', 'quantifier'].includes(token.type);
  }

  // Método público para testing
  public test(text: string): boolean {
    return this.match(text).found;
  }

  // Método para obtener todas las coincidencias
  public findAll(text: string): string[] {
    const result = this.match(text);
    return result.matches;
  }
}
