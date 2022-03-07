<?php 

try {

    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");
    include_once("./../controllers/productController.php");


    class CategoryController extends MainController {

        public $createCategory = "createCategory";

        function __construct() {
            parent::__construct("Category", "Category");
        }


        public function add($entity) {

        }

        function getAll() {
            return $this->database->fetchAll($this->createCategory);
        }

        public function getById($id) {
            $category = $this->database->fetchById($id, $this->createCategory);    
            $productController = new ProductController();
            $products = $productController->getProductsFromCategory($id); 

            $category->products = $products;  

            return $category;
        }


        public function update($newValue, $entity) {

        }

        public function delete($id) {
            return $this->database->delete($id);
        }


        /* Special Queries */

        public function getCategoryWithProductId($id) {

            $userController = new UserController();
            $checkAdmin = ($userController->verifyAdmin());

            if(!$checkAdmin) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            $query = "SELECT c.Id, c.CategoryName, c.Description 
            FROM category c 
            JOIN `productincategory` pc
                ON pc.categoryid = c.Id
            WHERE pc.productid = ".$id.";";

            $categories = $this->database->freeQuery($query, $this->createCategory); 

            if(empty($categories)) {
                return false;
            }

            return $categories;
        }


    }

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?>