Create database baeAskify;

Create Table UserTable(
    uName VARCHAR(30) NOT NULL PRIMARY KEY,
    uPass VARCHAR(300) NOT NULL,
    fName VARCHAR(30) NOT NULL,
    lName VARCHAR(30) NOT NULL,
    uEmail VARCHAR(40) NOT NULL,
    uMajor VARCHAR(30) NOT NULL,
    uGradYear INT(4) NOT NULL,
    uRating FLOAT(2),
    uURL VARCHAR(255)
);

Create Table Topics(
    tID VARCHAR(30) NOT NULL PRIMARY KEY,
    tName VARCHAR(30) NOT NULL,
    tDescription MEDIUMTEXT NOT NULL,
    tURL VARCHAR(255) NOT NULL
);

Create Table Questions(
    qID INT(100) NOT NULL PRIMARY KEY,
    tID VARCHAR(30) NOT NULL,
    uName VARCHAR(30) NOT NULL,
    qText MEDIUMTEXT NOT NULL
);

Create Table Answers(
    aID INT(100) NOT NULL PRIMARY KEY,
    uName VARCHAR(30) NOT NULL,
    qID INT(100) NOT NULL,
    aStatus VARCHAR(15) NOT NULL,
    aText MEDIUMTEXT NOT NULL,
    aRating FLOAT(1)
);

Create Table Comments(
    cID INT(100) NOT NULL PRIMARY KEY,
    aID INT(100) NOT NULL,
    uName VARCHAR(30) NOT NULL,
    cText MEDIUMTEXT NOT NULL
);

Create Table HasExpertise(
    uName VARCHAR(30) NOT NULL,
    tID VARCHAR(30),
    PRIMARY KEY (uName, tID)
);

INSERT INTO UserTable VALUES
('Pecster', 'pec', 'Paulina','Escalante', 'pecster@gmail.com','ITC','2018','5','pec.jpg'),
('CrisTJ','babyt','Cristina','Jimenez','cristj@gmail.com','ITC','2019','4.3','cristj.jpg'),
('Carlitos','carlos','Carlos','Gaytan','cgaytan@gmail.com','ITC','2013','5','carlitos.jpg'),
('Nats', 'natie','Natalia','Garcia','nats@gmail.com','ITC','2018','4.9','nats.jpg');

INSERT INTO Topics VALUES
('cpp1', 'C++','C++ is a general-purpose object-oriented programming (OOP) language and is an extension of the C language. It encapsulates both high- and low-level language features.', 'cpp.jpg'),
('ux2','UX/UI','UX & UI have always been a power couple. UX design is an analytical and technical skill that co-relates to the UI graphic design to increase of effectiveness in the use of the applications developed.','uxui.jpg'),
('csharp3','C#','C# is an object-oriented programming language from Microsoft that aims to combine the computing power of C++ with the programming ease of Visual Basic. C# is based on C++ and contains features similar to those of Java.
','csharp.jpg'),
('java4','Java','Java is a general-purpose computer programming language that is concurrent, class-based, object-oriented, and specifically designed to have as few implementation dependencies as possible.','java.jpg'),
('python5','Python','Python is an interpreted, object-oriented programming language similar to PERL, that has gained popularity because of its clear syntax and readability.','python.jpg'),
('sql6','SQL','Structured Query Language (SQL) is a standard computer language for relational database management and data manipulation. SQL is used to query, insert, update and modify data.
','sql.jpg'),
('web7','Web','HTML+Javascript+CSS The role is responsible for designing, coding and modifying websites, from layout to function and according to a clients specifications. Strive to create visually appealing sites that feature user-friendly design and clear navigation.','web.jpg'),
('php8','PHP','PHP is a server-side scripting language designed primarily for web development but also used as a general-purpose programming language.
','php.jpg'),
('react9','React','React is a JavaScript library for building user interfaces. React allows developers to create large web-applications that use data and can change over time without reloading the page. It aims primarily to provide speed, simplicity, and scalability.','react.jpg');

INSERT INTO Questions VALUES
('1','cpp1','CrisTJ','Cual es el metodo mas efectivo de encriptacion?'),
('2','web7','CrisTJ','Que necesito para poder desarrollar en ASP.NET?'),
('3','csharp3','Pecster','Por que es mejor la implementation de lenguajes orientados a objetos?'),
('4','web7','CrisTJ','Que necesito para poder desarrollar en ASP.NET?'),
('5','csharp3','Pecster','Por que es mejor la implementation de lenguajes orientados a objetos?'),
('6','csharp3','Pecster','Por que es mejor la implementation de lenguajes orientados a objetos?'),
('7','web7','Pecster','Por que es mejor la implementation de lenguajes orientados a objetos?');


INSERT INTO Answers VALUES
('1','Carlitos','1','Pending','','5'),
('2','Pecster','2','Pending','','5'),
('3','Carlitos','3','Pending','','5');

INSERT INTO Comments values
('1','1','CrisTJ','Puede ser tu favorita, y no necesariamente la mejor...'),
('2','1','CrisTJ','Lo podemos discutir en un cafe'),
('3','2','CrisTJ','Crees que podrias explicarme durante una asesoria?');

INSERT INTO HasExpertise VALUES
('CrisTJ','cpp1'),
('CrisTJ','ux2'),
('CrisTJ','csharp3'),
('CrisTJ','sql6'),
('Pecster','cpp1'),
('Pecster','csharp3'),
('Pecster','web7'),
('Pecster','php8'),
('Pecster','react9'),
('Carlitos','cpp1'),
('Carlitos','ux2'),
('Carlitos','csharp3'),
('Carlitos','java4'),
('Carlitos','python5'),
('Carlitos','sql6'),
('Carlitos','web7'),
('Carlitos','php8'),
('Carlitos','react9'),
('Nats','cpp1'),
('Nats','csharp3'),
('Nats','python5'),
('Nats','web7'),
('Nats','react9');
