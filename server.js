const express = require('express');

const app = express();
var router = express.Router();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'AHOJ' });
// });

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "nakupnyZoznam"
});

con.connect();

con.query("SELECT * FROM pouzivatel", function (error, results, fields) {
  if (error) throw error;
  app.get('/users', (req, res) => {
    res.send(JSON.stringify(results));
  });
});

app.post('/groups', function(req, res, next) {
  console.log(req.body.name);
  var sql = 'SELECT nazov_skupina FROM prislusnost WHERE meno_pouzivatel=?;'
  con.query(sql, [req.body.name], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/lists', function(req, res, next) {
  console.log(req.body.name);
  var sql = 'SELECT z.nazov AS nazov, z.id AS id, z.nazov_skupina AS nazov_skupina FROM zoznam z, prislusnost p WHERE p.meno_pouzivatel=? AND p.nazov_skupina = z.nazov_skupina;'
  con.query(sql, [req.body.name], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/items', function(req, res, next) {
  console.log(req.body.id);
  var sql = 'SELECT * FROM polozka WHERE id_zoznam=?;'
  con.query(sql, [req.body.id], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/newZoznam', function(req, res, next) {
  console.log(req.body.zoznam);
  var sql = 'insert into zoznam(nazov,nazov_skupina) values (?,?);'
  con.query(sql, [req.body.zoznam, req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      console.log("result", results);
      res.send(JSON.stringify(results));
  });
});



app.listen(port, () => console.log(`Listening on port ${port}`));

// con.end(); - kedy???