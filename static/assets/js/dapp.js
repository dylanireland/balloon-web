var nftElements = document.getElementsByClassName("nftElement");

var redirectToBorrowable = function() {
    const address = this.getAttribute("data-address");
    const tokenId = this.getAttribute("data-tokenId");
    console.log(address);
    console.log(tokenId);
    const uri = "/borrowable/" + address + "/" + tokenId;
    console.log(uri);
    window.location.href = uri;
};

for (var i = 0; i < nftElements.length; i++) {
    nftElements[i].addEventListener('click', redirectToBorrowable, false);
}

function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + "..." : str;
};

var collectionNames = document.getElementsByClassName("nftCollectionName");
for (var i = 0; i < collectionNames.length; i++) {
  collectionNames[i].innerHTML = truncate(collectionNames[i].innerHTML, 16);
}

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
