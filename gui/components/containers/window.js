(function() {
  //#region WindowIcon
  /*var WindowIcon=$j.classes.Image.extend({
    _ClassName: "WindowIcon",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    }
    //#region Methods
    //#endregion
  });*/
  //#endregion
  //#region WindowTitleBar final
  var WindowTitleBar=$j.classes.ThemedControl.extend({
    _ClassName: "WindowTitleBar",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        //this._icon=null;
        this._title=null;
        this._closeBtn=null;
        this._minimizeBtn=null;
        this._maxRestoreBtn=null;
        this._helpBtn=null;
        this._rollUpDownBtn=null;
        this._stayOnOffBtn=null;
        this._disableAlign=false;
        this._startDragOff=new $j.classes.Point;
        //#endregion
        this.horizAlign=$j.types.textAligns.LEFT;
        this.autoCapture=true;
        this.hitTest.mouseDown=true;
        this.hitTest.mouseUp=true;
        this.hitTest.mouseMove=true;
      }
    },
    //#region Methods
    mouseDown: function(){
      this._inherited();
      var p=new $j.classes.Point($j.mouse.document.x,$j.mouse.document.y);
      this.form._expectResize=-1;
      this._startDragOff.x=p.x;
      this._startDragOff.y=p.y;
      this._isPressed=true;
      $j.dragWindow=this;
      $j.tools.events.bind($j.doc,$j.types.mouseEvents.MOVE.toLowerCase(),this.mouseMove);
      var glass=$j.doc.createElement($j.types.HTMLElements.DIV);
      glass.className="noEvents";
      glass.id="glass";
      glass.jsObj=this;
      glass.style[$j.types.jsCSSProperties.ZINDEX]=~~(this.form._DOMObj.style[$j.types.jsCSSProperties.ZINDEX])-1;
      $j.doc.body.appendChild(glass);
    },
    mouseUp:function(){
      this._inherited();
      this._isPressed=false;
      if ($j.mouse.button===$j.types.mouseButtons.RIGHT) alert('Showing system menu');
      $j.dragWindow=null;
      $j.tools.events.unBind($j.doc,$j.types.mouseEvents.MOVE,this.mouseMove);
      var glass=$j.doc.getElementById("glass");
      if (!$j.tools.isNull(glass)) {
        $j.doc.body.removeChild(glass);
        glass=null;
      }
    },
    _mouseMove:function(mouseEventArg) {
      if ($j.tools.isNull($j.dragWindow)) return;
      $j.dragWindow.mouseMove(mouseEventArg);
    },
    mouseMove:function(mouseEventArg){
      var titlebar,p,decOff=new $j.classes.Point;
      this._inherited();
      if (!$j.tools.isNull(mouseEventArg)) $j.mouse.getMouseInfos(mouseEventArg);
      if ($j.tools.isNull($j.dragWindow)) return;
      titlebar=$j.dragWindow;
      if (titlebar.form.isMaximized()) return;
      if ($j.mouse.button===$j.types.mouseButtons.LEFT){
        p=new $j.classes.Point($j.mouse.document.x,$j.mouse.document.y);
        decOff.x=$j.abs(titlebar._startDragOff.x-p.x);
        decOff.y=$j.abs(titlebar._startDragOff.y-p.y);
        if ((decOff.x!==0||decOff.y!==0)&&titlebar._isPressed){
          if (p.x<0) p.x=0;
          if (p.y<0) p.y=0;
          if (p.x>window.innerWidth) p.x=window.innerWidth;
          if (p.y>window.innerHeight) p.y=window.innerHeight;
          var newLeft=(titlebar.form._DOMObj.offsetLeft+(p.x-titlebar._startDragOff.x)),newTop=(titlebar.form._DOMObj.offsetTop+(p.y-titlebar._startDragOff.y));
          titlebar.form.moveTo(newLeft,newTop);
          titlebar._startDragOff.x=p.x;
          titlebar._startDragOff.y=p.y;
        }
      }
    },
    addCSSClass:function() {
      var str=$j.classes.ThemedControl.prototype.addCSSClass.apply(this,[]);
      if ((this.form.isBorderSizeToolWin)||(this.form.isBorderToolWindow)){
        str=$j.tools.text.replace(str,this.themeAndClassName,this.themeAndClassName+"Tool");
      }
      return str;
    },
    getChildsDOMObj:function() {
      var nodes=this._DOMObj.childNodes,i,l,dataClass,obj,dataName;
      for (i=0,l=nodes.length;i<l;i++) {
        if (nodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
          dataClass=($j.browser.ie)?nodes[i].getAttribute("data-class"):nodes[i].dataset.class;
          dataName=($j.browser.ie)?nodes[i].getAttribute("data-name"):nodes[i].dataset.name;
          if ($j.tools.isNull(dataName)||$j.tools.isNull(dataName)) dataName=String.empty;
          if (!$j.tools.isNull(dataClass)) {
            obj=$j.classes.createComponent($j.classes[dataClass],this,dataName,null,false,nodes[i].id);
            switch (dataClass) {
              case "CaptionControl":
                this._title=obj;
                this._title.mouseDown=function() {
                  this._owner.mouseDown();
                };
                this._title.mouseMove=function() {
                  this._owner.mouseMove();
                };
                this._title.mouseUp=function() {
                  this._owner.mouseUp();
                };
                break;
              //case "WindowIcon":
              //  this._icon=obj;
              //  break;
              case "WindowCloseButton":
                this._closeBtn=obj;
                break;
              case "WindowMinimizeButton":
                this._minimizeBtn=obj;
                break;
              case "WindowMaxRestoreButton":
                this._maxRestoreBtn=obj;
                break;
              case "WindowHelpButton":
                this._helpBtn=obj;
                break;
              case "WindowRollUpDownButton":
                this._rollUpDownBtn=obj;
                break;
              case "WindowStayOnOffButton":
                this._stayOnOffBtn=obj;
                break;
            }
          }
        }
      }
    }
    //#endregion
  });
  //#endregion
  //#region WindowContent
  var WindowContent=$j.classes.ThemedControl.extend({
    _ClassName: "WindowContent",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.hitTest.mouseDown=true;
      }
    }
    //#region Methods
    //#endregion Methods
  });
  //#endregion
  //#region Window final
  var Window=$j.classes.ThemedControl.extend({
    _ClassName: "Window",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._expectResize=-1;
        //this._savedSizePos={};
        this._isModal=false;
        this._creating=true;
        this._controls=[];
        this._layout=null;
        this._titleBar=null;
        this._content=null;
        this._titleBarObj={};
        this._firstShow=true;
        this._controlsToResize=[];
        this._focusedControl=null;
        this._hoveredControl=null;
        this._capturedControl=null;
        this._modalResult=$j.types.modalResults.NONE;
        this._lastSelectedMenuItem=null;
        this._popups=[];
        this._clientWidth=0;
        this._clientHeight=0;
        this._toolsBars=[];
        this._statusBar=null;
        //#endregion
        this.onActivate=new $j.classes.NotifyEvent(this);
        this.onDeactivate=new $j.classes.NotifyEvent(this);
        this.onHide=new $j.classes.NotifyEvent(this);
        this.onShow=new $j.classes.NotifyEvent(this);
        this.onCreate=new $j.classes.NotifyEvent(this);
        this.onDestroy=new $j.classes.NotifyEvent(this);
        //this.onClosedModal=new $j.classes.NotifyEvent(this);
        this.onClose=new $j.classes.NotifyEvent(this);
        this.onCloseQuery=new $j.classes.NotifyEvent(this);
        this.onThemeChanged=new $j.classes.NotifyEvent(this);
        this.position=$j.types.formPositions.DESIGNED;
        this.formState=false;
        this.hitTest.mouseMove=true;
        this.hitTest.mouseDown=true;
        this.hitTest.mouseUp=true;
        this.focusEffect={
          "shadowOffsetX":0,
          "shadowOffsetY":0,
          "shadowBlur":0,
          "shadowColor":String.empty,
          "borderColor":String.empty,
          "borderWidth":0
        };
        this.windowState=$j.types.windowStates.NORMAL;
        this.keyPreview=false;
        this.icon=String.empty;
        this.mainMenu=null;
        this.borderStyle=(!$j.tools.isNull(props.borderStyle))?props.borderStyle:$j.types.borderStyles.SIZEABLE;
        this.activeControl=null;
        this.visible=false;
      }
      this.setTitleBtn(true,[$j.types.titleButtons.CLOSE,$j.types.titleButtons.MINIMIZE,$j.types.titleButtons.MAXIMIZE]);
    },
    //#region Getters/Setters
    isShowed:function() {
      return this.visible;
    },
    isNormal:function() {
      return this.windowState===$j.types.windowStates.NORMAL;
    },
    isMinimized: function() {
      return this.windowState===$j.types.windowStates.MINIMIZED;
    },
    isMaximized: function() {
      return this.windowState===$j.types.windowStates.MAXIMIZED;
    },
    isRolledUp: function() {
      return this.windowState===$j.types.windowStates.ROLLEDUP;
    },
    isBorderDialog: function() {
      return this.borderStyle===$j.types.borderStyles.DIALOG;
    },
    isBorderNone: function() {
      return this.borderStyle===$j.types.borderStyles.NONE;
    },
    isBorderSingle: function() {
      return this.borderStyle===$j.types.borderStyles.SINGLE;
    },
    isBorderSizeable: function() {
      return this.borderStyle===$j.types.borderStyles.SIZEABLE;
    },
    isBorderSizeToolWin: function() {
      return this.borderStyle===$j.types.borderStyles.SIZETOOLWIN;
    },
    isBorderToolWindow: function() {
      return this.borderStyle===$j.types.borderStyles.TOOLWINDOW;
    },
    isPositionDefault: function() {
      return this.position===$j.types.formPositions.DEFAULT;
    },
    isPositionDesigned: function() {
      return this.position===$j.types.formPositions.DESIGNED;
    },
    isPositionMainFormCenter: function() {
      return this.position===$j.types.formPositions.MAINFORMCENTER;
    },
    isPositionScreenCenter: function() {
      return this.position===$j.types.formPositions.SCREENCENTER;
    },
    getActiveWindow:function(){ return this===this.app.activeWindow; },
    setCaption:function(newValue){
      if (typeof newValue!==_const.STRING) return;
      if (this._titleBar._title.caption!==newValue){
        this._titleBar._title.caption=newValue;
        this._titleBar._title._DOMObj.innerHTML=newValue;
      }
    },
    setKeyPreview:function(newValue){
      if (typeof newValue!==_const.BOOLEAN) return;
      if (newValue!==this.keyPreview){
        this.keyPreview=newValue;
        this.propertyChanged("keyPreview");
      }
    },
    setMenu:function(newValue){
      if (!(newValue instanceof $j.classes.MainMenu)) return;
      if (newValue!==this.mainMenu){
        this.mainMenu=newValue;
        this.redraw();
      }
    },
    setBorderStyle:function(newValue){
      if (!$j.tools.valueInSet(newValue,$j.types.borderStyles)) return;
      if (this.borderStyle!==newValue){
        this.borderStyle=newValue;
        this.checkBorderStyle();
      }
    },
    setActive:function(){
      if (this.app.activeWindow!==this){
        $j.windowZIndex++;
        if (!$j.tools.isNull(this.app.activeWindow)) {
          this.app.activeWindow.releaseCapture();
          this.app.activeWindow.onDeactivate.invoke();
          if (!$j.tools.isNull(this.app.activeWindow)) this.app._lastActiveWindow.push(this.app.activeWindow);
        }
      }
      this.app.activeWindow=this;
      this.onActivate.invoke();
    },
    setFocused:function(value){
      if(value) {
        if(!(value instanceof $j.classes.Control)) return;
      }
      if(this._focusedControl!==value){
        if(!$j.tools.isNull(this._focusedControl)){
          this._focusedControl.killFocus();
        }
        this._focusedControl=value;
        if(!$j.tools.isNull(this._focusedControl)){
          this._focusedControl.enterFocus();
        }
      }
    },
    setHovered:function(object){
      if(object){
        if(!(object instanceof $j.classes.Control)) return;
      }
      if(this._hoveredControl!==object) this._hoveredControl=object;
    },
    setTitleBar:function() {
      //this._titleBar.visible=false;
      //this._titleBarObj.mouseDown=this._titleBar.mouseDown;
      //this._titleBarObj.mouseUp=this._titleBar.mouseUp;
      //this._titleBarObj.mouseMove=this._titleBar.mouseMove;
      //this._titleBarObj.hitTest.mouseDown=false;
      //this._titleBarObj.hitTest.mouseMove=false;
      //this._titleBarObj.hitTest.mouseUp=false;
      //this._titleBarObj.hitTest.mouseWheel=false;
      //if (this._titleBarObj._startDragOff===null) this._titleBarObj._startDragOff=new $j.classes.Point();
    },
    setTitleBtn:function(hideshow,tab){
      if (tab.length===0){
        //for (var item in this.titleBtns){
        //  if (typeof this.titleBtns[item]===_const.BOOLEAN){
        //    this.titleBtns[item]=false;
        //    this.titleBar.buttons[item+"Btn"].visible=false;
        //  }
        //}
      }
      for (var i=0,l=tab.length;i<l;i++){
        //this.titleBtns[tab[i]]=hideshow;
        //this.titleBar.buttons[tab[i]+"Btn"].visible=hideshow;
      }
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
          if (this.width===0) this._layout._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=String.empty;
          else this._layout._DOMObj.style[$j.types.jsCSSProperties.WIDTH]=newValue+$j.types.CSSUnits.PX;
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
          if (this.height===0) this._layout._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=String.empty;
          else this._layout._DOMObj.style[$j.types.jsCSSProperties.HEIGHT]=newValue+$j.types.CSSUnits.PX;
          if (this._owner instanceof $j.classes.Control) this._owner.realign();
        }
      }
    },
    //#endregion
    //#region Methods
    checkBorderStyle:function() {
      var contentTop=0,toolbars,toolbarsTop=0;;
      if ($j.browser.ie) this._DOMObj.setAttribute("data-borderstyle",this.borderStyle);
      else this._DOMObj.dataset.borderstyle=this.borderStyle;
      this._titleBar.updateFromDOM();
      if (this.isBorderNone()) {
        this._titleBar.setVisible(false);
      } else {
        this._titleBar.setVisible(true);
        contentTop+=this._titleBar.height+parseInt(getComputedStyle(this._titleBar._DOMObj).marginBottom,10);
      }
      if (!$j.tools.isNull(this.mainMenu)) {
        if (!this.isBorderNone()) this.mainMenu.setTop(this._titleBar.height);
        toolbarsTop=this.mainMenu.height;
      } else toolbarsTop=(!this.isBorderNone())?this._titleBar.height:0;
      toolbars=this._controls.filter(function(e,i,a) {
        if (e instanceof $j.classes.Control) {
          return (e._ClassName==="ToolBar");
        } else return false;
      });
      if (toolbars.length>0) {
        for (var i=0,l=toolbars.length;i<l;i++) {
          toolbars[i].setTop(toolbarsTop);
          toolbarsTop+=toolbars[i].height;
        }
        contentTop=toolbarsTop;
      }
      this._content.setTop(contentTop);
    },
    visibleTitleBarButtons:function(){
      var btns=[];
      //for (var prop in this.titleBtns){
      //  if (typeof this.titleBtns[prop]===_const.BOOLEAN){
      //    if (this.titleBtns[prop]===true) btns.add(prop);
      //  }
      //}
      return btns;
    },
    loadRes:function(){
      $j.tools.loadFormRes(this.resource,$j.tools.resourceReader);
      var t=new Date().getTime();
    },
    close:function(){
      var form=this.form;
      if (form.closeQuery()) {
        form.hide();
        form.onClose.invoke();
      }
    },
    closeQuery:function(){
      //this.onCloseQuery.invoke();
      return true;
    },
    hide:function(){
      if (this._isModal) {
        this.app._lastActiveWindow.last()._DOMObj.removeChild(this.app._lastActiveWindow.last()._DOMObj.lastElementChild);
      }
      this.onHide.invoke();
      this._isModal=false;
      $j.CSS.removeClass(this._DOMObj,"bounceIn");
      $j.CSS.addClass(this._DOMObj,"bounceOut");
      $j.tools.execFunc(this,"removeFromDOM",{},1000);
      if (this.app._lastActiveWindow.length>0) {
        this.app.activeWindow=null;
        this.app._lastActiveWindow.last().setActive();
        this.app._lastActiveWindow.pop();
      }
    },
    maximize:function(){
      //var form;
      //if (!$j.tools.isNull(this)){
      //  form=this.form;
      //  if (form.isRolledUp()) return;
      //  form._savedSizePos.left=form.left;
      //  form._savedSizePos.top=form.top;
      //  form._savedSizePos.width=form.width;
      //  form._savedSizePos.height=form.height;
      //} else form=this;
      //form.left=0;
      //form.top=0;
      //if (!$j.tools.isNull($j.DOMParentElement)) {
      //  form.width=$j.DOMParentElement.offsetWidth;
      //  form.height=$j.DOMParentElement.offsetHeight;
      //} else {
      //  form._DOMOsetWidth(window.innerWidth);
      //  form._DOMOsetHeight(window.innerHeight);
      //  //form._layout._DOMObj.style.height=100+$j.types.CSSUnits.PO;
      //}
      this.windowState=$j.types.windowStates.MAXIMIZED;
      if ($j.browser.ie) {

      } else {
        this._DOMObj.dataset.windowstate=this.windowState;
      }
    },
    restore:function(){
      var form=this.form;
      form.left=form._savedSizePos.left;
      form.top=form._savedSizePos.top;
      form.width=form._savedSizePos.width;
      form.height=form._savedSizePos.height;
      form.windowState=$j.types.windowStates.NORMAL;
      form.DOMResize();
    },
    maximizeRestore:function(){
      var form=this.form;
      if (form.windowState===$j.types.windowStates.MAXIMIZED) form.restore(this);
      else form.maximize(this);
    },
    showHelp:function(){
      //var form=this.form;
    },
    rollUp:function(){
      var form=this.form;
      if (!form.isBorderSizeable||!form.isBorderSingle||!form._titleBar._rollUpDownBtn.visible) return;
      form._savedSizePos.height=form.height;
      if((form.isBorderSizeable)||(form.isBorderSizeToolWin)) form.height=form._titleBar.height+_const.WINDOWSIZEABLEBORDERSIZE*2;
      else form.height=form._titleBar.height;
      form._titleBar._rollUpDownBtn.visible=false;
      //form._titleBar.rollDownBtn.left=form._titleBar.buttons.rollUpBtn.left;
      //form._titleBar.rollDownBtn.visible=true;
      if (form._titleBar._maxRestoreBtn.visible) form._titleBar._maxRestoreBtn.enabled=false;
      if (form._titleBar._minimizeBtn.visible) form._titleBar._minimizeBtn.enabled=false;
      form._content.visible=false;
      form.windowState=$j.types.windowStates.ROLLEDUP;
    },
    rollDown:function(){
      var form=this.form;
      if (form.isRolledUp){
        form.height=form._savedSizePos.height;
        form._titleBar._rollUpDownBtn.visible=false;
        //form._titleBar._rollUpDownBtn.left=form._titleBar.buttons.rollDownBtn.left;
        //form._titleBar._rollUpDownBtn.visible=true;
        form.windowState=$j.types.windowStates.NORMAL;
        if (form._titleBar._maxRestoreBtn.visible) form._titleBar._maxRestoreBtn.enabled=true;
        if (form._titleBar._minimizeBtn.visible) form._titleBar._minimizeBtn.enabled=true;
        form._content.visible=true;
      }
    },
    stayOnTop:function(){
      var form=this.form;
      //if (!form.isBorderSizeable||!form.isBorderSingle||!form._titleBar._stayOnOffBtn.visible) return;
      //form._titleBar._stayOnOffBtnstayOnBtn.visible=false;
      //form._titleBar._stayOnOffBtnstayOffBtn.left=form._titleBar._stayOnOffBtn.left;
      //form._titleBar._stayOnOffBtnstayOffBtn.visible=true;
    },
    stayNormal:function(){
      var form=this.form;
      if (!form.isBorderSizeable||!form.isBorderSingle||!form._titleBar._stayOnOffBtn.visible) return;
      form._titleBar._stayOnOffBtn.visible=false;
      //form._titleBar.stayOnBtn.left=form._titleBar.buttons.stayOffBtn.left;
      //form._titleBar.stayOnBtn.visible=true;
    },
    showSystemMenu:function(){
      //var form=this.form;
      alert('Showing system menu');
      //form.sysMenu.popup();
    },
    show:function(){
      this.checkBorderStyle();
      if (!this.isMaximized()) {
        if (this._clientWidth>0) this.setWidth(this._clientWidth);
      }
      this.setVisible(true);
      if (this._firstShow) {
        this.DOMResize();
        this._firstShow=false;
      }
      this.onShow.invoke();
      this._DOMObj.style[$j.types.jsCSSProperties.ZINDEX]=~~($j.apps.activeApplication.activeWindow._DOMObj.style[$j.types.jsCSSProperties.ZINDEX])+1;
      this.setActive();
      if (this._controlsToResize.length>0) {
        for (var i=0,l=this._controlsToResize.length;i<l;i++) {
          this._controlsToResize[i].addResizeListener();
        }
        this._controlsToResize.length=0;
      }
      $j.CSS.addClass(this._DOMObj,"animated bounceIn");
      $j.tools.events.bind(this._DOMObj,$j.tools.events.whichAnimationEvent(),this.anitmationEnd);
    },
    anitmationEnd:function() {
      $j.tools.events.unBind(this,$j.tools.events.whichAnimationEvent(),this.jsObj.anitmationEnd);
      $j.CSS.removeClass(this,"bounceIn");
      $j.tools.execFunc($j.doc.body.lastElementChild.jsObj,"repaintDOM",null,50);
    },
    repaintDOM:function() {
      $j.CSS.addClass(this._DOMObj,"repaint");
    },
    showModal:function(){
      var glass=$j.doc.createElement($j.types.HTMLElements.DIV);
      glass.className="noEvents";
      glass.jsObj=this;
      this._isModal=true;
      this._modalResult=$j.types.modalResults.NONE;
      this.app.activeWindow._DOMObj.appendChild(glass);
      this.show();
    },
    releaseCapture:function() {
      if(!$j.tools.isNull(this._capturedControl)) this._capturedControl.releaseCapture();
    },
    localRect:function(){
      var r=new $j.classes.Rect;
      if((this.isBorderSizeable)||(this.isBorderSizeToolWin)) {
        r.left=_const.WINDOWSIZEABLEBORDERSIZE;
        r.top=_const.WINDOWSIZEABLEBORDERSIZE;
        r.right=_const.WINDOWSIZEABLEBORDERSIZE;
        r.bottom=_const.WINDOWSIZEABLEBORDERSIZE;
      }
      return r;
    },
    DOMResize:function(){
      /// <summary>
      /// Resize the container of layers and all layers
      /// </summary>
      /// <param name="w">Width:Integer</param>
      /// <param name="h">Height:Integer</param>
      if (this.width<$j.types.constants.WINDOWMINWIDTH) this.width=$j.types.constants.WINDOWMINWIDTH;
      if (this.height<$j.types.constants.WINDOWMINHEIGHT) this.height=$j.types.constants.WINDOWMINHEIGHT;
      if (!this._loading&&!this._creating) {
        this.resize();
        if (this._firstShow) {
        }
        this._firstShow=false;
      }
    },
    touchToMouse:function(touchEventArg) {
      //if (touchEventArg.touches.length > 1) return;
      //var touch=touchEventArg.changedTouches[0],type="",simulatedEvent;
      //switch (touchEventArg.type) {
      //  case $j.types.toucheEvents.START:
      //    type=$j.types.mouseEvents.DOWN.toLowerCase();
      //    break;
      //  case $j.types.toucheEvents.MOVE:
      //    type=$j.types.mouseEvents.MOVE.toLowerCase();
      //    break;
      //  case $j.types.toucheEvents.END:
      //    type=$j.types.mouseEvents.UP.toLowerCase();
      //    break;
      //}
      //touch.preventDefault();
      //simulatedEvent=document.createEvent($j.types.mouseEvents.EVENT);
      //simulatedEvent.initMouseEvent(type,true,true,this.canvas,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);
      //touch.target.dispatchEvent(simulatedEvent);
    },
    dblClick:function(){
      //var obj,p,frm=this.form;
      //if (!frm.hasHitTest()) return;
      //$j.mouse.getMouseInfos(mouseEventArg);
      //p=$j.classes.Point.create($j.mouse.target.x,$j.mouse.target.y);
      //if ($j.renderer===$j.types.renderers.DOM){
      //  if (e.target.jsObj) e.target.jsObj.mouseDown($j.mouse.button,p);
      //  return;
      //}
      //obj=frm.objectByPoint(p,$j.types.mouseEvents.DBLCLICK);
      //if (obj===frm) obj=null;
      //if(obj!==null){
      //  if(obj.enabled){
      //    p=obj.screenToClient(p);
      //    obj.dblClick($j.mouse.button,p);
      //  }
      //}
      //$j.mouse.stopEvent(mouseEventArg);
      //obj=p=null;
    },
    mouseDown:function(){
      /// <summary>
      /// MouseDown event
      /// </summary>
      /// <param name="e">Event parameter</param>
      if ($j.tools.Debugger.debug) console.log("Window.prototype.mouseDown");
      //var obj,p,frm=this.form;
      //if ($j.ghostWindow!==null) return;
      //if (!frm.hasHitTest()) return;
      //$j.isMouseDown=true;
      //$j.mouse.getMouseInfos(mouseEventArg);
      //p=$j.classes.Point.create($j.mouse.target.x,$j.mouse.target.y);
      //if ($j.renderer===$j.types.renderers.DOM){
      //  if (e.target.jsObj) e.target.jsObj.mouseDown($j.mouse.button,p);
      //  return;
      //}
      //frm.setActive();
      //obj=frm.objectByPoint(p,$j.types.mouseEvents.DOWN);
      //if (obj===frm) obj=null;
      //if(obj!==null){
      //  if(obj.enabled){
      //    p=obj.screenToClient(p);
      //    obj.mouseDown($j.mouse.button,p);
      //  }
      //} else {
      //  if (frm._expectResize>-1&&$j.mouse.button===$j.types.mouseButtons.LEFT){
      //    GhostWindow.create(frm);
      //    $j.ghostWindow.dragOff.x=p.x;
      //    $j.ghostWindow.dragOff.y=p.y;
      //    $j.ghostWindow.resizeDrag=true;
      //    $j.ghostWindow._expectResize=frm._expectResize;
      //  }
      //}
      //$j.mouse.stopEvent(mouseEventArg);
      //obj=p=null;
    },
    mouseUp:function(){
      /// <summary>
      /// MouseUp event
      /// </summary>
      /// <param name="e">event parameter</param>
      //var obj,p,frm=this.form;
      //if ($j.ghostWindow!==null) return;
      //if (!frm.hasHitTest()) return;
      //$j.mouse.getMouseInfos(mouseEventArg);
      //$j.isMouseDown=false;
      //p=$j.classes.Point.create($j.mouse.target.x,$j.mouse.target.y);
      //if ($j.renderer===$j.types.renderers.DOM){
      //  if (mouseEventArg.target.jsObj) mouseEventArg.target.jsObj.mouseUp($j.mouse.button,p);
      //  return;
      //}
      //if(frm._capturedControl!==null){
      //  if (!frm._capturedControl.pointInObject(p)) frm.canvas.style.cursor=$j.types.cursors.DEFAULT;
      //  p=frm._capturedControl.screenToClient(p);
      //  frm._capturedControl.mouseUp($j.mouse.button,p);
      //  p=null;
      //  return;
      //}
      //obj=frm.objectByPoint(p,$j.types.mouseEvents.UP);
      //if (obj===frm) obj=null;
      //if(obj!==null){
      //  if(obj.enabled){
      //    p=obj.screenToClient(p);
      //    obj.mouseUp($j.mouse.button,p);
      //  }
      //}
      //$j.mouse.stopEvent(mouseEventArg);
      //obj=p=null;
      //$j.clipboard.focus();
    },
    mouseMove:function(){
      /// <summary>
      /// MouseMove event
      /// </summary>
      /// <param name="e">event parameter</param>
      //var p,obj,newCursor=$j.types.cursors.DEFAULT,frm=this.form;
      //if ($j.ghostWindow!==null) return;
      //if ($j.dragWindow!==null) return;
      //if (!frm.hasHitTest()) return;
      //$j.mouse.getMouseInfos(mouseEventArg);
      //p=$j.classes.Point.create($j.mouse.target.x,$j.mouse.target.y);
      //if(frm._capturedControl!==null){
      //  if (frm._capturedControl.pointInObject(p)) frm.canvas.style.cursor=frm._capturedControl.cursor;
      //  else if ($j.mouse.button!==$j.types.mouseButtons.LEFT) frm.canvas.style.cursor=$j.types.cursors.DEFAULT;
      //  p=frm._capturedControl.screenToClient(p);
      //  frm._capturedControl.mouseMove($j.mouse.button,p);
      //  p=null;
      //  return;
      //}
      //obj=frm.objectByPoint(p,$j.types.mouseEvents.MOVE);
      //if (obj===frm) obj=null;
      //if(obj!==null){
      //  if(obj.enabled){
      //    // � remplacer par un objet hint
      //    newCursor=obj.cursor;
      //    if((obj!==frm._hoveredControl)){
      //      if(frm._hoveredControl!==null){
      //        frm._hoveredControl.setMouseInObject(false);
      //        frm._hoveredControl.mouseLeave();
      //        if (obj===frm) frm.setHovered(null);
      //      }
      //      if (obj!==frm){
      //        frm.setHovered(obj);
      //        frm._hoveredControl.setMouseInObject(true);
      //        frm._hoveredControl.mouseEnter($j.mouse.button,p);
      //      }
      //    }
      //    frm.canvas.style.cursor=newCursor;
      //    p=obj.screenToClient(p);
      //    obj.mouseMove($j.mouse.button,p);
      //  }
      //} else {
      //  if(frm._hoveredControl!==null){
      //    frm._hoveredControl.setMouseInObject(false);
      //    frm._hoveredControl.mouseLeave();
      //    frm.setHovered(null);
      //  }
      //  var wsbs=_const.WINDOWSIZEABLEBORDERSIZE,wsbs2=wsbs*2;
      //  if(((frm.isBorderSizeable())||(frm.isBorderSizeToolWin()))&&(frm.isNormal())){
      //    var r=$j.classes.Rect.create();
      //    r.assign(frm.localRect());
      //    frm._expectResize=-1;
      //    if (p.inRect(r)){
      //      if (p.x<=wsbs2&&p.y<=wsbs2){ // top left
      //        newCursor=$j.types.cursors.SERESIZE;
      //        frm._expectResize=0;
      //      } else if (p.x<=wsbs2&&p.y>=frm.height-wsbs2){ // bottom left
      //        newCursor=$j.types.cursors.SWRESIZE;
      //        frm._expectResize=5;
      //      } else if (p.x>=frm.width-wsbs2&&p.y<wsbs2){ // top right
      //        newCursor=$j.types.cursors.SWRESIZE;
      //        frm._expectResize=2;
      //      } else if (p.x>=frm.width-wsbs2&&p.y>=frm.height-wsbs2){ // bottom right
      //        newCursor=$j.types.cursors.SERESIZE;
      //        frm._expectResize=7;
      //      } else if (p.x>wsbs2&&p.x<frm.width-wsbs2&&p.y<=wsbs){ // top
      //        newCursor=$j.types.cursors.NRESIZE;
      //        frm._expectResize=1;
      //      } else if (p.x>wsbs2&&p.x<frm.width-wsbs2&&p.y>=frm.height-wsbs){ // bottom
      //        newCursor=$j.types.cursors.NRESIZE;
      //        frm._expectResize=6;
      //      } else if (p.x<=wsbs&&p.y>wsbs2&&p.y<frm.height-wsbs2){ // left
      //        newCursor=$j.types.cursors.ERESIZE;
      //        frm._expectResize=3;
      //      } else if (p.x>=frm.width-wsbs&&p.y>wsbs2&&p.y<frm.height-wsbs2){ // right
      //        newCursor=$j.types.cursors.ERESIZE;
      //        frm._expectResize=4;
      //      }
      //    }
      //  }
      //  this.style.cursor=newCursor;
      //}
      //$j.mouse.stopEvent(mouseEventArg);
      //p=obj=newCursor=null;
    },
    mouseWheel:function(){
      //var p,obj,frm=this.form;
      //if (!frm.hasHitTest()) return;
      //$j.mouse.getMouseInfos(mouseEventArg);
      //p=$j.classes.Point.create($j.mouse.target.x,$j.mouse.target.y);
      //obj=frm.objectByPoint(p,$j.types.mouseEvents.WHEEL);
      //if (obj===frm) obj=null;
      //if(obj!==null){
      //  if(obj.enabled){
      //    p=obj.screenToClient(p);
      //    obj.mouseWheel($j.mouse.wheelDir,$j.mouse.wheelDelta,$j.mouse.button,p);
      //  }
      //}
      //$j.mouse.stopEvent(mouseEventArg);
      //obj=p=null;
    },
    mouseOut:function(){
      //var p,frm=this.form;
      //if ($j.ghostWindow!==null) return;
      //if ($j.dragWindow!==null) return;
      //if (!frm.hasHitTest()) return;
      //$j.mouse.getMouseInfos(mouseEventArg);
      //p=$j.classes.Point.create($j.mouse.target.x,$j.mouse.target.y);
      //if(frm._capturedControl!==null){
      //  frm._capturedControl.setMouseInObject(false);
      //  p=frm._capturedControl.screenToClient(p);
      //  frm._capturedControl.mouseLeave($j.mouse.button,p);
      //}
      //if(frm._hoveredControl!==null){
      //  frm._hoveredControl.setMouseInObject(false);
      //  p=frm._hoveredControl.screenToClient(p);
      //  frm._hoveredControl.mouseLeave($j.mouse.button,p);
      //  frm.setHovered(null);
      //}
    },
    keyDown:function(){
      //var form=$j.apps.activeApplication.activeWindow;
      //$j.keyboard.getKeyboardInfos(keyboardEventArg);
      //if (form._focusedControl!==null) form._focusedControl.keyDown(keyboardEventArg);
    },
    keyPress:function(){
      //var form=$j.apps.activeApplication.activeWindow;
      //$j.keyboard.getKeyboardInfos(keyboardEventArg);
      //if (form._focusedControl!==null) form._focusedControl.keyPress(keyboardEventArg);
    },
    keyUp:function(){
      //var form=$j.apps.activeApplication.activeWindow;
      //$j.keyboard.getKeyboardInfos(keyboardEventArg);
      //if (form._focusedControl!==null) form._focusedControl.keyUp(keyboardEventArg);
    },
    sortControls:function(){
    //  this._controls=this._controls.sort(function(a,b){return a._controlIdx-b._controlIdx;});
    },
    resize:function() {
      var i,l,childs;
      if (this._layout!==null) {
        //if (this._clientWidth>0) this.setWidth(this._clientWidth);
      //  //this.padding.applyTo(this.titleBar);
      //  //this.titleBar.margin.call();
      //  this._layout.realign();
        this.resizeContent();
      }
      //this._layout.updateFromDOM();
      //this._content.updateFromDOM();
    },
    addCSSClass:function() {
      var str=$j.classes.ThemedControl.prototype.addCSSClass.apply(this,[]);
      str=$j.tools.text.replace(str,this._ClassName,"Window");
      return str;
    },
    getChildsDOMObj:function() {
      var nodes,dataName,obj,i,l,dataClass,contentTop=0,contentBottom=0;
      this._layout=$j.classes.createComponent($j.classes.Layout,this,null,null,false);
      this._layout.getDOMObj(this._DOMObj.firstElementChild.id);
      this._layout.updateFromDOM();
      nodes=this._layout._DOMObj.childNodes;
      for (i=0,l=nodes.length;i<l;i++) {
        if (nodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
          dataClass=($j.browser.ie)?nodes[i].getAttribute("data-class"):nodes[i].dataset.class;
          dataName=($j.browser.ie)?nodes[i].getAttribute("data-name"):nodes[i].dataset.name;
          if (!$j.tools.isNull(dataClass)) {
            obj=$j.classes.createComponent($j.classes[dataClass],this._layout,dataName,null,false);
            obj.getDOMObj(nodes[i].id);
            switch (dataClass) {
              case "WindowTitleBar":
                this._titleBar=obj;
                if (this.borderStyle===$j.types.borderStyles.NONE) {
                  this._titleBar.setVisible(false);
                }// else contentTop+=obj._DOMObj.offsetHeight+parseInt(getComputedStyle(obj._DOMObj).marginBottom,10);
                break;
              case "WindowContent":
                this._content=obj;
                break;
              case "MainMenu":
                this.mainMenu=obj;
                //contentTop+=obj._DOMObj.offsetHeight;
                break;
              case "ToolBar":
                this._toolsBars.push(obj);
                //obj._DOMObj.style[$j.types.jsCSSProperties.TOP]=contentTop+$j.types.CSSUnits.PX;
                //contentTop+=obj._DOMObj.offsetHeight;
                break;
              case "StatusBar":
                if ($j.tools.isNull(this._statusBar)) this._statusBar=obj;
                else $j.CSS.addClass(obj._DOMObj,"hidden");
                //obj._DOMObj.style[$j.types.jsCSSProperties.BOTTOM]=contentBottom+$j.types.CSSUnits.PX;
                //contentBottom+=obj._DOMObj.offsetHeight;
                break;
            }
            obj.updateFromDOM();
            obj.getChildsDOMObj();
          }
        }
      }
      this.resizeContent();
    },
    formCreated:function(id) {
      this.getDOMObj(id);
      this.updateFromDOM();
      this.getChildsDOMObj();
      if (!$j.tools.isNull(this.addListeners)) this.addListeners();
      this.loaded();
    },
    resizeContent:function() {
      var contentTop=0,contentBottom=0;
      if (this.borderStyle!==$j.types.borderStyles.NONE) contentTop+=this._titleBar._DOMObj.offsetHeight+parseInt(getComputedStyle(this._titleBar._DOMObj).marginBottom,10);
      if (!$j.tools.isNull(this.mainMenu)) contentTop+=this.mainMenu._DOMObj.offsetHeight;
      for (var i=0,l=this._toolsBars.length;i<l;i++) {
        this._toolsBars[i]._DOMObj.style[$j.types.jsCSSProperties.TOP]=contentTop+$j.types.CSSUnits.PX;
        contentTop+=this._toolsBars[i]._DOMObj.offsetHeight;
      }
      if (!$j.tools.isNull(this._statusBar)) contentBottom+=this._statusBar._DOMObj.offsetHeight;
      this._content._DOMObj.style[$j.types.jsCSSProperties.TOP]=contentTop+$j.types.CSSUnits.PX;
      this._content._DOMObj.style[$j.types.jsCSSProperties.BOTTOM]=contentBottom+$j.types.CSSUnits.PX;
      this._content.top=contentTop;
    },
    updateFromDOM:function() {
      this._inherited();
      if ($j.browser.ie) {
        if (!$j.tools.isNull(this._DOMObj.getAttribute("data-borderstyle"))) this.borderStyle=this._DOMObj.getAttribute("data-borderstyle");
        if (!$j.tools.isNull(this._DOMObj.getAttribute("data-windowstate"))) this.windowState=this._DOMObj.getAttribute("data-windowstate");
        if (!$j.tools.isNull(this._DOMObj.getAttribute("data-clientwidth"))) this._clientWidth=~~this._DOMObj.getAttribute("data-clientwidth");
        if (!$j.tools.isNull(this._DOMObj.getAttribute("data-clientheight"))) this._clientHeight=~~this._DOMObj.getAttribute("data-clientheight");
      } else {
        if (!$j.tools.isNull(this._DOMObj.dataset.borderstyle)) this.borderStyle=this._DOMObj.dataset.borderstyle;
        if (!$j.tools.isNull(this._DOMObj.dataset.windowstate)) this.windowState=this._DOMObj.dataset.windowstate;
        if (!$j.tools.isNull(this._DOMObj.dataset.clientwidth)) this._clientWidth=~~this._DOMObj.dataset.clientwidth;
        if (!$j.tools.isNull(this._DOMObj.dataset.clientheight)) this._clientHeight=~~this._DOMObj.dataset.clientheight;
      }
    },
    loaded:function() {
      this._inherited();
      this._creating=false;
    },
    destroyPopups:function() {
      var popupMenu,i,l;
      if (this._popups.length>0) {
        for (var i=this._popups.length-1;i>=0;i--) {
          if (this._popups[i]._control instanceof $j.classes.MenuItem) {
            this._popups[i]._control.destroySubMenu();
            //this._popups[i]._control=null;
          } else if (this._popups[i]._control instanceof $j.classes.DropDownListBox) {
            this._popups[i]._control.destroyPopup();
            this._popups[i]._control=null;
          }
          if (!$j.tools.isNull(this._popups[i])) this._popups[i].destroy();
          this._popups[i]=null;
        }
      }
      this._popups.clear();
      if (!$j.tools.isNull(this.mainMenu)) {
        for (i=0,l=this.mainMenu.items.length;i<l;i++) {
          this.mainMenu.items[i].setActive(false);
        }
      }
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{appName}");
      html=a.join(this.app.name);
      a=html.split("{internalId_Layout}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_content}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_TitleBar}");
      html=a.join(String.uniqueId());
      //a=html.split("{internalId_Icon}");
      //html=a.join(String.uniqueId());
      a=html.split("{internalId_Title}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_CloseButton}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_MaxRestoreButton}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_MinimizeButton}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_HelpButton}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_RollUpDownButton}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_StayOnOffButton}");
      html=a.join(String.uniqueId());
      return html;
    },
    removeFromDOM:function()  {
      $j.doc.body.removeChild(this._DOMObj);
    },
    moveTo:function(x,y) {
      if (typeof x!==_const.NUMBER) return;
      if (typeof y!==_const.NUMBER) return;
      if (x+this._DOMObj.offsetWidth<0) x=0;
      if (y+this._DOMObj.offsetHeight<0) y=0;
      if (x>$j.doc.body.offsetWidth) x=$j.doc.body.offsetWidth-this._DOMObj.offsetWidth;
      if (y>$j.doc.body.offsetHeight) y=$j.doc.body.offsetHeight-this._DOMObj.offsetHeight-10;
      this.setLeft(x);
      this.setTop(y);
    },
    center:function() {
      var l,t;
      l=~~(($j.doc.body.offsetWidth-this._DOMObj.offsetWidth)/2);
      t=~~(($j.doc.body.offsetHeight-this._DOMObj.offsetHeight)/2);
      this._DOMObj.style[$j.types.jsCSSProperties.LEFT]=l+$j.types.CSSUnits.PX;
      this._DOMObj.style[$j.types.jsCSSProperties.TOP]=t+$j.types.CSSUnits.PX;
      this.left=l;
      this.top=t;
    },
    //#endregion
  });
  //#endregion
  //#region MessageDlg
  var MessageDlg=Window.extend({
    _ClassName:"MessageDlg",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        this.dlgType=$j.types.messageTypes.CUSTOM;
        this.buttons=[];
        if (!$j.tools.isNull(props.dlgType)) this.dlgType=props.dlgType;
        if (!$j.tools.isNull(props.buttons)) this.buttons=props.buttons;
      }
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{internalId_msg}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_img}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnCont}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnYes}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnNo}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnOk}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnCancel}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnAbort}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnRetry}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnIgnore}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnAll}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnNoToAll}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnYesToAll}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnHelp}");
      html=a.join(String.uniqueId());
      return html;
    },
    resizeByContent:function() {
      var msgW=this.Msg._DOMObj.offsetWidth,msgH=this.Msg._DOMObj.offsetHeight,titleH=this._titleBar._DOMObj.offsetHeight,nW,nH,lW=0,lH=this.Msg_layout._DOMObj.offsetHeight,lastBtnLeft=0,nbBtns=0;
      if (this.dlgType!==$j.types.messageTypes.CUSTOM) {
        this.Msg_icon.setVisible(true);
        this.Msg.setLeft(58);
      } else {
        this.Msg.setLeft(12);
        this.Msg_icon.setVisible(false);
      }
      //this.Msg_icon.load(_const.PIX);
      switch (this.dlgType) {
        case $j.types.messageTypes.CUSTOM:
          //this.Msg_icon.load(_const.PIX);
          break;
        case $j.types.messageTypes.WARNING:
          //this.Msg_icon.load(_const.WARNING_ICO);
          $j.CSS.addClass(this.Msg_icon._DOMObj,_const.WARNING_CSS);
          break;
        case $j.types.messageTypes.ERROR:
          //this.Msg_icon.load(_const.ERROR_ICO);
          $j.CSS.addClass(this.Msg_icon._DOMObj,_const.ERROR_CSS);
          break;
        case $j.types.messageTypes.INFORMATION:
          //this.Msg_icon.load(_const.INFORMATION_ICO);
          $j.CSS.addClass(this.Msg_icon._DOMObj,_const.INFORMATION_CSS);
          break;
        case $j.types.messageTypes.CONFIRMATION:
          //this.Msg_icon.load(_const.CONFIRMATION_ICO);
          $j.CSS.addClass(this.Msg_icon._DOMObj,_const.CONFIRMATION_CSS);
          break;
      }
      if (this.buttons.indexOf($j.types.messageButtons.YES)>-1) {
        this.btnYes.setVisible(true);
        this.btnYes.setLeft(lastBtnLeft);
        lW+=this.btnYes._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnYes._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.NO)>-1) {
        this.btnNo.setVisible(true);
        this.btnNo.setLeft(lastBtnLeft);
        lW+=this.btnNo._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnNo._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.OK)>-1) {
        this.btnOk.setVisible(true);
        this.btnOk.setLeft(lastBtnLeft);
        lW+=this.btnOk._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnOk._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.CANCEL)>-1) {
        this.btnCancel.setVisible(true);
        this.btnCancel.setLeft(lastBtnLeft);
        lW+=this.btnCancel._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnCancel._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.ABORT)>-1) {
        this.btnAbort.setVisible(true);
        this.btnAbort.setLeft(lastBtnLeft);
        lW+=this.btnAbort._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnAbort._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.RETRY)>-1) {
        this.btnRetry.setVisible(true);
        this.btnRetry.setLeft(lastBtnLeft);
        lW+=this.btnRetry._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnRetry._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.IGNORE)>-1) {
        this.btnIgnore.setVisible(true);
        this.btnIgnore.setLeft(lastBtnLeft);
        lW+=this.btnIgnore._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnIgnore._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.ALL)>-1) {
        this.btnAll.setVisible(true);
        this.btnAll.setLeft(lastBtnLeft);
        lW+=this.btnAll._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnAll._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.NOTOALL)>-1) {
        this.btnNoToAll.setVisible(true);
        this.btnNoToAll.setLeft(lastBtnLeft);
        lW+=this.btnNoToAll._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnNoToAll._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.YESTOALL)>-1) {
        this.btnYesToAll.setVisible(true);
        this.btnYesToAll.setLeft(lastBtnLeft);
        lW+=this.btnYesToAll._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnYesToAll._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      if (this.buttons.indexOf($j.types.messageButtons.HELP)>-1) {
        this.btnHelp.setVisible(true);
        this.btnHelp.setLeft(lastBtnLeft);
        lW+=this.btnHelp._DOMObj.offsetWidth;
        lastBtnLeft+=this.btnHelp._DOMObj.offsetWidth+6;
        nbBtns++;
      }
      lW+=((nbBtns-1)*6);
      if (this.dlgType!==$j.types.messageTypes.CUSTOM) {
        if (msgW+this.Msg_icon._DOMObj.offsetWidth+14<lW) nW=lW+24;
        else nW=12+this.Msg_icon._DOMObj.offsetWidth+12+msgW+12;
      } else if (msgW<lW) nW=lW+24;
      else nW=msgW+10;
      this.Msg_layout.setWidth(lW);
      nH=titleH+13+msgH+((msgH<32)?(32-msgH):0)+13+lH+13;
      nW+=parseInt(getComputedStyle(this._layout._DOMObj).marginLeft,10)+parseInt(getComputedStyle(this._layout._DOMObj).marginRight,10);
      if (nW>$j.doc.body.offsetWidth) nW=$j.doc.body.offsetWidth-20;
      if (nH>$j.doc.body.offsetHeight) nH=$j.doc.body.offsetHeight-20;
      this.setWidth(nW);
      this.setHeight(nH);
    }
  });
  //#endregion
  //#region InputDlg
  var InputDlg=Window.extend({
    _ClassName:"InputDlg",
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{internalId_msg}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnCont}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnOk}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnCancel}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_input}");
      html=a.join(String.uniqueId());
      return html;
    },
    resizeByContent:function() {
      var msgW=this.Msg._DOMObj.offsetWidth,msgH=this.Msg._DOMObj.offsetHeight,titleH=this._titleBar._DOMObj.offsetHeight,nW,nH,lW=0,lH=this.Msg_layout._DOMObj.offsetHeight,lastBtnLeft=0,nbBtns=0;
      this.btnOk.setLeft(lastBtnLeft);
      lW+=this.btnOk._DOMObj.offsetWidth;
      lastBtnLeft+=this.btnOk._DOMObj.offsetWidth+6;
      nbBtns++;
      this.btnCancel.setLeft(lastBtnLeft);
      lW+=this.btnCancel._DOMObj.offsetWidth;
      lastBtnLeft+=this.btnCancel._DOMObj.offsetWidth+6;
      nbBtns++;
      lW+=6;
      if (msgW<lW) nW=lW+24;
      else nW=msgW+10;
      this.Msg_layout.setWidth(lW);
      this.TextBox.setTop(this.Msg._DOMObj.offsetTop+msgH+5);
      this.TextBox.setFocus();
      nH=titleH+13+msgH+5+this.TextBox._DOMObj.offsetHeight+13+lH+13;
      nW+=parseInt(getComputedStyle(this._layout._DOMObj).marginLeft,10)+parseInt(getComputedStyle(this._layout._DOMObj).marginRight,10);
      if (nW>$j.doc.body.offsetWidth) nW=$j.doc.body.offsetWidth-20;
      if (nH>$j.doc.body.offsetHeight) nH=$j.doc.body.offsetHeight-20;
      this.setWidth(nW);
      this.setHeight(nH);
    }
  });
  //#endregion
  //#region dialogs
  $j.dialogs={};
  $j.dialogs.messageDlgPos=function(msg,dlgType,buttons,x,y,defaultButton) {
    var dlg=$j.classes.createComponent($j.classes.MessageDlg,$j.apps.activeApplication,null,{"parentDOM":$j.doc.body,"dlgType":dlgType,"buttons":buttons});
    dlg.Msg.setCaption(msg);
    dlg.setCaption($j.apps.activeApplication.name);
    dlg.resizeByContent();
    if (x===-1&&y===-1) dlg.center();
    else dlg.moveTo(x,y);
    dlg.showModal();
    return dlg;
  };
  $j.dialogs.showMessage=$j.dialogs.messageBox=$j.dialogs.alert=function(msg) {
    return $j.dialogs.showMessagePos(msg,-1,-1);
  };
  $j.dialogs.showMessagePos=function(msg,x,y) {
    return $j.dialogs.messageDlgPos(msg, $j.types.messageTypes.CUSTOM,[$j.types.messageButtons.OK],/*0,*/($j.tools.isNull(x)?-1:x),($j.tools.isNull(y)?-1:y));
  };
  $j.dialogs.messageDlg=function(msg,dlgType,buttons,defaultButton) {
    return $j.dialogs.messageDlgPos(msg,dlgType,buttons,/*helpCtx,*/ -1,-1,defaultButton);
  };
  $j.dialogs.warning=function(msg,buttons) {
    return $j.dialogs.messageDlgPos(msg,$j.types.messageTypes.WARNING,(!$j.tools.isNull(buttons)?buttons:[$j.types.messageButtons.OK]),-1,-1);
  };
  $j.dialogs.information=function(msg,buttons) {
    return $j.dialogs.messageDlgPos(msg,$j.types.messageTypes.INFORMATION,(!$j.tools.isNull(buttons)?buttons:_const.BTNS_YESNO),-1,-1);
  };
  $j.dialogs.error=function(msg,buttons) {
    return $j.dialogs.messageDlgPos(msg,$j.types.messageTypes.ERROR,(!$j.tools.isNull(buttons)?buttons:$j.types.messageButtons.OK),-1,-1);
  };
  $j.dialogs.confirmation=$j.dialogs.confirm=function(msg,buttons) {
    return $j.dialogs.messageDlgPos(msg,$j.types.messageTypes.CONFIRMATION,(!$j.tools.isNull(buttons)?buttons:_const.BTNS_OKCANCEL),-1,-1);
  };
  $j.dialogs.prompt=$j.dialogs.inputQuery=function(caption,prompt,value) {
    var inputDlg=$j.classes.createComponent($j.classes.InputDlg,$j.apps.activeApplication,null,{"parentDOM":$j.doc.body},true);
    inputDlg.Msg.setCaption(prompt);
    inputDlg.TextBox.setText(value);
    inputDlg.setCaption(caption);
    inputDlg.resizeByContent();
    inputDlg.center();
    inputDlg.showModal();
    return inputDlg;
  };
  //#endregion
  $j.classes.register($j.types.categories.CONTAINERS,Window);
  $j.classes.register($j.types.internalCategories.INTERNAL,/*WindowIcon,*/WindowTitleBar,WindowContent,MessageDlg,InputDlg);
  //#region Templates
  var WindowTitleBarTpl=["<div id='{internalId_TitleBar}' data-class='WindowTitleBar' class='WindowTitleBar' data-theme='{theme}'>",
                         //"<div id='{internalId_Icon}' data-class='WindowIcon' class='WindowIcon logo'></div>",
                         "<div id='{internalId_Title}' data-class='CaptionControl' class='CaptionControl WindowTitle logo WindowIcon' data-theme='{theme}'>{title}</div>",
                         "<div id='{internalId_CloseButton}' data-class='WindowCloseButton' class='WindowTitleButton WindowCloseButton' data-theme='{theme}'><span></span></div>",
                         "<div id='{internalId_MaxRestoreButton}' data-class='WindowMaxRestoreButton' class='WindowTitleButton WindowMaxRestoreButton' data-theme='{theme}' data-isrestore='false'><span></span></div>",
                         "<div id='{internalId_MinimizeButton}' data-class='WindowMinimizeButton' class='WindowTitleButton WindowMinimizeButton' data-theme='{theme}'><span></span></div>",
                         "<div id='{internalId_HelpButton}' data-class='WindowHelpButton' class='WindowTitleButton WindowHelpButton hidden' data-theme='{theme}'><span></span></div>",
                         "<div id='{internalId_RollUpDownButton}' data-class='WindowRollUpDownButton' class='WindowTitleButton WindowRollUpDownButton hidden' data-theme='{theme}' data-isup='true'><span></span></div>",
                         "<div id='{internalId_StayOnOffButton}' data-class='WindowStayOnOffButton' class='WindowTitleButton WindowStayOnOffButton hidden' data-theme='{theme}' data-ison='true'><span></span></div>",
                         "</div>"].join(String.empty),
      WindowTpl=["<div id='{internalId}' data-name='{name}' data-class='Window' class='{appName} Window csr_default hidden' data-theme='{theme}'>",
                 "<div id='{internalId_Layout}' data-class='Layout' class='WindowLayout' data-theme='{theme}'>",
                 "<div id='{internalId_content}' data-name='{windowName}_content' data-class='WindowContent' class='WindowContent' data-theme='{theme}' data-popupmenu='{popupMenu}'></div>",
                 WindowTitleBarTpl,
                 "</div>",
                 "</div>"].join(String.empty),
      MessageDlgTpl=["<div id='{internalId}' data-name='{name}' data-class='Window' class='{appName} Window csr_default' data-theme='{theme}' data-borderstyle='dialog'>",
                      "<div id='{internalId_Layout}' data-class='Layout' class='WindowLayout' data-theme='{theme}'>",
                      WindowTitleBarTpl,
                      "<div id='{internalId_content}' data-name='showMessage_content' data-class='WindowContent' class='WindowContent' data-theme='{theme}'>",
                      "<label id='{internalId_msg}' data-name='Msg' data-class='Label' class='Label csr_default' data-theme='{theme}' style='left: 58px; top: 16px;'></label>",
                      "<img id='{internalId_img}' data-class='Icon' data-name='Msg_icon' class='Icon hidden' data-theme='{theme}' alt='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=' draggable='false' style='left:12px;top:16px;' data-visible='false' />",
                      "<div id='{internalId_btnCont}' data-class='Layout' data-name='Msg_layout' class='Layout horizontalCenter' data-theme='{theme}' style='overflow:visible;height: 24px; bottom: 5px;'>",
                      "<div id='{internalId_btnYes}' data-name='btnYes' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='yes' data-visible='false'><span>Yes</span></div>",
                      "<div id='{internalId_btnNo}' data-name='btnNo' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='no' data-visible='false'><span>No</span></div>",
                      "<div id='{internalId_btnOk}' data-name='btnOk' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='ok' data-visible='false'><span>Ok</span></div>",
                      "<div id='{internalId_btnCancel}' data-name='btnCancel' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='cancel' data-visible='false'><span>Cancel</span></div>",
                      "<div id='{internalId_btnAbort}' data-name='btnAbort' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='abort' data-visible='false'><span>Abort</span></div>",
                      "<div id='{internalId_btnRetry}' data-name='btnRetry' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='retry' data-visible='false'><span>Retry</span></div>",
                      "<div id='{internalId_btnIgnore}' data-name='btnIgnore' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='ignore' data-visible='false'><span>Ignore</span></div>",
                      "<div id='{internalId_btnAll}' data-name='btnAll' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='all' data-visible='false'><span>All</span></div>",
                      "<div id='{internalId_btnNoToAll}' data-name='btnNoToAll' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='noToAll' data-visible='false'><span>No to All</span></div>",
                      "<div id='{internalId_btnYesToAll}' data-name='btnYesToAll' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='yesToAll' data-visible='false'><span>Yes to All</span></div>",
                      "<div id='{internalId_btnHelp}' data-name='btnHelp' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button hidden' data-theme='{theme}' data-modalresult='help' data-visible='false'><span>Help</span></div>",
                      "</div></div></div></div>"].join(String.empty),
      InputDlgTpl=["<div id='{internalId}' data-name='{name}' data-class='Window' class='{appName} Window csr_default' data-theme='{theme}' data-borderstyle='dialog'>",
                      "<div id='{internalId_Layout}' data-class='Layout' class='WindowLayout' data-theme='{theme}'>",
                      WindowTitleBarTpl,
                      "<div id='{internalId_content}' data-name='showMessage_content' data-class='WindowContent' class='WindowContent' data-theme='{theme}'>",
                      "<label id='{internalId_msg}' data-name='Msg' data-class='Label' class='Label csr_default' data-theme='{theme}' style='left: 12px; top: 12px;'></label>",
                      "<div id='{internalId_input}' data-name='TextBox' data-class='TextBox' style='left: 12px; right: 12px; height: 20px' class='TextBox' data-theme='{theme}'>",
                      "<input type='text' value='{value}' class='csr_text' data-theme='{theme}' /></div>",
                      "<div id='{internalId_btnCont}' data-class='Layout' data-name='Msg_layout' class='Layout horizontalCenter' data-theme='{theme}' style='overflow:visible;height: 24px; bottom: 5px;'>",
                      "<div id='{internalId_btnOk}' data-name='btnOk' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button' data-theme='{theme}' data-modalresult='ok'><span>Ok</span></div>",
                      "<div id='{internalId_btnCancel}' data-name='btnCancel' data-class='Button' style='height: 22px; width: 71px;top: 0;' class='Button' data-theme='{theme}' data-modalresult='cancel'><span>Cancel</span></div>",
                      "</div></div></div></div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:WindowTitleBar,template:WindowTitleBarTpl},{Class:Window,template:WindowTpl},{Class:MessageDlg,template:MessageDlgTpl},{Class:InputDlg,template:InputDlgTpl}]);
  //#endregion
})();