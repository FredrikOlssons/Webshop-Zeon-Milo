<?php

try {

    include_once("./../controllers/courrierController.php");

    if($_SERVER["REQUEST_METHOD"] == "GET") {
        
        if($_GET["action"] == "getAll") {

            $controller = new courrierController(); 

            echo(json_encode($controller->getAll()));
            
            exit;

        } else if($_GET["action"] == "getById") {
            
            $controller = new courrierController();

            if(!isset($_GET["id"])) {
                throw new Exception("Missing ID", 501);
                exit;
            }
            
            echo(json_encode($controller->getById((int)$_GET["id"])));
            exit; 
            
        }
    }    

} catch(Exception $e) {
    echo json_encode(array("Message" => $e->getMessage(), "Status" => $e->getCode()));
}


?>