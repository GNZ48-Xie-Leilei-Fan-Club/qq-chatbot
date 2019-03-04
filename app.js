const websocket = require('websocket');
const model = require('./model');
const KeywordedReponse = model.KeywordedReponse;
const WebSocketClient = websocket.client;


const cachedKeywordedResponses = [];

async function cacheKeywordedResponses() {
    cachedKeywordedResponses = await KeywordedReponse.findAll();
}

function main() {
    //Init websocket client
    var client = new WebSocketClient();
    client.connect('ws://localhost:6700/', 'echo-protocol');
    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });
    client.on('connect', function(connection) {
        console.log('WebSocket Client Connected');
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('Connection Closed');
        });
        connection.on('message', function(message) {
            if (message.messageType === 'group') {
                const groupId = message.groupId;
                const body = message.raw_message;
                client.send({
                    action: 'send_group_msg',
                    params: {
                        group_id: groupId,
                        message: body,
                    }
                });
            }
        });
    });
}
