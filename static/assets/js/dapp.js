var nftElements = document.getElementsByClassName("nftElement");
const profileLink = document.getElementById("profileLink");
const metaModal = document.getElementById("metaModal");
const enableEthereumButton = document.getElementById("enableEthereumButton");

let accounts = [];

let gperPage = 12;
let gpage = 0;
let gpages = 0;

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
    window.location.href = uri;
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


async function layout(perPage, page) {
  let borrowableGrid = document.getElementById("borrowableGrid");
  let nftElement = borrowableGrid.getElementsByClassName("nftElement")[0];
  let length = (await getLiveNFTsLength()).toNumber();
  if (length == 0) {
    nftElement.style.display = "none";
    console.log("No nfts");
    //tell em there's no NFTs!
    return;
  }

  if (gpages == 0) {
    gpages = Math.ceil(length / perPage); //Set total pages
  }

  if (length > perPage * (page + 1)) {
    length = perPage * (page + 1);
  } else {
    length = (length + perPage) % perPage;
  }

  let stIndex = page * perPage;

  var cloned = false;
  const inIndex = stIndex; //initial index, doesnt change
  for (stIndex; stIndex < (inIndex + length); stIndex++) {
    var clone = nftElement.cloneNode(true);
    if (!cloned) {
      nftElement.remove();
    }
    cloned = true;
    let currentNFT = await getLiveNFTAtIndex(stIndex);
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

function resetGrid() {
  let nftElement = document.getElementsByClassName("nftElement")[0];
  let borrowableGrid = document.getElementById("borrowableGrid");
  borrowableGrid.querySelectorAll(".nftElement").forEach((e) => e.parentNode.removeChild(e));
  borrowableGrid.appendChild(nftElement);
  let newGrid = borrowableGrid.cloneNode(true);
  borrowableGrid.parentNode.removeChild(borrowableGrid);
  let pageButtons = document.getElementById("pageButtons");
  let pageButtonsClone = pageButtons.cloneNode(true);
  pageButtons.remove();
  var innerInteractable = document.getElementById("innerInteractable");
  innerInteractable.appendChild(newGrid);
  innerInteractable.append(pageButtonsClone);
}

function prevPage() {
  if (gpages <= 1) {
    return;
  }
  resetGrid();
  if (gpage != 0) {
    layout(gperPage, --gpage);
  } else {
    gpage = gpages - 1;
    layout(gperPage, gpage);
  }
}

function nextPage() {
  if (gpages <= 1) {
    return;
  }
  resetGrid();
  if (gpage != gpages - 1) {
    layout(gperPage, ++gpage);
  } else {
    gpage = 0;
    layout(gperPage, 0);
  }
}

layout(gperPage, gpage);
