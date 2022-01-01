(function(){
  var LabeledMemo=$j.classes.LabeledControl.extend({
    _ClassName:"LabeledMemo",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      this.memo=$j.classes.createComponent($j.classes.Memo,this,null,null,false);
      }
    },
    //#region Methods
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this.memo.getDOMObj(this._DOMObj.lastElementChild.id);
        this.memo.getChildsDOMObj();
        this.memo.updateFromDOM();
      }
    }
    //#endregion
  });
  Object.seal(LabeledMemo);
  $j.classes.register($j.types.categories.EXTENDED,LabeledMemo);
  //#region Template
  var LabeledMemoTpl=["<div id='{internalId}' data-name='{name}' data-class='LabeledMemo' style='{style}'>",
                      "{label}",
                      "{memo}",
                      "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:LabeledMemo,template:LabeledMemoTpl}]);
  //#endregion
})();