<?php 

class Courrier {
    public $Id;
    public $courrierName;
    public $Address;
    public $Email;
    public $CountryCode;
    public $StandardPhone;
    public $MobileNumber;
    public $Contact;

    function __construct($Id, $courrierName, $Address, $Email, $CountryCode, $StandardPhone, $MobileNumber, $Contact) {
        $this->Id = $Id;
        $this->courrierName = $courrierName;
        $this->Address = $Address;
        $this->Email = $Email;
        $this->CountryCode = $CountryCode;
        $this->StandardPhone = $StandardPhone;
        $this->MobileNumber = $MobileNumber;
        $this->Contact = $Contact;

    }
}

?>