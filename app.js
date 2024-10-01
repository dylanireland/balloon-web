const express = require("express");
const path = require("path");
const fs = require("fs");
const { Web3 } = require("web3");
const axios = require("axios");
const greenlock = require("greenlock-express");

const app = express();
const web3 = new Web3("https://sepolia.infura.io/v3/79176195facd464d82f763a1dfea9acd");

const abi = JSON.parse(fs.readFileSync("./abi.json"));
const addy = "0x385C0E7E1426Febbc012A366EE47ef89C4046F66"; //0x1F6cd364d999b150Ba6Ea7374C95E1dBc7861670
const Contract = new web3.eth.Contract(abi, addy);

const httpPort = 8080;
const httpsPort = 8443;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/static"));

app.get("/dapp", (req, res) => {
  res.render("dapp", { contractAddress: addy });
});

app.get("/", (req, res) => {
  res.render("index", { contractAddress: addy });
});

app.get("/nft/:address/:tokenId", (req, res) => {
  res.render("borrowable", { contractAddress: addy, nftAddress: req.params.address, tokenId: req.params.tokenId });
});

app.get("/profile", (req, res) => {
  res.render("profile", { contractAddress: addy });
});

const greenlockApp = greenlock.init({
  packageRoot: __dirname,
  configDir: "./greenlock.d",
  maintainerEmail: "dylan.ireland777@gmail.com",
  cluster: false,
});

greenlockApp.serve(app);
