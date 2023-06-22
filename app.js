const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const connection = mysql.createConnection({
    host     : 'survey-do-user-14272629-0.b.db.ondigitalocean.com',
    user     : 'doadmin',
    // port     : '25060',
    password : 'AVNS_8_9nUo_I4l__hPoIU1v',
    database : 'survey'
    // connectTimeout: 30000
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
