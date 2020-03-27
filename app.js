const http = require('http');
const director = require('director');
const Bot = require('./bot');

class Server{

    //HANDLES DATA FROM GROUPME ON CALL
    constructor(router, port) {
        this.server = http.createServer(function(req, res) {
            req.chunks = [];
            req.on('data', function(chunk) {
                req.chunks.push(chunk.toString());
            });

            //HANDLES ERRORS FOR CALL
            router.dispatch(req, res, function(err) {
                res.writeHead(err.status, {'Content-Type': 'text/plain'});
                res.end(err.message);
            });
        });

        this.port = Number(process.env.PORT || 3000);
    };

    //BUILDS SERVER PORT THAT LISTENS FOR GROUPME CALLS
    serve() {
        this.server.listen(this.port);
        console.log(`Port: ${this.port}`);
    };

    static getResponse() {
        this.res.end('');
    };

    //PARSES AND REACTS TO GROUPME DATA
    static postReponse() {
        const reqMessage = JSON.parse(this.req.chunks[0]);

        this.res.writeHead(200);
        this.res.end();

        //ACTUAL BOT
        const resMessage = Bot.Bot.checkMessage(reqMessage);
        if (resMessage) {

            //STARTS SEND
            Bot.Bot.sendMessage(resMessage);
        }
    };
};

//BUILDS SERVER THAT LISTENS FOR GROUPME CALLS
const router = new director.http.Router({
    '/': {
        post: Server.postReponse,
        get: Server.getResponse
    }
});

//STARTS SERVER
const server = new Server(router);
server.serve();