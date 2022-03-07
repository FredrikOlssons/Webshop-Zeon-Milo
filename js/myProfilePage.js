
import {openMenu, getAllCategories, burger} from './../helperFunctions/renderHelper.js'
import {makeRequest,  getUser, verifyAdmin, showCorrectLayout, logOut, printNrOfElements, getAllProducts} from './../helperFunctions/fetchHelper.js'



async function onLoad() {
    await accountCheck();
    await showCorrectLayout();
    await printNrOfElements();
    await whichPageToDisplay();
    await getAllCategories();
    await renderSubscribers();
    burger();
}

async function accountCheck() {

    let allowed = await getUser();
    if(!allowed) {
        location.href = "./../login.html";
        return
    }
}

async function getAllLoggedInSubscribers(){
    let admin = await verifyAdmin(); 

    if(!admin) {
       return
    }  
    const action = "getAllLoggedInSubscribers";

    let allSubscribers = await makeRequest(`./../api/receivers/subscriptionNewsReceiver.php?action=${action}`, "GET")
    return allSubscribers;

} 

document.getElementById("menu").addEventListener("click", openMenu);
document.querySelector(".logOut").addEventListener("click", logOut);



async function whichPageToDisplay() {
    
    const main = document.getElementsByTagName("main")[0];
    
    let checkAdmin = await verifyAdmin();

    if(checkAdmin) {
        
        document.querySelector(".adminLayout").classList.remove("none")
        overviewUnitsInStock()
        overviewCategory() 
        filterButton()
        let user = await getUser();
        let userId = user.Id; 
        myOrders(userId, 'User');

   } else {
        document.querySelector(".adminLayout").classList.add("none")
        document.querySelector('.customerLayout').classList.remove('none')
        let user = await getUser();
        let userId = user.Id; 
        myOrders(userId, 'User');

   } 

}









/* OVERVIEW ORDERS */

async function filterButton() { 

    let admin = await verifyAdmin(); 

    if(!admin) {
       return
    }  


    let filter = document.querySelector('.filter')
    const action = "getAll";
    let orderStatus = await makeRequest(`./../api/receivers/orderStatusReceiver.php?action=${action}`, "GET");
    let buttonForAll = document.createElement('button')
    buttonForAll.classList.add('filterBtn')
    buttonForAll.innerText = "All"
    buttonForAll.addEventListener('click', async () => {
        const action = "getAll";
        let order = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}`, "GET");
        let admin = await verifyAdmin(); 
        if(!admin) {
            return
        }  

        renderOrders(order, admin);
        
    })

    filter.append(buttonForAll)

    for (let i = 0; i < orderStatus.length; i++) {
        const element = orderStatus[i];

        let filterBtn = document.createElement('button')
        filterBtn.classList.add('filterBtn')
        filterBtn.innerText = element.Status
        
        filterBtn.addEventListener('click', () => {
       
            filterOrders(element.Id, "Status")
        })
        
        filter.append(filterBtn)
    }
}

async function filterOrders(id, type) {
    const action = "getByOtherId";
    let specificOther = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}&id=${id}&type=${type}`, "GET")
    
    renderOrders(specificOther)
}


let orderContainer = document.createElement("div")
let headerRow = document.createElement("div");

async function renderOrders(list) {

    let admin = await verifyAdmin(); 

    if(!admin) {
       return
    }  

  
    let bigContainer = document.getElementsByClassName("overviewOrders")[0];

    let headers = [
        "Id",
        "StatusId",
        "Reg-Date",
        "Ship-Date",
        "Rec-Date",
        ""
    ];
    
    orderContainer.classList.add("orderContainer")
    bigContainer.append(orderContainer)
    orderContainer.innerHTML = "";
    headerRow.innerHTML = ""

    
    headerRow.classList.add('containerForOrders')
    orderContainer.appendChild(headerRow);
    
    
    headers.forEach((headerText, index, headers) => {
        let orderHeader = document.createElement("div");
        orderHeader.classList.add('orderHeader')
        orderHeader.classList.add('o'+index)
        orderHeader.innerText = headerText;
        headerRow.appendChild(orderHeader);
    });
    
    
    for (let i = 0; i < list.length; i++) {
        const order = list[i];
        let row = document.createElement('div')
        row.classList.add('row')
        const orderValues = Object.values(order);
        
        let orderButton = document.createElement('button')
       
        orderButton.addEventListener("click", () => {
            getOrderDetails(order.Id)
            
        })


   
        orderButton.classList.add('orderButton')
        orderButton.innerText = "To Order"
        orderValues.splice(7, 4) 
        orderValues.splice(2, 2) 



   
        
        for (let i = 0; i < orderValues.length; i++) {
            const orderDetail = orderValues[i]
            let cell = document.createElement('div')
            cell.classList.add('cell')
            cell.classList.add('c'+i)
          
            cell.innerText = orderDetail

            row.append(cell, orderButton)
           
        }
        orderContainer.appendChild(row)
    }
}



