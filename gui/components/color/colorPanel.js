(function(){
  $j.types.ColorPanelBoxes={PRIMARY:"primary",SECONDARY:"secondary"};
  var ColorPanel=$j.classes.Control.extend({
    _ClassName:"ColorPanel",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.colorBoxType=$j.types.ColorPanelBoxes.PRIMARY;
        this.width=160;
        this.height=160;
        this.onChange=new $j.classes.NotifyEvent(this);
        this.constraints.setValues(160,160,160,160);
        this.colorQuad=$j.classes.createComponent($j.classes.ColorQuad,this,null,null,false);
        this.colorQuad.onChange.addListener(this.doQuadChange);
        this.alphaSlider=$j.classes.createComponent($j.classes.AlphaSlider,this,null,null,false);
        this.alphaSlider.onChange.addListener(this.doAlphaChange);
        this.hueSlider=$j.classes.createComponent($j.classes.HUESlider,this,null,null,false);
        this.hueSlider.onChange.addListener(this.doHueChange);
        this.secondaryColorBox=$j.classes.createComponent($j.classes.ColorBox,this,null,null,false);
        this.secondaryColorBox.onClick.addListener(this.changeColorBox);
        this.secondaryColorBox.hitTest.mouseDown=true;
        this.primaryColorBox=$j.classes.createComponent($j.classes.ColorBox,this,null,null,false);
        this.primaryColorBox.onClick.addListener(this.changeColorBox);
        this.primaryColorBox.hitTest.mouseDown=true;
        this.colorQuad.setColorBox(this.primaryColorBox);
      }
    },
    //#region Setter
    setColorBoxType:function(newValue) {
      var c=new $j.classes.Color(_colors.TRANSPARENT);
      if (!$j.tools.valueInSet(newValue,$j.types.ColorPanelBoxes)) return;
      if (this.colorBoxType!==newValue) {
        this.colorBoxType=newValue;
        switch (this.colorBoxType) {
          case $j.types.ColorPanelBoxes.PRIMARY:
            c.assign(this.primaryColorBox.fillColor);
            this.colorQuad.colorBox=this.primaryColorBox;
            this.colorQuad.setColor(c);
            this.colorQuad.setHue(c.hue);
            this.hueSlider.setValues([c.hue/360,0]);
            this.alphaSlider.setValues([c.alpha,0]);
            this.primaryColorBox.fillColor.assign(c);
            break;
          case $j.types.ColorPanelBoxes.SECONDARY:
            c.assign(this.secondaryColorBox.fillColor);
            this.colorQuad.colorBox=this.secondaryColorBox;
            this.colorQuad.setColor(c);
            this.colorQuad.setHue(c.hue);
            this.hueSlider.setValues([c.hue/360,0]);
            this.alphaSlider.setValues([c.alpha,0]);
            this.secondaryColorBox.fillColor.assign(c);
            break;
        }
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      var elem;
      if (!$j.tools.isNull(this._DOMObj)) {
        this.colorQuad.getDOMObj(this._DOMObj.firstElementChild.id);
        this.colorQuad.updateFromDOM();
        elem=this._DOMObj.firstElementChild.nextSibling;
        while (elem.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          elem=elem.nextSibling;
        }
        this.alphaSlider.getDOMObj(elem.id);
        this.alphaSlider.getChildsDOMObj();
        this.alphaSlider.updateFromDOM();
        elem=elem.nextSibling;
        while (elem.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          elem=elem.nextSibling;
        }
        this.hueSlider.getDOMObj(elem.id);
        this.hueSlider.getChildsDOMObj();
        this.hueSlider.updateFromDOM();
        elem=elem.nextSibling;
        while (elem.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          elem=elem.nextSibling;
        }
        this.secondaryColorBox.getDOMObj(elem.id);
        this.secondaryColorBox.updateFromDOM();
        elem=elem.nextSibling;
        while (elem.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          elem=elem.nextSibling;
        }
        this.primaryColorBox.getDOMObj(elem.id);
        this.primaryColorBox.updateFromDOM();
      }
    },
    doQuadChange:function() {
      var colorPanel=this._owner;
      switch (colorPanel.colorBoxType) {
        case $j.types.ColorPanelBoxes.PRIMARY:
          colorPanel.primaryColorBox.fillColor.setAlpha(colorPanel.alphaSlider.values.first());
          colorPanel.primaryColorBox.update(); 
          break;
        case $j.types.ColorPanelBoxes.SECONDARY:
          colorPanel.secondaryColorBox.fillColor.setAlpha(colorPanel.alphaSlider.values.first());
          colorPanel.secondaryColorBox.update(); 
          break;
      }
      if (!colorPanel._updating) colorPanel.onChange.invoke();
    },
    doAlphaChange:function(){
      var colorPanel=this._owner;
      colorPanel.changeAlpha(this.values.first());
    },
    doHueChange:function(){
      var colorPanel=this._owner;
      colorPanel.colorQuad.setHue(this.values.first()*359);
      colorPanel.changeAlpha(colorPanel.alphaSlider.values.first());
    },
    changeAlpha:function(value) {
      switch (this.colorBoxType) {
        case $j.types.ColorPanelBoxes.PRIMARY:
          this.primaryColorBox.fillColor.setAlpha(value);
          this.primaryColorBox.update(); 
          break;
        case $j.types.ColorPanelBoxes.SECONDARY:
          this.secondaryColorBox.fillColor.setAlpha(value);
          this.secondaryColorBox.update(); 
          break;
      }
      if (!this._updating) this.onChange.invoke();
    },
    changeColorBox:function() {
      var colorPanel=this._owner;
      if (this===colorPanel.primaryColorBox) {
        this._DOMObj.style[$j.types.jsCSSProperties.ZINDEX]="1";
        colorPanel.secondaryColorBox._DOMObj.style[$j.types.jsCSSProperties.ZINDEX]=String.empty;
        colorPanel.setColorBoxType($j.types.ColorPanelBoxes.PRIMARY);
      } else if (this===colorPanel.secondaryColorBox) {
        this._DOMObj.style[$j.types.jsCSSProperties.ZINDEX]="1";
        colorPanel.primaryColorBox._DOMObj.style[$j.types.jsCSSProperties.ZINDEX]=String.empty;
        colorPanel.setColorBoxType($j.types.ColorPanelBoxes.SECONDARY);
      }
    }
    //#endregion
  });
  Object.seal(ColorPanel);
  $j.classes.register($j.types.categories.COLOR,ColorPanel);
  //#region Template
  var ColorPanelTpl=["<div id='{internalId}' data-name='{name}' data-class='ColorPanel' class='ColorPanel' data-theme='{theme}' style='{style}'>",
                     "{ColorQuadTpl}",
                     "{AlphaSliderTpl}",
                     "{HUESliderTpl}",
                     "{primaryColorBoxTpl}",
                     "{secondaryColorBoxTpl}",
                     "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ColorPanel,template:ColorPanelTpl}]);
  //#endregion
})();