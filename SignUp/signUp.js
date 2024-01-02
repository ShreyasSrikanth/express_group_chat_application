let signup = document.getElementById('signUpForm');

signup.addEventListener('submit',sendSignUpDetails);

async function sendSignUpDetails(e){
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phnum').value;
    let pass = document.getElementById('password').value;

    try{
        await axios.post('http://localhost:3000/users/signup', {
            name: name,
            email: email,
            phone: phone,
            pass: pass
        }).then(res=>{
            
            alert("Email succesfully registered");

            document.getElementById('name').value = "";
            document.getElementById('email').value = "";
            document.getElementById('phnum').value = "";
            document.getElementById('password').value = "";

            window.location.href = '../Login/login.html';
        })
    } catch (err) {
        
        let status = err.response.status
        if(status === 404){
            alert("Email already registered");
        } else if(status === 500){
            alert("Server crashed")
        }
        
    }
}