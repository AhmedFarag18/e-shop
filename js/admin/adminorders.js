// check if Authorization and Redirect
notAllowed()

document.addEventListener("DOMContentLoaded", () => {
    // Change Navbar in Mobile View and handle Menu Button when page load
    navSlide()

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
