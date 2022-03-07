<?php 

try {

    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");


    class CourrierController extends MainController {

        public $createCourrier = "createCourrier";

        function __construct() {
            parent::__construct("Courrier", "Courrier");
        }


        function add($entity) {

        }

        function getAll() {
            return $this->database->fetchAll($this->createCourrier);
        }

        public function getById($id) {

            $courrier = $this->database->fetchById($id, $this->createCourrier); 

            return $courrier; 

        }


        public function update($newValue, $entity) {

        }
        
        public function delete($id) {
            return $this->database->delete($id);
        }




        public function getCourrierFromOrder($id) { 
        $query = "SELECT c.Id, c.CourrierName, c.Address, c.Email, c.CountryCode, c.StandardPhone, c.MobileNumber, c.Contact
        FROM `courrier` c
        JOIN `order` o
        ON o.CourrierID = c.Id
        WHERE o.id = ".$id.";";

            return $this->database->freeQuery($query, $this->createCourrier);
        }



    }

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}

?>