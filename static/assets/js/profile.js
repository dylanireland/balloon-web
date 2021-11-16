var redirectToBorrowable = function(address, tokenId) {
    const uri = "/borrowable/" + address + "/" + tokenId;
    window.location.href = uri;
};

var depositPage = 0;
var depositGrids = [];

var borrowPage = 0;
var borrowGrids = [];

var loanPage = 0;
var loanGrids = [];

async function makeDeposits() {
  var grid = document.getElementsByClassName("depositGrid")[0];
  var length = await getDepositedNFTsLength();
  let nftObject = grid.getElementsByClassName("nftObject")[0];
  if (length == 0) {
    nftObject.style.display = "none";
    let notifier = document.createElement("h2");
    notifier.classList.add("notifier");
    notifier.innerHTML = "You have not deposited any NFTs";
    grid.style.gridTemplateColumns = "1fr";
    grid.appendChild(notifier);
    var depositsElem = document.getElementsByClassName("deposits")[0];
    depositsElem.append(grid);
    depositsElem.getElementsByClassName("btn_prev")[0].remove();
    depositsElem.getElementsByClassName("btn_next")[0].remove();
    return;
  }

  depositGrids.push(grid.cloneNode(true));
  grid.remove();
  //Adds the first one to an array, then removes it from DOM

  var gridCounter = 0;

  for (var i = 0; i < length; i++) {
    var clone = nftObject.cloneNode(true);
    var gridClone = null;

    if (i == 0) { //If i == 0, clone is original
      clone = nftObject;
    }

    if (i % 8 == 0 && i != 0) {
      gridClone = grid.cloneNode(true);
      gridCounter++;
    } else {
      gridClone = depositGrids[gridCounter];
    }

    var currentNFT = await getDepositedNFTAtIndex(i);
    let tokenURI = await getNFTURI(currentNFT);
    let metadata = await getNFTMetadata(tokenURI);

    clone.getElementsByClassName("nftImage")[0].src = metadata.image;

    clone.addEventListener('click', function () { redirectToBorrowable(currentNFT.addy, currentNFT.tokenId) }, false);

    var depositsDiv = document.getElementsByClassName("deposits")[0];
    if (i == 0) {
      gridClone.getElementsByClassName("nftObject")[0].remove();
      depositsDiv.insertBefore(gridClone, depositsDiv.getElementsByClassName("btn_next")[0]);
    } else if (i % 8 == 0) {
      gridClone.style.display = "none";
      depositGrids.push(gridClone);
      depositsDiv.insertBefore(gridClone, depositsDiv.getElementsByClassName("btn_next")[0]);
    }
    if (length <= 8) {
      depositsDiv.getElementsByClassName("btn_prev")[0].remove();
      depositsDiv.getElementsByClassName("btn_next")[0].remove();
    }
    gridClone.append(clone);
  }
}

