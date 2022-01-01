(function(){
  //#region PathButton final
  var PathButton=$j.classes.SpeedButton.extend({
    _ClassName: "PathButton",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.path=new $j.classes.PathData(this);
        this.glyphNormalStrokeColor=new $j.classes.Color(_colors.BLACK);
        this.glyphNormalFillColor=new $j.classes.Color(_colors.WHITE);
        this.glyphHoveredStrokeColor=new $j.classes.Color(_colors.BLACK);
        this.glyphHoveredFillColor=new $j.classes.Color(_colors.WHITE);
        this.glyphPressedStrokeColor=new $j.classes.Color(_colors.BLACK);
        this.glyphPressedFillColor=new $j.classes.Color(_colors.WHITE);
        this.glyphDOMElement=$j.types.HTMLElements.CANVAS;
        this.canFocused=true;
      }
    },
    //#region Setter
    setGlyphPressedFillColor:function(newValue){
      if (!(newValue instanceof $j.classes.Color)) return;
      if(this.glyphPressedFillColor!==newValue) {
        this.glyphPressedFillColor.assign(newValue);
        if ($j.isDOMRenderer) {
          this.update();
          this.paint();
        }
      }
    },
    setGlyphNormalStrokeColor: function(newValue){
      if (!(newValue instanceof $j.classes.Color)) return;
      if(this.glyphNormalStrokeColor!==newValue) {
        this.glyphNormalStrokeColor.assign(newValue);
        if ($j.isDOMRenderer) {
          this.update();
          this.paint();
        }
      }
    },
    setGlyphHoveredStrokeColor:function(newValue){
      if (!(newValue instanceof $j.classes.Color)) return;
      if(this.glyphHoveredStrokeColor!==newValue) {
        this.glyphHoveredStrokeColor.assign(newValue);
        if ($j.isDOMRenderer) {
          this.update();
          this.paint();
        }
      }
    },
    setGlyphHoveredFillColor: function(newValue){
      if (!(newValue instanceof $j.classes.Color)) return;
      if(this.glyphHoveredFillColor!==newValue) {
        this.glyphHoveredFillColor.assign(newValue);
        if ($j.isDOMRenderer) {
          this.update();
          this.paint();
        }
      }
    },
    setGlyphPressedStrokeColor:function(newValue){
      if (!(newValue instanceof $j.classes.Color)) return;
      if(this.glyphPressedStrokeColor!==newValue) {
        this.glyphPressedStrokeColor.assign(newValue);
        if ($j.isDOMRenderer) {
          this.update();
          this.paint();
        }
      }
    },
    //#endregion
    //#region Methods
    assign:function(source){
      if(!source instanceof $j.pathButton) return;
      $j.SpeedButton.prototype.assign.apply(this,[source]);
      this.path.assign(source.path);
    },
    paint:function(){
      if ((this.width===0)||(this.height===0)) return;
      if ($j.tools.isNull(this.glyph)) return;
      this.ctx.save();
      this.ctx.clear();
      if (this._isMouseOver&&!this._isPressed) {
        this.ctx.strokeStyle=this.glyphHoveredStrokeColor.toARGBString();
        this.ctx.fillStyle=this.glyphHoveredFillColor.toARGBString();
      } else if (this._isPressed) {
        this.ctx.strokeStyle=this.glyphPressedStrokeColor.toARGBString();
        this.ctx.fillStyle=this.glyphPressedFillColor.toARGBString();
      } else {
        this.ctx.strokeStyle=this.glyphNormalStrokeColor.toARGBString();
        this.ctx.fillStyle=this.glyphNormalFillColor.toARGBString();
      }
      this.ctx.drawPath(this,this.path,false);
      this.ctx.restore();
    },
    update:function(){
      if ($j.tools.isNull(this.glyph)) return;
      var p,r,b,clientRect=new $j.classes.Rect(0,0,this.glyphSize,this.glyphSize);
      p=this.path;
      if(!p.empty()){
        b=p.originalBounds;
        p.resizeToRect(b);
        r=p.bounds();
        r=r.fit(clientRect).rect;
        p.resizeToRect(r);
      }
      this.glyph.setAttribute('width', this.glyphSize);
      this.glyph.setAttribute('height', this.glyphSize);
    },
    mouseDown:function(mouseButton,point) {
      this._inherited(mouseButton,point);
      if ($j.isDOMRenderer) this.paint();
    },
    mouseUp:function(mouseButton,point) {
      this._inherited(mouseButton,point);
      if ($j.isDOMRenderer) this.paint();
    },
    mouseEnter:function(mouseButton,point) {
      this._inherited(mouseButton,point);
      if ($j.isDOMRenderer) this.paint();
    },
    mouseLeave:function(mouseButton,point) {
      this._inherited(mouseButton,point);
      if ($j.isDOMRenderer) this.paint();
    },
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this.glyph)) this.ctx=this.glyph.getContext("2d");
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-path"):this._DOMObj.dataset.path;
      if (!$j.tools.isNull(data)) this.path.setPathString(atob(data));
      if (!this.path.empty()) {
        $j.CSS.removeClass(this.glyph,"hidden");
        this.update();
        this.paint();
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-glyphnormalstrokecolor"):this._DOMObj.dataset.glyphnormalstrokecolor;
      if (!$j.tools.isNull(data)) this.glyphNormalStrokeColor=$j.tools.colors.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-glyphnormalfillcolor"):this._DOMObj.dataset.glyphnormalfillcolor;
      if (!$j.tools.isNull(data)) this.glyphNormalFillColor=$j.tools.colors.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-glyphhoveredstrokecolor"):this._DOMObj.dataset.glyphhoveredstrokecolor;
      if (!$j.tools.isNull(data)) this.glyphHoveredStrokeColor=$j.tools.colors.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-glyphhoveredfillcolor"):this._DOMObj.dataset.glyphhoveredfillcolor;
      if (!$j.tools.isNull(data)) this.glyphHoveredFillColor=$j.tools.colors.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-glyphpressedstrokecolor"):this._DOMObj.dataset.glyphpressedstrokecolor;
      if (!$j.tools.isNull(data)) this.glyphPressedStrokeColor=$j.tools.colors.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-glyphpressedfillcolor"):this._DOMObj.dataset.glyphpressedfillcolor;
      if (!$j.tools.isNull(data)) this.glyphPressedFillColor=$j.tools.colors.parse(data);
    }
    //#endregion
    //#endregion
  });
  Object.seal(PathButton);
  $j.classes.register($j.types.categories.EXTENDED,PathButton);
  //#region Template
  var PathButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='PathButton' style='{style}' class='PathButton' data-theme='{theme}'>",
                     "<span>{caption}</span>",
                     "<canvas></canvas>",
                     "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:PathButton,template:PathButtonTpl}]);
  //#endregion
})();