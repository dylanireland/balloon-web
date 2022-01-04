const enableEthereumButton = document.getElementById("enableEthereumButton");
const borrowButton = document.getElementById("borrowButton");
const withdrawButton = document.getElementById("withdrawButton");
const approveButton = document.getElementById("approveButton");
const repayButton = document.getElementById("repayButton");
const livenButton = document.getElementById("livenButton");
const liquidateButton = document.getElementById("liquidateButton");

borrowButton.style.display = "none";
withdrawButton.style.display = "none";
approveButton.style.display = "none";
repayButton.style.display = "none";
livenButton.style.display = "none";
liquidateButton.style.display = "none";

enableEthereumButton.addEventListener('click', () => { getAccount(); });
borrowButton.addEventListener('click', () => { sendBorrow(); });
withdrawButton.addEventListener('click', () => { sendWithdraw(); });
approveButton.addEventListener('click', () => { sendApproval(); });
repayButton.addEventListener('click', () => { loadReimbursement(); });
livenButton.addEventListener('click', () => { updateLivelihood(); });
liquidateButton.addEventListener('click', () => { liquidate(); });

let accounts = [];

var gnft = null;

async function getNetwork() {
  return await provider.getNetwork();
}

async function getNFTAtIndex() {
  return await balloonContract.getNFTAtIndex(0);
}

async function loadInfo() {
  gnft = await findNFTWithTypes(nftAddress, tokenId);
  var uri = await getNFTURI(gnft);
  var metadata = await getNFTMetadata(uri);
  document.getElementById("mainImage").src = metadata.image;
  var h3s = document.getElementsByClassName("label");
  h3s[0].innerHTML = h3s[0].innerHTML + escapeHTML(truncaddy(gnft.addy, 12));
  h3s[0].onclick = function() { location.href = "https://rinkeby.etherscan.io/address/" + escapeHTML(gnft.addy); };
  h3s[1].innerHTML = h3s[1].innerHTML + escapeHTML(truncaddy(gnft.lender, 12));
  h3s[1].onclick = function() { location.href = "https://rinkeby.etherscan.io/address/" + escapeHTML(gnft.lender); };
  //DO CSS TO MAKE THESE TWO HAVE POINTERS
  h3s[2].innerHTML = h3s[2].innerHTML + escapeHTML((gnft.valuation * 10**-18).toString());
  h3s[3].innerHTML = h3s[3].innerHTML + escapeHTML((gnft.collateralMultiplier * gnft.valuation * 10**-18).toString());
  h3s[4].innerHTML = h3s[4].innerHTML + escapeHTML((gnft.desiredInterest * 10**-2).toString());
  h3s[5].innerHTML = h3s[5].innerHTML + escapeHTML(secondsToDhms(gnft.loanDuration));
}

