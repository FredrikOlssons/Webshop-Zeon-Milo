<?php


try {
    include_once("./../controllers/newsLetterController.php");


    if($_SERVER["REQUEST_METHOD"] == "POST") {
    
        if($_POST["action"] == "add"){
            if(isset($_POST['news'])){
       
                $controller = new NewsletterController(); 

                echo(json_encode($controller->add(json_decode($_POST['news']))));


                exit; 
            }
        
            }else{

                echo json_encode('The information is not correct');
                
                };
    }    

} catch(Exception $err) {
    echo json_encode(array('Message' => $err->getMessage(), "Status" => $err->getCode()));
}


?>