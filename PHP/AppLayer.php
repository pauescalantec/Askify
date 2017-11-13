<?php
session_start();
header('Content-type: application/json');
require_once __DIR__ . '/DataLayer.php';
$action = $_POST["action"];

switch ($action) {
    case "login":
        Login();
    break;
    case "register":
        Register();
    break;
    case "loadProfile":
        loadProfile();
    break;
    case "loadTopics":
        loadTopics();
    break;
    case "loadRestTopics":
        loadRestTopics();
    break;
    case "addTopics":
        addTopics();
    break;
    case "loadSearchRestTopics":
        searchRestTopics();
    break;
    case "checkSession":
        sessionFunction();
    break;
    case "logOut" :
        deleteSessionFunction();
    break;
    case "loadTopicIndex":
        loadTopicIndex();
    break;
    case "loadHighestRank":
        loadHighestRank();
    break;
    case "loadMostVisitedTopic":
        loadMostVisitedTopic();
    break;
    case "loadMostVisitedTopicByUser":
        loadMostVisitedTopicByUser();
    break;
    case "loadTutorByTopic" :
        loadTutorByTopic();
    break;
    case "getFullNameFromUsername":
        getFullNameFromUsername();
    break;
    case "postQuestion":
        postQuestion();
    break;
    case "loadAnswerRequest":
        loadAnswerRequest();
    break;
    case "loadPreviousAnswers":
        loadPreviousAnswers();
    break;
    case "loadTutorByTopicSearch":
        loadTutorByTopicSearch();
    break;
    case "loadUnansweredQuestions":
        loadUnansweredQuestions();
    break;
    case "loadAnsweredQuestions":
        loadAnsweredQuestions();
    break;
    case "modifyQuestion":
        modifyQuestion();
    break;
    case "deleteQuestion":
        deleteQuestion();
    break;
    case "updateRanking":
        updateRanking();
    break;
}

function deleteSessionFunction() {
    session_destroy();
    echo json_encode("log out successful.");
}

function sessionFunction() {
    session_start();
    if( isset($_SESSION["uName"])) {
          echo json_encode(array("uName" => $_SESSION["uName"]));
    }
    else {
        genericErrorFunction("400");
    }
}

function getSessionUser(){
    session_start();

    if(isset($_SESSION["uName"])) {
        $uName = $_SESSION["uName"];
    }

    else {
        $uName = NULL;
    }

    return $uName;
}

function Register(){
    $uName = $_POST["uName"];
    $uPass = $_POST["uPass"];
    $fName = $_POST["fName"];
    $lName = $_POST["lName"];
    $uEmail = $_POST["uEmail"];
    $uMajor = $_POST["uMajor"];

    if($uName == "" or $uPass == "" or $fName == "" or $lName == "" or $uEmail == "" or $uMajor == "") {
        genericErrorFunction("406");
    }

    else {
        $uGradYear = $_POST["uGradYear"];
        $do = doRegister($uName,$uPass,$fName,$lName,$uEmail,$uMajor,$uGradYear);
        if($do["status"] == "Work"){
            $result = array("message" => "Thank you! Your registration was sucessfull");
            echo json_encode($result);
        }else{
            header('HTTP/1.1 500' . $do["status"]);
            die($do["status"]);
        }
    }
}

function Login(){
    $username = $_POST["uName"];
    $pass = $_POST["uPassword"];
    $rememberMe = $_POST["rememberMe"];

    $do = doLogin($username,$pass);

    if($do["status"] == "Work"){
        if($rememberMe){
            setcookie("cookieuName", $username,time() + (86400 * 30), "/","",0);
        }
        $result = array("message" => "Login Sucessfull");
        echo json_encode($result);
    }else{
        header('HTTP/1.1 500' . $do["status"]);
        die($do["status"]);
    }
}

