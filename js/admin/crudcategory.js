import { notAllowed, navSlide, showToast } from "../utils.js";

// check if Authorization and Redirect
notAllowed()

// Change Navbar in Mobile View and handle Menu Button when page load
window.addEventListener("DOMContentLoaded", () => navSlide());

// Select Elements
const addCategoryForm = document.getElementById("addCategoryForm");
const categoryNameInput = document.getElementById("categoryName");
const categoryImageInput = document.getElementById("categoryImage");
const categoryContainer = document.getElementById("categoryContainer");

// Popups & Buttons
const editPopup = document.getElementById("editPopup");
const deletePopup = document.getElementById("deletePopup");
const editCategoryName = document.getElementById("editCategoryName");
const editCategoryImage = document.getElementById("editCategoryImage");
const updateCategoryBtn = document.getElementById("updateCategoryBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let categories = JSON.parse(localStorage.getItem("categories")) || [];
let editCategoryId = null;
let deleteCategoryId = null;

// Function to Render Categories
function renderCategories() {
    categoryContainer.innerHTML = "";
    categories.forEach(category => {
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("category_card");
        categoryCard.innerHTML = `
            <div class="category_details">
                <img src="${category.image}" alt="${category.name}">
                <span>${category.name}</span>
            </div>
            <div class="category_actions">
                <button class="edit_btn" onclick="openEditCategoryPopup(${category.id})">Edit</button>
                <button class="delete_btn" onclick="openDeleteCategoryPopup(${category.id})">Delete</button>
            </div>
        `;
        categoryContainer.appendChild(categoryCard);
    });
}
// Validation Functions
function validateCategoryName(inputEl) {
    const errorSpan = inputEl.nextElementSibling;
    const name = inputEl.value.trim();
    if (name.length < 3) {
        errorSpan.textContent = "Category name must be at least 3 characters.";
        return false;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
        errorSpan.textContent = "Category name must contain only letters, numbers, and spaces.";
        return false;
    }
    errorSpan.textContent = "";
    return true;
}

function validateImage(inputEl) {
    const errorSpan = inputEl.nextElementSibling;
    const file = inputEl.files[0];

    if (!file) {
        errorSpan.textContent = "Please upload an image.";
        return false;
    } else if (file.size > 2 * 1024 * 1024) {
        errorSpan.textContent = "Image size must be less than 2MB.";
        return false;
    } else if (!/(\.jpg|\.jpeg|\.svg|\.png|\.gif)$/i.test(file.name)) {
        errorSpan.textContent = "Invalid image format. Only JPG, JPEG, PNG, SVG, and GIF files are allowed.";
        return false;
    }

    errorSpan.textContent = "";
    return true;
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


// Live validation on blur/change
categoryNameInput.addEventListener("keyup", () => validateCategoryName(categoryNameInput));
categoryImageInput.addEventListener("change", () => validateImage(categoryImageInput));

editCategoryName.addEventListener("keyup", () => validateCategoryName(editCategoryName));
editCategoryImage.addEventListener("change", () => validateImage(editCategoryImage));

// Add New Category
addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isNameValid = validateCategoryName(categoryNameInput);
    const isImageValid = validateImage(categoryImageInput);

    if (!isNameValid || !isImageValid) {
        showToast("Please fix form errors before submitting.", "error");
        return;
    }

    const file = categoryImageInput.files[0];
    try {
        const imageUrl = await handleImageUpload(file);
        const newCategory = {
            id: Date.now(),
            name: categoryNameInput.value.trim(),
            image: imageUrl
        };
        categories.push(newCategory);
        localStorage.setItem("categories", JSON.stringify(categories));
        addCategoryForm.reset();
        showToast("Nice You Add new Category 😎");
        renderCategories();
    } catch (error) {
        showToast(error, "error");
    }
});

// Open Edit Popup
function openEditCategoryPopup(id) {
    editCategoryId = id;
    const category = categories.find(c => c.id === id);
    editCategoryName.value = category.name;
    editPopup.style.display = "flex";
}

// Handle Update
updateCategoryBtn.addEventListener("click", async () => {
    const isNameValid = validateCategoryName(editCategoryName);
    const file = editCategoryImage.files[0];
    let isImageValid = true;

    if (file) {
        isImageValid = validateImage(editCategoryImage);
    }

    if (!isNameValid || !isImageValid) {
        showToast("Please fix form errors before updating.", "error");
        return;
    }

    const category = categories.find(c => c.id === editCategoryId);
    category.name = editCategoryName.value.trim();

    if (file) {
        try {
            category.image = await handleImageUpload(file);
        } catch (error) {
            showToast(error, "error");
            return;
        }
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    editPopup.style.display = "none";
    showToast("Category updated Successfully 🎉");
    renderCategories();
});

// Cancel Edit
cancelEditBtn.addEventListener("click", () => {
    editPopup.style.display = "none";
});

// Open Delete Popup
function openDeleteCategoryPopup(id) {
    deleteCategoryId = id;
    deletePopup.style.display = "flex";
}

// Confirm Delete
confirmDeleteBtn.addEventListener("click", () => {
    categories = categories.filter(c => c.id !== deleteCategoryId);
    localStorage.setItem("categories", JSON.stringify(categories));
    deletePopup.style.display = "none";
    showToast("Category Deleted 🤷‍♂️", "error")
    renderCategories();
});

// Cancel Delete
cancelDeleteBtn.addEventListener("click", () => {
    deletePopup.style.display = "none";
});

// Load Categories on Page Load
renderCategories();


window.openEditCategoryPopup = openEditCategoryPopup
window.openDeleteCategoryPopup = openDeleteCategoryPopup
