let cart = [
  { id: 1, name: "marchewka", price: 15, quantity: 10 },
  { id: 1, name: "marchewka", price: 15, quantity: 5 },
  { id: 2, name: "burak", price: 15, quantity: 5 }
];

result = [];
cart.forEach(product => {
  if (!this[product.id]) {
    this[product.id] = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 0
    };
    result.push(this[product.id]);
  }
  this[product.id].quantity += product.quantity;
}, Object.create(null));

console.log(result);
