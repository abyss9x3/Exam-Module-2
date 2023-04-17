const seedingQuery = `
CREATE TABLE Exam_SubCommittee
(
  DeptName VARCHAR(100) NOT NULL,
  PRIMARY KEY (DeptName)
);

CREATE TABLE Exam_Office
(
  Login_ID VARCHAR(100) NOT NULL,
  Password VARCHAR(100) NOT NULL,
  Name VARCHAR(100) NOT NULL,
  PRIMARY KEY (Login_ID)
);

CREATE TABLE Examiner_1
(
  Email VARCHAR(100) NOT NULL,
  Name VARCHAR(100) NOT NULL,
  ContactNo INT NOT NULL,
  PRIMARY KEY (Email)
);

CREATE TABLE Examiner_2
(
  Email VARCHAR(100) NOT NULL,
  Name VARCHAR(100) NOT NULL,
  ConatctNo INT NOT NULL,
  PRIMARY KEY (Email)
);

CREATE TABLE Approval
(
  DeptName VARCHAR(100) NOT NULL,
  Approval1 Bool ,
  Approval2 Bool ,
  SendStatus Bool ,
  PRIMARY KEY (DeptName)
);

CREATE TABLE Member
(
  Signature BLOB ,
  Login_ID VARCHAR(100) NOT NULL,
  Password VARCHAR(100) NOT NULL,
  Name VARCHAR(100) NOT NULL,
  Designation VARCHAR(100) NOT NULL,
  DeptName VARCHAR(100) NOT NULL,
  PRIMARY KEY (Login_ID),
  FOREIGN KEY (DeptName) REFERENCES Exam_SubCommittee(DeptName)
);

CREATE TABLE Exam_Module
(
  ID VARCHAR(10) NOT NULL,
  SubNomenclature VARCHAR(100) ,
  SubCode VARCHAR(50) ,
  ExamCode INT ,
  Template BLOB ,
  Syllabus BLOB ,
  DeptName VARCHAR(100) ,
  Examiner1 VARCHAR(100) ,
  Examiner2 VARCHAR(100) ,
  PRIMARY KEY (ID),
  FOREIGN KEY (Examiner1) REFERENCES Examiner_1(Email),
  FOREIGN KEY (Examiner2) REFERENCES Examiner_2(Email)
);

CREATE TABLE commits
(
  Member VARCHAR(100) NOT NULL,
  ExamModuleID VARCHAR(10) NOT NULL,
  PRIMARY KEY (Member, ExamModuleID),
  FOREIGN KEY (Member) REFERENCES Member(Login_ID),
  FOREIGN KEY (ExamModuleID) REFERENCES Exam_Module(ID)
);
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
