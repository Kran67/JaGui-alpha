(function(){
  //#region TextBoxClearBtn
  var TextBoxClearBtn=$j.classes.CustomTextControl.extend({
    _ClassName: "TextBoxClearBtn",
    init:function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._btnObj=null;
        //#endregion
        this.width=121;
        this.height=21;
      }
    },
    //#region Setters
    setEnabled:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.enabled!==newValue) {
        this._inherited(newValue);
        if (this.enabled) this._btnObj.removeAttribute("disabled");
        else this._btnObj.setAttribute("disabled","disabled");
      }
    },
    //#endregion
    //#region Methods
    update:function() {
      if (this._loading||this.form._loading) return;
      this._inherited();
      this.recalcInputWidth();
      if (!$j.tools.isNull(this._btnObj)) this._btnObj.style.width=this._inputObj.offsetHeight+$j.types.CSSUnits.PX;
    },
    getChildsDOMObj:function(id) {
      this._inherited();
      if (!$j.tools.isNull(this._DOMObj)) {
        this._btnObj=this._DOMObj.lastElementChild;
        this._btnObj.jsObj=this;
        $j.tools.events.bind(this._btnObj,$j.types.mouseEvents.CLICK,this.clearInput);
      }
    },
    clearInput:function(event) {
      $j.mouse.getMouseInfos(event);
      if ($j.isDOMRenderer) {
        if ($j.mouse.button===$j.types.mouseButtons.LEFT) {
          this.jsObj._inputObj.value=this.jsObj.text=String.empty;
        }
      } else {
      }
      if ($j.browser.ie) this.jsObj._DOMObj.setAttribute("data-length",this.jsObj._inputObj.value.length);
      else this.jsObj._DOMObj.dataset.length=this.jsObj._inputObj.value.length;
      this.jsObj.update();
      this.jsObj._inputObj.focus();
    },
    keyUp:function() {
      this._inherited();
      this.recalcInputWidth();
    },
    recalcInputWidth:function() {
      if (!$j.tools.isNull(this._inputObj)) {
        if (this._inputObj.value.length===0) this._inputObj.style.width=(this.width-6)+$j.types.CSSUnits.PX;
        else this._inputObj.style.width=(this.width-this.height-4)+$j.types.CSSUnits.PX;
      }
    }
    //#endregion
  });
  $j.classes.register($j.types.categories.EXTENDED,TextBoxClearBtn);
  //#region Templates
  var TextBoxClearBtnTpl=["<div id='{internalId}' data-name='{name}' data-class='TextBoxClearBtn' style='{style}' class='TextBoxClearBtn' data-theme='{theme}'>",
                          "<input type='text' class='csr_text' data-theme='{theme}'>",
                          "<div class='TextBoxClearBtn_btn' data-theme='{theme}'><span></span></div>",
                          "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:TextBoxClearBtn,template:TextBoxClearBtnTpl}]);
  //endregion
})();