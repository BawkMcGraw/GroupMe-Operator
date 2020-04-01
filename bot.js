const https = require('https');
const nameex = /Operator/;
const atex = /@everyone/i;
const atex2 = /@all/i;
// USER IDS FROM EVERYONE IN GROUP
const users = [];
var mentions = [];
var botId, groupId, token;

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
            res.chunks = [];
            res.on('data', function(chunk) {
                res.chunks.push(chunk.toString());
            });
          console.log(`res.chunks ${res.chunks}`);
            var resM = JSON.parse(this.res.chunks[0]);
            if (resM.members[0].user_id) {
                for (var i=0; i<resM.members.length; i++) {
                    users.push(resM.members[i].user_id);
                    console.log(`resM.members[${i}].user_id ${resM.members[i].user_id}`);
                    console.log(`users[${i}] ${users[i]}`);
                }
            }
        });
        botReq.end();
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
        console.log(`${botId}, ${mentions.toString()}`)

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