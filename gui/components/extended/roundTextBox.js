(function(){
  //#region RoundTextBox
  var RoundTextBox=$j.classes.CustomTextControl.extend({
    _ClassName: "RoundTextBox",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.width=121;
        this.height=21;
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  $j.classes.register($j.types.categories.EXTENDED,RoundTextBox);
  //#region Template
  var RoundTextBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='RoundTextBox' style='{style}' class='RoundTextBox' data-theme='{theme}'>",
                       "<input type='text' class='csr_text' data-theme='{theme}'>",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:RoundTextBox,template:RoundTextBoxTpl}]);
  //#endregion
})();