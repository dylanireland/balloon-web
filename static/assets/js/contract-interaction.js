var provider = new ethers.providers.Web3Provider(window.ethereum);

const balloonABI = [
  "function depositNFT(IERC721 nft, uint256 tokenId, uint256 valuation, uint256 desiredInterest, uint256 loanDuration, uint256 collateralMultiplier, bool startLive, bool shouldRelist) public",
  "function withdrawNFT(address nftAddy, uint256 tokenId) external",
  "function onERC721Received(address operator, address from, uint256 tokenId, bytes data) external returns (bytes4)",
  "function getAllNFTs() public view returns (NFT[])",
  "function findNFT(address nftAddy, uint256 tokenId) external view returns (NFT)",
  "function borrow(address lender, address nftAddy, uint256 tokenId) external payable",
  "function reimburseNFT(address nftAddy, uint256 tokenId, uint256 forTokenId) external",
  "function liquidate(address nftAddy, uint256 tokenId) external",
  "function withdrawFees() external",
  "function flipBorrowAbility(address nftAddy, uint256 tokenId) public",
  "function findNFTWithTypes(address nftAddy, uint256 tokenId) external view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
  "function getNFTAtIndex(uint256 index) public view returns (address, address, address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
  "function updateName(string memory name) external",
  "function updatePFP(address nftAddress, uint256 tokenId) external",
  "function getAllNFTsLength() public view returns (uint256)"
];

const ERC721BaseABI = [
  "function tokenURI(uint256 _tokenId) public view returns (string)"
];

var balloonContract = new ethers.Contract(contractAddress, balloonABI, provider);

async function getAllNFTsLength() {
  return await balloonContract.getAllNFTsLength();
}

function getNFTURI(nft) {
  return new Promise((resolve, reject) => {
    var erc721Base = new ethers.Contract(nft.addy, ERC721BaseABI, provider);
    erc721Base.tokenURI(nft.tokenId).then((tokenURI) => {
      resolve(tokenURI);
    }).catch((error) => {
      reject(error);
    });
  });
}

async function getNFTMetadata(uri) {
  return new Promise((resolve, reject) => {
    fetch("http://balloon.dylanireland.com:8080/" + uri, {method: "GET", redirect: "follow"}).then(response => response.json()).then(data => {
      resolve(data);
    }).catch((error) => {
      alert(error);
      resolve(error);
    });
  });
}

function findNFTWithTypes(address, tokenId) {
  return new Promise((resolve, reject) => {
    balloonContract.findNFTWithTypes(address, tokenId).then((value) => {
      var NFT = makeNFT();
      var nft = new NFT(value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12]);
      resolve(nft);
    }).catch((error) => {
      reject(error);
    });
  })
}

function getNFTAtIndex(index) {
  return new Promise((resolve, reject) => {
    balloonContract.getNFTAtIndex(index).then((value) => {
      var NFT = makeNFT();
      var nft = new NFT(value[0], value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12]);
      resolve(nft);
    }).catch((error) => {
      reject(error);
    });
  })
}


function makeNFT() {
  var names = ["lender", "borrower", "addy", "tokenId", "valuation", "desiredInterest", "loanDuration", "loanStartTime", "collateralMultiplier", "isBeingBorrowed", "live", "shouldRelist", "collateral"];
  function constructor() {
    for (var i = 0; i < names.length; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}