async function getOrderDetails(id) {

    let checkAdmin = await verifyAdmin();
    if(!checkAdmin) {
        return
    }
    
    const action = "getById"; 
    
    let orderDetailsList = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}&id=${id}`, "GET"); 
    
    let showOrderDetail = document.querySelector(".orderDetail")
    showOrderDetail.classList.toggle("none")

    let orderHeader = document.createElement("h2")
    orderHeader.innerHTML = "Order Details"
    showOrderDetail.innerHTML = ""
    
    showOrderDetail.append(orderHeader)
    
    let leftBox = document.createElement("div")
    leftBox.classList.add("leftBox")

    let rightBox = document.createElement("div")
    rightBox.classList.add("rightBox")
    showOrderDetail.append(leftBox)

    let orderId = orderDetailsList.Id

    orderDetailsList.orderStatus.forEach(orderStatus => {

        let orderDetails = document.createElement("div")
        orderDetails.classList.add("orderDetails")
        orderDetails.innerHTML = "<h3>Order status</h3>" + "Order with id: " + orderDetailsList.Id + " - " + orderStatus.Status + "  "

        let sendOrderButton = document.createElement("button")
        sendOrderButton.classList.add("sendOrderButton")
        sendOrderButton.innerText = " Send the order!"
        sendOrderButton.addEventListener("click", () => {
            sendOrder(orderId)

        })

        leftBox.append(orderDetails)
        orderDetails.append(sendOrderButton)

      if(orderStatus.Status == "Shipped" || orderStatus.Status == "CustReceived") {
            sendOrderButton.classList.add("none")
            return

        } else {
            sendOrderButton.classList.remove("none")

        }
    
    });

    orderDetailsList.courrier.forEach(courrierList => {
        let courrierBox = document.createElement("div")
        courrierBox.classList.add("courrierBox")
        courrierBox.innerHTML = "<h3>Courrier</h3>" + courrierList.courrierName
   
        leftBox.append(courrierBox)

    })

    orderDetailsList.products.forEach(productList => {
        let productBox = document.createElement("div")
        productBox.classList.add("productBox")
        productBox.innerHTML = "<h3>Product details</h3>" + "Product with id: " + productList.Id + "<br>" + "<p>Name: " + productList.name + "</p>" +  " UnitPrice: " + productList.unitPrice + " € " + "<br>" + " Quantity: " + productList.quantity + "<br>" + "<br>"+ "<hr>"
    
        leftBox.append(productBox)
    })

    let userBox = document.createElement("h2")
    userBox.innerText = "Information about customer"


    orderDetailsList.user.forEach(userList => {
    
        rightBox.innerHTML = "User id: " + userList.Id + "<br>" + " FirstName: " + userList.FirstName + "<br>" + " LastName: " + userList.LastName + "<br>" + " Email " + userList.Email + "<br>" + " Mobile: " + userList.MobileNumber + "<br>" + " Adress: " + userList.Street + "<br>" + " ZipCode: " + userList.ZipCode + "<br>" + " City: " + userList.City + "<br>" + " Country: " + userList.Country
    
        leftBox.append(rightBox)
        
    })

    showOrderDetail.append(userBox, rightBox)
    
}

async function sendOrder(orderId) {

    let checkAdmin = await verifyAdmin();
    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

   let body = new FormData(); 
    body.append("statusId", "SHIP")
    body.append("orderId", orderId)
    body.append("endpoint", "updateOrder"); 
    let sentOrder = await makeRequest(`./../api/receivers/orderReceiver.php`, "POST", body)

    if(sentOrder == true) { 
        alert("The order is sent!")
        
        location.reload();

    } else {
        alert("The sending has failed!")

    }

}




/* MY ORDERS */


async function myOrders(id, type) {
    const action = "getByOtherId";
    let specificOther = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}&id=${id}&type=${type}`, "GET")
    let user = await getUser();
    if(!user) {
        return
    }
    renderMyOrders(specificOther)
}


