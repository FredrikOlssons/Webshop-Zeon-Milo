<?php 

try {

    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");
    include_once("./../controllers/productController.php");
    include_once("./../controllers/userController.php");
    include_once("./../classes/database.php");


    class OrderDetailsController extends MainController {

        private $createOrderDetails = "createOrderDetails";   

        function __construct() {
            parent::__construct("orderdetails", "Orderdetails"); 
        }



        public function add($entity) {
            // Fungerar ej med normalisering? 
        }


        public function getAll() {  
            return $this->database->fetchAll($this->createFunction);  
        }


        public function getById($id) {
            return $this->database->fetchById($id, $this->createFunction);

        }


        public function update($newValue, $entity) {

        }

        public function delete($id) {
        // Fungerar ej med normalisering? 
        }





        /* Special Queries */

        public function addProducts($products, $orderId) {

            if(!isset($_SESSION["inloggedUser"])) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            for ($i=0; $i < count($products); $i++) { 
                    
                $product = $products[$i];

                $createOrderDetails = createOrderDetails($orderId, $product->Id, $product->quantity);  
                
                $addedProducts = $this->database->insert($createOrderDetails);    
            }

            return $addedProducts;

        }


        public function getOrderDetailsFromOrder($orderId, $productId) {

            if(!isset($_SESSION["inloggedUser"])) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            $query = "SELECT od.ProductID, od.OrderID, od.Quantity
            FROM `orderdetails` od
            JOIN `order` o
            ON od.OrderID = o.Id
            WHERE od.OrderID = ".$orderId." AND od.productId = ".$productId.";";

            $orderDetails = $this->database->freeQuery($query, $this->createOrderDetails); 

            return $orderDetails; 


        }

    }

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?>