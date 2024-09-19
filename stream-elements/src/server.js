// Import required modules
const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const crypto = require("crypto");
const { json } = require("react-router-dom");
const fs = require("fs");

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
                console.log(newText.message);
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

  connection.on("message", (message) =>
    processReceivedMessage(message, userId),
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
function processReceivedMessage(message, userId) {
    const dataFromClient = JSON.parse(message.toString());
  
    if (dataFromClient.type === "contentchange") {
        // This type means character data has changed -
        // update all clients
        characterData = dataFromClient.content;
        sendMessageToAllClients(dataFromClient);
    } else if (dataFromClient.type === "userevent") {
        console.log("New client message received");
        // Send the new user a copy of the current state, if it exists
        if (JSON.stringify(characterData) !== "{}") {
            dataFromClient.content = characterData;
            sendMessage(dataFromClient, userId);
        }
    } else if (dataFromClient.type === "rollEvent") {
        let dieMax = dataFromClient.content;
        let rollResult = rollDie(dieMax);
        console.log(rollResult);
        dataFromClient.content = rollResult;
        sendMessageToAllClients(dataFromClient);
    } else if (dataFromClient.type === "saveEvent") {
        console.log("Saving to file");
        saveData();
    } else if (dataFromClient.type === "loadEvent") {
        console.log("Loading from file");
        loadData();
    }
}

// Since die rolls are on the server, we need a recursive method to handle explosions
function rollDie(rollMaxValue) {
    let rollResult = Math.floor(Math.random() * rollMaxValue) + 1;

    return rollResult;
}

// Save the current character data to a file
function saveData() {
    let dataAsString = JSON.stringify(characterData);
    fs.writeFileSync('saveData.json', dataAsString, 'utf8');
}

// Load the character data from a file
function loadData() {
    fs.readFile('saveData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            characterData = JSON.parse(data);
        }
        sendMessageToAllClients(characterData);
    });
}

// Start the WebSocket server
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});