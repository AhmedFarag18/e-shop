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
                <button class="edit_btn" onclick="openEditPopup(${category.id})">Edit</button>
                <button class="delete_btn" onclick="openDeletePopup(${category.id})">Delete</button>
            </div>
        `;
        categoryContainer.appendChild(categoryCard);
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

// Add New Category
addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (categoryNameInput.value.trim().length < 3) {
        showToast("Category name must be at least 3 characters", "error");
        return;
    }

    const file = categoryImageInput.files[0];
    try {
        const imageUrl = await handleImageUpload(file);
        const newCategory = { id: Date.now(), name: categoryNameInput.value.trim(), image: imageUrl };
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
function openEditPopup(id) {
    editCategoryId = id;
    const category = categories.find(c => c.id === id);
    editCategoryName.value = category.name;
    editPopup.style.display = "flex";
}

// Handle Update
updateCategoryBtn.addEventListener("click", async () => {
    const category = categories.find(c => c.id === editCategoryId);
    category.name = editCategoryName.value.trim();

    if (editCategoryImage.files[0]) {
        try {
            category.image = await handleImageUpload(editCategoryImage.files[0]);
        } catch (error) {
            alert(error);
            return;
        }
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    editPopup.style.display = "none";
    showToast("Category updated Successfully 🎉")
    renderCategories();
});

// Cancel Edit
cancelEditBtn.addEventListener("click", () => {
    editPopup.style.display = "none";
});

// Open Delete Popup
function openDeletePopup(id) {
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


// check if it's not admin or not signed in
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
