import { showToast, updateCartNavCount } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.querySelector(".cart-container");
    const orderSummary = document.querySelector(".order-summary")

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        cartContainer.innerHTML = "";

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            updateSummary();
            return;
        }

        cart.forEach((item, index) => {
            cartContainer.innerHTML += `
               <div class="cart-item">
                    <div class="cart_item_body">
                        <img class="item-image" src="${item.image}" alt="${item.name}" />
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <h6 class="item-price">$${item.price}</h6>
                        </div>
                    </div>
                    <div class="quantity-control">
                        <div class="pro-qty">
                            <span class="dec qtybtn" data-index="${index}">-</span>
                            <input type="text" value="${item.quantity}" data-index="${index}">
                            <span class="inc qtybtn" data-index="${index}">+</span>
                        </div>
                        <div class="delete-icon"  data-id="${item.id}">
                            <i class="bx bx-trash-alt"></i>
                        </div>
                    </div>
               </div>
            `;
        });

        attachEventListeners();
        updateSummary();
    }

    function attachEventListeners() {
        document.querySelectorAll(".inc.qtybtn").forEach(btn => {
            btn.addEventListener("click", (e) => updateQuantity(e, 1));
        });

        document.querySelectorAll(".dec.qtybtn").forEach(btn => {
            btn.addEventListener("click", (e) => updateQuantity(e, -1));
        });

        document.querySelectorAll(".pro-qty input").forEach(input => {
            input.addEventListener("input", handleInput);
        });

        document.querySelectorAll(".delete-icon").forEach(btn => {
            btn.addEventListener("click", removeItem);
        });
    }

    function updateQuantity(event, change) {
        let index = event.target.getAttribute("data-index");
        let newQty = cart[index].quantity + change;

        if (newQty < 1) newQty = 1;
        if (newQty > cart[index].stock) {
            showToast(`Only ${cart[index].stock} available!`, "error");
            newQty = cart[index].stock;
        }

        cart[index].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }


    function handleInput(event) {
        let index = event.target.getAttribute("data-index");
        let value = parseInt(event.target.value, 10) || 1;
        event.target.value = event.target.value.replace(/\D/g, "");

        if (value < 1) {
            value = 1;
        } else if (value > cart[index].stock) {
            value = cart[index].stock;
            showToast(`Only ${cart[index].stock} available!`, "error");
        }

        event.target.value = value;
        cart[index].quantity = value;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateSummary();
    }


    function removeItem(event) {
        let productId = event.currentTarget.getAttribute("data-id");
        cart = cart.filter(item => item.id !== Number(productId));

        localStorage.setItem("cart", JSON.stringify(cart));
        showToast("Product Removed 😥!");
        renderCart();
    }

    /* ---------- update summary for anychanges in cart ----------*/
    let totalAmount
    function updateSummary() {
        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // update nav count if any change
        updateCartNavCount()

        let discount = subtotal * 0.2;
        let deliveryFee = cart.length > 0 ? 10 : 0;
        totalAmount = subtotal - discount + deliveryFee;


        orderSummary.innerHTML = `
            <h2>Order Summary</h2>
            <div class="summary-item"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="summary-item"><span>Discount (-20%)</span><span class="discount">-$${discount.toFixed(2)}</span></div>
            <div class="summary-item"><span>Delivery Fee</span><span>$${deliveryFee.toFixed(2)}</span></div>
            <div class="summary-item total"><span>Total</span><span>$${totalAmount.toFixed(2)}</span></div>
            `;
    }

    // impelemt checkout and place order
    const checkoutBtn = document.querySelector(".checkoutBtn");
    checkoutBtn.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let userId = localStorage.getItem("currentUser");
        if (!userId) {
            showToast("Please log in first!", "error");
            return;
        }

        if (cart.length === 0) {
            showToast("Your cart is empty!", "error");
            return;
        }

        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        let newOrder = {
            id: Date.now(),
            userId: userId,
            products: cart,
            status: "Pending",
            total: totalAmount.toFixed(2)
        };

        orders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.removeItem("cart");

        showToast("Order placed successfully!");
        window.location.href = "./orders.html";

    });

    renderCart();
    // update cart navbar when page opens
    updateCartNavCount()
});
