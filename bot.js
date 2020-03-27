const https = require('https');
const nameex = /Operator/;
const atex = /@everyone/i;
const atex2 = /@all/i;
// USER IDS FROM EVERYONE IN GROUP
var users = ["33073287", "26997134", "29962743", "31154730", "48138508"];

class Functions {
    static load() {
        users = ["33073287", "26997134", "29962743", "31154730", "48138508"];
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
                    return 'Connecting...';
                }
            }
        }
    }
    // COMPOSES AND SENDS MESSAGE
    static sendMessage(message) {

        // DETERMINES BOTID FOR GROUP THAT CALLED
        var botId;
        const botids = ['a77921fc68936cf5c8fa6e58a3','1'];
        const groups = [/27754904/,/1/];
        for (var i=0; i<groups.length; i++) {
            if (groups[i].test(message.group_id)) {
                botId = botids[i];
            }
        }

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        //BUILDS INFORMATION SENT TO GROUPME
        const body = {
            bot_id: "a77921fc68936cf5c8fa6e58a3",
            text: "Connecting your call",
            attachments: [{
                type: "mentions",
                user_ids: ["33073287","26997134","29962743","31154730","48138508"]
            }]
        };
        console.log(`${botId}, ${users.toString()}`)

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