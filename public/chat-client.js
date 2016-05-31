var socket;
var chat = new Vue({
	el: "body",
	data: {
		message: '', messages : [], serverStatus: {},
		users:[], isLogin: false, username: '',
		message_div: document.getElementById("message_div"),
		channelName:'Vue-SocketIO'
		
	},
	ready: function(){
		console.log('Vue ready.');
	},
	methods: {
		doLogin: function(e){
			e.preventDefault();
			var StartChat = function(){
				socket = io();
				this.isLogin = true;
				
				socket.on('connect', function(){
					socket.emit('join-server', {username: this.username, socketid: socket.io.engine.id});
				}.bind(this));

				socket.on('join-server', function(users){
					this.users = users;
				}.bind(this));

				socket.on('server-status', function(serStatus){
					this.serverStatus = serStatus;
				}.bind(this));

				socket.on('join-server', function(users){
					this.users = users;
				}.bind(this));

				socket.on('chat-message', function(message){
					console.log(message);
					this.messages.push(JSON.parse(message));
					setTimeout(function(){
						this.message_div.scrollTop = this.message_div.scrollHeight;
					}, 30);
				}.bind(this));
			}.bind(this);

			if (this.username !== "") {
				StartChat();
			}else{
				alert('please enter your name');
			}
		},

		send: function(e){
			e.preventDefault();
			if (this.message !=="") {
				var theMessage = {username: this.username, text: this.message, t: new Date()};
				socket.emit('chat-message', JSON.stringify(theMessage));
				this.message = '';
			}
		}
	}
});