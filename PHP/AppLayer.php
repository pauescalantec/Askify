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
    case "checkSession":
        sessionFunction();
    break;
    case "logOut" : 
        deleteSessionFunction();
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
