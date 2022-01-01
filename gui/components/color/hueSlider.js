(function(){
  //#region HUESlider
  var HUESlider=$j.classes.ColorSlider.extend({
    _ClassName:"HUESlider"
  });
  //#endregion
  $j.classes.register($j.types.categories.COLOR,HUESlider);
  //#region Templates
  var HUESliderTpl=["<div id='{internalId}' data-name='{name}' data-class='HUESlider' class='HUESlider' data-theme='{theme}' style='{style}' data-values='[0,0]' data-mode='normal' data-orientation='horizontal'>",
                              "<div class='HUESlider_thumb' data-theme='{theme}'></div>",
                              "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:HUESlider,template:HUESliderTpl}]);
  //endregion
})();