
<?php 

try {



    session_start(); 

    include_once("../handlers/createInstanceFunctions.php"); 
    include_once("../controllers/mainController.php"); 

    class SubscriptionNewsController extends MainController {

        private $createSubscriptionNews = "createSubscriptionNews"; 
        

        function __construct() {
            parent::__construct("SubscriptionNews", "SubscriptionNews"); 
        }


        public function add($subscriber) { 
        
        try{
                if(isset($_SESSION['inloggedUser'])){
                    $user = unserialize($_SESSION["inloggedUser"]);

                    $subscriptionNewsToAdd = createSubscriptionNews(null, $user->Id , null, null); 
                    return $this->database->insert($subscriptionNewsToAdd);
            
                }else if($subscriber){ 
                    if(!$subscriber->FirstName) {
                        return false; 
                    }
                    if(!$subscriber->Email) {
                        return false; 
                    }
                    
                    $subscriptionNewsToAdd = createSubscriptionNews(null, null, $subscriber->FirstName, $subscriber->Email);
                    return $this->database->insert($subscriptionNewsToAdd);
                

                } 
            
            
            } catch(Exception $e) {
                throw new Exception("The information is not in correct format...", 500);
            }
        }




        public function getAll() { 
            return $this->database->fetchAll($this->$createSubscriptionNews); 


        }

        public function getById($id) {
            return $this->database->fetchById($id, $this->createFunction); 
        }

    

        public function update($newValue, $entity) {

        }



        public function delete($id) {
            return $this->database->delete($id);
        }





    /* Special Queries */


        public function getAllLoggedInSubscribers() {
            $query = 
            "SELECT u.id, sn.userid, u.FirstName, u.Email 
            FROM `subscriptionnews` sn 
            JOIN `user` u ON u.Id = sn.UserID;";

            $query2 =
            "SELECT *
            FROM `subscriptionnews`
            WHERE subscriptionnews.UserID IS NULL;"; 
    
            $subscriberLoggedIn = $this->database->freeQuery($query, $this->createSubscriptionNews);
            $subscriberGuest = $this->database->freeQuery($query2, $this->createSubscriptionNews);

            $subscriberList = []; 
    
            

            if($subscriberLoggedIn != 'null'){

                for ($i=0; $i < count($subscriberLoggedIn); $i++) { 
                    
                    $sub = $subscriberLoggedIn[$i]; 
                    array_push($subscriberList, $sub); 

                }

            }


            for ($i=0; $i < count($subscriberGuest); $i++) { 
                
                $sub1 = $subscriberGuest[$i]; 

                array_push($subscriberList, $sub1);
            } 

            return $subscriberList;
            }
            
        
    }


} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?> 