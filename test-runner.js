const Mocha = require('mocha');
const path = require('path');
const server = require('./server');

// Give server time to start
setTimeout(() => {
  const mocha = new Mocha({
    timeout: 10000
  });

  mocha.addFile(path.join(__dirname, 'tests/2_functional-tests.js'));

  mocha.run((failures) => {
    process.exit(failures ? 1 : 0);
  });
}, 1000);
