var util = require('util');
const https = require('https');
const nameex = /Operator/;
const atex = /@everyone/i;
const atex2 = /@all/i;
// USER IDS FROM EVERYONE IN GROUP
var users = [];
var botId, groupId, token, mes;

class Functions {
    // GETS USER IDS FROM GROUP
    static load(GID) {
        users = [];
        groupId = GID;
        token = process.env.TOKEN.toString();

        // PULLS USER LIST FROM GROUPME
        https.get(`https://api.groupme.com/v3/groups/${groupId}?token=${token}`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                var raw = JSON.parse(data);
                for (var i=0; i<raw.response.members.length; i++) {
                    users.push(JSON.stringify(raw.response.members[i].user_id));
                }
            });
        }).on('error', (err) => {
            console.log(`error: ${err.message}`);
        })
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
            for (var i=0; i<users.length; i++) {
                if (UID.test(users[i])) {
                    users.splice(i, 1);
                    return 'Connecting your call!';
                }
            }
        }
    }
    // COMPOSES AND SENDS MESSAGE
    static sendMessage(message) {
        var GIDex = new RegExp(groupId);
        var Groups = Object.keys(process.env).filter(key => /GROUP/.test(key)).reduce((obj, key) => {obj[key] = process.env[key]; return obj;}, {});
        console.log(`groups ${JSON.stringify(Groups)}`);
        var Ids = Object.keys(process.env).filter(key => /ID/.test(key)).reduce((obj, key) => {obj[key] = process.env[key]; return obj;}, {});
        console.log(`ids ${JSON.stringify(Ids)}`);
        var SortedGroups = {};
        Object.keys(Groups).sort().forEach(function(key) {SortedGroups[key] = Groups[key];});
        console.log(`SortedGroups ${SortedGroups}`);
        var SortedIds = {};
        Object.keys(Ids).sort().forEach(function(key) {SortedIds[key] = Ids[key];});
        console.log(`SortedIds ${SortedIds}`);

        for (var i=0; i<SortedGroups.length; i++) {
            if (GIDex.test(SortedGroups[i])) {
                botId = SortedIds[i];
            }
        }

        // DETERMINES WHICH BOTID BASED ON GROUP

        // BUILDS REQUEST
        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        // BUILDS INFORMATION SENT TO GROUPME
        const body = {
            bot_id: botId,
            text: message,
            attachments: [{
                type: "mentions",
                user_ids: [users]
            }]
        };
        console.log(`botid ${botId}, mentions ${users.toString()}`)

        // CREATES SERVER REQUEST AND POSTS
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