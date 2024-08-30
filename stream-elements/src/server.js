// Import required modules
const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const crypto = require("crypto");

// Create an HTTP server and a WebSocket server
const server = http.createServer();
// TODO: Make this a wss server for security
const wsServer = new WebSocketServer({ server });
const port = 8000;

// Maintain active connections and users
let characterData = {};
let connections = {};

// Handle new client connections
wsServer.on("connection", function handleNewConnection(connection) {
  const userId = crypto.randomBytes(20).toString('hex');
  console.log("Received a new connection");

  connections[userId] = connection;

  connection.on("message", (message) =>
    processReceivedMessage(message),
  );
  connection.on("close", () => handleClientDisconnection(userId));
});

// Handle disconnection of a client
function handleClientDisconnection(userId) {
    // Clients don't need to know if another client disconnects
    console.log(`client disconnected.`);
    delete connections[userId];
    // delete clients[userId];
    // delete users[userId];
}

// Send a message to every client
function sendMessageToAllClients(jsonMessage) {
    Object.keys(connections).forEach((uuid) => {
        const connection = connections[uuid];
        const message = JSON.stringify(jsonMessage);
        connection.send(message);
    })
}

// Handle incoming data from clients
function processReceivedMessage(message) {
    console.log(message.toString());
    const dataFromClient = JSON.parse(message.toString());
    const json = { type: dataFromClient.type };
  
    if (dataFromClient.type === "contentchange") {
        characterData = dataFromClient.content;
        json.data = characterData;
        console.log("Data Received");
    } else if (dataFromClient.type === "userevent") {
        // No need to do anything except log
        console.log("New client message received");
    }
  
    sendMessageToAllClients(characterData);
}

// Start the WebSocket server
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});