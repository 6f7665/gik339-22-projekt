const express = require("express");
const fs = require("fs");
const https = require("https");

//settings
var Settings = {
	sslKey: "ssl/privkey.pem",
	sslCert: "ssl/certificate.pem",
}

var server = express();
server.get('/', (req, res) => {
	res.send("tjo bre!");
});

var credentials = {
	key: fs.readFileSync(Settings.sslKey, "utf8"),
	cert: fs.readFileSync(Settings.sslCert, "utf8"),
}

var httpsWrapper = https.createServer(credentials, server);

httpsWrapper.listen(8080);
