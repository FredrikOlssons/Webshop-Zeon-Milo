<?php 

try {

    include_once("./../classes/database.php");

    abstract class MainController {

        public $database;

        function __construct($table, $class) {
            $this->database = new Database($table, $class);
        }

        abstract function getAll();
        abstract function getById($id);
        abstract function add($entity);
        abstract function update($newValue, $entity);
        abstract function delete($id);
        
    }

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}

?>