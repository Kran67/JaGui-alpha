(function(){
  //#region CustomButton final
  var CustomButton=$j.classes.CaptionControl.extend({
    _ClassName: "CustomButton",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      var t=new Date().getTime()
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._pressing=false;
        this._repeatTimer=null;
        this._textObj=null;
        //#endregion
        this.modalResult=$j.types.modalResults.NONE;
        this.staysPressed=false;
        this.repeatClick=false;
        this.setHitTest(true);
        this.width=75;
        this.height=25;
        this.autoCapture=true;
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    //#region Setters
    setPressing:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this._pressing!==newValue) {
        this._pressing=newValue;
        $j.CSS.removeClass(this._DOMObj,"pressed");
        $j.CSS.removeClass(this._textObj,"DownText2");
        if (this._pressing) {
          $j.CSS.addClass(this._DOMObj,"pressed");
          $j.CSS.addClass(this._textObj,"DownText");
        }
      }
    },
    //#endregion
    //#region Methods
    update: function CaptionControl_update() {
      if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
      this._textObj.innerHTML=this.caption;
      if (!this.wordWrap) this._textObj.style[$j.types.jsCSSProperties.WHITESPACE]="nowrap";
      else this._textObj.style[$j.types.jsCSSProperties.WHITESPACE]="normal";
    },
    click: function CustomButton_click(){
      var o;
      if(this.modalResult!==$j.types.modalResults.NONE){
        this.form._modalResult=this.modalResult;
        this.form.close();
      }
      this._inherited();
    },
    mouseDown: function CustomButton_mouseDown(){
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT){
        if (this.staysPressed) this.setPressing(true);
        else if (this.repeatClick&&this._repeatTimer===null) this._repeatTimer=setInterval(this.onTimer.bind(this), 200);
        if ($j.isDOMRenderer) {
          if (this instanceof $j.classes.ButtonGlyph) {
            $j.CSS.removeClass(this._textObj,"DownText");
            $j.CSS.addClass(this._textObj,"DownText");
            $j.CSS.removeClass(this.glyph,"DownText");
            $j.CSS.addClass(this.glyph,"DownText");
          } else {
            $j.CSS.removeClass(this._textObj,"DownText2");
            $j.CSS.addClass(this._textObj,"DownText2");
          }
        }
      }
    },
    mouseLeave: function CustomButton_mouseLeave(){
      this.resetTimer();
      this._inherited();
    },
    mouseUp: function CustomButton_mouseUp(){
      this.resetTimer();
      this._inherited();
      if (this.staysPressed) return;
      if (this instanceof $j.classes.ButtonGlyph) {
        $j.CSS.removeClass(this._textObj,"DownText");
        $j.CSS.removeClass(this.glyph,"DownText");
      } else $j.CSS.removeClass(this._textObj,"DownText2");
    },
    resetTimer: function CustomButton_resetTimer(){
      clearInterval(this._repeatTimer);
      this._repeatTimer=null;
    },
    assign: function CustomButton_assign(source){
      if(!(source instanceof $j.classes.CustomButton)) return;
      this.staysPressed=source.staysPressed;
      this._isPressed=source._isPressed;
      this.modalResult=source.modalResult;
      this.repeatClick=source.repeatClick;
    },
    onTimer: function CustomButton_onTimer(){
        if ($j.tools.Debugger.debug) console.log("timer");
      this.mouseDown();
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      if (!$j.tools.isNull(this._textObj)) this.caption=this._textObj.innerHTML;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-modalresult"):this._DOMObj.dataset.modalresult;
      if (!$j.tools.isNull(data)) this.modalResult=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-stayspressed"):this._DOMObj.dataset.stayspressed;
      if (!$j.tools.isNull(data)) this.staysPressed=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-repeatclick"):this._DOMObj.dataset.repeatclick;
      if (!$j.tools.isNull(data)) this.repeatClick=_conv.strToBool(data);
    },
    getChildsDOMObj:function() {
      this._inherited();
      this._textObj=this._DOMObj.firstElementChild;
      this._textObj.jsObj=this;
      this.caption=this._textObj.innerHTML;
    }
    //#endregion
  });
  //#endregion
  //#region Button final
  var Button=CustomButton.extend({
    _ClassName: "Button",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.canFocused=true;
        this.autoCapture=true;
      }
    },
    //#region Methods
    update: function Button_update() {
      var t=new Date().getTime();
      this._inherited();
      if (!$j.tools.isNull(this._textObj)) {
        this._textObj.innerHTML=this.caption;
        if (!this.wordWrap) this._textObj.style.whiteSpace="nowrap";
        else this._textObj.style.whiteSpace="normal";
      }
      if ($j.tools.Debugger.debug) console.log(arguments.callee.name+":"+(new Date().getTime()-t)+"ms");
    },
    dialogKey: function Button_dialogKey(k,s){
      var args=arguments;
      this._inherited();
      if(this.isDefault&&(k===$j.types.VKeysCodes.VK_RETURN)){
        this.click();
        $j.keyboard.keyCode=0;
      }
      if(this.cancel&&(args[0]===$j.types.VKeysCodes.VK_ESCAPE)){
        this.click();
        $j.keyboard.keyCode=0;
      }
    },
    assign: function Button_assign(source){
      if(!(source instanceof $j.classes.Button)) return;
      this.isDefault=source.isDefault;
      this.cancel=source.cancel;
    }
    //#endregion
  });
  //#endregion
  //#region ButtonGlyph final
  var ButtonGlyph=Button.extend({
    _ClassName: "ButtonGlyph",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._glyphPos=new $j.classes.Point;
        //#endregion
        this.layout=$j.types.buttonLayoutGlyphs.LEFT;
        this.glyphSize=32;
        this.glyphSpacing=4;
        this.glyphPadding=-1;
        this.glyphWrapMode=$j.types.pathWraps.ORIGINAL;
        if ($j.tools.isNull(this.glyphDOMElement)) this.glyphDOMElement=$j.types.HTMLElements.IMG;
        this.glyph=null;
      }
    },
    //#region Setter
    setLayout: function(newValue){
      if (!$j.tools.valueInSet(newValue,$j.types.buttonLayoutGlyphs)) return;
      if(this.layout!==newValue) {
        this.layout=newValue;
        if ($j.isDOMRenderer) {
          if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) this.update();
        }
      }
    },
    setGlyphSize: function(newValue){
      if (typeof newValue!==_const.NUMBER) return;
      if(this.glyphSize!==newValue) {
        this.glyphSize=newValue;
        if ($j.isDOMRenderer) {
          if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) this.update();
        }
      }
    },
    setGlyphSpacing: function(newValue){
      if (typeof newValue!==_const.NUMBER) return;
      if(this.glyphSpacing!==newValue) {
        this.glyphSpacing=newValue;
        if ($j.isDOMRenderer) {
          if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) this.update();
        }
      }
    },
    setGlyphPadding: function(newValue){
      if (typeof newValue!==_const.NUMBER) return;
      if(!newValue instanceof $j.classes.Rect) return;
      if(this.glyphPadding!==newValue) {
        this.glyphPadding=newValue;
        if ($j.isDOMRenderer) {
          if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) this.update();
        }
      }
    },
    setGlyphWrapMode: function(newValue){
      if (!$j.tools.valueInSet(newValue,$j.types.pathWraps)) return;
      if(this.glyphWrapMode!==newValue) {
        this.glyphWrapMode=newValue;
        if ($j.isDOMRenderer) {
          if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) this.update();
        }
      }
    },
    setWidth: function(newValue) {
      this._inherited(newValue);
      if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) this.update();
    },
    setHeight: function(newValue) {
      this._inherited(newValue);
      if ((!this._loading&&!this.form._loading)||$j.tools.Debugger.useFragment) this.update();
    },
    //#endregion
    //#region Methods
    calcButtonLayout: function(){
      var textPos=new $j.classes.Point,textSize=new $j.classes.Point,totalSize=new $j.classes.Point,clientSize,tw,th,
          client=this.clientRect(),spacing=this.glyphSpacing,margin=this.glyphPadding,textBounds=new $j.classes.Rect,glyphSize=this.glyphSize;
      if (this.glyph instanceof $j.classes.PathData) {
        if (this.glyph.empty) glyphSize=0;
      }
      if (this.glyphDOMElement===$j.types.HTMLElements.IMG) {
        if (this.src===String.empty) glyphSize=0;
      }
      // calculate the item sizes
      clientSize=new $j.classes.Point(client.width,client.height);
      if (this.caption.length>0){
        textBounds.setValues(0,0,client.width,0);
        if (!$j.isDOMRenderer) {
          this.ctx.prepareText(this,textBounds,true);
          textSize.setValues(textBounds.width+1,textBounds.height+1);
        } else {
          tw=parseInt(getComputedStyle(this._textObj).width,10);
          th=parseInt(getComputedStyle(this._textObj).height,10);
          if ($j.tools.isNull(this._textObj)||(tw===0&&th===0)) {
            var txtSizes=$j.tools.text.getTextSizes(this.caption,this._ClassName,this._textObj);
            textSize.setValues(txtSizes.w,txtSizes.h);
          } else textSize.setValues(tw,th);
        }
      } else {
        textBounds.setValues(0,0,0,0);
        textSize.setValues(0,0);
      }
      //If the layout has the glyph on the right or the left, then both the
      //text and the glyph are centered vertically.  If the glyph is on the top
      //or the bottom, then both the text and the glyph are centered horizontally.
      if ([$j.types.buttonLayoutGlyphs.LEFT,$j.types.buttonLayoutGlyphs.RIGHT].indexOf(this.layout)>-1){
        this._glyphPos.y=~~((clientSize.y-glyphSize+1)/2);
        textPos.y=~~((clientSize.y-textSize.y+1)/2);
      } else {
        this._glyphPos.x=~~((clientSize.x-glyphSize+1)/2);
        textPos.x=~~((clientSize.x-textSize.x+1)/2);
      }
      // if there is no text or no bitmap, then Spacing is irrelevant
      if ((textSize.x===0)||(glyphSize===0)) spacing=0;
      // adjust Margin and Spacing
      if (margin===-1){
        if (spacing<0){
          totalSize.setValues(glyphSize+textSize.x,glyphSize+textSize.y);
          if ([$j.types.buttonLayoutGlyphs.LEFT,$j.types.buttonLayoutGlyphs.RIGHT].indexOf(this.layout)>-1) margin=~~((clientSize.x-totalSize.x)/3);
          else margin=~~((clientSize.y-totalSize.y)/3);
          spacing=margin;
        } else {
          totalSize.setValues(glyphSize+spacing+textSize.x,glyphSize+spacing+textSize.y);
          if ([$j.types.buttonLayoutGlyphs.LEFT,$j.types.buttonLayoutGlyphs.RIGHT].indexOf(this.layout)>-1) margin=~~((clientSize.x-totalSize.x+1)/2);
          else margin=~~((clientSize.y-totalSize.y+1)/2);
        }
      } else {
        if (spacing<0){
          totalSize.setValues(clientSize.x-(margin+glyphSize),clientSize.y-(margin+glyphSize));
          if ([$j.types.buttonLayoutGlyphs.LEFT,$j.types.buttonLayoutGlyphs.RIGHT].indexOf(this.layout)>-1) spacing=~~((totalSize.x-textSize.x)/2);
          else spacing=~~((totalSize.y-textSize.y)/2);
        }
      }
      switch (this.layout){
        case $j.types.buttonLayoutGlyphs.LEFT:
          this._glyphPos.x=margin;
          textPos.x=this._glyphPos.x+glyphSize+spacing;
          break;
        case $j.types.buttonLayoutGlyphs.RIGHT:
          this._glyphPos.x=clientSize.x-margin-glyphSize;
          textPos.x=this._glyphPos.x-spacing-textSize.x;
          break;
        case $j.types.buttonLayoutGlyphs.TOP:
          this._glyphPos.y=margin;
          textPos.y=this._glyphPos.y+glyphSize+spacing;
          break;
        case $j.types.buttonLayoutGlyphs.BOTTOM:
          this._glyphPos.y=clientSize.y-margin-glyphSize;
          textPos.y=this._glyphPos.y-spacing-textSize.y;
          break;
      }
      // fixup the result variables
      with (this._glyphPos){
        x+=client.left;
        y+=client.top;
      }
      textBounds.offset(textPos.x+client.left,textPos.y+client.top);
      return textBounds;
    },
    update: function() {
      if ((this._loading||this.form._loading)&&!$j.tools.Debugger.useFragment) return;
      $j.classes.Button.prototype.update.apply(this,[]);
      if (!$j.tools.isNull(this._textObj)) {
        var txtB=this.calcButtonLayout();
        this._textObj.style.left=txtB.left+$j.types.CSSUnits.PX;
        this._textObj.style.top=txtB.top+$j.types.CSSUnits.PX;
        if (this.glyph instanceof $j.classes.PathData) {
          this.canvas.style.left=this._glyphPos.x+$j.types.CSSUnits.PX;
          this.canvas.style.top=this._glyphPos.y+$j.types.CSSUnits.PX;
          this.canvas.setAttribute("width",this.canvas.style.width=this.glyphSize+$j.types.CSSUnits.PX);
          this.canvas.setAttribute("height",this.canvas.style.height=this.glyphSize+$j.types.CSSUnits.PX);
          this.update();
          this.paint();
        } else {
          if (!$j.tools.isNull(this.glyph)) {
            this.glyph.style.left=this._glyphPos.x+$j.types.CSSUnits.PX;
            this.glyph.style.top=this._glyphPos.y+$j.types.CSSUnits.PX;
            this.glyph.style.width=this.glyphSize+$j.types.CSSUnits.PX;
            this.glyph.style.height=this.glyphSize+$j.types.CSSUnits.PX;
          }
        }
      }
    },
    getDOMObj: function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this.glyph=this._DOMObj.getElementsByTagName(this.glyphDOMElement)[0];
        if (!$j.tools.isNull(this.glyph)) this.glyph.jsObj=this;
      }
    }
    //#endregion
  });
  //#endregion
  //#region WindowButton final
  var WindowButton=Button.extend({
    _ClassName: "WindowButton",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.canFocused=false;
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region WindowCloseButton final
  var WindowCloseButton=WindowButton.extend({
    _ClassName: "WindowCloseButton",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.caption="C";
        this.modalResult=$j.types.modalResults.CANCEL;
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region WindowMinimizeButton final
  var WindowMinimizeButton=WindowButton.extend({
    _ClassName: "WindowMinimizeButton",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.caption=":";
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region WindowMaximizeButton final
  var WindowMaxRestoreButton=WindowButton.extend({
    _ClassName: "WindowMaxRestoreButton",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        //this._isRestore=false;
        //#endregion
        this.caption=";";
        this.onClick.addListener(this.form.maximize);
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region WindowHelpButton final
  var WindowHelpButton=WindowButton.extend({
    _ClassName: "WindowHelpButton",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.caption="9";
        this.onClick.addListener(this.form.showHelp);
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region WindowRollUpButton final
  var WindowRollUpDownButton=WindowButton.extend({
    _ClassName: "WindowRollUpDownButton",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._isUp=true;
        //#endregion
        this.caption=">";
        this.onClick.addListener(this.form.rollUp);
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region WindowStayOnButton final
  var WindowStayOnOffButton=WindowButton.extend({
    _ClassName: "WindowStayOnOffButton",
    init: function(owner,props){
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._isOn=true;
        //#endregion
        this.caption="@";
        this.onClick.addListener(this.form.stayOnTop);
      }
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region SpeedButton final
  var SpeedButton=ButtonGlyph.extend({
    _ClassName: "SpeedButton",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this.src=String.empty;
        this._inherited(owner,props);
        this.canFocused=false;
      }
    },
    //#region Methods
    setSrc: function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.src!==newValue) {
        this.src=newValue;
        if (this.glyph instanceof Image) {
          this.glyph.src=newValue;
          if (newValue===String.empty) {
            $j.CSS.addClass(this.glyph,"hidden");
          } else {
            $j.CSS.removeClass(this.glyph,"hidden");
          }
          if ((!this._loading&&!this.form._loading)||$j.tools.Sebugger.useFragment) this.update();
        }
      }
    }
    //#endregion
  });
  //#endregion
  $j.classes.register($j.types.categories.COMMON,Button,SpeedButton);
  $j.classes.register($j.types.categories.INTERNAL,CustomButton,ButtonGlyph,WindowButton,WindowCloseButton,WindowMinimizeButton,WindowMaxRestoreButton
                      ,WindowHelpButton,/*WindowRestoreButton,*/WindowRollUpDownButton/*,WindowRollDownButton*/,WindowStayOnOffButton/*,WindowStayOffButton*/);
  //#region Templates
  var ButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='Button' style='{style}' class='Button' data-theme='{theme}'>",
                 "<span>{caption}</span>",
                 "</div>"].join(String.empty),
      WindowCloseButton=["<div id='{internalId}' data-class='WindowCloseButton' class='WindowTitleButton WindowCloseButton' data-theme='{theme}'>",
                         "<span></span>",
                         "</div>"].join(String.empty),
      WindowMinimizeButton=["<div id='{internalId}' data-class='WindowMinimizeButton' class='WindowTitleButton WindowMinimizeButton' data-theme='{theme}' data-isrestore='false'>",
                            "<span></span>",
                            "</div>"].join(String.empty),
      WindowMaxRestoreButton=["<div id='{internalId}' data-class='WindowMaxRestoreButton' class='WindowTitleButton WindowMaxRestoreButton' data-theme='{theme}'>",
                              "<span></span>",
                              "</div>"].join(String.empty),
      WindowHelpButton=["<div id='{internalId}' data-class='WindowHelpButton' class='WindowTitleButton WindowHelpButton hidden' data-theme='{theme}'>",
                        "<span></span>",
                        "</div>"].join(String.empty),
      WindowRollUpDownButton=["<div id='{internalId}' data-class='WindowRollUpDownButton' class='WindowTitleButton WindowRollUpDownButton hidden' data-theme='{theme}' data-isup='true'>",
                              "<span></span>",
                              "</div>"].join(String.empty),
      WindowStayOnOffButton=["<div id='{internalId}' data-class='WindowStayOnOffButton' class='WindowTitleButton WindowStayOnOffButton hidden' data-theme='{theme}' data-ison='true'>",
                             "<span></span>",
                             "</div>"].join(String.empty),
      SpeedButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='SpeedButton' style='{style}' class='SpeedButton' data-theme='{theme}'>",
                      "<span>{caption}</span>",
                      "<img class='hidden' alt='' src='>",
                      "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:Button,template:ButtonTpl},{Class:SpeedButton,template:SpeedButtonTpl}]);
  //endregion
})();