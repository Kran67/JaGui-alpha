(function(){
  var ImageControl=$j.classes.ThemedControl.extend({
    _ClassName:"ImageControl",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._imageStyle=null;
        //#endregion
        this.image=null;
      }
    },
    //#region Setters
    setWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.width!==newValue) {
        this._inherited(newValue);
        this.update();
      }
    },
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.height!==newValue) {
        this._inherited(newValue);
        this.update();
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      this._inherited();
      this.image=this._DOMObj.firstElementChild;
      this._imageStyle=this.image.style;
      this.image.jsObj=this;
      $j.tools.events.bind(this.image,$j.types.HTMLEvents.LOAD,this.doBitmapLoaded);
      $j.tools.events.bind(this.image,$j.types.HTMLEvents.ERROR,this.doBitmapNotLoaded);
    },
    doBitmapLoaded: function(){
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
      //center the image
      var iw=this.image.naturalWidth,ih=this.image.naturalHeight,destRect,imgRect;
      if (iw>this.width||ih>this.height) {
        destRect=new $j.classes.Rect(0,0,this.width,this.height);
        imgRect=new $j.classes.Rect(0,0,iw,ih);
        destRect.assign(imgRect.fit(destRect).rect);
        this._imageStyle[$j.types.jsCSSProperties.WIDTH]=destRect.width()+$j.types.CSSUnits.PX;
        this._imageStyle[$j.types.jsCSSProperties.HEIGHT]=destRect.height()+$j.types.CSSUnits.PX;
        this._imageStyle[$j.types.jsCSSProperties.LEFT]=destRect.left+$j.types.CSSUnits.PX;
        this._imageStyle[$j.types.jsCSSProperties.TOP]=destRect.top+$j.types.CSSUnits.PX;
      } else {
        this._imageStyle[$j.types.jsCSSProperties.LEFT]=~~((this.width-iw)/2)+$j.types.CSSUnits.PX;
        this._imageStyle[$j.types.jsCSSProperties.TOP]=~~((this.height-ih)/2)+$j.types.CSSUnits.PX;
        this._imageStyle[$j.types.jsCSSProperties.WIDTH]=iw+$j.types.CSSUnits.PX;
        this._imageStyle[$j.types.jsCSSProperties.HEIGHT]=ih+$j.types.CSSUnits.PX;
      }
    }
    //#endregion
  });
  Object.seal(ImageControl);
  $j.classes.register($j.types.categories.EXTENDED,ImageControl);
  //#region Templates
  var ImageControlTpl=["<div id='{internalId}' data-name='{name}' data-class='ImageControl' class='ImageControl' style='{style}' data-theme='{theme}'>",
                       "<img src='{src}' alt='' />",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ImageControl,template:ImageControlTpl}]);
  //#endregion
})();