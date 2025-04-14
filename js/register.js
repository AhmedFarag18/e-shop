import { showToast } from "./utils.js";

const form = document.getElementById("register_form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
// should contain numbers and letters at least 3 chars
const usernameRegex = /^[a-zA-Z0-9]{3,}$/;



/*------------------------------------------
start validation and submit form
---------------------------------------------*/

const setError = (element, message) => {
    const errorDisplay = element.parentNode.nextElementSibling;
    errorDisplay.innerText = message;
    errorDisplay.style.color = "red";
};

const setSuccess = (element) => {
    const errorDisplay = element.parentNode.nextElementSibling;
    errorDisplay.innerText = "";
};

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validateField = (element, validationFunc, message) => {
    element.addEventListener("keyup", () => { // 'keyup' triggers when the user leaves the input field
        if (!validationFunc(element.value.trim())) {
            setError(element, message);
        } else {
            setSuccess(element);
        }
    });
};

validateField(username, value => usernameRegex.test(value), "Username must be at least 3 characters long and should contain letters & numbers.");
validateField(email, isValidEmail, "Provide a valid email address.");
validateField(password, value => value.length >= 8, "Password must be at least 8 characters.");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    let valid = true;

    if (!usernameRegex.test(usernameValue)) {
        setError(username, "Username must be at least 3 characters and can contain letters & numbers.");
        valid = false;
    } else {
        setSuccess(username);
    }

    if (!isValidEmail(emailValue)) {
        setError(email, "Provide a valid email address.");
        valid = false;
    } else {
        setSuccess(email);
    }

    if (passwordValue.length < 8) {
        setError(password, "Password must be at least 8 characters.");
        valid = false;
    } else {
        setSuccess(password);
    }

    // Stop submit if validation fails
    if (!valid) return;

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (users.some(user => user.email === emailValue)) {
        showToast("You are already registered! Redirecting to login.", "error");
    } else {
        users.push({ username: usernameValue, email: emailValue, password: passwordValue });
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        showToast("Registration successful!");
    }

    setTimeout(() => { window.location.href = "login.html"; }, 3000);
});