async function makeBorrows() {
  var grid = document.getElementsByClassName("borrowGrid")[0];
  var length = await getBorrowedNFTsLength();
  let nftObject = grid.getElementsByClassName("nftObject")[0];
  if (length == 0) {
    nftObject.style.display = "none";
    let notifier = document.createElement("h2");
    notifier.classList.add("notifier");
    notifier.innerHTML = "You have not borrowed any NFTs";
    grid.style.gridTemplateColumns = "1fr";
    grid.appendChild(notifier);
    var borrowsElem = document.getElementsByClassName("borrows")[0];
    borrowsElem.append(grid);
    borrowsElem.getElementsByClassName("btn_prev")[0].remove();
    borrowsElem.getElementsByClassName("btn_next")[0].remove();
    return;
  }

  borrowGrids.push(grid.cloneNode(true));
  grid.remove();
  //Adds the first one to an array, then removes it from DOM

  var gridCounter = 0;

  for (var i = 0; i < length; i++) {
    var clone = nftObject.cloneNode(true);
    var gridClone = null;

    if (i == 0) { //If i == 0, clone is original
      clone = nftObject;
    }

    if (i % 4 == 0 && i != 0) {
      gridClone = grid.cloneNode(true);
      gridCounter++;
    } else {
      gridClone = borrowGrids[gridCounter];
    }

    var currentNFT = await getBorrowedNFTAtIndex(i);
    let tokenURI = await getNFTURI(currentNFT);
    let metadata = await getNFTMetadata(tokenURI);

    clone.getElementsByClassName("nftImage")[0].src = metadata.image;

    clone.addEventListener('click', function () { redirectToBorrowable(currentNFT.addy, currentNFT.tokenId) }, false);
    var borrowsDiv = document.getElementsByClassName("borrows")[0];
    if (i == 0) {
      gridClone.getElementsByClassName("nftObject")[0].remove();
      borrowsDiv.insertBefore(gridClone, borrowsDiv.getElementsByClassName("btn_next")[0]);
    } else if (i % 4 == 0) {
      gridClone.style.display = "none";
      borrowGrids.push(gridClone);
      borrowsDiv.insertBefore(gridClone, borrowsDiv.getElementsByClassName("btn_next")[0]);
    }
    if (length <= 4) {
      borrowsDiv.getElementsByClassName("btn_prev")[0].remove();
      borrowsDiv.getElementsByClassName("btn_next")[0].remove();
    }
    gridClone.append(clone);
  }
}


async function makeLoans() {
  var grid = document.getElementsByClassName("loanGrid")[0];
  var length = await getLentNFTsLength();
  let nftObject = grid.getElementsByClassName("nftObject")[0];
  if (length == 0) {
    nftObject.style.display = "none";
    let notifier = document.createElement("h2");
    notifier.classList.add("notifier");
    notifier.innerHTML = "You have not lent any NFTs";
    grid.style.gridTemplateColumns = "1fr";
    grid.appendChild(notifier);
    var loansElem = document.getElementsByClassName("loans")[0];
    loansElem.append(grid);
    loansElem.getElementsByClassName("btn_prev")[0].remove();
    loansElem.getElementsByClassName("btn_next")[0].remove();
    return;
  }

  loanGrids.push(grid.cloneNode(true));
  grid.remove();
  //Adds the first one to an array, then removes it from DOM

  var gridCounter = 0;

  for (var i = 0; i < length; i++) {
    var clone = nftObject.cloneNode(true);
    var gridClone = null;

    if (i == 0) { //If i == 0, clone is original
      clone = nftObject;
    }

    if (i % 4 == 0 && i != 0) {
      gridClone = grid.cloneNode(true);
      gridCounter++;
    } else {
      gridClone = loanGrids[gridCounter];
    }

    var currentNFT = await getLentNFTAtIndex(i);
    let tokenURI = await getNFTURI(currentNFT);
    let metadata = await getNFTMetadata(tokenURI);

    clone.getElementsByClassName("nftImage")[0].src = metadata.image;

    clone.addEventListener('click', function () { redirectToBorrowable(currentNFT.addy, currentNFT.tokenId) }, false);

    var loansDiv = document.getElementsByClassName("loans")[0];
    if (i == 0) {
      gridClone.getElementsByClassName("nftObject")[0].remove();
      loansDiv.insertBefore(gridClone, loansDiv.getElementsByClassName("btn_next")[0]);
    } else if (i % 4 == 0) {
      gridClone.style.display = "none";
      loanGrids.push(gridClone);
      loansDiv.insertBefore(gridClone, loansDiv.getElementsByClassName("btn_next")[0]);
    }
    if (length <= 4) {
      loansDiv.getElementsByClassName("btn_prev")[0].remove();
      loansDiv.getElementsByClassName("btn_next")[0].remove();
    }
    gridClone.append(clone);
  }
}



