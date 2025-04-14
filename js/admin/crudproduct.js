import { notAllowed, navSlide, showToast, products } from "../utils.js";


// Change Navbar in Mobile View and handle Menu Button when page load
window.addEventListener("DOMContentLoaded", () => navSlide());

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
const addPopup = document.getElementById("addPopup");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const editPopup = document.getElementById("editPopup");
const deletePopup = document.getElementById("deletePopup");
const updateProductBtn = document.getElementById("updateProductBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let editProductId = null;
let deleteProductId = null;

// check if Authorization and Redirect
notAllowed()

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
// ===== Validation Helper Functions ===== //
function showError(input, message) {
    const errorSpan = input.closest(".form_group").querySelector(".error_message");
    errorSpan.textContent = message;
    input.classList.add("error");
}

function clearError(input) {
    const errorSpan = input.closest(".form_group").querySelector(".error_message");
    errorSpan.textContent = "";
    input.classList.remove("error");
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;

    if (!value) {
        showError(input, "This field is required");
        isValid = false;
    } else if (input.id === "price" && isNaN(parseFloat(value))) {
        showError(input, "Please enter a valid price");
        isValid = false;
    } else if (input.id === "stockQuantity" && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
        showError(input, "Please enter a valid stock quantity");
        isValid = false;
    } else if (input.type === "file" && input.files.length === 0) {
        showError(input, "Please upload an image");
        isValid = false;
    } else {
        clearError(input);
    }

    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll(".form_input");
    let formIsValid = true;
    inputs.forEach((input) => {
        if (!validateInput(input)) formIsValid = false;
    });
    return formIsValid;
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


const formInputs = document.querySelectorAll("#addproductForm .form_input");
formInputs.forEach((input) => {
    input.addEventListener("blur", () => {
        validateInput(input);
    });
});

function openAddPopup() {
    addPopup.style.display = "flex";
}
// Add New Product
addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm(addProductForm)) {
        showToast("Please fix the errors in the form.", "error");
        return;
    }

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
    editStockQuantityInput.value = Number(product.stock);
    editPopup.style.display = "flex";
}

// ===== Edit Product Form Validation ===== //

const editFormInputs = document.querySelectorAll("#editproductForm .form_input");

editFormInputs.forEach((input) => {
    input.addEventListener("blur", () => {
        validateInput(input);
    });
});

updateProductBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!validateForm(editAddProductForm)) {
        showToast("Please fix the errors in the form.", "error");
        return;
    }

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
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editPopup.style.display = "none";
});
cancelAddBtn.addEventListener("click", () => {
    addPopup.style.display = "none";
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


// make add , edit , delete to with window to can use it
window.openAddPopup = openAddPopup;
window.openEditPopup = openEditPopup;
window.openDeletePopup = openDeletePopup;
