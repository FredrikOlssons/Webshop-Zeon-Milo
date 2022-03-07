<?php 

class OrderDetails {
    public $orderId;
    public $productId;
    public $quantity;

    function __construct($orderId, $productId, $quantity) {
        $this->orderId = $orderId;
        $this->productId = $productId;
        $this->quantity = $quantity;
    }
}

?>