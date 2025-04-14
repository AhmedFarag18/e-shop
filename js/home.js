import { updateCartNavCount, displayProduct, basePath, addToCart, addToWishlist, products, initProductEvents } from './utils.js';

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
