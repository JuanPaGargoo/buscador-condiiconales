// Test para verificar que {,n} funciona correctamente
console.log('=== Testing {,n} quantifier syntax ===');

// Simular el parsing del cuantificador {,3}
const pattern = '\\d{,3}';
console.log('Pattern:', pattern);

// Simular parseQuantifier manualmente para {,3}
function testParseQuantifier(pattern, startIndex) {
    let i = startIndex + 1; // Saltar '{'
    
    console.log(`Starting at index ${i}, char: '${pattern[i]}'`);
    
    // Verificar si empieza directamente con coma {,n}
    if (i < pattern.length && pattern[i] === ',') {
        console.log('Found comma at start - parsing {,n} format');
        i++; // Saltar la coma
        let maxStr = '';
        
        // Leer el número después de la coma
        while (i < pattern.length && pattern[i] >= '0' && pattern[i] <= '9') {
            maxStr += pattern[i];
            console.log(`Reading digit: '${pattern[i]}', maxStr now: '${maxStr}'`);
            i++;
        }
        
        if (maxStr === '') {
            console.log('ERROR: {,} is not valid');
            return null;
        }
        
        // Verificar cierre '}'
        if (i < pattern.length && pattern[i] === '}') {
            console.log(`Found closing '}' at index ${i}`);
            const token = {
                type: 'quantifier',
                value: pattern.substring(startIndex, i + 1),
                min: 0,
                max: parseInt(maxStr, 10)
            };
            console.log('Generated token:', token);
            return { token, newIndex: i + 1 };
        }
        
        console.log('ERROR: No closing }');
        return null;
    }
    
    console.log('Not a {,n} pattern');
    return null;
}

// Test parseQuantifier con {,3}
const result = testParseQuantifier('\\d{,3}', 2); // índice 2 es donde está '{'

console.log('\n=== Expected behavior ===');
console.log('Pattern \\d{,3} should match:');
console.log('- "" (0 digits) ✓');
console.log('- "1" (1 digit) ✓');  
console.log('- "12" (2 digits) ✓');
console.log('- "123" (3 digits) ✓');
console.log('- "1234" should only match first 3 digits');

console.log('\n=== Test other formats ===');
console.log('Testing {,5}:', testParseQuantifier('{,5}', 0));
console.log('Testing {,0}:', testParseQuantifier('{,0}', 0));
console.log('Testing {,}:', testParseQuantifier('{,}', 0)); // Should be null