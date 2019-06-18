const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/cart", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// models

//// cart
const Cart = mongoose.model("Cart", {
  _id: String,
  userName: String,
  cart: []
});

//// user
const User = mongoose.model("User", { name: String, pass: Number });

//// product
const Product = mongoose.model("Product", {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true }
});

//// product in cart
const ProductInCart = Product.discriminator(
  "ProductInCart",
  new mongoose.Schema({
    _id: String,
    quantity: { type: Number },
    img: { type: String }
  })
);

// add products to cart
let addProductsToCart = async (userId, product, quantity) => {
  userCart = await Cart.findById(userId);
  let cartAr = await userCart.cart;

  let isProductExistInCart = await userCart.cart.filter(
    e => e._id == product._id
  );

  const productInCart = new ProductInCart({
    _id: product._id,
    name: product.name,
    price: product.price,
    quantity: quantity,
    img: product.img
  });

  if (isProductExistInCart.length !== 0) {
    cartAr
      .filter(prod => prod._id == product._id)
      .map(e => (e.quantity = e.quantity + 1 * quantity));
    await Cart.findByIdAndUpdate({ _id: userId }, { $set: { cart: cartAr } });
  } else {
    cartAr.push(productInCart);
    await Cart.findByIdAndUpdate({ _id: userId }, { $set: { cart: cartAr } });
  }
};

// clear cart
let removeAllFromCart = async userCart => {
  return await userCart.update({ cart: [] });
};

// remove product from cart by id
let removeProductFromCart = async (userCart, product) => {
  let id = String(product._id);
  return await userCart.update({ $pull: { cart: { _id: id } } });
};

// remove quantity of product
let removeQuantityOfProduct = async (userId, product, quantity) => {
  userCart = await Cart.findById(userId);
  let productId = String(product.id);

  let newQuantity = await userCart.cart
    .filter(prod => prod._id == product._id)
    .map(e => (e.quantity = e.quantity - Number(quantity)));

  console.log(Number(newQuantity));

  if (Number(newQuantity) < 0) {
    let msg = "wartość nie może być ujemna";
    console.log(msg);
    // throw error ?? lub przeslac res senda
  } else if (Number(newQuantity) === 0) {
    removeProductFromCart(userCart, product);
    // remove quantity of product
  } else {
    return await Cart.update(
      { _id: userId, "cart._id": productId },
      { $set: { "cart.$.quantity": Number(newQuantity) } }
    );
  }
};

//////utilities

// // display bill
let displayUserBill = userCart => {
  let bill = userCart.cart.map(product => {
    return ` ${product.name}: ${product.price} zł * ${
      product.quantity
      } szt = ${product.price * product.quantity}zł |`;
  });
  return bill;
};

// calculate payment
let calculatePayment = userCart => {
  let productPrice = userCart.cart.map(e => {
    return e.price * e.quantity;
  });
  return productPrice.reduce((partial_sum, a) => partial_sum + a, 0);
};

module.exports = {
  addProductsToCart,
  removeAllFromCart,
  removeProductFromCart,
  removeQuantityOfProduct,
  displayUserBill,
  calculatePayment,

  Product,
  Cart,
  User
};
