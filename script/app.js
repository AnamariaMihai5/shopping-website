let canvas = document.getElementById("offcanvasNavbar");
let cart = document.querySelector("#cart");
let openCart = document.querySelector("#open-cart");
let closeCart = document.querySelector("#close-cart");
let addCart = document.querySelectorAll(".add-cart");
let cartContent = document.querySelector(".cart-content");
let totalPrice = document.querySelector(".total-price");
let BuyBtn = document.querySelector(".btn-buy");

let cartBoxes, removeCartBtns, priceInputs, quantityInputs;

let cartBox;
let total;
let cartItemsNames;


openCart.addEventListener("click", () => {
    cart.classList.add("active");
    canvas.classList.remove("show");   
})

closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
    canvas.classList.add("show");   
})

addCart.forEach(element => {
    element.addEventListener("click", addItemToCart);
});


cart.addEventListener("mouseup", updatePrice);

BuyBtn.addEventListener("click", buyItems);


function addItemToCart(event) {
    // create cart element
    let btn = event.target;
    let itemBox = btn.parentElement.parentElement;

    let img = itemBox.querySelector(".product-img").src;
    let title = itemBox.querySelector(".product-title").innerText;
    let price = itemBox.querySelector(".price").innerText;

    cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    let cartBoxContent = `
        <img src="${img}" class="cart-img">
        <div class="detail-box">
          <div class="cart-product-title">${title}</div>
          <div class="cart-price">${price}</div>
          <input type="number" value="1" class="cart-quantity" min="1" max="10">
        </div>
        <i class="bx bxs-trash-alt cart-remove"></i>
    `
    cartBox.innerHTML = cartBoxContent;
    cartBoxes = document.querySelectorAll(".cart-box");   

    if (cartBoxes.length <= 0) {
        cartItemsNames = [];
        cartContent.appendChild(cartBox);
        cartItemsNames.push(title);
    } else {
        if (!cartItemsNames.includes(title)) {
            cartContent.appendChild(cartBox);
            cartItemsNames.push(title);
        } else {
            alert("Item is already in your cart");
        }
    }

    // create remove buttons
    removeCartBtns = document.querySelectorAll(".cart-remove");
    removeCartBtns.forEach((element) => {
        element.addEventListener("click", removeItemFromCart);
    });

    updatePrice();
}


function removeItemFromCart(event) {
    let btn = event.target;
    btn.parentElement.remove();
    // update price
    let deletedProdPrice = parseInt(((btn.parentElement.querySelector(".cart-price")).innerText).slice(1));
    total -= deletedProdPrice;
    totalPrice.innerHTML = `$${total}`;
    // update cart
    cartItemsNames = Object.values(cartItemsNames);
    let deletedProdName = btn.parentElement.querySelector(".cart-product-title").innerText;
    let deletedProdIndex = cartItemsNames.indexOf(deletedProdName);
    cartItemsNames.splice(deletedProdIndex, 1)
}


function updatePrice() {
  total = 0;
  cartBoxes = document.querySelectorAll(".cart-box");   

  cartBoxes.forEach((element) => {
    let itemPrice = element.querySelector(".cart-price").innerText;
    let priceNr = parseInt(itemPrice.slice(1));
    let qty = element.querySelector(".cart-quantity").value;

    total = total + (priceNr * qty);
  });

  totalPrice.innerHTML = `$${total}`;
}


function buyItems() {
    if (cartBoxes.length < 1) {
        alert("Here is the big nothing you bought!");
    } else {
        alert("Your order was placed succesfully!");
        cartContent.innerHTML = null;
        total = 0;
    }
    
    updatePrice();
    cart.classList.remove("active");
    canvas.classList.remove("show"); 
}