const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require('path');

const server = express();
const db = new sqlite3.Database('blog.db');

const initalizeStartPosts = require('./initDB.js');
//settings
const Settings = {
	sslKey: "ssl/privkey.pem",
	sslCert: "ssl/certificate.pem",
}

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
server.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
	
});
server.post('/createpost', (req, res) =>{
	// Ladda upp bild till servern

	//Skapa ett blogginlägg.
	const author = req.body.blogAuthor;
	const heading = req.body.blogHeading;
	const content = req.body.blogContent;
	const image_source = 'https://placehold.jp/256x256.png';

	console.log(author + heading + content);

	const sql = 'INSERT INTO posts (title, author, image_src, content, creation_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';
	db.run(sql, [heading, author, image_source, content], (err) => {
		if(err) {
			console.error(err);
			res.status(500, 'Error, något gick fel').send(err);
		}else{
			res.status(200).json({message: 'You have successfully created a post.'})
		}
	});
});
//this gets all posts and returns it 
server.get('/posts', (req, res) =>{
	const sql = 'SELECT * FROM posts ORDER BY creation_date DESC';
	db.all(sql, (err, posts) =>{
		if(err){
			console.error(err);
			res.status(500).send('Server Error');
		}else{
		//should it be an else here?
			res.send(posts);
		}
	});
});
//this updates posts based on id
server.post('/updatepost/:id', (req, res) =>{
	const postId = req.params.id;
	console.log("update:" + postId);

	const author = req.body.blogAuthor;
	const heading = req.body.blogHeading;
	const content = req.body.blogContent;
	const image_source = 'https://placehold.jp/256x256.png';
	
	console.log(author);
	console.log(heading);
	console.log(content);
	console.log(image_source);

	const InputData = [heading, author, content, image_source, postId];

	const sql = "UPDATE posts SET title=?, author=?, content=?, image_src=? WHERE id=?";
	//const sql = `UPDATE posts SET title='${heading}', author='${author}', image_src=${image_source}, content='${content}', creation_date=CURRENT_TIMESTAMP, WHERE id='${postId}'`;
	db.run(sql, InputData,function(err){
		if(err) {
			console.error(err);
			res.status(500, 'Error, något gick fel').send(err);
		}
		
	});
});
//this deletes post based on id
server.get('/deletepost/:id', (req, res) =>{
	const postId = req.params.id;
	console.log("delete: " + postId);
	const sql = `DELETE FROM posts WHERE id='${postId}'`;
	db.run(sql, (err) => {
		if(err) {
			console.error(err);
			res.status(500, 'Error, något gick fel').send(err);
		}
		//res.redirect('/');
	});
});

server.delete('/deletepost/:id', (req, res) =>{
	const postId = req.params.id;

	const sql = 'DELETE FROM posts WHERE id= ?';

	db.run(sql, postId, (err) =>{
		if(err){
			console.log(err.message);
			res.status(500).json({error: 'Inernal server error'});
		}else{
			res.status(200).json({message: 'Post deleted succesffulyy'});
		}
	})
})
server.get('/initposts', (req, res) =>{
	const sql = 'SELECT * FROM posts';
	db.all(sql, (err, posts) =>{
		if(err){
			console.error(err);
			res.status(500).send('Server Error');
		} else if (posts.length > 0){
			console.log('Det finns redan i inlägg i databasen');
			res.send('Det finns redan inlägg i databasen');
		}else{
			initalizeStartPosts();
			res.send('Inlägg initialiserade.');
		}
	});
});

const credentials = {
	key: fs.readFileSync(Settings.sslKey, "utf8"),
	cert: fs.readFileSync(Settings.sslCert, "utf8"),
}

const httpsWrapper = https.createServer(credentials, server);
const httpWrapper = http.createServer(server);

httpsWrapper.listen(8080);

