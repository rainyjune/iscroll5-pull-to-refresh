(function(IScroll) {
  "use strict";

  function MyScroll(wrapper, options) {
    options = options || {};
    IScroll.utils.extend(options, {
      probeType: 3,
      scrollbars: true,
      mouseWheel: true 
    });
    this.options = options;
    this.instance = new IScroll(wrapper, options);
    this.maxScrollY = this.instance.maxScrollY; // local variable

    if (options.pullUpEl) {
      this.pullUpEl = this.instance.wrapper.querySelector(options.pullUpEl);
      if (this.pullUpEl) {
        this.pullUpElHeight = this.pullUpEl.offsetHeight;
        this.pullUpLabel = this.pullUpEl.querySelector(".pullUpLabel");
      }
    }
    this.bindEvents();
  }

  MyScroll.prototype.bindEvents = function() {
    document.addEventListener('touchmove', preventDefault, false);
    this.instance.on("scroll", onScrollMove);
    this.instance.on("scrollEnd", onScrollEnd);

    var self = this;
    var pullUpEl = this.pullUpEl,
        pullUpLabel = this.pullUpLabel,
        pullUpElHeight = this.pullUpElHeight;
    var maxScrollY = this.maxScrollY;

    function logPosition() {
      console.log("Position:", parseInt(self.instance.y));
    }

    function onScrollMove() {
      logPosition();
      var y = this.y;
      if (pullUpEl && pullUpElHeight && (y <= self.maxScrollY - pullUpElHeight) && !pullUpEl.className.match("flip") && !pullUpEl.className.match("loading")) {
        onPullUpAction();
      } else if (pullUpEl && pullUpElHeight && (y > self.maxScrollY - pullUpElHeight) && pullUpEl.className.match("flip")) {
        self.restorePullUpButton();
      }
    }

    function onScrollEnd() {
      var flipEl;
      if (pullUpEl && pullUpEl.className.match("flip")) {
        flipEl = pullUpEl;
      }
      if (flipEl) {
        setLoadingStatus(flipEl);
        if (self.options.pullUpAction) {
          self.options.pullUpAction();
        }
      }
    }

    function setLoadingStatus(flipEl) {
      flipEl.className = "loading";
      var label = flipEl.querySelector('span[class$="Label"]');
      label.innerHTML = label.getAttribute("data-loadingText");
    }

    function onPullUpAction() {
      console.log("Pull up");
      pullUpEl.className = "flip";
      pullUpLabel.innerText = pullUpLabel.getAttribute("data-flipText");
      self.instance.maxScrollY = self.instance.maxScrollY - pullUpElHeight;
    }

  };

  // Remember to refresh when contents are loaded (ie: on ajax completion)
  MyScroll.prototype.refresh = function() {
    this.instance.refresh();   
    this.maxScrollY = this.instance.maxScrollY; 
    this.restorePullUpButton();
  }

  MyScroll.prototype.restorePullUpButton = function() {
    this.pullUpEl.className = "";
    this.pullUpLabel.innerText = this.pullUpLabel.getAttribute("data-defaultText"); 
    this.instance.maxScrollY = this.maxScrollY; 
  }

  MyScroll.prototype.destroy = function() {
    this.maxScrollY = null;
    this.options = null;
    this.pullUpEl = null;
    this.pullUpElHeight = null;
    this.pullUpLabel = null;
    document.removeEventListener('touchmove', preventDefault, false);
    // Destroy the instance
    this.instance.destroy();
    this.isntance = null;
  };

  MyScroll.prototype.disablePull = function() {

  };

  function preventDefault(e) {
    e.preventDefault(); 
  }

  window.MyScroll = MyScroll;
}(IScroll));
