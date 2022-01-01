(function(){
  FlowLayout=$j.classes.Layout.extend({
    _ClassName:"FlowLayout",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.layout=$j.types.FlowLayouts.HORIZONTAL;
        this.hGap=5;
        this.vGap=5;
      }
    },
    //#region Methods
    alignControls:function() {
      var i=0,l,obj,x=this.hGap,y=this.vGap,maxTop=y,maxLeft=x;
      if (this._components.length===0) return;
      l=this._components.length;
      for (;i<l;i++) {
        obj=this._components[i];
        if (obj.visible) {
          if (this.layout===$j.types.FlowLayouts.HORIZONTAL) {
            if (x+obj.width>this.width) {
              if (maxTop<y+obj.height) maxTop=y+obj.height;
              y=maxTop+this.vGap;
              x=this.hGap;
              maxTop=y;
            }
            obj.setTop(y);
            obj.setLeft(x);
            x+=obj.width+this.hGap;
            if (maxTop<y+obj.height) maxTop=y+obj.height;
          } else {
            if (y+obj.height>this.height) {
              if (maxLeft<x+obj.width) maxLeft=x+obj.width;
              x=maxLeft+this.hGap;
              y=this.vGap;
              maxLeft=x;
            }
            obj.setTop(y);
            obj.setLeft(x);
            y+=obj.height+this.vGap;
            if (maxLeft<x+obj.width) maxLeft=x+obj.width;
          }
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
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-layout"):this._DOMObj.dataset.layout;
      if (!$j.tools.isNull(data)) this.layout=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-hgap"):this._DOMObj.dataset.hgap;
      if (!$j.tools.isNull(data)) this.hGap=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-vgap"):this._DOMObj.dataset.vgap;
      if (!$j.tools.isNull(data)) this.vGap=~~data;
    }
    //#endregion
  });
  Object.seal(FlowLayout);
  $j.classes.register($j.types.categories.CONTAINERS,FlowLayout);
  //#region Templates
  var FlowLayoutTpl="<div id='{internalId}' data-name='{name}' data-class='FlowLayout' class='FlowLayout' data-theme='{theme}' style='{style}'></div>";
  $j.classes.registerTemplates([{Class:FlowLayout,template:FlowLayoutTpl}]);
  //endregion
})();
//https://github.com/bramstein/jlayout/blob/master/lib/jlayout.flow.js