const express = require('express')
var mongoose = require("mongoose");
const app = express()
const path = require('path');
const router = express.Router();
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

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'))
  // res.send("Welcome to this custom API!     Query '/recipes' for a JSON response containing all recipe documents.")
});

app.get('/recipes', (req, res) => {
  const query = Recipes.find({});
  query.exec(function (err, docs) {
    if (err) {
      res.send(err);
    } else {
      res.send(JSON.stringify(docs));
    }
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



