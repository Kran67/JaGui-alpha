(function(){
  $j.classes.register($j.types.categories.EXTRAS,TreeListView);
  TreeListView.inherit($j.classes.ThemedControl);
  function TreeListView(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(TreeListView);
})();