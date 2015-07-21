var scrollObj;
var generatedCount = 0;

function loaded () {
	scrollObj = new MyScroll('#wrapper', {
    pullUpEl: "#pullUp",
    pullUpAction: requestNewData 
  });
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
    scrollObj.refresh();
  }, 1000); // <-- Simulate network congestion, remove setTimeout from production!    
}
