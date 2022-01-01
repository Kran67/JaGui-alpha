(function(){
  var ColorButton=$j.classes.Button.extend({
    _ClassName: "ColorButton",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._colorObj=null;
        //#endregion
        this.color=new $j.classes.Color(_colors.TRANSPARENT);
        this.caption=this.color.toARGBString();
        this.onChange=new $j.classes.NotifyEvent(this); 
      }
    },
    //#region Setter
    setColor:function(newValue) {
      if (!(newValue instanceof $j.classes.Color)) return;
      if (!this.color.equals(newValue)) {
        this.color.assign(newValue);
        this.caption=this.color.toARGBString();
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
        }
        if (!this._updating) this.onChange.invoke(); 
      }
    },
    //#endregion
    //#region Methods
    update:function() {
      if (!$j.tools.isNull(this._textObj)) {
        this._textObj.innerHTML=String.empty;
      }
      if (!$j.tools.isNull(this._colorObj)) {
        this._colorObj.style.backgroundColor=this.color.toARGBString();
      }
    },
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._colorObj=this._DOMObj.lastElementChild;
        this._colorObj.jsObj=this;
      }
    },
    updateFromDOM: function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-color"):this._DOMObj.dataset.color;
      if (!$j.tools.isNull(data)) {
        this.color.assign(_colors.parse(data));
        this.update();
      }
      this.bindEventFromDOM("onChange"); 
    },
    click:function() {
      var colorDlg=$j.classes.createComponent($j.classes.ColorDlg,$j.apps.activeApplication,null,{"parentDOM":$j.doc.body});
      colorDlg._obj=this;
      colorDlg.setCaption("Couleurs");
      colorDlg.setColor(this.color);
      colorDlg.lblOpacity.setVisible(false);
      colorDlg.slrOpacity.setVisible(false);
      colorDlg.txtbOpacity.setVisible(false);
      colorDlg.lblOpacityPer.setVisible(false);
      colorDlg.onClose.addListener(this.updateColor);
      colorDlg.center();
      colorDlg.showModal();
      this._inherited();
    },
    updateColor:function() {
      if (this._modalResult===$j.types.modalResults.OK) {
        this._obj.setColor(this.clrBoxNewColor.fillColor);
      }
    },
    realign:$j.tools.emptyFunc
    //#endregion
  });
  Object.seal(ColorButton);
  $j.classes.register($j.types.categories.COLOR,ColorButton);
  //#region Templates
  var ColorButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='ColorButton' style='{style}' class='ColorButton' data-theme='{theme}' data-color='{color}'>",
                      "<span></span>",
                      "<div class='ColorButtonColor' data-theme='{theme}' style='background-color: {color};'></div>",
                      "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ColorButton,template:ColorButtonTpl}]);
  //endregion
})();