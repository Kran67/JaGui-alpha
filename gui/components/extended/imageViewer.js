(function(){
  var ImageViewer=$j.classes.ScrollBox.extend({
    _ClassName:"ImageViewer",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.image=$j.doc.createElement($j.types.HTMLElements.IMG);
        this.image.jsObj=this;
        $j.tools.events.bind(this.image,$j.types.HTMLEvents.LOAD,this.doBitmapLoaded);
        $j.tools.events.bind(this.image,$j.types.HTMLEvents.ERROR,this.doBitmapNotLoaded);
        this.scale=1;
        this.mouseScaling=true;
      }
    },
    //#region Setters
    //#endregion
    //#region Methods
    mouseWheel:function() {
      this.scale+=$j.mouse.wheelDelta*0.04;
      if (this.scale>10) this.scale=10;
      else if (this.scale<0.01) this.scale=0.01;
      this.update();
    },
    doBitmapLoaded: function(){
      if (!$j.tools.isNull(this.jsObj._content)) this.jsObj._content._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDIMAGE]="url('"+this.src+"')";
      this.jsObj.update();
    },
    doBitmapNotLoaded: function(){throw "Image bitmap error";},
    empty: function(){
      return this.image.src===_const.PIX;
    },
    load:function(uri){
      this.image.src=uri;
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-src"):this._DOMObj.dataset.src;
      if (!$j.tools.isNull(data)) this.image.src=data;
    },
    update:function() {
      var newW,newH,rectD,rectS,viewHS=false,viewVS=false;
      if ($j.tools.isNull(this._content)) return;
      if ($j.tools.isNull(this._DOMObj)) return;
      if ($j.tools.isNull(this.image)) return;
      newW=~~(this.image.naturalWidth*this.scale);
      newH=~~(this.image.naturalHeight*this.scale);
      if (newW>this._viewPort.offsetWidth) viewHS=true;
      if (newH>this._viewPort.offsetHeight) viewVS=true;
      if (viewHS&&viewVS) {
        if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.BOTH);
        else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.BOTH;
      } else if (viewHS&&!viewVS) {
        if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.HORIZONTAL);
        else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.HORIZONTAL;
      } else if (!viewHS&&viewVS) {
        if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.VERTICAL);
        else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.VERTICAL;
      } else {
        if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.NONE);
        else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.NONE;
      }
      this._HScrollBar.setMax(newW);
      this._HScrollBar.setViewportSize(this._viewPort.offsetWidth);
      this._VScrollBar.setMax(newH);
      this._VScrollBar.setViewportSize(this._viewPort.offsetHeight);
      if (viewHS) this._HScrollBar.setValue(~~((this._HScrollBar.max-this._HScrollBar.viewportSize)/2));
      if (viewVS) this._VScrollBar.setValue(~~((this._VScrollBar.max-this._VScrollBar.viewportSize)/2));
      this._content._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=newW+$j.types.CSSUnits.PX;
      this._content._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=newH+$j.types.CSSUnits.PX;
      rectD=new $j.classes.Rect(0,0,this._viewPort.offsetWidth,this._viewPort.offsetHeight);
      rectS=new $j.classes.Rect(0,0,newW,newH);
      rectS.center(rectD);
      this._content._DOMObj.style[$j.types.jsCSSProperties.LEFT]=rectS.left+$j.types.CSSUnits.PX;
      this._content._DOMObj.style[$j.types.jsCSSProperties.TOP]=rectS.top+$j.types.CSSUnits.PX;
    }
    //#endregion
  });
  Object.seal(ImageViewer);
  $j.classes.register($j.types.categories.EXTENDED,ImageViewer);
  //#region Templates
  var ImageViewerTpl=["<div id='{internalId}' data-name='{name}' data-class='ImageViewer' style='{style}' class='ImageViewer' data-theme='{theme}' data-scrollbars='none'>",
                      "<div class='ScrollBoxViewPort' data-theme='{theme}'>",
                      "<div class='ScrollBoxContent' data-theme='{theme}'></div>",
                      "</div>",
                      "{horizontalScrollBar}",
                      "{verticalScrollBar}",
                      "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ImageViewer,template:ImageViewerTpl}]);
  //#endregion
})();