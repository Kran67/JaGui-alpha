(function(){
  //#region ImageList
  var ImageList=$j.classes.Component.extend({
    _ClassName:"ImageList",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._images=[];
        //#endregion
        this.height=16;
        this.width=16;
        this.left=0;
        this.top=0;
      }
    },
    //#region Setters
    setWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.width!==newValue) {
        this.width=newValue;
      }
    },
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.height!==newValue) {
        this.height=newValue;
      }
    },
    //#endregion
    //#region Methods
    addImage:function(image) {
      if (typeof image!==_const.STRING) return;
      if (!this._images.contains(image)) {
        this._images.push(image);
      }
    },
    InsertImage:function(index,image) {
    },
    removeImage:function(index) {
    },
    clear:function() {
    },
    replaceImage:function(index,image) {
    },
    updateFromDOM:function() {
      this.left=this._DOMObj.offsetLeft;
      this.top=this._DOMObj.offsetTop;
      // on va chercher les items dans le CDATA
      cdata=this._DOMObj.childNodes;
      for (var i=0,l=cdata.length;i<l;i++) {
        if (cdata[i].nodeType===$j.types.xmlNodeTypes.COMMENT_NODE) {
          if (!$j.tools.isNull(cdata[i].nodeValue!==String.empty&&cdata[i].nodeValue)) this._images=JSON.parse(cdata[i].nodeValue);
        }
      }
    }
    //#endregion
  });
  //#endregion
  Object.seal(ImageList);
  $j.classes.register($j.types.categories.NONVISUAL,ImageList);
})();