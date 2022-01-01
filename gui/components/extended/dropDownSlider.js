(function(){
  //#region SliderPopup
  var SliderPopup=$j.classes.Slider.extend({
    _ClassName:"SliderPopup",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._forceMouseWheel=true;
        this._dropDownSlider=null;
        //#endregion
        this.onChange.addListener(this.changeDropDownValue);
      }
    },
    //#region Setter
    changeDropDownValue:function() {
      this._dropDownSlider.setValue(parseFloat(this.values.first().toFixed(this.decimalPrecision)));
    }
    //#endregion
    //#region Method
    //#endregion
  });
  //#endregion
  //#region DropDownSliderPopup
  var DropDownSliderPopup=$j.classes.PopupBox.extend({
    _ClassName:"DropDownSliderPopup",
    init:function(owner,props,parent) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner.form,props);
        //#region Private
        this._slider=$j.classes.createComponent($j.classes.SliderPopup,this,null,{"top":5,"left":5},false);
        this._slider._dropDownSlider=owner;
        this._slider.canFocused=false;
        //#endregion
        this.setClosePopups(false);
      }
    },
    //#region Method
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{slider}"),tpl;
      tpl=this._slider.getTemplate();
      a.insert(a.length-1,tpl);
      html=a.join(String.empty);
      a=html.split("{value}");
      a.insert(a.length-1,this.value);
      html=a.join(String.empty);
      return html;
    },
    show:function(x,y) {
      this._inherited(x,y);
      if ($j.tools.isNull(this._slider._DOMObj)) {
        this._slider.getDOMObj(this._slider._internalId);
        this._slider.updateFromDOM();
      }

    },
    destroy:function() {
      if (!this.onlyHide) {
        this._inherited();
        this._slider=null;
      } else $j.CSS.addClass(this._DOMObj,"hidden");
      this._control.opened=false;
      if ($j.browser.ie) this._control._DOMObj.setAttribute("data-opened",false);
      else this._control._DOMObj.dataset.opened=false;
      $j.CSS.removeClass(this._DOMObj,"animated");
      $j.CSS.removeClass(this._DOMObj,"fadeIn");
    },
    getChildsDOMObj: function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._slider.getDOMObj(this._DOMObj.firstElementChild.id);
        this._slider.getChildsDOMObj();
        this._slider.updateFromDOM();
      }
    }
    //#endregion
  });
  Object.seal(DropDownSliderPopup);
  //#endregion
  //#region DropDownSlider
  var DropDownSlider=$j.classes.ThemedControl.extend({
    _ClassName:"DropDownSlider",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._dropDownPopup=null;
        this._content=null;
        //#endregion
        this.opened=false;
        this.value=0;
        this.canFocused=true;
        this.autoCapture=true;
        this.min=0;
        this.max=100;
        this.horizAlign=$j.types.textAligns.LEFT;
      }
    },
    //#region Setters
    setHorizAlign:function(newValue){
      if (!($j.tools.valueInSet(newValue,$j.types.textAligns))) return;
      if (newValue!==this.horizAlign){
        this.horizAlign=newValue;
        this.update();
      }
    },
    setValue:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.value!==newValue) {
        this.value=newValue;
        this.update();
      }
    },
    setMin:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.min!==newValue) {
        this.min=newValue;
      }
    },
    setMax:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.max!==newValue) {
        this.max=newValue;
      }
    },
    setOpened:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.opened!==newValue) {
        this.opened=newValue;
        this.update();
        if (this.opened) this.showPopup();
        else this.form.destroyPopups();
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._content=this._DOMObj.firstElementChild;
        this._content.jsObj=this;
      }
    },
    updateFromDOM:function() {
      var data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-value"):this._DOMObj.dataset.value;
      if (!$j.tools.isNull(data)) this.value=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-horizalign"):this._DOMObj.dataset.horizalign;
      if (!$j.tools.isNull(data)) this.horizAlign=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-min"):this._DOMObj.dataset.min;
      if (!$j.tools.isNull(data)) this.min=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-max"):this._DOMObj.dataset.max;
      if (!$j.tools.isNull(data)) this.max=~~data;
      //this.update();
      this._inherited();
    },
    update:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        if ($j.browser.ie) this._DOMObj.setAttribute("data-opened",this.opened);
        else this._DOMObj.dataset.opened=this.opened;
      }
      if (!$j.tools.isNull(this._content)) {
        this._content.innerHTML=this.value;
        this._content.style[$j.types.jsCSSProperties.TEXTALIGN]=this.horizAlign;
      }
    },
    mouseDown: function(){
      var lastOpened=this.opened;
      if (this===this.form._focusedControl) {
        if (lastOpened) this._closePopups=false;
      }
      this._inherited();
      this._closePopups=true;
      this.setOpened(!this.opened);
    },
    showPopup:function() {
      var pt=this.clientToDocument(),lbHeight;
      if ($j.tools.isNull(this._dropDownPopup)) {
        this._dropDownPopup=$j.classes.createComponent($j.classes.DropDownSliderPopup,this,String.empty,{"parentDOM":$j.doc.body});
        this._dropDownPopup._control=this;
        this._dropDownPopup.onlyHide=true;
        this._dropDownPopup._slider.setValues([this.value,0]);
      }
      $j.CSS.removeClass(this._dropDownPopup._DOMObj,"hidden");
      this._dropDownPopup.show(pt.x,pt.y+this._DOMObj.offsetHeight);
      $j.CSS.addClass(this._dropDownPopup._DOMObj,"animated fadeIn");
    },
    destroyPopup:function() {
      this._dropDownPopup.destroy();
    }
    //#endregion
  });
  Object.seal(DropDownSlider);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,SliderPopup,DropDownSliderPopup);
  $j.classes.register($j.types.categories.EXTENDED,DropDownSlider);
  //#region Templates
  var DropDownSliderTpl=["<div id='{internalId}' data-name='{name}' data-class='DropDownSlider' class='DropDownSlider' data-theme='{theme}' style='{style}' data-value='0'>",
                         "<div class='DropDownSliderValue' data-theme='{theme}' style='text-align: center;'>0</div>",
                         "<span>(</span>",
                         "</div>"].join(String.empty),
      DropDownSliderPopupTpl=["<div id='{internalId}' class='PopupBox PopupSlider csr_default' data-theme='{theme}' style='{style}'>",
                              "{slider}",
                              "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:DropDownSlider,template:DropDownSliderTpl},{Class:DropDownSliderPopup,template:DropDownSliderPopupTpl},{Class:SliderPopup,template:$j.templates["Slider"]}]);
  //#endregion
})();