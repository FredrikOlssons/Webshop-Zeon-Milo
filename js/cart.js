import {openMenu, getAllCategories, burger} from './../helperFunctions/renderHelper.js'
import {makeRequest, getUser, showCorrectLayout, logOut, printNrOfElements} from './../helperFunctions/fetchHelper.js'


async function onLoad() {
    await accountCheck();
    await showCorrectLayout(); 
    await printNrOfElements(); 
    await renderCart() 
    await getUser();
    await getCourrier()
    await getAllCategories();
    burger();
}


document.getElementById("menu").addEventListener("click", openMenu);
document.querySelector(".logOut").addEventListener("click", logOut)


// if user is not logged in they will be forwarded to loginpage
async function accountCheck() {

    let allowed = await getUser();

    if(!allowed) {

        alert("Log in or register an account to proceed")

        location.href = "./../login.html";

        return
    }
}


// Gets cart from session
async function getCart() {

    
    const action = "getCart"

    let cart = await makeRequest(`./../api/receivers/cartReceiver.php?action=${action}`, "GET")

    if(cart) {
        cart = JSON.parse(cart)
    } else { 
        cart = []
    }

    return cart
}


// function to render out products that are placed in cart 
async function renderCart() {

    let cart = await getCart()
    let userInfo = await getUser()

    const main = document.getElementsByTagName("main")[0]

    main.innerHTML = "";

    let myTitle = document.createElement("h2")
    myTitle.classList.add("myTitle")
    myTitle.innerText = "My cart"
    let cartContainer = document.createElement("div")
    cartContainer.classList.add("cartContainer")

    main.append(cartContainer)
    cartContainer.append(myTitle)

    for (let i = 0; i < cart.length; i++) {
        
        const cartItem = cart[i];

        let itemContainer = document.createElement("div")
        itemContainer.classList.add("itemContainer")

        let image = document.createElement("img")
        image.classList.add("cartItemImage")
        image.src = "./../assets/" + cartItem.image


        let infoContainer = document.createElement("div")
        infoContainer.classList.add("infoContainer")

        let title = document.createElement("h2")
        title.classList.add("title")
        title.innerHTML = cartItem.name;

        let unitPrice = document.createElement("p")
        unitPrice.classList.add("unitPrice")
        unitPrice.innerHTML = cartItem.unitPrice + " €";
        
        let priceContainer = document.createElement("div")
        priceContainer.classList.add("priceContainer")

        let ajustQty = document.createElement("div")
        ajustQty.classList.add("ajustQty")

        
        let deleteQty = document.createElement("div")
        deleteQty.classList.add("ajustBoxes")
        deleteQty.innerText = "-"
        deleteQty.addEventListener("click", () => {deleteProduct(cartItem.Id)})
        
        let addQty = document.createElement("div")
        addQty.classList.add("addQty")
        addQty.classList.add("ajustBoxes")
        addQty.innerText = "+"
        addQty.addEventListener("click", () => {addProduct(cartItem.Id)})
        
        let removeButton = document.createElement("div")
        removeButton.classList.add("removeProduct")
        removeButton.innerHTML = '<img src="./assets/icons/delete.png" alt="Trash Icon">'
        removeButton.addEventListener("click", () => {removeItem(cartItem.Id)})

        let unitQty = document.createElement("p")
        unitQty.innerHTML = cartItem.quantity + " pcs"

        let totalPrice = document.createElement("p")
        totalPrice.classList.add("totalpriceItem")
        totalPrice.innerHTML = cartItem.quantity * cartItem.unitPrice + " €"

        cart.findIndex((shoppingCart) => { 

            if(shoppingCart.Id == cartItem.Id) {
                 
                if(shoppingCart.quantity >= cartItem.unitsInStock) {

                    addQty.classList.add("noClick")
                    
                    return
                }

                addQty.classList.remove("noClick")
               
            }

        })

        cartContainer.append(itemContainer)
        itemContainer.append(image, infoContainer)
        infoContainer.append(title, unitPrice, priceContainer, ajustQty, totalPrice)
        
        ajustQty.append(deleteQty, unitQty, addQty, removeButton)

    }



   /*  Order Summary    */ 
    let totalSum = cart.reduce((sum,item) => sum + item.unitPrice * item.quantity, 0);

    let summaryTitle = document.createElement("h2")
    summaryTitle.innerText = "Order summary"
    let summaryContainer = document.createElement("div")
    summaryContainer.classList.add("summaryContainer")
    
    /* Delivery address */
    let deliveryAddress = document.createElement("div")
    deliveryAddress.classList.add("addressContainer")
    let addressTitle = document.createElement("h4")
    let firstName = document.createElement("p")
    let lastName = document.createElement("p")
    let street = document.createElement("p")
    let CO = document.createElement("p")
    let zipCode = document.createElement("p")
    let city = document.createElement("p")
    let country = document.createElement("p")
    addressTitle.innerText = "Delivery address:"
    firstName.innerText = userInfo.FirstName
    lastName.innerText = userInfo.LastName
    street.innerText = userInfo.Street
    CO.innerText = userInfo.CO
    zipCode.innerText = userInfo.ZipCode
    city.innerText = userInfo.City
    country.innerText = userInfo.Country


    /* Courrier */
    let courrierContainer = document.createElement("div")
    let courrierTitle = document.createElement("h4")
    courrierTitle.innerText = "Choose courrier: (Free shipping)"
    
    let courriers = await getCourrier();

    let courrierForm = document.createElement("form")
    
    for (let i = 0; i < courriers.length; i++) {
        
        const courrierCompany = courriers[i];

        let radioButton = document.createElement("input")
        radioButton.classList.add("radioButton")
        radioButton.setAttribute("type", "radio")
        radioButton.setAttribute("value", courrierCompany.Id)
        radioButton.setAttribute("name", "selectCourrier")


        let courrierName = document.createElement("label")
        courrierName.innerText = courrierCompany.courrierName

        courrierForm.append(radioButton, courrierName)
    }


    /* Newsletter */
    let newsName = document.createElement("label")
    newsName.innerText = "Please let me know about early previews of original paintings"
    let newsButton = document.createElement("input")
    newsButton.classList.add("newsButton")
    newsButton.setAttribute("type", "checkbox")
    newsButton.setAttribute("value", userInfo.Id)

    /* Total amount and button */
    let checkOutContainer = document.createElement("div")
    checkOutContainer.classList.add("checkOutContainer")
    let totalAmount = document.createElement("p")
    totalAmount.classList.add("totalAmount")
    totalAmount.innerHTML = "Total amount: " +  totalSum + " €"
    let orderButton = document.createElement("button")
    orderButton.classList.add("orderButton")
    orderButton.innerText = "Check Out"
    orderButton.addEventListener("click", () => {
        
        if(cart == 0) {
            alert("Your cart is empty")
            return
        }

        if(!document.querySelector('input[name="selectCourrier"]:checked')) {
            alert("Please choose a courrier")
            return
        }


        if(document.querySelector('.newsButton:checked')) {
            addSubscriber();
        }

        let checkCourrier = document.querySelector('input[name="selectCourrier"]:checked').value

        createOrder(checkCourrier, userInfo.Id);
  
    })

    main.append(summaryContainer)
    summaryContainer.append(summaryTitle, deliveryAddress, courrierContainer, checkOutContainer)
    courrierContainer.append(courrierTitle, courrierForm, newsButton, newsName)
    deliveryAddress.append(addressTitle, firstName, lastName, street, CO, zipCode, city, country)
    checkOutContainer.append(totalAmount, orderButton)

}



