<?php 

class SubscriptionNews {
    public $Id;
    public $UserID;
    public $FirstName;
    public $Email;


    function __construct($Id, $UserID, $FirstName, $Email) {
        $this->Id = $Id;
        $this->UserID = $UserID;
        $this->FirstName = $FirstName;
        $this->Email = $Email;
    }
}

?>