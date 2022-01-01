(function(){
  //#region Memo
  var Memo=$j.classes.CustomTextControl.extend({
    _ClassName:"Memo",
    init:function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._HScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._VScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._viewPort=null;
        this._HScrollBar.onChange.addListener(this.HScroll);
        this._VScrollBar.onChange.addListener(this.VScroll);
        this._HScrollBar.smallChange=~~(this._HScrollBar._viewportSize/5);
        this._VScrollBar.smallChange=~~(this._VScrollBar._viewportSize/5);
        //#endregion
        this.width=185;
        this.height=89;
        this.hitTest.mouseWheel=true;
      }
    },
    textChanged: function CustomTextControl_textChanged() {
      this.jsObj.text=this.value;
    },
    updateScrollBars:function() {
      var ta=this,memo=this.jsObj,scrollbars=$j.types.scrollbars.NONE,taw=ta.offsetWidth,tah=ta.offsetHeight;
      if (ta.scrollWidth>taw) scrollbars=$j.types.scrollbars.HORIZONTAL;
      if (ta.scrollHeight>tah) {
        if (scrollbars===$j.types.scrollbars.HORIZONTAL) scrollbars=$j.types.scrollbars.BOTH;
        else scrollbars=$j.types.scrollbars.VERTICAL;
      }
      if ($j.browser.ie) memo._DOMObj.setAttribute("data-scrollbars",scrollbars);
      else memo._DOMObj.dataset.scrollbars=scrollbars;
      if (scrollbars===$j.types.scrollbars.HORIZONTAL||scrollbars===$j.types.scrollbars.BOTH) {
        memo._HScrollBar.setMax(ta.scrollWidth);
        memo._HScrollBar.setViewportSize(taw);
        memo._HScrollBar.setValue(ta.scrollLeft);
      }
      if (scrollbars===$j.types.scrollbars.VERTICAL || scrollbars===$j.types.scrollbars.BOTH) {
        memo._VScrollBar.setMax(ta.scrollHeight);
        memo._VScrollBar.setViewportSize(tah);
        memo._VScrollBar.setValue(ta.scrollTop);
      }
      ta.style[$j.types.jsCSSProperties.WIDTH]=(ta.parentNode.offsetWidth-4)+$j.types.CSSUnits.PX;
      ta.style[$j.types.jsCSSProperties.HEIGHT]=(ta.parentNode.offsetHeight-4)+$j.types.CSSUnits.PX;
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      this.maxLength=parseInt(this._DOMObj.getAttribute("maxlength"),10)|0;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-readonly"):this._DOMObj.dataset.readonly;
      if (!$j.tools.isNull(data)) this.readOnly=_conv.strToBool(data);
      this.placeHolder=this._DOMObj.getAttribute("placeholder");
      if ($j.tools.isNull(this.placeHolder)) this.placeHolder=String.empty;
      this.app.getLocalText(this);
    },
    getChildsDOMObj:function() {
      this._VScrollBar.getDOMObj(this._DOMObj.lastElementChild.id);
      this._VScrollBar.getChildsDOMObj();
      this._HScrollBar._DOMObj=this._VScrollBar._DOMObj.previousSibling;
      while (this._HScrollBar._DOMObj.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
        this._HScrollBar._DOMObj=this._HScrollBar._DOMObj.previousSibling;
      }
      this._HScrollBar.getDOMObj(this._HScrollBar._DOMObj.id);
      this._HScrollBar.getChildsDOMObj();
      this._viewPort=this._DOMObj.firstElementChild;
      this._viewPort.jsObj=this;
      this._inputObj=this._viewPort.firstElementChild;
      this._inputObj.jsObj=this;
      this._HScrollBar.updateFromDOM();
      this._VScrollBar.updateFromDOM();
      $j.tools.events.bind(this._inputObj,$j.types.HTMLEvents.CHANGE,this.textChanged);
      $j.tools.events.bind(this._inputObj,$j.types.HTMLEvents.FOCUS,this.DOMFocus);
      $j.tools.events.bind(this._inputObj,$j.types.HTMLEvents.BLUR,this.DOMBlur);
      $j.tools.events.bind(this._inputObj,$j.types.keybordEvents.UP,this.updateScrollBars);
      $j.tools.events.bind(this._inputObj,$j.types.keybordEvents.PRESS,this.updateScrollBars);
      $j.tools.events.bind(this._inputObj,$j.types.keybordEvents.DOWN,this.updateScrollBars);
    },
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
    HScroll:function() {
      var memo=this._owner;
      if (this.value<=2) this.value=0;
      memo._inputObj.scrollLeft=this.value;
      if (this.value===0) memo._viewPort.scrollLeft=0;
      if (this.value===memo._inputObj.scrollWidth-memo._inputObj.clientWidth) memo._viewPort.scrollLeft=4;
    },
    VScroll:function() {
      var memo=this._owner;
      if (this.value<=2) this.value=0;
      memo._inputObj.scrollTop=this.value;
      if (this.value===0) memo._viewPort.scrollTop=0;
      if (this.value===this.max) memo._viewPort.scrollTop=4;
    },
    mouseWheel:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) {
        this._VScrollBar.mouseWheel();
      } else if (data===$j.types.scrollbars.HORIZONTAL) {
        this._HScrollBar.mouseWheel();
      }
    },
    DOMFocus:function() {
      this.jsObj.enterFocus();
    },
    DOMBlur:function() {
      this.jsObj.killFocus();
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  $j.classes.register($j.types.categories.COMMON,Memo);
  //#region Templates
  var MemoTpl=["<div id='{internalId}' data-name='{name}' data-class='Memo' class='Memo' data-theme='{theme}' style='{style}' data-scrollbars='none'>",
               "<div class='MemoViewPort' data-theme='{theme}'>",
               "<textarea class='csr_text' data-theme='{theme}'>{text}</textarea>",
               "</div>",
               "{horizontalScrollBar}",
               "{verticalScrollBar}",
               "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:Memo,template:MemoTpl}]);
  //#endregion
})();