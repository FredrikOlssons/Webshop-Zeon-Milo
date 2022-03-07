<?php

try {

    session_start();
    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");


    class OrderStatusController extends MainController {

        public $createOrderStatus = "createOrderStatus"; 

        function __construct() {
            parent::__construct("OrderStatus", "OrderStatus"); 
        }

        function add($entity) {

        }

        function getAll() {
            return $this->database->fetchAll($this->createOrderStatus);
        }

        public function getById($id) {

            $this->database->fetchById($id, $this->createOrderStatus); 

        }


        public function update($newValue, $orderStatus) {


        }
        
        public function delete($id) {
            return $this->database->delete($id);
        }




        public function getOrderStatus($id) {
            $query = "SELECT c.Id, c.Status, c.Description
            FROM `orderstatus` c
            JOIN `order` o
            ON o.StatusID = c.Id
            WHERE o.id = ".$id.";";

            return $this->database->freeQuery($query, $this->createOrderStatus);

        }




    }

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?>