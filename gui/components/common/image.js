(function(){
  //#region Image
  var Image=$j.classes.Control.extend({
    _ClassName: "Image",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.wrapMode=$j.types.imageWraps.FIT;
      }
    },
    //#region Methods
    setBitmap:function(newValue){
      if(!(newValue instanceof Image)) return;
      this._DOMObj.src=newValue.src;
    },
    setWrapMode: function(newValue){
      if(!$j.tools.valueInSet(newValue,$j.types.wrapModes)) return;
      if(this.wrapMode!==newValue){
        this.wrapMode=newValue;
        if (!this._loading&&!this.form._loading) this.update();
      }
    },
    doBitmapLoaded: function(){
      this.obj._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDIMAGE]=this.src;
      this.obj.update();
    },
    doBitmapNotLoaded: function(){throw "Image bitmap error";},
    empty: function(){
      return this._DOMObj.src===_const.PIX;
    },
    update: function() {
      if (this._loading||this.form._loading) return;
      switch (this.wrapMode) {
        case $j.types.imageWraps.ORIGINAL:
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDSIZE]="auto auto";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDPOSITION]="auto auto";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDREPEAT]="no-repeat";
          break;
        case $j.types.imageWraps.FIT:
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDSIZE]="contain";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDPOSITION]="center center";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDREPEAT]="no-repeat";
          break;
        case $j.types.imageWraps.STRETCH:
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDSIZE]="100% 100%";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDPOSITION]="center center";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDREPEAT]="no-repeat";
          break;
        case $j.types.imageWraps.TILED:
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDSIZE]="auto auto";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDPOSITION]="auto auto";
          this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDREPEAT]="repeat";
          break;
      }
    },
    load: function(uri){
      this._DOMObj.src=uri;
    },
    updateFromDOM:function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-wrapmode"):this._DOMObj.datasetwrapmode;
      if (!$j.tools.isNull(data)) this.wrapMode=data;
    }
    //#endregion
  });
  //#endregion Image
  //#region Icon
  var Icon=$j.classes.ThemedControl.extend({
    _ClassName: "Icon",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.cssClass=String.empty;
      }
    },
    //#region Methods
    changeCSS: function(cssClass){
      if (typeof cssClass!==_const.STRING) return;
      if (cssClass===String.empty) return;
      if (this.cssClass!==cssClass) {
        $j.CSS.removeClass(this._DOMObj,this.cssClass);
        $j.CSS.addClass(this._DOMObj,cssClass);
        this.cssClass=cssClass;
      }
    }
  });
  //#endregion Icon
  $j.classes.register($j.types.categories.COMMON,Image,Icon);
  //#region Templates
  var ImageTpl="<img id='{internalId}' data-name='{name}' data-class='Image' style='{style}' src='{src}' draggable='false'>",
      IconTpl="<img id='{internalId}' data-name='{name}' data-class='Image' class='Icon' style='{style}' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==' draggable='false'>";
  $j.classes.registerTemplates([{Class:Image,template:ImageTpl}]);
  //endregion
})();