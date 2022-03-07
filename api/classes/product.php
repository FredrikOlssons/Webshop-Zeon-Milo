<?php 

class Product {
    public $Id;
    public $name;
    public $description;
    public $unitPrice;
    public $unitsInStock;
    public $image;

    public $quantity;

    function __construct($Id, $name, $description, $unitPrice, $unitsInStock, $image) {
        $this->Id = $Id;
        $this->name = $name;
        $this->description = $description;
        $this->unitPrice = $unitPrice;
        $this->unitsInStock = $unitsInStock;
        $this->image = $image;
    }
}

?>