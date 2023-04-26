import {readJSON} from "./modules/readJSON.js";

let accountEmailInput = document.querySelector('.email');
let accountPasswordInput = document.querySelector('.password');
let submitButton = document.querySelector('.login__submit');

//usage:
let data = readTextFile("account.json")

submitButton.addEventListener('click', () => {
    if(accountEmailInput.value === data.email && accountPasswordInput.value === data.password) {

    }
});