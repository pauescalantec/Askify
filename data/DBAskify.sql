Create database baeAskify;

Create Table User(
    uName VARCHAR(30) NOT NULL PRIMARY KEY,
    uPass VARCHAR(300) NOT NULL,
    fName VARCHAR(30) NOT NULL,
    lName VARCHAR(30) NOT NULL,
    uEmail VARCHAR(40) NOT NULL,
    uMajor VARCHAR(30) NOT NULL,
    uGradYear INT(4) NOT NULL,
    uRating FLOAT(2)
    uURL VARCHAR(255)
);

Create Table Topics(
    tID INT(100) NOT NULL PRIMARY KEY,
    tName VARCHAR(30) NOT NULL,
    tDescription MEDIUMTEXT NOT NULL,
    tURL VARCHAR(255) NOT NULL
);

Create Table Questions(
    qID INT(100) NOT NULL PRIMARY KEY,
    uName VARCHAR(30) NOT NULL FOREIGN KEY,
    qText MEDIUMTEXT NOT NULL,
);

Create Table Answers(
    aID INT(100) NOT NULL PRIMARY KEY,
    uName VARCHAR(30) NOT NULL FOREIGN KEY,
    qID INT(100) NOT NULL FOREIGN KEY,
    aStatus VARCHAR(15) NOT NULL,
    aText MEDIUMTEXT NOT NULL,
    aRating FLOAT(1)
);

Create Table Comments(
    cID INT(100) NOT NULL PRIMARY KEY,
    aID INT(100) NOT NULL FOREIGN KEY,
    cText MEDIUMTEXT NOT NULL
);

Create Table HasExpertise(
    uName VARCHAR(30) NOT NULL,
    tID INT(100),
    PRIMARY KEY (uName, tID)
);

INSERT INTO User VALUES
('Pecster', 'pec', 'Paulina','Escalante', 'pecster@gmail.com','ITC','2018','5','pec.jpg')
('CrisTJ','babyt','Cristina','Jimenez','cristj@gmail.com','ITC','2019','4.3','cristj.jpg')
('Carlitos','carlos','Carlos','Gaytan','cgaytan@gmail.com','ITC','2013','5','carlitos.jpg')
('Nats', 'natie','Natalia','Garcia','nats@gmail.com','ITC','2018','4.9','nats.jpg');

INSERT INTO Topics VALUES
('1', 'C++','C++ is a general-purpose object-oriented programming (OOP) language and is an extension of the C language. It encapsulates both high- and low-level language features.', 'cpp.jpg')
('2','UX/UI','UX & UI have always been a power couple. UX design is an analytical and technical skill that co-relates to the UI graphic design to increase of effectiveness in the use of the applications developed.','uxui.jpg')
('3','C#','C# is an object-oriented programming language from Microsoft that aims to combine the computing power of C++ with the programming ease of Visual Basic. C# is based on C++ and contains features similar to those of Java.
','csharp.jpg')
('4','Java','Java is a general-purpose computer programming language that is concurrent, class-based, object-oriented, and specifically designed to have as few implementation dependencies as possible.','java.jpg')
('5','Python','Python is an interpreted, object-oriented programming language similar to PERL, that has gained popularity because of its clear syntax and readability.','python.jpg')
('6','SQL','Structured Query Language (SQL) is a standard computer language for relational database management and data manipulation. SQL is used to query, insert, update and modify data.
','sql.jpg')
('7','Web','HTML+Javascript+CSS The role is responsible for designing, coding and modifying websites, from layout to function and according to a clients specifications. Strive to create visually appealing sites that feature user-friendly design and clear navigation.','web.jpg')
('8','PHP','PHP is a server-side scripting language designed primarily for web development but also used as a general-purpose programming language.
','php.jpg')
('9','React','React is a JavaScript library for building user interfaces. React allows developers to create large web-applications that use data and can change over time without reloading the page. It aims primarily to provide speed, simplicity, and scalability.','react.jpg');

INSERT INTO Questions VALUES
('1','CrisTJ','Cual es el metodo mas efectivo de encriptacion?')
('2','CrisTJ','Que necesito para poder desarrollar en ASP.NET?')
('3','Pecster','Por que es mejor la implementation de lenguajes orientados a objetos?');

INSERT INTO Answers VALUES
('1','Carlitos','1','Pending','','5')
('2','Pecster','2','Pending','','5')
('3','Carlitos','3','Pending','','5');

INSERT INTO Comments values
('1','1','CrisTJ','Puede ser tu favorita, y no necesariamente la mejor...')
('2','1','CrisTJ','Lo podemos discutir en un cafe')
('3','2','CrisTJ','Crees que podrias explicarme durante una asesoria?');

Create Table HasExpertise(
    uName VARCHAR(30) NOT NULL,
    tID INT(100),
    PRIMARY KEY (uName, tID)
);

INSERT INTO HasExpertise VALUES
('CrisTJ','1')
('CrisTJ','2')
('CrisTJ','3')
('CrisTJ','6')
('Pecster','1')
('Pecster','3')
('Pecster','7')
('Pecster','8')
('Pecster','9')
('Carlitos','1')
('Carlitos','2')
('Carlitos','3')
('Carlitos','4')
('Carlitos','5')
('Carlitos','6')
('Carlitos','7')
('Carlitos','8')
('Carlitos','9')
('Nats','1')
('Nats','3')
('Nats','5')
('Nats','7')
('Nats','9')
