var util = require('util');
const https = require('https');
const nameex = /Operator/;
const atex = /@everyone/i;
const atex2 = /@all/i;
// USER IDS FROM EVERYONE IN GROUP
var users = [];
var botId, groupId, token;

class Functions {
    // GETS USER IDS FROM GROUP
    static load(GID) {
        users = [];
        console.log(`users empty ${users}`);
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
                    console.log(`users update ${i}: ${users}`);
                }
            });
        }).on('error', (err) => {
            console.log(`error: ${err.message}`);
        })
    }
    static CallerID() {
        var GIDex = new RegExp(groupId);

        // RETRIEVES GROUPIDS AND BOTIDS FROM HEROKU
        var RawGroups = Object.keys(process.env).filter(key => /GROUPID/.test(key)).reduce((obj, key) => {obj[key] = process.env[key]; return obj;}, {});
        var RawIds = Object.keys(process.env).filter(key => /BOTID/.test(key)).reduce((obj, key) => {obj[key] = process.env[key]; return obj;}, {});

        // SORTS GROUPIDS AND BOTIDS FOR MATCHING
        var SortedGroups = {};
        Object.keys(RawGroups).sort().forEach(function(key) {SortedGroups[key] = RawGroups[key];});
        var SortedIds = {};
        Object.keys(RawIds).sort().forEach(function(key) {SortedIds[key] = RawIds[key];});

        // FILTERS DOWN TO VALUES FOR PAIRING
        var groups = Object.values(SortedGroups);
        var ids = Object.values(SortedIds);

        // DETERMINES WHICH GROUP IS CALLING
        for (var i=0; i<groups.length; i++) {
            if (GIDex.test(groups[i])) {
                // SETS BOTID TO CORRESPONDING GROUP CALL
                botId = ids[i];
            }
        }
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
                    console.log(`spliced users ${users}`);
                    return 'Connecting your call!';
                }
            }
            return `Commander... Commander... Commander... Commander, I think you'll wanna hear this. *Static Noises*`;
        }
    }
    // COMPOSES AND SENDS MESSAGE
    static sendMessage(message) {
        Functions.CallerID();
        
        // BUILDS REQUEST
        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };
        var stringUsers = users.toString();
        console.log(stringUsers);

        // BUILDS INFORMATION SENT TO GROUPME
        const body = {
            bot_id: botId,
            text: message,
            attachments: [{
                type: "mentions",
                user_ids: [stringUsers]
            }]
        };
        console.log(`reported users ${users.toString()}`);
        console.log(JSON.stringify(body));

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