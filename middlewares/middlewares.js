const fs = require("fs");
const utilities = require("../utilities/utilites");
let { User, Cart } = utilities;
//// midlewers

// create user cart
let createUserCarts = async (req, res, next) => {
  let users = await User.find();
  // let carts = await Cart.find();
  await users.map(user => {
    let newCart = new Cart({
      _id: user.id,
      userName: user.name,
      cart: [],
      payment: 0
    });
    newCart.save();
  });
};

// get carts // do przerobienia
let readCarts = (req, res, next) => {
  fs.readFile("./data/carts.json", "utf8", function(err, data) {
    if (err) {
      console.log(err.message);
      throw err;
    }
    carts = JSON.parse(data);
    next();
  });
};

//auth admin
const authMiddleware = (req, res, next) => {
  if (req.headers["access-token"] === "12345") {
    next();
  } else {
    console.log("bad password");
    res.status(401).send("bad password");
  }
};
//auth user
const userAuthMiddleware = async (req, res, next) => {
  let { userId } = req.params;
  user = await User.findById(userId);

  if (req.headers["access-token"] == (await user.pass)) {
    next();
  } else {
    console.log("bad password");
    res.status(401).send("bad password");
  }
};

module.exports = {
  readCarts,
  createUserCarts,
  authMiddleware,
  userAuthMiddleware
};
