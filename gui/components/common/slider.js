(function(){
  //#region SliderModes
  $j.types.sliderModes={
    NORMAL:"normal",
    RANGE:"range"
  };
  //#endregion
  //#region Slider
  var Slider=$j.classes.ThemedControl.extend({
    _ClassName:"Slider",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._thumbs=[null,null];
        this._range=null;
        this._curThumb=null;
        this._toolTips=[null,null];
        //#endregion
        this.width=100;
        this.height=14;
        this.canFocused=true;
        this.orientation=$j.types.orientations.HORIZONTAL;
        this.min=0;
        this.max=100;
        this.frequency=1;
        this.values=[0,0];
        this.mode=$j.types.sliderModes.NORMAL;
        this.setHitTest(true);
        this.showValues=false;
        this.toolTipsPosition=$j.types.anchors.TOP;
        this.decimalPrecision=0;
        this.onChange=new $j.classes.NotifyEvent(this);
      }
    },
    //#region Setters
    setOrientation:function(newValue) {
      if (!($j.tools.valueInSet(newValue,$j.types.orientations))) return;
      if (this.orientation!==newValue) {
        this.orientation=newValue;
        if (this.orientation===$j.types.orientations.HORIZONTAL&&((this.toolTipsPosition===$j.types.anchors.LEFT)||(this.toolTipsPosition===$j.types.anchors.RIGHT))) this.toolTipsPosition===$j.types.anchors.TOP;
        else if (this.orientation===$j.types.orientations.VERTICAL&&((this.toolTipsPosition===$j.types.anchors.TOP)||(this.toolTipsPosition===$j.types.anchors.BOTTOM))) this.toolTipsPosition===$j.types.anchors.LEFT;
        this.update();
        this.thumbFromValues();
      }
    },
    setMin:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.min!==newValue) {
        this.min=newValue;
        this.thumbFromValues();
      }
    },
    setMax:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.max!==newValue) {
        this.max=newValue;
        if (this.max<this.min) this.max=this.min+0.001;
        this.thumbFromValues();
      }
    },
    setFrequency:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.frequency!==newValue) {
        this.frequency=newValue;
        if (this.frequency!==0) this.setValues([$j.round(this.values.first()/this.frequency)*this.frequency,$j.round(this.values.last()/this.frequency)*this.frequency]);
      }
    },
    setValues:function(newValue) {
      if (!Array.isArray(newValue)) return;
      if (this.frequency>0) {
        newValue[0]=$j.round(newValue.first()/this.frequency)*this.frequency;
        newValue[1]=$j.round(newValue.last()/this.frequency)*this.frequency;
      }
      if (!this.values.equals(newValue)) {
        this.values[0]=newValue.first();
        this.values[1]=newValue.last();
        this.checkValues();
        this.update();
        this.thumbFromValues();
      }
    },
    setMode:function(newValue) {
      if (!($j.tools.valueInSet(newValue,$j.types.sliderModes))) return;
      if (this.mode!==newValue) {
        this.mode=newValue;
        //if (this.mode===$j.types.sliderModes.NORMAL) {
        //  if (!$j.tools.isNull(this._thumbs.last())) $j.CSS.addClass(this._thumbs.last(),"hidden");
        //  if (!$j.tools.isNull(this._range)) $j.CSS.addClass(this._range,"hidden");
        //} else {
        //  if (!$j.tools.isNull(obj._thumbs.last())) $j.CSS.removeClass(this._thumbs.last(),"hidden");
        //  if (!$j.tools.isNull(this._range)) $j.CSS.removeClass(this._range,"hidden");
        //}
      }
    },
    setToolTipsPosition:function(newValue) {
      if (!($j.tools.valueInSet(newValue,$j.types.anchors))) return;
      if (this.mode!==newValue) {
        this.toolTipsPosition=newValue;
      }
    },
    setDecimalPrecision:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.decimalPrecision!==newValue) {
        this.decimalPrecision=newValue;
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      var thumb;
      if (!$j.tools.isNull(this._DOMObj)) {
        this._inherited();
        this._thumbs[1]=this._DOMObj.lastElementChild;
        this._thumbs[1].jsObj=this;
        this._range=this._DOMObj.firstElementChild;
        this._range.jsObj=this;
        thumb=this._thumbs[1].previousSibling;
        while (thumb.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          thumb=thumb.previousSibling;
        }
        this._thumbs[0]=thumb;
        thumb.jsObj=this;
        $j.tools.events.bind(thumb,$j.types.mouseEvents.DOWN,this.downThumb);
        $j.tools.events.bind(thumb,$j.types.mouseEvents.MOVE,this.moveThumb);
        $j.tools.events.bind(thumb,$j.types.mouseEvents.UP,this.upThumb);
        thumb=this._thumbs.last();
        $j.tools.events.bind(thumb,$j.types.mouseEvents.DOWN,this.downThumb);
        $j.tools.events.bind(thumb,$j.types.mouseEvents.MOVE,this.moveThumb);
        $j.tools.events.bind(thumb,$j.types.mouseEvents.UP,this.upThumb);
      }
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-values"):this._DOMObj.dataset.values;
      if (!$j.tools.isNull(data)) this.values=JSON.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-min"):this._DOMObj.dataset.min;
      if (!$j.tools.isNull(data)) this.min=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-max"):this._DOMObj.dataset.max;
      if (!$j.tools.isNull(data)) this.max=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-orientation"):this._DOMObj.dataset.orientation;
      if (!$j.tools.isNull(data)) this.orientation=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-mode"):this._DOMObj.dataset.mode;
      if (!$j.tools.isNull(data)) this.mode=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-frequency"):this._DOMObj.dataset.frequency;
      if (!$j.tools.isNull(data)) this.frequency=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-showvalues"):this._DOMObj.dataset.showvalues;
      if (!$j.tools.isNull(data)) this.showValues=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-tooltipsposition"):this._DOMObj.dataset.tooltipsposition;
      if (!$j.tools.isNull(data)) this.toolTipsPosition=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-decimalprecision"):this._DOMObj.dataset.decimalprecision;
      if (!$j.tools.isNull(data)) this.decimalPrecision=~~data;
      this.bindEventFromDOM("onChange");
    },
    update:function() {
      if (this._loading||this.form._loading) return;
      if ($j.browser.ie) {
        this._DOMObj.setAttribute("data-values",this.values);
        this._DOMObj.setAttribute("data-mode",this.mode);
        this._DOMObj.setAttribute("data-min",this.min);
        this._DOMObj.setAttribute("data-max",this.max);
        this._DOMObj.setAttribute("data-orientation",this.orientation);
        this._DOMObj.setAttribute("data-frequency",this.frequency);
      } else {
        this._DOMObj.dataset.mode=this.mode;
        this._DOMObj.dataset.min=this.min;
        this._DOMObj.dataset.max=this.max;
        this._DOMObj.dataset.orientation=this.orientation;
        this._DOMObj.dataset.frequency=this.frequency;
      }
    },
    downThumb:function(event) {
      var obj=this.jsObj;
      if (!obj.isEnabled()) return;
      $j.mouse.getMouseInfos(event);
      if ($j.tools.Debugger.debug) console.log(_conv.point2Str($j.mouse.document));
      obj._curThumb=this;
      obj._thumbs.first().style[$j.types.jsCSSProperties.ZINDEX]=0;
      if (this.mode===$j.types.sliderModes.RANGE) obj._thumbs.last().style[$j.types.jsCSSProperties.ZINDEX]=0;
      this.style[$j.types.jsCSSProperties.ZINDEX]=5;
      $j.mouse.stopEvent(event);
      obj.form._capturedControl=obj;
      if (obj._closePopups) obj.form.destroyPopups();
      obj.enterFocus();
      obj.valuesFromThumb();
      if (obj.showValues) obj.moveToolTips();
    },
    moveThumb:function(event) {
      var obj=this.jsObj,point,w=this.offsetWidth,h=this.offsetHeight,tft,tlt,lft,llt;
      if (!obj.isEnabled()) return;
      if (obj.form._capturedControl!==obj) return;
      if (obj._curThumb!==this) return;
      $j.mouse.getMouseInfos(event);
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        point=obj.documentToClient();
        if (obj.orientation===$j.types.orientations.HORIZONTAL) {
          newValue=~~(point.x-(w/2));
          if (obj.frequency>0) newValue=$j.round(newValue/obj.frequency)*obj.frequency;
          if (newValue<0) newValue=0;
          if (obj.mode===$j.types.sliderModes.RANGE) {
            if (obj._curThumb===obj._thumbs.first()) {
              llt=obj._thumbs.last().offsetLeft;
              if (newValue>=llt) newValue=llt;
            } else {
              lft=obj._thumbs.first().offsetLeft;
              if (newValue<=lft) newValue=lft;
            }
          }
          if (newValue>obj.width-w) newValue=obj.width-w;
          this.style[$j.types.jsCSSProperties.LEFT]=newValue+$j.types.CSSUnits.PX;
        } else {
          newValue=~~(point.y-(h/2));
          if (obj.frequency>0) newValue=$j.round(newValue/obj.frequency)*obj.frequency;
          if (newValue<0) newValue=0;
          if (obj.mode===$j.types.sliderModes.RANGE) {
            if (obj._curThumb===obj._thumbs.first()) {
              tlt=obj._thumbs.last().offsetTop;
              if (newValue>=obj._thumbs.last().offsetTop) newValue=tlt 
            } else {
              tft=obj._thumbs.first().offsetTop;
              if (newValue<=obj._thumbs.first().offsetTop) newValue=tft;
            }
          }
          if (newValue>obj.height-h) newValue=obj.height-h;
          this.style[$j.types.jsCSSProperties.TOP]=newValue+$j.types.CSSUnits.PX;
        }
      }
      if (obj.mode===$j.types.sliderModes.RANGE) obj.updateRange();
      obj.valuesFromThumb();
      if (obj.showValues) obj.moveToolTips();
      $j.mouse.stopEvent(event);
    },
    upThumb:function(event) {
      var obj=this.jsObj;
      if (!obj.isEnabled()) return;
      $j.mouse.getMouseInfos(event);
      $j.mouse.stopEvent(event);
      obj.mouseUp();
      obj._curThumb=null;
    },
    mouseEnter:function() {
      this._inherited();
      if (this.showValues) this.createToolTips();
    },
    mouseLeave:function() {
      this._inherited();
      if (this.showValues&&this.form._capturedControl!==this) this.destroyToolTips();
    },
    mouseDown:function(){
      if (!this.isEnabled()) return;
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        point=this.documentToClient();
        if (this.orientation===$j.types.orientations.HORIZONTAL) {
          if (this.mode===$j.types.sliderModes.NORMAL) {
            this._thumbs.first().style[$j.types.jsCSSProperties.LEFT]=(point.x-~~(this._thumbs.first().offsetWidth/2))+$j.types.CSSUnits.PX;
            this.downThumb.apply(this._thumbs.first(),[$j.mouse.event]);
          } else {

          }
        } else {
          if (this.mode===$j.types.sliderModes.NORMAL) {
            this._thumbs.first().style[$j.types.jsCSSProperties.TOP]=(point.y-~~(this._thumbs.first().offsetHeight/2))+$j.types.CSSUnits.PX;
            this.downThumb.apply(this._thumbs.first(),[$j.mouse.event]);
          } else {

          }
        }
      }
    },
    mouseMove:function(){
      if (!this.isEnabled()) return;
      this._inherited();
      if (!$j.tools.isNull(this._curThumb)) this.moveThumb.apply(this._curThumb,[$j.mouse.event]);
      else this._inherited();
    },
    mouseUp:function(){
      if (!this.isEnabled()) return;
      this._inherited();
      this._curThumb=null;
      if (this.showValues&&!this._isMouseOver) this.destroyToolTips();
    },
    mouseWheel:function(){
      var multiplier,wheelDelta=$j.mouse.wheelDelta;
      multiplier=wheelDelta*(((this.max-this.min)*3)/100);
      this.scrollBy(-multiplier);
      this._inherited();
    },
    updateRange:function() {
      var l1,l2;
      if (this.orientation===$j.types.orientations.HORIZONTAL) {
        l1=this._thumbs.first().offsetLeft;
        l2=this._thumbs.last().offsetLeft;
        this._range.style[$j.types.jsCSSProperties.LEFT]=(this._thumbs.first().offsetLeft+~~(this._thumbs.first().offsetWidth/2))+$j.types.CSSUnits.PX;
        this._range.style[$j.types.jsCSSProperties.WIDTH]=(l2-l1)+$j.types.CSSUnits.PX;
      } else {
        l1=this._thumbs.first().offsetTop;
        l2=this._thumbs.last().offsetTop;
        this._range.style[$j.types.jsCSSProperties.TOP]=(this._thumbs.first().offsetTop+~~(this._thumbs.first().offsetHeight/2))+$j.types.CSSUnits.PX;
        this._range.style[$j.types.jsCSSProperties.HEIGHT]=(l2-l1)+$j.types.CSSUnits.PX;
      }
    },
    valuesFromThumb:function() {
      var newValue=0;
      if (this.mode===$j.types.sliderModes.NORMAL) {
        if (this.orientation===$j.types.orientations.HORIZONTAL) newValue=this.min+((this._thumbs.first().offsetLeft/(this.width-this._thumbs.first().offsetWidth))*(this.max-this.min));
        else newValue=this.min+((this._thumbs.first().offsetTop/(this.height-this._thumbs.first().offsetHeight))*(this.max-this.min));
        this.values[0]=newValue;
      } else {
        if (this.orientation===$j.types.orientations.HORIZONTAL) {
          this.values[0]=this.min+((this._thumbs.first().offsetLeft/(this.width-this._thumbs.first().offsetWidth))*(this.max-this.min));
          this.values[1]=this.min+((this._thumbs.last().offsetLeft/(this.width-this._thumbs.last().offsetWidth))*(this.max-this.min));
        } else {
          this.values[0]=this.min+((this._thumbs.first().offsetTop/(this.height-this._thumbs.first().offsetHeight))*(this.max-this.min));
          this.values[1]=this.min+((this._thumbs.last().offsetTop/(this.height-this._thumbs.last().offsetHeight))*(this.max-this.min));
        }
      }
      this.checkValues();
      this.values[0]=parseFloat(this.values.first().toFixed(this.decimalPrecision));
      this.values[1]=parseFloat(this.values.last().toFixed(this.decimalPrecision));
      if (!this._updating) this.onChange.invoke();
    },
    thumbFromValues:function() {
      this.checkValues();
      if (this.mode===$j.types.sliderModes.NORMAL) {
        if (this.orientation===$j.types.orientations.HORIZONTAL) this._thumbs.first().style[$j.types.jsCSSProperties.LEFT]=~~((this.values.first()/(this.max-this.min))*(this.width-this.height))+$j.types.CSSUnits.PX;
        else this._thumbs.first().style[$j.types.jsCSSProperties.TOP]=~~((this.values.first()/(this.max-this.min))*(this.height-this.width))+$j.types.CSSUnits.PX;
      } else {
        if (this.orientation===$j.types.orientations.HORIZONTAL) {
          this._thumbs.first().style[$j.types.jsCSSProperties.LEFT]=~~((this.values.first()/(this.max-this.min))*(this.width-this.height))+$j.types.CSSUnits.PX;
          this._thumbs.last().style[$j.types.jsCSSProperties.LEFT]=~~((this.values.last()/(this.max-this.min))*(this.width-this.height))+$j.types.CSSUnits.PX;
        } else {
          this._thumbs.first().style[$j.types.jsCSSProperties.TOP]=~~((this.values.first()/(this.max-this.min))*(this.height-this.width))+$j.types.CSSUnits.PX;
          this._thumbs.last().style[$j.types.jsCSSProperties.TOP]=~~((this.values.last()/(this.max-this.min))*(this.height-this.width))+$j.types.CSSUnits.PX;
        }
      }
      if (!this._updating) this.onChange.invoke();
    },
    scrollBy:function(offset) {
      if (this.mode===$j.types.sliderModes.NORMAL) this.setValues([this.values.first()+offset,this.values.last()]);
      this.moveToolTips();
    },
    moveToolTips:function() {
      if (!this.showValues) return;
      if (!$j.tools.isNull(this._toolTips.first())) {
        this._toolTips.first().innerHTML=parseFloat(this.values.first().toFixed(this.decimalPrecision));
        if (this.orientation===$j.types.orientations.HORIZONTAL) {
          this._toolTips.first().style[$j.types.jsCSSProperties.LEFT]=(this._thumbs.first().offsetLeft+~~(this._thumbs.first().offsetWidth/2)-~~(this._toolTips.first().offsetWidth/2))+$j.types.CSSUnits.PX;
        } else {
          this._toolTips.first().style[$j.types.jsCSSProperties.TOP]=(this._thumbs.first().offsetTop+~~(this._thumbs.first().offsetHeight/2)-~~(this._toolTips.first().offsetHeight/2)-1)+$j.types.CSSUnits.PX;
          if (this.toolTipsPosition===$j.types.anchors.LEFT) {
            this._toolTips.first().style[$j.types.jsCSSProperties.LEFT]=(this._thumbs.first().offsetLeft-this._toolTips.first().offsetWidth-7)+$j.types.CSSUnits.PX;
          }
        }
      }
      if (this.mode===$j.types.sliderModes.RANGE) {
        if (!$j.tools.isNull(this._toolTips.last())) {
          this._toolTips.last().innerHTML=parseFloat(this.values.last().toFixed(this.decimalPrecision));
          if (this.orientation===$j.types.orientations.HORIZONTAL) {
            this._toolTips.last().style[$j.types.jsCSSProperties.LEFT]=(this._thumbs.last().offsetLeft+~~(this._thumbs.last().offsetWidth/2)-~~(this._toolTips.last().offsetWidth/2))+$j.types.CSSUnits.PX;
          } else {
            this._toolTips.last().style[$j.types.jsCSSProperties.TOP]=(this._thumbs.last().offsetTop+~~(this._thumbs.last().offsetHeight/2)-~~(this._toolTips.last().offsetHeight/2)-1)+$j.types.CSSUnits.PX;
            if (this.toolTipsPosition===$j.types.anchors.LEFT) {
              this._toolTips.last().style[$j.types.jsCSSProperties.LEFT]=(this._thumbs.last().offsetLeft-this._toolTips.last().offsetWidth-7)+$j.types.CSSUnits.PX;
            }
          }
        }
      }
    },
    createToolTips:function() {
      this.destroyToolTips();
      var tooltip="<div class='SliderToolTip' data-theme='{theme}' style='left: {left}px;' data-position='{position}'>{value}</div>",a,d=$j.doc.createElement($j.types.HTMLElements.DIV);
      a=tooltip.split("{position}");
      a.insert(a.length-1,this.toolTipsPosition);
      tooltip=a.join(String.empty);
      a=tooltip.split("{theme}");
      a.insert(a.length-1,this.form.getThemeName());
      tooltip=a.join(String.empty);
      a=tooltip.split("{value}");
      a.insert(a.length-1,this.values.first());
      tooltip=a.join(String.empty);
      d.innerHTML=tooltip;
      this._DOMObj.appendChild(d.firstElementChild);
      this._toolTips[0]=this._DOMObj.lastElementChild;
      if (this.mode===$j.types.sliderModes.RANGE) {
        tooltip="<div class='SliderToolTip' data-theme='{theme}' style='left: {left}px;' data-position='{position}'>{value}</div>";
        a=tooltip.split("{position}");
        a.insert(a.length-1,this.toolTipsPosition);
        tooltip=a.join(String.empty);
        a=tooltip.split("{theme}");
        a.insert(a.length-1,this.form.getThemeName());
        tooltip=a.join(String.empty);
        a=tooltip.split("{value}");
        a.insert(a.length-1,this.values.last());
        tooltip=a.join(String.empty);
        d.innerHTML=tooltip;
        this._DOMObj.appendChild(d.firstElementChild);
        this._toolTips[1]=this._DOMObj.lastElementChild;
      }
      this.moveToolTips();
    },
    destroyToolTips:function() {
      if (!$j.tools.isNull(this._toolTips.first())) {
        this._DOMObj.removeChild(this._toolTips.first());
        this._toolTips[0]=null;
      }
      if (this.mode===$j.types.sliderModes.RANGE) {
        if (!$j.tools.isNull(this._toolTips.last())) {
          this._DOMObj.removeChild(this._toolTips.last());
          this._toolTips[1]=null;
        }
      }
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{orientation}");
      html=a.join(this.orientation);
      return html;
    },
    loaded:function() {
      this._inherited();
      this.thumbFromValues();
    },
    checkValues:function() {
      if (this.values.first()<this.min) this.values[0]=this.min;
      if (this.values.last()<this.min) this.values[1]=this.min;
      if (this.values.first()>this.max) this.values[0]=this.max;
      if (this.values.last()>this.max) this.values[1]=this.max;
    }             
    //#endregion
  });
  //#endregion
  //#region ColorSlider
  var ColorSlider=Slider.extend({
    _ClassName:"ColorSlider",
    init: function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.max=1;
        this.values=[1,0];
        this.decimalPrecision=1;
        this.frequency=0;
      }
    },
    //#region Setters
    setMode:function(newValue) {
      if (!($j.tools.valueInSet(newValue,$j.types.sliderModes))) return;
      this.mode=$j.types.sliderModes.NORMAL;
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      var thumb;
      if (!$j.tools.isNull(this._DOMObj)) {
        this._thumbs[0]=this._DOMObj.lastElementChild;
        thumb=this._thumbs.first();
        thumb.jsObj=this;
        $j.tools.events.bind(thumb,$j.types.mouseEvents.DOWN,this.downThumb);
        $j.tools.events.bind(thumb,$j.types.mouseEvents.MOVE,this.moveThumb);
        $j.tools.events.bind(thumb,$j.types.mouseEvents.UP,this.upThumb);
      }
    }
    //#endregion
  });
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,ColorSlider);
  $j.classes.register($j.types.categories.COMMON,Slider);
  //#region Templates
  var SliderTpl=["<div id='{internalId}' data-name='{name}' data-class='Slider' class='Slider' data-theme='{theme}' style='{style}' data-values='[0,0]' data-mode='normal' data-orientation='{orientation}'>",
                 "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                 "<div class='Slider_thumb' data-theme='{theme}'></div>",
                 "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                 "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:Slider,template:SliderTpl}]);
  //endregion
})();