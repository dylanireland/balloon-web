var provider;

if (window.ethereum != null) {
	provider = new ethers.providers.Web3Provider(window.ethereum);
}

const balloonABI = [
	"function depositNFT(address nft, uint256 tokenId, uint256 valuation, uint256 desiredInterest, uint256 loanDuration, uint256 collateralMultiplier, bool startLive, bool shouldRelist) public",
	"function withdrawNFT(address nftAddy, uint256 tokenId) external",
	"function onERC721Received(address operator, address from, uint256 tokenId, bytes data) external returns (bytes4)",
	"function getAllNFTs() public view returns (NFT[])",
	"function findNFT(address nftAddy, uint256 tokenId) public view returns (NFT)",
	"function borrow(address lender, address nftAddy, uint256 tokenId) external payable",
	"function reimburseNFT(address nftAddy, uint256 tokenId, uint256 forTokenId) external",
	"function liquidate(address nftAddy, uint256 tokenId) external",
	"function withdrawFees() external",
	"function flipBorrowAbility(address nftAddy, uint256 tokenId) public",
	"function findNFTWithTypes(address nftAddy, uint256 tokenId) external view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
	"function getNFTAtIndex(uint256 index) public view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
	"function updateName(string memory name) public",
	"function updatePFP(address nftAddress, uint256 tokenId) public",
	"function updateNameAndPFP(string memory name, address nftAddress, uint256 tokenId) public",
	"function getAllNFTsLength() public view returns (uint256)",
	"function getBorrowedNFTsLength() public view returns (uint256)",
	"function getBorrowedNFTAtIndex(uint256 index) public view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
	"function getLentNFTsLength() public view returns (uint256)",
	"function getLentNFTAtIndex(uint256 index) public view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
	"function getDepositedNFTsLength() public view returns (uint256)",
	"function getDepositedNFTAtIndex(uint256 index) public view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
	"function getLiveNFTsLength() public view returns (uint256)",
	"function getLiveNFTAtIndex(uint256 index) public view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
	"function getName(address user) public view returns (string memory)",
	"function getPFP(address user) public view returns (address, uint256)",
	"function getProfile(address user) public view returns (string memory, address, uint256)",
	"function isLiquidatable(address nftAddy, uint256 tokenId) public view returns (bool)",
	"function isNFTLive(address nftAddy, uint256 tokenId) public view returns (bool)"
];

const ERC721BaseABI = [
	"function tokenURI(uint256 _tokenId) public view returns (string)",
	"function isApprovedForAll(address owner, address operator) external view returns (bool)",
	"function setApprovalForAll(address operator, bool _approved) external"
];

var balloonContract = new ethers.Contract(
	contractAddress,
	balloonABI,
	provider
);

async function getAllNFTsLength() {
	return await balloonContract.getAllNFTsLength();
}

async function getLiveNFTsLength() {
	return await balloonContract.getLiveNFTsLength();
}

async function getBorrowedNFTsLength() {
	return await balloonContract
		.connect(provider.getSigner())
		.getBorrowedNFTsLength();
}

async function getLentNFTsLength() {
	return await balloonContract
		.connect(provider.getSigner())
		.getLentNFTsLength();
}

async function getDepositedNFTsLength() {
	return await balloonContract
		.connect(provider.getSigner())
		.getDepositedNFTsLength();
}

async function isLive() {
	return await balloonContract.isNFTLive(nftAddress, tokenId);
}

async function isLiquidatable() {
	return await balloonContract.isLiquidatable(nftAddress, tokenId);
}

