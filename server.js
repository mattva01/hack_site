var application_root = __dirname,
  express = require( 'express' ), //Web framework
  path = require( 'path' ), //Utilities for dealing with file paths
  mongoose = require( 'mongoose' ); //MongoDB integration
  io = require('socket.io'); // Websocket support


  if (!process.env.CODEFORNOVA_AUTH_SECRET) {
    console.log("Need to set CODEFORNOVA_AUTH_SECRET environment variable");
    process.exit(1);
  }
  else{
    var auth_secret = process.env.CODEFORNOVA_AUTH_SECRET;
  }

  if (!process.env.CODEFORNOVA_ADMIN_USERNAME) {
    console.log("Need to set CODEFORNOVA_ADMIN_USERNAME environment variable");
    process.exit(1);
  }
  else{
    var admin_username = process.env.CODEFORNOVA_ADMIN_USERNAME;
  }

  if (!process.env.CODEFORNOVA_ADMIN_PASSWORD) {
    console.log("Need to set CODEFORNOVA_ADMIN_PASSWORD environment variable");
    process.exit(1);
  }
  else{
    var admin_password = process.env.CODEFORNOVA_ADMIN_PASSWORD;
  }

  var expressJwt = require('express-jwt');
  var jwt = require('jsonwebtoken');


//Create server
var app = express(),
http = require('http'),
server = http.createServer(app),
io = io.listen(server);



var Project = new mongoose.Schema({
  name: String,
  description: String,
  help_text: String,
  github_url: String,
  production_url: String,
  demo_url: String,
  tags: [String]
})

var Resource = new mongoose.Schema({
  name: String,
  description: String,
  link: String,
})

var Member = new mongoose.Schema({
  name: String,
  codename: String,
  description: String,
  tags: [String],
})

//Models
var ResourceModel = mongoose.model( 'Resource', Resource );
var ProjectModel = mongoose.model( 'Project', Project );


var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.enable("jsonp callback");
// Configure server

var requires_auth = expressJwt({secret: auth_secret});

app.configure( function() {
  app.use(allowCrossDomain);
  //parses request body and populates request.body
  app.use( express.bodyParser() );

  //checks request.body for HTTP method overrides
  app.use( express.methodOverride() );

  //perform route lookup based on url and HTTP method

  //Where to serve static content
  app.use('/static', express.static( path.join( application_root, 'site') ) );

  app.use('/static', function(req, res, next) {
    res.send(404);
  });

  //Show all errors in development
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));


  app.all('/api/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });


//Resources

app.get( '/api/resources', function( request, response ) {
  return ResourceModel.find( function( err, resource ) {
    if( !err ) {
      return response.json( resource ); // This is JSON. Do not, under any circumstances attempt to concatenate it with a string.
    } else {
      return console.log( err );
    }
  });
});

app.post( '/api/resources',requires_auth,function( request, response ) {
  var resource = new ResourceModel({
    name: request.body.name,
    description: request.body.description,
    link: request.body.link,
  });
  resource.save( function( err ) {
    if( !err ) {
      return console.log( 'created' );
    } else {
      return console.log( err );
    }
  });
  return response.send( resource );
});


app.get( '/api/resources/:id', function( request, response ) {
  return ResourceModel.findById( request.params.id, function( err, resource ) {
    if( !err ) {
      return response.send( resource );
    } else {
      return console.log( err );
    }
  });
});


app.delete( '/api/resources/:id', requires_auth ,function( request, response ) {

  return ResourceModel.findByIdAndRemove( request.params.id, function( err, resource ) {

    if( !err ) {
      console.log( 'Resource removed' );
      return response.send( '' );
    } else {
      console.log( err );
    }
  });
});

// Projects

app.get( '/api/projects', function( request, response ) {
  return ProjectModel.find( function( err, project ) {
    if( !err ) {
      return response.json( project ); // This is JSON. Do not, under any circumstances attempt to concatenate it with a string.
    } else {
      return console.log( err );
    }
  });
});

app.post( '/api/projects', requires_auth, function( request, response ) {
  var project = new ProjectModel({
    name: request.body.name,
    description: request.body.description,
    help_text: request.body.help_text,
    github_url: request.body.github_url,
    demo_url:request.body.demo_url,
    production_url:request.body.production_url,
    tags:request.body.tags
  });
  project.save( function( err ) {
    if( !err ) {
      return console.log( 'created' );
    } else {
      return console.log( err );
    }
  });
  return response.send( project );
});


app.get( '/api/projects/:id', function( request, response ) {
  return ProjectModel.findById( request.params.id, function( err, project ) {
    if( !err ) {
      return response.send( project );
    } else {
      return console.log( err );
    }
  });
});


app.delete( '/api/projects/:id', requires_auth, function( request, response ) {


  return ProjectModel.findByIdAndRemove( request.params.id, function( err, project ) {

    if( !err ) {
      console.log( 'Project removed' );
      return response.send( '' );
    } else {
      console.log( err );
    }
  });
});

app.post('/authenticate', function (req, res) {

  if (!(req.body.username === admin_username && req.body.password === admin_password )) {
    res.send(401, 'Wrong user or password');
    return;
  }



  var token = jwt.sign({admin:true}, auth_secret, { expiresInMinutes: 60*5 });

  res.json({ token: token });
});

app.use( app.router );

app.all('/*', function(req, res) {
  res.sendfile('site/index.html');
});

});














//mongoose.connect( 'mongodb://localhost/hackapp_database' );
if (process.env.MONGODB_PORT_27017_TCP_ADDR){
  console.log("Running in Docker container, using link")
  mongo_address = process.env.MONGODB_PORT_27017_TCP_ADDR
  mongo_port = process.env.MONGODB_PORT_27017_TCP_PORT
}
else{
  mongo_address = "localhost";
  mongo_port = "27017";
}
mongoose.connect( 'mongodb://'+ mongo_address + ':' + mongo_port +'/hackapp_database' );

//Schemas





//Start server
var port = 8888;
app.listen( port, function() {
  console.log('Express server listening on port ' + port + ' in ' + app.settings.env + ' mode');
})

