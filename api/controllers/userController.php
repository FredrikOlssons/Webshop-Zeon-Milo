<?php 

try {

    session_start();

    include_once("./../handlers/createInstanceFunctions.php");
    include_once("./../controllers/mainController.php");
    include_once("./../classes/user.php");

    class UserController extends MainController {

        private $createUser = "createUser";

        function __construct() {
            parent::__construct("User", "User");
        }


        public function add($user) {
            try {
                $hashedPassword = password_hash($user->Password, PASSWORD_DEFAULT);
                $addUser = createUser(null, $user->Email, $hashedPassword, $user->FirstName, $user->LastName, $user->Street, $user->CO, $user->ZipCode, $user->City, $user->Country, $user->CountryCode, $user->StandardPhone, $user->MobileNumber, $user->Admin, $user->TermsOfPurchase);        
                
                return $this->database->insert($addUser);
    
            }   
            catch(Exception $e) {
                throw new Exception("This dosent work");
            }
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
            return $this->database->delete($id);
        }





        
    /* Special Queries */


        
        // Kollar om mejlen redan är registrerad i databasen
        public function checkEmail($user) {

            $query = "SELECT *
            FROM user
            WHERE Email = "."'".$user."'";

            $checkEmail = $this->database->freeQuery($query, $this->createUser); 

            if($checkEmail == "{}") {
                return true;
            }
            return false;
            
        }

        
    // Kollar om username och password matchar databasen
        public function loginUser($user, $password) { 
            
            $listOfUsers = $this->database->fetchAll($this->createUser);

            for ($i=0; $i < count($listOfUsers); $i++) { 
                
                $userDb = $listOfUsers[$i];
                $checkEmail = $userDb->Email;
        
                if($checkEmail == $user) {

                    $hashedPw = $userDb->Password;
                
                    if (password_verify($password, $hashedPw)) {
                        $_SESSION["inloggedUser"] = serialize($userDb);
                        return true;

                    } else {
                        return false;       
                    }
                }   
            }
        }



        // Kollar om den inloggade användaren är admin eller inte
        public function verifyAdmin() {

            if(isset($_SESSION["inloggedUser"])) {
                
                $loggedInUser = unserialize($_SESSION["inloggedUser"]);
                $checkAdmin = $loggedInUser->Admin;

                if($checkAdmin == 1) {
                    return true;

                } else {
                    return false;
                }
            }
        }



        /* Hämtar kunden som är kopplad till en specifik order */
        public function getUserFromOrder($orderId) { 
            $query = "SELECT u.id, u.Email, u.Password, u.FirstName, u.LastName, u.Street, u.CO, u.ZipCode, u.City, u.Country, u.CountryCode, u.StandardPhone, u.MobileNumber, u.Admin, u.TermsOfPurchase FROM user u
            JOIN `order` o
                ON o.userid = u.Id
                WHERE o.id = ".$orderId.";";

            return $this->database->freeQuery($query, $this->createUser); 
        }





    }

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?>

    

