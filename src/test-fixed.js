// Test simple usando el componente React existente
import { ManualRegexEngine } from './regexEngine.js';

console.log('=== Testing ^\d*0$ with corrected engine ===');

const engine = new ManualRegexEngine('^\\d*0$');

const testCases = [
    '0',      // debería coincidir
    '10',     // debería coincidir  
    '100',    // debería coincidir
    '1230',   // debería coincidir
    '5',      // NO debería coincidir
    '123',    // NO debería coincidir
    '',       // NO debería coincidir
    'abc0',   // NO debería coincidir
];

testCases.forEach(testCase => {
    try {
        const result = engine.test(testCase);
        console.log(`'${testCase}' -> ${result ? 'MATCH ✓' : 'NO MATCH ✗'}`);
    } catch (error) {
        console.log(`'${testCase}' -> ERROR: ${error.message}`);
    }
});

console.log('\n=== Testing individual steps for "10" ===');
try {
    const result = engine.match('10');
    console.log('Full result:', result);
} catch (error) {
    console.log('ERROR:', error.message);
}