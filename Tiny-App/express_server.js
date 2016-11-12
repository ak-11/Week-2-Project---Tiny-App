"use strict";

const express = require("express");
const app = express();
const _ = require('lodash');
const cookieParser = require ("cookie-parser");
const PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser('super_secret_key'));

const generateRandomString = function () {
  let text = "";
  const charset = "abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
  for( var i = 0; i < 6; i++ )
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userID = generateRandomString();
const userDatabase = {
    "ZcA46g" : {id: "userRandomID", email: "andrew@example.com", password: "testing"}
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) =>  {
  console.log(req.body);
  if (res.cookie());
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.get("/register", (req, res) =>  {
  res.render("urls_register", {username: ""});
});

app.post("/register", (req, res) =>  {
  const password = req.body.password;
  const email = req.body.email;
  if (password === "" || email ==="")  {
  res.status(400).send("You Forgot Something!");
  }
  const randomID = generateRandomString();
  userDatabase[randomID] = {id: randomID, email: email, password: password};
  console.log(res);
  res.cookie("user_id", `${randomID}`)
  res.redirect("/");
})

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    fullURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/shortURL/delete", (req, res) =>  {
  const inputVal = req.body.shortURL;
  delete(urlDatabase[inputVal]);
  res.redirect("/urls")
});

app.post("/urls/:shortID/delete", (req, res) =>  {
  const anotherVal = req.params.shortID;
  delete(urlDatabase[anotherVal]);
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res)  =>  {
  const newURL = req.body.newURL;
  urlDatabase[req.params.id] = newURL;
  res.redirect(`/urls/${req.params.id}`)
})

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.post("/urls/create", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//redirect to the fullwebsite
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/profile', function(req, res){
  res.render('profile', { username: req.user.username });
});
