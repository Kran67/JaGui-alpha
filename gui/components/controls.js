(function(){
  //#region Control final
  var Control=$j.classes.Component.extend({
    _ClassName: "Control",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      var t=new Date().getTime();
      if (!$j.tools.isNull(owner)){
        //#region Private
        this._allowUpdate=true;
        this._tabList=[];
        this._autoTranslate=false;
        this._isMouseOver=false;
        this._isFocused=false;
        this._isPressed=false;
        this._closePopups=true;
        this._wrapper=String.empty;
        this._forceMouseWheel=false;
        //#endregion
        this.constraints=new $j.classes.SizeConstraints(this);
        this.ownerShowToolTip=false;
        this.autoCapture=false;
        this.padding=new $j.classes.Bounds(null,this);
        this.margin=new $j.classes.Bounds(null,this);
        this.onMouseDown=new $j.classes.NotifyEvent(this);
        this.onMouseMove=new $j.classes.NotifyEvent(this);
        this.onMouseUp=new $j.classes.NotifyEvent(this);
        this.onClick=new $j.classes.NotifyEvent(this);
        this.onDblClick=new $j.classes.NotifyEvent(this);
        this.onMouseLeave=new $j.classes.NotifyEvent(this);
        this.onMouseEnter=new $j.classes.NotifyEvent(this);
        this.onMouseWheel=new $j.classes.NotifyEvent(this);
        this.onMouseWheelStart=new $j.classes.NotifyEvent(this);
        this.onMouseWheelEnd=new $j.classes.NotifyEvent(this);
        this.onBeforePaint=new $j.classes.NotifyEvent(this);
        this.onPaint=new $j.classes.NotifyEvent(this);
        this.onAfterPaint=new $j.classes.NotifyEvent(this);
        this.onEnterFocus=new $j.classes.NotifyEvent(this);
        this.onKillFocus=new $j.classes.NotifyEvent(this);
        this.onKeyDown=new $j.classes.NotifyEvent(this);
        this.onKeyUp=new $j.classes.NotifyEvent(this);
        this.popupMenu=null;
        this.opacity=1;
        this.width=50;
        this.height=50;
        this.visible=(!$j.tools.isNull(props.visible))?props.visible:true;
        this.scale=new $j.classes.Position(new $j.classes.Point(1,1),this);
        this.canFocused=false;
        this.enabled=true;
        this.align=$j.types.aligns.NONE;
        this.rotateCenter=new $j.classes.Point(50,50);
        this.cursor=$j.types.customCursors.DEFAULT;
        this.toolTip=String.empty;
        this.showToolTip=false;
        this.hitTest={ mouseDown:true, mouseMove:false, mouseUp:true, mouseWheel:false, mouseDblClick:false };
        this.rotateAngle=0;
        this.transparent=false;
        //if (owner instanceof $j.classes.Control) this._controlIdx=++owner.form._controlIdx;
        //else this._controlIdx=-1;
        //this.localRect",
        //  function() { return new $j.classes.Rect(this.padding.left,this.padding.top,this.padding.right,this.padding.bottom); },
        //  function() {},
        //  true,true,null,null);
        //this.boundsRect",
        //  function() { return new $j.classes.Rect(0,0,this.width,this.height); },
        //  function() {},
        //  true,true,null,null);
        //this.cssClass",
        //  function() { return this.getThemeAndClassName(); },
        //  function() {},
        //  true,false,null,String.empty);
        //this.hidePopups=false;
        this.cssClass=String.empty;
        this._inherited(owner,props);
      };
      $j.tools.Debugger.log(arguments,this,t);
    },
    //#region Setters methods
    setIsPressed:function setIsPressed(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if (this.hitTest.mouseDown){
        if(this._isPressed!==newValue){
          this._isPressed=newValue;
        }
      }
    },
    setHitTest:function setHitTest(newValue) {
      if (Array.isArray(newValue)) {
        switch (newValue.length) {
          case 1:
            this.hitTest.mouseDown=newValue[0];
            this.hitTest.mouseMove=false;
            this.hitTest.mouseUp=false;
            this.hitTest.mouseWheel=false;
            this.hitTest.mouseDblClick=false;
            break;
          case 2:
            this.hitTest.mouseDown=newValue[0];
            this.hitTest.mouseMove=newValue[1];
            this.hitTest.mouseUp=false;
            this.hitTest.mouseWheel=false;
            this.hitTest.mouseDblClick=false;
            break;
          case 3:
            this.hitTest.mouseDown=newValue[0];
            this.hitTest.mouseMove=newValue[1];
            this.hitTest.mouseUp=newValue[2];
            this.hitTest.mouseWheel=false;
            this.hitTest.mouseDblClick=false;
            break;
          case 4:
            this.hitTest.mouseDown=newValue[0];
            this.hitTest.mouseMove=newValue[1];
            this.hitTest.mouseUp=newValue[2];
            this.hitTest.mouseWheel=newValue[3];
            this.hitTest.mouseDblClick=false;
            break;
          case 5:
            this.hitTest.mouseDown=newValue[0];
            this.hitTest.mouseMove=newValue[1];
            this.hitTest.mouseUp=newValue[2];
            this.hitTest.mouseWheel=newValue[3];
            this.hitTest.mouseDblClick=newValue[4];
            break;
        }
      } else if (typeof newValue===_const.BOOLEAN) this.hitTest.mouseDown=this.hitTest.mouseMove=this.hitTest.mouseUp=this.hitTest.mouseWheel=this.hitTest.mouseDblClick=newValue;
    },
    setIsMouseOver: function Control_setIsMouseOver(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if (this.hitTest.mouseMove){
        if(this._isMouseOver!==newValue){
          this._isMouseOver=newValue;
        }
      }
    },
    setIsFocused: function Control_setIsFocused(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this._isFocused!==newValue) {
        this._isFocused=newValue;
        if (newValue) this.form._focusedControl=this;
        else if (this.form._focusedControl===this) this.form._focusedControl=null;
        if (!$j.tools.isNull(this._DOMObj)) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-focused",this._isFocused);
          else this._DOMObj.dataset.focused=this._isFocused;
        }
      }
    },
    setAnchor: function Control_setAnchor(newValue) {
      if (!Array.isArray(newValue)) return;
      this.anchor.length=0;
      this.anchor.addRange(newValue);
    },
    setOpacity: function Control_setOpacity(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if(newValue>1) newValue=1;
      if(newValue<0) newValue=0;
      if(this.opacity!==newValue){
        this.opacity=newValue;
        this.propertyChanged("opacity");
        //if (!this._loading&&!this.form._loading) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.OPACITY);
        if (!this._loading&&!this.form._loading) this._DOMObj.style[$j.types.jsCSSProperties.OPACITY]=newValue;
      }
    },
    setRight: function Control_setRight(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.right!==newValue){
        this.right=newValue;
        this.propertyChanged("right");
        if (!this._loading&&!this.form._loading) {
          //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.RIGHT);
          //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.WIDTH,String.empty);
          this._DOMObj.style[$j.types.jsCSSProperties.RIGHT]=newValue+$j.types.CSSUnits.PX;
          this._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=String.empty;
        }
      }
    },
    setBottom: function Control_setBottom(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.bottom!==newValue){
        this.bottom=newValue;
        this.propertyChanged("bottom");
        if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) {
        //  $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.BOTTOM);
        //  $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.HEIGHT,String.empty);
          this._DOMObj.style[$j.types.jsCSSProperties.BOTTOM]=newValue+$j.types.CSSUnits.PX;
          this._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=String.empty;
        }
      }
    },
    setTabOrder: function Control_setTabOrder(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.tabOrder!==newValue) this.tabOrder=newValue;
    },
    setWidth: function Control_setWidth(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.width!==newValue){
        if (!this.constraints.empty) {
          if (newValue<this.constraints.minWidth) newValue=this.constraints.minWidth;
          if (newValue>this.constraints.maxWidth) newValue=this.constraints.maxWidth;
        }
        this.width=newValue;
        this.propertyChanged("width");
        if (!this._loading) {
          //this.alignmentNeeded=true;
          //if (this.width===0) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.WIDTH,String.empty);
          //else $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.WIDTH);
          if (this.width===0) this._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=String.empty;
          else this._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=newValue+$j.types.CSSUnits.PX;
          if (this._owner instanceof $j.classes.Control) this._owner.realign();
        }
      }
    },
    setHeight: function Control_setHeight(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.height!==newValue){
        if (!this.constraints.empty) {
          if (newValue<this.constraints.minHeight) newValue=this.constraints.minHeight;
          if (newValue>this.constraints.maxHeight) newValue=this.constraints.maxHeight;
        }
        this.height=newValue;
        this.propertyChanged("height");
        if (!this._loading) {
          //if (this.height===0) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.HEIGHT,String.empty);
          //else $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.HEIGHT);
          if (this.height===0) this._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=String.empty;
          else this._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=newValue+$j.types.CSSUnits.PX;
          if (this._owner instanceof $j.classes.Control) this._owner.realign();
        }
      }
    },
    setVisible: function Control_setVisible(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.visible!==newValue){
        this.visible=newValue;
        //if (this.visible){
        //}          if (!this._loading){
            //if (this.align!==$j.types.aligns.NONE) this.alignmentNeeded=true;
            //if (this.owner&&(this.align!==$j.types.aligns.NONE)) {
            //  this.owner.disableAlign=false;  
            //  this.owner.realign();
            //}
        //  }
        this.propertyChanged("visible");
        //if (!this._loading&&!this.form._loading) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.DISPLAY);
        //if (!this._loading&&!this.form._loading) {
        if (!$j.tools.isNull(this._DOMObj)) {
          if (!this.visible) $j.CSS.addClass(this._DOMObj,"hidden");
          else $j.CSS.removeClass(this._DOMObj,"hidden");
          //if (!this.visible) this._DOMObj.setAttribute("hidden",String.empty);
          //else this._DOMObj.removeAttribute("hidden");
          if ($j.browser.ie) this._DOMObj.setAttribute("data-visible",this.visible);
          else this._DOMObj.dataset.visible=this.visible;
        }
        //this.updateFromDOM();
      }
    },
    setScale: function Control_setScale(newValue) {
      if(!(newValue instanceof $j.classes.Point)) return;
      if(this.scale.equals(newValue)){
        this.scale.assign(newValue);
        if (!this._loading&&!this.form._loading) {
          if (!$j.isDOMRenderer) this.update();
          else this.DOM.style[$j.types.jsCSSProperties.TRANSFORM]="scale("+newValue.x+","+newValue.y+")";
          //else $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.TRANSFORM);
        }
      }
    },
    //setAlignmentNeeded: function(newValue) {
    //  if (typeof newValue!==_const.BOOLEAN) return;
    //  if (this.alignmentNeeded!==newValue) {
    //    this.alignmentNeeded=newValue;
    //    for (var i=0,l=this._components.length;i<l;i++) {
    //      this._components[i].alignmentNeeded=newValue;
    //    }
    //  }
    //},
    setCanFocused: function Control_setCanFocused(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      //if (newValue) $j.tools.include(this,$j.types._controlProps._controlSTYLE,$j.types._controlStyles.CANFOCUSED);
      //else $j.tools.exclude(this,$j.types._controlProps._controlSTYLE,$j.types._controlStyles.CANFOCUSED);
      this.canFocused=newValue;
    },
    setEnabled: function Control_setEnabled(newValue) {
      var comps;
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.enabled!==newValue){
        this.enabled=newValue;
        //if (this.enabled) this._DOMObj.setAttribute("disabled",String.empty);
        //else this._DOMObj.setAttribute("disabled","disabled");
        if ($j.browser.ie) this._DOMObj.setAttribute("data-enabled",this.enabled);
        else this._DOMObj.dataset.enabled=this.enabled;
        comps=this._components.filter(function(e,i,a) {
          return (e instanceof $j.classes.Control);
        });
        if (comps.length>0){
          for(var i=0,l=comps.length;i<l;i++){
            comps[i].setEnabled(newValue);
          }
        }
      }
    },
    setAlign: function Control_setAlign(newValue) {
      if(!($j.tools.valueInSet(newValue,$j.types.aligns))) return;
      if(this.align!==newValue){
        this.align=newValue;
        if (!this._loading&&!this.form._loading) {
          if (this.align!==$j.types.aligns.NONE) {
            //this.alignmentNeeded=true;
            this._owner.realignChilds();
          } else {
            //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.LEFT,this.left);
            //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.TOP,this.top);
            //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.RIGHT,-0xFFFF);
            //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.BOTTOM,-0xFFFF);
            //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.WIDTH,this.width);
            //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.HEIGHT,this.height);
            this._DOMObj.style[$j.types.jsCSSProperties.LEFT]=this.left+$j.types.CSSUnits.PX;
            this._DOMObj.style[$j.types.jsCSSProperties.TOP]=this.top+$j.types.CSSUnits.PX;
            this._DOMObj.style[$j.types.jsCSSProperties.RIGHT]=String.empty;
            this._DOMObj.style[$j.types.jsCSSProperties.BOTTOM]=String.empty;
            this._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=this.width+$j.types.CSSUnits.PX;
            this._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=this.height+$j.types.CSSUnits.PX;
          }
        }
      }
    },
    setRotateCenter: function Control_setRotateCenter(newValue) {
      if(!(newValue instanceof $j.classes.Point)) return;
      if(!this.rotateCenter.equals(newValue)){
        this.rotateCenter.assign(newValue);
        //if (!this._loading&&!this.form._loading) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.TRANSFORMORIGIN);
        if (!this._loading&&!this.form._loading) this._DOMObj.style[$j.types.jsCSSProperties.TRANSFORMORIGIN]=newValue.x+$j.types.CSSUnits.PO+String.SPACE+newValue.y+$j.types.CSSUnits.PO;
      }
    },
    setCursor: function Control_setCursor(newValue) {
      if(!($j.tools.valueInSet(newValue,$j.types.customCursors))) return;
      if(this.cursor!==newValue) {
        $j.CSS.removeClass(this._DOMObj,this.cursor);
        this.cursor=newValue;
        $j.CSS.addClass(this._DOMObj,this.cursor);
      }
    },
    setToolTip: function(newValue) {
      if(typeof newValue!==_const.STRING) return;
      if(this.toolTip!==newValue) {
        this.toolTip=newValue;
        if (!$j.tools.isNull(this._DOMObj)) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-tooltip",this.toolTip);
          else this._DOMObj.dataset.tooltip=this.toolTip;
        }
        //if(this.showToolTip) this._DOMObj.title=this.hint;
        //else this._DOMObj.title=String.empty;
      }
    },
    setShowToolTip: function(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.showToolTip!==newValue) this.showToolTip=newValue;
      //if(this.showtoolTip) this._DOMObj.title=this.hint;
      //else this._DOMObj.title=String.empty;
    },
    // à tester
    setLeft: function Control_setLeft(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.left!==newValue){
        this.left=newValue;
        this.propertyChanged("left");
        //if (!this._loading&&!this.form._loading) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.LEFT);
        if (!this._loading) this._DOMObj.style[$j.types.jsCSSProperties.LEFT]=newValue+$j.types.CSSUnits.PX;
      }
    },
    setTop: function Control_setTop(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.top!==newValue){
        this.top=newValue;
        this.propertyChanged("top");
        //if (!this._loading&&!this.form._loading) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.TOP);
        if (!this._loading) this._DOMObj.style[$j.types.jsCSSProperties.TOP]=newValue+$j.types.CSSUnits.PX;
      }
    },
    setRotateAngle: function Control_setRotateAngle(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(this.rotateAngle!==newValue){
        this.rotateAngle=newValue;
        this.propertyChanged("rotateAngle");
        //if (!this._loading&&!this.form._loading) $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.TRANSFORM);
        if (!this._loading&&!this.form._loading) this._DOMObj.style[$j.types.jsCSSProperties.TRANSFORM]="rotate("+newValue+"deg)";
      }
    },
    setTransparent: function Control_setTransparent(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (newValue!==this.transparent){
        this.transparent=newValue;
        this.propertyChanged("transparent");
        if (!$j.isDOMRenderer) this.update();
      }
    },
    setPopupMenu: function Control_setPopup(newValue) {
      if(!(newValue instanceof $j.classes.PopupMenu)) return;
      if(this.popupMenu!==newValue) this.popupMenu=newValue;
    },
    //setHidePopups:function(newValue) {
    //  if (typeof newValue!==_const.BOOLEAN) return;
    //  if (this.hidePopups!==newValue) {
    //    this.hidePopups=newValue;
    //    for (var i=0,l=this._components.length;i<l;i++) {
    //      if (this._components[i] instanceof $j.classes.Control) {
    //        this._components[i].setHidePopups(newValue);
    //      }
    //    }
    //  }
    //},
    setClosePopups:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this._closePopups!==newValue) {
        this._closePopups=newValue;
        for (var i=0,l=this._components.length;i<l;i++) {
          if (this._components[i] instanceof $j.classes.Control) {
            this._components[i].setClosePopups(newValue);
          }
        }
      }
    },
    setBounds:function(l,t,w,h) {
      var style;
      if (typeof l!==_const.NUMBER) return;
      if (typeof t!==_const.NUMBER) return;
      if (typeof w!==_const.NUMBER) return;
      if (typeof h!==_const.NUMBER) return;
      this.left=l;
      this.top=t;
      this.width=w;
      this.height=h;
      if (!$j.tools.isNull(this._DOMObj)) {
        style=this._DOMObj.style;
        style[$j.types.jsCSSProperties.LEFT]=l+$j.types.CSSUnits.PX;
        style[$j.types.jsCSSProperties.TOP]=t+$j.types.CSSUnits.PX;
        style[$j.types.jsCSSProperties.WIDTH]=w+$j.types.CSSUnits.PX;
        style[$j.types.jsCSSProperties.HEIGHT]=h+$j.types.CSSUnits.PX;
      }
    },
    //#endregion
    //#region Methods
    insertTemplate: function(tpl) {
      if (!this._allowUpdate) this._wrapper+=tpl;
      else if (!$j.tools.isNull(this._DOMObj)) this._DOMObj.innerHTML+=tpl;
    },
    setFocus: function(){
      //var c={};
      if (!this.canFocused) return;
      this.enterFocus();
    },
    //tabOrderList: function Control_tabOrderList(list,c){
    //  //var control;
    //  //if(this._tabList){
    //  //  if (this._tabList.length>0){
    //  //    for(var i=0,l=this._tabList.length;i<l;i++){
    //  //      control=this._tabList[i];
    //  //      l.push(control);
    //  //      if(c) control.TabOrderList(l,c);
    //  //    }
    //  //  }
    //  //}
    //  //control=null;
    //},
    //verifyAnchor: function Control_verifyAnchor(){
    //  this.anchor.length=0;
    //  if (this.left!==-0xFFFF) $j.tools.include(this,$j.types._controlProps.ANCHOR,$j.types.anchors.LEFT);
    //  if (this.top!==-0xFFFF) $j.tools.include(this,$j.types._controlProps.ANCHOR,$j.types.anchors.TOP);
    //  if (this.right!==-0xFFFF) $j.tools.include(this,$j.types._controlProps.ANCHOR,$j.types.anchors.RIGHT);
    //  if (this.bottom!==-0xFFFF) $j.tools.include(this,$j.types._controlProps.ANCHOR,$j.types.anchors.BOTTOM);
    //  if ((this.anchor.length===0)) {
    //    $j.tools.include(this,$j.types._controlProps.ANCHOR,$j.types.anchors.LEFT);
    //    $j.tools.include(this,$j.types._controlProps.ANCHOR,$j.types.anchors.TOP);
    //  }
    //},
    localRect: function(){
      return new $j.classes.Rect(this.padding.left(),this.padding.top(),this.padding.right(),this.padding.bottom());
    },
    //doPosition: function Control_doPosition(r){
    //  var rc,fitScale,mR,cR,cssValue;
    //  switch(this.align){
    //    //case $j.types.aligns.NONE:
    //    //  break;
    //    case $j.types.aligns.MOSTTOP:
    //    case $j.types.aligns.TOP:
    //      this.left=r.left;
    //      this.top=r.top;
    //      this.right=r.right;
    //      r.top+=this.height+this.margin.top+this.margin.bottom;
    //      break;
    //    case $j.types.aligns.MOSTBOTTOM:
    //    case $j.types.aligns.BOTTOM:
    //      this.left=r.left;
    //      this.right=r.right;
    //      this.bottom=r.bottom;
    //      r.bottom+=this.height+this.margin.top+this.margin.bottom;
    //      break;
    //    case $j.types.aligns.MOSTLEFT:
    //    case $j.types.aligns.LEFT:
    //      this.left=r.left;
    //      this.top=r.top;
    //      this.bottom=r.bottom;
    //      r.left+=this.width+this.margin.left+this.margin.right;
    //      break;
    //    case $j.types.aligns.MOSTRIGHT:
    //    case $j.types.aligns.RIGHT:
    //      this.top=r.top;
    //      this.bottom=r.bottom;
    //      this.right=r.right;
    //      r.right+=this.width+this.margin.left+this.margin.right;
    //      break;
    //    case $j.types.aligns.CLIENT:
    //      this.left=r.left;
    //      this.top=r.top;
    //      this.right=r.right;
    //      this.bottom=r.bottom;
    //      break;
    //    case $j.types.aligns.HORIZONTAL:
    //      break;
    //    case $j.types.aligns.VERTICAL:
    //      break;
    //    case $j.types.aligns.CONTENTS:
    //      break;
    //    case $j.types.aligns.CENTER:
    //      this.top=~~((this.owner.height-(this.height+this.margin.top+this.margin.bottom))/2);
    //      this.left=~~((this.owner.width-(this.width+this.margin.left+this.margin.right))/2);
    //      if ($j.isDOMRenderer) {
    //        cssValue=["-",(~~(this.height/2)+this.margin.top),$j.types.CSSUnits.PX,String.SPACE,this.margin.right,$j.types.CSSUnits.PX,
    //              String.SPACE,this.margin.bottom,$j.types.CSSUnits.PX. -",(~~(this.width/2)+this.margin.left),$j.types.CSSUnits.PX.;"].join(String.empty);
    //        //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.MARGIN,cssValue);
    //        $j.CSS.updateInlineCSS2(this._DOMObj,[{CSSProp:$j.types.jsCSSProperties.MARGIN,CSSValue:cssValue}]);
    //      }
    //      break;
    //    case $j.types.aligns.HORZCENTER:
    //      this.top=~~((this.owner.height-(this.height+this.margin.top+this.margin.bottom))/2);
    //      this.bottom=~~((this.owner.height-(this.height+this.margin.top+this.margin.bottom))/2);
    //      if ($j.isDOMRenderer) {
    //        cssValue=[this.margin.top,$j.types.CSSUnits.PX,String.SPACE,this.margin.right,$j.types.CSSUnits.PX,String.SPACE,this.margin.bottom,
    //              $j.types.CSSUnits.PX. -",(~~(this.width/2)+this.margin.left),$j.types.CSSUnits.PX.;"].join(String.empty);
    //        //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.MARGIN,cssValue);
    //        $j.CSS.updateInlineCSS2(this._DOMObj,[{CSSProp:$j.types.jsCSSProperties.MARGIN,CSSValue:cssValue}]);
    //      }
    //      break;
    //    case $j.types.aligns.VERTCENTER:
    //      this.left=~~((this.owner.width-(this.width+this.margin.left+this.margin.right))/2);
    //      this.right=~~((this.owner.width-(this.width+this.margin.left+this.margin.right))/2)
    //      if ($j.isDOMRenderer) {
    //        cssValue=[(~~(this.height/2)+this.margin.top),$j.types.CSSUnits.PX,String.SPACE,this.margin.right,$j.types.CSSUnits.PX,
    //              String.SPACE,this.margin.bottom,$j.types.CSSUnits.PX,String.SPACE,this.margin.left,$j.types.CSSUnits.PX.;"].join(String.empty);
    //        //$j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.MARGIN,cssValue);
    //        $j.CSS.updateInlineCSS2(this._DOMObj,[{CSSProp:$j.types.jsCSSProperties.MARGIN,CSSValue:cssValue}]);
    //      }
    //      break;
    //    case $j.types.aligns.SCALE:
    //      this.width=~~(this.initialWidth*(this.owner.width/this.owner.initialWidth));
    //      this.height=~~(this.initialHeight*(this.owner.width/this.owner.initialWidth));
    //      break;
    //    case $j.types.aligns.FIT:
    //    case $j.types.aligns.FITLEFT:
    //    case $j.types.aligns.FITRIGHT:
    //      mR=new $j.classes.Rect(this.owner.padding.left+this.margin.left,
    //                                this.owner.padding.top+this.margin.top,
    //                                this.owner.width-this.owner.padding.right-this.margin.right,
    //                                this.owner.height-this.owner.padding.bottom-this.margin.bottom);
    //      cR=new $j.classes.Rect(0,
    //                                0,
    //                                this.width,
    //                                this.height);
    //      fitScale=cR.fit(mR);
    //      cR=fitScale.rect;
    //      fitScale=fitScale.ratio;
    //      if(fitScale<1){
    //        cR.left=cR.left/fitScale;
    //        cR.right=cR.right/fitScale;
    //        cR.top=cR.top/fitScale;
    //        cR.bottom=cR.bottom/fitScale;
    //        cR.center(mR);
    //        if(this.align===$j.types.aligns.FITLEFT) cR.offset(mrect.left-cR.left,0);
    //        if(this.align===$j.types.aligns.FITRIGHT) cR.offset(mrect.right-cR.right,0);
    //        this.left=cR.left-this.margin.left;
    //        this.top=cR.top-this.margin.top;
    //        this.width=cR.width;
    //        this.height=cR.height;
    //      } else {
    //        if(this.align===$j.types.aligns.FITLEFT) cR.offset(mrect.left-cR.left,0);
    //        if(this.align===$j.types.aligns.FITRIGHT) cR.offset(mrect.right-cR.right,0);
    //        this.left=cR.left-this.margin.left;
    //        this.top=cR.top-this.margin.top;
    //        this.width=cR.width;
    //        this.height=cR.height;
    //      }
    //      break;
    //    case $j.types.aligns.TOPRIGHT:
    //      this.top=r.top;
    //      this.right=r.right;
    //      break;
    //    case $j.types.aligns.BOTTOMLEFT:
    //      this.bottom=r.bottom;
    //      this.left=r.left;
    //      break;
    //    case $j.types.aligns.BOTTOMRIGHT:
    //      this.right=r.right;
    //      this.bottom=r.bottom;
    //      break;
    //    case $j.types.aligns.TOPLEFT:
    //      break;
    //  }
    //},
    realign: function Control_realign(){
    //  var l=0,t=0,r=0,b=0,childs,i,l1;
    //  if(this._loading&&!$j.tools.Debugger.useFragment) return;
    //  if (this.align===$j.types.aligns.NONE) return;
    //  //if(!this.alignmentNeeded) return;
    //  if(this.disableAlign) return;
    //  this.disableAlign=true;
    //  r=this.localRect;
    //  childs=this._components.filter(
    //    function(e,i,a){
    //      return (e.align!==$j.types.aligns.NONE)&&e.visible;
    //    }
    //  );
    //  childs.sort(function(a,b){
    //    var idxA=$j.types.aligns.indexOf(a.align),
    //        idxB=$j.types.aligns.indexOf(b.align);
    //    return (idxA>idxB)?1:((idxB>idxA)?-1:0);
    //  });
    //  if(childs.length>0){
    //    for(i=0,l1=childs.length;i<l1;i++){
    //      //if (!childs[i].alignmentNeeded) {
    //      //  continue;
    //      //}
    //      childs[i].disableAlign=true;
    //      //childs[i].beginUpdate();
    //      childs[i].doPosition(r);
    //      //childs[i].endUpdate();
    //      childs[i].disableAlign=false;
    //      //childs[i].alignmentNeeded=false;
    //    }
    //  }
    //  this.disableAlign=false;
    },
    beginUpdate: function(){
      this._allowUpdate=false;
      this._wrapper=this._DOMObj.innerHTML;
    },
    endUpdate: function(){
      this._allowUpdate=true;
      //this.update();
      //if (this.owner._allowUpdate&&$j.renderer!==$j.types.renderers.DOM) this.redraw(this.lastRect);
      this._DOMObj.innerHTML=this._wrapper;
      //for (var i=0,l=this.wrapperClass.length;i<l;i++) {
      //  var id=this.wrapperClass[i].id,Class=this.wrapperClass[i].Class;
      //  $j.tools.execFunc($j.classes.createComponent",{Class:Class,owner:this,id:id});
      //}
      this._wrapper=String.empty;
      //this.wrapperClass.clear();
    },
    //execMethod: function Control_execMethod(methodName,params){
    //  //setTimeout(function(){ self[methodName].apply(self,params); },0);
    //  setTimeout(this[methodName].bind(this,params),0);
    //},
    //bringToFront: function Control_bringToFront(){
    //  if (this.owner){
    //    this.owner._components.remove(this);
    //    this.owner._components.add(this);
    //    //var idx=this.owner.form._controlsName.indexOf(this.name);
    //    //if (idx>-1) this.owner.form._controlsName.splice(idx,1);
    //    //this.owner.form._controlsName.push(this.name);
    //  }
    //},
    //sendToBack: function Control_sendToBack(){
    //  if (this.owner){
    //    //var idx=this.owner.form._controlsName.indexOf(this.name);
    //    //if (idx>-1) this.owner.form._controlsName.splice(idx,1);
    //    //this.owner.form._controlsName.splice(0,0,this.name);
    //    this.owner._components.remove(this);
    //    this.owner._components.insert(0,this);
    //  }
    //},
    mouseDown: function(){
      if (!(this instanceof $j.classes.Control)) return;
      if (this.hitTest.mouseDown){
        if(!$j.tools.isNull(this.form)){
          //if (this!==this.form._focusedControl) {
          //  console.log("hidePopups");
            if (this._closePopups) {
              this.form.destroyPopups();
              if (!$j.tools.isNull(this.form.mainMenu)) this.form.mainMenu._isActive=false;
            }
          //}
          if(this.canFocused&&!this._isFocused&&(this.form._focusedControl!==this)) this.setFocus();
        }
        if($j.mouse.button===$j.types.mouseButtons.RIGHT){
          this.contextMenu();
          return;
        }
        if(this.autoCapture) this.capture();
        this.onMouseDown.invoke();
        this.setIsPressed(true);
      }
    },
    mouseUp: function(){
      var target=$j.mouse.event.target;
      if ($j.tools.isNull(target.jsObj)) target=target.parentNode;
      if (!(this instanceof $j.classes.Control)) return;
      if (this!==target.jsObj) return;
      this.releaseCapture();
      if(this._isPressed&&!this.doubleClick/*&&this.pointInObject(p)*/){
        //this.setIsPressed(false);
        this.click();
      }
      this.onMouseUp.invoke();
      this.setIsPressed(false);
      this.doubleClick=false;
    },
    mouseWheel: function Control_mouseWheel(){
      if (!(this instanceof $j.classes.Control)) return;
      //if (this.scrollContainer!==null) this.scrollContainer.mouseWheel.apply(this.scrollContainer,arguments);
      //else {
      //  if (this.wheelTimer===null) {
      //    this.onMouseWheelStart.invoke();
      //  } else clearTimeout(this.wheelTimer);
      //  this.onMouseWheel.invoke(arguments);
      //}
      if (!this.hitTest.mouseWheel) this._owner.mouseWheel();
    },
    //endMouseWheel: function Control_endMouseWheel() {
    //  this.onMouseWheelEnd.invoke();
    //},
    mouseMove: function(){
      if (this instanceof $j.classes.Control) this.onMouseMove.invoke();
    },
    mouseEnter: function(){
      if (!(this instanceof $j.classes.Control)) return;
      /*if (!this._isPressed)*/ this.setIsMouseOver(true);
      //this.applyTriggerEffect(this,'isMouseOver');
      //this.startTriggerAnimation(this,'isMouseOver');
      this.onMouseEnter.invoke();
      if (this.cursor!==$j.types.customCursors.DEFAULT) {
        if ((this.cursor===$j.types.customCursors.WAIT||this.cursor===$j.types.customCursors.PROGRESS)&&!$j.browser.ie) {
          $j.animatedCursor.initAnimation(this._DOMObj,this.cursor);
        }// else $j.CSS.addClass(this._DOMObj,this.cursor);
      }
      this.form.app.showToolTip(this,$j.mouse.document);
    },
    mouseLeave: function(){
      if (!(this instanceof $j.classes.Control)) return;
      this.setIsMouseOver(false);
      //this.applyTriggerEffect(this,'isMouseOver');
      //this.startTriggerAnimation(this,'isMouseOver');
      this.onMouseLeave.invoke();
      if (this.cursor!==$j.types.customCursors.DEFAULT) {
        if ((this.cursor===$j.types.customCursors.WAIT||this.cursor===$j.types.customCursors.PROGRESS)&&!$j.browser.ie) {
          $j.animatedCursor.stopAnimation();
        }// else $j.CSS.removeClass(this._DOMObj,this.cursor);
      }
      this.form.app.destroyToolTip();
    },
    enterFocus: function Control_enterFocus(){
      if (!(this instanceof $j.classes.Control)) return;
      if (!this.canFocused) return;
      if (!$j.tools.isNull(this.form._focusedControl)) {
        this.form._focusedControl.setIsFocused(false);
        this.form._focusedControl=null;
      }
      //if (this.onCanFocused.hasListener()){
      //  c.canFocused=true;
      //  this.onCanFocused.invoke(c);
      //  if(!c.canFocused) return;
      //}
      this.setIsFocused(true);
      //this.applyTriggerEffect(this,'isFocused');
      //this.startTriggerAnimation(this,'isFocused');
      this.onEnterFocus.invoke();
    },
    killFocus: function Control_killFocus(){
      if (!(this instanceof $j.classes.Control)) return;
      if (!this.canFocused) return;
      this.setIsFocused(false);
      //this.applyTriggerEffect(this,'isFocused');
      //this.startTriggerAnimation(this,'isFocused');
      this.onKillFocus.invoke();
    },
    initEvents: function() {
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.OVER,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.OUT,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.CLICK,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.MOVE,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.DOWN,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.UP,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.WHEEL,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.DBLCLICK,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.DOMSCROLL,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.mouseEvents.ENTER,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.keybordEvents.DOWN,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.keybordEvents.UP,this.dispatchEvent);
      $j.tools.events.bind(this._DOMObj,$j.types.keybordEvents.PRESS,this.dispatchEvent);
    },
    dispatchEvent: function(event) {
      var domObj=event.target,jsObj=domObj.jsObj;
      while ($j.tools.isNull(jsObj)) {
        domObj=domObj.parentNode;
        jsObj=domObj.jsObj;
      }
      if ($j.tools.isNull(jsObj)) return;
      if (!jsObj.isEnabled()&&(event.type!==$j.types.mouseEvents.WHEEL)&&(event.type!==$j.types.mouseEvents.DOMSCROLL)&&(event.type!==$j.types.mouseEvents.MOVE)) return;
      //if (!(jsObj instanceof $j.classes.Control)) return;
      /*if (event.type.contains("key"))*/ $j.keyboard.getKeyboardInfos(event);
      /*else*/ $j.mouse.getMouseInfos(event);
      switch (event.type) {
        case $j.types.mouseEvents.MOVE:
          if (!$j.tools.isNull(jsObj.form._capturedControl)) {
            if (!$j.tools.isNull(jsObj.form._capturedControl.mouseMove)) jsObj.form._capturedControl.mouseMove();
          } else if (typeof jsObj.mouseMove===_const.FUNCTION) jsObj.mouseMove();
          break;
        case $j.types.mouseEvents.DOWN:
          //if (jsObj instanceof $j.classes.Control) {
            jsObj.form._capturedControl=jsObj;
            if (typeof jsObj.mouseDown===_const.FUNCTION) jsObj.mouseDown();
          //}
          break;
        case $j.types.mouseEvents.UP:
          if (!$j.tools.isNull(jsObj.form._capturedControl)) {
            if (!$j.tools.isNull(jsObj.form._capturedControl.mouseUp)) jsObj.form._capturedControl.mouseUp();
            jsObj.form._capturedControl=null;
          } else if (typeof jsObj.mouseUp===_const.FUNCTION) jsObj.mouseUp();
          break;
        case $j.types.mouseEvents.WHEEL:
        case $j.types.mouseEvents.DOMSCROLL:
          if (jsObj.form._popups.length>0&&!jsObj._forceMouseWheel) return;
          if (typeof jsObj.mouseWheel===_const.FUNCTION&&jsObj.hitTest.mouseWheel) jsObj.mouseWheel();
          break;
        case $j.types.mouseEvents.DBLCLICK:
          break;
        case $j.types.mouseEvents.OUT:
        case $j.types.mouseEvents.LEAVE:
          if (typeof jsObj.mouseLeave===_const.FUNCTION) jsObj.mouseLeave();
          break;
        case $j.types.mouseEvents.OVER:
        case $j.types.mouseEvents.ENTER:
          if (typeof jsObj.mouseEnter===_const.FUNCTION) jsObj.mouseEnter();
          break;
        //case $j.types.mouseEvents.CLICK:
        //  //jsObj.click();
        //  break;
        case $j.types.mouseEvents.EVENT:
          break;
        case $j.types.keybordEvents.DOWN:
          if (typeof jsObj.keyDown===_const.FUNCTION) jsObj.keyDown();
          break;
        case $j.types.keybordEvents.UP:
          if (typeof jsObj.keyUp===_const.FUNCTION) jsObj.keyUp();
          break;
        case $j.types.keybordEvents.PRESS:
          if (typeof jsObj.keyPress===_const.FUNCTION) jsObj.keyPress();
          break;
      }
      if (!event.type.contains("key")) $j.mouse.stopEvent(event);
      else event.stopPropagation();
    },
    releaseCapture: function(){
      if(this.form){
        if(this.form._capturedControl===this) this.form._capturedControl=null;
      }
    },
    capture: function(){if(this.form) this.form._capturedControl=this;},
    click: function(){
      this.onClick.invoke();
    },
    dblClick: function Control_dblClick(){this.onDblClick.invoke();},
    keyDown: function Control_keyDown(){
      //if($j.keyboard.keyCode===$j.VKeysCode.VK_APP) this.contextMenu();
      //else this.onKeyDown.invoke(new $j.Events.onKeyEventArgs(k,kc,s));
    },
    keyUp: function Control_keyUp(){
      //this.onKeyUp.invoke($j.Events.onKeyEventArgs.create(arguments));
    },
    keyPress: function Control_keyPress(){},
    //dialogKey: function Control_dialogKey(key,shift){
    //  if (this._components.length>0){
    //    for(var i=0,l=this._components.length;i<l;i++){
    //      if(this._components[i].visible&&this._components[i].enabled){
    //        this._components[i].dialogKey();
    //        //if Key=0 then Break;
    //      }
    //    }
    //  }
    //},
    contextMenu: function Control_contextMenu(stayOpen){
      if(!$j.tools.isNull(this.popupMenu)){
        var x=$j.mouse.window.x,y=$j.mouse.window.y;
        //this.popup.staysOpen=false;
        this.popupMenu._control=this;
        this.popupMenu.show(x,y);
      }
    },
    //pointInObject: function Control_pointInObject(point){
    //  //if ($j.renderer===$j.types.renderers.DOM) return;
    //  //var ctx=this.form.buffer.getContext("2d"),r,am=this.AbsoluteMatrix();
    //  //ctx.clear();
    //  //ctx.save();
    //  //r=this.getParentClippingRect();
    //  //ctx.setTransform(am.m11,am.m12,am.m21,am.m22,am.m31,am.m32);
    //  //this.clipContext(ctx);
    //  //ctx.fillStyle=_colors.RED.toARGBString();
    //  //ctx.strokeStyle=ctx.fillStyle;
    //  //if (this instanceof $j.classes.ThemedControl) ctx.drawShape(this,this.getStyle($j.types.styles.NORMAL,$j.types.styleObjects.BACK));
    //  //else if (this instanceof $j.classes.Control) ctx.drawShape(this,this);
    //  //var ret=ctx.isPointInPath(point.x,point.y)&&point.inRect(r);
    //  //if (!ret&&(this.sides===$j.types.sides.NONE)&&(this.shape===$j.types.shapes.RECTANGLE))ret=point.inRect(this.getParentClippingRect());
    //  //ctx.restore();
    //  //return ret;
    //},
    //stopTriggerAnimation: function Control_stopTriggerAnimation(instance){
    //  var childs=[];
    //  if($j.isUndefined(instance)) return;
    //  if(!this.visible) return;
    //  childs.addRange(this._components);
    //  if (childs.length>0){
    //    for(var j=0,l=childs.length;j<l;j++){
    //      if(childs[j] instanceof $j.classes.Animation){
    //        if(childs[j].trigger!==String.empty) childs[j].stop;
    //      }
    //      if(childs[j].visible) childs[j].stopTriggerAnimation(instance);
    //    }
    //  }
    //  childs=null;
    //},
    //startTriggerAnimation: function Control_startTriggerAnimation(instance,trigger){
    //  var childs=[];
    //  if($j.isUndefined(instance)||$j.isUndefined(trigger)) return;
    //  if(!this.visible) return;
    //  this.stopTriggerAnimation();
    //  childs.addRange(this._components);
    //  if(childs){
    //    if (childs.length>0){
    //      for(var j=0,l=childs.length;j<l;j++){
    //        if(childs[j] instanceof $j.classes.Animation) childs[j].startTrigger(instance,trigger);
    //        //if (childs[j].visible) childs[j].startTriggerAnimation(instance,trigger); //� voir
    //      }
    //    }
    //  }
    //  childs=null;
    //},
    //insert: function Control_insert(component){
    //  if(this._components.indexOf(component)>-1) return;
    //  component.form=this.form;
    //  $j.classes.Component.prototype.insert.apply(this,[component]);
    //  //if ((!this.form._loading&&!this.form._creating)||$j.tools.Debugger.useFragment) component.loaded();
    //},
    //resize: function Control_resize() {
    //  var objs=this._components.filter(
    //        function(e,i,a){
    //          return ((e.align===$j.types.aligns.FIT)||(e.align===$j.types.aligns.FITRIGHT)||(e.align===$j.types.aligns.FITLEFT))&&e.visible;
    //        }
    //      );
    //
    //  //this.updateFromDOM();
    //  this.scaleRatio.x=this.width/this.initialWidth;
    //  this.scaleRatio.y=this.height/this.initialHeight;
    //  //for (var i=0,l=objs.length;i<l;i++) {
    //  //  objs[i].alignmentNeeded=true;
    //  //  //objs[i].realign();
    //  //  //objs[i].update();
    //  //}
    //  //objs[0].realign();
    //  //this.alignmentNeeded=true;
    //  this.realign();
    //},
    updateFromDOM: function Control_updateFromDOM() {
      var data;
      this.left=this._DOMObj.offsetLeft;
      this.top=this._DOMObj.offsetTop;
      this.width=this._DOMObj.offsetWidth;
      this.height=this._DOMObj.offsetHeight;
      this.opacity=parseFloat(getComputedStyle(this._DOMObj).opacity);
      this.getCSSBorder();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-visible"):this._DOMObj.dataset.visible;
      if (!$j.tools.isNull(data)) this.visible=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-scale"):this._DOMObj.dataset.scale;
      if (!$j.tools.isNull(data)) {
        var sca=data.split(",");
        this.scale.x=parseFloat(sca[0]);
        this.scale.y=parseFloat(sca[1]);
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-enabled"):this._DOMObj.dataset.enabled;
      if (!$j.tools.isNull(data)) this.enabled=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-rotatecenter"):this._DOMObj.dataset.rotatecenter;
      if (!$j.tools.isNull(data)) {
        var rc=data.split(",");
        this.rotateCenter.x=parseFloat(rc[0]);
        this.rotateCenter.y=parseFloat(rc[1]);
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-tooltip"):this._DOMObj.dataset.tooltip;
      if (!$j.tools.isNull(data)) this.toolTip=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-showtooltip"):this._DOMObj.dataset.showtooltip;
      if (!$j.tools.isNull(data)) this.showToolTip=_conv.strToBool(data);;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-rotateangle"):this._DOMObj.dataset.rotateangle;
      if (!$j.tools.isNull(data)) this.rotateAngle=parseFloat(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-margin"):this._DOMObj.dataset.margin;
      if (!$j.tools.isNull(data)) {
        var marg=data.split(",");
        this.margin.left=parseFloat(marg[0]);
        this.margin.top=parseFloat(marg[1]);
        this.margin.right=parseFloat(marg[2]);
        this.margin.bottom=parseFloat(marg[3]);
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-padding"):this._DOMObj.dataset.padding;
      if (!$j.tools.isNull(data)) {
        var pad=data.split(",");
        this.padding.left=parseFloat(pad[0]);
        this.padding.top=parseFloat(pad[1]);
        this.padding.right=parseFloat(pad[2]);
        this.padding.bottom=parseFloat(pad[3]);
      }
      //data=($j.browser.ie)?this._DOMObj.getAttribute("data-disablealign"):this._DOMObj.dataset.disablealign;
      //if (!$j.tools.isNull(data)) this.disableAlign=_conv.strToBool(data);
      //data=($j.browser.ie)?this._DOMObj.getAttribute("data-clipchilds"):this._DOMObj.dataset.clipchilds;
      //if (!$j.tools.isNull(data)) this.clipChilds=_conv.strToBool(data);
      //data=($j.browser.ie)?this._DOMObj.getAttribute("data-clipparent"):this._DOMObj.dataset.clipparent;
      //if (!$j.tools.isNull(data)) this.clipParent=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-constraints"):this._DOMObj.dataset.constraints;
      if (!$j.tools.isNull(data)) {
        var cons=data.split(",");
        this.constraints.minWidth=parseFloat(cons[0]);
        this.constraints.minHeight=parseFloat(cons[1]);
        this.constraints.maxWidth=parseFloat(cons[2]);
        this.constraints.maxHeight=parseFloat([3]);
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-ownershowtooltip"):this._DOMObj.dataset.ownershowtooltip;
      if (!$j.tools.isNull(data)) this.ownerShowToolTip=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-align"):this._DOMObj.dataset.align;
      if (!$j.tools.isNull(data)) this.align=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-hittest"):this._DOMObj.dataset.hittest;
      if (!$j.tools.isNull(data)) {
        var hitTest=data.split(",");
        for (var i=0,l=hitTest.length;i<l;i++) {
          var keyValue=hitTest[i].split(":");
          if (!$j.tools.isNull(this.hitTest[keyValue[0]])) this.hitTest[keyValue[0]]=_conv.strToBool(keyValue[1]);
        }
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-cssclass"):this._DOMObj.dataset.cssclass;
      if (!$j.tools.isNull(data)) this.cssClass=data;
      // cursor
      if (this._DOMObj.className.indexOf("csr_")>0) {
        var classes=this._DOMObj.className.split(String.SPACE);
        for (var i=0,l=classes.length;i<l;i++) {
          if (classes[i].startsWith("csr_")) {
            this.cursor=classes[i];
            break;
          }
        }
      }
      this.bindEventFromDOM("onClick");
      this.bindEventFromDOM("onMouseDown");
      this.bindEventFromDOM("onMouseMove");
      this.bindEventFromDOM("onMouseUp");
      this.bindEventFromDOM("onDblClick");
      this.bindEventFromDOM("onMouseLeave");
      this.bindEventFromDOM("onMouseEnter");
      this.bindEventFromDOM("onMouseWheel");
      this.bindEventFromDOM("onMouseWheelStart");
      this.bindEventFromDOM("onMouseWheelEnd");
      this.bindEventFromDOM("onBeforePaint");
      this.bindEventFromDOM("onPaint");
      this.bindEventFromDOM("onAfterPaint");
      this.bindEventFromDOM("onEnterFocus");
      this.bindEventFromDOM("onKillFocus");
      this.bindEventFromDOM("onKeyDown");
      this.bindEventFromDOM("onKeyUp");
      if (this.form.loaded&&!this.form._creating) this.loaded();
    },
    //hasClipParent: function Control_hasClipParent() {
    //  var result=null;
    //  for(var i=0,l=this._components.length;i<l;i++){
    //    if(this._components[i].visible&&this._components[i].clipParent) return this._components[i];
    //  }
    //  return result;
    //},
    //animateColor=function Control_animateColor(propertyName,newValue,duration,type,interpolation){
    //  if (typeof duration!==_const.NUMBER) duration=0.2;
    //  if (!$j.tools.valueInSet(type,$j.types.animationTypes)) type=$j.types.animationTypes.IN;
    //  if (!$j.tools.valueInSet(interpolation,$j.types.interpolationTypes)) interpolation=$j.types.interpolationTypes.LINEAR;
    //  var a=new $j.classes.ColorAnimation(this,false);
    //  a.animationType=type;
    //  a.interpolation=interpolation;
    //  a.onFinish.addListener(this.doAniFinished);
    //  a.duration=duration;
    //  a.propertyName=propertyName;
    //  a.startFromCurrent=true;
    //  a.stopValue=newValue;
    //  a.start();
    //},
    //animateFloat: function Control_animateFloat(propertyName,newValue,duration,type,interpolation){
    //  if (typeof duration!==_const.NUMBER) duration=0.2;
    //  if (!$j.tools.valueInSet(type,$j.types.animationTypes)) type=$j.types.animationTypes.IN;
    //  if (!$j.tools.valueInSet(interpolation,$j.types.interpolationTypes)) interpolation=$j.types.interpolationTypes.LINEAR;
    //  var a=new $j.classes.FloatAnimation(this,false);
    //  a.animationType=type;
    //  a.interpolation=interpolation;
    //  a.onFinish.addListener(this.doAniFinished);
    //  a.duration=duration;
    //  a.propertyName=propertyName;
    //  a.startFromCurrent=true;
    //  a.stopValue=newValue;
    //  a.start();
    //},
    //animateFloatWait: function Control_animateFloatWait(propertyName,newValue,duration,type,interpolation){
    //  if (typeof duration!==_const.NUMBER) duration=0.2;
    //  if (!$j.tools.valueInSet(type,$j.types.animationTypes)) type=$j.types.animationTypes.IN;
    //  if (!$j.tools.valueInSet(interpolation,$j.types.interpolationTypes)) interpolation=$j.types.interpolationTypes.LINEAR;
    //  var a=new $j.classes.FloatAnimation(this,false);
    //  a.animationType=type;
    //  a.interpolation=interpolation;
    //  a.duration=duration;
    //  a.propertyName=propertyName;
    //  a.startFromCurrent=true;
    //  a.stopValue=newValue;
    //  a.start();
    //  return a;
    //},
    //doAniFinished: function Control_doAniFinished(){
    //  delete this.form.this;
    //  $j.renderer.removeListener(this);
    //  destroy(this);
    //},
    //loaded: function Control_loaded(){
    //  this.initialWidth=this.width;
    //  this.initialHeight=this.height;
    //  this.realign();
    //  if (!this.constraints.empty){
    //    //this.beginUpdate();
    //    if (this.width<this.constraints.minWidth) this.width=this.constraints.minWidth;
    //    if (this.width>this.constraints.maxWidth) this.width=this.constraints.maxWidth;
    //    if (this.height<this.constraints.minHeight) this.height=this.constraints.minHeight;
    //    if (this.height>this.constraints.maxHeight) this.height=this.constraints.maxHeight;
    //    //this.endUpdate();
    //  }
    //  if ((this.align===$j.types.aligns.FIT)||(this.align===$j.types.aligns.FITLEFT)||(this.align===$j.types.aligns.FITRIGHT)) this.form._controlsToResize.push(this.owner);
    //  if (!this.form._firstShow) {
    //    //this.owner._DOMObj.innerHTML.concat(this.getHTMLString());
    //  }
    //  $j.classes.Component.prototype.loaded.apply(this,[]);
    //},
    //hasHitTest: function Control_hasHitTest() {
    //  return this.hitTest.mouseDown||this.hitTest.mouseMove||this.hitTest.mouseUp||this.hitTest.mouseWheel;
    //},
    /*resetResizeTriggers: function Control_resetResizeTriggers() {
      var triggers=this._DOMObj.resizeTriggers,
          expand=triggers.firstElementChild,
          contract=triggers.lastElementChild,
          expandChild=expand.firstElementChild;
      contract.scrollLeft=contract.scrollWidth;
      contract.scrollTop=contract.scrollHeight;
      expandChild.style.width=expand.offsetWidth+1+$j.types.CSSUnits.PX;
      expandChild.style.height=expand.offsetHeight+1+$j.types.CSSUnits.PX;
      expand.scrollLeft=expand.scrollWidth;
      expand.scrollTop=expand.scrollHeight;
    },
    checkResizeTriggers: function Control_checkResizeTriggers() {
      return this._DOMObj.offsetWidth!==this._DOMObj.resizeLast.width||this._DOMObj.offsetHeight!==this._DOMObj.resizeLast.height;
    },
    scrollResizeListener: function Control_scrollResizeListener(e) {
      this.jsObj.resetResizeTriggers();
      if (this.jsObj.checkResizeTriggers()) {
        this.resizeLast.width=this.offsetWidth-$j.CSS.getStyleValue(this,$j.types.CSSProperties.BORDERLEFTWIDTH,_const.INTEGER)-$j.CSS.getStyleValue(this,$j.types.CSSProperties.BORDERRIGHTWIDTH,_const.INTEGER);
        this.resizeLast.height=this.offsetHeight-$j.CSS.getStyleValue(this,$j.types.CSSProperties.BORDERTOPWIDTH,_const.INTEGER)-$j.CSS.getStyleValue(this,$j.types.CSSProperties.BORDERBOTTOMWIDTH,_const.INTEGER);
        this.jsObj.width=this.resizeLast.width;
        this.jsObj.height=this.resizeLast.height;
        this.jsObj.resize();
      }
    },
    addResizeListener: function Control_addResizeListener() {
      if (!this._DOMObj.resizeTriggers) {
        if ($j.CSS.getStyleValue(this._DOMObj,$j.types.CSSProperties.POSITION)==='static') this._DOMObj.style.position='relative';
        this._DOMObj.resizeLast={};
        (this._DOMObj.resizeTriggers=$j.doc.createElement($j.types.HTMLElements.DIV)).ClassName='resize-triggers';
        this._DOMObj.resizeTriggers.innerHTML='<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
        this._DOMObj.appendChild(this._DOMObj.resizeTriggers);
        this.resetResizeTriggers();
        this._DOMObj.addEventListener('scroll',this.scrollResizeListener,true);
      }
    },
    removeResizeListener: function Control_removeResizeListener() {
      this._DOMObj.removeEventListener('scroll',this.scrollResizeListener);
      this._DOMObj.resizeTriggers=!this._DOMObj.removeChild(this._DOMObj.resizeTriggers);
    },*/
    //clientRect: function Control_clientRect() {
    //  return new $j.classes.Rect(0,0,this.width,this.height);
    //},
    getDOMObj: function(id) {
      if ($j.tools.Debugger.debug) console.log(this._ClassName+" getDomObj");
      var t=new Date().getTime();
      if (id===String.empty) return;
      this._inherited(id);
      this.initEvents();
      //if (this.animations.length>0) {
      //  for (var i=0,l=this.animations.length;i<l;i++) {
      //    if(this.animations[i].enabled&&!this.animations[i].running&&this.animations[i].autoStart) this.animations[i].start();
      //  }
      //}
      //this.updateFromDOM();
      $j.tools.Debugger.log(arguments,this,t);
    },
    getChildsDOMObj:function Window_getChildsDOMObj(DOMObj,owner) {
      var nodes=(!$j.tools.isNull(DOMObj))?DOMObj.childNodes:this._DOMObj.childNodes,obj,dataClass,dataName;
      for (var i=0,l=nodes.length;i<l;i++) {
        if ($j.tools.isNull(nodes[i])) continue;
        if (nodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
          dataClass=($j.browser.ie)?nodes[i].getAttribute("data-class"):nodes[i].dataset.class;
          dataName=($j.browser.ie)?nodes[i].getAttribute("data-name"):nodes[i].dataset.name;
          if (!$j.tools.isNull(dataClass)) {
            if ($j.tools.isNull(owner)) owner=this;
            if ($j.classes[dataClass]!==null) obj=$j.classes.createComponent($j.classes[dataClass],owner,dataName,null,false,nodes[i].id);
          }
        }
      }
    },
    clientOrigin:function() {
      var result=new $j.classes.Point();
      for (i=0,l=this._owners.length;i<l;i++) {
        result.x+=this._owners[i].left;
        result.y+=this._owners[i].top;
      }
      result.x+=this.left;
      result.y+=this.top;
      return result;
    },
    documentToClient:function() {
      var origin=this.clientOrigin(),result=new $j.classes.Point;
      result.x=$j.mouse.document.x-origin.x;
      result.y=$j.mouse.document.y-origin.y;
      if (result.x<0) result.x=0;
      if (result.y<0) result.y=0;
      if (result.x>this.width) result.x=this.width;
      if (result.y>this.height) result.y=this.height;
      return result;
    },
    isEnabled:function() {
      var enabled=this.enabled;
      if (enabled) {
        for (var i=this._owners.length-1;i>=0;i--) {
          enabled=enabled && this._owners[i].enabled;
        }
      }
      return enabled;
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{internalId}");
      html=a.join(this._internalId);
      a=html.split("{style}");
      if (a.length>1) {
        a.insert(a.length-1,"left:"+this.left+$j.types.CSSUnits.PX+";");
        a.insert(a.length-1,"top:"+this.top+$j.types.CSSUnits.PX+";");
        if (!(this instanceof $j.classes.PopupBox)) {
          a.insert(a.length-1,"width:"+this.width+$j.types.CSSUnits.PX+";");
          a.insert(a.length-1,"height:"+this.height+$j.types.CSSUnits.PX+";");
        }
        html=a.join(String.empty);
      }
      return html;
    },
    bindEventFromDOM:function(eventName) {
      if (typeof eventName!==_const.STRING) return;
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-"+eventName.toLowerCase()):this._DOMObj.dataset[eventName.toLowerCase()];
      if (!$j.tools.isNull(data)) {
        if (typeof this.form[data]===_const.FUNCTION) this[eventName].addListener(this.form[data]);
        else if (typeof data===_const.STRING) {
          if (data!==String.empty) this[eventName].addListener(new Function(data));
        }
      }

    }
    //#endregion
  });
  //#endregion
  //#region ThemedControl final
  var ThemedControl=Control.extend({
    _ClassName: "ThemedControl",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      var t=new Date().getTime();
      if (!$j.tools.isNull(owner)){
        this.themeName=String.empty;
        this._inherited(owner,props);
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    //#region Methods
    getThemeName:function(){
      return (this.themeName!==String.empty)?this.themeName:this.form.app.themeName;
    },
    setThemeName: function(newValue){
      var newThemeOk=false,ctrls,j;
      if (typeof newValue!==_const.STRING) return;
      if (this.themeName!==newValue){
        // on recherche s'il existe un theme
        for (var i=0,l=document.styleSheets.length;i<l;i++)
        {
          if (document.styleSheets[i].href.contains(newValue+".css")) {
            newThemeOk=true;
            break;
          }
        }
        if (newThemeOk){
          this.themeName=newValue;
          ctrls=this._DOMObj.querySelectorAll("[data-theme]");
          if ($j.browser.ie) this._DOMObj.setAttribute("data-theme",this.themeName);
          else this._DOMObj.dataset.theme=this.themeName;
          for(j=0,l1=ctrls.length;j<l1;j++) {
            if (!$j.tools.isNull(ctrls[j].jsObj)) {
              if (jsObj===this) {
                if ($j.browser.ie) ctrls[j].setAttribute("data-theme",this.themeName);
                else ctrls[j].dataset.theme=this.themeName;
              }
            }
          }
        }
      }
    },
    themeAndClassName:function() {
      return this.getThemeName()+"_"+this._ClassName;
    },
    getTemplate: function() {
      var html=this._inherited(),a=html.split("{theme}");
      html=a.join(this.form.getThemeName());
      return html;
    },
    updateFromDOM: function ThemedControl_updateFromDOM() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-theme"):this._DOMObj.dataset.theme;
      if (!$j.tools.isNull(data)) this.themeName=data;
      //if (this._DOMObj.dataset.cssResource!==null) this.cssResource=this._DOMObj.dataset.cssResource;
      this._inherited();
    }
    //#endregion
  });
  //#endregion
  //#region CaptionControl
  var CaptionControl=ThemedControl.extend({
    _ClassName: "CaptionControl",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      var t=new Date().getTime()
      if (!$j.tools.isNull(owner)){
        this.horizAlign=$j.types.textAligns.CENTER;
        this.caption=(!$j.tools.isNull(props.caption)?props.caption:this._ClassName);
        this.wordWrap=false;
        this._inherited(owner,props);
        //$j.CSS.getDefaultText(this.ClassName(),this);
        //$j.CSS.getDefaultText(this.getThemeAndClassName(),this);
        //this.style.customNormal.font=$j.classes.Font.create(owner);
        //this.style.customHovered.font=$j.classes.Font.create(owner);
        //this.style.customPressed.font=$j.classes.Font.create(owner);
        this.autoTranslate=true;
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    //#region setter
    setHorizAlign:function(newValue){
      if (!($j.tools.valueInSet(newValue,$j.types.textAligns))) return;
      if (newValue!==this.horizAlign){
        this.horizAlign=newValue;
        if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          //this.redraw();
          this.form.addControlToRedraw(this);
        } else this.update();
      }
    },
    setCaption: function CaptionControl_setCaption(newValue){
      if (typeof newValue!==_const.STRING) return;
      if (this.caption!==newValue){
        this.caption=newValue;
        if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
        this.update();
      }
    },
    setWordWrap: function CaptionControl_setWordWrap(newValue){
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.wordWrap!==newValue){
        this.wordWrap=newValue;
        if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.form.addControlToRedraw(this);
        } else this.update();
      }
    },
    //#endregion
    //#region Methods
    update: function CaptionControl_update() {
      if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
      //$j.classes.ThemedControl.prototype.update.apply(this,[]);
      //if (this._DOMObj!==null) {
        this._DOMObj.innerHTML=this.caption;
        if (!this.wordWrap) this._DOMObj.style[$j.types.jsCSSProperties.WHITESPACE]="nowrap";
        else this._DOMObj.style[$j.types.jsCSSProperties.WHITESPACE]=String.empty;
      //}
    },
    updateFromDOM: function ThemedControl_updateFromDOM() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-horizalign"):this._DOMObj.dataset.horizalign;
      if (!$j.tools.isNull(data)) this.horizAlign=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-wordwrap"):this._DOMObj.dataset.wordwrap;
      if (!$j.tools.isNull(data)) this.wordWrap=_conv.strToBool(data);
      //this.caption=this._DOMObj.innerHTML;
      this.app.getLocalText(this);
      this._inherited();
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{caption}");
      html=a.join(this.caption);
      return html;
    }
    //#endregion
  });
  //#endregion
  //#region CustomTextControl
  var CustomTextControl=ThemedControl.extend({
    _ClassName: "CustomTextControl",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._inputObj=null;
        this._hasError=false;
        //#endregion
        this.text=this._ClassName;
        this.horizAlign=$j.types.textAligns.CENTER;
        this.maxLength=0;
        this.readOnly=false;
        this.placeHolder=String.empty;
        this.type=$j.types.HTMLInputTypes.TEXT;
        this.filterChars=String.empty;
        this.autoTranslate=true;
        this.canFocused=true;
        this.required=false;
        this.errorMsg=String.empty;
        this.onChange=new $j.classes.NotifyEvent(this); 
      }
    },
    //#region setter
    setMaxLength:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.maxLength!==newValue) {
        this.maxLength=newValue;
        if ($j.isDOMRenderer) this.update();
      }
    },
    setReadOnly:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.readOnly!==newValue) {
        this.readOnly=newValue;
        if ($j.isDOMRenderer) this.update();
      }
    },
    setPlaceHolder:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.placeHolder!==newValue) {
        this.placeHolder=newValue;
        if ($j.isDOMRenderer) this.update();
      }
    },
    setText: function CustomTextControl_setText(newValue){
      if (typeof newValue!==_const.STRING) return;
      if (this.text!==newValue){
        this.text=newValue;
        if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
        if ($j.isDOMRenderer) this.update();
      }
    },
    setHorizAlign:function(newValue){
      if (!($j.tools.valueInSet(newValue,$j.types.textAligns))) return;
      if (newValue!==this.horizAlign){
        this.horizAlign=newValue;
        if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.form.addControlToRedraw(this);
        } else this.update();
      }
    },
    setEnabled:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.enabled!==newValue) {
        this.enabled=newValue;
        if ($j.browser.ie) this._DOMObj.setAttribute("data-enabled",this.enabled);
        else this._DOMObj.dataset.enabled=this.enabled;
        if (this.enabled) this._inputObj.removeAttribute("disabled");
        else this._inputObj.setAttribute("disabled","disabled");
      }
    },
    setRequired:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.required!==newValue) {
        this.required=newValue;
        if ($j.browser.ie) this._DOMObj.setAttribute("data-required",this.required);
        else this._DOMObj.dataset.required=this.required;
      }
    },
    setHasError:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this._hasError!==newValue) {
        this._hasError=newValue;
        if ($j.browser.ie) this._DOMObj.setAttribute("data-haserror",this._hasError);
        else this._DOMObj.dataset.haserror=this._hasError;
      }
    },
    setErrorMsg:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.errorMsg!==newValue) {
        this.errorMsg=newValue;
      }
    },
    //#endregion
    //#region Methods
    update: function CustomTextControl_update() {
      if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
      if (!$j.tools.isNull(this._inputObj)) {
        this._inputObj.value=this.text;
        if (this.maxLength>0) this._inputObj.setAttribute("maxlength",this.maxLength);
        this._inputObj.setAttribute("placeholder",this.placeHolder);
        if (this.readOnly) this._inputObj.setAttribute("readonly",null); 
        else this._inputObj.removeAttribute("readonly"); 
      }
    },
    getChildsDOMObj: function CustomTextControl_getDOMObj(id) {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._inputObj=this._DOMObj.firstElementChild;
        this._inputObj.jsObj=this;
        $j.tools.events.bind(this._inputObj,$j.types.HTMLEvents.CHANGE,this.textChanged);
        $j.tools.events.bind(this._inputObj,$j.types.HTMLEvents.FOCUS,this.DOMFocus);
        $j.tools.events.bind(this._inputObj,$j.types.HTMLEvents.KILLFOCUS,this.DOMBlur);
      }
    },
    updateFromDOM:function() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-horizalign"):this._DOMObj.dataset.horizalign;
      if (!$j.tools.isNull(data)) this.horizAlign=data;
      this.maxLength=parseInt(this._DOMObj.getAttribute("maxlength"),10)|0;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-readonly"):this._DOMObj.dataset.readonly;
      if (!$j.tools.isNull(data)) this.readOnly=_conv.strToBool(data);
      this.placeHolder=this._DOMObj.getAttribute("placeholder");
      if ($j.tools.isNull(this.placeHolder)) this.placeHolder=String.empty;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-filterchars"):this._DOMObj.dataset.filterchars;
      if (!$j.tools.isNull(data)) this.filterChars=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-required"):this._DOMObj.dataset.required;
      if (!$j.tools.isNull(data)) this.required=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-errormsg"):this._DOMObj.dataset.errormsg;
      if (!$j.tools.isNull(data)) this.errorMsg=data;
      this.app.getLocalText(this);
      this.bindEventFromDOM("onChange"); 
      this._inherited();
    },
    textChanged: function CustomTextControl_textChanged() {
      this.jsObj.text=this.value;
      if (!this.jsObj._updating) this.jsObj.onChange.invoke(); 
    },
    keyPress: function CustomTextControl_keyPress() {
      this._inherited();
      if (!$j.keyboard.isNavigationKey()) {
        if (this.filterChars.length>0&&this.filterChars.indexOf($j.keyboard.keyChar)===-1) $j.keyboard.stopEvent();
      }
    },
    keyUp:function() {
      this._inherited();
      if ($j.browser.ie) this._DOMObj.setAttribute("data-length",this._inputObj.value.length);
      else this._DOMObj.dataset.length=this._inputObj.value.length;
    },
    DOMFocus:function() {
      this.jsObj.enterFocus();
    },
    DOMBlur:function() {
      this.jsObj.killFocus();
    },
    setFocus:function() {
      this._inherited();
      if (!$j.tools.isNull(this._inputObj)) {
        this.selectAll();
        this._inputObj.focus();
      }
    },
    selectAll:function() {
      this._inputObj.setSelectionRange(0,this._inputObj.value.length);
    }
    //#endregion
  });
  //#endregion
  //#region GraphicControl final
  var GraphicControl=Control.extend({
    _ClassName: "GraphicControl",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        //$j.classes.DrawingInfo.mixin(this);
        this._inherited(owner,props);
        //this.setHitTest(false);
        this.fillColor=new $j.classes.Color(_colors.BLACK);
        this.strokeColor=new $j.classes.Color(_colors.TRANSPARENT);
        this.strokeWidth=1;
        this.shadowColor=new $j.classes.Color(_colors.TRANSPARENT);
        this.shadowOffsetX=0;
        this.shadowOffsetY=0;
        this.shadowBlur=0;
      }
    },
    //#region Setters
    setStrokeWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0) newValue=0;
      if (this.strokeWidth!==newValue) {
        this.strokeWidth=newValue;
        this.update();
      }
    },
    setShadowOffsetX:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.shadowOffsetX!==newValue) {
        this.shadowOffsetX=newValue;
        this.update();
      }
    },
    setShadowOffsetY:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.shadowOffsetY!==newValue) {
        this.shadowOffsetY=newValue;
        this.update();
      }
    },
    setShadowBlur:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.shadowBlur!==newValue) {
        this.shadowBlur=newValue;
        this.update();
      }
    },
    setFillColor: function(newValue) {
      if (!(newValue instanceof $j.classes.Color)) return;
      if (!this.fillColor.equals(newValue)) {
        this.fillColor.assign(newValue);
        this.update();
      }
    },
    setStrokeColor: function(newValue) {
      if (!(newValue instanceof $j.classes.Color)) return;
      if (!this.strokeColor.equals(newValue)) {
        this.strokeColor.assign(newValue);
        this.update();
      }
    },
    //#endregion
    //#region Methods
    changed: function GraphicControl_changed() {},
    update:function() {
      var stroke=String.empty;
      if (this._loading) return;
      if (this._DOMObj.tagName===$j.types.HTMLElements.DIV) {
        if (!$j.tools.isNull(this.fillColor)) {
          if (!this.fillColor.equals(_colors.TRANSPARENT)) this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDCOLOR]=this.fillColor.toARGBString();
        }
        if (!$j.tools.isNull(this.strokeWidth)&&!$j.tools.isNull(this.strokeColor)) {
          stroke=this.strokeWidth+$j.types.CSSUnits.PX+String.SPACE+"solid"+String.SPACE;
          stroke+=this.strokeColor.toARGBString();
          this._DOMObj.style[$j.types.jsCSSProperties.BORDER]=stroke;
        }
      } else if (this._DOMObj.tagName===$j.types.HTMLElements.SVG) {
        // svg part
        this._DOMObj.setAttribute($j.types.jsCSSProperties.WIDTH,this.width);
        this._DOMObj.setAttribute($j.types.jsCSSProperties.HEIGHT,this.height);
      }
    },
    updateFromDOM:function() {
      var data;
      if (this._DOMObj.tagName===$j.types.HTMLElements.DIV) {
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-fillcolor"):this._DOMObj.dataset.fillcolor;
        if (!$j.tools.isNull(data)) this.fillColor.assign(_colors.parse(data));
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-strokecolor"):this._DOMObj.dataset.strokecolor;
        if (!$j.tools.isNull(data)) this.strokeColor.assign(_colors.parse(data));
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-strokewidth"):this._DOMObj.dataset.strokewidth;
        if (!$j.tools.isNull(data)) this.strokeWidth=~~data;
      } else if (this._DOMObj.tagName===$j.types.HTMLElements.SVG) {
        if (!$j.tools.isNull(this._DOMObj.firstElementChild)) {
          var c=this._DOMObj.firstElementChild;
          //this._DOMObj.setAttribute($j.types.jsCSSProperties.WIDTH,this.width);
          //this._DOMObj.setAttribute($j.types.jsCSSProperties.HEIGHT,this.height);
          if (!$j.tools.isNull(c.getAttribute("fill"))) this.fillColor.assign(_colors.parse(c.getAttribute("fill")));
          if (!$j.tools.isNull(c.getAttribute("stroke"))) this.strokeColor.assign(_colors.parse(c.getAttribute("stroke")));
          if (!$j.tools.isNull(c.getAttribute("stroke-width"))) this.strokeWidth=c.getAttribute("stroke-width");
        }
      }
      this._inherited();
    }
    //reset: function GraphicControl_reset(){
    //  this.background.clear();
    //  this.color.assign(_colors.TRANSPARENT);
    //  this.font.reset();
    //  this.borderWidth=0;
    //  this.borderColor.assign(_colors.TRANSPARENT);
    //  this.bordersRadius={topLeft:0,topRight:0,bottomLeft:0,bottomRight:0};
    //  this.shadowColor.assign(_colors.TRANSPARENT);
    //  this.shadowOffsetX=0;
    //  this.shadowOffsetY=0;
    //  this.shadowBlur=0;
    //},
    //empty: function GraphicControl_empty(){
    //  var background=(this.background.style===$j.types.brushStyles.NONE)&&(this.background.color.equals(_colors.TRANSPARENT));
    //  var color=this.color.equals(_colors.TRANSPARENT);
    //  var font=(!this.font.underline)&&(!this.font.strikeout)&&(this.font.size===10)&&(this.font.family==="Tahoma")&&(this.font.style===$j.types.fontStyles.NORMAL)&&(this.font.height===0);
    //  var borderWidth=this.borderWidth===0;
    //  var borderColor=this.borderColor.equals(_colors.TRANSPARENT);
    //  var bordersRadius=(this.bordersRadius.topLeft===0)&&(this.bordersRadius.topRight===0)&&(this.bordersRadius.bottomLeft===0)&&(this.bordersRadius.bottomRight===0);
    //  var shadowColor=this.shadowColor.equals(_colors.TRANSPARENT);
    //  var shadowOffsetX=this.shadowOffsetX===0;
    //  var shadowOffsetY=this.shadowOffsetY===0;
    //  var shadowBlur=this.shadowBlur===0;
    //  var shape=this.shape===$j.types.shapes.RECTANGLE;
    //  return background&&color&&font&&borderWidth&&borderColor&&bordersRadius&&shadowColor&&shadowOffsetX&&shadowOffsetY&&shadowBlur&&shape;
    //},
    //assign: function GraphicControl_assign(source) {
    //  this.background.assign(source.background);
    //  this.color.assign(source.color);
    //  this.font.assign(source.font);
    //  this.align=source.align;
    //  this.borderWidth=source.borderWidth;
    //  this.borderColor.assign(source.borderColor);
    //  this.bordersRadius.topLeft=source.bordersRadius.topLeft;
    //  this.bordersRadius.topRight=source.bordersRadius.topRight;
    //  this.bordersRadius.bottomLeft=source.bordersRadius.bottomLeft;
    //  this.bordersRadius.bottomRight=source.bordersRadius.bottomRight;
    //  this.shadowColor.assign(source.shadowColor);
    //  this.shadowOffsetX=source.shadowOffsetX;
    //  this.shadowOffsetY=source.shadowOffsetY;
    //  this.shadowBlur=source.shadowBlur;
    //  this.shape=source.shape;
    //  this.borderDash=source.borderDash;
    //}
    //#endregion
  });
  //#endregion
  //#region Layout final
  var Layout=Control.extend({
    _ClassName: "Layout",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region LabeledControl
  var LabeledControl=Control.extend({
    _ClassName:"LabeledControl",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.label=$j.classes.createComponent($j.classes.Label,this,null,null,false);
        this.onChange=new $j.classes.NotifyEvent(this);
        this.width=200;
        this.height=20;
      }
    },
    //#region Setter
    setCaption:function(newValue){
      if (typeof newValue!==_const.STRING) return;
      if (this.label.caption!==newValue){
        this.label.setCaption(newValue);
      }
    },
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.height!==newValue) {
        this._inherited(newValue);
        if (!$j.tools.isNull(this.label)) {
          this.label._DOMObj.style[$j.types.jsCSSProperties.LINEHEIGHT]=this.height+$j.types.CSSUnits.PX;
        }
      }
    },
    //#endregion
    //#region Methods
    //getChildsDOMObj:function() {
    //  var nextId;
    //  this.label=new $j.classes.Label(this);
    //  this.label.getDOMObj(this._DOMObj.firstElementChild.id);
    //  this.label.updateFromDOM();
    //}
    //#endregion
  });
  //#endregion
  //#region PopupBox
  var PopupBox=ThemedControl.extend({
    _ClassName:"PopupBox",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._owners.clear(); 
        this._control=null;
        //#endregion
      }
    },
    show:function(x,y) {
      var tpl,container;
      if ($j.tools.isNull(this.form)) this.form=this._control.form;
      if ($j.tools.isNull(this.app)) this.app=this._control.app;
      if ($j.tools.isNull(this._DOMObj)) {
        tpl=this.getTemplate();
        container=$j.doc.createElement($j.types.HTMLElements.DIV);
        container.innerHTML=tpl;
        $j.doc.body.appendChild(container.firstElementChild);
        this.getDOMObj(this._internalId);
      }
      if (y+this._DOMObj.offsetHeight>$j.doc.body.offsetHeight) {
        // for the popupBox
        if (this instanceof $j.classes.PopupBox) {
          y=y-this._control.height-this._DOMObj.offsetHeight-5;
        } else { // for the popupMenu
          y=y-this._owner.height-this._DOMObj.offsetHeight-5;
        }
      }
      if ($j.mouse.button!==$j.types.mouseButtons.RIGHT) {
        if ((this instanceof $j.classes.PopupMenu)) {
          if (this._control instanceof $j.classes.MenuItem&&!(this._control._owner instanceof $j.classes.MainMenu)) {
            x+=parseInt(getComputedStyle(this._DOMObj.firstElementChild).paddingLeft,10);
            y-=parseInt(getComputedStyle(this._DOMObj.firstElementChild).paddingTop,10);
          }
        }
      }
      this.left=x;
      this.top=y;
      this._DOMObj.style[$j.types.jsCSSProperties.LEFT]=x+$j.types.CSSUnits.PX;
      this._DOMObj.style[$j.types.jsCSSProperties.TOP]=y+$j.types.CSSUnits.PX;
      this._DOMObj.style[$j.types.jsCSSProperties.ZINDEX]=this.zIndex;
      this.form._popups.push(this);
      if (!$j.tools.isNull(this._control)) {
        if ($j.browser.ie) this._control._DOMObj.setAttribute("data-opened","true");
        else this._control._DOMObj.dataset.opened=true;
        if (!$j.tools.isNull(this._control.onOpenMenu)) this._control.onOpenMenu.invoke();
      }
    },
    destroy:function() {
      if (!$j.tools.isNull(this._control)) {
        if ($j.browser.ie) this._control._DOMObj.setAttribute("data-opened","false");
        else this._control._DOMObj.dataset.opened=false;
        if (!$j.tools.isNull(this._control.onCloseMenu)) this._control.onCloseMenu.invoke();
      }
      this._inherited();
    }
  });
  //#endregion
  //#region ItemsWheel 
  var ItemsWheel=ThemedControl.extend({
    _ClassName:"ItemsWheel",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._content=null;
        this._lastDelta=new $j.classes.Point;
        this._downPos=new $j.classes.Point;
        this._currentPos=new $j.classes.Point;
        this._down=false;
        this._scrollAni=null;
        this._sep=null;
        //#endregion
        this.value=String.empty;
        this.setHitTest(true);
        this.items=[];
        this.onChange=new $j.classes.NotifyEvent(this);
        this.index=0;
        this.mouseTracking=true;
        this.animated=true;
      }
    },
    //#region Setters
    setValue:function(newValue) {
      if (typeof newValue!==typeof this.value)return;
      if (newValue!==this.value){
        this.value=newValue;
        if (!this._updating) this.onChange.invoke();
      }
    },
    setIndex:function(newValue) {
      var offset=0,idx;
      if (typeof newValue!==_const.NUMBER)return;
      if (newValue<0) newValue=0;
      if (newValue>this.items.length-1) newValue=this.items.length-1;
      if (this.index!==newValue) {
        this.index=$j.intCeiling(newValue,1);
        if (this.index!==-1) {
          offset=15*this.index;
          this._content.style[$j.types.jsCSSProperties.TOP]=(-offset)+$j.types.CSSUnits.PX;
        }
        this.setValue(this.items[this.index]);
      }
    },
    //#endregion
    //#region Methods
    recreateItems:function() {
      var i,item,str;
      if ($j.tools.isNull(this._content)) return;
      this._content.innerHTML=String.empty;
      for (i=0;i<this.items.length;i++) {
        item=$j.doc.createElement($j.types.HTMLElements.DIV);
        $j.CSS.addClass(item,this._ClassName+"Item");
        if ($j.browser.ie) item.setAttribute("data-theme",this.form.getThemeName());
        else item.dataset.theme=this.form.getThemeName();
        str=this.items[i];
        item.innerHTML=str;
        this._content.appendChild(item);
      }
    },
    updateFromDOM: function() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-value"):this._DOMObj.dataset.value;
      if (!$j.tools.isNull(data)) this.value=data;
      this._inherited();
      //this.recreateItems();
    },
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._sep=this._DOMObj.firstElementChild;
        this._content=this._DOMObj.lastElementChild;
        this._content.jsObj=this;
      }
    },
    mouseWheel:function() {
      var d=$j.mouse.wheelDelta,offsetValue=0;
      this._inherited();
      if (d<0) offsetValue=1;
      else offsetValue=-1;
      this.scrollBy(offsetValue);
    },
    scrollBy:function(offset) {
      var topOffset=0;
      if (this.index+offset<0||this.index+offset>this.items.length-1) offset=0;
      if (offset===0) return;
      if (offset<0) topOffset=15*offset;
      else topOffset=15*offset;
      this.setIndex(this.index+offset);
    },
    loaded:function() {
      this._inherited();
      this.recreateItems();
    },
    mouseDown:function() {
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT&&this.mouseTracking){
        this._lastDelta.setValues(0,0);
        this._downPos.assign($j.mouse.screen);
        this._currentPos.assign($j.mouse.screen);
        this._down=true;
        if ((!$j.tools.isNull(this._scrollAni))&&(this._scrollAni.running)) {
          this._scrollAni.stopAtCurrent();
          this.setIndex($j.intCeiling(this.index,1));
        }
      }
    },
    mouseMove:function() {
      var offset=$j.mouse.screen.y-this._currentPos.y;
      this._inherited();
      if (this._down&&this.mouseTracking) {
        this._lastDelta.y=($j.mouse.screen.y-this._downPos.y);
        if ($j.abs(this._lastDelta.y)<10) {
          this.scrollBy(offset>0?-1:1);
          this._downPos.y=$j.mouse.screen.y;
        }
        this._currentPos.assign($j.mouse.screen);
      }
    },
    mouseUp:function() {
      var offset=0;
      this._inherited();
      offset=$j.mouse.screen.y-this._currentPos.y;
      if (this._down&&this.mouseTracking) {
        this._down=false;
        if (this.animated&&(this._lastDelta.y!==0)) {
          if ($j.abs(this._downPos.y-this._currentPos.y)>20) {
            this.createScrollAni();
            if (this._scrollAni.running) this._scrollAni.stopAtCurrent();
            this._scrollAni.stopValue=~~(this.index-(this._lastDelta.y/2));
            this._scrollAni.start();
          }
        } 
      }
    },
    createScrollAni:function() {
      if ($j.tools.isNull(this._scrollAni)) {
        this._scrollAni=new $j.classes.FloatAnimation(this);
        this._scrollAni.animationType=$j.types.animationTypes.OUT;
        this._scrollAni.interpolation=$j.types.interpolationTypes.QUADRATIC;
        this._scrollAni.duration=3;
        this._scrollAni.control=this;
        this._scrollAni.propertyName="index";
        this._scrollAni.startFromCurrent=true;
        this._scrollAni.convertToCSS=false;
      }
    }
    //#endregion
  });
  Object.seal(ItemsWheel);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,Control,ThemedControl,CaptionControl,CustomTextControl,GraphicControl,LabeledControl,PopupBox,ItemsWheel);
  $j.classes.register($j.types.categories.CONTAINERS,Layout);
  //#region Templates
  var ControlTpl="<div id='{internalId}' data-name='{name}' data-class='{className}' style='{style}' class='{className}' data-theme='{theme}'></div>",
      ItemsWheelTpl=["<div id='{internalId}' class='ItemsWheel' data-theme='{theme}'>",
                     "<div class='ItemsWheelSep' data-theme='{theme}'></div>",
                     "<div class='ItemsWheelContent' data-theme='{theme}'>",
                     "</div>",
                     "</div>"].join(String.empty);
      PopupBoxTpl="<div id='{internalId}' data-name='{name}' data-class='{className}' class='{className} csr_default' data-theme='{theme}' style='{style}'></div>",
      ToolTipTpl="<div class='ToolTip' data-theme='{theme}'>{text}</div>";
  $j.classes.registerTemplates([{Class:Control,template:ControlTpl},{Class:PopupBox,template:PopupBoxTpl},{Class:ItemsWheel,template:ItemsWheelTpl},{Class:Layout,template:ControlTpl},
                                {Class:"ToolTip",template:ToolTipTpl}]);
  //#endregion
})();
//http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
//http://www.twinhelix.com/javascript/dragresize/demo/