async function renderMyOrders(list) {

    let user = await getUser();
    if(!user) {
        return
    }

    let orderContainerC = document.createElement("div")
    let headerRowC = document.createElement("div");
    let bigContainerCust = document.getElementsByClassName("overviewCustomerOrders")[0];

    let headers = [
        "Id",
        "StatusId",
        "Reg-Date",
        "Ship-Date",
        "Rec-Date",
        ""
    ];
    
    orderContainerC.classList.add("orderContainer")
    bigContainerCust.append(orderContainerC)
    orderContainerC.innerHTML = "";
    headerRowC.innerHTML = ""

    
    headerRowC.classList.add('containerForOrders')
    orderContainerC.appendChild(headerRowC);
    
    
    headers.forEach((headerText, index, headers) => {
        let orderHeaderC = document.createElement("div");
        orderHeaderC.classList.add('orderHeader')
        orderHeaderC.classList.add('o'+index)
        orderHeaderC.innerText = headerText;
        headerRowC.appendChild(orderHeaderC);
    });
    
    
    for (let i = 0; i < list.length; i++) {
        const orderC = list[i];
        let rowC = document.createElement('div')
        rowC.classList.add('row')
        const orderValuesC = Object.values(orderC);
        
        let orderButtonC = document.createElement('button')

        orderButtonC.addEventListener("click", () => {
            getCustomerOrderDetail(orderC.Id)
        
        })

        orderButtonC.classList.add('orderButton')
        orderButtonC.innerText = "To Order"
        orderValuesC.splice(7, 4) 
        orderValuesC.splice(2, 2) 

        
        
        for (let i = 0; i < orderValuesC.length; i++) {
            const orderDetailC = orderValuesC[i]
            let cellC = document.createElement('div')
            cellC.classList.add('cell')
            cellC.classList.add('c'+i)
            
            cellC.innerText = orderDetailC
            
            rowC.append(cellC, orderButtonC)
           
        }
       
            bigContainerCust.appendChild(rowC)
    } 

}

async function getCustomerOrderDetail(id){
    let user = await getUser();
    if(!user) {
        return
    }

    const action = "getById"; 

    let orderDetailsListC = await makeRequest(`./../api/receivers/orderReceiver.php?action=${action}&id=${id}`, "GET"); 

    let showOrderDetailC = document.querySelector(".orderDetailsCustomer")
    showOrderDetailC.classList.toggle("none")

    let orderHeaderC = document.createElement("h2")
    orderHeaderC.innerHTML = "Order Details"
    showOrderDetailC.innerHTML = ""

    showOrderDetailC.append(orderHeaderC)

    let leftBoxC = document.createElement("div")
    leftBoxC.classList.add("leftBox")

    let rightBoxC = document.createElement("div")
    rightBoxC.classList.add("rightBox")
    showOrderDetailC.append(leftBoxC)

    let orderIdC = orderDetailsListC.Id

    orderDetailsListC.orderStatus.forEach(orderStatus => {

        let orderDetailsC = document.createElement("div")
        orderDetailsC.classList.add("orderDetails")
        orderDetailsC.innerHTML = "<h3>Order status</h3>" + "Order with id: " + orderDetailsListC.Id + " - " + orderStatus.Status + "  "

        let sendOrderButtonC = document.createElement("button")
        sendOrderButtonC.classList.add("orderupdated")
        sendOrderButtonC.innerText = " Mark order as recieved"
        sendOrderButtonC.addEventListener("click", () => {
        
            markOrderAsRecieved(orderIdC)

        })
            leftBoxC.append(orderDetailsC)
            orderDetailsC.append(sendOrderButtonC)
    
          if(orderStatus.Status != "Shipped") {
                sendOrderButtonC.classList.add("none")
                return
    
            } else {
                sendOrderButtonC.classList.remove("none")
    
            }
        
        });
        

            orderDetailsListC.courrier.forEach(courrierList => {
                let courrierBoxC = document.createElement("div")
                courrierBoxC.classList.add("courrierBox")
                courrierBoxC.innerHTML = "<h3>Courrier</h3>" + courrierList.courrierName
           
                leftBoxC.append(courrierBoxC)
        
            })
        
            orderDetailsListC.products.forEach(productList => {
                let productBoxC = document.createElement("div")
                productBoxC.classList.add("productBox")
                
                productBoxC.innerHTML = "<h3>Product details</h3>" + "<br>" + "<p>Product Name: " + productList.name + "</p>" +  " Price: " + productList.unitPrice + " € " + "<br>" + " Quantity: " + productList.quantity + "<br>" + "<br>"+ "<hr>"
                
                leftBoxC.append(productBoxC)
            })
        
    
        }


