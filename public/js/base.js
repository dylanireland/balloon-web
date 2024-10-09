//Escaper
//silverlightfox@https://stackoverflow.com/users/413180/silverlightfox
function escapeHTML(unsafe_str) {
    return unsafe_str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#39;').replace(/\//g, '&#x2F;')
}

var navLogo = document.getElementsByClassName("navLogo")[0];
if (!!navLogo) {
  navLogo.addEventListener('click', () => {
    window.location.href = "/";
  });
}

var backButton = document.getElementById("navAcc");
if (!!backButton) {
  document.getElementById("navAcc").addEventListener('click', () => {
    window.location.href = "/dapp";
  });
}

function truncate(str, n) {
  return (str.length > n) ? str.substr(0, n-1) + "..." : str;
};

function truncaddy(str, n) {
  return (str.length > n) ? str.substr(0, n-1) + "..." + str.substr(str.length - n + 2, str.length) : str;
};
