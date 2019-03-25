const express = require('express')
var mongoose = require("mongoose");
const app = express()
const port = 3000

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/FeedMe");

var schema = new mongoose.Schema({ 
  key: Number,
  recipeName: String,
  imageURL: String,
  link: String,
  timeInMinutes: Number,
  servings: Number,
  ingredients: [
    {
      ingredName: String,
      amount: Number,
      units: String,
      adjective: String,
      notes: String
    }
  ]
});

var Recipes = mongoose.model('Recipes', schema);

app.get('/', (req, res) => {
  res.send("Welcome to this custom API!     Query '/recipes' for a JSON response containing all recipe documents.")
});

app.get('/add_sample_document', (req, res) => {
  sampleRecipe = {
    key: -1,
    recipeName: 'Gruel',
    imageURL: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Rice_gruel.jpg',
    link: null,
    timeInMinutes: 1,
    servings: 100,
    ingredients: [
    ]
  }

  Recipes.create(sampleRecipe, (err, doc) => {
    if (err) {
      res.send(err)
    } else {
      res.send("Sample Recipe Added")
    }
  })
});

app.get('/recipes', (req, res) => {
  const query = Recipes.find({});
  query.exec(function (err, docs) {
    res.send(JSON.stringify(docs));
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



