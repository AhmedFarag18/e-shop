document.addEventListener("DOMContentLoaded", () => {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        showToast("Product ID not found!", "error");
        return;
    }

    // Retrieve products from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Find the product with the matching ID
    const product = products.find(p => p.id == productId);

    if (!product) {
        showToast("Product not found!", "error");
        setTimeout(() => { window.location.href = "../pages/products.html"; }, 3000);
        return;
    }

    // Display Product Details Data
    const productImgBox = document.querySelector(".single_imgBox")
    productImgBox.innerHTML = `<img src="${product.image}" alt="${product.name}">
                                <div class="single_product_label">
                                    ${product.stock > 0 ? `In Stock` : "Out of Stock"}
                                </div>`;

    document.querySelector(".single_product_name").innerText = product.name
    document.querySelector(".single_product_price").innerText = `$${product.price}`
    document.querySelector(".single_product_description").innerText = product.description


    // Quantity Input Logic
    const qtyInput = document.querySelector(".pro-qty input");
    const decBtn = document.querySelector(".dec.qtybtn");
    const incBtn = document.querySelector(".inc.qtybtn");
    const addToCartBtn = document.querySelector(".add_to_cart_btn");
    const addToWishlistBtn = document.querySelector(".wishlist_btn");

    qtyInput.value = 1; // Default quantity

    // Function to update quantity with validation
    function updateQuantity(change) {
        let currentQty = parseInt(qtyInput.value, 10) || 1;
        let newQty = currentQty + change;

        if (newQty < 1) {
            newQty = 1; // Prevent going below 1
        } else if (newQty > product.stock) {
            newQty = product.stock; // Prevent exceeding stock
            showToast(`Only ${product.stock} items available in stock!`, "error");
        }

        qtyInput.value = newQty;
    }

    // Increment button click
    incBtn.addEventListener("click", () => updateQuantity(1));

    // Decrement button click
    decBtn.addEventListener("click", () => updateQuantity(-1));

    // Prevent non-numeric input
    qtyInput.addEventListener("input", () => {
        qtyInput.value = qtyInput.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (qtyInput.value > product.stock) {
            qtyInput.value = product.stock;
        }
        if (qtyInput.value < 1) {
            qtyInput.value = 1;
        }
    });

    // Add to Cart Functionality
    addToCartBtn.addEventListener("click", () => {
        let selectedQuantity = parseInt(qtyInput.value, 10);

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existingProduct = cart.find(item => item.id == product.id);

        if (existingProduct) {
            // Check if adding more exceeds stock
            if (existingProduct.quantity + selectedQuantity > product.stock) {
                showToast(`You can only add ${product.stock - existingProduct.quantity} more!`);
                return;
            }
            existingProduct.quantity += selectedQuantity;
        } else {
            cart.push({ ...product, quantity: selectedQuantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        showToast("Product added to cart!");
        updateCartNavCount()
    });

    addToWishlistBtn.addEventListener("click", () => addToWishlist(productId));

    // Go back to the previous page
    document.querySelector(".return_btn button").addEventListener("click", () => {
        window.history.back();
    });
});





// show Top Products

const bestDealsProducts = document.querySelector(".best-deals-grid");
const products = JSON.parse(localStorage.getItem("products")) || [];
bestDealsProducts.innerHTML = ""
if (products.length > 10) {
    let shuffledProducts = products.sort(() => Math.random() - 0.5);
    let randomCount = Math.floor(Math.random() * 10) + 1;
    let selectedProducts = shuffledProducts.slice(0, randomCount);
    selectedProducts.forEach((product) => {
        bestDealsProducts.innerHTML += displayProduct(product);
    });
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
           <a href="#" class="product-btn-wishlist" title="Add to Wishlist"><i class="bx bx-heart"></i></a>
           <a href="../pages/singleproduct.html?id=${product.id}" class="product-btn" title="View Product Details">View Details</a>
       </div>
   </div>
</div>`
}



// =================== Add to Wishlist ===================
let productsWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function addToWishlist(productId) {
    console.log("Product ID received:", productId); // Debugging line
    console.log("Products in LocalStorage:", products); // Debugging line

    // Get the selected product using `.filter()`
    let selectedProductArray = products.filter(el => String(el.id) === String(productId));

    if (selectedProductArray.length === 0) {
        showToast("Product not found!", "error");
        return;
    }
    console.log(new URLSearchParams(window.location.search).get("id"), "swj");

    let selectedProduct = selectedProductArray[0]; // Get the first matching product
    console.log("Selected Product:", selectedProduct); // Debugging line

    // Check if the product is already in wishlist using `.some()`
    if (productsWishlist.some(el => String(el.id) === String(productId))) {
        showToast("Product Already added in wishlist 🤷‍♂️", "error");
        return;
    }

    productsWishlist.push(selectedProduct);
    localStorage.setItem("wishlist", JSON.stringify(productsWishlist));
    showToast("Product added to wishlist ❤");
}



function updateCartNavCount() {
    // Update Navbar Cart total items
    const cart = JSON.parse(localStorage.getItem("cart"));
    const navCartCount = document.querySelector(".nav-cart-count");
    if (!cart) return;
    navCartCount.innerText = cart.reduce((ele, item) => ele + item.quantity, 0);
}
// update when page opens
updateCartNavCount()

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
