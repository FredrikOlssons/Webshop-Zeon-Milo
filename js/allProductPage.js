import {openMenu, getAllCategories, burger} from './../helperFunctions/renderHelper.js'
import {makeRequest, showCorrectLayout, logOut, printNrOfElements} from './../helperFunctions/fetchHelper.js'


async function onLoad() {
    await showCorrectLayout();
    await printNrOfElements();
    getAllProducts();
    getAllCategories();
    burger();
}


document.getElementById("menu").addEventListener("click", openMenu);
document.querySelector(".logOut").addEventListener("click", logOut)

async function getAllProducts() {
    const action = "getAll";

    let allProducts = await makeRequest(`./api/receivers/productReceiver.php?action=${action}`, "GET")

    renderProducts(allProducts)
    
}


async function renderProducts(list){

    const main = document.getElementsByTagName("main")[0]; 
    let allproductsDiv = document.createElement("div")
    allproductsDiv.classList.add("allproductsDiv")
    
    let titleOfAllProducts = document.createElement("h2")
    titleOfAllProducts.classList.add("titleOfAllProducts")
    titleOfAllProducts.innerText = "ALL PRODUCTS"
    
    main.append(titleOfAllProducts)


    for (let i = 0; i < list.length; i++) {
        
        const element = list[i];

        let productContainer = document.createElement("div")
        productContainer.classList.add("productContainer")
        let title = document.createElement("h2")
        title.classList.add("productTitle")
        title.innerHTML = element.name;
        let unitPrice = document.createElement("p")
        unitPrice.classList.add("productUnitPrice")
        unitPrice.innerHTML = element.unitPrice + " €";
        let image = document.createElement("img")
        image.classList.add("collectionImage")
        image.src = "./assets/" + element.image

        let avaliableUnits = document.createElement('p')
        avaliableUnits.classList.add('avaliableUnits')
        let unitsInStock = element.unitsInStock;
        if(unitsInStock > 0){
            avaliableUnits.innerHTML = 'Product avaliable to order'; 
        }else{
            avaliableUnits.style.color = "red"
            avaliableUnits.innerHTML = 'Product out of stock'
        }
        image.addEventListener("click", () => {productPage(element)}) 

        main.append(allproductsDiv)
        allproductsDiv.append(productContainer)
        productContainer.append(image, title, unitPrice, avaliableUnits)
    }
}


function productPage(product) {

    let productId = product.Id

    window.location.href = "productPage.html?id=" + productId; 

}



window.addEventListener('load', onLoad)
