let loginForm = document.getElementById('loginForm');
let signupButton = document.getElementById('signUpButton');

loginForm.addEventListener('submit',userAuthentication);
signupButton.addEventListener('click',signUpRedirect);

function signUpRedirect() {
    window.location.href = "../SignUp/signUp.html";
}

async function userAuthentication(e) {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let pass = document.getElementById('password').value;

    console.log("====>",email);
    console.log("====>",pass);

    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    try {

        await axios.post("http://localhost:3000/users/login",{
            email:email,
            pass:pass
        }).then(res => {
            console.log("====>",res)
            window.location.href = "../ChatApp/chat.html";
        })

    } catch (err) {
        console.log(err);
    }
}