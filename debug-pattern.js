// Test simple para debuggear el patrón ^\d*0$
console.log('=== Debugging ^\d*0$ pattern ===');

// Simular el parsing manual
const pattern = '^\\d*0$';
console.log('Pattern:', pattern);

// Simulemos el tokenizado paso a paso
const tokens = [];
let i = 0;

while (i < pattern.length) {
    const char = pattern[i];
    console.log(`Char ${i}: '${char}'`);
    
    switch (char) {
        case '^':
            tokens.push({ type: 'start', value: '^' });
            i++;
            break;
        case '$':
            tokens.push({ type: 'end', value: '$' });
            i++;
            break;
        case '*':
            tokens.push({ type: 'star', value: '*' });
            i++;
            break;
        case '\\':
            i++;
            if (i < pattern.length) {
                const nextChar = pattern[i];
                if (nextChar === 'd') {
                    tokens.push({ type: 'digit', value: '\\d' });
                } else {
                    tokens.push({ type: 'literal', value: nextChar });
                }
                i++;
            }
            break;
        default:
            tokens.push({ type: 'literal', value: char });
            i++;
    }
}

console.log('Tokens esperados:', tokens);
console.log('\nEsto debería generar: [start, digit, star, literal(0), end]');