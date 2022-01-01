(function(){
  var IPhoneButton=$j.classes.BitmapButton.extend({
    _ClassName: "IPhoneButton",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.canFocused=false;
      }
    }
    //#region Methods
    //#endregion
  });
  Object.seal(IPhoneButton);
  $j.classes.register($j.types.categories.EXTENDED,IPhoneButton);
  //#region template
  var IPhoneButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='IPhoneButton' style='{style}' class='IPhoneButton' data-theme='{theme}'>",
                       "<span></span>",
                       "<img alt='' src='{src}'>",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:IPhoneButton,template:IPhoneButtonTpl}]);
  //#endregion template
})();