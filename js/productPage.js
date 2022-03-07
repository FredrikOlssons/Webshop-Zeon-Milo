
import {openMenu, getAllCategories, burger} from './../helperFunctions/renderHelper.js'
import {makeRequest, showCorrectLayout, logOut, printNrOfElements} from './../helperFunctions/fetchHelper.js'


async function onLoad() {
    await showCorrectLayout();
    await printNrOfElements(); 

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const url = urlParams.get('id')
    
    await productPage(url); 
    await getAllCategories(url);
    await renderProduct(url); 

    burger();

}


document.getElementById("menu").addEventListener("click", openMenu);
document.querySelector(".logOut").addEventListener("click", logOut)


async function productPage(product) {
    
    const action = "getById";
    let specificProduct = await makeRequest(`./../api/receivers/productReceiver.php?action=${action}&id=${product}`, "GET")
    
    return specificProduct;
    
}   



async function renderProduct(idToGet) {
    
    const action = "getById";
    let product = await makeRequest(`./../api/receivers/productReceiver.php?action=${action}&id=${idToGet}`, "GET")
    
    
    let main = document.getElementsByTagName("main")[0]; 
    
    
    
    let productCont = document.createElement("div")
    productCont.classList.add("productCont")
    let title = document.createElement("h2")
    title.innerHTML = product.name;
    let productInfo = document.createElement('div');
    productInfo.classList.add('productInfo')
    let description = document.createElement("p")
    description.classList.add('textCont');
    description.innerHTML = product.description;
    let unitPrice = document.createElement("p")
    unitPrice.classList.add('priceCont');
    unitPrice.innerHTML = product.unitPrice + " €";
    let image = document.createElement("img")
    let leftDiv = document.createElement('div')
    leftDiv.classList.add('leftDiv')
    image.classList.add('productImage')
    image.src = "./assets/" + product.image
    image.addEventListener("click", () => {productPage(product)})
    
    
    let addToCartButton = document.createElement('button'); 
    addToCartButton.classList.add('addToCart')
    addToCartButton.innerText = "Add"
    addToCartButton.addEventListener("click", () => {addToCart(product.Id)})
    
    document.querySelector(".returnToPpage").addEventListener("click", () => {
        let returnButton = document.referrer
        location.href = returnButton
    })

    let divForCart = document.createElement('div');
    divForCart.classList.add('divForCart')
    let cartButton = document.createElement('button')
    cartButton.classList.add('cartButton')
    cartButton.innerText = 'Continue to checkout'
    
    main.append(productCont)
    
    cartButton.addEventListener("click", () => { location.href = "./../cartPage.html"; })
    
    divForCart.append(addToCartButton, cartButton)
    productInfo.append(title, description, unitPrice, divForCart)
    leftDiv.append(image)
    productCont.append(leftDiv, productInfo)

    if(product.unitsInStock == 0) {
        addToCartButton.classList.add("noClick")
        return
    }

    addToCartButton.classList.remove("noClick")

}



// add products to cart 
async function addToCart(productId) {

    const push = "addProduct"

    var body = new FormData()
    body.append("action", push)
    body.append("productId", JSON.stringify(productId))

    let result =  await makeRequest(`./../api/receivers/cartReceiver.php`, "POST", body)

    alert(result)

    printNrOfElements();

}


window.addEventListener('load', onLoad)


