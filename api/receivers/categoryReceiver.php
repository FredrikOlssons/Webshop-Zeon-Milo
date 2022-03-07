<?php

try {

    include_once("./../controllers/categoryController.php");

    if($_SERVER["REQUEST_METHOD"] == "GET") {
        
        if($_GET["action"] == "getAll") {
          
            $controller = new categoryController(); 

            echo(json_encode($controller->getAll()));
            
            exit; 

        } else if($_GET["action"] == "getById") {
            
            $controller = new categoryController();

            if(!isset($_GET["id"])) {
                throw new Exception("Missing ID", 501);
                exit;
            }
            
            echo(json_encode($controller->getById((int)$_GET["id"])));
            exit; 
            
        } else if($_GET["action"] == "getCategoryWithProductId") {

            $controller = new categoryController();

            if(!isset($_GET["id"])) {
                throw new Exception("Missing ID", 501);
                exit;
            }

            echo(json_encode($controller->getCategoryWithProductId((int)$_GET["id"])));

        }
    }    

} catch(Exception $e) {
    echo json_encode(array("Message" => $e->getMessage(), "Status" => $e->getCode()));
}


?>