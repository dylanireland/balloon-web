const express = require("express");
const path = require("path");
const fs = require('fs');
const Web3 = require('web3');
const axios = require("axios");

const app = express();
const port = 3000;
const web3 = new Web3(Web3.givenProvider || "https://rinkeby.infura.io/v3/79176195facd464d82f763a1dfea9acd");

const abi = JSON.parse(fs.readFileSync('./abi.json'));
const addy = "0xE07e5AA3cdE303AFd41C7dB456C7604D0b0b6eF1";
const Contract = new web3.eth.Contract(abi, addy);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get("/dapp", (req, res) => {
  res.render('dapp', {contractAddress: addy});
});

app.get("/", (req, res) => {
  res.render('index', {contractAddress: addy});
});

app.get("/nft/:address/:tokenId", (req, res) => {
  res.render('borrowable', {contractAddress: addy, nftAddress: req.params.address, tokenId: req.params.tokenId})
});

app.get("/profile/:address", (req, res) => {
  res.render('profile', {contractAddress: addy});
});




app.listen(port, "127.0.0.1", () => {
  console.log("Server running");
});
