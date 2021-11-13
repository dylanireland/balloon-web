var nftElements = document.getElementsByClassName("nftElement");
const profileLink = document.getElementById("profileLink");
const metaModal = document.getElementById("metaModal");
const enableEthereumButton = document.getElementById("enableEthereumButton");

let accounts = [];

document.getElementsByClassName("navLogo")[0].addEventListener('click', () => {
  window.location.href = "/";
})

profileLink.addEventListener('click', () => {
  handleProfileClick();
});

enableEthereumButton.addEventListener('click', () => {
  getAccount().then(function() {
    handleProfileClick();
  }).catch(function(error) {
    console.log(error);
  });
});

var redirectToBorrowable = function(address, tokenId) {
    const uri = "/borrowable/" + address + "/" + tokenId;
    console.log(uri);
    window.location.href = uri;
};

function truncate(str, n) {
  return (str.length > n) ? str.substr(0, n-1) + "..." : str;
};

//Collapsible
var collapsible = document.getElementsByClassName("collapsible");

for (var i = 0; i < collapsible.length; i++) {
  collapsible[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = document.getElementById("collectionsDropdown");
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = "90px";
    }
  });
}

async function handleProfileClick() {
  const regex = "account=([a-fA-F0-9x]{42})";
  let match = document.cookie.match(regex);
  console.log(document.cookie);
  console.log(match);

  if (document.cookie != "" && match != null && match.length != 0) {
    const account = await getAccount();
    if (account != match[1]) {
      document.cookie = "account=" + account;
    }
  }
  if (accounts[0] == null) {
    console.log("running");
    metaModal.style.display = "flex";
    return;
  }
  window.location.href = "/profile/" + accounts[0];
}


async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  document.cookie = "account=" + accounts[0];
  return accounts[0];
}


async function layout() {
  let nftElement = document.getElementsByClassName("nftElement")[0];
  let length = await getAllNFTsLength();
  let borrowableGrid = document.getElementById("borrowableGrid");
  if (length == 0) {
    nftElement.style.display = "none";
    //tell em there's no NFTs!
    return;
  }
  for (var i = 0; i < length; i++) {
    var clone = nftElement.cloneNode(true);
    if (i == 0) {
      clone = nftElement;
    }
    let currentNFT = await getNFTAtIndex(i);
    let tokenURI = await getNFTURI(currentNFT);
    let metadata = await getNFTMetadata(tokenURI);

    clone.getElementsByClassName("nftImage")[0].src = metadata.image;
    clone.getElementsByClassName("priceLabel")[0].innerHTML = (currentNFT.valuation * 10**-18).toString();
    clone.getElementsByClassName("collateralLabel")[0].innerHTML = "@ " + (currentNFT.collateralMultiplier).toString() + "x";
    clone.getElementsByClassName("nftTokenId")[0].innerHTML = "#" + (currentNFT.tokenId).toString();
    clone.getElementsByClassName("nftCollectionName")[0].innerHTML = truncate(currentNFT.addy, 6);

    clone.addEventListener('click', function () { redirectToBorrowable(currentNFT.addy, currentNFT.tokenId) }, false);

    borrowableGrid.append(clone);
  }

}

layout();
