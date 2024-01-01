"use strict";
var _a;
let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
let phnumInput = document.getElementById('phnum');
let passwordInput = document.getElementById('password');
let submitSignUp = document.getElementById('submitSignUp');
function handleFormSubmission(event) {
    event.preventDefault();
    // Log form values to the console
    console.log('Name:', nameInput.value);
    console.log('Email:', emailInput.value);
    console.log('Phone Number:', phnumInput.value);
    console.log('Password:', passwordInput.value);
}
(_a = document.getElementById('signUpForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', handleFormSubmission);
