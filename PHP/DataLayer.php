<?php

function doDBconnection(){
    $serverName = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "baeAskify";

    $conn = new mysqli($serverName,$username,$password,$dbname);
    if($conn->connect_error){
        return null;
    }else{
        return $conn;
    }
}

function doLogin($uName,$uPass){
    $conn = doDBconnection();

    if($conn != NULL){
        $sqlLogin = "SELECT uName
        FROM UserTable
        WHERE uName = '$uName'
        AND   uPass = '$uPass'";

        $result = $conn->query($sqlLogin);

        if($result->num_rows> 0){
            while($row = $result->fetch_assoc()){
                $response = array("uName"=>$row["uName"]);
            }
            session_start();
            $_SESSION['is_open'] = "TRUE";
            $_SESSION['uName'] = $uName;
            $conn->close();
            return array("status" => "Work");
        }else{
            $conn->close();
            return array("status" => "Please verify credentials");
        }
    }else{
        $conn->close();
        return array("status" => "Failed to connect to the database");
    }
}

function doRegister($uName,$uPass,$fName,$lName,$uEmail,$uMajor,$uGradYear){
    $conn = doDBconnection();
    if($conn != NULL){
        $rate = -1;
        $url = "";
        $sqlRegister = "SELECT *
        FROM UserTable
        WHERE uName = '$uName'";
        $qResult = $conn->query($sqlRegister);
        if($qResult->num_rows === 0){
            $sqlLogin = "INSERT INTO UserTable
            VALUES  ('$uName', '$uPass', '$fName', '$lName','$uEmail','$uMajor','$uGradYear','$rate','$url')";
            $qResult = $conn->query($sqlLogin);
            if($qResult === TRUE){
                $conn->close();
                return array("status" => "Work");
            }else{
                $conn->close();
                return array("status" => "Registration failed");
            }
        } else{
            $conn->close();
            return array("status" => "Please choose a different username. That username is taken");
        }
    }else{
        $conn->close();
        return array("status" => "Failed to connect to the database");
    }
}

function dataGetQuestionCount(){

    $connection = doDBconnection();

    if ($connection != null){

        $sql = "SELECT COUNT(*) as total FROM Questions";

        $result = $connection->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response = array("count"=>$row["total"]);
            }

            $connection->close();
            return $response;
        }

        else
        {
            $connection->close();
            return array("count"=>"-1");
        }
    }
    else{
        return array("count"=>"-1");
    }
}

function dataGetAnswersCount(){
    $connection = doDBconnection();

    if ($connection != null){
        $sql = "SELECT COUNT(*) as total
                FROM Answers";

        $result = $connection->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response = array("count"=>$row["total"]);
            }

            $connection->close();
            return $response;
        }

        else
        {
            $connection->close();
            return array("count"=>"-1");
        }
    }
    else{
        return array("count"=>"-1");
    }
}

