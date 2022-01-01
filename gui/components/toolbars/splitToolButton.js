(function(){
  //#region SplitToolButton
  var SplitToolButton=$j.classes.ThemedControl.extend({
    _ClassName:"SplitToolButton",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._btn=$j.classes.createComponent($j.classes.BitmapButton,this,null,null,false);
        this._btn.canFocused=false;
        this._popupBtn=$j.classes.createComponent($j.classes.PopupButton,this,null,null,false);
        this._popupBtn.canFocused=false;
        this._popupBtn.click=this.clickPopup;
        //#endregion
        this.onCloseMenu=new $j.classes.NotifyEvent(this);
        this.onOpenMenu=new $j.classes.NotifyEvent(this);
      }
    },
    //#region Setters
    setCaption:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      this._btn.setCaption(newValue);
    },
    //#endregion
    //#region Methods
    updateFromDOM:function() {
      var data;
      this._inherited();

    },
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._btn.getDOMObj(this._DOMObj.firstElementChild.id);
        this._btn.getChildsDOMObj();
        this._btn.updateFromDOM();
        this._popupBtn.getDOMObj(this._DOMObj.lastElementChild.id);
        this._popupBtn.updateFromDOM();
      }
    },
    loaded:function() {
      this._inherited();
      if (this.popupMenu instanceof $j.classes.PopupMenu) this._popupBtn.popupMenu=this.popupMenu;
    },
    clickPopup:function() {
      var pt;
      if (!$j.tools.isNull(this.popupMenu)) {
        if (this.popupMenu instanceof $j.classes.PopupMenu) {
          pt=this._owner.clientToDocument();
          this.popupMenu._control=this._owner;
          this.popupMenu.show(pt.x,pt.y+this._owner._DOMObj.offsetHeight);
        }
      }
    }
    //#endregion
  });
  //#endregion
  $j.classes.register($j.types.categories.TOOLBARS,SplitToolButton);
  //#region Templates
  var SplitToolButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='SplitToolButton' style='{style}' class='SplitToolButton' data-theme='{theme}'>",
                 "<div id='{internalId_btn}' data-name='{name}' data-class='Button' style='{style}' class='Button' data-theme='{theme}'>",
                 "<span>{caption}</span>",
                 "<img alt='' src='{src}'>",
                 "</div>",
                 "<div id='{internalId_popBtn}' data-name='{name}' data-class='PopupButton' style='{style}' class='PopupButton' data-theme='{theme}'>",
                 "<span></span>",
                 "</div>",
                 "</div>"].join(String.empty);

  $j.classes.registerTemplates([{Class:SplitToolButton,template:SplitToolButtonTpl}]);
  //#endregion
})();