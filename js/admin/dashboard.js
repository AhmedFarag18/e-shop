import { navSlide, notAllowed } from "./../utils.js";

// check if Authorization and Redirect
notAllowed()

// Change Navbar in Mobile View and handle Menu Button when page load
window.addEventListener("DOMContentLoaded", () => navSlide());
