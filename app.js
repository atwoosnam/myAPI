const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const path = require('path');
const port = 3000

const app = express()
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/recipes', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.get('/contact', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

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

app.get('/recipes.json', (req, res) => {
  const query = Recipes.find({});
  query.exec(function (err, docs) {
    if (err) {
      res.send(err);
    } else {
      res.send(JSON.stringify(docs));
    }
  });
})

app.post('/recipes', (req, res) => {

  var tagSet = new Set(['recipeName', 'imageURL', 'link', 'timeInMinutes', 'servings', 'ingredients'])
  for (tag in req.body){
    if (tagSet.has(tag)) {
      tagSet.delete(tag)
    } else {
      res.status(400).send({"success":false, "error":`Bad recipe item: "${tag}"`})
    } 
  }
  if (tagSet.size > 0) {
    res.status(400).send({"success":false, "error":"Missing one or more items"})
  }

  Recipes.create({ 
    key: -1,
    recipeName: req.body.recipeName,
    imageURL: req.body.imageURL,
    link: req.body.link,
    timeInMinutes: req.body.timeInMinutes,
    servings: req.body.servings,
    ingredients: req.body.ingredients
    }, (err) => {
    if (err) {
      res.send({"success":false, "error":err})
    } else {
      res.send({"success":true})
    }
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

