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
                $_SESSION['is_open'] = "TRUE";
                $_SESSION['uName'] = $uName;
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
