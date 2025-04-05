// Select Elements
const addProductForm = document.getElementById("addproductForm");
const productNameInput = document.getElementById("productName");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const stockQuantityInput = document.getElementById("stockQuantity");
const productImageInput = document.getElementById("productImage");
const productContainer = document.getElementById("ProductContainer");

// Select Edit Elements
const editAddProductForm = document.getElementById("editproductForm");
const editProductNameInput = document.getElementById("editProductName");
const editDescriptionInput = document.getElementById("editDescription");
const editPriceInput = document.getElementById("editPrice");
const editCategoryInput = document.getElementById("editCategory");
const editStockQuantityInput = document.getElementById("editStockQuantity");
const editProductImageInput = document.getElementById("editProductImage");

// Popups & Buttons
const editPopup = document.getElementById("editPopup");
const deletePopup = document.getElementById("deletePopup");
const updateProductBtn = document.getElementById("updateProductBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let products = JSON.parse(localStorage.getItem("products")) || [];
let editProductId = null;
let deleteProductId = null;

// Function to Render Products
function renderProducts() {
    productContainer.innerHTML = "";
    products.forEach(product => {
        productContainer.innerHTML += `
        <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-card-image">
                <div class="product-card-content">
                    <div class="product-card-header">
                        <span class="brand-label">${product.category}</span>
                    </div>
                    <h4 class="product-card-title line_clamp1">${product.name}</h4>
                    <p class="product-card-desc line_clamp1">${product.description}</p>
                    <p class="product-price">$${product.price}</p>
                    <div class="product_actions">
                        <button class="edit_btn" onclick="openEditPopup(${product.id})">Edit</button>
                        <button class="delete_btn" onclick="openDeletePopup(${product.id})">Delete</button>
                    </div>
                </div>
            </div>
        `
    });
}

// Handle Image Upload
const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("Please upload an image.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => reject("Error reading file.");
        reader.readAsDataURL(file);
    });
};

// Add New Product
addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = productImageInput.files[0];
    try {
        const imageUrl = await handleImageUpload(file);
        const newProduct = {
            id: Date.now(),
            name: productNameInput.value.trim(),
            description: descriptionInput.value.trim(),
            price: parseFloat(priceInput.value.trim()),
            category: categoryInput.value.trim(),
            stockQuantity: parseInt(stockQuantityInput.value.trim()),
            image: imageUrl
        };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        addProductForm.reset();
        showToast("Product Added Successfully 🎉");
        renderProducts();
    } catch (error) {
        showToast(error, "error");
    }
});

// Open Edit Popup
function openEditPopup(id) {
    editProductId = id;
    const product = products.find(p => p.id === id);
    editProductNameInput.value = product.name;
    editDescriptionInput.value = product.description;
    editPriceInput.value = product.price;
    editCategoryInput.value = product.category;
    editStockQuantityInput.value = product.stock;
    editPopup.style.display = "flex";
}

// Handle Update
updateProductBtn.addEventListener("click", async () => {
    const product = products.find(p => p.id === editProductId);
    product.name = editProductNameInput.value.trim();
    product.description = editDescriptionInput.value.trim();
    product.price = parseFloat(editPriceInput.value.trim());
    product.category = editCategoryInput.value.trim();
    product.stock = parseInt(editStockQuantityInput.value.trim());

    if (editProductImageInput.files[0]) {
        try {
            product.image = await handleImageUpload(editProductImageInput.files[0]);
        } catch (error) {
            alert(error);
            return;
        }
    }

    localStorage.setItem("products", JSON.stringify(products));
    editPopup.style.display = "none";
    showToast("Product Updated Successfully 😍🎉");
    renderProducts();
});
// Hide edit popup
cancelEditBtn.addEventListener("click", () => {
    editPopup.style.display = "none";
});
// Open Delete Popup
function openDeletePopup(id) {
    deleteProductId = id;
    deletePopup.style.display = "flex";
}

// Confirm Delete
confirmDeleteBtn.addEventListener("click", () => {
    products = products.filter(p => p.id !== deleteProductId);
    localStorage.setItem("products", JSON.stringify(products));
    deletePopup.style.display = "none";
    showToast("Product Deleted 🤷‍♂️", "error");
    renderProducts();
});

// Cancel Delete
cancelDeleteBtn.addEventListener("click", () => {
    deletePopup.style.display = "none";
});

// Load Products on Page Load
renderProducts();

function showToast(message, status) {
    const toast = document.querySelector(".toast");
    if (!toast) return console.error("Toast element not found!");

    toast.innerText = message;
    toast.className = `toast show ${status === "error" ? "error" : ""}`;
    toast.style.display = "flex";

    setTimeout(() => {
        toast.classList.remove("show");
        toast.style.display = "none";
    }, 3000);
}




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