async function markOrderAsRecieved(orderId){

    let user = await getUser();
    if(!user) {
        return
    }

    let body = new FormData(); 
    body.append("statusId", "CREC")
    body.append("orderId", orderId)
    body.append("endpoint", "updateReceivedOrder"); 
    
    let receivedOrder = await makeRequest(`./../api/receivers/orderReceiver.php`, "POST", body)

    if(receivedOrder == true) { 
        alert("Your order has been registered as delivered")
        
        location.reload();

    } else {
        alert("Failed on update")
    }

}







/* PRODUCT */

document.querySelector(".updateProductButton").addEventListener("click", setQuantity)
document.querySelector(".deleteQtyProductButton").addEventListener("click", () => {
    let deleteUnits =  document.querySelector(".deleteUnits").value
    deleteQuantity(deleteUnits)})

document.querySelector(".addQtyProductButton").addEventListener("click", () => {
    let addUnits =  document.querySelector(".addUnits").value
    addQuantity(addUnits)})


document.querySelector(".toggle").addEventListener("click", () => {
    let updateProduct = document.querySelector(".updateProduct")
    updateProduct.classList.toggle("menu")
})
document.querySelector(".toggle2").addEventListener("click", () => {
    let addQtyProduct = document.querySelector(".addQtyProduct")
    addQtyProduct.classList.toggle("menu")
})
document.querySelector(".toggle3").addEventListener("click", () => {
    let deleteQtyProduct = document.querySelector(".deleteQtyProduct")
    deleteQtyProduct.classList.toggle("menu")
})


async function overviewUnitsInStock() {

    let checkAdmin = await verifyAdmin();
    if(!checkAdmin) {
        return
    }

    let getProduct = document.querySelector(".getProduct")
    let overviewProduct = document.createElement("div")
    overviewProduct.classList.add("overviewProduct")
    overviewProduct.innerHTML = "";

    getProduct.append(overviewProduct)

}



document.querySelector(".getProductButton").addEventListener("click", getUnitsInStock)

async function getUnitsInStock() {

  let checkAdmin = await verifyAdmin();
  if(!checkAdmin) {
    alert("You are not allowed to proceed")
    return
}

    let products = await getAllProducts()

    let overviewProduct = document.querySelector(".overviewProduct")

    if(overviewProduct) {
        overviewProduct.innerHTML = "";
    }
    
    let productId =  document.querySelector(".productId").value

    if(!productId){
        alert("Product ID is missing, please try again");
        return
    }

    const product = products.find((product) => product.Id == productId)

    if(!product) {
        alert("Product does not exist")
        return
    }
    
    for (let i = 0; i < products.length; i++) {
    
        const product = products[i];

        if(product.Id == productId) {

            let infoProductContainer = document.createElement("div")
            infoProductContainer.classList.add("infoProductContainer")
            let pId = document.createElement("p")
            let pName = document.createElement("p")
            let pQty = document.createElement("p")
            let pImage = document.createElement("img")
            pImage.classList.add("pImage")

            pId.innerText = "Id: " + product.Id
            pName.innerText = "Name: " + product.name
            pQty.innerText = "Current Qty: " + product.unitsInStock
            pImage.src = "./assets/" + product.image

            overviewProduct.append(pImage, infoProductContainer)
            infoProductContainer.append(pId, pName, pQty)
        }
    }

}




