(function(){
  var LabeledAngleBar=$j.classes.LabeledControl.extend({
    _ClassName:"LabeledAngleBar",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.angleButton=null;
        this.valueLabel=null;
        this.onChanged=new $j.classes.NotifyEvent(this);
        this.angleButton=$j.classes.createComponent($j.classes.AngleButton,this,null,null,false);
        this.angleButton.onChanged.addListener(this.valueChanged);
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
        this.angleButton.getDOMObj(nextId.id);
        this.angleButton.getChildsDOMObj();
        this.angleButton.updateFromDOM();
        this.valueLabel.getDOMObj(this._DOMObj.lastElementChild.id);
        this.valueLabel.updateFromDOM();
      }
    },
    valueChanged:function() {
      var lab=this._owner;
      lab.valueLabel.setCaption(this.value+"&deg;");
      lab.onChanged.invoke();
    }
    //#endregion
  });
  Object.seal(LabeledAngleBar);
  $j.classes.register($j.types.categories.EXTENDED,LabeledAngleBar);
  //#region Template
  var LabeledAngleBarTpl=["<div id='{internalId}' data-name='{name}' data-class='LabeledAngleBar' style='{style}'>",
                          "{label}",
                          "{angleButton}",
                          "{valueLabel}",
                          "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:LabeledAngleBar,template:LabeledAngleBarTpl}]);
  //#endregion
})();