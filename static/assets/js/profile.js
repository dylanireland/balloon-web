var depositButton = document.getElementById("depositButton");
let depositSubmit = document.getElementById("depositSubmit");

//Check if rerouted from homepage deposit
if (window.location.search.substr(1) == "func=deposit") {
	showDepositMenu();
}

var redirectToBorrowable = function (evt) {
	const uri =
		"/nft/" + evt.currentTarget.address + "/" + evt.currentTarget.tokenId;
	window.location.href = uri;
};

if (window.ethereum != null) {
	ethereum.on("chainChanged", chainId => {
		if (chainId == 4) {
			window.location.reload();
		}
	});

	ethereum.on("accountsChanged", function (accounts) {
		location.reload();
	});
}

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

		if (i == 0) {
			//If i == 0, clone is original
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

		clone.addEventListener("click", redirectToBorrowable, true);
		clone.address = currentNFT.addy;
		clone.tokenId = currentNFT.tokenId;

		var depositsDiv = document.getElementsByClassName("deposits")[0];
		if (i == 0) {
			gridClone.getElementsByClassName("nftObject")[0].remove();
			depositsDiv.insertBefore(
				gridClone,
				depositsDiv.getElementsByClassName("btn_next")[0]
			);
		} else if (i % 8 == 0) {
			gridClone.style.display = "none";
			depositGrids.push(gridClone);
			depositsDiv.insertBefore(
				gridClone,
				depositsDiv.getElementsByClassName("btn_next")[0]
			);
		}
		gridClone.append(clone);
	}
	if (length <= 8) {
		document
			.getElementsByClassName("deposits")[0]
			.getElementsByClassName("btn_prev")[0]
			.remove();
		document
			.getElementsByClassName("deposits")[0]
			.getElementsByClassName("btn_next")[0]
			.remove();
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

		if (i == 0) {
			//If i == 0, clone is original
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

		clone.addEventListener("click", redirectToBorrowable, true);
		clone.address = currentNFT.addy;
		clone.tokenId = currentNFT.tokenId;

		var borrowsDiv = document.getElementsByClassName("borrows")[0];
		if (i == 0) {
			gridClone.getElementsByClassName("nftObject")[0].remove();
			borrowsDiv.insertBefore(
				gridClone,
				borrowsDiv.getElementsByClassName("btn_next")[0]
			);
		} else if (i % 4 == 0) {
			gridClone.style.display = "none";
			borrowGrids.push(gridClone);
			borrowsDiv.insertBefore(
				gridClone,
				borrowsDiv.getElementsByClassName("btn_next")[0]
			);
		}
		gridClone.append(clone);
	}
	if (length <= 4) {
		document
			.getElementsByClassName("borrows")[0]
			.getElementsByClassName("btn_prev")[0]
			.remove();
		document
			.getElementsByClassName("borrows")[0]
			.getElementsByClassName("btn_next")[0]
			.remove();
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

		if (i == 0) {
			//If i == 0, clone is original
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

		clone.addEventListener("click", redirectToBorrowable, true);
		clone.address = currentNFT.addy;
		clone.tokenId = currentNFT.tokenId;

		var loansDiv = document.getElementsByClassName("loans")[0];
		if (i == 0) {
			gridClone.getElementsByClassName("nftObject")[0].remove();
			loansDiv.insertBefore(
				gridClone,
				loansDiv.getElementsByClassName("btn_next")[0]
			);
		} else if (i % 4 == 0) {
			gridClone.style.display = "none";
			loanGrids.push(gridClone);
			loansDiv.insertBefore(
				gridClone,
				loansDiv.getElementsByClassName("btn_next")[0]
			);
		}
		gridClone.append(clone);
	}
	if (length <= 4) {
		document
			.getElementsByClassName("loans")[0]
			.getElementsByClassName("btn_prev")[0]
			.remove();
		document
			.getElementsByClassName("loans")[0]
			.getElementsByClassName("btn_next")[0]
			.remove();
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

function showDepositMenu() {
	const modalWrapper = document.getElementById("modalWrapper");
	const depositModalWrapper = document.getElementById("depositModalWrapper");

	depositSubmit.style.display = "none";
	depositModalWrapper.style.display = "block";
}

document.getElementById("editProfile").onclick = function () {
	modalWrapper.style.display = "block";
};

document.getElementById("depositButton").onclick = function () {
	showDepositMenu();
};

window.onclick = function (event) {
	if (event.target == modalWrapper) {
		modalWrapper.style.display = "none";
	} else if (event.target == depositModalWrapper) {
		depositModalWrapper.style.display = "none";
	}
};

$(function () {
	$("input").on("change", function () {
		var input = $(this);
		if (input.val().length) {
			input.addClass("populated");
		} else {
			input.removeClass("populated");
		}
	});
});

/* PROFILE UPDATER */

async function handleProfileUpdate(form) {
	let nameField = document.getElementById("nameField");
	let addressField = document.getElementById("addressField");
	let tokenIdField = document.getElementById("tokenIdField");
	if (
		nameField.value == "" &&
		addressField.value == "" &&
		tokenIdField.value == ""
	) {
		//They entered nothing
		return;
	} else if (
		nameField.value == "" &&
		addressField.value != "" &&
		tokenIdField.value != ""
	) {
		let tx = await balloonContract
			.connect(provider.getSigner())
			.updatePFP(addressField.value, tokenIdField.value);
		//Just Update PFP
		return;
	} else if (
		nameField.value != "" &&
		addressField.value == "" &&
		tokenIdField.value == ""
	) {
		let tx = await balloonContract
			.connect(provider.getSigner())
			.updateName(nameField.value);
		//Just Update Name
		return;
	} else if (
		nameField.value != "" &&
		addressField.value != "" &&
		tokenIdField.value != ""
	) {
		let tx = await balloonContract
			.connect(provider.getSigner())
			.updateNameAndPFP(
				nameField.value,
				addressField.value,
				tokenIdField.value
			);
		//Update Both
		return;
	} else {
		//This will only call if one of the two PFP fields is empty, but not both
		return;
	}
}

async function getAccount() {
	accounts = await ethereum.request({ method: "eth_requestAccounts" });
	loadProfile(accounts[0]);
}

async function loadProfile(address) {
	let pfp = document.getElementById("pfp");
	let profileName = document.getElementById("profileName");
	let profile = await balloonContract.getProfile(address);
	if (profile[1] != "0x0000000000000000000000000000000000000000") {
		let pfpURI = await getPFPURI(profile[1], profile[2]);
		let metadata = await getNFTMetadata(pfpURI);
		pfp.src = metadata.image;
	}
	if (profile[0] != "") {
		profileName.innerHTML = profile[0];
	} else {
		profileName.innerHTML = truncaddy(address, 7);
	}
}

/* DEPOSITS */

async function tryToObtainNFTPhoto() {
	const addressValue = document.getElementById("deposit_nft_address").value;
	const tokenIdValue = document.getElementById("deposit_tokenId").value;
	let depositPreview = document.getElementById("depositPreview");
	if (addressValue != "" && tokenIdValue != "") {
		checkApproval(addressValue);
		getPFPURI(addressValue, tokenIdValue)
			.then(uri => {
				getNFTMetadata(uri)
					.then(metadata => {
						depositPreview.src = metadata.image;
					})
					.catch(e => {
						depositPreview.src = "/assets/photos/unchosen.svg";
						console.log(e);
					});
			})
			.catch(e => {
				depositPreview.src = "/assets/photos/unchosen.svg";
				console.log(e);
			});
	} else {
		depositPreview.src = "/assets/photos/unchosen.svg";
	}
}

function prepareForDeposit() {}

async function checkApproval(address) {
	depositSubmit.style.display = "block";
	if (accounts.length == 0) {
		depositSubmit.value = "Not Connected";
		return;
	}

	isApprovedForAll(address, provider.getSigner().getAddress(), contractAddress)
		.then(isApproved => {
			if (isApproved) {
				depositSubmit.value = "Deposit";
			} else if (!isApproved) {
				depositSubmit.value = "Approve";
			}
		})
		.catch(e => {
			depositSubmit.value = "Error Checking Approval";
		});
}

async function deposit() {
	var addressValue = document.getElementById("deposit_nft_address").value;
	var tokenIdValue = document.getElementById("deposit_tokenId").value;
	var valuationValue = new BigNumber(
		document.getElementById("deposit_valuation").value
	);
	var interestValue = new BigNumber(
		document.getElementById("deposit_interest").value
	);
	var durationValue = document.getElementById("deposit_duration").value;
	var multiplierValue = new BigNumber(
		document.getElementById("deposit_collateral_multiplier").value
	);
	var startLiveValue = document.getElementById("deposit_start_live").checked;
	var shouldRelistValue = document.getElementById(
		"deposit_should_relist"
	).checked;

	const loader = document.getElementById("deposit_loader");

	if (accounts.length == 0) {
		alert("You are not connected to Ethereum");
		return;
	}

	if (depositSubmit.value == "Approve") {
		try {
			depositSubmit.value = "";
			loader.style.visibility = "visible";
			await setApprovalForAll(addressValue);
			loader.style.visibility = "hidden";
			depositSubmit.value = "Deposit";
		} catch (error) {
			loader.style.visibility = "hidden";
			depositSubmit.value = "Deposit";
			alert(error);
		}
	} else if (
		depositSubmit.value == "Deposit" &&
		addressValue != "" &&
		tokenIdValue != "" &&
		valuationValue != "" &&
		interestValue != "" &&
		durationValue != "" &&
		multiplierValue != ""
	) {
		try {
			depositSubmit.value = "";
			loader.style.visibility = "visible";
			const ten = new BigNumber(10);
			let tx = await balloonContract
				.connect(provider.getSigner())
				.depositNFT(
					addressValue,
					tokenIdValue,
					valuationValue.times(ten.pow(18)).toString(),
					interestValue.times(100).toString(),
					durationValue,
					multiplierValue.times(100).toString(),
					startLiveValue,
					shouldRelistValue
				);
			console.log(valuationValue.times(ten.pow(18)).toString());
			tx.wait()
				.then(() => {
					location.href = "/profile";
				})
				.catch(error => {
					depositSubmit.value = "Deposit";
					loader.style.visibility = "hidden";
					alert(error);
				});
		} catch (error) {
			depositSubmit.value = "Deposit";
			loader.style.visibility = "hidden";
			alert(error);
		}
	}
}

async function checkNetToLayout() {
	const { chainId } = await provider.getNetwork();
	if (chainId == 0xaa36a7) {
		getAccount();

		makeDeposits();
		makeBorrows();
		makeLoans();
		return;
	}
	document.getElementById("showoff").style.display = "none";
	document.getElementById("statii").style.display = "none";
	document.getElementById("depositContainer").style.display = "none";
	const p = document.createElement("p");
	p.innerHTML = "Please switch to the Sepolia testnet to use Balloon.";
	p.style.textAlign = "center";
	p.style.marginTop = "20px";
	document.getElementById("home").appendChild(p);
}

checkNetToLayout();
