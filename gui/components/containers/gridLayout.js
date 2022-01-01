(function(){
  GridLayout=$j.classes.Layout.extend({
    _ClassName:"GridLayout",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.itemWidth=64;
        this.itemHeight=64;
        this.hGap=5;
        this.vGap=5;
      }
    },
    //#region Methods
    alignControls:function() {
      var i=0,l,obj,x=this.hGap,y=this.vGap,maxTop=y;
      if (this._components.length===0) return;
      l=this._components.length;
      for (;i<l;i++) {
        obj=this._components[i];
        if (obj.visible) {
          if (x+this.itemWidth>this.width) {
            if (maxTop<y+this.itemHeight) maxTop=y+this.itemHeight;
            y=maxTop+this.vGap;
            x=this.hGap;
          }
          obj.setWidth(this.itemWidth);
          obj.setHeight(this.itemHeight);
          obj.setLeft(x);
          obj.setTop(y);
          x+=this.itemWidth+this.hGap;
        }
      }
    },
    loaded:function() {
      this._inherited();
      this.alignControls();
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemwidth"):this._DOMObj.dataset.itemwidth;
      if (!$j.tools.isNull(data)) this.itemWidth=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemheight"):this._DOMObj.dataset.itemheight;
      if (!$j.tools.isNull(data)) this.itemHeight=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-hgap"):this._DOMObj.dataset.hgap;
      if (!$j.tools.isNull(data)) this.hGap=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-vgap"):this._DOMObj.dataset.vgap;
      if (!$j.tools.isNull(data)) this.vGap=~~data;
    }
    //#endregion
  });
  Object.seal(GridLayout);
  $j.classes.register($j.types.categories.CONTAINERS,GridLayout);
  //#region Templates
  var FlowLayoutTpl="<div id='{internalId}' data-name='{name}' data-class='GridLayout' class='GridLayout' data-theme='{theme}' style='{style}'></div>";
  $j.classes.registerTemplates([{Class:FlowLayout,template:FlowLayoutTpl}]);
  //endregion
})();