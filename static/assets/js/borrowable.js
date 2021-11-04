const enableEthereumButton = document.getElementById("enableEthereumButton");
const borrowButton = document.getElementById("borrowButton");
const withdrawButton = document.getElementById("withdrawButton");

enableEthereumButton.style.display = "none";
borrowButton.style.display = "none";
withdrawButton.style.display = "none";

let accounts = [];

enableEthereumButton.addEventListener('click', () => {
  console.log("should go");
  getAccount();
});

borrowButton.addEventListener('click', () => {
  sendBorrow();
});

withdrawButton.addEventListener('click', () => {
  sendWithdraw();
});


if (!isBeingBorrowed) {
  if (accounts.length == 0) {
    enableEthereumButton.style.display = "block";
  } else if (accounts.length > 0 && accounts[0] != lender) {
    borrowButton.style.display = "block";
  } else if (accounts.length > 0 && accounts[0] == lender) {
    withdrawButton.style.display = "block";
  }
}


function sendBorrow() {
  ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: contractAddress,
          value: collateralRequirement.toString(16),
          gas: '0x2710',
          data: borrowData,
        },
      ],
    })
    .then((txHash) => {
      console.log(txHash);
      //Throw up tx hash
    }).catch((error) => {
      console.error;
      //Throw error message
    });
}

function sendWithdraw() {
  ethereum.request({
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
    });
}

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  enableEthereumButton.style.display = "none";
  if (accounts[0] == lender) {
    withdrawButton.style.display = "block";
  } else if (accounts[0] != lender) {
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

document.getElementById("loanDuration").innerHTML = "Loan Duration (i): " + secondsToDhms(loanDuration);
