(function(){
  var CheckBox=$j.classes.CaptionControl.extend({
    _ClassName: "CheckBox",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._autoTranslate=true;
        //#endregion
        this.autoCapture=true;
        this.isChecked=false;
        this.autoWidth=false;
        this.onChange=new $j.classes.NotifyEvent(this);
        this.width=120;
        this.height=19;
        this.canFocused=true;
        this.hitTest.mouseDown=true;
        this.hitTest.mouseUp=true;
        this.horizAlign=$j.types.textAligns.LEFT;
        this.state=$j.types.checkBoxStates.UNCHECKED;
        this.allowGrayed=false;
      }
    },
    //#region Setters
    setIsChecked:function(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if (this.allowGrayed) {
        switch (this.state) {
          case $j.types.checkBoxStates.UNCHECKED:
            this.state=$j.types.checkBoxStates.GRAYED;
            newValue=false;
            break;
          case $j.types.checkBoxStates.GRAYED:
            this.state=$j.types.checkBoxStates.CHECKED;
            newValue=true;
            break;
          case $j.types.checkBoxStates.CHECKED:
            this.state=$j.types.checkBoxStates.UNCHECKED;
            newValue=false;
            break;
        }
      }
      else if (newValue) this.state=$j.types.checkBoxStates.CHECKED;
      else this.state=$j.types.checkBoxStates.UNCHECKED;
      if(this.isChecked!==newValue) {
        this.isChecked=newValue;
        if (this._loading||this.form._loading) return;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.redraw();
        } else this.update();
        if (!this._updating) this.onChange.invoke();
      }
    },
    setAllowGrayed:function(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.allowGrayed!==newValue) this.allowGrayed=newValue;
    },
    //#endregion
    //#region Methods
    mouseDown:function() {
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        this.pressing=true;
        this._isPressed=true;
      }
    },
    mouseUp:function() {
      this._inherited();
      if(($j.mouse.button===$j.types.mouseButtons.LEFT)&&this.pressing) {
        this.pressing=false;
        this._isPressed=false;
        this.setIsChecked(!this.isChecked);
        this.update();
      }
    },
    keyDown:function() {
      this._inherited();
      if(($j.keyboard.keyCode===$j.VKeysCode.VK_RETURN)||($j.keyboard.keyCode===$j.VKeysCode.VK_SPACE)) this.isChecked=!this.isChecked;
    },
    realign:$j.tools.emptyFunc,
    update:function() {
      if (this._loading||this.form._loading) return;
      if ($j.browser.ie) {
        this._DOMObj.setAttribute("data-ischecked",(this.allowGrayed?this.state===$j.types.checkBoxStates.CHECKED:this.isChecked));
        this._DOMObj.setAttribute("data-state",this.state);
      } else {
        this._DOMObj.dataset.ischecked=(this.allowGrayed?this.state===$j.types.checkBoxStates.CHECKED:this.isChecked);
        this._DOMObj.dataset.state=this.state;
      }
    },
    updateFromDOM: function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-ischecked"):this._DOMObj.dataset.ischecked;
      if (!$j.tools.isNull(data)) this.isChecked=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-autowidth"):this._DOMObj.dataset.autowidth;
      if (!$j.tools.isNull(data)) this.autoWidth=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-allowgrayed"):this._DOMObj.dataset.allowgrayed;
      if (!$j.tools.isNull(data)) this.allowGrayed=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-state"):this._DOMObj.dataset.state;
      if (!$j.tools.isNull(data)) this.state=$j.types.checkBoxStates[data.toUpperCase()];
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-onchange"):this._DOMObj.dataset.onchange;
      if (!$j.tools.isNull(data)) {
        if (typeof this.form[data]===_const.FUNCTION) this.onChange.addListener(this.form[data]);
        else if (typeof data===_const.STRING) {
          if (data!==String.empty) this.onChange.addListener(new Function(data));
        }
      }
    }
    //#endregion
  });
  Object.seal(CheckBox);
  $j.classes.register($j.types.categories.COMMON,CheckBox);
  //#region Templates
  var CheckBoxTpl="<div id='{internalId}' data-name='{name}' data-class='CheckBox' style='{style}' class='CheckBox' data-theme='{theme}' data-ischecked='false' data-state='unchecked'>{caption}</div>";
  //endregion
  $j.classes.registerTemplates([{Class:CheckBox,template:CheckBoxTpl}]);
})();