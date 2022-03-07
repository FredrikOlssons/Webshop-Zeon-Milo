<?php

include_once("./../classes/product.php");
include_once("./../classes/category.php");

include_once("./../classes/user.php");
include_once("./../classes/order.php");
include_once("./../classes/courrier.php");
include_once("./../classes/subscriptionNews.php");
include_once("./../classes/orderDetails.php");
include_once("./../classes/newsletter.php");
include_once("./../classes/orderStatus.php"); 
include_once("./../classes/productInCategory.php"); 




/* FETCH_FUNC tar alla kolumner från den här funktionen och ger till varje specifik instans vi får från databasen. Här är det viktigt att de speglar kolumnerna som vi faktiskt får ut från databasen  */
function createProduct($Id, $name, $description, $unitPrice, $unitsInStock, $image) { /* ändrade id till productId */
    return new Product((int)$Id, $name, $description, $unitPrice, $unitsInStock, $image); /* ändrade id till productId */
} 

function createCategory($Id, $categoryName, $categoryDescription) {
    return new Category((int)$Id, $categoryName, $categoryDescription);
} 

function createUser($Id, $Email, $Password, $FirstName, $LastName, $Street, $CO, $ZipCode, $City, $Country, $CountryCode, $StandardPhone, $MobileNumber, $Admin, $TermsOfPurchase) {
    return new User((int)$Id, $Email, $Password, $FirstName, $LastName, $Street, $CO, (int)$ZipCode, $City, $Country, (int)$CountryCode, (int)$StandardPhone, (int)$MobileNumber, (int)$Admin, (int)$TermsOfPurchase);
}

function createOrder($Id, $StatusId, $UserId, $CourrierId, $RegisterDate, $ShippingDate, $CustRecDate) {
    return new Order((int)$Id, $StatusId, (int)$UserId, (int)$CourrierId, $RegisterDate, $ShippingDate, $CustRecDate);
} 

function createSubscriptionNews($Id, $UserID, $FirstName, $Email) {
    return new SubscriptionNews((int)$Id, $UserID, $FirstName, $Email);
}

function subscribe($id, $UserID, $FirstName, $Email) {
    return new SubscriptionNews((int)$Id, $UserID, $FirstName, $Email);
}


function createOrderDetails($orderId, $productId, $quantity) { 
return new OrderDetails((int)$orderId, (int)$productId, (int)$quantity); 
}


function createCourrier($Id, $courrierName, $Address, $Email, $CountryCode, $StandardPhone, $MobileNumber, $Contact) {
    return new Courrier((int)$Id, $courrierName, $Address, $Email, $CountryCode, $StandardPhone, $MobileNumber, $Contact);
} 

function createOrderStatus($Id, $Status, $Description) {
    return new OrderStatus($Id, $Status, $Description); 
}


function createNewsletter($Id, $Title, $Text, $Date){
    return new Newsletter((int)$Id, $Title, $Text, $Date);
}

function createProductInCategory($productId, $categoryId, $lastUpdated) {
    return new ProductInCategory((int)$productId, (int)$categoryId, $lastUpdated);
}



?>


