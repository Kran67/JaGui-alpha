(function(){
  $j.classes.register($j.types.categories.DIALOGS,ExtDlgs);
  ExtDlgs.inherit($j.classes.CommonDialog);
  function ExtDlgs(owner) {
    if (owner!==NULL){
      $j.classes.CommonDialog.apply(this,arguments);
    }
  }
  //#endregion
  Object.seal(ExtDlgs);
})();