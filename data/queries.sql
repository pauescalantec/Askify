--despliega los nombres de los usuarios que tienen experiencia en un cierto tema
SELECT uName
FROM HasExpertise
WHERE tID IN (SELECT tID
             FROM Topics
             WHERE tName = '%$tName%')
--despliega la busqueda de un usuario en particular con cierta experiencia
SELECT *
FROM HasExpertise
WHERE uName = '%$uName%'
AND tID IN (SELECT tID
             FROM Topics
             WHERE tName = '$tName')

--Most Visited Topic: despliega el topic favorito basado en el tema del cual se han hecho mas preguntas
SELECT tName
FROM Topics
WHERE tID = (SELECT tID
            FROM Questions
            GROUP BY tID
            ORDER BY COUNT(*) DESC
            LIMIT 1);

--Your Favorite Topic: despliega el topic que ha recibido mas preguntas por un usuario especifico
SELECT tName
FROM Topics
WHERE tID = (SELECT tID
				FROM Questions
				WHERE uName = 'CrisTJ'
				GROUP BY tID
				ORDER BY COUNT(*) DESC
				LIMIT 1);

--Highest Ranked Tutor: despliega el nombre del usuario con mejor calificacion en base a su ranking
SELECT uName
FROM UserTable
WHERE uRating = (SELECT MAX(uRating)
                       FROM UserTable)
LIMIT 1;
--delete la pregunta selecionada
DELETE FROM Questions
WHERE qID = '$qID';
DELETE FROM Answers
WHERE qID = '$qID';

--hace modificaciones a las preguntas que NO se han contestado
UPDATE Questions
SET  qText = "$newQuestionText"
WHERE qID = "$qID";

--Hace modificaciones a las respuestas
UPDATE Answers
SET  aText = "$newAnswerText"
WHERE aID = "$qID";

--load unanswered questions
SELECT Questions.qText as question,
       Questions.qID as questionId,
       Answers.uName as username,
       Answers.aStatus as status,
       Answers.aRating as rating,
       Answers.aText as answer,
       UserTable.fName as fName,
       UserTable.lName as lName,
       Topics.tName as topic
       FROM Questions, Answers, UserTable, Topics
       WHERE (Questions.uName = '$uName'
           AND Questions.qId = Answers.qId
           AND Answers.aStatus = 'N'
           AND Answers.uName = UserTable.uName
           AND Topics.tID = Questions.tID);

--load answer requests for user in session
SELECT Answers.aText as answersText,
                   Questions.qId as questionID,
                   Questions.qText as questionText,
                   Answers.aStatus as answerStatus,
                   Topics.tName as topicsName,
                   UserTable.fName as firstName,
                   UserTable.lName as lastName,
                   UserTable.uName as userName,
                   UserTable.uURL as userURL
            FROM Questions, Answers, Topics, UserTable
            WHERE (Questions.qID = Answers.qID
                AND Topics.tID = Questions.tID
                AND UserTable.uName = Questions.uName
                AND Answers.uName = '$uName'
                AND Answers.aStatus = 'N');

--load previous answers for user in session
SELECT Answers.aText as answersText,
                   Questions.qId as questionID,
                   Questions.qText as questionText,
                   Answers.aStatus as answerStatus,
                   Topics.tName as topicsName,
                   UserTable.fName as firstName,
                   UserTable.lName as lastName,
                   UserTable.uName as userName,
                   UserTable.uURL as userURL
            FROM Questions, Answers, Topics, UserTable
            WHERE (Questions.qID = Answers.qID
                AND Topics.tID = Questions.tID
                AND UserTable.uName = Questions.uName
                AND Answers.uName = '$uName'
                AND (Answers.aStatus = 'R' OR Answers.aStatus = 'A'));

--count the amount of answer request 
SELECT COUNT(aID)
FROM Answers
WHERE aStatus = 'N'
AND uName = (SELECT uName
             FROM UserTable
             WHERE uName = "CrisTJ");
