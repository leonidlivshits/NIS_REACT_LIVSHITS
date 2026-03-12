const bcrypt = require('bcrypt');

async function generate() {
  const hash = await bcrypt.hash('password', 10);
  console.log('Your hash:', hash);
}

generate();