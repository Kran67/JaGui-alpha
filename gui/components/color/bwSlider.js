(function(){
  //#region BWSlider
  var BWSlider=$j.classes.ColorSlider.extend({
    _ClassName:"BWSlider"
  });
  //#endregion
  $j.classes.register($j.types.categories.COLOR,BWSlider);
  //#region Templates
  var BWSliderTpl=["<div id='{internalId}' data-name='{name}' data-class='BWSlider' class='BWSlider' data-theme='{theme}' style='{style}' data-values='[0,0]' data-mode='normal' data-orientation='horizontal'>",
                             "<div class='BWSlider_thumb' data-theme='{theme}'></div>",
                             "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:BWSlider,template:BWSliderTpl}]);
  //endregion
})();