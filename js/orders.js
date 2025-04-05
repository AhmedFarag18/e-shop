document.addEventListener("DOMContentLoaded", () => {
    const ordersContainer = document.querySelector(".user_orders_list");
    const orderPopup = document.getElementById("orderPopup");
    const orderDetails = document.getElementById("orderDetails");

    let userId = localStorage.getItem("currentUser"); // Assume user is logged in
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Filter only orders for the current user
    let userOrders = orders.filter(order => order.userId === userId);

    function displayOrders() {
        ordersContainer.innerHTML = "";

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = "<p>No orders placed yet.</p>";
            return;
        }

        userOrders.forEach(order => {
            let orderHTML = `
                <div class="user_orders_list_item ${order.status == "Pending" ? "pending" : order.status == "confirmed" ? "confirm" : "reject"}" onclick="openPopup(${order.id})">
                    <div class="user_orders_list_item_right">
                        <div class="user_orders_list_item_right_price">
                            <h3>Order ID: ${order.id}</h3>
                        </div>
                        <div class="user_orders_list_item_right_status">
                            <h3>Status: <span class="order_status ${order.status == "Pending" ? "pending" : order.status == "confirmed" ? "confirm" : "reject"}">${order.status}</span></h3>
                        </div>
                        <div class="user_orders_list_item_right_user">
                            <h3>User: ${JSON.parse(order.userId).username}</h3>
                        </div>
                    </div>
                </div>
            `;
            ordersContainer.innerHTML += orderHTML;
        });
    }

    window.openPopup = function (orderId) {
        let order = userOrders.find(o => o.id == orderId);
        if (!order) return;

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

        orderDetails.innerHTML = `
            <div class="order_details_info">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Status:</strong> <span class="order_status ${order.status == "Pending" ? "pending" : order.status == "confirmed" ? "confirm" : "reject"}">${order.status}</span></p>
                <p><strong>User:</strong> ${JSON.parse(order.userId).username}</p>
                <p><strong>Total Price:</strong> ${order.total}</p>
            </div>
            <h3>Order Products</h3>
            <div class="order_details_products">
                ${productsHTML}
            </div>
        `;

        orderPopup.style.display = "block";
    };

    window.closePopup = function () {
        orderPopup.style.display = "none";
    };

    displayOrders();
});
