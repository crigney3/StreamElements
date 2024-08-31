// Import required modules
const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const crypto = require("crypto");
const { json } = require("react-router-dom");

// Create an HTTP server and a WebSocket server
const server = http.createServer();
// TODO: Make this a wss server for security
const wsServer = new WebSocketServer({ server });
const port = 8000;
// Maintain active connections and users
let characterData = {};
let connections = {};

// Also connect to the TTS websocket server
let externalWebSocket = new WebSocket('ws://dionysus.headass.house:8051/');

externalWebSocket.on('open', () => {
    console.log("TTS Server Connection Established");
})

externalWebSocket.on('message', (e) => {
    let newText = JSON.parse(e);
    console.log(newText);
    let isDirty = false;
    Object.keys(characterData).forEach((id) => {
        if (characterData[id].username !== undefined) {
            if (characterData[id].username.toString().toLowerCase() === newText.user) {
                characterData[id].speakerText = newText.message;
                isDirty = true;
            }
        }
    });

    if (isDirty) sendMessageToAllClients(characterData);
})

// Back to server stuff

// Handle new client connections
wsServer.on("connection", function handleNewConnection(connection) {
  const userId = crypto.randomBytes(20).toString('hex');
  console.log("Received a new connection with id: ", userId);

  connections[userId] = connection;

  sendMessage(characterData, userId);

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

function sendMessage(jsonMessage, uuid) {
    const connection = connections[uuid];
    const stringJSON = JSON.stringify(jsonMessage);
    let message = "";
    if (stringJSON !== "{}") {
        message = stringJSON;
    }
    connection.send(message);
}

// Send a message to every client
function sendMessageToAllClients(jsonMessage) {
    Object.keys(connections).forEach((uuid) => {
        sendMessage(jsonMessage, uuid);
    })
}

// Handle incoming data from clients
function processReceivedMessage(message) {
    const dataFromClient = JSON.parse(message.toString());
  
    if (dataFromClient.type === "contentchange") {
        characterData = dataFromClient.content;
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