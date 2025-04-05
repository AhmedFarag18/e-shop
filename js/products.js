let selectedIcon = document.querySelector(".filter_select_box .selected i.bx");
let selectedText = document.querySelector(".filter_select_box .selected span");
let selectBox = document.querySelector("#filter_box");
let selectElements = document.querySelectorAll(".filter_box_item");
let selected = document.querySelector(".filter_select_box");

/* -------------- Toggle Select Box of Categories  ------------------- */
selected.addEventListener("click", function () {
    if (!selectBox.classList.contains("show")) {
        selectedIcon.classList.remove("bx-caret-right");
        selectedIcon.classList.add("bx-caret-down");
        selectBox.classList.add("show");
    } else {
        selectedIcon.classList.add("bx-caret-right");
        selectedIcon.classList.remove("bx-caret-down");
        selectBox.classList.remove("show");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Update Navbar Cart total items when load 
    updateCartNavCount()
});


// Select elements
const productsContainer = document.querySelector(".all_products_items");
const searchInput = document.getElementById("search");
const filterBox = document.getElementById("filter_box");

// Get products & categories from localStorage
const products = JSON.parse(localStorage.getItem("products")) || [];
const categories = JSON.parse(localStorage.getItem("categories")) || []; // Extract unique categories

// Function to display products
const displayProducts = (filteredProducts) => {
    productsContainer.innerHTML = ""; // Clear existing products

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    filteredProducts.forEach(product => {
        const productHTML = `
            <div class="product-card">
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
                        <a href="./singleproduct.html?id=${product.id}" class="product-btn" title="View Product Details">View Details</a>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });
};

// Function to load categories dynamically
const loadCategories = () => {
    filterBox.innerHTML = ""; // Clear existing categories
    categories.forEach(category => {
        const categoryItem = document.createElement("li");
        categoryItem.classList.add("filter_box_item");
        categoryItem.textContent = category.name;
        categoryItem.addEventListener("click", () => {
            const filteredProducts = products.filter(product => product.category === category.name);
            displayProducts(filteredProducts);
        });
        filterBox.appendChild(categoryItem);
    });
};

// Initial display
displayProducts(products);
// Load categories dynamically
loadCategories();


// Search functionality
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});


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



function updateCartNavCount() {
    // Update Navbar Cart total items
    const cart = JSON.parse(localStorage.getItem("cart"));
    const navCartCount = document.querySelector(".nav-cart-count");
    if (!cart) return;
    navCartCount.innerText = cart.reduce((ele, item) => ele + item.quantity, 0);
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
