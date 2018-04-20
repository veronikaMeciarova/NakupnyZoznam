const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'AHOJ' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test"
});

con.connect();

con.query("SELECT * FROM users", function (error, results, fields) {
  if (error) throw error;
  app.get('/users', (req, res) => {
    res.send(JSON.stringify(results));
  });
});

con.end();


