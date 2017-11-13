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
SELECT tID
FROM Questions
GROUP BY tID
ORDER BY COUNT(*) DESC
LIMIT 1;

--Your Favorite Topic: despliega el topic que ha recibido mas preguntas por un usuario especifico
SELECT tID
FROM Questions
WHERE uName = '$uName'
GROUP BY tID
ORDER BY COUNT(*) DESC
LIMIT 1;

--Highest Ranked Tutor: despliega el nombre del usuario con mejor calificacion en base a su ranking
SELECT uName
FROM UserTable
WHERE uRating = (SELECT MAX(uRating)
                       FROM UserTable)
LIMIT 1;
