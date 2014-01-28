//GET function
var allRooms = {};
var get = function(){
  $.ajax({
      url: 'http://127.0.0.1:8080/1/classes/chatterbox',
      dataType: 'json',
      success: function(data){
        console.log(data);
        $('#allMessages').text('');
        for (var i = 0; i < data.results.length; i++){
            var roomname = removeTags(data.results[i]['roomname']);
            var username = removeTags(data.results[i]['username']);
            var text = removeTags(data.results[i]['text']);
            if(!(allRooms[roomname]) && roomname && (roomname !== 'main')){
                $('#rooms').append('<button id='+ roomname +' class="room">' + roomname +'</button>'); 
                allRooms[roomname] = roomname;  
            }
            if(text.length <= 140){
                $('#allMessages').append('<li class="user ' +username+'">' + '<b>' + username + '</b>' + ' ' + text + '</li>')
            };
        };
      },
  });
};

//Refresh for chat rooms
var getSpecific = function(){
    $.ajax({
    url: 'http://127.0.0.1:8080/1/classes/chatterbox',
    dataType: 'json',
    success: function(data){
        $('#allMessages').text('');
        for (var i = 0; i < data.results.length; i++){
            var roomname = removeTags(data.results[i]['roomname']);
            var username = removeTags(data.results[i]['username']);
            var text = removeTags(data.results[i]['text']);
            if (roomname === message.roomname){
                if(!(allRooms[roomname]) && roomname && (roomname !== 'main')){
                    $('#rooms').append('<button id='+ roomname +' class="room">' + roomname +'</button>'); 
                    allRooms[roomname] = roomname;  
                }
                if(text.length <= 140){
                    $('#allMessages').append('<li class="user" class='+username+'>' + '<b>' + username + '</b>' + ' ' + text + '</li>')
                };
            }
        };
      },
  });
}

get();

//Refresher
$('#refreshing').on('click', function(){
  console.log('hello')
  get();
});

//Example message object
var message = {
  'username': window.location.search.slice(10),
  'text': 'text',
  'roomname': 'home'
}; 


//Format for POST
var post = function(){
    $.ajax({
      url: 'http://127.0.0.1:8080/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
};


//POST Button
var sendChat = function(){
    message.text = $('#yourMessage')[0].value;
    if (message.text.length){
        post();
        $('#yourMessage')[0].value = $('#yourMessage')[0].defaultValue;
    }
    if(message.roomname === 'home'){
        get();
    } else {
        getSpecific();
    }
}
$('#submitText').on('click', function(){
    sendChat();
});

$(document).keypress(function(e){
    if(e.which === 13){
        sendChat();
    }
})

//sanitizes inputs
var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

var removeTags = function (html) {
  var oldHtml;
  do {
    oldHtml = html;
    (html) && (html = html.replace(tagOrComment, ''));
  } while (html !== oldHtml);
  return (html) && (html.replace(/</g, '&lt;'));
}

//Create A Room
$('#submitRoom').on('click', function(){
    $('#rooms').append('<button id=' + $('#createRoom')[0].value + ' class="room">' + $('#createRoom')[0].value +  '</button>');
});

// $('html').on('click', function())
//enter room 
$('body').on('click', '.room', function(){
    var room = this;
    if ($(room).text() === 'home'){
        // message.roomname = 'home'; <------------------- NEEDS THOUGHT
        get();
        $('h1').text('');
        $('h1').append('home');
        $('h2').text('');
        return;
    }
    $('h1').text('');
    $('#allMessages').text('');
    $('h1').append($(room).text());
    $('h2').text('');
    $('h2').append("You're discussing " + $(room).text());
    message.roomname = $(room).text();
    getSpecific();
});

var friends = {};

//Friend Section
$('body').on('click', '.user', function(){
  var friendConfirm = confirm('Add to friends?')
  if(friendConfirm === true){
    if (!friends[this.className.slice(5)]){
      $('#friendDiv').find('h3').text('Friends');
      $('#friendDiv').append('<li>' + this.className.slice(5)+ '</li>')
      friends[this.className.slice(5)] = true;
    }
  }
});

