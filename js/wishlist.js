document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.querySelector(".best-deals-grid");


    // =================== Wishlist Page ===================
    let productsWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    function renderWishlist() {
        wishlistContainer.innerHTML = ""; // Clear wishlist before rendering

        if (productsWishlist.length === 0) {
            wishlistContainer.classList.add("empty");
            wishlistContainer.innerHTML = `<p class="wishlist_empty">Your Wishlist is empty.</p>`;
            return;
        }
        wishlistContainer.classList.remove("empty");

        productsWishlist.forEach((product) => {
            wishlistContainer.innerHTML += `
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
                            <button class="product-btn remove-btn" data-id="${product.id}" title="Remove from Wishlist">
                                Remove <i class="bx bx-trash"></i>
                            </button>
                            <a href="../pages/singleproduct.html?id=${product.id}" class="product-btn show_details" title="View Product Details">
                                <i class="bx bx-right-arrow-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
        });

        // Attach event listeners to all remove buttons
        document.querySelectorAll(".remove-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                removeFromWishlist(this.getAttribute("data-id"));
            });
        });
    }
    renderWishlist();

    function removeFromWishlist(productId) {
        productsWishlist = productsWishlist.filter(item => item.id !== Number(productId));
        localStorage.setItem("wishlist", JSON.stringify(productsWishlist));

        showToast("Removed from Wishlist 😢!");
        renderWishlist()
    }
    updateCartNavCount()
});



// Update Navbar Cart total items
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