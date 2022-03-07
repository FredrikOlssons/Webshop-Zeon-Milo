<?php

class User {
    public $Id;
    public $Email;
    public $Password;
    public $FirstName;
    public $LastName;
    public $Street;
    public $CO;
    public $ZipCode;
    public $City;
    public $Country;
    public $CountryCode;
    public $StandardPhone;
    public $MobileNumber;
    public $Admin;
    public $TermsOfPurchase;

    function __construct($Id, $Email, $Password, $FirstName, $LastName, $Street, $CO, $ZipCode, $City, $Country, $CountryCode, $StandardPhone, $MobileNumber, $Admin, $TermsOfPurchase ) {
        $this->Id = $Id;
        $this->Email = $Email;
        $this->Password = $Password;
        $this->FirstName = $FirstName;
        $this->LastName = $LastName;
        $this->Street = $Street;
        $this->CO = $CO;
        $this->ZipCode = $ZipCode;
        $this->City = $City;
        $this->Country = $Country;
        $this->CountryCode = $CountryCode;
        $this->StandardPhone = $StandardPhone;
        $this->MobileNumber = $MobileNumber;
        $this->Admin = $Admin;
        $this->TermsOfPurchase = $TermsOfPurchase;
    }
}



?>