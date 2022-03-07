<?php

try {

    include_once("./../controllers/productInCategoryController.php");

    if($_SERVER["REQUEST_METHOD"] == "GET") {
        
        if($_GET["action"] == "getAll") {
          
            $controller = new ProductInCategoryController(); 

            echo(json_encode($controller->getAll()));
            
            exit; 

        } else if($_GET["action"] == "getById") {
            
            $controller = new ProductInCategoryController();

            if(!isset($_GET["id"])) {
                throw new Exception("Missing ID", 401);
                exit;
            }
            
            echo(json_encode($controller->getById((int)$_GET["id"])));
            exit; 
            
        } 

    }  else if($_SERVER["REQUEST_METHOD"] == "POST") {

        

        if($_POST["action"] == "addCategoryToProduct") {

            if(!isset($_POST["productId"])) {
                throw new Exception("Missing product ID", 401);
                exit;
            }
            
            if(!isset($_POST["categoryId"])) {
                throw new Exception("Missing category ID", 401);
                exit;
            }

            $controller = new ProductInCategoryController();

            echo(json_encode($controller->addProductToCategory((int)$_POST["productId"], (int)$_POST["categoryId"])));  

        } else if ($_POST["action"] == "deleteCategoryFromProduct") {

            if(!isset($_POST["productId"])) {
                throw new Exception("Missing product ID", 401);
                exit;
            }
            
            if(!isset($_POST["categoryId"])) {
                throw new Exception("Missing category ID", 401);
                exit;
            }

            $controller = new ProductInCategoryController();
            echo(json_encode($controller->deleteProductFromCategory((int)$_POST["productId"], (int)$_POST["categoryId"])));  
            exit; 

        } else if ($_POST["action"] == "replaceCategory") {

            if(!isset($_POST["productId"])) {
                throw new Exception("Missing product ID", 401);
                exit;
            }
            
            if(!isset($_POST["newCategoryId"])) {
                throw new Exception("Missing new category ID", 401);
                exit;
            }

            if(!isset($_POST["oldCategoryId"])) {
                throw new Exception("Missing current category ID", 401);
                exit;
            }

            $controller = new ProductInCategoryController();
            echo(json_encode($controller->replaceCategory((int)$_POST["productId"], (int)$_POST["newCategoryId"], (int)$_POST["oldCategoryId"])));  
            exit;  

        }


    }  

} catch(Exception $e) {
    echo json_encode(array("Message" => $e->getMessage(), "Status" => $e->getCode()));
}


?>