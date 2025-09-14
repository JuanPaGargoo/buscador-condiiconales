// Test específico para ^\d*0$ - debug manual
console.log("=== Debug manual para entender el problema ===");
console.log("Patrón: ^\\d*0$");
console.log("Texto: '10'");

// Vamos a hacer debug manual paso a paso
console.log('\n=== Manual step debugging ===');

const text = '10';
const startPos = 0;
let pos = startPos;
let tokenIndex = 0;
let matchedStr = '';

// Simular los tokens: [start, digit, star, literal(0), end]
console.log('Expected tokens: start, digit, star, literal(0), end');

// Token 0: start
console.log(`Token 0 (start): pos=${pos}, should be 0`);
if (pos === 0) {
    console.log('✓ Start token matched');
    tokenIndex = 1;
} else {
    console.log('✗ Start token failed');
}

// Token 1: digit + Token 2: star
console.log(`Token 1+2 (\\d*): pos=${pos}, text[${pos}]='${text[pos]}'`);
// Debería consumir dígitos mientras pueda, mínimo 0
let consumedDigits = '';
let digitCount = 0;
while (pos < text.length && text[pos] >= '0' && text[pos] <= '9') {
    consumedDigits += text[pos];
    pos++;
    digitCount++;
}
console.log(`Consumed ${digitCount} digits: '${consumedDigits}'`);
console.log(`New pos: ${pos}`);
matchedStr += consumedDigits;
tokenIndex = 3; // Skip to literal(0)

// Token 3: literal(0)
console.log(`Token 3 (literal 0): pos=${pos}, text[${pos}]='${text[pos] || 'EOF'}'`);
if (pos < text.length && text[pos] === '0') {
    console.log('✓ Literal 0 matched');
    matchedStr += '0';
    pos++;
    tokenIndex = 4;
} else {
    console.log('✗ Literal 0 failed');
}

// Token 4: end
console.log(`Token 4 (end): pos=${pos}, text.length=${text.length}`);
if (pos === text.length) {
    console.log('✓ End token matched');
    console.log(`Final match: '${matchedStr}'`);
} else {
    console.log('✗ End token failed');
}