const express = require("express");
const path = require("path");
const fs = require('fs');
const Web3 = require('web3');
const axios = require("axios");

const app = express();
const port = process.env.PORT || "80";
const web3 = new Web3(Web3.givenProvider || "https://rinkeby.infura.io/v3/79176195facd464d82f763a1dfea9acd");

const abi = JSON.parse(fs.readFileSync('./abi.json'));
const addy = "0x78D4D0A12E5514F594661FCCc327a6C9cd1f1eEb";
const Contract = new web3.eth.Contract(abi, addy);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get("/dapp", async(req, res) => {
  //var allLiveNFTs = await getAllLiveNFTs();
  //var tokenURIs = await getNFTURIs(allLiveNFTs);
  //var images = await getNFTImageURIs(tokenURIs);
  res.render('dapp', {contractAddress: addy});
});

app.get("/", async(req, res) => {
  res.render('index', {});
});

app.get("/borrowable/:address/:tokenId", async(req, res) => {
  //var nft = await findNFT(req.params.address, req.params.tokenId);
  //var borrowData = web3.eth.abi.encodeFunctionCall({name: 'borrow', type: 'function', inputs: [{type: 'address', name: 'lender'},{type: 'address', name: 'nftAddy'},{type: 'uint256', name: 'tokenId'}]}, [nft.lender, nft.addy, nft.tokenId]);

  //var withdrawData = web3.eth.abi.encodeFunctionCall({name: 'withdrawNFT', type: 'function', inputs: [{type: 'address', name: 'nftAddy'},{type: 'uint256', name: 'tokenId'}]}, [nft.addy, nft.tokenId]);
  //res.render('borrowable', {nft: nft, imageURI: await getNFTImageURI(await getNFTURI(nft)), contractAddress: addy, borrowData: borrowData, withdrawData: withdrawData});
  res.render('borrowable', {contractAddress: addy, nftAddress: req.params.address, tokenId: req.params.tokenId})
});

app.get("/profile/:address", async(req, res) => {
  res.render('profile', {});
});

function makeNFT() {
  var names = ["lender", "borrower", "addy", "tokenId", "valuation", "desiredInterest", "loanDuration", "loanStartTime", "collateralMultiplier", "isBeingBorrowed", "live", "shouldRelist", "collateral"];
  function constructor() {
    for (var i = 0; i < names.length; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}

function makeNFTArray(nfts, onlyLive) {
  returnable = [];
  for (const nft of nfts) {
    var NFT = makeNFT();
    var cur = new NFT(nft[0], nft[1], nft[2], nft[3], nft[4], nft[5], nft[6], nft[7], nft[8], nft[9], nft[10], nft[11], nft[12]);
    if (onlyLive && !cur.live) {
      continue;
    }
    returnable.push(cur);
  }
  return returnable
}

function getAllLiveNFTs() {
  return new Promise((resolve, reject) => {
    Contract.methods.getAllNFTs().call().then((value) => {
      var nfts = makeNFTArray(value, true);
      resolve(nfts);
    }).catch((error) => {
      reject(error);
    });
  })
}


async function getNFTURI(nft) {
  let contract = new web3.eth.Contract(JSON.parse(fs.readFileSync('./ERC721BaseABI.json')), nft.addy);
  var tokenURI = await contract.methods.tokenURI(nft.tokenId).call();
  return tokenURI;
}


app.listen(port);
