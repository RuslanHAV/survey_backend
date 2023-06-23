var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var app = express();

var connection = mysql.createConnection({
	host: "survey-do-user-14272629-0.b.db.ondigitalocean.com",
	user: "doadmin1",
	password: "AVNS_6a4QOsUDXyZB5txRhMM",
	port: "25060",
	database: 'survey'
});

// var connection = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "",
// 	database: 'survey'
// });

connection.connect((err) => {
	if (err) {
		console.error('Error connecting to MySQL database: ' + err.stack);
		return;
	}

	console.log('Connected to MySQL database with threadId: ' + connection.threadId);
});

app.use(cors());
app.use(express.json())
// Add headers before the routes are defined
app.use(function(req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	next();
});

var port = process.env.PORT || 3000;

// `Select all questions`
app.get('/questions', (req, res) => {
	connection.query('SELECT * FROM questions', (error, results, fields) => {
		if (error) throw error;

		res.send(results);
	});
});

// `Select options which question_id = ${question_id}`
app.get('/options/:id', (req, res) => {
	var questionId = req.params.id;
	connection.query('SELECT * FROM options WHERE question_id=?', [questionId], (error, results, fields) => {
		if (error) throw error;

		res.send(results);
	});
});

// `Select orders which user_id = ${user_id} and question_id = ${question_id}`
app.get('/orders/:user_id/:question_id', (req, res) => {
	var userId = req.params.user_id;
	var questionId = req.params.question_id;
	connection.query('SELECT * FROM orders WHERE user_id=? AND question_id=?', [userId, questionId], (error, results, fields) => {
		if (error) throw error;

		res.send(results);
	})
});

// `Save order which user_id = ${user_id} and question_id = ${question_id}`
app.post('/save_order', (req, res) => {
	var {
		user_id,
		question_id,
		order_str
	} = req.body;

	var IsExistOrder = false;
	connection.query('SELECT * FROM orders WHERE user_id=? AND question_id=?', [user_id, question_id], (error, results, fields) => {
		if (error) throw error;
		if (results) IsExistOrder = true;
	})

	if (IsExistOrder === false) {
		connection.query('UPDATE orders SET order_str = ? WHERE user_id = ? AND question_id = ?', [order_str, user_id, question_id], (error, results, fields) => {
			if (error) throw error;

			res.send({
				status: 'Updated Successfully.'
			});
		});
	} else {
		connection.query('INSERT INTO orders SET ?', {
			user_id: user_id,
			question_id: question_id,
			order_str: order_str
		}, (error, results, fields) => {
			if (error) throw error;

			res.send({
				status: 'Added successfully.'
			});
		});
	}
});

app.listen(port, () => console.log(`Listening on port ${port}...`));