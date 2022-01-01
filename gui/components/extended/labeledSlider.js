(function(){
  var LabeledSlider=$j.classes.LabeledControl.extend({
    _ClassName:"LabeledSlider",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.slider=$j.classes.createComponent($j.classes.Slider,this,null,null,false);
        this.slider.onChange.addListener(this.valueChange);
        this.valueLabel=$j.classes.createComponent($j.classes.ValueLabel,this,null,null,false);
      }
    },
    //#region Methods
    getChildsDOMObj:function() {
      var nextId;
      if (!$j.tools.isNull(this._DOMObj)) {
        nextId=this._DOMObj.firstElementChild.nextSibling;
        while (nextId.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          nextId=nextId.nextSibling;
        }
        this.slider.getDOMObj(nextId.id);
        this.slider.getChildsDOMObj();
        this.slider.updateFromDOM();
        this.valueLabel.getDOMObj(this._DOMObj.lastElementChild.id);
        this.valueLabel.updateFromDOM();
      }
    },
    valueChange:function() {
      var lab=this._owner;
      lab.valueLabel.setCaption(lab.slider.values.first().toFixed(lab.slider.decimalPrecision));
    }
    //#endregion
  });
  Object.seal(LabeledSlider);
  $j.classes.register($j.types.categories.EXTENDED,LabeledSlider);
  //#region Template
  var LabeledSliderTpl=["<div id='{internalId}' data-name='{name}' data-class='LabeledSlider' style='{style}'>",
                        "{label}",
                        "{horizontalSlider}",
                        "{valueLabel}",
                        "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:LabeledSlider,template:LabeledSliderTpl}]);
  //#endregion
})();