function loadProfile(){
    $uName = getSessionUser();

    if (!is_null($uName)){

        $loadProfileResponse = dataLoadProfile($uName);

        if ($loadProfileResponse["MESSAGE"] == "SUCCESS") {
            $response = $loadProfileResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($loadProfileResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function loadUnansweredQuestions(){
    $uName = getSessionUser();

    if (!is_null($uName)){

        $loadUnansweredQuestionsResponse = dataLoadUnansweredQuestions($uName);

        if ($loadUnansweredQuestionsResponse["MESSAGE"] == "SUCCESS") {
            $response = $loadUnansweredQuestionsResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($loadUnansweredQuestionsResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function loadAnsweredQuestions(){
    $uName = getSessionUser();

    if (!is_null($uName)){

        $loadAnsweredQuestionsResponse = dataLoadAnsweredQuestions($uName);

        if ($loadAnsweredQuestionsResponse["MESSAGE"] == "SUCCESS") {
            $response = $loadAnsweredQuestionsResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($loadAnsweredQuestionsResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function loadTopics(){
    $uName = getSessionUser();

    if (!is_null($uName)){

        $loadTopicsResponse = dataLoadTopics($uName);

        if ($loadTopicsResponse["MESSAGE"] == "SUCCESS") {
            $response = $loadTopicsResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($loadTopicsResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function loadTopicIndex(){
    $do = doLoadTopicsIndex();
    if($do["MESSAGE"] == "SUCCESS"){
        $response = $do["response"];
        echo json_encode($response);
    }else{
        genericErrorFunction($do["MESSAGE"]);
    }

}

function loadRestTopics(){
    $uName = getSessionUser();

    if (!is_null($uName)){

        $loadRestTopicsResponse = dataLoadRestTopics($uName);

        if ($loadRestTopicsResponse["MESSAGE"] == "SUCCESS") {
            $response = $loadRestTopicsResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($loadRestTopicsResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function loadTutorByTopic(){
    $currentTopic =  $_POST["currentTopic"];
    $currentUser =  getSessionUser();
    if (!is_null($currentUser)){

        $loadTutorByTopicResponse = dataLoadTutorByTopic($currentTopic, $currentUser);

        if ($loadTutorByTopicResponse["MESSAGE"] == "SUCCESS") {
            $response = $loadTutorByTopicResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($loadTutorByTopicResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

<<<<<<< HEAD
=======
function loadTutorByTopicSearch(){
    $currentTopic =  $_POST["currentTopic"];
    $searchField =  $_POST["searchFieldTutors"];
    $currentUser =  getSessionUser();

    if (!is_null($currentUser)){
        $loadTutorByTopicSearchResponse = dataLoadTutorByTopicSearch($currentTopic, $currentUser,$searchField);

        if ($loadTutorByTopicSearchResponse["MESSAGE"] == "SUCCESS") {
            $response = $loadTutorByTopicSearchResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($loadTutorByTopicSearchResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}


>>>>>>> 398bd72b5dbfb807cdbbe5c5178a22039d10b552
function searchRestTopics(){
    $uName = getSessionUser();
    $searchField = $_POST["searchField"];

    if (!is_null($uName)){

        $searchRestTopicsResponse = dataSearchRestTopics($uName, $searchField);

        if ($searchRestTopicsResponse["MESSAGE"] == "SUCCESS") {
            $response = $searchRestTopicsResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($searchRestTopicsResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function addTopics(){
    $uName = getSessionUser();
    $topicsToAdd = $_POST["topicsList"];
    $topicsToAddCount = $_POST["topicsCount"];

    if (!is_null($uName)){
        $addTopicsResponse = dataAddTopics($uName, $topicsToAdd, $topicsToAddCount);

        if ($addTopicsResponse["MESSAGE"] == "SUCCESS") {
            $response = "Successfully added";
            echo json_encode($response);
        }

        else {
            genericErrorFunction($addTopicsResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function modifyQuestion(){
    $uName = getSessionUser();
    $questionId = $_POST["questionId"];
    $questionText = $_POST["questionText"];

    if (!is_null($uName)){
        $modifyQuestionResponse = dataModifyQuestion($questionId, $questionText);

        if ($modifyQuestionResponse["MESSAGE"] == "SUCCESS") {
            $response = "Successfully added";
            echo json_encode($response);
        }

        else {
            genericErrorFunction($modifyQuestionResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function updateRanking(){
    $uName = getSessionUser();
    $questionId = $_POST["questionId"];
    $rating = $_POST["rating"];

    if (!is_null($uName)){
        $updateRankingResponse = dataUpdateRanking($questionId, $rating);

        if ($updateRankingResponse["MESSAGE"] == "SUCCESS") {
            $response = "Successfully added";
            echo json_encode($response);
        }

        else {
            genericErrorFunction($updateRankingResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function deleteQuestion(){
    $uName = getSessionUser();
    $questionId = $_POST["questionId"];

    if (!is_null($uName)){
        $deleteQuestionResponse = dataDeleteQuestion($questionId);

        if ($deleteQuestionResponse["MESSAGE"] == "SUCCESS") {
            $response = "Successfully added";
            echo json_encode($response);
        }

        else {
            genericErrorFunction($deleteQuestionResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function postQuestion(){

    $uName = getSessionUser();
    $question = $_POST["question"];
    $tutor = $_POST["tutor"];
    $topic = $_POST["topic"];

    $questionsCount = dataGetQuestionCount();
    $answersCount = dataGetAnswersCount();

    if ($questionsCount >= 0 and $answersCount >=0) {

        $questionId = $uName . $tutor . ($questionsCount["count"]+1);
        $answerId = $tutor . $uName . ($answersCount["count"]+1);


        if (!is_null($uName)){
            $postQuestionResponse = dataPostQuestion($uName, $question, $tutor, $topic, $questionId, $answerId);

            if ($postQuestionResponse["MESSAGE"] == "SUCCESS") {
                $response = "Successfully added";
                echo json_encode($response);
            }

            else {
                genericErrorFunction($postQuestionResponse["MESSAGE"]);
            }
        }

        else {
            genericErrorFunction("406");
        }
    }

    else {
        genericErrorFunction("409");
    }

}

function loadHighestRank(){
    $do = doLoadHighestRank();
    if($do["MESSAGE"] == "SUCCESS"){
        $response = $do["response"];
        echo json_encode($response);
    }else{
        genericErrorFunction($do["MESSAGE"]);
    }
}

function loadMostVisitedTopic(){
    $do = doloadMostVisitedTopic();
    if($do["MESSAGE"] == "SUCCESS"){
        $response = $do["response"];
        echo json_encode($response);
    }else{
        genericErrorFunction($do["MESSAGE"]);
    }
}

function loadMostVisitedTopicByUser(){
    $do = doloadMostVisitedTopicByUser();
    if($do["MESSAGE"] == "SUCCESS"){
        $response = $do["response"];
        echo json_encode($response);
    }else{
        genericErrorFunction($do["MESSAGE"]);
    }
}

function getFullNameFromUsername(){
    $uName = $_POST["username"];

    if (!is_null($uName)){

        $getFullNameFromUsernameResponse = dataGetFullNameFromUsername($uName);

        if ($getFullNameFromUsernameResponse["MESSAGE"] == "SUCCESS") {
            $response = $getFullNameFromUsernameResponse["response"];
            echo json_encode($response);
        }

        else {
            genericErrorFunction($getFullNameFromUsernameResponse["MESSAGE"]);
        }
    }

    else {
        genericErrorFunction("406");
    }
}

function loadAnswerRequest(){
    $uName = getSessionUser();
        if (!is_null($uName)){

            $loadAnswersResponse = doLoadAnswerRequest($uName);

            if ($loadAnswersResponse["MESSAGE"] == "SUCCESS") {
                $response = $loadAnswersResponse["response"];
                echo json_encode($response);
            }

            else {
                genericErrorFunction($loadAnswersResponse["MESSAGE"]);
            }
        }

        else {
            genericErrorFunction("406");
        }
}

function loadPreviousAnswers(){
    $uName = getSessionUser();
        if (!is_null($uName)){

            $loadAnswersResponse = doLoadPreviousAnswers($uName);

            if ($loadAnswersResponse["MESSAGE"] == "SUCCESS") {
                $response = $loadAnswersResponse["response"];
                echo json_encode($response);
            }

            else {
                genericErrorFunction($loadAnswersResponse["MESSAGE"]);
            }
        }

        else {
            genericErrorFunction("406");
        }
}

function genericErrorFunction($errorCode){
    switch($errorCode)
    {
        case "400" : header("HTTP/1.1 400 Not found");
                     die("Element not found.");
                     break;
        case "500" : header("HTTP/1.1 500 Bad connection, portal down");
                     die("The server is down, we couldn't establish the data base connection.");
                     break;
        case "406" : header("HTTP/1.1 406 User not found.");
                     die("Wrong credentials provided.");
                     break;
        case "409" : header("HTTP/1.1 406 User already exists.");
                     die("Wrong credentials provided.");
                     break;
        case "204" : header("HTTP/1.1 406 No comments.");
                     die("No comments in database.");
                     break;

    }
}
