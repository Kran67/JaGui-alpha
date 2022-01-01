(function(){
  $j.classes.register($j.types.categories.EXTRAS,ImageEditor);
  ImageEditor.inherit($j.classes.ThemedControl);
  function ImageEditor(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(ImageEditor);
})();