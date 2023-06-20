const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'survey'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }

    console.log('Connected to MySQL database with threadId: ' + connection.threadId);
});

const port = process.env.PORT || 3000;

app.get('/questions', (req, res) => {
    connection.query('SELECT * FROM questions', (error, results, fields) => {
        if (error) throw error;

        res.send(results);
    });
});

app.get('/options/:id', (req, res) => {
    const questionId = req.params.id;
    connection.query('SELECT * FROM options WHERE question_id=?', [questionId], (error, results, fields) => {
        if (error) throw error;

        res.send(results);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
