(function(){
  //#region TextBox
  var TextBox=$j.classes.CustomTextControl.extend({
    _ClassName: "TextBox",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.width=121;
        this.height=21;
      }
    }
    //#region Methods
    //#endregion
    //#endregion
  });
  $j.classes.register($j.types.categories.COMMON,TextBox);
  //#region Templates
  var TextBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='TextBox' style='{style}' class='TextBox' data-theme='{theme}'>",
                  "<input type='text' placeholder='type your text here' value='{text}' class='csr_text' data-theme='{theme}'>",
                  "</div>"].join(String.empty);
  //endregion
  $j.classes.registerTemplates([{Class:TextBox,template:TextBoxTpl}]);
})();