async function setQuantity() {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let inputValue =  document.querySelector(".updateUnits")
    let updateUnits =  document.querySelector(".updateUnits").value
    let productId =  document.querySelector(".productId").value

    if(!productId){
        alert("Product ID is missing, please try again");
        return
    }
    if(!updateUnits){
        alert("Value is missing, please try again");
        return
    }

    let action = "setQuantity"

    let myData = new FormData()
    myData.append("action", action)
    myData.append("newValue", updateUnits)
    myData.append("productId", productId)

    let updateUnitsInStock = await makeRequest("./../api/receivers/productReceiver.php", "POST", myData)

    if(updateUnitsInStock == true) { 
        alert("Success!")
        let collapse = document.querySelector(".updateProduct")
        collapse.classList.remove("menu")
        inputValue.value = "";
        getUnitsInStock()
        

    } else {
        alert(updateUnitsInStock)
        getUnitsInStock()
        
    }
}



async function addQuantity(value) {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let inputValue =  document.querySelector(".addUnits")
    let productId =  document.querySelector(".productId").value

    if(!productId){
        alert("Product ID is missing, please try again");
        return
    }

    if(!value){
        alert("Value is missing, please try again");
        return
    }

    let body = new FormData()
    body.append("action", "addQuantity")
    body.append("value", value)
    body.append("productId", productId)

    let result = await makeRequest("./../api/receivers/productReceiver.php", "POST", body)

    if(result == true) { 
        alert("Success!")
        let collapse = document.querySelector(".addQtyProduct")
        collapse.classList.remove("menu")
        inputValue.value = "";
        getUnitsInStock()

    } else {
        alert(result)
        getUnitsInStock()
    }
}

async function deleteQuantity(value) {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let inputValue =  document.querySelector(".deleteUnits")
    let productId =  document.querySelector(".productId").value

    if(!productId){
        alert("Product ID is missing, please try again");
        return
    }

    if(!value){
        alert("Value is missing, please try again");
        return
    }

    let body = new FormData()
    body.append("action", "deleteQuantity")
    body.append("value", value)
    body.append("productId", productId)

    let result = await makeRequest("./../api/receivers/productReceiver.php", "POST", body)

    if(result == true) {
        alert("Success!")
        let collapse = document.querySelector(".deleteQtyProduct")
        collapse.classList.remove("menu")
        inputValue.value = "";
        getUnitsInStock()

    } else {
        alert(result)
        getUnitsInStock()
    }
}








/* MODIFY CATEGORY */



document.querySelector(".toggle4").addEventListener("click", () => {
    let replaceCategory = document.querySelector(".replaceCategory")
    replaceCategory.classList.toggle("menu")
})
document.querySelector(".toggle5").addEventListener("click", () => {
    let addCategory = document.querySelector(".addCategory")
    addCategory.classList.toggle("menu")
})
document.querySelector(".toggle6").addEventListener("click", () => {
    let deleteCategory = document.querySelector(".deleteCategory")
    deleteCategory.classList.toggle("menu")
})




/* SELECT PRODUCT */
async function overviewCategory() {
    let getProductCategory = document.querySelector(".getProductCategory")
    let overview = document.createElement("div")
    overview.classList.add("overview")
    overview.innerHTML = ""
    getProductCategory.append(overview)
}

document.querySelector(".getProductWithCategoryButton").addEventListener("click", renderProductWithCategory) 

