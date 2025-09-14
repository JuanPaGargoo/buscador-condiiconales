// Test del regex engine para el patrón ^\d*0$
import { ManualRegexEngine } from './src/regexEngine.ts';

console.log('=== Testing ^\d*0$ pattern ===');

const engine = new ManualRegexEngine('^\\d*0$');

// Casos de prueba
const testCases = [
    '0',      // debería coincidir: 0 dígitos + 0
    '10',     // debería coincidir: 1 dígito + 0  
    '100',    // debería coincidir: 2 dígitos + 0
    '1230',   // debería coincidir: 3 dígitos + 0
    '5',      // NO debería coincidir: termina en 5
    '123',    // NO debería coincidir: termina en 3
    '',       // NO debería coincidir: vacío
    'abc0',   // NO debería coincidir: contiene letras
];

testCases.forEach(testCase => {
    const result = engine.match(testCase);
    console.log(`'${testCase}' -> ${result.found ? 'MATCH' : 'NO MATCH'}`);
    if (result.found) {
        console.log(`  Matched: '${result.matches[0]}'`);
    }
});

// Verificar tokens generados
console.log('\n=== Tokens generados ===');
console.log('Pattern:', engine.pattern);
console.log('Tokens:', engine.tokens);