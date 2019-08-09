const websocket = require('websocket');
const WebSocketClient = websocket.client;
const request = require('request');

const logger = require('./logger');
const { jsonApi, apiAddressBattleBroadcast, apiAddressTotalRanking } = require('./api');

function makeGroupResponse(groupId, responseText) {
    return JSON.stringify({
        action: 'send_group_msg',
        params: {
            group_id: groupId,
            message: responseText,
        },
    });
}

function makePrivateResponse(userId, responseText) {
    return JSON.stringify({
        action: 'send_private_msg',
        params: {
            user_id: userId,
            message: responseText,
        },
    });
}

function isIgnoreNumber(userId, ignoreNumbers) {
    const userIdString = userId.toString();
    return ignoreNumbers.map( number => number.number ).includes(userIdString);
}

function sendResponse(message, keywordedResponses, ignoreNumbers, connection) {
    if (message.utf8Data) {
        message = JSON.parse(message.utf8Data);
        if (message.post_type === 'message' && message.message_type === 'group') {
            const groupId = message.group_id;
            const userId = message.user_id;
            const body = message.raw_message;
            for (let kr of keywordedResponses) {
                if (body.includes(kr.keyword) && !isIgnoreNumber(userId, ignoreNumbers)) {
                    connection.send(makeGroupResponse(groupId, kr.response));
                }
            }
            if (body.includes('pk')) {
                request(apiAddressBattleBroadcast, function (error, response, body) {
                    const responseText = JSON.parse(body).response;
                    connection.send(makeGroupResponse(groupId, responseText));
                });
            }
            if(body.includes('实时排名')) {
                request(apiAddressTotalRanking, function (error, response, body) {
                    const responseText = JSON.parse(body).response;
                    connection.send(makeGroupResponse(groupId, responseText));
                });
            }
        } else if (message.post_type === 'notice' && message.notice_type === 'group_increase') {
            try {
                let { data: newMemberNotices } = await jsonApi.findAll('new_member_notice');
            } catch(e) {
                logger.error(e);
            }
            const groupId = message.group_id;
            const userId = message.user_id;
            const atString = `[CQ:at,qq=${userId}]\n`
            for (let notice in newMemberNotices) {
                connection.send(makeGroupResponse(groupId, atString+notice.response))
                connection.send(makePrivateResponse(userId), notice.response)
            }
        }
    }
}


async function main() {
    // Initialize last update time
    let lastUpdateTimestamp = Date.now();

    // Initialize KeywordedResponse cache
    let cachedKeywordedResponses = []
    let cachedIgnoreNumbers = []
    try {
        let { data: kwData } = await jsonApi.findAll('keyworded_response');
        cachedKeywordedResponses = kwData;
        let { data: inData } = await jsonApi.findAll('ignore_number');
        cachedIgnoreNumbers = inData;
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
                    let { data: kwData } = await jsonApi.findAll('keyworded_response');
                    cachedKeywordedResponses = kwData;
                    let { data: inData } = await jsonApi.findAll('ignore_number');
                    cachedIgnoreNumbers = inData;
                    lastUpdateTimestamp = Date.now()
                } catch(e) {
                    logger.error(e);
                }
                logger.info('Cache updated.');
            }
            sendResponse(message, cachedKeywordedResponses, cachedIgnoreNumbers, connection);
        });
    });
    client.connect('ws://localhost:6700/');
}

main();