async function renderProductWithCategory() {
    
    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let id =  document.querySelector(".getId").value

    if(!id){
        alert("Product ID is missing, please try again");
        return
    }

    let categories = await getCategoryWithProductId(id)
    let allProducts = await getAllProducts()

    const product = allProducts.find((product) => product.Id == id)

    if(!product) {
        alert("Product does not exist")
        return
    }

    if(!categories) {
        alert("No category was found")
    }

    let overview = document.querySelector(".overview")

    if(overview) {
        overview.innerHTML = "";
    }
   
    let infoProductContainer = document.createElement("div")
    infoProductContainer.classList.add("infoProductContainer")
    let pId = document.createElement("p")
    let pName = document.createElement("p")
    let pImage = document.createElement("img")
    pImage.classList.add("pImage")
    let category = document.createElement("p")
    category.innerText = "Category: "
    

    pId.innerText = "Id: " + product.Id
    pName.innerText = "Name: " + product.name
    pImage.src = "./assets/" + product.image

    overview.append(pImage, infoProductContainer)
    infoProductContainer.append(pId, pName, category)

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        let categoryName = document.createElement("p")
        categoryName.innerText = category.categoryName
        infoProductContainer.append(categoryName)
    }

    let selectList = document.querySelector("#addCategory")
    let selectListToBeReplaced = document.querySelector("#categoryToBeReplaced")
    let selectListNewCategory = document.querySelector("#newCategory")
    let selectListDelete = document.querySelector("#deleteCategory")

    selectList.innerHTML= "";
    selectListToBeReplaced.innerHTML= "";
    selectListNewCategory.innerHTML= "";
    selectListDelete.innerHTML= "";


    
    // Select Add Category
    let categoryList = await getCategories()
    
    for (let i = 0; i < categoryList.length; i++) {
        const listItem = categoryList[i];
        
        let option = document.createElement("option")
        option.innerText = listItem.categoryName
        option.setAttribute("value", listItem.Id) 
        selectList.append(option)

    }

    // Select Category to be replaced
    let categoryListProduct = await getCategoryWithProductId(id)

    for (let i = 0; i < categoryListProduct.length; i++) {
        
        const categoryItem = categoryListProduct[i];
        
        let option = document.createElement("option")
        option.innerText = categoryItem.categoryName
        option.setAttribute("value", categoryItem.Id) 
        selectListToBeReplaced.append(option)
    }

    // Select new category
    for (let i = 0; i < categoryList.length; i++) {
        const listItem = categoryList[i];
        
        let option = document.createElement("option")
        option.innerText = listItem.categoryName
        option.setAttribute("value", listItem.Id) 
        selectListNewCategory.append(option)

    }


    // Select Delete Category
    if(categoryListProduct.length == 1) {
        return
    }

    for (let i = 0; i < categoryListProduct.length; i++) {
        const categoryItem = categoryListProduct[i];
        
        let option = document.createElement("option")
        option.innerText = categoryItem.categoryName
        option.setAttribute("value", categoryItem.Id) 
        selectListDelete.append(option)
    }


}

async function getCategoryWithProductId(id) {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        return
    }

    let action = "getCategoryWithProductId"

    return await makeRequest(`./../api/receivers/categoryReceiver.php?action=${action}&id=${id}`, "GET")

}





/* ADD CATEGORY */
document.querySelector(".addCategoryButton").addEventListener("click", addCategoryToProduct) 

async function addCategoryToProduct() {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let productId =  document.querySelector(".getId").value

    if(!productId){
        alert("Product ID is missing, please try again");
        return
    }
  
    let categoryId = document.querySelector("#addCategory").value
    
    if(!categoryId){
        alert("Please select a category to proceed");
        return
    }

    let currentCategories = await getCategoryWithProductId(productId)

    for (let i = 0; i < currentCategories.length; i++) {
        const currentCategory = currentCategories[i];
        
        if(currentCategory.Id == categoryId) {
            alert("Category already exists on product")
            return
        }
    }

    let action = "addCategoryToProduct"

    let body = new FormData()
    body.append("action", action)
    body.append("categoryId", categoryId)
    body.append("productId", productId)

    let result = await makeRequest("./../api/receivers/productInCategoryReceiver.php", "POST", body) 

    if(result) { 
        alert("Success!")
        let collapse = document.querySelector(".addCategory")
        collapse.classList.remove("menu")
        renderProductWithCategory()

    } else {
        alert("Product not updated")
        renderProductWithCategory()
    }
}

async function getCategories() {
    const action = "getAll";

    let allCategories = await makeRequest(`./api/receivers/categoryReceiver.php?action=${action}`, "GET")

    return allCategories
    
}



/* DELETE CATEGORY */
document.querySelector(".deleteCategoryButton").addEventListener("click", deleteCategoryFromProduct) 

