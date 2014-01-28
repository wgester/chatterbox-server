/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var message = {};



exports.handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url + " request data: " + request);

  // var messageResult = {results : message}

  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  request.on('data', function(data){
    if (data){  
      if(message[request.url]){
        message[request.url].push(JSON.parse(data));
      } else {
        message[request.url] = [JSON.parse(data)];
      } 
    }
  })
  console.log(request.url)

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  if(request.method === 'GET'){
    if (message[request.url]){
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(message[request.url]));
    } else {
      if(request.url.slice(0,30) === "http://127.0.0.1:8080/classes/"){
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify([]));
      } else {
        response.writeHead(404, headers);
        response.end(request.url);
      }
    }
  }
  
  if(request.method === 'POST'){
    response.writeHead(201, headers);
    response.end("");
  }
  if(request.method === 'OPTIONS'){
    response.writeHead(statusCode, headers);
    response.end("");
  }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
