<?php

try {

include_once("./../controllers/subscriptionNewsController.php"); 

if($_SERVER["REQUEST_METHOD"] == "POST") {
        
    if($_POST["action"] == "addSubscriptionNews") {

        if(isset($_POST["subscriber"]) || isset($_SESSION['inloggedUser'])) {

            $controller = new SubscriptionNewsController();

            echo(json_encode($controller->add(json_decode($_POST["subscriber"]))));
            
            exit; 
        }

    }
    } else if($_SERVER["REQUEST_METHOD"] == "GET") {

            if($_GET["action"] == "getAllLoggedInSubscribers"){
            
            $controller = new SubscriptionNewsController(); 

    
            echo(json_encode($controller->getAllLoggedInSubscribers()));
    
            exit; 
    }

    }else{

        echo json_encode('The information is not correct');
        
        };
        
        
  

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}



?>