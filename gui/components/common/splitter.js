(function(){
  var Splitter=$j.classes.Control.extend({
    _ClassName: "Splitter",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._down=false;
        this._downPos=new $j.classes.Point;
        this._firstCtrl=null;
        this._lastCtrl=null;
        this._lastLeft=0;
        //#endregion Private
        this.minSize=10;
        this.collapsible=false;
        this.orientation=$j.types.orientations.VERTICAL;
      }
    },
    //#region Private
    setOrientation:function(newValue) {
      if (!$j.tools.valueInset(newValue,$j.types.orientations)) return;
      if (this.orientation!==newValue) {
        this.orientation=newValue;
        if (this.orientation===$j.types.orientations.VERTICAL) {
          this.setAlign($j.types.aligns.LEFT);
        } else {
          this.setAlign($j.types.aligns.TOP);
        }
        //this._owner.realignChilds();
      }
    },
    setCollapsible:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.collapsible!==newValue) {
        this.collapsible=newValue;
      }
    },
    setMinSize:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.minSize!==newValue) {
        this.minSize=newValue;
      }
    },
    //#endregion Private
    //#region Methods
    updateFromDOM: function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-firstctrl"):this._DOMObj.dataset.firstctrl;
      if (!$j.tools.isNull(data)) this._firstCtrl=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-lastctrl"):this._DOMObj.dataset.lastctrl;
      if (!$j.tools.isNull(data)) this._lastCtrl=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-minsize"):this._DOMObj.dataset.minsize;
      if (!$j.tools.isNull(data)) this.minSize=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-collapsible"):this._DOMObj.dataset.collapsible;
      if (!$j.tools.isNull(data)) this.collapsible=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-orientation"):this._DOMObj.dataset.orientation;
      if (!$j.tools.isNull(data)) this.orientation=data;
    },
    mouseDown:function() {
      var resizeLine,p;
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT){
        this.checkCtrls();
        if (!this.canCollapse()) {
          this._downPos.assign($j.mouse.document);
          this._down=true;
          resizeLine=$j.doc.createElement($j.types.HTMLElements.DIV);
          if ($j.browser.ie) resizeLine.setAttribute("data-theme",obj.getThemeName());
          else resizeLine.dataset.theme=obj.getThemeName();
          if (this.orientation===$j.types.orientations.VERTICAL) {
            $j.CSS.addClass(resizeLine,"vGhostSplitter");
            resizeLine.style[$j.types.jsCSSProperties.LEFT]=this.left+$j.types.CSSUnits.PX;
            $j.CSS.addClass(this._DOMObj.parentNode,$j.types.customCursors.WRESIZE);
          } else {
            $j.CSS.addClass(resizeLine,"hGhostSplitter");
            resizeLine.style[$j.types.jsCSSProperties.TOP]=this.top+$j.types.CSSUnits.PX;
            $j.CSS.addClass(this._DOMObj.parentNode,$j.types.customCursors.SRESIZE);
          }
          resizeLine.jsObj=this;
          this._DOMObj.parentNode.appendChild(resizeLine);
        }
      }
    },
    mouseMove:function() {
      var x,y,resizeLine;
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        if (this._down) {
          resizeLine=this._DOMObj.parentNode.lastElementChild;
          if (this.orientation===$j.types.orientations.VERTICAL) {
            x=this.left+($j.mouse.document.x-this._downPos.x);
            if (x<this.minSize) x=this.minSize;
            if (this._DOMObj.parentNode.offsetWidth-x-this.width<this.minSize) x=this._DOMObj.parentNode.offsetWidth-this.minSize-this.width;
            resizeLine.style[$j.types.jsCSSProperties.LEFT]=x+$j.types.CSSUnits.PX;
          } else {
            y=this.top+($j.mouse.document.y-this._downPos.y);
            if (y<this.minSize) y=this.minSize;
            if (this._DOMObj.parentNode.offsetHeight-y-this.height<this.minSize) y=this._DOMObj.parentNode.offsetHeight-this.minSize-this.height;
            resizeLine.style[$j.types.jsCSSProperties.TOP]=y+$j.types.CSSUnits.PX;
          }
        }
      }
    },
    mouseUp:function() {
      this._inherited();
      if (this._down) {
        this._down=false;
        this.updateControls();
        this._DOMObj.parentNode.lastElementChild.jsObj=null;
        this._DOMObj.parentNode.removeChild(this._DOMObj.parentNode.lastElementChild);
        if (this.orientation===$j.types.orientations.VERTICAL) $j.CSS.removeClass(this._DOMObj.parentNode,$j.types.customCursors.WRESIZE);
        else $j.CSS.removeClass(this._DOMObj.parentNode,$j.types.customCursors.SRESIZE);
      }
    },
    click:function() {
      this._inherited();
      if (this.canCollapse()) {
        if (this.orientation===$j.types.orientations.VERTICAL) {
          if (this._lastLeft===0) {
            this._lastLeft=this.left;
            this._firstCtrl.setWidth(0);
            this.setLeft(0);
            this._lastCtrl.setWidth(this._DOMObj.parentNode.offsetWidth-this.width);
            this._lastCtrl.setLeft(this.width);
          } else {
            this.setLeft(this._lastLeft);
            this._lastLeft=0;
            this._firstCtrl.setWidth(this.left);
            this._lastCtrl.setWidth(this._DOMObj.parentNode.offsetWidth-this.width-this.left);
            this._lastCtrl.setLeft(this.width+this.left);
          }
        } else {
        }
      }
    },
    canCollapse:function() {
      var w2,y2,inCollapsibleArea=false;
      if (this.orientation===$j.types.orientations.VERTICAL) {
        y2=~~(this.height/2);
        inCollapsibleArea=$j.mouse.target.y>y2-15&&$j.mouse.target.y<y2+15;
      } else {
        w2=~~(this.width/2);
        inCollapsibleArea=$j.mouse.target.x>w2-15&&$j.mouse.target.x<w2+15;
      }
      return this.collapsible&&inCollapsibleArea;
    },
    updateControls: function() {
      var offset,resizeLine=this._DOMObj.parentNode.lastElementChild;
      if (this.orientation===$j.types.orientations.VERTICAL) {
        offset=resizeLine.offsetLeft-this._DOMObj.offsetLeft;
        if (!$j.tools.isNull(this._firstCtrl)) {
          this._firstCtrl.setWidth(this._firstCtrl.width+offset);
        }
        if (!$j.tools.isNull(this._lastCtrl)) {
          this._lastCtrl.setLeft(this._lastCtrl.left+offset);
          this._lastCtrl.setWidth(this._lastCtrl.width-offset);
        }
        this.setLeft(this.left+offset);
      } else {
        offset=resizeLine.offsetTop-this._DOMObj.offsetTop;
        if (!$j.tools.isNull(this._firstCtrl)) {
          this._firstCtrl.setHeight(this._firstCtrl.height+offset);
        }
        if (!$j.tools.isNull(this._lastCtrl)) {
          this._lastCtrl.setTop(this._lastCtrl.top+offset);
          this._lastCtrl.setHeight(this._lastCtrl.height-offset);
        }
        this.setTop(this.top+offset);
      }
    },
    checkCtrls:function() {
      var comps,i,l,self=this;
      if (typeof this._firstCtrl===_const.STRING) {
        if (!$j.tools.isNull(this.form[this._firstCtrl])) this._firstCtrl=this.form[this._firstCtrl];
        else this._firstCtrl=null;
      } else if ($j.tools.isNull(this._firstCtrl)) {
        switch (this.align) {
          case $j.types.aligns.LEFT:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.LEFT)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
          case $j.types.aligns.TOP:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.TOP)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
          case $j.types.aligns.RIGHT:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.CLIENT)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
          case $j.types.aligns.BOTTOM:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.CLIENT)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
        }
        for (i=0,l=comps.length;i<l;i++) {
          if (comps[i]!==this) {
            this._firstCtrl=comps[i];
            break;
          }
        }
      }
      if (typeof this._lastCtrl===_const.STRING) {
        if (!$j.tools.isNull(this.form[this._lastCtrl])) this._lastCtrl=this.form[this._lastCtrl];
        else this._lastCtrl=null;
      } else if ($j.tools.isNull(this._lastCtrl)) {
        switch (this.align) {
          case $j.types.aligns.RIGHT:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.RIGHT)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
          case $j.types.aligns.BOTTOM:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.BOTTOM)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
          case $j.types.aligns.LEFT:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.CLIENT)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
          case $j.types.aligns.TOP:
            comps=this._owner._components.filter(function(e,i,a) {
              return (e.align===$j.types.aligns.CLIENT)&&e.visible&&e._DOMObj.parentNode===self._DOMObj.parentNode;
            });
            break;
        }
        for (i=0,l=comps.length;i<l;i++) {
          if (comps[i]!==this) {
            this._lastCtrl=comps[i];
            break;
          }
        }
      }
    }
    //#endregion
  });
  Object.seal(Splitter);
  $j.classes.register($j.types.categories.COMMON,Splitter);
  //#region Templates
  var SplitterTpl="<div id='{internalId}' data-name='{name}' data-class='Splitter' style='{style}' class='Splitter'></div>";
  $j.classes.registerTemplates([{Class:Splitter,template:SplitterTpl}]);
  //endregion
})();
//http://codepen.io/enxaneta/pen/zGGMxq