function getNFTURI(nft) {
	return new Promise((resolve, reject) => {
		var erc721Base = new ethers.Contract(nft.addy, ERC721BaseABI, provider);
		erc721Base
			.tokenURI(nft.tokenId)
			.then(tokenURI => {
				resolve(tokenURI);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function getPFPURI(address, tokenId) {
	return new Promise((resolve, reject) => {
		var erc721Base = new ethers.Contract(address, ERC721BaseABI, provider);
		erc721Base
			.tokenURI(tokenId)
			.then(tokenURI => {
				resolve(tokenURI);
			})
			.catch(error => {
				reject(error);
			});
	});
}

async function getNFTMetadata(uri) {
	return new Promise((resolve, reject) => {
		fetch("https://balloon.trading:8080/" + uri, {
			method: "GET",
			redirect: "follow"
		})
			.then(response => response.json())
			.then(data => {
				if (data.image.includes("ipfs://")) {
					data.image = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
				}
				resolve(data);
			})
			.catch(error => {
				alert(error);
				resolve(error);
			});
	});
}

async function isApprovedForAll(address, owner, operator) {
	return new Promise((resolve, reject) => {
		var erc721Base = new ethers.Contract(address, ERC721BaseABI, provider);
		erc721Base
			.isApprovedForAll(owner, operator)
			.then(isApproved => {
				resolve(isApproved);
			})
			.catch(error => {
				reject(error);
			});
	});
}

async function setApprovalForAll(address) {
	return new Promise(async (resolve, reject) => {
		var erc721Base = new ethers.Contract(address, ERC721BaseABI, provider);
		let tx = await erc721Base
			.connect(provider.getSigner())
			.setApprovalForAll(contractAddress, true);
		tx.wait()
			.then(() => {
				resolve();
			})
			.catch(e => {
				reject(e);
			});
	});
}

function findNFTWithTypes(address, tokenId) {
	return new Promise((resolve, reject) => {
		balloonContract
			.findNFTWithTypes(address, tokenId)
			.then(value => {
				var NFT = makeNFT();
				var nft = new NFT(
					value[0],
					value[1],
					value[2],
					value[3],
					value[4],
					value[5],
					value[6],
					value[7],
					value[8],
					value[9],
					value[10],
					value[11],
					value[12]
				);
				resolve(nft);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function getNFTAtIndex(index) {
	return new Promise((resolve, reject) => {
		balloonContract
			.getNFTAtIndex(index)
			.then(value => {
				var NFT = makeNFT();
				var nft = new NFT(
					value[0],
					value[1],
					value[2],
					value[3],
					value[4],
					value[5],
					value[6],
					value[7],
					value[8],
					value[9],
					value[10],
					value[11],
					value[12]
				);
				resolve(nft);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function getLiveNFTAtIndex(index) {
	return new Promise((resolve, reject) => {
		balloonContract
			.connect(provider.getSigner())
			.getLiveNFTAtIndex(index)
			.then(value => {
				var NFT = makeNFT();
				var nft = new NFT(
					value[0],
					value[1],
					value[2],
					value[3],
					value[4],
					value[5],
					value[6],
					value[7],
					value[8],
					value[9],
					value[10],
					value[11],
					value[12]
				);
				resolve(nft);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function getBorrowedNFTAtIndex(index) {
	return new Promise((resolve, reject) => {
		balloonContract
			.connect(provider.getSigner())
			.getBorrowedNFTAtIndex(index)
			.then(value => {
				var NFT = makeNFT();
				var nft = new NFT(
					value[0],
					value[1],
					value[2],
					value[3],
					value[4],
					value[5],
					value[6],
					value[7],
					value[8],
					value[9],
					value[10],
					value[11],
					value[12]
				);
				resolve(nft);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function getLentNFTAtIndex(index) {
	return new Promise((resolve, reject) => {
		balloonContract
			.connect(provider.getSigner())
			.getLentNFTAtIndex(index)
			.then(value => {
				var NFT = makeNFT();
				var nft = new NFT(
					value[0],
					value[1],
					value[2],
					value[3],
					value[4],
					value[5],
					value[6],
					value[7],
					value[8],
					value[9],
					value[10],
					value[11],
					value[12]
				);
				resolve(nft);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function getDepositedNFTAtIndex(index) {
	return new Promise((resolve, reject) => {
		balloonContract
			.connect(provider.getSigner())
			.getDepositedNFTAtIndex(index)
			.then(value => {
				var NFT = makeNFT();
				var nft = new NFT(
					value[0],
					value[1],
					value[2],
					value[3],
					value[4],
					value[5],
					value[6],
					value[7],
					value[8],
					value[9],
					value[10],
					value[11],
					value[12]
				);
				resolve(nft);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function makeNFT() {
	var names = [
		"lender",
		"borrower",
		"addy",
		"tokenId",
		"valuation",
		"desiredInterest",
		"loanDuration",
		"loanStartTime",
		"collateralMultiplier",
		"isBeingBorrowed",
		"live",
		"shouldRelist",
		"collateral"
	];
	function constructor() {
		for (var i = 0; i < names.length; i++) {
			this[names[i]] = arguments[i];
		}
	}
	return constructor;
}
