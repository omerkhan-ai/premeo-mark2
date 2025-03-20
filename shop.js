document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to update cart count
    function updateCartUI() {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            let totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalQuantity;
        }
        renderCartItems();
    }

    // Function to render cart dropdown items
    function renderCartItems() {
        const cartDropdown = document.getElementById("cart-dropdown");
        if (cartDropdown) {
            cartDropdown.innerHTML = "<h3>Your Cart</h3>" +
                cart.map((item, index) => {
                    let quantity = item.quantity ? item.quantity : 1;
                    let price = item.price ? (item.price * quantity).toFixed(2) : "0.00";
                    return `
                    <div class='cart-item'>
                        <img src='${item.image}' width='50'>
                        <p>${item.name} - $${price} (x${quantity})</p>
                        <button class='remove-item' data-index='${index}'>Remove</button>
                    </div>`;
                }).join("") +
                "<button id='checkout-btn'>Checkout</button>";
            
            document.querySelectorAll(".remove-item").forEach(button => {
                button.addEventListener("click", function () {
                    const index = this.getAttribute("data-index");
                    cart.splice(index, 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartUI();
                });
            });

            document.getElementById("checkout-btn").addEventListener("click", function () {
                window.location.href = "checkout.html";
            });
        }
    }

    // Add to Cart Functionality
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productCard = this.closest(".product-card");
            const productName = productCard.querySelector("h2").textContent;
            const productPriceElement = productCard.querySelector(".price");
            const productImage = productCard.querySelector("img").src;
            
            if (!productPriceElement) {
                alert("Error: Product price missing.");
                return;
            }
            
            const productPrice = parseFloat(productPriceElement.textContent.replace("$", "")) || 0;
            
            if (productPrice === 0) {
                alert("Error: Invalid product price.");
                return;
            }

            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity = (existingProduct.quantity || 1) + 1;
            } else {
                cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
            }
            
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartUI();
            alert(`${productName} added to cart!`);
        });
    });

    // Floating Cart Icon
    const cartIcon = document.createElement("div");
    cartIcon.id = "cart-icon";
    cartIcon.innerHTML = "🛒 <span id='cart-count'>0</span>";
    cartIcon.style.position = "fixed";
    cartIcon.style.top = "20px";
    cartIcon.style.right = "20px";
    cartIcon.style.background = "#00FFFF";
    cartIcon.style.color = "black";
    cartIcon.style.padding = "12px 15px";
    cartIcon.style.borderRadius = "8px";
    cartIcon.style.cursor = "pointer";
    cartIcon.style.fontSize = "1.5rem";
    cartIcon.style.boxShadow = "0 4px 10px rgba(0, 255, 255, 0.4)";
    cartIcon.style.transition = "transform 0.3s ease";
    document.body.appendChild(cartIcon);
    cartIcon.addEventListener("mouseover", function () {
        cartIcon.style.transform = "scale(1.1)";
    });
    cartIcon.addEventListener("mouseout", function () {
        cartIcon.style.transform = "scale(1)";
    });
    cartIcon.addEventListener("click", function () {
        const cartDropdown = document.getElementById("cart-dropdown");
        cartDropdown.style.display = cartDropdown.style.display === "none" ? "block" : "none";
        renderCartItems();
    });

    // Cart Dropdown Container
    const cartDropdown = document.createElement("div");
    cartDropdown.id = "cart-dropdown";
    cartDropdown.style.display = "none";
    document.body.appendChild(cartDropdown);

    // Ensure UI updates on page load
    updateCartUI();
});