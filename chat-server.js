"use strict";
var myExtras = require('./myExtras.js');

//initial server by Express port 8080
var express = require('express');
var app = express(); app.use(express.static(__dirname + '/public'));
var server = require('http').Server(app); server.listen(80);

//initial socket.io
var io = require('socket.io')(server);

// app.get('/*', function(req, res){
// 	res.sendFile(__dirname + '/public/404.html');
// });

myExtras.startWatchFile();

//declare variable
var numberOfmember = 0;
var users = [];
var allClients = [];

//io listen connection socket
io.on('connection', function(socket){
	// console.log('socket connect:    ' + socket.id);
	//io emit every changed on channel
	// io.emit('chat-message', 'some one join.');
	allClients.push(socket);
	io.emit('server-status', {"status": "ok", "numberOfmember": ++numberOfmember});
	io.emit('join-server', users);

	//socket emit on 'join-server'
	socket.on('join-server', function(user){
		console.log('socket connect:    ' + socket.id);
		console.log('new user:: '+ user.username)
		users.push(user);
		io.emit('join-server', users);
		io.emit('chat-message', JSON.stringify({"username": "sys", "text": user.username+" join the chat.", "t": new Date()}));

	});


	//socket emit on 'chat-message'
	socket.on('chat-message', function(message){
		console.log('new message:: '+ message)
		io.emit('chat-message', message);
	});

	//socket emit on 'disconnect'
	socket.on('disconnect', function(){
		var disconnectSocketId = socket.id;
		console.log('socket disconnect: ' + disconnectSocketId);
		// io.emit('chat-message', 'some one left chat.');
		io.emit('server-status', {"status": "ok", "numberOfmember": --numberOfmember});


		var i = allClients.indexOf(socket);
		console.log('disconnect user:   ' + users[i].username);
		io.emit('chat-message', JSON.stringify({"username": "sys", "text": users[i].username+" left the chat.", "t": new Date()}));
		users.splice(i, 1); io.emit('join-server', users);
		allClients.splice(i, 1);

	});
});