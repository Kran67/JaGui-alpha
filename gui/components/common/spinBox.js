(function(){
  //#region spinBoxTypes
  $j.types.spinBoxTypes={
    INTEGER:"integer",
    FLOAT:"float"
  };
  Object.seal($j.types.spinBoxTypes);Object.freeze($j.types.spinBoxTypes);
  //#endregion
  //#region SpinBox
  var SpinBox=$j.classes.CustomTextControl.extend({
    _ClassName: "SpinBox",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._btnPlus=null;
        this._btnMinus=null;
        //#endregion
        this.width=100;
        this.height=21;
        this.valueType=$j.types.spinBoxTypes.INTEGER;
        this.value=0;
        this.increment=1;
        this.decimalDigits=2;
        this.min=0;
        this.max=10;
        this.filterChars='0123456789.,-';
      }
    },
    //#region Setter
    setValue:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.value!==newValue) {
        if (newValue>this.max) newValue=this.max;
        if (newValue<this.min) newValue=this.min;
        this.value=newValue;
        var DecimalSeparator=".";
        if (($j.frac(this.value)===0)||(this.valueType===$j.types.spinBoxTypes.INTEGER)) this.text=_conv.intToStr($j.trunc(this.value));
        else this.text=this.value.format('%'+DecimalSeparator+_conv.intToStr(this.decimalDigits)+'f',this.value);
      }
    },
    setIncrement:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.increment!==newValue) this.increment=newValue;
    },
    setDecimalDigits:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.decimalDigits!==newValue) {
        this.decimalDigits=newValue;
        var oldValue=this.value;
        this.value=0;
        this.value=oldValue;
      }
    },
    setMin:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.min!==newValue) {
        this.min=newValue;
        if (this.value>this.min) this.value=this.min;
      }
    },
    setMax:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.max!==newValue) {
        this.max=newValue;
        if (this.value>this.max) this.value=this.max;
      }
    },
    setEnabled:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.enabled!==newValue) {
        this._inherited(newValue);
        if (this.enabled) {
          if ($j.browser.ie) {
            this._btnPlus.setAttribute("data-enabled","true");
            this._btnMinus.setAttribute("data-enabled","true");
          } else {
            this._btnPlus.dataset.enabled=true;
            this._btnMinus.dataset.enabled=true;
          }
        } else {
          if ($j.browser.ie) {
            this._btnPlus.setAttribute("data-enabled","false");
            this._btnMinus.setAttribute("data-enabled","false");
          } else {
            this._btnPlus.dataset.enabled=false;
            this._btnMinus.dataset.enabled=false;
          }
        }
      }
    },
    //#endregion
    //#region Methods
    update:function() {
      if (this._loading||this.form._loading) return;
      if (!$j.tools.isNull(this._inputObj)) {
        //this._inputObj.style[$j.types.jsCSSProperties.TEXTALIGN]=this.horizAlign;
        this._inputObj.value=this.value;
      }
    },
    loaded:function() {
      this._inherited();
      this.text=this.value;
    },
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._btnMinus=this._DOMObj.lastElementChild.previousSibling;
        while (this._btnMinus.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._btnMinus=this._btnMinus.previousSibling;
        }
        this._btnMinus.jsObj=this;
        $j.tools.events.bind(this._btnMinus,$j.types.mouseEvents.CLICK,this.decValue);
        this._btnPlus=this._DOMObj.lastElementChild;
        this._btnPlus.jsObj=this;
        $j.tools.events.bind(this._btnPlus,$j.types.mouseEvents.CLICK,this.incValue);
      }
    },
    textChanged:function() {
      this._inherited();
      if (this.text===String.empty||!$j.isNumber(this.value)) this.value=0;
    },
    decValue:function(event) {
      var obj=(this instanceof $j.classes.SpinBox)?this:this.jsObj;
      if (!obj.isEnabled()) return;
      obj.value-=obj.increment;
      if (obj.value<obj.min) obj.value=obj.min;
      obj.update();
    },
    incValue:function(event) {
      var obj=(this instanceof $j.classes.SpinBox)?this:this.jsObj;
      if (!obj.isEnabled()) return;
      obj.value+=obj.increment;
      if (obj.value>obj.max) obj.value=obj.max;
      obj.update();
    },
    keyDown:function() {
      this._inherited();
      if ($j.keyboard.keyCode===$j.types.VKeysCodes.VK_DOWN) this.decValue();
      else if ($j.keyboard.keyCode===$j.types.VKeysCodes.VK_UP) this.incValue();
    },
    updateFromDOM:function() {
    }
    //#endregion
  });
  $j.classes.register($j.types.categories.COMMON,SpinBox);
  //#endregion
  //#region Template
  var SpinBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='SpinBox' style='{style}' class='SpinBox' data-theme='{theme}'>",
                  "<input type='text' value='0' class='SpinBox_input csr_text' data-theme='{theme}'>",
                  "<div class='SpinBox_Minus' data-theme='{theme}' style='width: 16px;'><span></span></div>",
                  "<div class='SpinBox_Plus' data-theme='{theme}' style='width: 16px;'><span></span></div>",
                  "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:SpinBox,template:SpinBoxTpl}]);
  //#endregion
})();