const seedingQuery = `
drop database if exists em2;

create database em2;
use em2;

CREATE TABLE ExamSubCommittee
(
  deptName VARCHAR(100) NOT NULL,
  PRIMARY KEY (deptName)
);

CREATE TABLE ExamOffice
(
  loginid VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  signature blob,
  designation varchar(100) not null,
  PRIMARY KEY (loginid)
);

CREATE TABLE Examiner1
(
  email VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  contactNo varchar(13) NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE Examiner2
(
  email VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  contactNo varchar(13) NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE Approval
(
  deptName VARCHAR(100) NOT NULL,
  approval1 Bool ,
  approval2 Bool ,
  sentStatus Bool ,
  PRIMARY KEY (deptName)
);

CREATE TABLE Member
(
  signature BLOB ,
  loginid VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  deptName VARCHAR(100) NOT NULL,
  PRIMARY KEY (loginid),
  FOREIGN KEY (deptName) REFERENCES ExamSubCommittee(deptName)
);

CREATE TABLE ExamModule
(
  id VARCHAR(10) NOT NULL,
  subNomenclature VARCHAR(100) ,
  subCode VARCHAR(50) ,
  examCode INT ,
  template BLOB ,
  syllabus BLOB ,
  deptName VARCHAR(100) ,
  examiner1 VARCHAR(100) ,
  examiner2 VARCHAR(100) ,
  PRIMARY KEY (id),
  FOREIGN KEY (examiner1) REFERENCES Examiner1(email) ON DELETE CASCADE,
  FOREIGN KEY (examiner2) REFERENCES Examiner2(email) ON DELETE CASCADE
);

CREATE TABLE Commits
(
  member VARCHAR(100) NOT NULL,
  examModuleID VARCHAR(10) NOT NULL,
  PRIMARY KEY (examModuleID),
  FOREIGN KEY (member) REFERENCES Member(loginid),
  FOREIGN KEY (examModuleID) REFERENCES ExamModule(id)
);

delimiter |
CREATE TRIGGER auto_delete_all_examiner_on_deleting_an_exam_module_entry
AFTER DELETE ON ExamModule FOR EACH ROW
BEGIN
  DELETE FROM Examiner1 WHERE email = OLD.Examiner1;
  DELETE FROM Examiner2 WHERE email = OLD.Examiner2;
END;
delimiter ;

`;

const seedTestDataQuery = `

delete from Commits;
delete from ExamModule;
delete from Approval;
delete from Examiner2;
delete from Examiner1;
delete from ExamOffice;
delete from Member;
delete from ExamSubCommittee;

insert into ExamSubCommittee (deptName) values ("IT"), ("CS");

insert into Member (loginid, password, name, designation, deptName) values 
("mit1", "pass", "Shuja", "hod", "IT"),
("mit2", "pass", "Shumkla", "member", "IT"), 
("mit3", "pass", "Aman", "member", "IT"), 
("mcs1", "pass", "Anshul", "hod", "CS"), 
("mcs2", "pass", "Satyam", "member", "CS"), 
("mcs3", "pass", "Raj", "member", "CS");

insert into ExamOffice (loginid, password, name, designation) values 
("admin", "$2a$10$vk0UI6uB4ZEPcubspqCGhO4ebmjdaXYRXab4slfXcUFVUYGqAbL/K", "Admin", "admin"), 
("officer", "pass", "Officer", "examcontroller"),
("controller", "pass", "Controller", "examofficer");

insert into Examiner1 (email, name, contactNo) values
("e1it1", "E1IT1", "9999999911"),
("e1it2", "E1IT2", "9999999911"),
("e1cs1", "E1CS1", "9999999911"),
("e1cs2", "E1CS2", "9999999911");

insert into Examiner2 (email, name, contactNo) values
("e2it1", "E2IT1", "9999999922"),
("e2it2", "E2IT2", "9999999922"),
("e2cs1", "E2CS1", "9999999922"),
("e2cs2", "E2CS2", "9999999922");

insert into Approval (deptName, approval1, approval2, sentStatus) values
("IT", 0, 0, 0),
("CS", 0, 0, 0);

insert into ExamModule (id, subNomenclature, subCode, deptName, examiner1, examiner2) values
("it1", "DAA", "IT1025", "IT", "e1it1", "e2it1"),
("it2", "COA", "IT7564", "IT", "e1it2", "e2it2"),
("it3", "DC", "IT9431", "IT", null, null),
("cs1", "TOC", "CS6157", "CS", "e1cs1", "e2cs1"),
("cs2", "CD", "CS0058", "CS", "e1cs2", "e2cs2"),
("cs3", null, null, "CS", null, null);

insert into Commits (examModuleID, member) values 
("it1", "mit1"),
("it2", "mit2"),
("it3", "mit2"),
("cs1", "mcs1"),
("cs2", "mcs2");

`;

const mysql = require('mysql2/promise');
const path = require('path');
const { exit } = require('process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

/**
* @type {mysql.Connection}
*/
let sqlDatabase = null;

const connectDB = async () => {
  sqlDatabase = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  console.log("DataBase Connected !!!");
}

const seed = async () => {
  await connectDB();

  const queryArray = [...(seedTestDataQuery.split(";"))];

  try {
    for (let i = 0; i < queryArray.length; ++i) {
      const validQuery = queryArray.at(i).trim().replace(/\n/g, " ");
      if (validQuery)
        await sqlDatabase.execute(validQuery);
    }
  } catch (error) {
    console.log(error);
    exit(1);
  }

  console.log("Seeding Completed !!!");
  exit(0);
}

seed();
