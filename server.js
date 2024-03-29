const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require('path');

const server = express();
const port = 8080;
const db = new sqlite3.Database('blog.db');

// Our own impotred function to initalize db table and a few rows.
const initalizeStartPosts = require('./initDB.js');

//settings
const Settings = {
	sslKey: "ssl/privkey.pem",
	sslCert: "ssl/certificate.pem",
}
// Middleware, parse json, static to serve static files, urlencoded to get req.body, headers to allow access
server
  .use(express.json())
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');

    next();
  });

//Serves html file when trying to get the home route, important to use for links not to be broken.
server.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
	
});
//get request that returns posts from db
server.get('/posts', (req, res) =>{
	const sql = 'SELECT * FROM posts ORDER BY creation_date DESC';
	db.all(sql, (err, posts) =>{
		if(err){
			console.error(err);
			res.status(500).json({message: 'Internal server error', type: 'danger'});
		}else{
			res.status(200).send(posts);
		}
	});
});
// post request to create a post and insert into the db.
server.post('/posts', (req, res) =>{

	const author = req.body.blogAuthor;
	const heading = req.body.blogHeading;
	const content = req.body.blogContent;
	const headingColor = req.body.blogColor;

	console.log(author + heading + content + headingColor);

	const sql = 'INSERT INTO posts (title, author, headingColor, content, creation_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';
	db.run(sql, [heading, author, headingColor, content], (err) => {
		if(err) {
			console.error(err);
			res.status(500).json({message: 'Internal server error', type: 'danger'});
		}else{
			res.status(200).json({message: 'You have successfully created a post.', type: 'success'});
		}
	});
});
//this updates posts based on id
server.put('/posts/:id', (req, res) =>{
	const postId = req.params.id;
	console.log("update:" + postId);

	const author = req.body.blogAuthor;
	const heading = req.body.blogHeading;
	const content = req.body.blogContent;
	const color = req.body.blogColor;


	const InputData = [heading, author, content, color, postId];

	const sql = "UPDATE posts SET title=?, author=?, content=?, headingColor=? WHERE id=?";
	//const sql = `UPDATE posts SET title='${heading}', author='${author}', content='${content}', creation_date=CURRENT_TIMESTAMP, WHERE id='${postId}'`;
	db.run(sql, InputData,function(err){
		if(err) {
			console.error(err);
			res.status(500).json({message: 'Internal server error', type: 'danger'});
		}else{
				res.status(200).json({message: 'Your post has been updated successfully', type: 'success'});		
		}
		
	});
});
//this deletes post based on id
server.delete('/posts/:id', (req, res) =>{
	const postId = req.params.id;

	const sql = 'DELETE FROM posts WHERE id= ?';

	db.run(sql, postId, (err) =>{
		if(err){
			console.log(err.message);
			res.status(500).json({message: 'Internal server error', type: 'danger'});
		}else{
			res.status(200).json({message: 'Your post has been deleted successfully 🙀.', type: 'success'});
		}
	})
})


//initalizes post in the db if there are none.
server.get('/initposts', (req, res) =>{
	const sql = 'SELECT * FROM posts';
	db.all(sql, (err, posts) =>{
		if(err){
			console.error(err);
			res.status(500).send('Server Error');
		} else if (posts.length > 0){
			console.log('Posts already exists in the db');
			res.send('Failure, Posts already exists in the db');
		}else{
			initalizeStartPosts();
			res.send('Success, post initalized');
		}
	});
});

const credentials = {
	key: fs.readFileSync(Settings.sslKey, "utf8"),
	cert: fs.readFileSync(Settings.sslCert, "utf8"),
}

const httpsWrapper = https.createServer(credentials, server);
const httpWrapper = http.createServer(server); 


httpsWrapper.listen(port, () =>{
	console.log(`Server is up and running on port: ${port}`);
});

