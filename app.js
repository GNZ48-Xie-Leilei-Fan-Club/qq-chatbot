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
    client.connect('ws://localhost:6700/');
    client.on('connect', function(connection) {
        console.log('WebSocket Client Connected');
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('Connection Closed');
        });
        connection.on('message', function(message) {
            if (message.utf8Data) {
                message = JSON.parse(message.utf8Data);
                if (message.message_type === 'group') {
                    const groupId = message.group_id;
                    const body = message.raw_message;
                    const response = JSON.stringify({
                        action: 'send_group_msg',
                        params: {
                            group_id: groupId,
                            message: body,
                        }
                    });
                    console.log('sending response: ' + response.toString());
                    connection.send(response);
                }
            }
        });
    });
}

main();