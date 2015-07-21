var myScroll;

var pullDownEl, pullDownElHeight,
    pullUpEl, pullUpElHeight;

function loaded () {
	myScroll = new IScroll('#wrapper', { 
    probeType: 3,
    mouseWheel: true });

  pullDownEl = document.getElementById("pullDown");
  pullDownElHeight = pullDownEl.offsetHeight;
  pullUpEl = document.getElementById("pullUp");
  pullUpElHeight = pullUpEl.offsetHeight;

  myScroll.on("scroll", logPosition);
  myScroll.on("scrollEnd", logPosition);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

function logPosition() {
  console.log("Position:", parseInt(myScroll.y));
}
