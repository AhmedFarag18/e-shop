# **E-Commerce Project**

This is a simple E-Commerce project built using HTML, CSS, and JavaScript. The project includes Admin and Customer functionalities with Local Storage or Firebase as the database.

## 📜 Features

### **Admin Panel**

- ✅ Full **CRUD** operations on **Products** (Add, Edit, Delete, Validate)
- ✅ Full **CRUD** operations on **Categories**
- ✅ **Confirm/Reject** customer orders
- ✅ View all orders

### **Customer Panel**

- 👀 **View Products** with filtering and sorting
- ❤️ **Wishlist** (Stored in Local Storage)
- 🛒 **Shopping Cart** (Add, Remove, Update Quantity)
- 📦 **Place Orders** (Orders stay pending until admin confirms/rejects)
- 🔄 **View Previous Orders**

## 🖥️ Page Details

### **1. Homepage (index.html) 🏠**

- 🔍 Displays products with search and filter functionality.

### **2. Login (login.html) 🔑**

- 🔐 Login form with validation.

### **3. Register (register.html) 📝**

- 🆕 Registration form with user type selection (Admin or Customer).

### **4. Admin Dashboard (admin.html) 🛠️**

- 📊 Manage products, categories, and orders.

### **5. Products Page (products.html) 🛍️**

- 🏷️ Shows all products with filtering options.

### **6. Product Details (product-details.html) 📄**

- 🖼️ Displays product info with Add to Cart/Wishlist buttons.

### **7. Shopping Cart (cart.html) 🛒**

- 🛍️ View, update, and proceed to checkout.

### **8. Wishlist (wishlist.html) ❤️**

- 📌 View and move items to cart.

### **9. Orders Page (orders.html) 📦**

- 👤 Customers: View past orders.
- 🛠️ Admin: Manage orders.

## 📊 Database (Local Storage or Firebase)

You can use **Local Storage** or **Firebase Realtime Database** to store:

- 👤 Users
- 🏷️ Products
- 📦 Orders
- ❤️ Wishlist

Example using Local Storage:

```js
localStorage.setItem('users', JSON.stringify(usersArray));
localStorage.setItem('products', JSON.stringify(productsArray));
```

## 🚀 Technology Stack

- 🎨 **HTML & CSS** (Styling and Layout)
- ⚡ **JavaScript** (Functionality and Data Handling)
- 🎭 **Boxicons** (Icons)
- 🗄️ **Local Storage** (Database Management)

Happy Coding! 🚀
