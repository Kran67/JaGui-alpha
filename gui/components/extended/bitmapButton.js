(function(){
  var BitmapButton=$j.classes.SpeedButton.extend({
    _ClassName: "BitmapButton",
    init: function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.canFocused=true;
      }
    }
    //#region Methods

    //#endregion
  });
  Object.seal(BitmapButton);
  $j.classes.register($j.types.categories.EXTENDED,BitmapButton);
  //#region template
  var BitmapButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='BitmapButton' style='{style}' class='BitmapButton' data-theme='{theme}'>",
                       "<span>{caption}</span>",
                       "<img alt='' src='{src}'>",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:BitmapButton,template:BitmapButtonTpl}]);
  //#endregion template
})();