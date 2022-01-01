(function(){
  $j.classes.register($j.types.categories.EXTRAS,SyntaxEditor);
  SyntaxEditor.inherit($j.classes.ThemedControl);
  function SyntaxEditor(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(SyntaxEditor);
})();