import { displayProduct, showToast, updateCartNavCount } from "./utils.js";

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
            wishlistContainer.innerHTML += displayProduct(product, true);
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
