const websocket = require('websocket');
const WebSocketClient = websocket.client;

const logger = require('./logger');
const jsonApi = require('./api');

function makeResponse(groupId, response_text) {
    return JSON.stringify({
        action: 'send_group_msg',
        params: {
            group_id: groupId,
            message: response_text,
        }
    });
}

function sendKeywordedResponse(message, keywordedResponses, connection) {
    if (message.utf8Data) {
        message = JSON.parse(message.utf8Data);
        if (message.message_type === 'group') {
            const groupId = message.group_id;
            const body = message.raw_message;
            for (let kr of keywordedResponses) {
                if (body.includes(kr.keyword)) {
                    connection.send(makeResponse(groupId, kr.response));       
                }
            }
        }
    }
}

async function main() {
    // Initialize last update time
    let lastUpdateTimestamp = Date.now();

    // Initialize KeywordedResponse cache
    let cachedKeywordedResponses = []
    try {
        let { data } = await jsonApi.findAll('keyworded_response');
        cachedKeywordedResponses = data;
    } catch(e) {
        logger.error(e);
    }
    logger.info('Cache initialized.');

    // Connect to coolq api and listen for new messages from groups.
    let client = new WebSocketClient();
    client.on('connect', function(connection) {
        logger.info('Websocket connected')
        connection.on('error', function(error) {
            logger.error("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            logger.info('Connection Closed');
        });
        connection.on('message', async function(message) {
            if (Date.now() - lastUpdateTimestamp > 300000) {
                try {
                    let { data } = await jsonApi.findAll('keyworded_response');
                    cachedKeywordedResponses = data;
                } catch(e) {
                    logger.error(e);
                }
                logger.info('Cache updated.');
            }
            sendKeywordedResponse(message, cachedKeywordedResponses, connection);
        });
    });
    client.connect('ws://localhost:6700/');
}

main();
