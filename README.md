# Exam Module 2

- Developed a robust web based system to automate the examiner allocation process of various departments
within our college.
- Implemented various functionalities like: mailing system, file storage and authentication/ authorization
mechanisms to streamline the flow of system’s working.
- Collaborated effectively in a team environment using GIT for project management and version control.
- Built a responsive and smooth frontend using React JS and integrated it with backend using Node JS and
express JS. Also used SQL for efficient and secure data storage and retrieval wherever needed.

Developed by:

- ADITYA SHARMA
- AMAN ARYA 
- SHREYANSH SHUKLA 
- SHUJA UDDIN QURESHI 


## Running the Server

Navigate to the server root directory and install all dependencies for server side code using command : `npm install` and then run `npm start` to run the server on [PORT 5000](http://localhost:5000).

Our Server uses various environment variables which are stored in the `.env` file. <br>
Server uses cookies to handle authentication, which uses `JWT_SECRET` which is also defined in the `.env` file. <br>
Server uses nodemailer library to send email to examiners, which uses these env variables `MAIL_USER`, `MAIL_PASSWORD`. <br>

Note: Keep ***MySql*** installed beforehand because the project is database integrated and uses sql libraries.
<br>
For SQL set these env variables in the .env file: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`

## Running the Client

Navigate to the client root directory and install all dependencies for client side code using command : `npm install` and then run `npm start` to run react on [PORT 3000](http://localhost:3000).
