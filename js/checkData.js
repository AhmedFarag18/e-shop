/*---------------
SET Temp data to Localstorage
------------------ */
let fakeData = {
  products: [],
  categories: [],
};

function getProductsFake() {
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(products => {
      mapProducts(products);
    });
}

function getCategoriesFake() {
  fetch("https://fakestoreapi.com/products/categories")
    .then(res => res.json())
    .then(categories => {
      mapCategories(categories);
    });
}


function mapProducts(products) {
  products.map((product) => {
    fakeData.products.push({ name: product.title, stock: 15, image: product.image, category: product.category, description: product.description, id: product.id, image: product.image, price: product.price, rating: product.rating });
  })
  checkLocalStorage("products", fakeData.products);
}

function mapCategories(categories) {
  categories.map((category, index) => {
    fakeData.categories.push({
      id: 1743810065781 + index,
      image: `https://picsum.photos/id/${237 + index}/200/300`,
      name: category
    });
  })
  checkLocalStorage("categories", fakeData.categories);
}

function checkLocalStorage(itemName, data) {
  if (!localStorage.getItem(itemName)) {
    localStorage.setItem(itemName, JSON.stringify(data));
  }
}


async function init() {
  if (!localStorage.getItem("products") || !localStorage.getItem("categories")) {
    getProductsFake();
    getCategoriesFake();
  }
}
init()
