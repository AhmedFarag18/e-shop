const imgPath = "../images/home/banner/";
const heroImages = ["banner-02.jpg", "banner-03.png", "banner-04.jpg", "banner-05.jpg"];
let heroBg = document.querySelector(".hero");
let lastIndex = -1;

function changeBackground() {
    let selectedImg;

    do {
        selectedImg = Math.floor(Math.random() * heroImages.length);
    } while (selectedImg === lastIndex);

    lastIndex = selectedImg;

    setTimeout(() => {
        heroBg.style.background = `url(${imgPath + heroImages[selectedImg]})`;
        heroBg.style.backgroundSize = `cover`;
    }, 800);
}

setInterval(changeBackground, 5000);




const topCategories = document.querySelector(".category-list");
const categories = JSON.parse(localStorage.getItem("categories")) || [];
topCategories.innerHTML = ""
if (categories.length > 6) {
    categories.slice(0, 6).forEach((category) => {
        topCategories.innerHTML += displayCategories(category)
    })
} else {
    categories.forEach((category) => {
        topCategories.innerHTML += displayCategories(category)
    })
}
function displayCategories(category) {
    return `<div class="category-item">
                <img src="${category.image}" alt="${category.name}">
                <span>${category.name}</span>
            </div>`
}
// show Top Products

const bestDealsProducts = document.querySelector(".best-deals-grid");
const products = JSON.parse(localStorage.getItem("products")) || [];
bestDealsProducts.innerHTML = ""
if (products.length > 8) {
    products.slice(3, 7).forEach((product) => {
        bestDealsProducts.innerHTML += displayProduct(product)
    })
} else {
    products.forEach((product) => {
        bestDealsProducts.innerHTML += displayProduct(product)
    })
}

function displayProduct(product) {
    return `<div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-card-image">
                <div class="product-card-content">
                    <div class="product-card-header">
                        <span class="brand-label">${product.category}</span>
                    </div>
                    <h4 class="product-card-title line_clamp1">${product.name}</h4>
                    <p class="product-card-desc line_clamp1">${product.description}</p>
                    <p class="product-price">$${product.price}</p>
                    <div class="product-card-footer">
                        <button class="product-btn-wishlist" onclick="addToWishlist(${product.id})" title="Add to Wishlist"><i class="bx bx-heart"></i></button>
                        <a href="../pages/singleproduct.html?id=${product.id}" class="product-btn" title="View Product Details">View Details</a>
                    </div>
                </div>
            </div>`
}


// =================== Add to Wishlist ===================
let productsWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(productId) {
    let selectedProduct;
    if (products.find((el) => el.id === productId)) {
        products.find((el) => {
            if (el.id === productId) {
                selectedProduct = el;
            }
        })
    }
    // Check Product already Exist in wishlist
    if (productsWishlist.find((el) => el.id == selectedProduct.id)) {
        showToast("Product Already added in wishlist 🤷‍♂️", "error");
        return;
    } else {
        productsWishlist.push(selectedProduct);
        localStorage.setItem('wishlist', JSON.stringify(productsWishlist))
        showToast("Product added to wishlist ❤");
    }
}

/*--------------- Update Number of Items in Cart for Navbar --------------------- */
function updateCartNavCount() {
    // Update Navbar Cart total items
    const cart = JSON.parse(localStorage.getItem("cart"));
    const navCartCount = document.querySelector(".nav-cart-count");
    if (!cart) return;
    navCartCount.innerText = cart.reduce((ele, item) => ele + item.quantity, 0);
}
updateCartNavCount()

/*--------------- SHOW TOAST NOTIFICATION --------------------- */
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
