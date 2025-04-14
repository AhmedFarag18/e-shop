export const isGithub = location.hostname === "ahmedfarag18.github.io";
export const basePath = isGithub ? "/e-shop/" : "/";
// Retrieve products from localStorage
export const products = JSON.parse(localStorage.getItem("products")) || [];
export let productsWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];


/* ------------------------ Not Allowed if nnot admin  ------------------------*/
export function notAllowed() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser && currentUser.email === "admin@admin.com") {
        return;
    } else {
        showToast("You are Not allowed Admin to access this", "error");
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 0);
    }
}

/* ------------------------ Toast Component ------------------------*/
export function showToast(message, status, time = 5000) {
    const toast = document.querySelector(".toast");
    if (!toast) return console.error("Toast element not found!");

    toast.innerText = message;
    toast.className = `toast show ${status === "error" ? "error" : ""}`;
    toast.style.display = "flex"

    setTimeout(() => {
        toast.classList.remove("show")
        toast.style.display = "none"
    }, time);
}

/* ------------------------ Update Navbar Cart total items ------------------------*/
export function updateCartNavCount() {
    // Update Navbar Cart total items
    const cart = JSON.parse(localStorage.getItem("cart"));
    const navCartCount = document.querySelector(".nav-cart-count");
    if (!cart) return;
    navCartCount.innerText = cart.reduce((ele, item) => ele + item.quantity, 0);
}

/* ------------------------ Navbar Mobile for Admin Pages ------------------------ */
export function navSlide() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    burger.addEventListener("click", () => {
        //Toggle Nav
        nav.classList.toggle("nav-active");

        //Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ""
            } else {
                link.style.animation = `navLinkFade 0.3s ease forwards ${index / 4 + 0.3}s`;
            }
        });
        //Burger Animation
        burger.classList.toggle("toggle");
    });

}

/* ------------------------ Display Product Card ------------------------ */
export function displayProduct(product, wishlistPage = false) {
    return `<div class="product-card">
                <a href="${basePath}pages/singleproduct.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-card-image">
                </a>
                <div class="product-card-content">
                    <div class="product-card-header">
                        <span class="brand-label">${product.category}</span>
                    </div>
                    <h4 class="product-card-title line_clamp1">${product.name}</h4>
                    <p class="product-card-desc line_clamp1">${product.description}</p>
                    <p class="product-price">$${product.price}</p>

                    ${!wishlistPage ? `<div class="product-card-footer">
                        <button class="product-btn-wishlist primary_btn" data-action="wishlist" data-product-id="${product.id}" title="Add to Wishlist"><i class="bx bx-heart"></i></button>
                        <button class="product-btn primary_btn" data-action="cart" data-product-id="${product.id}" title="Add to Cart">
                            <i class="bx bx-cart"></i>
                            <span>Add To Cart</span>
                        </button>
                    </div>`
            :
            `<div class="product-card-footer">
                            <button class="product-btn primary_btn remove-btn" data-id="${product.id}" title="Remove from Wishlist">
                                <span>Remove</span>
                                <i class="bx bx-trash"></i>
                            </button>
                            <a href="../pages/singleproduct.html?id=${product.id}" class="product-btn primary_btn" title="View Product Details">
                                <i class="bx bx-right-arrow-alt"></i>
                            </a>
                        </div>`
        }
                </div>
            </div>`;
}

/* ------------------------ Initialize Event Delegation ------------------------ */
export function initProductEvents(container) {
    container.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const action = button.getAttribute("data-action");
        const productId = button.getAttribute("data-product-id");

        if (action === "wishlist") {
            addToWishlist(productId);
        } else if (action === "cart") {
            addToCart(productId);
        }
    });
}

/* ------------------------ Add to Wishlist ------------------------ */
export function addToWishlist(productId) {
    let selectedProductArray = products.filter(el => String(el.id) === String(productId));

    if (selectedProductArray.length === 0) {
        showToast("Product not found!", "error");
        return;
    }

    let selectedProduct = selectedProductArray[0];

    if (productsWishlist.some(el => String(el.id) === String(productId))) {
        showToast("Product Already added in wishlist 🤷‍♂️", "error");
        return;
    }

    productsWishlist.push(selectedProduct);
    localStorage.setItem("wishlist", JSON.stringify(productsWishlist));
    showToast("Product added to wishlist ❤");
}

/* ------------------------ Add Product To Cart ------------------------ */
export function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(item => item.id == product.id);

    if (existingProduct) {
        if (existingProduct.quantity >= product.stock) {
            showToast("You've reached the maximum stock available! ❌", "error");
            return;
        }
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("Product added to cart! 🛒");
    updateCartNavCount();
}

/* ------------------------ Toggle password visibility ------------------------ */
export function togglePassword() {
    const passwordInput = document.querySelector('#password');
    const eyeIcon = document.getElementById('eye-icon');

    const isPasswordHidden = passwordInput.type === 'password';
    passwordInput.type = isPasswordHidden ? 'text' : 'password';
    eyeIcon.classList.replace(
        isPasswordHidden ? 'bx-lock-alt' : 'bx-lock-open-alt',
        isPasswordHidden ? 'bx-lock-open-alt' : 'bx-lock-alt'
    );
}

window.togglePassword = togglePassword;
