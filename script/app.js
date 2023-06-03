let sectionLinks = document.querySelectorAll(".go-to-section");
let canvasDOM = document.getElementById("offcanvasNavbar");
let cartDOM = document.querySelector("#cart");
let openCart = document.querySelector("#open-cart");
let closeCart = document.querySelector("#close-cart");
let cartContent = document.querySelector(".cart-content");
let cartTotal = document.querySelector(".total-price");
let notification = document.querySelector("#notification");
let buyBtn = document.querySelector(".btn-buy");

let cart = [];
let buttonsDOM = [];

// Getting the products
class Products {
  getProducts() {
    try {
      let itemsDOM = document.querySelectorAll(".product-box");
      let products = [...itemsDOM].map((item, index) => {
        let title = item.querySelector(".product-title").innerText;
        let price = item.querySelector(".price").innerText;
        let image = item.querySelector(".product-img").src;
        let id = item.querySelector(".add-cart").dataset.id;

        return {title, price, image, id};
      });
      return products;

    } catch (error) {
      console.log(error);
    }
  }
}

// Cart products
class UI {
  getAddToCartBtns() {
    const buttons = [...document.querySelectorAll(".add-cart")];
    buttonsDOM = buttons;

    buttons.forEach((btn) => {
      let id = btn.dataset.id;
      let inCart = cart.find((item) => item.id == id);

      if (inCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;

      } else {
        btn.addEventListener("click", (event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          // Get product from products
          let cartItem = { ...Storage.getProduct(id), qty: 1 };
          // Add product to the cart
          cart = [...cart, cartItem];
          // Save cart in local storage
          Storage.saveCart(cart);
          // Update cart total
          this.setCartValues(cart);
          // Display cart item
          this.addCartItem(cartItem);
          // Show the cart
          this.showCart();
        });
      }
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
        tempTotal += parseInt(item.price.slice(1)) * item.qty;
        itemsTotal += item.qty;
    });
    cartTotal.innerText = `$${tempTotal}`;
    notification.innerText = itemsTotal;
    notification.classList.add("active");
  }

  addCartItem(item) {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
    <img src=${item.image} class="cart-img">
    <div class="detail-box">
      <div class="cart-product-title">${item.title}</div>
      <div class="cart-price">${item.price}</div>
      <div class="quantity">
          <i class="bx bx-minus minus-item" data-id=${item.id}></i>
          <p class="product-qty">${item.qty}</p>
          <i class="bx bx-plus plus-item" data-id=${item.id}></i>
      </div>
    </div>
    <i class="bx bxs-trash cart-remove" data-id=${item.id}></i>
`;
    cartContent.appendChild(cartBox);
  }

  showCart() {
    cartDOM.classList.add("active");
    canvasDOM.classList.remove("show");
  }

  hideCart() {
    cartDOM.classList.remove("active");
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id != id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = buttonsDOM[id];
    button.disabled = false;
    button.innerHTML = "Add to Cart";
    this.removeNotification();
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

  removeNotification() {
    if (!cart.length) {
      notification.classList.remove("active");
      notification.innerHTML = null;
      this.hideCart();
    }
  }

  cartLogic() {
    // Clear cart => buy items
    buyBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // Cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart-remove")) {
        let removeItem = event.target;
        let removeItemId = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement);
        this.removeItem(removeItemId);
      } else if (event.target.classList.contains("plus-item")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let item = cart.find((item) => item.id == id);
        item.qty += 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.previousElementSibling.innerText = item.qty;
      } else if (event.target.classList.contains("minus-item")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let item = cart.find((item) => item.id == id);
        item.qty -= 1;

        if (item.qty > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.nextElementSibling.innerText = item.qty;
        } else {
          cartContent.removeChild(
            lowerAmount.parentElement.parentElement.parentElement
          );
          this.removeItem(id);
        }
      }
    });
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    this.removeNotification();
    openCart.addEventListener("click", this.showCart);
    closeCart.addEventListener("click", this.hideCart);
  }
}

// Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}


// Loading website
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  // get all products
  const products = new Products().getProducts();
  // setup app
  ui.setupApp();
  Storage.saveProducts(products);
  ui.getAddToCartBtns();
  ui.cartLogic();
});



// Go to sections in tablet/phone mode
sectionLinks.forEach((el) => {
  el.addEventListener("click", function() {
    canvasDOM.classList.remove("show");
    cartDOM.classList.remove("active");
  });
});