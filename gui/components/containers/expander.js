(function(){
  var Expander=$j.classes.ThemedControl.extend({
    _ClassName:"Expander",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._header=null;
        this._button=null;
        this._eye=null;
        this._headerCaption=null;
        this._container=$j.classes.createComponent($j.classes.Layout,this,null,null,false);
        //#endregion
        this.expanded=false;
        this.checked=false;
        this.caption=this._ClassName;
      }
    },
    //#region Setters
    setCaption: function CaptionControl_setCaption(newValue){
      if (typeof newValue!==_const.STRING) return;
      if (this.caption!==newValue){
        this.caption=newValue;
        if (!$j.tools.isNull(this._headerCaption)) this._headerCaption.innerHTML=this.caption;
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function(id) {
      this._inherited(id);
      this._header=this._DOMObj.firstElementChild;
      this._header.jsObj=this;
      this._button=this._header.firstElementChild;
      this._button.jsObj=this;
      $j.tools.events.bind(this._button,$j.types.mouseEvents.CLICK,this.expendCollapse);
      this._eye=this._button.nextSibling;
      while (this._eye.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
        this._eye=this._eye.nextSibling;
      }
      this._eye.jsObj=this;
      $j.tools.events.bind(this._eye,$j.types.mouseEvents.CLICK,this.check);
      this._headerCaption=this._header.lastElementChild;
      this._headerCaption.jsObj=this;
      this._container._DOMObj=this._DOMObj.lastElementChild;
      this._container._DOMObj.jsObj=this;
      if ($j.browser.ie) {
        if (!$j.tools.isNull(this._container._DOMObj.getAttribute("data-enabled"))) this._container.enabled=_conv.strToBool(this._container._DOMObj.getAttribute("data-enabled"));
      } else {
        if (!$j.tools.isNull(this._container._DOMObj.dataset.enabled)) this._container.enabled=_conv.strToBool(this._container._DOMObj.dataset.enabled);
      }
      this._container.getChildsDOMObj(this._container._DOMObj);
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      if (!$j.tools.isNull(this._button)) data=($j.browser.ie)?this._button.getAttribute("data-expanded"):this._button.dataset.expanded;
      if (!$j.tools.isNull(data)) this.expanded=_conv.strToBool(data);
      if (!$j.tools.isNull(this._eye)) data=($j.browser.ie)?this._eye.getAttribute("data-checked"):this._eye.dataset.checked;
      if (!$j.tools.isNull(data)) this.checked=_conv.strToBool(data);
      this.height=~~(($j.browser.ie)?this._DOMObj.getAttribute("data-height"):this._DOMObj.dataset.height);
    },
    expendCollapse:function() {
      var obj=this.jsObj;
      obj.expanded=!obj.expanded;
      if (obj.expanded) obj._DOMObj.style.height=obj.height+$j.types.CSSUnits.PX;
      else obj._DOMObj.style.height=obj._header.offsetHeight+$j.types.CSSUnits.PX;
      if ($j.browser.ie) obj._button.setAttribute("data-expanded",obj.expanded);
      else obj._button.dataset.expanded=obj.expanded;
    },
    check:function() {
      var obj=this.jsObj;
      obj.checked=!obj.checked;
      obj._container.setEnabled(obj.checked);
      if ($j.browser.ie) obj._eye.setAttribute("data-checked",obj.checked);
      else obj._eye.dataset.checked=obj.checked;
    }
    //#endregion
  });
  Object.seal(Expander);
  $j.classes.register($j.types.categories.CONTAINERS,Expander);
  //#region Template
  var ExpanderTpl=["<div id='{internalId}' data-name='{name}' data-class='Expander' class='Expander' data-theme='{theme}' style='{style}'>",
                   "<div class='ExpanderHeader' data-theme='{theme}'>",
                   "<div class='ExpanderButton' data-theme='{theme}' data-expanded='true'><span></span></div>",
                   "<div class='ExpanderCheckBox' data-theme='{theme}' data-checked='true'></div>",
                   "<label class='ExpanderCaption csr_default' data-theme='{theme}'>Expander1</label>",
                   "</div>",
                   "<div class='ExpanderViewPort' data-theme='{theme}'>",
                   "</div>",
                   "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:Expander,template:ExpanderTpl}]);
  //#endregion
})();