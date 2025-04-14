import { showToast, updateCartNavCount, addToWishlist, displayProduct, products } from "./utils.js";


document.addEventListener("DOMContentLoaded", () => {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        showToast("Product ID not found!", "error");
        return;
    }

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
            newQty = 1;
        } else if (newQty > product.stock) {
            newQty = product.stock;
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
                showToast(`Only ${product.stock - existingProduct.quantity} items available in stock!`, "error");
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


// update when page opens
updateCartNavCount()
