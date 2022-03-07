<?php 

try {

    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");



    class NewsletterController extends MainController{

        private $createNewsletter = "createNewsletter"; 

        function __construct() {
            parent::__construct('Newsletter', 'Newsletter'); 

        }


        public function add($news){
            try {

                if(!$news->Title) {
                    return false; 
                }
                if(!$news->Text) {
                    return false; 
                }

                $createNewsletter = createNewsletter(null, $news->Title, $news->Text, date('Y-m-d H:i:s'));   
                
                return $this->database->insert($createNewsletter);
    
            }   
            catch(Exception $e) {
                throw new Exception("Not possible");
            }
        }


        public function getAll(){
            return $this->database->fetchAll($this->createNewsletter);
        }

        public function getById($id){
            $newsletter = $this->database->fetchById($id, $this->createNewsLetter); 
        }

        public function update($newValue, $entity) {

        }
        
        public function delete($id) {
            return $this->database->delete($id);
        }
        
        
    }  

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?> 