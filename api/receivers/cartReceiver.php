<?php

try {

    include_once("./../controllers/productController.php");

    if($_SERVER["REQUEST_METHOD"] == "GET") { 

        if(isset($_GET["action"]) == "getCart") {

            if(isset($_SESSION["myCart"])) {

                $myCart = $_SESSION["myCart"]; 

                echo json_encode($myCart);
                exit;

            } else {
                echo json_encode(false);
                exit;
            }
        } 
    }
    
    else if($_SERVER["REQUEST_METHOD"] == "POST") {

        if($_POST["action"] == "addProduct") {
            
            if(isset($_POST["productId"])) {

                $productId = json_decode($_POST["productId"]);

                $controller = new ProductController();
                $productDb = ($controller->getById(json_decode($productId)));
                $cart = json_decode($_SESSION["myCart"]);

                if(!$productDb) {
                    throw new Exception("Found no match to ID in DB", 401);
                    exit;
                }

                if(!$cart) {
                    $cart = []; 
               }

                if($productDb->unitsInStock == 0) {
                    echo json_encode("Sorry, we do not have more of this product available for reservation");
                    exit;
                } 

                $productDb->quantity = 1;

                foreach ($cart as $i => $cartItem) { 

                    if($productDb->Id == $cartItem->Id) {

                        if($cartItem->quantity >= $productDb->unitsInStock) {
                            echo json_encode("Sorry, we do not have more of this product available for reservation");
                            exit;
                        }

                        $cart[$i]->quantity += 1; 

                        $_SESSION["myCart"] = json_encode($cart);
                        echo json_encode("Product is added to cart");
                        exit;
                    } 

                    if($i < 0) {

                        array_push($cart, $productDb);
    
                        $_SESSION["myCart"] = json_encode($cart);
    
                        echo json_encode("Product is added to cart");
                        exit;
                    } 
                }

                array_push($cart, $productDb);
    
                $_SESSION["myCart"] = json_encode($cart);

                echo json_encode("Product is added to cart");
                exit;  

            } else {
                throw new Exception("Missing ID", 401);
                exit;
            }

        } else if($_POST["action"] == "deleteProduct") {

            if(isset($_POST["productId"])) { 

                $productId = json_decode($_POST["productId"]);

                $controller = new ProductController();
                $productDb = ($controller->getById(json_decode($productId)));
                $cart = json_decode($_SESSION["myCart"]);

                if(!$cart) {
                    throw new Exception("Cart is empty", 401);
                    exit;
                }

                if(!$productDb) {
                    throw new Exception("Found no match to ID in DB", 401);
                    exit;
                }

                foreach ($cart as $i => $cartItem) { 

                    if($productDb->Id == $cartItem->Id) {
           
                        if($cart[$i]->quantity == 1) {

                            array_splice($cart, $i, 1);

                            $_SESSION["myCart"] = json_encode($cart);
                            exit;
                        
                        } else {

                            $cart[$i]->quantity -= 1; 

                            $_SESSION["myCart"] = json_encode($cart);
                            exit;
                        }  
                    } 
                }
            } else {
                throw new Exception("Missing ID", 401);
                exit;
            }
        } else if($_POST["action"] == "deleteItem") {

                if(isset($_POST["productId"])) { 

                    $productId = json_decode($_POST["productId"]);

                    
                    $controller = new ProductController();
                    $productDb = ($controller->getById(json_decode($productId)));
                    $cart = json_decode($_SESSION["myCart"]);
                    
                    if(!$cart) {
                        throw new Exception("Cart is empty", 401);
                        exit;
                    }
                    
                    if(!$productDb) {
                        throw new Exception("Found no match to ID in DB", 401);
                        exit;
                    }

                    foreach ($cart as $i => $cartItem) {

                        if($productDb->Id == $cartItem->Id) {

                            array_splice($cart, $i, 1); 

                            $_SESSION["myCart"] = json_encode($cart); 
                            exit; 

                        }

                    }

                } 

        } else {
            throw new Exception("Missing ID", 401);
            exit;
        }
    }
    

} catch(Exception $e) {
    echo json_encode(array("Message" => $e->getMessage(), "Status" => $e->getCode()));
}


?>