var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;
  
// MY 
var scrolling = false;
var scrollStartPosition = {
  x: 0,
  y: 0
};
// Parameter 
var scrollYOffset = 10;


function pullDownAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');

		for (i=0; i<3; i++) {
			li = document.createElement('li');
			li.innerText = 'Generated row ' + (++generatedCount);
			el.insertBefore(li, el.childNodes[0]);
		}
		
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
    ////
    refreshHandler();
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function pullUpAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');

		for (i=0; i<3; i++) {
			li = document.createElement('li');
			li.innerText = 'Generated row ' + (++generatedCount);
			el.appendChild(li, el.childNodes[0]);
		}
		
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
    ////
    refreshHandler();
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new IScroll('#wrapper', {
		useTransition: true,
    // NOTE : Not exists in iScroll 5!
		topOffset: pullDownOffset,
    probeType: 2,
    mouseWheel: true,
    scrollbars: false,
    fadeScrollbars: false, // Leave this to false to spare resources.
    tap: true, // This is the suggested way to handle user interaction with clickable elements.
		onRefresh: function () {
			
		},
		onScrollMove: function () {
			
		},
		onScrollEnd: function () {
			
		}
	});
  
  myScroll.on('scrollStart', function(){
    scrolling = true;
    scrollStartPosition.x = this.x;
    scrollStartPosition.y = this.y;
  });
  
  myScroll.on('scroll', scrollingHandler);
  
  // TODO Button is Visible?
  myScroll.on('scrollEnd', function() {
    scrolling = false;
    var nowY = this.y,
        startY = scrollStartPosition.y;
    // Make sure the scroll is expected.
    if (Math.abs(nowY - startY) > scrollYOffset) {
      if (nowY > startY) {
        // Pull Down
        pullDownAction();
      } else {
        // Pull Up
        pullUpAction();
      }
      //refreshHandler();
      scrollEndUpdateButtonsHandler();
    }
    
  });
  
  function scrollEndUpdateButtonsHandler() {
    if (pullDownEl.className.match('flip')) {
      pullDownEl.className = 'loading';
      pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
      pullDownAction();	// Execute custom function (ajax call?)
    } else if (pullUpEl.className.match('flip')) {
      pullUpEl.className = 'loading';
      pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';				
      pullUpAction();	// Execute custom function (ajax call?)
    }
  }
  
  function scrollingHandler() {
    if (this.y > 5 && !pullDownEl.className.match('flip')) {
      pullDownEl.className = 'flip';
      pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
      this.minScrollY = 0;
    } else if (this.y < 5 && pullDownEl.className.match('flip')) {
      pullDownEl.className = '';
      pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
      this.minScrollY = -pullDownOffset;
    } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
      pullUpEl.className = 'flip';
      pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
      this.maxScrollY = this.maxScrollY;
    } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
      pullUpEl.className = '';
      pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
      this.maxScrollY = pullUpOffset;
    }
  }
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

  function refreshHandler() {
    if (pullDownEl.className.match('loading')) {
      pullDownEl.className = '';
      pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
    } else if (pullUpEl.className.match('loading')) {
      pullUpEl.className = '';
      pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
    }
  }

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);