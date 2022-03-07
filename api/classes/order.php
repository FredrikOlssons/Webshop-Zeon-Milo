<?php 
/* Skall spegla det som är i databasen. */  /* Ändrade id till productId. Fixa det även i databasen. */
class Order {
    public $Id;
    public $StatusId;
    public $UserId;
    public $CourrierId;
    public $RegisterDate;
    public $ShippingDate;
    public $CustRecDate;
    
 
    public $products;  
    public $user;
    public $courrier;  
    public $orderStatus;  


    function __construct($Id, $StatusId, $UserId, $CourrierId, $RegisterDate, $ShippingDate, $CustRecDate) {
        $this->Id = $Id;
        $this->StatusId = $StatusId;
        $this->UserId = $UserId;
        $this->CourrierId = $CourrierId;
        $this->RegisterDate = $RegisterDate;
        $this->ShippingDate = $ShippingDate;
        $this->CustRecDate = $CustRecDate;
    }
}

?>