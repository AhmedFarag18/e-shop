document.addEventListener("DOMContentLoaded", () => {
    const ordersContainer = document.querySelector(".admin_orders_list");
    const orderPopup = document.getElementById("orderPopup");
    const orderDetails = document.getElementById("orderDetails");
    let selectedOrderId = null;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    function displayOrders() {
        ordersContainer.innerHTML = "";

        if (orders.length === 0) {
            ordersContainer.innerHTML = "<p>No orders available.</p>";
            return;
        }

        orders.forEach(order => {
            let statusClass = getStatusClass(order.status);

            let orderHTML = `
                <div class="admin_orders_list_item ${statusClass}" onclick="openPopup(${order.id})">
                    <div class="admin_orders_list_item_right">
                        <div class="admin_orders_list_item_right_price">
                            <h3>Order ID: ${order.id}</h3>
                        </div>
                        <div class="admin_orders_list_item_right_status">
                            <h3>Status: ${order.status}</h3>
                        </div>
                        <div class="admin_orders_list_item_right_user">
                            <h3>User: ${JSON.parse(order.userId).username}</h3>
                        </div>
                    </div>
                </div>
            `;
            ordersContainer.innerHTML += orderHTML;
        });
    }

    window.openPopup = function (orderId) {
        let order = orders.find(o => o.id == orderId);
        if (!order) return;

        selectedOrderId = orderId;

        let productsHTML = order.products.map(product => `
            <div class="order-product">
                <img src="${product.image}" alt="product">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="line_clamp1">${product.description}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Quantity:</strong> ${product.quantity}</p>
                    <p><strong>Total:</strong> $${(product.price * product.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join("");


        let statusButtons = order.status == "Pending" ? `
        <button class="confirm-btn" onclick="updateOrderStatus('confirmed')">Confirm</button>
        <button class="reject-btn" onclick="updateOrderStatus('rejected')">Reject</button>
    ` : `<p class="status-message">This order is ${order.status}.</p>`;

        orderDetails.innerHTML = `
        <div class="order_details_info">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Status:</strong> <span class="order_status ${order.status == "Pending" ? "pending" : "confirm"}">${order.status}</span></p>
            <p><strong>User:</strong> ${JSON.parse(order.userId).username}</p>
            <p><strong>Total Price:</strong> ${order.total}</p>
        </div>
        <h3>Order Products</h3>
        <div class="order_details_products">
            ${productsHTML}
            </div>
        ${statusButtons}
    `;

        orderPopup.style.display = "block";
    };

    window.updateOrderStatus = function (status) {
        let orderIndex = orders.findIndex(o => o.id == selectedOrderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            localStorage.setItem("orders", JSON.stringify(orders));
            displayOrders();
            closePopup();
        }
    };

    window.closePopup = function () {
        orderPopup.style.display = "none";
    };

    function getStatusClass(status) {
        switch (status) {
            case "pending": return "pending-order";
            case "confirmed": return "confirmed-order";
            case "rejected": return "rejected-order";
            default: return "";
        }
    }
    displayOrders();
});



function navSlide() {
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

navSlide();




window.addEventListener("load", () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        if (currentUser.email !== "admin@admin.com") notAllowed()
    } else {
        notAllowed()
    }
})

function notAllowed() {
    showToast("You are Not allowed Admin to access this", "error");
    setTimeout(() => {
        window.location.href = "/index.html";
    }, 0);
}





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
