const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.')
  } else {
    console.log('Error in DB connection: ' + err)
  }
});

// Create post schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: String
});

// Create post schema model
const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, docs) => {
    if (!err) {
      res.render("home", {
        homeContent: homeStartingContent,
        posts: docs
      });
    } else {
      console.log(err);
    } 
  });
});

app.get("/about", (req, res) => {
  res.render("about", {startingAbout: aboutContent});
});

app.get("/contact", (req, res) => {
  res.render("contact", {startingContact: contactContent});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postName", (req, res) => {
  posts.forEach(post => {
    if(_.kebabCase(post.title) === _.kebabCase(req.params.postName)) {
      // console.log("Match found!");
      res.render("post", {
        postTitle: post.title,
        postBody: post.content
      });
    }
  });
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();

  // posts.push(post);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
