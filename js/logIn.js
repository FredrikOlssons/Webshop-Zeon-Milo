import {openMenu, getAllCategories, burger} from './../helperFunctions/renderHelper.js'
import {makeRequest, getUser, showCorrectLayout, logOut, printNrOfElements, addSubscriptionNews} from './../helperFunctions/fetchHelper.js'  // checka verifyadmin och getuser


const loginForm = document.querySelector("#login")
const createAccountForm = document.querySelector("#createAccount")


async function onLoad() {
    await accountCheck();
    await showCorrectLayout();
    await printNrOfElements();
    await getAllCategories();
    burger();
}

async function accountCheck() {

    let allowed = await getUser();
    if(allowed) {
        location.href = "./../index.html";
        return
    }
}

document.getElementById("menu").addEventListener("click", openMenu);
document.querySelector(".logOut").addEventListener("click", logOut);
document.getElementById("submitClick").addEventListener("click", addSubscriptionNews)


// Switching between Login-form and create account-form
document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault(); 
        loginForm.classList.add("hidden");
        createAccountForm.classList.remove("hidden");
    });

    document.querySelector("#linkLogIn").addEventListener("click", e => {
        e.preventDefault();  
        loginForm.classList.remove("hidden");
        createAccountForm.classList.add("hidden");
    });
});





// log in function
document.querySelector(".button").addEventListener("click", loginUser)

async function loginUser(e) {
    e.preventDefault();

    const action = 'loginUser'; 

    let loginUser = document.querySelector("#inputUserName").value
    let loginPassword = document.querySelector("#inputPassword").value

    let verify = await makeRequest(`./../api/receivers/userReceiver.php?action=${action}&user=${loginUser}&password=${loginPassword}`, "GET")

    if(!verify) {
        alert("Wrong credentials")
        return
    }
    alert("You are in!")

    location.href = "./../index.html";

}




/* Register account - View */
document.querySelector(".buttonCA").addEventListener("click", registerAccount)


async function registerAccount(e) {
e.preventDefault();

    
    // Fetch values from register account-forms
    let registerFirstname = document.querySelector("#firstname").value
    let registerLastname = document.querySelector("#lastname").value
    let registerStreet = document.querySelector("#street").value
    let registerCO = document.querySelector("#co").value
    let registerZipcode = document.querySelector("#zipcode").value
    let registerCity = document.querySelector("#city").value
    let registerCountry = document.querySelector("#country").value
    let registerCountrycode = document.querySelector("#countrycode").value
    let registerMobilenumber = document.querySelector("#mobilenumber").value
    let registerStandardphone = document.querySelector("#standardphone").value
    let registerEmail = document.querySelector("#user").value
    let registerPassword = document.querySelector("#pw").value
    let confirmPassword = document.querySelector("#confirmpw").value
    
    
    // Call functions to check if the credentials are good enough before we send them to PHP
    const isValid = validateInputs(registerPassword) 
    const validPw = validatePasswords(registerPassword, confirmPassword)
    const inputPwUser = sameInputs(registerEmail, registerPassword)
    const firstIsValid = validateRegistrationFormfName();
    const lastIsValid = validateRegistrationFormlName();
    const streetIsValid = validateRegistrationFormStreet();
    const zipIsValid = validateRegistrationFormzip();
    const cityIsValid = validateRegistrationFormCity();
    const countryIsValid = validateRegistrationFormCountry();
    const emailIsValid = validateRegistrationFormEmail();
    const cCodeIsValid = validateRegistrationFormCcode();
    const mobileIsValid = validateRegistrationFormMobile();
    
    /* If all these are true, the credentials  will be sent to PHP */
    
    // if username or password has less than 6 characters
    if(!isValid) {
        alert("You need to use more than 5 characters")
        return
    }

    if(!firstIsValid) {
        
        alert('Make sure everything is filled out correctly before proceeding')
        return;
    }

    
    if(!lastIsValid) {
    
        alert('Make sure everything is filled out correctly before proceeding')
        return;
    }

    
    if(!streetIsValid) {
     
        alert('Make sure everything is filled out correctly before proceeding')
        return;
    }

    
    if(!zipIsValid) {
        
        alert('Make sure everything is filled out correctly before proceeding')
        return;
    }

    
    if(!countryIsValid) {
        
        alert('Make sure everything is filled out correctly before proceeding')
        return;
    }

    
    if(!cCodeIsValid) {
       
        alert('Make sure everything is filled out correctly before proceeding')
        return;
    }

    
    if(!mobileIsValid) {
       
        alert('Make sure everything is filled out correctly before proceeding')
        return;
    }


    
    
    // If username and password are the same
    if(!inputPwUser) {
        alert("Username and password can't be the same. You can do better :) ")
        return
    }
    
    // If the password inputs doesnt match:
    if(!validPw){
        alert("Passwords doesn't match. Try again")
        return
    }
    
    const action = 'addUser'; 

    let emailCheck = await makeRequest(`./../api/receivers/userReceiver.php?action=${action}&user=${registerEmail}`, "GET")
    if (!emailCheck) {

        alert("Account already exists")

        return 
    }





    //POST to userReciever
    const userToAdd = {
        FirstName: registerFirstname,
        LastName: registerLastname,
        Street: registerStreet,
        CO: registerCO,
        ZipCode: registerZipcode,
        City: registerCity,
        Country: registerCountry,
        Email: registerEmail,
        CountryCode: registerCountrycode,
        MobileNumber: registerMobilenumber,
        StandardPhone: registerStandardphone,
        Password: registerPassword,
        Admin: false,
        TermsOfPurchase: true
    }
    
    var myData = new FormData();
    myData.append("endpoint", "addUser");
    myData.append("addUser", JSON.stringify(userToAdd))

    let addUser = await makeRequest("./../api/receivers/userReceiver.php", "POST", myData)

    if(addUser) {
        alert("Your account has been created!")
        loginForm.classList.remove("hidden");
        createAccountForm.classList.add("hidden");
        return
    }

    alert("Something went wrong!")



}





/* Functions to register account */


// Check if the inputs have 6 or more characters     
function validateInputs(password) {
    if(password.length >= 6){
        return true
    }
        return false
}

// Check if the input of both passwords are matching
function validatePasswords(password, confPassword){
    if(password == confPassword) {
        return true
    }
        return false
}

// Check if username and password are the same
function sameInputs(username, password){
    if(username == password) {
        return false
    }
        return true
}

//document.querySelector(".buttonCA").addEventListener('click', validateRegistrationForm)

function validateRegistrationFormfName() {
    var x = document.forms["registrationForm"]["firstname"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}


function validateRegistrationFormlName() {
    var x = document.forms["registrationForm"]["lastname"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}

function validateRegistrationFormStreet() {
    var x = document.forms["registrationForm"]["street"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}

function validateRegistrationFormzip() {
    var x = document.forms["registrationForm"]["zipcode"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}

function validateRegistrationFormCity() {
    var x = document.forms["registrationForm"]["city"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}

function validateRegistrationFormCountry() {
    var x = document.forms["registrationForm"]["country"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}

function validateRegistrationFormEmail() {
    var x = document.forms["registrationForm"]["email"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}



function validateRegistrationFormCcode() {
    var x = document.forms["registrationForm"]["countrycode"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}

function validateRegistrationFormMobile() {
    var x = document.forms["registrationForm"]["mobileNumber"].value;
    
    if (x == "" || x == null) {
     
      return false;
    }else{
        return true; 
    }
}
       
  


window.addEventListener("load", onLoad);


