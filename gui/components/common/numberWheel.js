(function(){
  var NumberWheel=$j.classes.ItemsWheel.extend({
    _ClassName:"NumberWheel",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        this.min=0;
        this.max=100;
        this.numberDigits=2;
      }
    },
    //#region Setters
    setMin:function(newValue) {
      if (typeof newValue!==_const.NUMBER)return;
      if (newValue!==this.min){
        this.min=newValue;
        this.recreateItems();
      }
    },
    setMax:function(newValue) {
      if (typeof newValue!==_const.NUMBER)return;
      if (newValue!==this.max){
        this.max=newValue;
        this.recreateItems();
      }
    },
    setNumberDigits:function(newValue) {
      if (typeof newValue!==_const.NUMBER)return;
      if (newValue!==this.numberDigits){
        this.numberDigits=newValue;
        this.recreateItems();
      }
    },
    //#endregion
    //#region Methods
    updateFromDOM: function() {
      var data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-min"):this._DOMObj.dataset.min;
      this.min=parseFloat(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-max"):this._DOMObj.dataset.max;
      this.max=parseFloat(data);
      this._inherited();
    },
    recreateItems:function() {
      var str;
      this.items.clear();
      for (var i=this.min;i<=this.max;i++) {
        str=i.toString();
        if (str.length<this.numberDigits) str=String.dupeString("0",this.numberDigits-str.length)+str;
        this.items.push(str);
      }
      this._inherited();
    }
    //#endregion
  });
  Object.seal(NumberWheel);
  $j.classes.register($j.types.categories.COMMON,NumberWheel);
  //#region Templates
  var NumberWheelTpl=["<div id='{internalId}' class='NumberWheel' data-theme='{theme}'>",
                      "<div class='NumberWheelSep' data-theme='{theme}'></div>",
                      "<div class='NumberWheelContent' data-theme='{theme}'>",
                      "</div>",
                      "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:NumberWheel,template:NumberWheelTpl}]);
  //endregion
})();