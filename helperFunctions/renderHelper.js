import {makeRequest} from './fetchHelper.js'

// Dropmeny
export function openMenu() {   
    document.getElementById("dropdown").classList.toggle("active");
    
} 


/* Category */

/* Hämtar alla kategorier */
export async function getAllCategories() {
    const action = "getAll";
    let allCategories = await makeRequest(`./../api/receivers/categoryReceiver.php?action=${action}`, "GET")
    
    
    for (let i = 0; i < allCategories.length; i++) {
        const element = allCategories[i];
        
        const ul = document.getElementById("dropdown");
        let productContainer = document.createElement("div")
        productContainer.classList.add("productContainerForDropdown")
        let title = document.createElement("a")
        title.href = 'collectionPage.html?id=' + element.Id
        title.innerHTML = element.categoryName; 
        ul.append(productContainer)
        productContainer.append(title)

        
        
    }  
    
    
}


export async function getAllCategoriesAsList() {
    const action = "getAll";
    let allCategories = await makeRequest(`./../api/receivers/categoryReceiver.php?action=${action}`, "GET")
    
    
    for (let i = 0; i < allCategories.length; i++) {
        const element = allCategories[i];
        let categories = element.Id; 
        return categories; 
    }

}

export async function getCategoryFromId(idToGet) {

    const action = "getById";
    let specificCategory = await makeRequest(`./../api/receivers/categoryReceiver.php?action=${action}&id=${idToGet}`, "GET")
    console.log(specificCategory) 

    for (let i = 0; i < specificCategory.length; i++) {
        const category = specificCategory[i]; 
        console.log(category)
    }
    const main = document.getElementsByTagName("main")[0]; 

    if(specificCategory.categoryName) {

        let categoryContainer = document.createElement("div")
        categoryContainer.classList.add("categoryContainer")
        let category = document.createElement("h2")
        category.innerHTML = specificCategory.categoryName;
        
        main.appendChild(categoryContainer)
        categoryContainer.appendChild(category)
    
    }

}


export function burger() {

    const hamburger = document.querySelector(".hamburgerMenu");
    const menu = document.querySelector(".contactDiv");
    
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        menu.classList.toggle("active");
    
    });
}