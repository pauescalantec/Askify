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
    qID VARCHAR(30)NOT NULL PRIMARY KEY,
    tID VARCHAR(30) NOT NULL,
    uName VARCHAR(30) NOT NULL,
    qText MEDIUMTEXT NOT NULL
);

Create Table Answers(
    aID VARCHAR(30) NOT NULL PRIMARY KEY,
    uName VARCHAR(30) NOT NULL,
    qID VARCHAR(30) NOT NULL,
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
('Nats', 'natie','Natalia','Garcia','nats@gmail.com','ITC','2018','4.9','nats.jpg'),
('freddy', 'fred','Alfredo','Altamirano','freddy@gmail.com','ITC','2017','2','freddy.jpg'),
('laMiss','laluz','Elda','Quiroga','lamiss@gmail.com','ITC','0000','5','elda.jpg'),
('javo','javi','Javier','Guajardo','javo@gmail.com','ITC','2017','4','javo.jpg'),
('kike','kiks','Enrique','Marroquin','kike@gmail.com','ITC','2017','3','kike.jpg'),
('luis','fb','Luis','Lamadrid','luis@gmail.com','ITC','2017','3','luis.jpg'),
('roel','fb','Roel','Castano','roel@gmail.com','ITC','2017','4','roel.jpg');

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
('CrisTJPecster1','cpp1','CrisTJ','What is the best method for encrypting passwords?'),
('CrisTJPecster2','web7','CrisTJ','What do I need to use ASP.NET?'),
('PecsterCarlitos3','csharp3','Pecster','Why is it better to use Object Oriented Programming?'),
('PecsterNats4','python5','Pecster','What can I use to run a Python server?'),
('NatsPecster6','cpp1','Nats','What is a fat client?'),
('PecsterCrisTJ5','sql6','Pecster','What is the command for dropping tables?'),
('PecsterNats7','cpp1','Pecster','What is a struct?');

INSERT INTO Answers VALUES
('PecsterCrisTJ1','Pecster','CrisTJPecster1','R','You can use several libraries for this on c++, I would do hashing','5'),
('PecsterCrisTJ2','Pecster','CrisTJPecster2','N','','-1'),
('CarlitosPecster3','Carlitos','PecsterCarlitos3','N','','-1'),
('NatsPecster4','Nats','PecsterNats4','A','You can use Flask to run a server','-1'),
('PecsterNats6','Pecster','NatsPecster6','N','','-1'),
('CrisTJPecster5','CrisTJ','PecsterCrisTJ5','R','You can use the DROP TABLE tablename command','4'),
('NatsPecster7','Nats','PecsterNats7','N','','-1');

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
('Nats','react9'),
('laMiss','cpp1'),
('laMiss','csharp3'),
('laMiss','python5'),
('laMiss','web7'),
('freddy','ux2'),
('freddy','java4'),
('freddy','sql6'),
('freddy','php8'),
('freddy','react9'),
('javo','cpp1'),
('javo','csharp3'),
('javo','sql6'),
('javo','react9'),
('kike','csharp3'),
('kike','python5'),
('kike','java4'),
('kike','sql6'),
('luis','sql6'),
('luis','python5'),
('luis','csharp3'),
('luis','ux2'),
('luis','cpp1'),
('roel','cpp1'),
('roel','web7'),
('roel','react9'),
('roel','php8');
