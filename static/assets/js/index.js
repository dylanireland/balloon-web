document.getElementById("learnmore").onclick = function() {
  doScrolling("#about", 500);
}

//Daniel Sawka https://stackoverflow.com/users/2643692/daniel-sawka
function getElementY(query) {
  return window.pageYOffset + document.querySelector(query).getBoundingClientRect().top
}

function doScrolling(element, duration) {
	var startingY = window.pageYOffset
  var elementY = getElementY(element)
  var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
	var diff = targetY - startingY
  var easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }
  var start

  if (!diff) return

	window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp
    var time = timestamp - start
    var percent = Math.min(time / duration, 1)
    percent = easing(percent)

    window.scrollTo(0, startingY + diff * percent)

    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
}
if ((window.innerWidth / window.innerHeight) > 0.625) { //Is not on mobile, > 10 / 16
  //Tim T@https://stackoverflow.com/users/10499128/tim-t
  document.getElementById("body").onscroll = function paraScroll() {
      var scrolltotop = document.scrollingElement.scrollTop;
      var target = document.getElementById("background");
      var xvalue = "center";
      var factor = 0.5;
      var yvalue = scrolltotop * factor;
      target.style.backgroundPosition = xvalue + " " + yvalue + "px";
  }

  $('.js-tilt').tilt({
  	scale: 1,
  	glare: true,
    maxGlare: 0.3
  });
} else {
  const easyLending = document.getElementById("easyLending");
  const easyLeft = easyLending.getElementsByClassName("easyLeft")[0];
  const easyLeftClone = easyLeft.cloneNode(true);
  easyLeft.parentNode.appendChild(easyLeftClone);
  easyLeft.remove();
}

document.getElementById("linkEtherscanLink").onclick = function() { window.open("https://rinkeby.etherscan.io/address/" + contractAddress, '_blank'); };
document.getElementById("linkTwitterLink").onclick = function() { window.open("https://twitter.com/BalloonProtocol", '_blank'); };
