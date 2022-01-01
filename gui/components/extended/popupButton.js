(function(){
  var PopupButton=$j.classes.Button.extend({
    _ClassName: "PopupButton",
    init: function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    },
    //#region Methods
    click:function() {
      var pt;
      this.onClick.invoke();
      if (!$j.tools.isNull(this.popupMenu)) {
        if (this.popupMenu instanceof $j.classes.PopupMenu) {
          pt=this.clientToDocument();
          this.popupMenu._control=this;
          this.popupMenu.show(pt.x,pt.y+this._DOMObj.offsetHeight);
        }
      }
    }
    //#endregion
  });
  Object.seal(PopupButton);
  $j.classes.register($j.types.categories.EXTENDED,PopupButton);
  //#region Template
  PopupButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='PopupButton' style='{style}' class='PopupButton' data-theme='{theme}'>",
                  "<span>{caption}</span>",
                  "<div></div>",
                  "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:PopupButton,template:PopupButtonTpl}]);
  //#ednregion
})();