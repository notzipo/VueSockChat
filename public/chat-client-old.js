var StartChat = function(){
	var socketid = '';
	var socket = io();
	socket.on('connect', function(){
		socketid= socket.io.engine.id;
		joinUser = {username: document.getElementById('username').value, socketid: socketid};
		socket.emit('join-server', joinUser);
	});
	

	document.getElementById('login').style.display = 'none';
	document.getElementById('chat').style.display = 'block';


	chat = new Vue({
		el: '#chat',

		data: {
			appname: 'VueSocket-Chat',
			message: '', messages : [], serverStatus: {}, theMessage: {}, users:[], isLogin: false,
			username: document.getElementById('username').value,
			message_div: document.getElementById("message_div")
		},

		ready: function(){
			// socket.emit('join-server', JSON.stringify(this.username));
			socket.on('connection', function(socket){
				console.log(socket);
			});

			socket.on('chat-message', function(message){
				console.log(message);
				this.messages.push(JSON.parse(message));
				this.message_div.scrollTop = message_div.scrollHeight;
			}.bind(this));

			socket.on('server-status', function(serStatus){
				this.serverStatus = serStatus;
			}.bind(this));

			socket.on('join-server', function(users){
				console.log(users);
				this.users = users;
			}.bind(this));
		},
		
		methods:{
			send: function(e){
				e.preventDefault();
				this.theMessage = {username: this.username, text: this.message};
				// console.log(JSON.stringify(this.theMessage));
				socket.emit('chat-message', JSON.stringify(this.theMessage));
				this.message = '';
			}
		}
	});	
}


new Vue({
	el: '#login',
	data: {username: ''},
	methods: {
		startChat: function(e){
			e.preventDefault();
			if (this.username !== "") {
				StartChat();
			}else{
				alert('please enter your name');
			}
		}
	}
});