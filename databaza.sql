DROP TABLE IF EXISTS pouzivatel CASCADE;
CREATE TABLE pouzivatel (
	meno varchar(20) NOT NULL UNIQUE,
	heslo varchar(200) NOT NULL,
	sol varchar(200) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS skupina CASCADE;
CREATE TABLE skupina (
	nazov varchar(20) NOT NULL UNIQUE,
	vlastnik varchar(20) NOT NULL REFERENCES pouzivatel(meno) ON UPDATE cascade ON DELETE cascade,
	heslo varchar(200) NOT NULL,
	sol varchar(200) NOT NULL UNIQUE
);


DROP TABLE IF EXISTS prislusnost CASCADE;
CREATE TABLE prislusnost (
	meno_pouzivatel varchar(20) NOT NULL REFERENCES pouzivatel(meno) ON UPDATE cascade ON DELETE cascade,
    nazov_skupina varchar(20) NOT NULL REFERENCES skupina(nazov) ON UPDATE cascade ON DELETE cascade
);

DROP TABLE IF EXISTS zoznam CASCADE;
CREATE TABLE zoznam (
	id integer NOT NULL AUTO_INCREMENT UNIQUE,
	nazov varchar(20) NOT NULL,
    nazov_skupina varchar(20) NOT NULL REFERENCES skupina(nazov) ON UPDATE cascade ON DELETE cascade
);

DROP TABLE IF EXISTS polozka CASCADE;
CREATE TABLE polozka (
	id integer NOT NULL AUTO_INCREMENT UNIQUE,
	nazov varchar(20) NOT NULL,
	id_zoznam integer NOT NULL REFERENCES zoznam(id) ON UPDATE cascade ON DELETE cascade,
	kupena ENUM ("kupena","nekupena") NOT NULL default "nekupena",
	obchod integer REFERENCES obchod(id) ON UPDATE cascade ON DELETE cascade,
	meno_pouzivatel varchar(20) NOT NULL REFERENCES pouzivatel(meno) ON UPDATE cascade ON DELETE cascade,
	deadline DATE,
	platna ENUM ("platna","neplatna") NOT NULL default "platna",
	poznamky text
);

DROP TABLE IF EXISTS obchod CASCADE;
CREATE TABLE obchod (
	id integer NOT NULL AUTO_INCREMENT UNIQUE,
	nazov varchar(20) NOT NULL,
    nazov_skupina varchar(20) NOT NULL REFERENCES skupina(nazov) ON UPDATE cascade ON DELETE cascade
);
