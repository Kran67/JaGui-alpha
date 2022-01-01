(function(){
  //#region AlphaSlider
  var AlphaSlider=$j.classes.ColorSlider.extend({
    _ClassName:"AlphaSlider",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.gradientEdit=null;
      }
    }
  });
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,AlphaSlider);
  //#region Templates
  var AlphaSliderTpl=["<div id='{internalId}' data-name='{name}' data-class='AlphaSlider' class='AlphaSlider' data-theme='{theme}' style='{style}' data-values='[0,0]' data-mode='normal' data-orientation='horizontal'>",
                                "<div class='AlphaSlider_thumb' data-theme='{theme}'></div>",
                                "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:AlphaSlider,template:AlphaSliderTpl}]);
  //endregion
})();