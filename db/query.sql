CREATE DATABASE softjobs;

CREATE TABLE usuarios ( 
	id SERIAL PRIMARY KEY, 
	email VARCHAR(50) UNIQUE NOT NULL, 
	password VARCHAR(60) NOT NULL, 
	rol VARCHAR(25), 
	lenguage VARCHAR(20) );

SELECT * FROM usuarios;