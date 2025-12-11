const ngrok = require('ngrok');
const Mocha = require('mocha');
const path = require('path');
const server = require('./server');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 500));

    // Start ngrok tunnel
    const url = await ngrok.connect({
      proto: 'http',
      addr: PORT,
      onStatusChange: (status) => {
        console.log(`ngrok tunnel status: ${status}`);
      }
    });

    console.log(`ngrok tunnel: ${url}`);
    console.log(`Server accessible at ${url}`);

    // Wait a bit for tunnel to be fully ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Run tests
    const mocha = new Mocha({
      timeout: 10000,
      reporter: 'spec'
    });

    mocha.addFile(path.join(__dirname, 'tests/2_functional-tests.js'));

    mocha.run(async (failures) => {
      // Disconnect ngrok
      await ngrok.disconnect();
      
      // Exit with proper code
      process.exit(failures ? 1 : 0);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
