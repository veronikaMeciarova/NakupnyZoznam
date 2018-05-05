const express = require('express');
const rand = require('csprng');
const crypto = require('crypto');

const app = express();
var router = express.Router();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
  var sql = 'SELECT s.vlastnik AS vlastnik, p.nazov_skupina AS nazov FROM prislusnost p, skupina s WHERE p.meno_pouzivatel=? AND s.nazov=p.nazov_skupina;'
  con.query(sql, [req.body.name], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/lists', function(req, res, next) {
  var sql = 'SELECT z.nazov AS nazov, z.id AS id, z.nazov_skupina AS nazov_skupina FROM zoznam z, prislusnost p WHERE p.meno_pouzivatel=? AND p.nazov_skupina = z.nazov_skupina;'
  con.query(sql, [req.body.name], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/items', function(req, res, next) {
  var sql = 'SELECT p.nazov AS nazov, o.nazov AS obchod, p.meno_pouzivatel AS meno_pouzivatel, DATE_FORMAT(p.deadline,"%d.%m.%Y") AS deadline, p.poznamky AS poznamky, p.id AS id, p.id_zoznam AS id_zoznam, p.kupena AS kupena, p.platna AS platna FROM polozka p, obchod o WHERE id_zoznam=? AND o.id=p.obchod;'
  con.query(sql, [req.body.id], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/itemDelete', function(req, res, next) {
  var sql = 'UPDATE polozka SET platna="neplatna" WHERE id=?'
  con.query(sql, [req.body.id], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/deleteList', function(req, res, next) {
  var sql = 'DELETE FROM zoznam WHERE id=?;'
  con.query(sql, [req.body.id], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/usersGroup', function(req, res, next) {
  var sql = 'SELECT meno_pouzivatel FROM prislusnost WHERE nazov_skupina=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/chPasswd', function(req, res, next) {
  var sql = 'SELECT heslo, sol FROM pouzivatel WHERE meno=?;'
  con.query(sql, [req.body.meno], function (error, results, fields) {
      if(error) throw error;
      var staraSol = results[0].sol;
      var stareHesloASol = req.body.stare + staraSol;
      var staryHash = crypto.createHash('sha256').update(stareHesloASol).digest('base64');
      if (staryHash === results[0].heslo) {
        var novaSol = rand(160, 36);
        var noveHesloASol = req.body.nove + novaSol;
        var novyHash = crypto.createHash('sha256').update(noveHesloASol).digest('base64');
        var sql = 'UPDATE pouzivatel SET heslo=?, sol=? WHERE meno=?;'
        con.query(sql, [novyHash, novaSol, req.body.meno], function (error, results, fields) {
            if(error) throw error;
            res.send(JSON.stringify(results));
        });
      } else {
        res.send(JSON.stringify({msg: "zleHeslo"}));
      }     
  });
});

app.post('/chPasswdGroup', function(req, res, next) {
  var sql = 'SELECT heslo, sol FROM skupina WHERE nazov=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      var staraSol = results[0].sol;
      var stareHesloASol = req.body.stare + staraSol;
      var staryHash = crypto.createHash('sha256').update(stareHesloASol).digest('base64');
      if (staryHash === results[0].heslo) {
        var novaSol = rand(160, 36);
        var noveHesloASol = req.body.nove + novaSol;
        var novyHash = crypto.createHash('sha256').update(noveHesloASol).digest('base64');
        var sql = 'UPDATE skupina SET heslo=?, sol=? WHERE nazov=?;'
        con.query(sql, [novyHash, novaSol, req.body.skupina], function (error, results, fields) {
            if(error) throw error;
            res.send(JSON.stringify(results));
        });
      } else {
        res.send(JSON.stringify({msg: "zleHeslo"}));
      }     
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

app.post('/registr', function(req, res, next) {
  var sql = 'SELECT * FROM pouzivatel WHERE meno=?;'
  con.query(sql, [req.body.meno], function (error, results, fields) {
    if(error) throw error; 
    var self = this;
    var pocet = results.length;
      if (pocet === 0) {
        var sol = rand(160, 36);
        var hesloASol = req.body.heslo + sol;
        var hash = crypto.createHash('sha256').update(hesloASol).digest('base64');
        var sql = 'INSERT INTO pouzivatel(meno, heslo, sol) VALUES (?,?,?);'
        con.query(sql, [req.body.meno, hash, sol], function (error, results, fields) {
          if(error) throw error;
          res.send(JSON.stringify(results));
        });
      } else {
        res.send(JSON.stringify({msg: "uzExistuje"}));
      }
  });
});

app.post('/login', function(req, res, next) {
  var sql = 'SELECT * FROM pouzivatel WHERE meno=?;'
  con.query(sql, [req.body.meno], function (error, results, fields) {
    if(error) throw error; 
    var self = this;
    var pocet = results.length;
      if (pocet === 0) {
        res.send(JSON.stringify({msg: "neexistuje"}));
      } else {
        var sol = results[0].sol;
        var hesloASol = req.body.heslo + sol;
        var hash = crypto.createHash('sha256').update(hesloASol).digest('base64');
        if (hash === results[0].heslo) {
          res.send(JSON.stringify({msg: "ok"}));
        } else {
          res.send(JSON.stringify({msg: "zleHeslo"}));
        }
      }
  });
});

app.post('/shopsGroup', function(req, res, next) {
  console.log(req.body.skupina);
  var sql = 'SELECT nazov, id FROM obchod WHERE nazov_skupina=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/newZoznam', function(req, res, next) {
  console.log(req.body.zoznam);
  var sql = 'insert into zoznam(nazov,nazov_skupina) values (?,?);'
  con.query(sql, [req.body.zoznam, req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/addItem', function(req, res, next) {
  var a = req.body;
  var sql = 'INSERT INTO polozka(nazov,id_zoznam,obchod,meno_pouzivatel,deadline,poznamky) values (?,?,?,?,?,?);'
  con.query(sql, [a.nazov,a.id_zoznam,a.obchod,a.meno,a.deadline,a.poznamka], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/buyItems', function(req, res, next) {
  var sql = 'SELECT o.nazov AS obchod_nazov, pol.id AS id, z.nazov_skupina AS skupina, z.nazov AS zoznam, pol.nazov AS nazov, pol.kupena AS kupena, pol.obchod AS obchod, pol.meno_pouzivatel AS meno_pouzivatel, DATE_FORMAT(pol.deadline,"%d.%m.%Y") AS deadline, pol.platna AS platna, pol.poznamky AS poznamky FROM polozka pol, prislusnost pr, zoznam z, obchod o WHERE pr.meno_pouzivatel=? AND pr.nazov_skupina=z.nazov_skupina AND z.id=pol.id_zoznam AND o.id=pol.obchod;'
  con.query(sql, [req.body.meno], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/setItemAsBought', function(req, res, next) {
  if (req.body.kupena === "kupena") {
      var sql = 'UPDATE polozka SET kupena="nekupena" WHERE id=?'
      con.query(sql, [req.body.id], function (error, results, fields) {
          if(error) throw error;
      });
  } else {
      var sql = 'UPDATE polozka SET kupena="kupena" WHERE id=?'
      con.query(sql, [req.body.id], function (error, results, fields) {
          if(error) throw error;
      });
    }

    var sql = 'SELECT o.nazov AS obchod_nazov, pol.id AS id, z.nazov_skupina AS skupina, z.nazov AS zoznam, pol.nazov AS nazov, pol.kupena AS kupena, pol.obchod AS obchod, pol.meno_pouzivatel AS meno_pouzivatel, DATE_FORMAT(pol.deadline,"%d.%m.%Y") AS deadline, pol.platna AS platna, pol.poznamky AS poznamky FROM polozka pol, prislusnost pr, zoznam z, obchod o WHERE pr.meno_pouzivatel=? AND pr.nazov_skupina=z.nazov_skupina AND z.id=pol.id_zoznam AND o.id=pol.obchod;'
    con.query(sql, [req.body.meno], function (error, results, fields) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

app.post('/allGroups', function(req, res, next) {
  var sql = 'SELECT nazov, vlastnik FROM skupina;'
  con.query(sql, [], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/addGroup', function(req, res, next) {
  var sol = rand(160, 36);
  var hesloASol = req.body.heslo + sol;
  var hash = crypto.createHash('sha256').update(hesloASol).digest('base64');
  var sql = 'INSERT INTO skupina(nazov, heslo, vlastnik, sol) VALUES (?,?,?,?);'
  con.query(sql, [req.body.skupina, hash, req.body.meno, sol], function (error, results, fields) {
      if(error) throw error;
  });

  var sql = 'INSERT INTO prislusnost(nazov_skupina, meno_pouzivatel) VALUES (?,?);'
  con.query(sql, [req.body.skupina, req.body.meno], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/unjoinGroup', function(req, res, next) {
  var sql = 'DELETE FROM prislusnost WHERE meno_pouzivatel=? AND nazov_skupina=?;'
  con.query(sql, [req.body.meno, req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/deleteGroup', function(req, res, next) {
  var sql = 'DELETE FROM prislusnost WHERE nazov_skupina=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
      if(error) throw error;
  });
  var sql = 'DELETE FROM skupina WHERE nazov=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/changeOwner', function(req, res, next) {
  var sql = 'UPDATE skupina SET vlastnik=? WHERE nazov=?;'
  con.query(sql, [req.body.meno, req.body.skupina], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/allUsers', function(req, res, next) {
  var sql = 'SELECT meno FROM pouzivatel;'
  con.query(sql, [], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/resetPasswd', function(req, res, next) {
  var sol = rand(160, 36);
  var hesloASol = "heslo" + sol;
  var hash = crypto.createHash('sha256').update(hesloASol).digest('base64');
  var sql = 'UPDATE pouzivatel SET heslo=? , sol=? WHERE meno=?;'
  con.query(sql, [hash, sol, req.body.meno], function (error, results, fields) {
      if(error) throw error;
      res.send(JSON.stringify(results));
  });
});

app.post('/joinGroup', function(req, res, next) {
  var sql = 'SELECT * FROM skupina WHERE nazov=?;'
  con.query(sql, [req.body.skupina], function (error, results, fields) {
    if(error) throw error; 
    var self = this;
    var sol = results[0].sol;
    var hesloASol = req.body.heslo + sol;
    var hash = crypto.createHash('sha256').update(hesloASol).digest('base64');
      if (hash !== results[0].heslo) {
        res.send(JSON.stringify({msg: "zleHeslo"}));
      } else {
        var sql = 'INSERT INTO prislusnost(meno_pouzivatel, nazov_skupina) VALUES (?,?);'
        con.query(sql, [req.body.meno, req.body.skupina], function (error, results, fields) {
            if(error) throw error;
            res.send(JSON.stringify(results));
        });
      }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// con.end();