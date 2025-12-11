#!/bin/bash

# Start the server
node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Start ngrok tunnel
ngrok http 3000 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | cut -d'"' -f4 | head -1)

echo "Server running at localhost:3000"
echo "Ngrok tunnel at: $NGROK_URL"

# Run tests
if [ "$NODE_ENV" = "test" ]; then
  # Wait a bit more for everything to be ready
  sleep 1
  
  # Run mocha tests
  ./node_modules/.bin/mocha tests/2_functional-tests.js --timeout 10000
  TEST_RESULT=$?
  
  # Kill the background processes
  kill $SERVER_PID $NGROK_PID
  
  # Exit with test result
  exit $TEST_RESULT
else
  # Keep running if not in test mode
  wait
fi
