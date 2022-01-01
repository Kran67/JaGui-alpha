(function(){
  var LabeledTextBox=$j.classes.LabeledControl.extend({
    _ClassName:"LabeledTextBox",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.textBox=$j.classes.createComponent($j.classes.TextBox,this,null,null,false);
      }
    },
    //#region Methods
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this.textBox.getDOMObj(this._DOMObj.lastElementChild.id);
        this.textBox.updateFromDOM();
      }
    }
    //#endregion
  });
  Object.seal(LabeledTextBox);
  $j.classes.register($j.types.categories.EXTENDED,LabeledTextBox);
  //#region Template
  var LabeledTextBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='LabeledTextBox' style='{style}'>",
                         "{label}",
                         "{textBox}",
                         "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:LabeledTextBox,template:LabeledTextBoxTpl}]);
  //#endregion
})();