(function(){
  var BitmapStateButton=$j.classes.CustomButton.extend({
    _ClassName:"BitmapStateButton",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.bitmapState=new Image;
        this.bitmapState.obj=this;
        $j.tools.events.bind(this.bitmapState,$j.types.HTMLEvents.LOAD,this.doBitmapLoaded);
        $j.tools.events.bind(this.bitmapState,$j.types.HTMLEvents.ERROR,this.doBitmapNotLoaded);
      }
    },
    //#region Setters
    setBitmap:function(bmpSrc) {
      if (typeof bmpSrc!==_const.STRING) return;
      this.bitmapState.src=bmpSrc;
    },
    //#endregion
    //#region Methods
    doBitmapLoaded:function() {
      this.obj.update();
    },
    doBitmapNotLoaded:function() {
      if ($j.tools.Debugger.debug) console.log('Bitmap not loaded in : '+this.obj.name);
    },
    mouseDown: function(){
      this._inherited();
      this.update();
    },
    mouseLeave: function(){
      this._inherited();
      this.update();
    },
    mouseEnter: function(){
      this._inherited();
      this.update();
    },
    mouseUp: function(){
      this._inherited();
      this.update();
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-bitmap"):this._DOMObj.dataset.bitmap;
      if (!$j.tools.isNull(data)) this.setBitmap(data);
    },
    update:function() {
      this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDIMAGE]="url('"+this.bitmapState.src+"')";
      if (this._isPressed&&this._isMouseOver) {
        this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDPOSITION]="right top";
      } else if (!this._isPressed&&this._isMouseOver) {
        this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDPOSITION]="center center";
      } else if (!this._isMouseOver) {
        this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDPOSITION]="left top";
      }
    }
    //#endregion
  });
  Object.seal(BitmapStateButton);
  $j.classes.register($j.types.categories.COMMON,BitmapStateButton);
  //#region Templates
  var BitmapStateButtonTpl="<div id='{internalId}' data-name='{name}' data-class='BitmapStateButton' class='BitmapStateButton' data-theme='{theme}' style='{style}'></div>";
  $j.classes.registerTemplates([{Class:BitmapStateButton,template:BitmapStateButtonTpl}]);
  //endregion
})();