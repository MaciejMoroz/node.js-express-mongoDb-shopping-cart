// mongose

const Cart = mongoose.model("Cart", { userName: String, cart: [], payment: 0 });
const User = mongoose.model("User", { name: String, pass: Number });
const Product = mongoose.model("Product", { name: String, price: Number });

// weksportowac do innego pliku task.model.js

// (async () => {
//   // const user = new User({ name: "Jan", pass: 1 });
//   // const user = new User({ name: "Asia", pass: 2 });
//   // const user = new User({ name: "Paweł", pass: 3 });
//   // const user = new User({ name: "Adam", pass: 4 });

//   await user.save();
//   console.log(user);
//   console.log(await User.find());

//   // update
//   const lastUser = await user.findById("5cd6def27dbfe11a9446ab68,");
//   lastUser.label = "ala ma kota";
//   await lastUser.save();
//   console.log * lastUser;

//   mongoose.connection.close();
// })();

(async () => {
  // const product = new Product({ name: "papryka", price: 1 });
  // const product = new Product({ name: "marchewka", price: 1 });
  // const product = new Product({ name: "ziemniaki", price: 1 });
  // const product = new Product({ name: "fasolka", price: 1 });

  await product.save();
  console.log(user);
  console.log(await Products.find());
  mongoose.connection.close();
})();
