(function(){
  var LabeledColorButton=$j.classes.LabeledControl.extend({
    _ClassName:"LabeledColorButton",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.colorButton=$j.classes.createComponent($j.classes.ColorButton,this,null,null,false);
      }
    },
    //#region Methods
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this.colorButton.getDOMObj(this._DOMObj.lastElementChild.id);
        this.colorButton.getChildsDOMObj();
        this.colorButton.updateFromDOM();
      }
    }
    //#endregion
  });
  Object.seal(LabeledColorButton);
  $j.classes.register($j.types.categories.EXTENDED,LabeledColorButton);
  //#region Template
  var LabeledColorButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='LabeledColorButton' style='{style}'>",
                             "{label}",
                             "{colorButton}",
                             "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:LabeledColorButton,template:LabeledColorButtonTpl}]);
  //#endregion
})();