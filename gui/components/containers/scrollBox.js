(function(){
  var ScrollBox=$j.classes.ThemedControl.extend({
    _ClassName:"ScrollBox",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._viewPort=null;
        this._content=null;
        this._HScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._VScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._HScrollBar.onChange.addListener(this.HScroll);
        this._VScrollBar.onChange.addListener(this.VScroll);
        this._lastDelta=new $j.classes.Point;
        this._downPos=new $j.classes.Point;
        this._currentPos=new $j.classes.Point;
        this._down=false;
        this._HScrollAni=null;
        this._VScrollAni=null;
        //#endregion
        this.hitTest.mouseWheel=true;
        this.mouseTracking=true;
        this.animated=true;
      }
    },
    //#region Methods
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._VScrollBar.getDOMObj(this._DOMObj.lastElementChild.id);
        this._VScrollBar.getChildsDOMObj();
        this._HScrollBar._DOMObj=this._VScrollBar._DOMObj.previousSibling;
        while (this._HScrollBar._DOMObj.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._HScrollBar._DOMObj=this._HScrollBar._DOMObj.previousSibling;
        }
        this._HScrollBar.getDOMObj(this._HScrollBar._DOMObj.id);
        this._HScrollBar.getChildsDOMObj();
        this._viewPort=this._DOMObj.firstElementChild;
        this._viewPort.jsObj=this;
        this._content=new $j.classes.Layout(this);
        this._content._DOMObj=this._viewPort.firstElementChild;
        this._content._DOMObj.jsObj=this;
        this._content.getChildsDOMObj();
        this._HScrollBar.updateFromDOM();
        this._VScrollBar.updateFromDOM();
      }
    },
    HScroll:function() {
      var scrollBox=this._owner;
      scrollBox._content._DOMObj.style[$j.types.jsCSSProperties.LEFT]=(-this.value)+$j.types.CSSUnits.PX;
    },
    VScroll:function() {
      var scrollBox=this._owner;
      scrollBox._content._DOMObj.style[$j.types.jsCSSProperties.TOP]=(-this.value)+$j.types.CSSUnits.PX;
    },
    mouseWheel:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) {
        this._VScrollBar.mouseWheel();
      } else if (data===$j.types.scrollbars.HORIZONTAL) {
        this._HScrollBar.mouseWheel();
      }
    },
    update:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        if (!$j.tools.isNull(this._content)) {
          var i,childs=this._content._DOMObj.childNodes,l=childs.length,maxX=0,maxY=0,viewHS=false,viewVS=false;
          for (i=0;i<l;i++) {
            if (childs[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
              if (childs[i].offsetLeft+childs[i].offsetWidth>maxX) maxX=childs[i].offsetLeft+childs[i].offsetWidth;
              if (childs[i].offsetTop+childs[i].offsetHeight>maxY) maxY=childs[i].offsetTop+childs[i].offsetHeight;
            }
          }
        }
        if (maxX>this.width) viewHS=true;
        if (maxY>this.height) viewVS=true;
        if (viewHS&&viewVS) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.BOTH);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.BOTH;
        } else if (viewHS&&!viewVS) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.HORIZONTAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.HORIZONTAL;
        } else if (!viewHS&&viewVS) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.VERTICAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.VERTICAL;
        }
        else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.NONE);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.NONE;
        }
        if (!$j.tools.isNull(this._HScrollBar)) {
          this._HScrollBar.setMax(maxX);
          this._HScrollBar.setViewportSize(this.width);
        }
        if (!$j.tools.isNull(this._VScrollBar)) {
          this._VScrollBar.setMax(maxY);
          this._VScrollBar.setViewportSize(this.height);
        }
        this._HScrollBar.smallChange=~~(this._HScrollBar.viewportSize/5);
        this._VScrollBar.smallChange=~~(this._VScrollBar.viewportSize/5);
      }
    },
    loaded:function() {
      this._inherited();
      this.update();
    },
    mouseDown:function() {
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT&&this.mouseTracking){
        this._lastDelta.setValues(0,0);
        this._downPos.assign($j.mouse.screen);
        this._currentPos.assign($j.mouse.screen);
        this._down=true;
        if ((!$j.tools.isNull(this._VScrollAni))&&(this._VScrollAni.running)) this._VScrollAni.stopAtCurrent();
        if ((!$j.tools.isNull(this._HScrollAni))&&(this._HScrollAni.running)) this._HScrollAni.stopAtCurrent();
      }
    },
    mouseMove:function() {
      var data;
      this._inherited();
      if (this._down&&this.mouseTracking) {
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
        if (data===$j.types.scrollbars.VERTICAL||data===$j.types.scrollbars.BOTH) {
          this._VScrollBar.setValue(this._VScrollBar.value-($j.mouse.screen.y-this._currentPos.y));
          this._lastDelta.y=($j.mouse.screen.y-this._currentPos.y);
        }
        if (data===$j.types.scrollbars.HORIZONTAL||data===$j.types.scrollbars.BOTH) {
          this._HScrollBar.setValue(this._HScrollBar.value-($j.mouse.screen.x-this._currentPos.x));
          this._lastDelta.x=($j.mouse.screen.x-this._currentPos.x);
        }
        this._currentPos.assign($j.mouse.screen);
      }
    },
    mouseUp:function() {
      var data;
      this._inherited();
      if (this._down&&this.mouseTracking) {
        this._down=false;
        if (this.animated&&((this._lastDelta.x!==0)||(this._lastDelta.y!==0))) {
          data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
          if (data===$j.types.scrollbars.VERTICAL||data===$j.types.scrollbars.BOTH) {
            this.createVScrollAni();
            if (this._VScrollAni.running) this._VScrollAni.stopAtCurrent();
            this._VScrollAni.stopValue=this._VScrollBar.value-(this._lastDelta.y*7);
            this._VScrollAni.start();
          }
          if (data===$j.types.scrollbars.HORIZONTAL||data===$j.types.scrollbars.BOTH) {
            this.createHScrollAni();
            if (this._HScrollAni.running) this._HScrollAni.stopAtCurrent();
            this._HScrollAni.stopValue=this._HScrollBar.value-(this._lastDelta.x*7);
            this._HScrollAni.start();
          }
        }
      }
    },
    createVScrollAni:function() {
      if ($j.tools.isNull(this._VScrollAni)) {
        this._VScrollAni=new $j.classes.FloatAnimation(this);
        this._VScrollAni.animationType=$j.types.animationTypes.OUT;
        this._VScrollAni.interpolation=$j.types.interpolationTypes.QUADRATIC;
        this._VScrollAni.duration=1;
        this._VScrollAni.control=this._VScrollBar;
        this._VScrollAni.propertyName="value";
        this._VScrollAni.startFromCurrent=true;
        this._VScrollAni.convertToCSS=false;
      }
    },
    createHScrollAni:function() {
      if ($j.tools.isNull(this._HScrollAni)) {
        this._HScrollAni=new $j.classes.FloatAnimation(this);
        this._HScrollAni.animationType=$j.types.animationTypes.OUT;
        this._HScrollAni.interpolation=$j.types.interpolationTypes.QUADRATIC;
        this._HScrollAni.duration=1;
        this._HScrollAni.control=this._HScrollBar;
        this._HScrollAni.propertyName="value";
        this._HScrollAni.startFromCurrent=true;
        this._HScrollAni.convertToCSS=false;
      }
    }
    //#endregion
  });
  Object.seal(ScrollBox);
  $j.classes.register($j.types.categories.CONTAINERS,ScrollBox);
  //#region Templates
  var ScrollBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='ScrollBox' style='{style}' class='ScrollBox' data-theme='{theme}' data-scrollbars='none'>",
                    "<div class='ScrollBoxViewPort' data-theme='{theme}'>",
                    "<div class='ScrollBoxContent' data-theme='{theme}'></div>",
                    "</div>",
                    "{horizontalScrollBar}",
                    "{verticalScrollBar}",
                    "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ScrollBox,template:ScrollBoxTpl}]);
  //#endregion
})();