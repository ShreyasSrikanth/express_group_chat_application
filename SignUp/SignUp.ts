let nameInput = document.getElementById('name') as HTMLInputElement;
let emailInput = document.getElementById('email') as HTMLInputElement;
let phnumInput = document.getElementById('phnum') as HTMLInputElement;
let passwordInput = document.getElementById('password') as HTMLInputElement;
let submitSignUp = document.getElementById('submitSignUp') as HTMLInputElement;

function handleFormSubmission(event: Event) {
    event.preventDefault();

    // Log form values to the console
    console.log('Name:', nameInput.value);
    console.log('Email:', emailInput.value);
    console.log('Phone Number:', phnumInput.value);
    console.log('Password:', passwordInput.value);
}

document.getElementById('signUpForm')?.addEventListener('submit', handleFormSubmission);
