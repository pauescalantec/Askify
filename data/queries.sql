--despliega los nombres de los usuarios que tienen experiencia en un cierto tema
SELECT uName
FROM HasExpertise
WHERE   tID = (SELECT tID
             FROM Topics
             WHERE tName = "$tName")
--despliega la busqueda de un usuario en particular con cierta experiencia
SELECT *
FROM HasExpertise
WHERE uName = "%$uName%"
AND tID IN (SELECT tID
             FROM Topics
             WHERE tName = "$tName")
