<?php

class orderStatus {
    public $Id;
    public $Status;
    public $Description; 

    function __construct($Id, $Status, $Description) {
        $this->Id = $Id;
        $this->Status = $Status;
        $this->Description = $Description; 
    }
}