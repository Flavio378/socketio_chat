var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var users = [];

io.on('connection', function(socket){

	socket.emit('welcome', users);

	var user = { username: 'anon', id: socket.id };
	users.push(user);

	socket.on('user_connected', function(username){
		user.username = username;
		socket.broadcast.emit('user_connected', user);
	});

	socket.on('chat message', function(msg){
		socket.broadcast.emit('chat message', user.username + ": " + msg);
	});

	socket.on('typing', function(){
		socket.broadcast.emit('typing', user);
	});
	
	socket.on('disconnect', function(){
		socket.broadcast.emit('bye', user);
		var i = users.indexOf(user);
		delete users[i];
	});


});

http.listen(3000, function(){
	console.log('listening on *:3000');
});