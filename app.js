var express=require('express')
  ,	app = express.createServer()
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url');

//==================================express=====================================//
app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname+'/public'));
	app.use(express.errorHandler({dumpExceptions:true,showStack:true}));
});
var auth=express.basicAuth(function(user,pass){
	return (user=='cnx'&&pass=='cnx'?true:false);
},'Admin Area');
app.get('/',auth,function(req,res){
	var realpath=__dirname+'\\views\\'+url.parse('admin.html').pathname;
	var txt=fs.readFileSync(realpath);
	res.end(txt);
});
app.listen(8000);

//==================================socket.io===================================//
io.sockets.on('connection', function (socket) {
  console.log('connection');
  socket.emit('from server', {id:"server",msg:"connect successful"});
  socket.on('from client', function (data) {
	  console.log(data);
	  socket.broadcast.emit('from server',data);
  });
  socket.on('new user',function(data){
	  console.log(data+" 上线了");
	  socket.broadcast.emit('from server',{id:"server",msg:data+"上线了"});
  });
});
