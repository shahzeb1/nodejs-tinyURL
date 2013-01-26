
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
var redis = require("redis"),
    client = redis.createClient();

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//Return a random String
function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 5;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}


// Routes
// homepage is called:
app.get('/', function(req,res){
	client.lrange("url.ids", 0, -1, function(err, reply) {
		var x = reply.length;
		res.render('index', { title: 'NodeJS TinyURL', total: x });
	});
});

// /tiny/ is called:
app.get('/tiny/:id?', function(req,res){ 
	// When no URL is set:
  	if(req.params.id == undefined){
  		res.send({error: 'No URL was entered.'});
  	}else{
  	//When a URL is set:
	  	var random = randomString();
	  	var string = {url: req.params.id, id: random};
	  	client.set("url:"+random, req.params.id);
	  	client.rpush("url.ids", random);
	  	client.incr('stats:'+random);
	  	res.send(string);
  }
});

// /x/ is called to go to url:
app.get('/x/:id?', function(req, res){
	// When no URL is set:
  	if(req.params.id == undefined){
  		res.send({error: 'No ID was entered.'});
  	}else{
  	//When a URL is set:
  		var id = req.params.id;
  		var db = 'url:'+req.params.id;
	  	client.get(db, function(err, reply) {
	  		if(reply != null){
	   			client.incr('stats:'+id);
	   			res.send('<meta http-equiv="refresh" content="0;url=http://'+reply+'">');
	   		}else{
	   			res.send({error: 'Invalid ID was entered.'});
	   		}
		});
  }
});


// /stats/ for a given url:
app.get('/stats/:id?', function(req,res){
	function getURL(id){
		client.get('url:'+id, function(err,reply){
			return reply;
		});
	}
	// When no URL is set:
  	if(req.params.id == undefined){
  		res.send({error: 'No ID was entered.'});
  	}else{
  		var db = 'stats:'+req.params.id;
  		client.get(db, function(err, reply){
  			ace = reply;
  			client.get('url:'+req.params.id, function(err,reply){
  				urlget = reply;
  				res.send({id: req.params.id, views: ace, url: urlget});
			});
  		});
  	}
});

// Redis Error:
client.on("error", function (err) {
        console.log("Error " + err);
});

app.listen(3000);
console.log("NodeJS-TinyURL server listening on port %d in %s mode", app.address().port, app.settings.env);