function dataPostQuestion($uName, $question, $tutor, $topic, $questionId, $answerId) {
    $conn = doDBconnection();

    if ($conn != null){

        $sql1 = "INSERT INTO Questions VALUES ('$questionId','$topic','$uName','$question')";

        $sql2 = "INSERT INTO Answers VALUES ('$answerId','$tutor','$questionId','N','','-1')";

        if (mysqli_query($conn, $sql1) and mysqli_query($conn, $sql2) ) {
            $response = array("MESSAGE"=>"SUCCESS");
            $conn->close();
            return $response;
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataLoadTutorByTopic($currentTopic, $currentUser){
    $conn = doDBconnection();

    if ($conn != null){

        $sql = "SELECT * FROM UserTable WHERE uName != '$currentUser' AND uName IN (SELECT uName FROM HasExpertise WHERE tID = '$currentTopic')";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response[$counter++] = array("firstName"=>$row["fName"], "lastName"=>$row["lName"], "major"=>$row["uMajor"], "gradYear"=>$row["uGradYear"], "username"=>$row["uName"], "uRating"=>$row["uRating"], "uURL"=>$row["uURL"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataLoadUnansweredQuestions($uName){
    $conn = doDBconnection();
    
    if ($conn != null){

        $sql = "SELECT Questions.qText as question, Questions.qID as questionId, Answers.uName as username, Answers.aStatus as status, Answers.aRating as rating, Answers.aText as answer, UserTable.fName as fName, UserTable.lName as lName, Topics.tName as topic FROM Questions, Answers, UserTable, Topics WHERE (Questions.uName = '$uName' AND Questions.qId = Answers.qId AND Answers.aStatus = 'N' AND Answers.uName = UserTable.uName AND Topics.tID = Questions.tID)";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response[$counter++] = array("username"=>$row["username"], "question"=>$row["question"], "questionId"=>$row["questionId"], "status"=>$row["status"], "rating"=>$row["rating"], "answer"=>$row["answer"], "firstName"=>$row["fName"], "lastName"=>$row["lName"], "topic"=>$row["topic"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataLoadAnsweredQuestions($uName){
    $conn = doDBconnection();
    
    if ($conn != null){

        $sql = "SELECT Questions.qText as question, Questions.qID as questionId, Answers.uName as username, Answers.aStatus as status, Answers.aRating as rating, Answers.aText as answer, UserTable.fName as fName, UserTable.lName as lName, Topics.tName as topic FROM Questions, Answers, UserTable, Topics WHERE (Questions.uName = '$uName' AND Questions.qId = Answers.qId AND (Answers.aStatus = 'R' OR Answers.aStatus = 'A') AND Answers.uName = UserTable.uName AND Topics.tID = Questions.tID)
        ORDER BY (Answers.aStatus = 'A') DESC, Answers.aStatus";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response[$counter++] = array("username"=>$row["username"], "question"=>$row["question"], "questionId"=>$row["questionId"], "status"=>$row["status"], "rating"=>$row["rating"], "answer"=>$row["answer"], "firstName"=>$row["fName"], "lastName"=>$row["lName"], "topic"=>$row["topic"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataLoadTutorByTopicSearch($currentTopic, $currentUser, $searchField){
    $conn = doDBconnection();

    if ($conn != null){
        $field = "%" . $searchField . "%";

        $sql = "SELECT * FROM UserTable WHERE (uName LIKE '$field' or fName LIKE '$field' or lName LIKE '$field') AND uName != '$currentUser' AND uName IN (SELECT uName FROM HasExpertise WHERE tID = '$currentTopic')";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response[$counter++] = array("firstName"=>$row["fName"], "lastName"=>$row["lName"], "major"=>$row["uMajor"], "gradYear"=>$row["uGradYear"], "username"=>$row["uName"], "uRating"=>$row["uRating"], "uURL"=>$row["uURL"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataLoadProfile($uName){
    $conn = doDBconnection();

    if ($conn != null){

        $sql = "SELECT * FROM UserTable WHERE uName = '$uName'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            while ($row = $result->fetch_assoc())
            {
                $response = array("firstname"=>$row["fName"], "lastname"=>$row["lName"], "email"=>$row["uEmail"], "major"=>$row["uMajor"], "gradYear"=>$row["uGradYear"], "username"=>$row["uName"], "uRating"=>$row["uRating"], "uURL"=>$row["uURL"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataLoadTopics($uName){
    $conn = doDBconnection();
    if ($conn != null){
        $sql = "SELECT *
                FROM Topics
                WHERE tID IN
                            (SELECT tID
                            FROM HasExpertise WHERE uName = '$uName')";
        $result = $conn->query($sql);
        if ($result->num_rows > 0){
            $counter = 0;
            while ($row = $result->fetch_assoc()){
                $response[$counter++] = array("topicId"=>$row["tID"], "topicURL"=>$row["tURL"], "topicName"=>$row["tName"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataLoadRestTopics($uName){
    $conn = doDBconnection();

    if ($conn != null){

        $sql = "SELECT * FROM Topics WHERE tID NOT IN (SELECT tID FROM HasExpertise WHERE uName = '$uName')";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response[$counter++] = array("topicId"=>$row["tID"], "topicURL"=>$row["tURL"], "topicName"=>$row["tName"]);
            }

            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataGetFullNameFromUsername($uName){
    $conn = doDBconnection();

    if ($conn != null){

        $sql = "SELECT fName, lName FROM UserTable WHERE uName = '$uName'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            while ($row = $result->fetch_assoc())
            {
                $response = array("fullName"=>($row["fName"] . " " . $row["lName"]));
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataSearchRestTopics($uName, $searchField){
    $conn = doDBconnection();

    if ($conn != null){
        $field = "%" . $searchField . "%";
        $sql = "SELECT * FROM Topics WHERE tName LIKE '$field' AND tID NOT IN (SELECT tID FROM HasExpertise WHERE uName = '$uName')";

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            $counter = 0;

            while ($row = $result->fetch_assoc())
            {
                $response[$counter++] = array("topicId"=>$row["tID"], "topicURL"=>$row["tURL"], "topicName"=>$row["tName"]);
            }

            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataAddTopics($uName, $topicsToAdd, $topicsToAddCount){
    $conn = doDBconnection();

    if ($conn != null){

        $sql = "INSERT INTO HasExpertise VALUES ";

        for ($x = 0; $x < $topicsToAddCount-1; $x++) {
            $tempValue = $topicsToAdd[$x];
            $sql = $sql . "('$uName','$tempValue'), ";
        }

        $tempValue = $topicsToAdd[$topicsToAddCount-1];
        $sql = $sql . "('$uName','$tempValue');";

        if (mysqli_query($conn, $sql)) {
            $response = array("MESSAGE"=>"SUCCESS");
            $conn->close();
            return $response;
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataModifyQuestion($questionId, $questionText){
    $conn = doDBconnection();

    if ($conn != null){

        $sql = "UPDATE Questions SET qText = '$questionText' WHERE qID = '$questionId'";

        if (mysqli_query($conn, $sql)) {
            $response = array("MESSAGE"=>"SUCCESS");
            $conn->close();
            return $response;
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataUpdateAnswer($questionId, $answerText){
    $conn = doDBconnection();
    
    if ($conn != null){

        $sql = "UPDATE Answers SET aText = '$answerText', aStatus = 'A', aRating = '-1' WHERE qID = '$questionId'";

        if (mysqli_query($conn, $sql)) {
            $response = array("MESSAGE"=>"SUCCESS");
            $conn->close();
            return $response;
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataUpdateRanking($questionId, $rating){
    $conn = doDBconnection();

    if ($conn != null){

        $sql = "UPDATE Answers SET aRating = '$rating', aStatus = 'R' WHERE qID = '$questionId'";

        if (mysqli_query($conn, $sql)) {
            $response = array("MESSAGE"=>"SUCCESS");
            $conn->close();
            return $response;
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }
    else{
        return array("MESSAGE"=>"500");
    }
}


function dataSendAnswer($questionId, $answerText){
    $conn = doDBconnection();

    if ($conn != null){
        $sql = "UPDATE Answers SET aText = '$answerText', aStatus = 'A' WHERE qID = '$questionId'";

        if (mysqli_query($conn, $sql)) {
            $response = array("MESSAGE"=>"SUCCESS");
            $conn->close();
            return $response;
        }

        else
        {
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function dataDeleteQuestion($questionId){
    $conn = doDBconnection();

    if ($conn != null){

        $sql1 = "DELETE FROM Questions WHERE qID = '$questionId'";

        $answerIDSql = "SELECT aID FROM Answers WHERE qID = '$questionId'";
        $result = $conn->query($answerIDSql);
        
        if ($result->num_rows > 0)
        {
            while ($row = $result->fetch_assoc())
            {
                $response = array("answerId"=>$row["aID"]);
            }

            $answerId = $response["answerId"];
            $sql2 = "DELETE FROM Answers WHERE aID = '$answerId'";
        
            if (mysqli_query($conn, $sql1) && mysqli_query($conn, $sql2)) {
                $response = array("MESSAGE"=>"SUCCESS");
                $conn->close();
                return $response;
            }
    
            else
            {
                $conn->close();
                return array("MESSAGE"=>"406");
            }
        }

        else {
            return array("MESSAGE"=>"500");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function doLoadTopicsIndex(){
    $conn = doDBconnection();
    if($conn != NULL){
        $sqlTopics = "SELECT *
                      FROM Topics";
        $result = $conn->query($sqlTopics);
        if($result->num_rows>0){
            $counter = 0;
            while($row = $result->fetch_assoc()){
                $response[$counter++] = array("topicName"=>$row["tName"],"topicDescription"=>$row["tDescription"],
                      "topicImage"=>$row["tURL"], "topicId"=>$row["tID"]);
            }
                $conn->close();
                return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }else{
        $conn->close();
        return $resultArr;
        return array("MESSAGE"=>"500");
        }
}

function doLoadHighestRank(){
    $conn = doDBconnection();
    if($conn != NULL){
        $sqlRank = "SELECT uName
                    FROM UserTable
                    WHERE uRating = (SELECT MAX(uRating)
                                    FROM UserTable)
                    LIMIT 1;";
        $result = $conn->query($sqlRank);
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $response = array("uName"=>$row["uName"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }else{
        $conn->close();
        return $resultArr;
        return array("MESSAGE"=>"500");
        }

}

function doloadMostVisitedTopic(){
    $conn = doDBconnection();
    if($conn != NULL){
        $sqlMostVisited = "SELECT tName
                          FROM Topics
                          WHERE tID = (SELECT tID
                                      FROM Questions
                                      GROUP BY tID
                                      ORDER BY COUNT(*) DESC
                                      LIMIT 1);";
        $result = $conn->query($sqlMostVisited);
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $response = array("tName"=>$row["tName"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }else{
        $conn->close();
        return $resultArr;
        return array("MESSAGE"=>"500");
    }

}

function doloadMostVisitedTopicByUser(){
    $conn = doDBconnection();
    $user = $_SESSION['uName'];
    if($conn != NULL){
        $sqlMostVisitedUSER = "SELECT tName
                              FROM Topics
                              WHERE tID = (SELECT tID
                                			FROM Questions
                                			WHERE uName = '$user'
                                			GROUP BY tID
                                			ORDER BY COUNT(*) DESC
                                			LIMIT 1);";
        $result = $conn->query($sqlMostVisitedUSER);
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $response = array("tName"=>$row["tName"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }else{
        $conn->close();
        return $resultArr;
        return array("MESSAGE"=>"500");
    }
}

function doLoadAnswerRequest($uName){
    $conn = doDBconnection();
    if ($conn != null){
        $sql = "SELECT Answers.aText as answersText,
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
                        AND Answers.aStatus = 'N')";
        $result = $conn->query($sql);
        if ($result->num_rows > 0){
                $counter = 0;

                while ($row = $result->fetch_assoc()){
                    $response[$counter++] =
                    array("firstName"=>$row["firstName"],
                    "lastName"=>$row["lastName"],
                    "username"=>$row["userName"],
                    "userImage"=>$row["userURL"],
                    "questionId"=>$row["questionID"],
                    "answer"=>$row["answersText"],
                    "question"=>$row["questionText"],
                    "topic"=>$row["topicsName"]);
                }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }

    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function doLoadPreviousAnswers($uName){
    $conn = doDBconnection();
    if ($conn != null){
        $sql = "SELECT Answers.aText as answersText,
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
                        AND (Answers.aStatus = 'R'
                            OR Answers.aStatus = 'A'))";
        $result = $conn->query($sql);
        if ($result->num_rows > 0){
                $counter = 0;

                while ($row = $result->fetch_assoc()){
                    $response[$counter++] =
                    array("firstName"=>$row["firstName"],
                    "lastName"=>$row["lastName"],
                    "username"=>$row["userName"],
                    "userImage"=>$row["userURL"],
                    "questionId"=>$row["questionID"],
                    "answer"=>$row["answersText"],
                    "question"=>$row["questionText"],
                    "topic"=>$row["topicsName"]);
                }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }
    else{
        return array("MESSAGE"=>"500");
    }
}

function doloadCountRequest($uName){
    $conn = doDBconnection();
    if($conn != NULL){
        $sqlCountRequest = "SELECT COUNT(aID) as cont
                            FROM Answers
                            WHERE aStatus = 'N'
                            AND uName = (SELECT uName
                                        FROM UserTable
                                        WHERE uName = '$uName')";

        $result = $conn->query($sqlCountRequest);
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $response = array("aID"=>$row["cont"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }else{
        $conn->close();
        return $resultArr;
        return array("MESSAGE"=>"500");
    }
}

function doloadCountAnswers($uName){
    $conn = doDBconnection();
    if($conn != NULL){
        $sqlCountRequest = "SELECT COUNT(aID) as cont
                            FROM Answers, Questions
                            WHERE aStatus = 'A'
        	                    AND Questions.qID = Answers.qID
                                AND Questions.uName = '$uName';";

        $result = $conn->query($sqlCountRequest);
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $response = array("aID"=>$row["cont"]);
            }
            $conn->close();
            return array("response"=>$response, "MESSAGE"=>"SUCCESS");
        }else{
            $conn->close();
            return array("MESSAGE"=>"406");
        }
    }else{
        $conn->close();
        return $resultArr;
        return array("MESSAGE"=>"500");
    }
}