function prevPage(which) {
    switch (which) {
      case 0: //Deposits
        if (depositPage == 0) {
          depositGrids[depositPage].style.display = "none";
          depositPage = depositGrids.length - 1;
          depositGrids[depositPage].style.display = "grid";
        } else {
          depositGrids[depositPage--].style.display = "none";
          depositGrids[depositPage].style.display = "grid";
        }
        break;
      case 1: //Borrows
        if (borrowPage == 0) {
          borrowGrids[borrowPage].style.display = "none";
          borrowPage = borrowGrids.length - 1;
          borrowGrids[borrowPage].style.display = "grid";
        } else {
          borrowGrids[borrowPage--].style.display = "none";
          borrowGrids[borrowPage].style.display = "grid";
        }
        break;
      case 2: //Loans
        if (loanPage == 0) {
          loanGrids[loanPage].style.display = "none";
          loanPage = loanGrids.length - 1;
          loanGrids[loanPage].style.display = "grid";
        } else {
          loanGrids[loanPage--].style.display = "none";
          loanGrids[loanPage].style.display = "grid";
        }
        break;
      default:
        return; //Shoudnt happen
    }

}

function nextPage(which) {
  switch (which) {
    case 0: //Deposits
      if (depositPage + 1 == depositGrids.length) {
        depositGrids[depositPage].style.display = "none";
        depositPage = 0;
        depositGrids[depositPage].style.display = "grid";
      } else {
        depositGrids[depositPage++].style.display = "none";
        depositGrids[depositPage].style.display = "grid";
      }
      break;
    case 1: //Borrows
      if (borrowPage + 1 == borrowGrids.length) {
        borrowGrids[borrowPage].style.display = "none";
        borrowPage = 0;
        borrowGrids[borrowPage].style.display = "grid";
      } else {
        borrowGrids[borrowPage++].style.display = "none";
        borrowGrids[borrowPage].style.display = "grid";
      }
      break;
    case 2: //Loans
      if (loanPage + 1 == loanGrids.length) {
        loanGrids[loanPage].style.display = "none";
        loanPage = 0;
        loanGrids[loanPage].style.display = "grid";
      } else {
        loanGrids[loanPage++].style.display = "none";
        loanGrids[loanPage].style.display = "grid";
      }
      break;
    default:
      return; //Shoudnt happen
  }


}

var modalWrapper = document.getElementById("modalWrapper");

document.getElementById("editProfile").onclick = function () {
  modalWrapper.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == modalWrapper) {
    modalWrapper.style.display = "none";
  }
}

$(function() {
  $('input').on('change', function() {
    var input = $(this);
    if (input.val().length) {
      input.addClass('populated');
    } else {
      input.removeClass('populated');
    }
  });
});


/* PROFILE UPDATER */

async function handleProfileUpdate(form) {
  let nameField = document.getElementById("nameField");
  let addressField = document.getElementById("addressField");
  let tokenIdField = document.getElementById("tokenIdField");
  if (nameField.value == "" && addressField.value == "" && tokenIdField.value == "") {
    //They entered nothing
    return;
  } else if (nameField.value == "" && addressField.value != "" && tokenIdField.value != "") {
    let tx = await balloonContract.connect(provider.getSigner()).updatePFP(addressField.value, tokenIdField.value);
    //Just Update PFP
    return;
  } else if (nameField.value != "" && addressField.value == "" && tokenIdField.value == "") {
    let tx = await balloonContract.connect(provider.getSigner()).updateName(nameField.value);
    //Just Update Name
    return;
  } else if (nameField.value != "" && addressField.value != "" && tokenIdField.value != "") {
    let tx = await balloonContract.connect(provider.getSigner()).updateNameAndPFP(nameField.value, addressField.value, tokenIdField.value);
    //Update Both
    return;
  } else {
    //This will only call if one of the two PFP fields is empty, but not both
    return;
  }


  console.log(nameField.value == "");
}

makeDeposits();
makeBorrows();
makeLoans();
