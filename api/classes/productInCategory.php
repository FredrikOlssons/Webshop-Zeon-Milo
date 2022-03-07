<?php 

class ProductInCategory {
    public $productId;
    public $categoryId;
    public $lastUpdated;

    function __construct($productId, $categoryId, $lastUpdated) {
        $this->productId = $productId;
        $this->categoryId = $categoryId;
        $this->lastUpdated = $lastUpdated;
    }
}

?>