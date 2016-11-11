"use strict";

const express = require("express");
const app = express();
const _ = require('lodash');
const cookieParser = require ("cookie-parser");
app.use(cookieParser())
const PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) =>  {
  console.log(req.body);
  res.cookie("Username", req.body.username);
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    fullURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/shortURL/delete", (req, res) =>  {
  const inputVal = req.body.shortURL;
  delete(urlDatabase[inputVal]);
  res.redirect("/urls")
})

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
  res.render("urls_new");
});

app.post("/urls/create", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

