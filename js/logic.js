import {openMenu, getAllCategories, burger} from '.././helperFunctions/renderHelper.js'
import {makeRequest, getUser, showCorrectLayout, logOut, printNrOfElements, addSubscriptionNews} from '.././helperFunctions/fetchHelper.js'  // checka verifyadmin

document.querySelector(".logOut").addEventListener("click", logOut)

async function onLoad() {
    await getUser();
    await showCorrectLayout();
    await printNrOfElements();
    await getAllCategories();
    burger()

}


document.getElementById("menu").addEventListener("click", openMenu);
document.getElementById("submitClick").addEventListener("click", addSubscriptionNews)


document.getElementById("readMoreMyBtn").addEventListener("click", readMore);

function readMore() {
    const dots = document.getElementById("dots");
    const moreText = document.getElementById("open");
    const btnText = document.getElementById("readMoreMyBtn")
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more"; 
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less"; 
      moreText.style.display = "inline";
    }
}


window.addEventListener('load', onLoad)

