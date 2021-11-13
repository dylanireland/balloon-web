const enableEthereumButton = document.getElementById("enableEthereumButton");
const borrowButton = document.getElementById("borrowButton");
const withdrawButton = document.getElementById("withdrawButton");
const backButton = document.getElementById("navAcc");

enableEthereumButton.style.display = "none";
borrowButton.style.display = "none";
withdrawButton.style.display = "none";

enableEthereumButton.addEventListener('click', () => {
  getAccount();
});

borrowButton.addEventListener('click', () => {
  sendBorrow();
});

withdrawButton.addEventListener('click', () => {
  sendWithdraw();
});

backButton.addEventListener('click', () => {
  window.location.href = "/dapp";
});

let accounts = [];

var nft = null;


async function getNetwork() {
  return await provider.getNetwork();
}

async function getNFTAtIndex() {
  return await balloonContract.getNFTAtIndex(0);
}

async function loadInfo() {
  nft = await findNFTWithTypes(nftAddress, tokenId);
  tryToLoadButton(nft); //Call this here so we don't have to call findNFT twice, doesn't wait to finish
  var uri = await getNFTURI(nft);
  var metadata = await getNFTMetadata(uri);
  document.getElementById("mainImage").src = metadata.image;
  var h3s = document.getElementsByClassName("label");
  h3s[0].innerHTML = h3s[0].innerHTML + nft.addy;
  h3s[1].innerHTML = h3s[1].innerHTML + nft.lender;
  h3s[2].innerHTML = h3s[2].innerHTML + (nft.valuation * 10**-18).toString();
  h3s[3].innerHTML = h3s[3].innerHTML + (nft.collateralMultiplier * nft.valuation * 10**-18).toString();
  h3s[4].innerHTML = h3s[4].innerHTML + (nft.desiredInterest * 10**-2).toString();
  h3s[5].innerHTML = h3s[5].innerHTML + secondsToDhms(nft.loanDuration);
}

async function tryToLoadButton(nft) {
  if (!nft.isBeingBorrowed) {
    if (accounts.length == 0) {
      enableEthereumButton.style.display = "block";
    } else if (accounts.length > 0 && accounts[0] != lender) {
      borrowButton.style.display = "block";
    } else if (accounts.length > 0 && accounts[0] == lender) {
      withdrawButton.style.display = "block";
    }
  }
}

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  enableEthereumButton.style.display = "none";
  var nft = await findNFTWithTypes(nftAddress, tokenId);
  if (accounts[0] == nft.lender) {
    withdrawButton.style.display = "block";
  } else if (accounts[0] != nft.lender) {
    borrowButton.style.display = "block";
  }
}

//andris@https://stackoverflow.com/users/3564943/andris
function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  if (sDisplay == "") {
    if (mDisplay == "") {
      if (hDisplay == "") {
        if (dDisplay != "") dDisplay = dDisplay.substring(0, dDisplay.length - 2);
      } else {
        hDisplay = hDisplay.substring(0, hDisplay.length - 2);
      }
    } else {
      mDisplay = mDisplay.substring(0, mDisplay.length - 2);
    }
  }
  return dDisplay + hDisplay + mDisplay + sDisplay;
}




async function sendBorrow() {
  if (nft == null) {
    var nft = await findNFTWithTypes(nftAddress, tokenId);
  }
  let overrides = {
    value: (nft.collateralMultiplier * nft.valuation).toString()
  };
  let tx = await balloonContract.connect(provider.getSigner()).borrow(nft.lender, nft.addy, nft.tokenId, overrides);
}

async function sendWithdraw() {
  if (nft == null) {
    var nft = await findNFTWithTypes(nftAddress, tokenId);
  }
  let tx = await balloonContract.connect(provider.getSigner()).withdrawNFT(nft.addy, nft.tokenId);
  /*ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: contractAddress,
          gas: '0x2710',
          data: withdrawData,
        },
      ],
    })
    .then((txHash) => {
      console.log(txHash);
      //Throw up tx hash
    }).catch((error) => {
      console.error;
      //Throw error message
    });*/
}

loadInfo();
