/*--------------------------  Change Navbar Background and show up to top Button --------------------------*/
let btnToTop = document.querySelector(".btn-toTop");
let navbar = document.querySelector(".navbar");

window.onscroll = () => {
    if (window.pageYOffset >= 100) {
        btnToTop.classList.add("show");
        navbar.classList.add("scroll");
    } else {
        navbar.classList.remove("scroll");
        btnToTop.classList.remove("show");
    }
};

const btnMobileToggle = document.querySelector(".nav-menu-toggle");
const navMenu = document.querySelector(".nav-menu");
btnMobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("mobile_toggle");
});

// scroll to Top
btnToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0 });
});

const loader = document.querySelector(".loader-container")

/* ------------------- #  Page Loading ----------------------- */
window.addEventListener("load", function () {
    loader.classList.add("hide");
});


/* ------------------- # Change Navbar if user is logged in ----------------------- */

const navLoginBtn = document.querySelector(".nav_login_btn");
const currentUserData = JSON.parse(localStorage.getItem("currentUser"));

if (navLoginBtn) {
    if (currentUserData) {
        navLoginBtn.innerHTML = `
            <div class="user_is_logged">
                <span>${currentUserData.username.slice(0, 2)}</span>
                <ul class="user_menu">
                    <li><a href="${currentUserData.email == "admin@admin.com" ? "../pages/admin/dashboard.html" : "../pages/orders.html"}">Profile</a></li>
                    <li><a href="#" class="log_out">Log out</a></li>
                </ul>
            </div>
        `;

        /*------ Toggle dropdown when clicking initials --------- */
        const userBox = document.querySelector(".user_is_logged");
        const logoutBtn = document.querySelector(".log_out");

        userBox.addEventListener("click", (event) => {
            event.stopPropagation();
            userBox.classList.toggle("active");
        });

        /*------ Hide dropdown when clicking outside --------- */
        document.addEventListener("click", (event) => {
            if (!userBox.contains(event.target)) {
                userBox.classList.remove("active");
            }
        });

        // Logout functionality
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("currentUser");
            showToast("Logged out successfully!");
            setTimeout(() => {
                window.location.href = "../pages/login.html";
            }, 1000);
        });
    } else {
        navLoginBtn.innerHTML = `
            <a href="../pages/login.html" class="primary_btn">
                <span>Login</span>
                <i class="bx bx-user"></i>
            </a>
        `;
    }
}



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
