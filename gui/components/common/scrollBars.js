(function(){
  //#region ScrollBar
  var ScrollBar=$j.classes.ThemedControl.extend({
    _ClassName:"ScrollBar",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._thumb=null;
        this._wheelDeltaReplacement=0;
        this._inner=null;
        this._trackZone=null;
        this._inThumb=false;
        this._timer=new $j.classes.Timer(this);
        this._timer.interval=100;
        this._timer.onTimer.addListener(this.onTimer);
        this._timer.docPt=new $j.classes.Point;
        this._timer.targetPt=new $j.classes.Point;
        this._timer.dir=String.empty;
        this._firstBtn=null;
        this._lastBtn=null;
        this._repeatTimer=new $j.classes.Timer(this);
        this._repeatTimer.interval=100;
        this._repeatTimer.onTimer.addListener(this.onTimer);
        this._downPt=new $j.classes.Point;
        this._downValue=0;
        //#endregion
        this.width=100;
        this.height=15;
        this.min=0;
        this.max=100;
        this.tracking=true;
        this.frequency=0;
        this.value=0;
        this.viewportSize=0;
        this.onChange=new $j.classes.NotifyEvent(this);
        this.onTracking=new $j.classes.NotifyEvent(this);
        this.setHitTest(true);
        this.autoCapture=true;
        this.canFocused=false;
        this.orientation=$j.types.orientations.HORIZONTAL;
        this.smallChange=1;
      }
    },
    //#region Setters
    setMin:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.min!==newValue) {
        this.min=newValue;
        this.updateThumb();
      }
    },
    setMax:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.max!==newValue) {
        this.max=newValue;
        if (this.max<this.min) this.max=this.min+0.001;
        if (this.value>this.max-this.viewportSize) this.value=this.max-this.viewportSize;
        if (this.viewportSize>(this.max-this.min)) this.viewportSize=this.max-this.min;
        this.updateThumb();
      }
    },
    setTracking:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.tracking!==newValue) {
        this.tracking=newValue;
      }
    },
    setFrequency:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.frequency!==newValue) {
        this.frequency=newValue;
        if (this.frequency!==0) this.setValue($j.round(this.value/this.frequency)*this.frequency);
      }
    },
    setValue:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.frequency!==0) newValue=$j.round(newValue/this.frequency)*this.frequency;
      if (this.value!==newValue) {
        this.value=newValue;
        if (this.value>this.max-this.viewportSize) this.value=this.max-this.viewportSize;
        if (this.value<this.min) this.value=this.min;
        if (this.tracking) this.onTracking.invoke();
        if (!this._updating) this.onChange.invoke();
        this.updateThumb();
        this.propertyChanged("value");
      }
    },
    setViewportSize:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.viewportSize!==newValue) {
        this.viewportSize=newValue;
        if (this.viewportSize>(this.max-this.min)) this.viewportSize=this.max-this.min;
        if (this.value>this.max-this.viewportSize) this.value=this.max-this.viewportSize;
        this.updateThumb();
      }
    },
    setOrientation:function(newValue) {
      if (!($j.tools.valueInSet(newValue,$j.types.orientations))) return;
      if (this.orientation!==newValue) {
        this.orientation=newValue;
        this.updateThumb();
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._inner=this._DOMObj.firstElementChild;
        this._inner.jsObj=this;
        this._thumb=this._inner.firstElementChild;
        this._thumb.jsObj=this;
        $j.tools.events.bind(this._thumb,$j.types.mouseEvents.DOWN,this.downThumb);
        $j.tools.events.bind(this._thumb,$j.types.mouseEvents.MOVE,this.moveThumb);
        $j.tools.events.bind(this._thumb,$j.types.mouseEvents.UP,this.upThumb);
        $j.tools.events.bind(this._thumb,$j.types.mouseEvents.ENTER,this.enterThumb);
        this._trackZone=this._inner;
        this._lastBtn=this._DOMObj.lastElementChild;
        this._lastBtn.jsObj=this;
        this._firstBtn=this._lastBtn.previousSibling;
        while (this._firstBtn.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._firstBtn=this._firstBtn.previousSibling;
        }
        this._firstBtn.jsObj=this;
        $j.tools.events.bind(this._firstBtn,$j.types.mouseEvents.DOWN,this.starTimer);
        $j.tools.events.bind(this._firstBtn,$j.types.mouseEvents.UP,this.resetTimer);
        $j.tools.events.bind(this._lastBtn,$j.types.mouseEvents.DOWN,this.starTimer);
        $j.tools.events.bind(this._lastBtn,$j.types.mouseEvents.UP,this.resetTimer);
      }
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-value"):this._DOMObj.dataset.value;
      if (!$j.tools.isNull(data)) this.value=parseFloat(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-frequency"):this._DOMObj.dataset.frequency;
      if (!$j.tools.isNull(data)) this.frequency=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-viewportsize"):this._DOMObj.dataset.viewportsize;
      if (!$j.tools.isNull(data)) this.viewportSize=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-min"):this._DOMObj.dataset.min;
      if (!$j.tools.isNull(data)) this.min=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-max"):this._DOMObj.dataset.max;
      if (!$j.tools.isNull(data)) this.max=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-orientation"):this._DOMObj.dataset.orientation;
      if (!$j.tools.isNull(data)) this.orientation=data;
      this.updateThumb();
    },
    enterThumb:function(event) {
      var obj=this.jsObj,w,h;
      if (!obj.isEnabled()) return;
      obj._inThumb=true;
      $j.mouse.stopEvent(event);
    },
    downThumb:function(event) {
      var obj=this.jsObj,point;
      if (!obj.isEnabled()) return;
      $j.mouse.getMouseInfos(event);
      if ($j.tools.Debugger.debug) console.log(_conv.point2Str($j.mouse.document));
      obj._downPt.assign($j.mouse.document);
      obj._downValue=obj.value;
      $j.mouse.stopEvent(event);
      obj.form._capturedControl=obj;
      if (obj._closePopups) obj.form.destroyPopups();
      obj.enterFocus();
    },
    moveThumb:function(event) {
      var obj=this.jsObj,w,h,delta,pos;
      if (!obj.isEnabled()) return;
      if (obj.form._capturedControl!==obj) return;
      $j.mouse.getMouseInfos(event);
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        w=obj._trackZone.offsetWidth;
        h=obj._trackZone.offsetHeight;
        if (obj.orientation===$j.types.orientations.HORIZONTAL){
          delta=$j.mouse.document.x-obj._downPt.x;
          pos=obj._downValue+delta*((obj.max-obj.min)/w);
          if (pos<0) pos=0;
          if (pos>(obj.max-obj.min)-obj.viewportSize) pos=(obj.max-obj.min)-obj.viewportSize;
          if (pos===obj.value) return;
          obj.value=pos;
        } else {
          delta=$j.mouse.document.y-obj._downPt.y;
          pos=obj._downValue+delta*((obj.max-obj.min)/h);
          if (pos<0) pos=0;
          if (pos>(obj.max-obj.min)-obj.viewportSize) pos=(obj.max-obj.min)-obj.viewportSize;
          if (pos===obj.value) return;
          obj.value=pos;
        }
        obj.updateThumb();
      }
      $j.mouse.stopEvent(event);
      if (!obj._updating) obj.onChange.invoke();
    },
    upThumb:function(event) {
      var obj=this.jsObj;
      if (!obj.isEnabled()) return;
      $j.mouse.getMouseInfos(event);
      $j.mouse.stopEvent(event);
      obj.mouseUp();
      obj._inThumb=false;
      obj._timer.stopTimer();
    },
    mouseDown:function(){
      var w=this._trackZone.offsetWidth,h=this._trackZone.offsetHeight,point,value=this.value,l=this._trackZone.offsetLeft,t=this._trackZone.offsetTop;
      if (!this.isEnabled()) return;
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        if ($j.tools.Debugger.debug) console.log("CustomTrack.mouseDown");
        point=this.documentToClient();
        if (this.orientation===$j.types.orientations.HORIZONTAL) {
          if ($j.mouse.target.x<l||$j.mouse.target.x>l+w) return;
          point.x-=l;
          if (this.viewportSize===0) this.setValue(this.min+((point.x/w)*(this.max-this.min)));
          else {
            if (this.min+((point.x/w)*(this.max-this.min))>this.value) this.setValue(this.value+this.viewportSize);
            else this.setValue(this.value-this.viewportSize);
          }
        } else {
          if ($j.mouse.target.y<t||$j.mouse.target.y>t+h) return;
          point.y-=t;
          if (this.viewportSize===0) this.setValue(this.min+((point.y/h)*(this.max-this.min)));
          else {
            if (this.min+((point.y/h)*(this.max-this.min))>this.value) this.setValue(this.value+this.viewportSize);
            else this.setValue(this.value-this.viewportSize);
          }
        }
        if (this.orientation===$j.types.orientations.HORIZONTAL) this._timer.dir=(value<this.value)?"d":"g";
        else this._timer.dir=(value<this.value)?"b":"h";
        this._timer.docPt.assign($j.mouse.document);
        this._timer.targetPt.assign($j.mouse.target);
        this._timer.setEnabled(true);
        this._owner.enterFocus();
      }
    },
    _onTimer:function() {
      var obj=this._owner,o,stop=true;
      $j.mouse.button=$j.types.mouseButtons.LEFT
      $j.mouse.document.assign(obj._timer.docPt);
      $j.mouse.target.assign(obj._timer.targetPt);
      if (this.dir!==String.empty) {
        o=obj.clientToDocument();
        if (obj.orientation===$j.types.orientations.HORIZONTAL) {
          o.x+=obj._thumb.offsetLeft+obj._inner.offsetLeft;
          if (o.x+obj.viewportSize<=$j.mouse.document.x&&this.dir==="d") stop=false;
          else if (o.x>$j.mouse.document.x&&this.dir==="g") stop=false;
        } else {
          o.x+=obj._thumb.offsetLeft+obj._inner.offsetLeft;
          if (o.y+obj.viewportSize<=$j.mouse.document.y&&this.dir==="b") stop=false;
          else if (o.y>$j.mouse.document.y&&this.dir==="h") stop=false;
        }
        if (!stop) obj.mouseDown();
        else {
          this.dir=String.empty;
          this.stopTimer();
        }
      }
    },
    mouseMove:function(){
      if (this._inThumb) this.moveThumb.apply(this._thumb,[$j.mouse.event]);
      else this._inherited();
    },
    mouseUp:function(){
      if (!this.isEnabled()) return;
      this._inherited();
      this._inThumb=false;
      this._timer.stopTimer();
    },
    updateThumb:function() {
      if ($j.tools.isNull(this._thumb)) return;
      var result,w,h,
          //br=$j.CSS.getStyleValue(this._thumb,"border-right-width",_const.INTEGER),
          //bl=$j.CSS.getStyleValue(this._thumb,"border-left-width",_const.INTEGER),
          //bt=$j.CSS.getStyleValue(this._thumb,"border-top-width",_const.INTEGER),
          //bb=$j.CSS.getStyleValue(this._thumb,"border-bottom-width",_const.INTEGER),
          radius,rw,rh;
      w=this.width;
      h=this.height;
      if (this._trackZone!==this._DOMObj) {
        w=this._trackZone.offsetWidth/*-bl-br*/;
        h=this._trackZone.offsetHeight/*-bt-bb*/;
      }
      if(this.height<this.width) radius=$j.ceil(this.height*0.5);
      else radius=$j.ceil(this.width*0.5);
      if ((this.max-this.min)>0) {
        if (this.orientation===$j.types.orientations.HORIZONTAL) {
          result=new $j.classes.Rect(0,0,(this.viewportSize/(this.max-this.min))*w,0);
          if (result.right-result.left<h) {
            result.right=result.left+$j.trunc(h/2);
            result.left=result.left-$j.trunc(h/2);
          }
          result.offset($j.round((((this.value-this.min)/(this.max-this.min)))*w),0);
          if (result.right>w) result.offset(w-result.right,0);
          if (result.left<0) result.offset(-result.left,0);
          this._thumb.style[$j.types.jsCSSProperties.LEFT]=result.left+$j.types.CSSUnits.PX;
          this._thumb.style[$j.types.jsCSSProperties.WIDTH]=~~result.width()+$j.types.CSSUnits.PX;
        } else {
          result=new $j.classes.Rect(0,0,0,(this.viewportSize/(this.max-this.min))*h);
          if (result.bottom-result.top<w) {
            result.bottom=result.top+$j.trunc(w/2);
            result.top=result.top-$j.trunc(w/2);
          }
          result.offset(0,$j.round((((this.value-this.min)/(this.max-this.min)))*h));
          if (result.bottom>h) result.offset(0,h-result.bottom);
          if (result.top<0) result.offset(0,-result.top);
          this._thumb.style[$j.types.jsCSSProperties.TOP]=result.top+$j.types.CSSUnits.PX;
          this._thumb.style[$j.types.jsCSSProperties.HEIGHT]=~~result.height()+$j.types.CSSUnits.PX;
        }
        //this._thumb.style[$j.types.jsCSSProperties.BORDERRADIUS]=radius+$j.types.CSSUnits.PX;
      }
    },
    mouseWheel:function(){
      var multiplier,wheelDelta=$j.mouse.wheelDelta;
      if (this._wheelDeltaReplacement!==0) {
        if (wheelDelta>0) wheelDelta=this._wheelDeltaReplacement;
        else wheelDelta=-this._wheelDeltaReplacement;
      }
      multiplier=wheelDelta*(((this.max-this.min)*3)/100);
      if (this._wheelDeltaReplacement!==0) multiplier=this._wheelDeltaReplacement;
      this.scrollBy(-multiplier);
      this._inherited();
    },
    scrollBy:function(offset) {
      this.setValue(this.value+offset);
    },
    starTimer:function(){
      var obj=this.jsObj;
      $j.mouse.getMouseInfos(event);
      $j.mouse.stopEvent(event);
      if (!obj.isEnabled()) return;
      if (this===obj._firstBtn) obj.scrollBy(-obj.smallChange);
      if (this===obj._lastBtn) obj.scrollBy(obj.smallChange);
      if (obj.value>=obj.max-obj.viewportSize) return;
      if (obj.value<=obj.min) return;
      obj._repeatTimer.btn=this;
      obj._repeatTimer.setEnabled(true);
      obj._owner.enterFocus();
    },
    resetTimer:function(){
      var obj=this.jsObj;
      obj._repeatTimer.stopTimer();
    },
    onTimer:function(){
      var obj=this._owner;
      if (this.btn===obj._firstBtn) obj.scrollBy(-obj.smallChange);
      if (this.btn===obj._lastBtn) obj.scrollBy(obj.smallChange);
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{orientation}");
      html=a.join(this.orientation);
      return html;
    }
    //#endregion
  });
  Object.seal(ScrollBar);
  $j.classes.register($j.types.categories.COMMON,ScrollBar);
  //#endregion
  //#region Templates
  var ScrollBarTpl=["<div id='{internalId}' data-name='{name}' data-class='ScrollBar' class='ScrollBar' data-theme='{theme}' style='{style}' data-value='0' data-viewportsize='0' data-orientation='{orientation}'>",
                    "<div class='ScrollBar_inner' data-theme='{theme}'>",
                    "<div class='ScrollBar_thumb' data-theme='{theme}' style='left: 0px; border-radius: 8px; width: 12px;'></div>",
                    "</div>",
                    "<div class='ScrollBarFirstButton' data-theme='{theme}' style='line-height: 16px;'><span></span></div>",
                    "<div class='ScrollBarLastButton' data-theme='{theme}' style='line-height: 16px;'><span></span></div>",
                    "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ScrollBar,template:ScrollBarTpl}]);
  //endregion
})();