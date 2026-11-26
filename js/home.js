import { updateCartNavCount, displayProduct, basePath, products, initProductEvents } from './utils.js';

const imgPath = basePath + "images/home/banner/";
const heroImages = ["banner-02.jpg", "banner-03.png", "banner-04.jpg", "banner-05.jpg"];
let heroBg = document.querySelector(".hero");
let lastIndex = -1;

function changeBackground() {
    let selectedImg;

    do {
        selectedImg = Math.floor(Math.random() * heroImages.length);
    } while (selectedImg === lastIndex);

    lastIndex = selectedImg;

    setTimeout(() => {
        heroBg.style.background = `url(${imgPath + heroImages[selectedImg]})`;
        heroBg.style.backgroundSize = `cover`;
    }, 800);
}

setInterval(changeBackground, 5000);




const topCategories = document.querySelector(".category-list");
const categories = JSON.parse(localStorage.getItem("categories")) || [];
topCategories.innerHTML = ""
if (categories.length > 6) {
    categories.slice(0, 6).forEach((category) => {
        topCategories.innerHTML += displayCategories(category)
    })
} else {
    categories.forEach((category) => {
        topCategories.innerHTML += displayCategories(category)
    })
}
function displayCategories(category) {
    return `<div class="category-item">
                <img src="${category.image}" alt="${category.name}">
                <span>${category.name}</span>
            </div>`
}
// show Top Products

const bestDealsProducts = document.querySelector(".best-deals-grid");

bestDealsProducts.innerHTML = ""
if (products.length > 8) {
    products.slice(3, 7).forEach((product) => {
        bestDealsProducts.innerHTML += displayProduct(product)
    })
} else {
    products.forEach((product) => {
        bestDealsProducts.innerHTML += displayProduct(product)
    })
}

// update cart navbar when page opens
updateCartNavCount()


// initialize Product Events
initProductEvents(bestDealsProducts);

/* Product Search */
const searchInput = document.querySelector("#product-search-input");
const clearSearchBtn = document.querySelector("#clear-search");
const searchMessage = document.querySelector("#search-results-message");

if (searchInput && clearSearchBtn && searchMessage) {

    function searchProducts() {
        const searchValue = searchInput.value.trim().toLowerCase();

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchValue)
        );

        bestDealsProducts.innerHTML = "";

        filteredProducts.forEach(product => {
            bestDealsProducts.innerHTML += displayProduct(product);
        });

        searchMessage.textContent = filteredProducts.length
            ? `${filteredProducts.length} product(s) found`
            : "No products found";

        initProductEvents(bestDealsProducts);
    }

    searchInput.addEventListener("input", searchProducts);

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchProducts();
    });
}

