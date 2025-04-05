const form = document.getElementById("register_form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const usernameRegex = /^[a-zA-Z0-9]{3,}$/;



// ------- Change type of password input--------

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.querySelector('#password');
    const eyeIcon = document.getElementById('eye-icon');

    const isPasswordHidden = passwordInput.type === 'password';
    passwordInput.type = isPasswordHidden ? 'text' : 'password';
    eyeIcon.classList.replace(
        isPasswordHidden ? 'bx-lock-alt' : 'bx-lock-open-alt',
        isPasswordHidden ? 'bx-lock-open-alt' : 'bx-lock-alt'
    );
}

/*------------------------------------------
start validation and submit form
---------------------------------------------*/

const setError = (element, message) => {
    const errorDisplay = element.parentNode.nextElementSibling;
    errorDisplay.innerText = message;
    errorDisplay.style.color = "red";
};

const setSuccess = (element) => {
    const errorDisplay = element.nextElementSibling;
    errorDisplay.innerText = "";
};

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validateField = (element, validationFunc, message) => {
    element.addEventListener("blur", () => { // 'blur' triggers when the user leaves the input field
        if (!validationFunc(element.value.trim())) {
            setError(element, message);
        } else {
            setSuccess(element);
        }
    });
};

validateField(username, value => usernameRegex.test(value), "Username must be at least 3 characters long and can contain letters & numbers.");
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


function showToast(message, status) {
    const toast = document.querySelector(".toast");
    if (!toast) return console.error("Toast element not found!");

    toast.innerText = message;
    toast.className = `toast show ${status === "error" ? "error" : ""}`;
    toast.style.display = "flex"

    setTimeout(() => {
        toast.classList.remove("show")
        toast.style.display = "none"
    }, 3000);
}