async function deleteCategoryFromProduct() {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let productId =  document.querySelector(".getId").value
    let categoryId = document.querySelector("#deleteCategory").value

    if(!productId){
        alert("Product ID is missing, please try again");
        return
    }
    
    if(!categoryId){
        alert("Please select a category to proceed");
        return
    }

    let action = "deleteCategoryFromProduct"

    let body = new FormData()
    body.append("action", action)
    body.append("categoryId", categoryId)
    body.append("productId", productId)

    let result = await makeRequest("./../api/receivers/productInCategoryReceiver.php", "POST", body) 

    if(result) { 
        alert("Success!")
        let collapse = document.querySelector(".deleteCategory")
        collapse.classList.remove("menu")
        renderProductWithCategory()

    } else {
        alert("Product not updated")
        renderProductWithCategory()
    } 

}



/* REPLACE CATEGORY */
document.querySelector(".replaceCategoryButton").addEventListener("click", categoryReplace) 

async function categoryReplace() {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let categoryIdToBeReplaced = document.querySelector("#categoryToBeReplaced").value
    let newCategoryId = document.querySelector("#newCategory").value
    let productId =  document.querySelector(".getId").value

    if(!categoryIdToBeReplaced) {
        alert("please select a category you want to replace")
        return
    }

    if(!newCategoryId) {
        alert("please select new category")
        return
    }

    if(!productId) {
        alert("please select a product")
        return
    }

    let currentCategories = await getCategoryWithProductId(productId)

    for (let i = 0; i < currentCategories.length; i++) {
        const currentCategory = currentCategories[i];
        
        if(currentCategory.Id == newCategoryId) {
            alert("Category already exists on product")
            return
        }
    }

    let action = "replaceCategory"

    let body = new FormData()
    body.append("action", action)
    body.append("oldCategoryId", categoryIdToBeReplaced)
    body.append("newCategoryId", newCategoryId)
    body.append("productId", productId)

    let result = await makeRequest("./../api/receivers/productInCategoryReceiver.php", "POST", body) 

    if(result) { 
        alert("Success!")
        let collapse = document.querySelector(".replaceCategory")
        collapse.classList.remove("menu")
        renderProductWithCategory()

    } else {
        alert("Product not updated")
        renderProductWithCategory()
    }  

}






async function renderSubscribers() {

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        return
    }

        const renderSubList = await getAllLoggedInSubscribers();
        
        
        for (let i = 0; i < renderSubList.length; i++) {
            
            let subList = renderSubList[i]
        
           
            const allSubscribers = document.querySelector(".firstname");
            const emailCont = document.querySelector(".email")
            let firstNameDiv = document.createElement("div")
            firstNameDiv.classList.add("firstNameDiv")
            let firstName = document.createElement("p")
            firstName.classList.add("firstNameSub")
        
            firstName.innerText = subList.FirstName
         
            firstNameDiv.append(firstName)
            allSubscribers.append(firstNameDiv)
        
        
            let emailDiv = document.createElement("div")
            emailDiv.classList.add("emailDiv")
            let email = document.createElement("p")
            email.classList.add("emailSub")
  
            email.innerText = subList.Email
            emailDiv.append(email)
            emailCont.append(emailDiv)
 
        }
    }

document.querySelector('#sendNews').addEventListener('click', createNewsLetter)

async function createNewsLetter(e) {
    e.preventDefault();

    let checkAdmin = await verifyAdmin();

    if(!checkAdmin) {
        alert("You are not allowed to proceed")
        return
    }

    let title = document.getElementById('title').value;
    let content = document.getElementById('content').value;
    let success = document.querySelector('.success');
    
   if(!title) {
        alert("Please add title!")
        return
    }
    if(!content) {
        alert("Please add content!")
        return
    }
    
    const action = 'add'

    const newsletter = {
        Title: title, 
        Text: content
    }
        
    
    let body = new FormData()
    body.append('action', action)
    body.append("news", JSON.stringify(newsletter))
    

    let result = await makeRequest("./../api/receivers/newsletterReceiver.php", "POST", body)

    if(!result){
        success.innerHTML = "Something went wrong, please try again!"

    }else{
        success.innerHTML = "Your newsletter was succesfully created"
    }

}



window.addEventListener('load', onLoad)

