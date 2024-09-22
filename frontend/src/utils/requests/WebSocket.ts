import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

// Create a new connection to the hub
const connection = new HubConnectionBuilder().withUrl('http://localhost:5002/tableHub', {
accessTokenFactory: () => {
    const token = localStorage.getItem('token');
    if (!token) {
    throw new Error('Token not found in local storage');
    }
    return token;
},
}).build();
// Start the connection
connection.start()
.then(() => {
console.log('WebSocket connection started!');

// Listen for connection state changes
connection.on('stateChanged', (state) => {
    console.log('Connection state:', state);
    if (state === HubConnectionState.Connected) {
    console.log('WebSocket connection established!');
    }
});

// Send a test message to the hub
connection.invoke('TestMethod', 'Test message')
    .then((response) => {
    console.log('Received response from hub:', response);
    })
    .catch((error) => {
    console.error('Error sending message to hub:', error);
    });

// Listen for messages from the hub
connection.on('TestMethod', (message) => {
    console.log('Received message from hub:', message);
});
})
.catch((error) => {
console.error('WebSocket connection error:', error);
});