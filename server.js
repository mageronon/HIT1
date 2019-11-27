const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

const routes = require("./server/routers.js");

routes(app);

app.use("/js", express.static("./docs/js"));
app.use("/css", express.static("./docs/css"));

app.route( "/Home" ).get((req, res) => {
  res.sendFile(__dirname + '/docs/index.html');
});

app.route( "/Admin" ).get((req, res) => {
  res.sendFile(__dirname + '/docs/admin.html');
});

app.get('/', (req, res) => {
  res.redirect('/Home');
});

app.listen((process.env.PORT || 8080), () => console.log("server running at localhost:8080"));
