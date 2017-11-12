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
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $response = array("uName"=>$row["uName"]);
            }
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
