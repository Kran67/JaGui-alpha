(function(){
  var GroupBox=$j.classes.CaptionControl.extend({
    _ClassName: "GroupBox",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._legendObj=null;
        //#endregion
        this._autoTranslate=true;
        this.canFocused=false;
        this.width=120;
        this.height=100;
        this.padding.setValues(5,15,5,5);
        this.horizAlign=$j.types.textAligns.LEFT;
        //this.addProperty("glyph",null,null,true,false,false,$j.doc.createElement($j.types.HTMLElements.IMG));
        //this.glyph.owner=this;
        //$j.tools.events.bind(this.glyph,$j.types.HTMLEvents.LOAD,this.doBitmapLoaded);
        //$j.tools.events.bind(this.glyph,$j.types.HTMLEvents.ERROR,this.doBitmapNotLoaded);
        //this.addProperty("legend",null,null,true,false,true);
      }
    },
    //#region Methods
    doBitmapLoaded:function(){
      if (!$j.isDOMRenderer) {
        if (this._owner._allowUpdate) this._owner.update();
        this.redraw();
      } else this.update();
    },
    doBitmapNotLoaded:function(){throw "Bitmap error";},
    update:function(){
      if (this._loading||this.form._loading) return;
      if (!$j.tools.isNull(this.legend)) this.legend.setAttribute("align",this.horizAlign);
    },
    updateCaption:function() {
      this.legend.innerHTML=this.caption;
    },
    getDOMObj: function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._legendObj=this._DOMObj.firstElementChild;
        this._legendObj.jsObj=this;
      }
    },
    updateFromDOM: function() {
      this._inherited();
      this.caption=this._legendObj.innerHTML;
    }
    //#endregion
  });
  Object.seal(GroupBox);
  $j.classes.register($j.types.categories.CONTAINERS,GroupBox);
  //#region Templates
  var GroupBoxTpl=["<fieldset id='{internalId}' data-name='{name}' data-class='GroupBox' class='GroupBox' data-theme='{theme}' style='{style}'>",
                   "<legend>{caption}</legend>",
                   "</fieldset>"].join(String.empty);
  //endregion
  $j.classes.registerTemplates([{Class:GroupBox,template:GroupBoxTpl}]);
})();