async function addSubscriber() {

    let addSub = "addSubscriptionNews"

    let body = new FormData();
    body.append("action", addSub);

    let subscribeUser = await makeRequest(`./../api/receivers/subscriptionNewsReceiver.php`, "POST", body)

    if(!subscribeUser) {

        alert("You are already a subscriber")

     } else { 

         alert("You are now signed to our newsletter")

     }

}


async function createOrder(courrierId, userId) {

    let createOrder = {
        StatusId: "REG",
        UserId: userId,
        CourrierId: courrierId
    }


    let myData = new FormData();
    myData.append("endpoint", "createOrder");
    myData.append("createOrder", JSON.stringify(createOrder));

    let resultOrder = await makeRequest("./../api/receivers/orderReceiver.php", "POST", myData)
    
    if(resultOrder == true) {
        alert("Congratulations! Your order is placed")
        location.href = "./../myProfile.html";
        return
    }

    alert("Something went wrong. Your order is not placed. Contact administrator");

}


async function getCourrier() {

    const action = "getAll"

    let courrier = await makeRequest(`./../api/receivers/courrierReceiver.php?action=${action}`, "GET")

    return courrier
}


async function addProduct(productId) {
    const action = "addProduct"
    var body = new FormData()
    body.append("action", action)
    body.append("productId", productId)
 
    await makeRequest(`./../api/receivers/cartReceiver.php`, "POST", body)

    await renderCart();
    await printNrOfElements();
}    

async function deleteProduct(productId) {
    const action = "deleteProduct"
    var body = new FormData()
    body.append("action", action)
    body.append("productId", productId)
 
    await makeRequest(`./../api/receivers/cartReceiver.php`, "POST", body)

    await renderCart();
    await printNrOfElements();
}    

async function removeItem(productId) {

    const action = "deleteItem"
    var body = new FormData()
    body.append("action", action)
    body.append("productId", productId)
 
    await makeRequest(`./../api/receivers/cartReceiver.php`, "POST", body)

    await renderCart();
    await printNrOfElements();
}


window.addEventListener('load', onLoad)
