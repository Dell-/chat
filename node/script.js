var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/templates/index.html');
});

var message = {
    text: ''
};
var room = {
    id: '',
    name: '',
    users: [],
    messages: []
};
var user = {
    id: '',
    name: '',
    rooms: [],
    messages: []
};

var chatFactory = {
    create: function (io) {
        var chat = {
            events: [
                'message:broadcast',
                'message:room',
                'message:user',
                'room:create',
                'room:list',
                'room:add-user',
                'room:leave-user',
                'user:list',
                'user:login',
                'user:logout'
            ],
            up: function (socket) {
                this.socket = socket;

                this.onGlobal();
            },
            down: function () {

            },
            onGlobal: function () {
                var zhis = this;
                this.socket.on('global-scope', function(msg){
                    io.emit('global-scope', {id:'test'});
                    // io.emit('global-scope', zhis.socket.id + ' >> ' + msg);
                });
            }
        };
        io.on('connection', this.connect.bind(chat));
    },
    connect: function (socket) {
        this.up(socket);
        socket.on('disconnect', function(){
            this.down();
        }.bind(this));
    }
};

chatFactory.create(io.of('/chat'));

http.listen(8888, function(){
    console.log('listening on *:8888');
});
