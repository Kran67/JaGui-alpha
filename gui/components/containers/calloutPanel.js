(function(){
  var CalloutPanel=$j.classes.ThemedControl.extend({
    _ClassName: "CalloutPanel",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this.calloutPosition=$j.types.calloutPositions.TOP;
        this.calloutOffset=0;
        this.calloutLength=11;
        this.calloutWidth=23;
        this._inherited(owner,props);
        this.clipChilds=false;
      }
    },
    //#region Setter
    setCalloutPosition:function(newValue){
      if (!$j.tools.valueInSet(newValue,$j.types.calloutPositions)) return;
      if (this.calloutPosition!==newValue){
        this.calloutPosition=newValue;
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    setCalloutOffset:function(newValue){
      if (typeof newValue!==_const.NUMBER) return;
      if (this.calloutOffset!==newValue){
        this.calloutOffset=newValue;
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    setCalloutLength:function(newValue){
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0) newValue=0;
      if (this.calloutLength!==newValue){
        this.calloutLength=newValue;
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    setCalloutWidth:function(newValue){
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0) newValue=0;
      if (this.calloutWidth!==newValue){
        this.properties.calloutWidth=newValue;
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    //#endregion
    //#region Methods
    update:function() {
      var cssRuleValuesB=String.empty,pos=0;
      if (this._loading||this.form._loading) return;
      switch (this.calloutPosition) {
        case $j.types.calloutPositions.TOP:
          cssRuleValuesB+="top:-"+this.calloutLength+$j.types.CSSUnits.PX+";";
          pos=(~~((this.width-this.calloutWidth)/2)-this.calloutOffset);
          if (pos<0) pos=0;
          else if (pos>=this.width-this.calloutWidth) pos=this.width-this.calloutWidth;
          cssRuleValuesB+="left:"+pos+$j.types.CSSUnits.PX+";";
          cssRuleValuesB+="border-top:0;";
          cssRuleValuesB+="border-left:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-right:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-bottom-width:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+";";
          break;
        case $j.types.calloutPositions.RIGHT:
          cssRuleValuesB+="right:-"+this.calloutLength+$j.types.CSSUnits.PX+";";
          pos=(~~((this.height-this.calloutWidth)/2)-this.calloutOffset);
          if (pos<0) pos=0;
          else if (pos>=this.height-this.calloutWidth) pos=this.height-this.calloutWidth;
          cssRuleValuesB+="top:"+pos+$j.types.CSSUnits.PX+";";
          cssRuleValuesB+="border-right:0;";
          cssRuleValuesB+="border-top:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-bottom:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-left-width:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+";";
          break;
        case $j.types.calloutPositions.BOTTOM:
          cssRuleValuesB+="bottom:-"+this.calloutLength+$j.types.CSSUnits.PX+";";
          pos=(~~((this.width-this.calloutWidth)/2)-this.calloutOffset);
          if (pos<0) pos=0;
          else if (pos>=this.width-this.calloutWidth) pos=this.width-this.calloutWidth;
          cssRuleValuesB+="left:"+pos+$j.types.CSSUnits.PX+";";
          cssRuleValuesB+="border-bottom:0;";
          cssRuleValuesB+="border-left:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-right:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-top-width:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+";";
          break;
        case $j.types.calloutPositions.LEFT:
          cssRuleValuesB+="left:-"+this.calloutLength+$j.types.CSSUnits.PX+";";
          pos=(~~((this.height-this.calloutWidth)/2)-this.calloutOffset);
          if (pos<0) pos=0;
          else if (pos>=this.height-this.calloutWidth) pos=this.height-this.calloutWidth;
          cssRuleValuesB+="top:"+pos+$j.types.CSSUnits.PX+";";
          cssRuleValuesB+="border-left:0;";
          cssRuleValuesB+="border-top:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-bottom:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+" solid rgba(0,0,0,0);";
          cssRuleValuesB+="border-right-width:"+~~(this.calloutWidth/2)+$j.types.CSSUnits.PX+";";
          break;
      }
      $j.CSS.removeCSSRule("div[id='"+this._internalId+"']:before")
      $j.CSS.addCSSRule("div[id='"+this._internalId+"']:before",cssRuleValuesB);
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-calloutwidth"):this._DOMObj.dataset.calloutwidth;
      if (!$j.tools.isNull(data)) this.calloutWidth=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-calloutlength"):this._DOMObj.dataset.calloutlength;
      if (!$j.tools.isNull(data)) this.calloutLength=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-calloutoffset"):this._DOMObj.dataset.calloutoffset;
      if (!$j.tools.isNull(data)) this.calloutOffset=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-position"):this._DOMObj.dataset.position;
      if (!$j.tools.isNull(data)) this.position=data;
    }
    //#endregion
  });
  Object.seal(CalloutPanel);
  $j.classes.register($j.types.categories.CONTAINERS,CalloutPanel);
  //#region Templates
  var CalloutPanelTpl="<div id='{internalId}' data-name='{name}' data-class='CalloutPanel' class='CalloutPanel' data-theme='{theme}' style='{style}' data-calloutposition='top' data-calloutoffset='0' data-calloutlength='11' data-calloutwidth='23'></div>";
  //endregion
  $j.classes.registerTemplates([{Class:CalloutPanel,template:CalloutPanelTpl}]);
})();