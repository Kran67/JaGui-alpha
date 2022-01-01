(function(){
  var PathCheckBox=$j.classes.CheckBox.extend({
    _ClassName: "PathCheckBox",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.height=17;
        this.width=100;
        this.checkSvg="m49.568024,19.824736l-31.863983,29.73797l-17.705017,-16.521305l0,-19.824999l17.705017,16.469412l31.863983,-29.686078l0,19.825z";
        this.svgViewBox="0 0 50 50";
        this.canFocused=false;
      }
    },
    //#region Setters
    setCheckSvg: function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (newValue!==this.checkSvg) {
        this.checkSvg=newValue;
        if ($j.isDOMRenderer) {
          this.addCheckedRule();
        }
      }
    },
    setAllowGrayed:function(newValue) {
      this.allowGrayed=false;
    },
    //#endregion
    //#region Methods
    update: function CaptionControl_update() {
      if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
      this._inherited();
      this._DOMObj.innerHTML=this.caption+["<svg width='",this.height,"' height='",this.height,"' viewBox='",this.svgViewBox,"' xmlns='http://www.w3.org/2000/svg'><path d='",this.checkSvg,"' /></svg>"].join(String.empty);
      if (!this.wordWrap) this._DOMObj.style[$j.types.jsCSSProperties.WHITESPACE]="nowrap";
      else this._DOMObj.style[$j.types.jsCSSProperties.WHITESPACE]=String.empty;
    },
    updateFromDOM: function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-checksvg"):this._DOMObj.dataset.checksvg;
      if (!$j.tools.isNull(data)) this.checkSvg=atob(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-svgviewbox"):this._DOMObj.dataset.svgviewbox;
      if (!$j.tools.isNull(data)) this.svgViewBox=data;
    },
    loaded:function() {
      this._inherited();
      this.update();
    }
    //#endregion
  });
  Object.seal(PathCheckBox);
  $j.classes.register($j.types.categories.EXTENDED,PathCheckBox);
  //#region Template
  var PathCheckBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='PathCheckBox' style='{style}' class='PathCheckBox' data-theme='{theme}'>",
                       "{caption}",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:PathCheckBox,template:PathCheckBoxTpl}]);
  //#ednregion
})();