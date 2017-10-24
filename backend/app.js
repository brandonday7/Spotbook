let express = require('express')
var router = express.Router();
let request = require('request') // "Request" library
let querystring = require('querystring')
let cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
const ENV         = process.env.ENV || "development";
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

require('dotenv').config()

let app = express()
app.set('view engine', 'ejs');


let PORT = process.env.PORT || 8080


let client_id = process.env.clientID // Your client id
let client_secret = process.env.clientSecret; // Your secret
let redirect_uri = `http://localhost:3000/spotify/callback` // Your redirect uri
let app_uri = `http://localhost:3001`

app.use(express.static(__dirname + '/public'))
.use(cookieParser());


var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
}
app.use(allowCrossDomain)

app.use(morgan('dev'));

app.use(cookieSession({
  name: 'session',
  keys: ['userId']
}))
app.set('trust proxy', 1) // trust first proxy

const DataHelpers = require("./lib/data-helpers.js")(knex);
console.log(DataHelpers.userHelpers.addUser)

const spotifyRoutes = require("./routes/spotify");
app.use("/spotify", spotifyRoutes(DataHelpers));

const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes(DataHelpers));

app.listen(PORT, () => { //listen on the port 8080 and let node know server started running
  console.log(`Example listening on port ${PORT}`);
});

