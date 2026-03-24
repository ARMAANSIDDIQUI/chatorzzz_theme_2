const crypto = require('crypto');

// Generate a 64-byte random string in hexadecimal format
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n--- Copy the line below into your .env file ---');
console.log(`JWT_SECRET=${secret}`);
console.log('-------------------------------------------------\n');
