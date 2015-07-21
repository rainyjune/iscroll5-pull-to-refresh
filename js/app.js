var myScroll,
    maxScrollY;// local variable

var generatedCount = 0;

var pullDownEl, pullDownLabel, pullDownElHeight,
    pullUpEl, pullUpLabel, pullUpElHeight;

function loaded () {
	myScroll = new IScroll('#wrapper', { 
    probeType: 3,
    scrollbars: true,
    mouseWheel: true });

  pullDownEl = document.getElementById("pullDown");
  pullDownElHeight = pullDownEl.offsetHeight;
  pullUpEl = document.getElementById("pullUp");
  pullUpElHeight = pullUpEl.offsetHeight;

  pullDownLabel = pullDownEl.querySelector(".pullDownLabel");
  pullUpLabel = pullUpEl.querySelector(".pullUpLabel");

  maxScrollY = myScroll.maxScrollY; 

  myScroll.on("scroll", onScrollMove);
  myScroll.on("scrollEnd", onScrollEnd);
}

function onScrollMove() {
  logPosition();
  var y = this.y;
  if (pullDownEl && pullDownElHeight && y >= pullDownElHeight && !pullDownEl.className.match("flip")) {
    pullDownAction();
  } else if (pullDownEl && pullDownElHeight && y < pullDownElHeight && pullDownEl.className.match("flip")) {
    restorePullDownButton();
  } else if (pullUpEl && pullUpElHeight && (y <= maxScrollY - pullUpElHeight) && !pullUpEl.className.match("flip") && !pullUpEl.className.match("loading")) {
    pullUpAction();
  } else if (pullUpEl && pullUpElHeight && (y > maxScrollY - pullUpElHeight) && pullUpEl.className.match("flip")) {
    restorePullUpButton();
  }
}

function onScrollEnd() {
  var flipEl;
  if (pullDownEl.className.match("flip")) {
    flipEl = pullDownEl;
  } else if (pullUpEl.className.match("flip")) {
    flipEl = pullUpEl;
  }
  if (flipEl) {
    setLoadingStatus(flipEl);
    requestNewData(); // Ajax request;
  }
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

function setLoadingStatus(flipEl) {
  flipEl.className = "loading";
  var label = flipEl.querySelector('span[class$="Label"]');
  label.innerHTML = label.getAttribute("data-loadingText");
}

function pullDownAction() {
  console.log("Pull down");
  pullDownEl.className = "flip";
  pullDownLabel.innerText = pullDownLabel.getAttribute("data-flipText"); 
}

function restorePullDownButton() {
  pullDownEl.className = "";
  pullDownLabel.innerText = pullDownLabel.getAttribute("data-defaultText"); 
}

function pullUpAction() {
  console.log("Pull up");
  pullUpEl.className = "flip";
  pullUpLabel.innerText = pullUpLabel.getAttribute("data-flipText");
  myScroll.maxScrollY = maxScrollY - pullUpElHeight;
}

function restorePullUpButton() {
  pullUpEl.className = "";
  pullUpLabel.innerText = pullUpLabel.getAttribute("data-defaultText"); 
  myScroll.maxScrollY = maxScrollY; 
}

function restorePullButton() {
  restorePullUpButton();
}

function logPosition() {
  console.log("Position:", parseInt(myScroll.y));
}

function requestNewData() {
  setTimeout(function () {  // <-- Simulate network congestion, remove setTimeout from production!
    var el, li, i;
    el = document.getElementById('thelist');

    for (i=0; i<3; i++) {
    li = document.createElement('li');
    li.innerText = 'Generated row ' + (++generatedCount);
    el.appendChild(li, el.childNodes[0]);
    }

    myScroll.refresh();   // Remember to refresh when contents are loaded (ie: on ajax completion)
    maxScrollY = myScroll.maxScrollY; 
    restorePullButton();
  }, 1000); // <-- Simulate network congestion, remove setTimeout from production!    
}
