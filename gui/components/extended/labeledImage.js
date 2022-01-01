(function(){
  var LabeledImage=$j.classes.LabeledControl.extend({
    _ClassName:"LabeledImage",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.imgCtrl=$j.classes.createComponent($j.classes.ImageControl,this,null,null,false);
      }
    },
    //#region Methods
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this.imgCtrl.getDOMObj(this._DOMObj.lastElementChild.id);
        this.imgCtrl.getChildsDOMObj();
        this.imgCtrl.updateFromDOM();
      }
    }
    //#endregion
  });
  Object.seal(LabeledImage);
  $j.classes.register($j.types.categories.EXTENDED,LabeledImage);
  //#region Template
  var LabeledImageTpl=["<div id='{internalId}' data-name='{name}' data-class='LabeledImage' style='{style}'>",
                       "{label}",
                       "{imageControl}",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:LabeledImage,template:LabeledImageTpl}]);
  //#endregion
})();