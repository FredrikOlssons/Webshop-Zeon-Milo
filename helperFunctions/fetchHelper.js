
// Makes a request to php
export async function makeRequest(url, method, body) {
    try {
        let response = await fetch(url, {
            method,
            body
        })
        let result = await response.json();

        return result
    } catch(err) {
        console.error(err)
    }
}



/* User */


// Returns true if logged in user is registered as admin
export async function verifyAdmin() {
    const action = 'verifyAdmin'; 
    let verifyA = await makeRequest(`./../api/receivers/userReceiver.php?action=${action}`, "GET")

    return verifyA    
}



// Shows correct layout depending on whether user is a regular customer or if user is an admin. If no user is logged in, original layout is kept. 
export async function showCorrectLayout() {
    const loggedInUser = document.querySelector(".loggedInUser")
    
    // Check to see if there is a user in session
    let checkIfInlogged = await getUser();
    
    if(!checkIfInlogged) {
        
        document.querySelector(".adminIcons").classList.add("none");
        document.querySelector(".qty").classList.remove("qtyCustomer")
        document.querySelector(".qty").classList.remove("qtyAdmin")

        loggedInUser.classList.add("none")
        return
    }


    // Display which user is logged in
    loggedInUser.classList.remove("none")
    let activeUser = document.createElement("p")
    activeUser.innerText = "Logged in user: " + checkIfInlogged.FirstName
    loggedInUser.append(activeUser)



    
    // check to determin in logged in user is of type admin
    let checkAdmin = await verifyAdmin();
     if(checkAdmin) {

        document.querySelector(".adminIcons").classList.remove("none");
        document.querySelector(".myOrders").classList.add("none");
        document.querySelector(".loginIcon").classList.add("none")
        document.querySelector(".qty").classList.add("qtyAdmin")

        if(document.getElementById("firstNameNews")) {
            document.getElementById("firstNameNews").style.display = "none";
            document.getElementById("emailNews").style.display = "none";
        }



    } else {

        document.querySelector(".adminIcons").classList.remove("none");
        document.querySelector(".adminSetting").classList.add("none");
        document.querySelector(".loginIcon").classList.add("none")
        document.querySelector(".qty").classList.add("qtyCustomer")
        
        if(document.getElementById("firstNameNews")) {
            document.getElementById("firstNameNews").style.display = "none";
            document.getElementById("emailNews").style.display = "none";
        }
    } 
}


// Get id, firstname and lastname from SESSION. If there is no user in session, getUser returns false. 
export async function getUser() {
    const action = 'getUser'; 
    let getUser = await makeRequest(`./../api/receivers/userReceiver.php?action=${action}`, "GET")
    return getUser
}


// Logs out user by session_destroy()
export async function logOut(){
    const action = "destroySession"
    let logoutUser = await makeRequest(`./../api/receivers/userReceiver.php?action=${action}`, "GET")
    alert("You are out!")    
}




/* Order */

// Fetches all orders
export async function getAllOrders() {
    const action = "getAll";
    let allOrders = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}`, "GET")
    return allOrders
}


// Fetch an order by orderId
export async function getOrderById(idToGet) {
    const action = "getById";
    let specificOrder = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}&id=${idToGet}`, "GET")
    return specificOrder
}

// Fetch an order based on statusId and userId
export async function getOrdersByOtherId(idToGet, type) {
    const action = "getByOtherId";
    let specificOther = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}&id=${idToGet}&type=${type}`, "GET")
    return specificOther
}




/* Product */

// Fetches all products 
export async function getAllProducts() {
    const action = "getAll";

    let allProducts = await makeRequest(`./api/receivers/productReceiver.php?action=${action}`, "GET")

    return allProducts
    
}



// Fetch a product based on productId
export async function getProductFromId(id) {

const action = 'getById';  

let specificProduct = await makeRequest(`./../api/receivers/productReceiver.php?action=${action}&id=${id}`, "GET")

return specificProduct

}
     


/* Cart */


// Prints out the total number of products that are placed in cart. 
export async function printNrOfElements() {

    let numberCart = document.querySelector(".qty")

    const action = "getCart"

    let cart = await makeRequest(`./../api/receivers/cartReceiver.php?action=${action}`, "GET")

    if(cart) {
        cart = await JSON.parse(cart) 
    } else { 
        cart = []
    } 

    let totalSum = cart.reduce((sum,item) => sum + item.quantity, 0)
    
    numberCart.innerText = totalSum

}



// Add subscription News 

export async function addSubscriptionNews(e) {
    e.preventDefault();
    const action = "addSubscriptionNews";
    
    let getLoggedInUser = await getUser(); 
    
    if(getLoggedInUser){
        var userBody = new FormData()
        userBody.append("action", action)
        
        let status = await makeRequest(`./../api/receivers/subscriptionNewsReceiver.php`, "POST", userBody)
        
        if(!status) {
            alert("You are already a subscriber")
        } else {
            
            alert("Welcome our new subscriber")
            location.reload();
            
        }
        
        
    } else {
        
        let registerFirstname = document.getElementById("firstNameNews").value
        let registerEmail = document.getElementById("emailNews").value
        
        if(!registerFirstname) {
             alert("Please fill in your name!")
             return
         }
         if(!registerEmail) {
             alert("Please fill in your email!")
             return
         }
        

        const subscriber = {
            FirstName: registerFirstname,
            Email: registerEmail,
        }
        

        var body = new FormData()
        body.append("action", action)
        body.append("subscriber", JSON.stringify(subscriber))

        let checkSubscription = await makeRequest(`./../api/receivers/subscriptionNewsReceiver.php`, "POST", body)
        
        
        if(!checkSubscription) {

            alert("Please check your input or try another email!")
    
         } else { 

             alert("Welcome our new subscriber")
             location.reload();

         }
    
    }

 

}


