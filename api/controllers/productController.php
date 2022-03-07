<?php 

try {

    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");
    include_once("./../controllers/userController.php");


    class ProductController extends MainController {

        private $createFunction = "createProduct";

        function __construct() {
            parent::__construct("Product", "Product");
        }


        public function add($entity) {

        }


        public function getAll() { 
            return $this->database->fetchAll($this->createFunction);  
        }
        

        public function getById($id) {
            return $this->database->fetchById($id, $this->createFunction);
        }



        public function update($newValue, $product) {

            $userController = new UserController();
            $checkAdmin = ($userController->verifyAdmin());

            if(!$checkAdmin) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            $productToUpdate = createProduct((int)$product->Id, $product->name , $product->description, (int)$product->unitPrice, (int)$newValue, $product->image); 

            unset($productToUpdate->quantity);

            $result = $this->database->update($productToUpdate); 
            
            return $result;
        }




        public function delete($id) {
            
            $userController = new UserController();
            $checkAdmin = ($userController->verifyAdmin());

            if(!$checkAdmin) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            return $this->database->delete($id);
        }







        /* Special Queries */

        // Ok att slå ihop denna med update med :   if(strpos($newValue, '+') !== false || strpos($newValue, '-') !== false) {$newValue = (int)$product->unitsInStock + (int)$newValue;}   ?
        // Eller vill du att jag delar upp även denna i addQuantity och deleteQuantity? Eller fick man göra vad man vill i controller? :P 
        public function addAndDeleteQuantity($newValue, $product) {
            
            $userController = new UserController();
            $checkAdmin = ($userController->verifyAdmin());

            if(!$checkAdmin) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            $newValue = (int)$product->unitsInStock + (int)$newValue;
            
            $productToUpdate = createProduct((int)$product->Id, $product->name , $product->description, (int)$product->unitPrice, (int)$newValue, $product->image); 

            unset($productToUpdate->quantity);

            $result = $this->database->update($productToUpdate); 
            
            return $result;

        }


        // Uppdaterar unitsInStock på produkter när ordern är lagd
        public function updateQtyProductOrder($products) {

            if(!isset($_SESSION["inloggedUser"])) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            for ($i=0; $i < count($products); $i++) { 
                    
                $product = $products[$i];

                $newValue = $product->unitsInStock - $product->quantity; 
                $name = $product->name;
                $description = $product->description;
                $image = $product->image;

                $productToUpdate = createProduct((int)$product->Id, $name , $description, (int)$product->unitPrice, (int)$newValue, $image); 
                
                unset($productToUpdate->quantity);

                $updatedProducts = $this->database->update($productToUpdate); 
            }

            return $updatedProducts;
        }

        public function getProductsFromCategory($categoryID) { 
            $query = "SELECT p.Id, p.Name, p.Description, p.UnitPrice, p.UnitsInStock, p.Image
            FROM product p 
            JOIN productincategory pc
                ON pc.ProductId = p.Id
            WHERE pc.CategoryId = " . $categoryID. ";";
            return $this->database->freeQuery($query, $this->createFunction); 
        }  



        public function getProductsFromOrder($orderId) { 
            
            $query = "SELECT p.Id, p.name, p.description, p.unitPrice, p.unitsinstock, p.image FROM `product` p
            JOIN orderdetails od
                ON od.ProductID = p.Id
            WHERE od.orderId = ".$orderId.";";

            $productList = []; 

            $products =  $this->database->freeQuery($query, $this->createFunction); 
            
            for ($i=0; $i < count($products); $i++) { 
                
                $product = $products[$i]; 
                $productId = $product->Id;
                
                $orderDetailsController = new OrderDetailsController();
                $orderDetails = $orderDetailsController->getOrderDetailsFromOrder($orderId, $productId); 
                
                $quantity = $orderDetails[0]->quantity;

                $product->quantity = $quantity; 

                array_push($productList, $product); 

            }
            
            return $productList;
        }

    }



} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?>