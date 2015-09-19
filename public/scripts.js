var socket = io();

$('#modal_username').modal({ backdrop: 'static', keyboard: false });

$('#modal_username').modal('show');

$('#frm_message').submit(function(){
	var message = $('#m').val();
	if(message != ""){
		socket.emit('chat message', message);
		append_message('You: ' + message);
		$('#m').val(''); // clean the message
	}
	return false;
});

socket.on('chat message', function(msg){
	append_message(msg)
});

socket.on('user_connected', function(user){
	append_message(user.username + " is online");
	show_user(user);
});

socket.on('welcome', function(users){
	$.each(users, function(key, user){
		show_user(user);
	});
});

socket.on('typing', function(user){
	$('#typing').text(user.username + ' is typing...');
	$('#typing').show();
});

setInterval(function(){ 
	$('#typing').hide();
}, 2000);

socket.on('bye', function(user){
	append_message(user.username + ' disconnected');
	remove_user(user);
});

var append_message = function(msg){
	var message = $('<li style="display:none;">');
	$('#messages').append(message.text(msg));
	message.fadeIn('slow');
};

var join_chat = function(){
	$('#modal_username').modal('hide');
	var username = get_username();
	$('#username').text(username);
	socket.emit('user_connected', get_username());
};

var get_username = function(){
	return $('#txt_username').val();
}

var show_user = function(user){
	if(user){
		$('#users').append($('<li class="bg-success" id="'+user.id+'" style="display:none;">').text(user.username));	
		$('#'+user.id).fadeIn('slow');
	}
}

var remove_user = function(user){
	$('#'+user.id).fadeOut('slow', function(){
		$(this).remove();
	});
}

var show_typing = function(){
	socket.emit('typing', true);
}