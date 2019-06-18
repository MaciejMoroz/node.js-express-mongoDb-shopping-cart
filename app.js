const express = require("express");
const app = express();
const router = express.Router();
const middlewears = require("./middlewares/middlewares");
const utilities = require("./utilities/utilites");

// utilities
const {
  addProductsToCart,
  removeAllFromCart,
  removeProductFromCart,
  removeQuantityOfProduct,
  displayUserBill,
  calculatePayment,
  Product,
  Cart,
  User
} = utilities;

// middlewears
const {
  readCarts,
  createUserCarts,
  authMiddleware,
  userAuthMiddleware
} = middlewears;

// router
router.get("/", async (req, res) => {
  let users = await User.find();
  let carts = await Cart.find();

  res.send("Witaj w warzywniaku");

  if (users.length !== carts.length) {
    await createUserCarts();
  }
});

// products display
router.get("/products/:productId?", async (req, res) => {
  let { productId } = req.params;

  if (productId) {
    res.send(await Product.findById(productId));
  } else {
    res.send(await Product.find());
  }
});

//add product
router.put(
  "/admin/add/:productName/:productPrice/:photoUrl",
  authMiddleware,
  async (req, res) => {
    let { productName, productPrice, photoUrl } = req.params;
    let isNameExist = await Product.findOne({ name: productName });

    if (isNameExist) {
      res.send(`produkt o podanej nazwie ${productName} już istnieje`);
      res.end();
    } else {
      const product = new Product({
        name: productName,
        img: photoUrl,
        price: productPrice
      });
      await product.save();
      res.send(await Product.find());
    }
  }
);

// remove product
router.delete("/admin/del/:productId", authMiddleware, async (req, res) => {
  let { productId } = req.params;
  let product = await Product.findById(productId);

  if (product) {
    await Product.deleteOne(product);
    res.send(await Product.find());
  } else {
    res
      .status(404)
      .send("produkt nie istnieje")
      .end();
  }
});

// user
router.get("/user/:userId", userAuthMiddleware, async (req, res) => {
  let { userId } = req.params;
  user = await User.findById(userId);

  if (user) {
    res.status(200).send(`Witaj ${user.name}`);
  } else {
    res
      .status(404)
      .send("użytkownik nie istnieje")
      .end();
  }
});

// get user cart
router.get("/cart/:userId", userAuthMiddleware, async (req, res) => {
  let { userId } = req.params;
  let userCart = await Cart.findById(userId);
  res.send(await userCart.cart);
});
// shopping cart add
router.put(
  "/cart/:userId/:productId/:quantity",
  userAuthMiddleware,
  async (req, res) => {
    let { userId, productId, quantity } = req.params;
    let user = await User.findById(userId);
    let product = await Product.findById(productId);

    if (user && product) {
      await addProductsToCart(userId, product, quantity);
      let userCart = await Cart.findById(userId);
      let bill = displayUserBill(userCart);
      let pay = calculatePayment(userCart);
      // res.send(userCart + `${bill}  do zapłaty ${pay}zł `);
      res.send(userCart);
    } else {
      res.send("użytkownik lub produkt nie istnieje");
    }
  }
);

// remove product form user cart
router.delete(
  "/cart/:userId/:productId/:quantity?",
  userAuthMiddleware,
  async (req, res) => {
    let { userId, productId, quantity } = req.params;
    let product = await Product.findById(productId);
    let userCart = await Cart.findById(userId);
    console.log("del?");
    // remove all products
    if (!productId && !quantity) {
      removeAllFromCart(userCart);
      userCart = await Cart.findById(userId);
      console.log("removed all products");

      res.send(userCart);

      // remove products  from cart by id
    } else if (!quantity) {
      console.log(`removed ${product}`);
      await removeProductFromCart(userCart, product);
      userCart = await Cart.findById(userId);
      res.send(userCart);

      // remove quantity of product
    } else {
      removeQuantityOfProduct(userId, product, quantity);

      userCart = await Cart.findById(userId);

      res.send(userCart);
    }
  }
);

router.get("/pay/:userId/", async (req, res) => {
  let { userId } = req.params;
  let userCart = await Cart.findById(userId);
  let bill = displayUserBill(userCart);
  let pay = calculatePayment(userCart);

  removeAllFromCart(userCart);
  res.send(`${bill}  do zapłaty ${pay}zł `);


});

app.use(router);

app.listen(4001, () => console.log("server runing"));
