<?php 

try {

    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");
    include_once("./../controllers/userController.php");
    include_once("./../controllers/categoryController.php");


    class ProductInCategoryController extends MainController {

        public $createProductInCategory = "createProductInCategory";

        function __construct() {
            parent::__construct("ProductInCategory", "ProductInCategory");
        }


        public function add($entity) {

        }


        function getAll() {
            return $this->database->fetchAll($this->createProductInCategory);
        }


        public function getById($id) {
            return $this->database->fetchById($id, $this->createProductInCategory);
        }


        public function update($newValue, $entity) {

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


        public function replaceCategory($productId, $newCategoryId, $oldCategoryId) {
            
            $userController = new UserController();
            $checkAdmin = ($userController->verifyAdmin());

            if(!$checkAdmin) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            $addCategory = $this->addProductToCategory($productId, $newCategoryId);

            if(!$addCategory) {
                throw new Exception("could not add category", 401);
                exit;
                };

            $deleteCategory = $this->deleteProductFromCategory($productId, $oldCategoryId);

            if(!$deleteCategory) {
                throw new Exception("could not delete category", 401);
                exit;
            }

            return true;

        }




        public function addProductToCategory($productId, $categoryId) {

            $userController = new UserController();
            $checkAdmin = ($userController->verifyAdmin());

            if(!$checkAdmin) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            $categoryController = new CategoryController();
            $getCategoriesOnProduct = ($categoryController->getCategoryWithProductId($productId));

            for ($i=0; $i < count($getCategoriesOnProduct) ; $i++) { 

                $category = $getCategoriesOnProduct[$i];

                if($category->Id == $categoryId) {
                    throw new Exception("Category already exists on product", 401);
                    exit;
                }

            }

            $addProductToCategory = createProductInCategory($productId, $categoryId, date('Y-m-d H:i:s')); 

                return $this->database->insert($addProductToCategory); 
        }




        public function deleteProductFromCategory($productId, $categoryId) {

            $userController = new UserController();
            $checkAdmin = ($userController->verifyAdmin());

            if(!$checkAdmin) {
                throw new Exception("Action not allowed", 401);
                exit;
            }

            $categoryController = new CategoryController();
            $getCategoriesOnProduct = ($categoryController->getCategoryWithProductId($productId));

            if(count($getCategoriesOnProduct) == 1) {
                throw new Exception("Can't delete category. Try with 'Replace-function instead'", 401);
                exit;
            }

            $query = "DELETE FROM productInCategory WHERE productId= " . $productId . " AND categoryId=".$categoryId.";";

            return $this->database->freeQuery($query, $this->createProductInCategory);

        }




    }

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?>