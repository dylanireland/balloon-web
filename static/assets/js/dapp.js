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
    const uri = "/nft/" + address + "/" + tokenId;
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

if (window.ethereum != null) {
  ethereum.on('chainChanged', (chainId) => {
    if (chainId != 4) {
      removeGridsUntilConnected("You must be connected to the Rinkeby network to use Balloon");
    } else {
      window.location.reload();
    }
  });
}


async function layout(perPage, page) {
  let borrowableGrid = document.getElementById("borrowableGrid");
  let nftElement = borrowableGrid.getElementsByClassName("nftElement")[0];
  let length = (await getLiveNFTsLength()).toNumber();
  if (length == 0) {
    nftElement.style.display = "none";
    let noNFTsNotifier = document.createElement("h1");
    noNFTsNotifier.innerHTML = "There are no NFTs available to borrow";
    borrowableGrid.style.gridTemplateColumns = "1fr";
    borrowableGrid.appendChild(noNFTsNotifier);
    document.getElementById("pageButtons").style.display = "none";
    //tell em there's no NFTs!
    return;
  }
  const loaderWrapper = document.createElement("div");
  const loader = document.createElement("img");
  loaderWrapper.classList.add("loaderWrapper");
  loader.classList.add("loader");
  loader.src = "/assets/photos/loading.svg";
  loaderWrapper.appendChild(loader);
  borrowableGrid.appendChild(loaderWrapper);


  if (gpages == 0) {
    gpages = Math.ceil(length / perPage); //Set total pages
    if (gpages <= 1) {
      document.getElementById("pageButtons").style.display = "none";
    }
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

    borrowableGrid.insertBefore(clone, borrowableGrid.childNodes[length - (stIndex - inIndex)]);
  }
  loaderWrapper.remove();
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

function removeGridsUntilConnected(message, which, linkref) {
  let borrowableGrid = document.getElementById("borrowableGrid");
  if (borrowableGrid.style.display == "none") {
    return;
  }
  let pageButtons = document.getElementById("pageButtons");
  borrowableGrid.style.display = "none";
  pageButtons.style.display = "none";
  var innerInteractable = document.getElementById("innerInteractable");
  const metaNotifierWrapper = document.createElement("div");
  metaNotifierWrapper.classList.add("providerErrorWrapper");
  const messageNode = document.createElement("p");
  messageNode.classList.add("providerErrorMessage");
  messageNode.innerHTML = message;
  metaNotifierWrapper.appendChild(messageNode);
  if (which != null) {
    if (which == "get") {
      const link = document.createElement("a");
      link.classList.add("providerErrorLink");
      link.innerHTML = "Get Metamask";
      link.href = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
      link.target = "_blank";
      metaNotifierWrapper.appendChild(link);
    } else if (which == "connect") {
      const connectButton = document.createElement("button");
      connectButton.onclick = function() { getAccount() };
      connectButton.innerHTML = "Connect to Metamask";
      connectButton.classList.add("providerErrorConnectButton");
      metaNotifierWrapper.appendChild(connectButton);
    }
  }


  innerInteractable.appendChild(metaNotifierWrapper);

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

async function checkConnection() {
  if (window.ethereum == null) {
    removeGridsUntilConnected("You must install Metamask to use Balloon.", "get");
    return;
  }
  provider.listAccounts().then(result => {
    if (result.length == 0) {
      removeGridsUntilConnected("Please connect to Metamask to use Balloon", "connect");
      return;
    }
  });
  const { chainId } = await provider.getNetwork();
  if (chainId == 4) {
    layout(gperPage, gpage);
    return;
  }
  removeGridsUntilConnected("You must be connected to the Rinkeby network to use Balloon");
}





checkConnection();
