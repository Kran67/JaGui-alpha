(function(){
  //#region PasswordTextBox
  var PasswordTextBox=$j.classes.CustomTextControl.extend({
    _ClassName: "PasswordTextBox",
    init:function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._btnObj=null;
        //#endregion
        this.width=121;
        this.height=21;
        this.type=$j.types.HTMLInputTypes.PASSWORD;
        this.text=String.empty;
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
        $j.tools.events.bind(this._btnObj,$j.types.mouseEvents.DOWN,this.revealPassword);
        $j.tools.events.bind(this._btnObj,$j.types.mouseEvents.UP,this.revealPassword);
        $j.tools.events.bind(this._btnObj,$j.types.mouseEvents.OUT,this.revealPassword);
      }
    },
    revealPassword:function(event) {
      if (!this.jsObj.isEnabled()) return;
      $j.mouse.getMouseInfos(event);
      if ($j.isDOMRenderer) {
        if ($j.mouse.button===$j.types.mouseButtons.LEFT&&$j.mouse.eventType===$j.types.mouseEvents.DOWN) this.jsObj._inputObj.setAttribute("type",$j.types.HTMLInputTypes.TEXT);
        else {
          this.jsObj._inputObj.setAttribute("type",$j.types.HTMLInputTypes.PASSWORD);
          this.jsObj._inputObj.focus();
        }
      } else {
      }
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
  $j.classes.register($j.types.categories.COMMON,PasswordTextBox);
  //#region Templates
  var PasswordTextBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='PasswordTextBox' style='{style}' class='PasswordTextBox' data-theme='{theme}'>",
                          "<input type='password' placeholder='type your password here' class='csr_text' data-theme='{theme}'>",
                          "<div class='PasswordTextBox_btn' data-theme='{theme}'><span></span></div>",
                          "</div>"].join(String.empty);
  //endregion
  $j.classes.registerTemplates([{Class:PasswordTextBox,template:PasswordTextBoxTpl}]);
})();