const db = require("./connection");
const { User, Product, Category } = require("../models");

db.once("open", async () => {
  await Category.deleteMany();

  const categories = await Category.insertMany([
    // { name: "Food", img: "food.jpg" },
    { name: "Animals", img: "animals_category.jpg" },

    { name: "Misc", img: "misc_category.jpg" },
    { name: "Jewlery", img: "jewelry_category.jpg" },
    { name: "Clothing", img: "clothing_category.jpg" },
    { name: "Toys", img: "toys_category.jpg" },
  ]);

  console.log("categories seeded");

  await Product.deleteMany();

  const products = await Product.insertMany([
    {
      name: "Elephant",
      description:
        "Elephant crochet creation! This is and elephant. He has a very long trunk and gives the best hugs in the whole world. A perfect gift for children or adults this christmas season!",
      image: "elephant.png",
      category: categories[0]._id,
      price: 2.99,
      quantity: 500,
    },
    {
      name: "Ramen Noodles",
      description:
        "Noodles!. This is crochet noodles. This is a long description of crochet noodle. Specifically ramen noodles. Included with chopsticks. Please feel free to order replacement parts by directly contacting me.",
      image: "Ramen-noodles.png",
      category: categories[1]._id,
      price: 1.99,
      quantity: 500,
    },
    {
      name: "Fuzzy Dice",
      category: categories[4]._id,
      description:
        "Looking to play some DND? How about monopoly? Tired of the click clacking the regular dice make? Try out this Crochet Creation to up any gameplay!",
      image: "dice.jpg",
      price: 5.99,
      quantity: 4,
    },
    {
      name: "Monkey",
      category: categories[0]._id,
      description:
        "Here is a monkey. Careful, he might just hop away. Comes with banana. Cozy cuddly little buddy to make your cold nights just a bit warmer. Please look into buying his friend the elephant to make a handsome pair.",
      image: "monkey.jpg",
      price: 12.99,
      quantity: 5,
    },
    {
      name: "Pizza",
      category: categories[1]._id,
      description: "Yummy pizza. Please eat me! Just kidding, dont do that.",
      image: "pizza.jpg",
      price: 4.99,
      quantity: 20,
    },
    {
      name: "Barn",
      category: categories[4]._id,
      description:
        "A barn to keep all your ducks in a row. Or other animals you choose to keep!",
      image: "barn.jpg",
      price: 25.99,
      quantity: 10,
    },
  ]);

  console.log("products seeded");

  await User.deleteMany();

  await User.create({
    username: "admin",
    email: "admin@gmail.com",
    password: "adm1nPa55word!",
    admin: true,
  });

  console.log("users seeded");

  process.exit();
});
