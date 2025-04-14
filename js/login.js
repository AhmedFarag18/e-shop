import { showToast } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate input fields on keyup
    emailInput.addEventListener("keyup", () => validateEmail());
    passwordInput.addEventListener("keyup", () => validatePassword());

    // Form submit event
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = validateEmail() & validatePassword();

        if (isValid) {
            checkUserCredentials();
        }
    });

    // Validate Email
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        if (!emailPattern.test(emailValue)) {
            showError(emailInput, "Please enter a valid email address.");
            return false;
        } else {
            hideError(emailInput);
            return true;
        }
    }

    // Validate Password
    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        if (passwordValue.length < 8) {
            showError(passwordInput, "Password must be at least 8 characters.");
            return false;
        } else {
            hideError(passwordInput);
            return true;
        }
    }

    // Show Error
    function showError(input, message) {
        const errorMessage = input.parentElement.parentElement.querySelector(".error_message");
        errorMessage.textContent = message;
        input.classList.add("error");
    }

    // Hide Error
    function hideError(input) {
        const errorMessage = input.parentElement.parentElement.querySelector(".error_message");
        errorMessage.textContent = "";
        input.classList.remove("error");
    }

    // Check if the user exists in localStorage
    function checkUserCredentials() {
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const adminData = {
            username: "Admin",
            email: "admin@admin.com",
            password: "admin123"
        }


        let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

        const user = users.find(user => user.email === emailValue && user.password === passwordValue);


        if (emailValue == adminData.email && passwordValue == adminData.password) {
            localStorage.setItem("currentUser", JSON.stringify(adminData));
            showToast("Login as 🤞Admin✌ successful 😎");
            setTimeout(() => {
                window.location.href = "../pages/admin/dashboard.html";
            }, 1000);
        }
        else if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            showToast("Login successful!");
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1000);
        } else {
            showToast("Invalid email or password!", "error");
        }
    }
});
