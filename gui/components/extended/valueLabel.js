(function(){
  var ValueLabel=$j.classes.Label.extend({
    _ClassName: "ValueLabel",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.wordWrap=false;
        this.autoSize=false;
      }
    },
    //#region setter
    setCaption:function(newValue){
      if (typeof newValue!==_const.STRING) return;
      if (this.caption!==newValue){
        this.caption=$j.tools.text.replace(newValue,"<br>",String.SPACE);
        this.update();
      }
    }
    //#endregion
    //#region Methods
    //#endregion
  });
  Object.seal(ValueLabel);
  $j.classes.register($j.types.categories.EXTENDED,ValueLabel);
  //#region Template
  var ValueLabelTpl="<label id='{internalId}' data-name='{name}' data-class='ValueLabel' class='ValueLabel csr_default' data-theme='{theme}' style='{style}'>{caption}</label>";
  $j.classes.registerTemplates([{Class:ValueLabel,template:ValueLabelTpl}]);
  //#endregion
})();