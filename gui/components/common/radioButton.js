(function(){
  var RadioButton=$j.classes.CheckBox.extend({
    _ClassName: "RadioButton",
    init: function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.groupName=String.empty;
      }
    },
    //#region Setters
    setAllowGrayed:function(newValue) {
      this.allowGrayed=false;
    },
    //#endregion
    //#region Methods
    setIsChecked:function(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.isChecked!==newValue) {
        if(newValue) this.isChecked=newValue;
        // group
        var c=0,cc=0;
        if(!$j.tools.isNull(this.form)) {
          var list=this._owner._components;
          for(var i=0,l=list.length;i<l;i++)
            if(list[i] instanceof $j.classes.RadioButton&&(list[i]!==this)&&(list[i].groupName===this.groupName)) {
              if(list[i].isChecked) cc++;
              if(newValue) list[i].setIsChecked(false);
              c++;
            }
          list=null;
        }
        // check 
        if(!newValue&&(c===0)) return;
        if(!newValue&&(cc===0)) return;
        this.isChecked=newValue;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.redraw();
        } else this.update();
        // event
        if (!this._updating) this.onChange.invoke();
      }
    }
    //#endregion
  });
  Object.seal(RadioButton);
  $j.classes.register($j.types.categories.COMMON,RadioButton);
  //#region Template
  var RadioButtonTpl="<div id='{internalId}' data-name='{name}' data-class='RadioButton' style='{style}' class='RadioButton' data-theme='{theme}' data-ischecked='false'>{caption}</div>";
  $j.classes.registerTemplates([{Class:RadioButton,template:RadioButtonTpl}]);
  //#endregion
})();