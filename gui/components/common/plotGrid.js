(function(){
  var PlotGrid=$j.classes.PaintBox.extend({
    _ClassName: "PlotGrid",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._ctx=null;
        //#endregion
        this.lineFill=new $j.classes.Brush($j.types.brushStyles.SOLID,_colors.parse("#333"),this);
        this.marks=25;
        this.frequency=5;
      }
    },
    //#region Setters
    setLineFill:function(newValue) {
      if (!(newValue instanceof $j.classes.Brush)) return;
      if (this.lineFill!==newValue) {
        this.lineFill.assign(newValue);
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    setMarks:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.marks!==newValue){
        this.marks=newValue;
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    setFrequency:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.frequency!==newValue) {
        if (newValue<0.001) newValue=0.001;
        this.frequency=newValue;
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
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._ctx=this._DOMObj.getContext("2d");
      }
    },
    update:function(){
      this._DOMObj.setAttribute('width', this.width);
      this._DOMObj.setAttribute('height', this.height);
      this.paint();
    },
    paint:function(){
      if ((this.width===0)||(this.height===0)) return;
      if ($j.tools.isNull(this._ctx)) return;
      if (!this.isEnabled()) return;
      var x=0,y=0,c=new $j.classes.Color(_colors.TRANSPARENT),w2=this.width/2,h2=this.height/2;
      c.assign(this.lineFill.color);
      c.opacity(0.4);
      this._ctx.save();
      while (x<w2) {
        if (x===0) {
          this._ctx.lineWidth=2;
          this._ctx.strokeStyle=this.lineFill.color.toARGBString();
        } else {
          if (($j.frac(x)===0) && ($j.frac(x/this.frequency/this.marks)===0)) this._ctx.strokeStyle=this.lineFill.color.toARGBString();
          else this._ctx.strokeStyle=c.toARGBString();
          this._ctx.lineWidth=1;
        }
        this._ctx.beginPath();
        this._ctx.moveTo(w2+x+(this._ctx.lineWidth/2),0);
        this._ctx.lineTo(w2+x+(this._ctx.lineWidth/2),this.height);
        if (x!==0) {
          this._ctx.moveTo(w2-x+(this._ctx.lineWidth/2),0);
          this._ctx.lineTo(w2-x+(this._ctx.lineWidth/2),this.height);
        }
        this._ctx.stroke();
        x+=this.frequency;
      }
      while (y<h2) {
        if (y===0){
          this._ctx.lineWidth=2;
          this._ctx.strokeStyle=this.lineFill.color.toARGBString();
        } else {
          if (($j.frac(y)===0) && ($j.frac(y/this.frequency/this.marks)===0)) this._ctx.strokeStyle=this.lineFill.color.toARGBString();
          else this._ctx.strokeStyle=c.toARGBString();
          this._ctx.lineWidth=1;
        }
        this._ctx.beginPath();
        this._ctx.moveTo(0,h2+y+(this._ctx.lineWidth/2));
        this._ctx.lineTo(this.width,h2+y+(this._ctx.lineWidth/2));
        if (y!==0) {
          this._ctx.moveTo(0,h2-y+(this._ctx.lineWidth/2));
          this._ctx.lineTo(this.width,h2-y+(this._ctx.lineWidth/2));
        }
        this._ctx.stroke();
        y+=this.frequency;
      }
      c=null;
      this._ctx.restore();
      if ($j.isDOMRenderer) this.onPaint.invoke();
    },
    assign:function(source) {
      if (!(source instanceof $j.classes.PlotGrid)) return;
      this._inherited(source);
      this.lineFill.assign(source.lineFill);
      this.marks=source.marks;
      this.frequency=source.frequency;
    },
    updateFromDOM:function() {
      this._inherited();
      this.width=parseInt(this._DOMObj.getAttribute("width"),10);
      this.height=parseInt(this._DOMObj.getAttribute("height"),10);
    },
    loaded:function() {
      this._inherited();
      this.paint();
    }
    //#endregion
  });
  Object.seal(PlotGrid);
  $j.classes.register($j.types.categories.COMMON,PlotGrid);
  //#region Templates
  var PlotGridTpl="<canvas id='{internalId}' data-class='PlotGrid' data-name='{name}' width='{width}' height='{height}' style='{style}'></canvas>";
  //endregion
  $j.classes.registerTemplates([{Class:PlotGrid,template:PlotGridTpl}]);
})();