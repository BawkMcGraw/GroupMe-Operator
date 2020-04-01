const https = require('https');
const nameex = /Operator/;
const atex = /@everyone/i;
const atex2 = /@all/i;
// USER IDS FROM EVERYONE IN GROUP
const users = [];
var mentions = [];
var botId, groupId, token, mes;

class Functions {
    // GETS USER IDS FROM GROUP
    static load(GID) {
      console.log('starting load');
        botId = process.env.ID.toString();
        groupId = GID;
        token = process.env.TOKEN.toString();
      console.log(`botId ${botId} groupid ${groupId} token ${token}`);

        const options = {
            hostname: 'api.groupme.com',
            path: `/v3/groups/${groupId}?=${token}`,
            method: 'GET'
        };

        const botReq = https.request(options, function(res) {
          console.log(`res ${JSON.parse(res)}`);
        });
        botReq.on('data', function(res) {
            console.log(`data ${res}`);
            var chunks = [];
            chunks.push(res.toString());
            mes = JSON.parse(chunks[0]);
        });
        botReq.end();
        console.log(`mes.members ${JSON.parse(mes.members)}`)
        for (var i=0; i<mes.members.length; i++) {
            users.push(mes.members[i].user_id);
        }
        console.log(`users ${users}`)
    }
}

class Bot {

    // CHECKS MESSAGE FOR @EVERYONE OR @ALL
    static checkMessage(message) {
        var mT = message.text;
        var mN = message.name;
        var UID = new RegExp(message.user_id);

        // MAKES SURE BOT DOES NOT TRIGGER BOT
        if (nameex.test(mN)) {
            return null;
        }
        if (atex.test(mT) || atex2.test(mT)) {

            // REMOVES USER WHO CALLED FROM MENTIONS LIST
            mentions = users;
            for (var i=0; i<mentions.length; i++) {
                if (UID.test(mentions[i])) {
                    mentions.splice(i, 1);
                    return 'Connecting...';
                }
            }
        }
    }
    // COMPOSES AND SENDS MESSAGE
    static sendMessage(message) {

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        //BUILDS INFORMATION SENT TO GROUPME
        const body = {
            bot_id: botId,
            text: "Connecting your call",
            attachments: [{
                type: "mentions",
                user_ids: [mentions]
            }]
        };
        console.log(`botid ${botId}, mentions ${mentions.toString()}`)

        //CREATES SERVER REQUEST AND POST
        const botReq = https.request(options, function(res) {
            if (res.statusCode !== 202) {
                console.log(`Error: ${res.statusCode} ${res.statusMessage}`);
            }
        });

        botReq.on('error', function(err) {
            console.log(`Error: ${JSON.stringify(err)}`);
        });

        botReq.on('timeout', function(err) {
            console.log(`Timeout: ${JSON.stringify(err)}`);
        });
        botReq.end(JSON.stringify(body));
    }
}
module.exports = {Bot:Bot, Functions:Functions}