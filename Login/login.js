let loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit',userAuthentication)

async function userAuthentication(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let pass = document.getElementById('password').value;

    console.log("====>",email);
    console.log("====>",pass);

    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}