async function tryToLoadButton(nft) {
  if (accounts.length == 0) {
    return;
  }
  if (accounts[0].toUpperCase() == nft.lender.toUpperCase()) {
    if (!nft.isBeingBorrowed) {
      withdrawButton.style.display = "block";
      if (await balloonContract.isNFTLive(gnft.addy, gnft.tokenId)) {
        livenButton.style.display = "block";
        livenButton.innerHTML = "Pause";
      } else {
        livenButton.style.display = "block";
        livenButton.innerHTML = "Make Live";
      }
    } else {
      isLiquidatable(nft.addy, nft.tokenId).then((liquidatable) => {
        if (liquidatable === true) {
          liquidateButton.style.display = "block";
        }
      }).catch((error) => {
        alert("Error checking liquidatability. If this error persists and you need to liquidate your position, you may do so from Etherscan.");
      })
    }
  } else if (accounts[0].toUpperCase() == nft.borrower.toUpperCase()) {
    var isApproved = await isApprovedForAll(nft.addy, accounts[0], contractAddress);
    if (isApproved) {
      repayButton.style.display = "block";
    } else if (!isApproved) {
      approveButton.style.display = "block";
    }
  } else {
    borrowButton.style.display = "block";
  }
}

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  enableEthereumButton.style.display = "none";
  if (gnft == null) {
    gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  tryToLoadButton(gnft);
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
  if (gnft == null) {
    var gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  let overrides = {
    value: (gnft.collateralMultiplier * gnft.valuation).toString()
  };
  let tx = await balloonContract.connect(provider.getSigner()).borrow(gnft.lender, gnft.addy, gnft.tokenId, overrides);
}

async function sendWithdraw() {
  if (gnft == null) {
    var gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  let tx = await balloonContract.connect(provider.getSigner()).withdrawNFT(gnft.addy, gnft.tokenId);
}

async function sendApproval() {
  if (gnft == null) {
    var gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  setApprovalForAll(gnft.addy).then(() => {
    approveButton.style.display = "none";
    tryToLoadButton(gnft);
  }).catch((e) => {
    alert(e);
  });
}

async function loadReimbursement() {
  reimbursementModalWrapper.style.display = "block";
  return;

}

async function updateLivelihood() {
  if (gnft == null) {
    var gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  let tx = await balloonContract.connect(provider.getSigner()).flipBorrowAbility(gnft.addy, gnft.tokenId);
}


async function liquidate() {
  if (gnft == null) {
    var gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  let tx = await balloonContract.connect(provider.getSigner()).liquidate(gnft.addy, gnft.tokenId);
}

loadInfo();

/* REIMBURSEMENT MODAL */

var reimbursementModalWrapper = document.getElementById("reimbursementModalWrapper");

window.onclick = function(event) {
  if (event.target == reimbursementModalWrapper) {
    reimbursementModalWrapper.style.display = "none";
  }
}

async function checkApproval(address) {
  let reimburseSubmit = document.getElementById("reimburseSubmit");
  reimburseSubmit.style.display = "block";
  if (accounts.length == 0) {
    reimburseSubmit.value = "Not Connected";
    return;
  }

  isApprovedForAll(address, accounts[0], contractAddress).then((isApproved) => {
    if (isApproved) {
      reimburseSubmit.value = "Reimburse NFT";
    } else if (!isApproved) {
      reimburseSubmit.value = "Approve";
    }
  }).catch((e) => {
    reimburseSubmit.value = "Error Checking Approval";
  })

}

async function tryToObtainNFTPhoto(tokenId) {
  let reimbursementPreview = document.getElementById("reimbursementPreview");
  getPFPURI(nftAddress, tokenId).then((uri) => {
    getNFTMetadata(uri).then((metadata) => {
      reimbursementPreview.src = metadata.image;
    }).catch((e) => {
      reimbursementPreview.src = "/assets/photos/unchosen.svg";
      console.log(e);
    });
  }).catch((e) => {
    reimbursementPreview.src = "/assets/photos/unchosen.svg";
    console.log(e);
  });
}

async function formDidChange() {
  if (gnft == null) {
    var gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  const isReturningOriginal = document.getElementById("reimburse_original").checked;
  let tokenIdField = document.getElementById("reimburse_tokenId");
  var reimbursementPreview = document.getElementById("reimbursementPreview");
  checkApproval(nftAddress); //Sets up approval submit button
  if (isReturningOriginal) {
    reimbursementPreview.src = document.getElementById("mainImage").src;
    tokenIdField.value = gnft.tokenId;
    tokenIdField.disabled = true;
  } else {
    tokenIdField.disabled = false;
    if (tokenIdField.value != "") {
      tryToObtainNFTPhoto(tokenIdField.value);
    }
  }
}

async function sendRepay() {
  if (gnft == null) {
    var gnft = await findNFTWithTypes(nftAddress, tokenId);
  }
  const reimbursementTokenId = document.getElementById("reimburse_tokenId").value;
  const isReturningOriginal = document.getElementById("reimburse_original").checked;
  let reimburseSubmit = document.getElementById("reimburseSubmit");

  if (reimburseSubmit.value == "Approve") {
    try {
      //Animate loader
      await setApprovalForAll(nftAddress);
      reimburseSubmit.value = "Reimburse NFT";
    } catch(error) {
      alert(error);
    }
  } else if (reimburseSubmit.value == "Reimburse NFT" && reimbursementTokenId != "") {
    try {
      //Animate loader
      console.log("Token for which to be repaid", reimbursementTokenId, " For ", gnft.tokenId);
      let tx = await balloonContract.connect(provider.getSigner()).reimburseNFT(nftAddress, isReturningOriginal ? gnft.tokenId: reimbursementTokenId, gnft.tokenId);
    } catch(error) {
      alert(error);
    }
  }
}
