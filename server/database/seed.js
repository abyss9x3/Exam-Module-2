const seedingQuery = `
drop database em2;

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
  contactNo INT NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE Examiner2
(
  email VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  contactNo INT NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE Approval
(
  deptName VARCHAR(100) NOT NULL,
  approval1 Bool ,
  approval2 Bool ,
  sendStatus Bool ,
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
  PRIMARY KEY (member, examModuleID),
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
delimiter;

`;

const mysql = require('mysql2/promise');

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
  await sqlDatabase.execute(seedingQuery);
  console.log("Seeding Completed !!!");
}

seed();
