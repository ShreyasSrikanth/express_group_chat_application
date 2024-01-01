let signup = document.getElementById('signUpForm');

signup.addEventListener('submit',sendSignUpDetails);

async function sendSignUpDetails(e){
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phnum = document.getElementById('phnum').value;
    let password = document.getElementById('password').value;

    console.log(name);
}