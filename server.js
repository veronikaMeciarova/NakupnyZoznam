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
  var sql = 'SELECT p.nazov AS nazov, o.nazov AS obchod, p.meno_pouzivatel AS meno_pouzivatel, DATE_FORMAT(p.deadline,"%d.%m.%Y") AS deadline, p.poznamky AS poznamky, p.id AS id, p.id_zoznam AS id_zoznam, p.kupena AS kupena, p.platna AS platna FROM polozka p, obchod o WHERE id_zoznam=? AND o.id=p.obchod;'
  con.query(sql, [req.body.id], function (error, results, fields) {
      if(error) throw error;
      console.log(results);
      res.send(JSON.stringify(results));
  });
});

app.post('/itemDelete', function(req, res, next) {
  console.log(req.body.id);
  var sql = 'DELETE FROM polozka WHERE id=?;'
  con.query(sql, [req.body.id], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/deleteList', function(req, res, next) {
  console.log(req.body.id);
  var sql = 'DELETE FROM zoznam WHERE id=?;'
  con.query(sql, [req.body.id], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/usersGroup', function(req, res, next) {
  console.log(req.body.skupina);
  var sql = 'SELECT meno_pouzivatel FROM prislusnost WHERE nazov_skupina=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      console.log(results);
      res.send(JSON.stringify(results));
  });
});

app.post('/addShop', function(req, res, next) {
  var sql = 'INSERT INTO obchod(nazov, nazov_skupina) VALUES (?,?);'
  con.query(sql, [req.body.obchod, req.body.skupina], function (error, results, fields) {
      if(error) throw error;
  });

  var sql = 'SELECT id FROM obchod WHERE nazov=? AND nazov_skupina=?;'
  con.query(sql, [req.body.obchod, req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/shopsGroup', function(req, res, next) {
  console.log(req.body.skupina);
  var sql = 'SELECT nazov, id FROM obchod WHERE nazov_skupina=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      console.log(results);
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

app.post('/addItem', function(req, res, next) {
  var a = req.body;
  var sql = 'INSERT INTO polozka(nazov,id_zoznam,obchod,meno_pouzivatel,deadline,poznamky) values (?,?,?,?,?,?);'
  con.query(sql, [a.nazov,a.id_zoznam,a.obchod,a.meno,a.deadline,a.poznamka], function (error, results, fields) {
      if(error) throw error;
      console.log("result", results);
      res.send(JSON.stringify(results));
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// con.end(); - kedy???