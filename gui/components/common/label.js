(function(){
  var Label=$j.classes.CaptionControl.extend({
    _ClassName: "Label",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this.horizAlign=$j.types.textAligns.LEFT;
        this.width=65;
        this.height=170;
        this._inherited(owner,props);
        this.autoSize=true;
        this.vertAlign=$j.types.vertTextAligns.TOP;
      }
    },
    //#region setters
    setAutoSize: function(newValue){
      if (typeof newValue!==_const.BOOLEAN) return;
      if (newValue!==this.autoSize){
        this.properties.autoSize=newValue;
        if (!this._loading&&!this.form._loading) this.update();
      }
    },
    setVertAlign:function(newValue){
      if (!$j.tools.valueInSet(newValue,$j.types.vertTextAligns)) return;
      if (newValue!==this.vertAlign){
        this.properties.vertAlign=newValue;
        if (!this._loading&&!this.form._loading) this.update();
      }
    },
    //#endregion
    //#region Methods
    update:function(){
      this._inherited();
      if (this.autoSize) {
        this._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=String.empty;
        this._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=String.empty;
      } else {
        this._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=this.width;
        this._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=this.height;
      }
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-vertalign"):this._DOMObj.dataset.vertalign;
      if (!$j.tools.isNull(data)) this.vertAlign=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-autosize"):this._DOMObj.dataset.autosize;
      if (!$j.tools.isNull(data)) this.autoSize=_conv.strToBool(data);
    }
    //#endregion
  });
  Object.seal(Label);
  $j.classes.register($j.types.categories.COMMON,Label);
  //#region Templates
  var LabelTpl="<label id='{internalId}' data-name='{name}' data-class='Label' class='Label csr_default' data-theme='{theme}' style='{style}'>{caption}</label>";
  $j.classes.registerTemplates([{Class:Label,template:LabelTpl}]);
  //endregion
})();