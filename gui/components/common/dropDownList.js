(function(){
  //#region ListBoxItemPopup
  var ListBoxItemPopup=$j.classes.ListBoxItem.extend({
    _ClassName:"ListBoxItemPopup",
    init:function(owner,text) {
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,text);
        //#region Private
        this._forceMouseWheel=true;
        //#endregion
      }
    },
    //#region Methods
    mouseLeave:function() {
      $j.CSS.removeClass(this._dom,"RowSelected");
    },
    mouseEnter:function() {
      if (this._owner.itemIndex>-1) {
        $j.CSS.removeClass(this._owner.items[this._owner.itemIndex]._dom,"RowSelected");
        this._owner.items[this._owner.itemIndex].selected=false;
        this._owner.itemIndex=-1;
      }
    }
    //#endregion
  });
  //#endregion
  //#region ListBoxPopup
  var ListBoxPopup=$j.classes.ListBox.extend({
    _ClassName:"ListBoxPopup",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._forceMouseWheel=true;
        //#endregion
        this.canFocused=false;
        this._VScrollBar.smallChange=this.itemsHeight;
      }
    },
    //#region Method
    refreshInnerHeight:function() {
      for (var i=0,l=this.items.length;i<l;i++) {
        this.items[i].destroy();
        this.items[i]._owner=this;
        this.items[i].isChecked=false;
        this.items[i].selected=false;
      }
      this._inherited();
    },
    selectItem:function() {
      var jsObj=this.jsObj;
      this._inherited();
      jsObj._owner._dropDownListBox.setText(jsObj.text);
      jsObj._owner.itemIndex=jsObj.getIndex();
      jsObj._owner._dropDownListBox.itemIndex=jsObj._owner.itemIndex;
      jsObj._owner._dropDownListBox.destroyPopup();
      if (!jsObj._owner._owner._owner._updating) jsObj._owner._owner._owner.onChange.invoke();
    },
    clientOrigin:function() {
      var pt=new $j.classes.Point;
      pt.setValues(this._owner.left,this._owner.top);
      pt.x+=this.left+this._VScrollBar.left;
      pt.y+=this.top+this._VScrollBar.top;
      return pt;
    },
    loaded:function() {
      this._inherited();
      this._VScrollBar._forceMouseWheel=true;
      this._HScrollBar._forceMouseWheel=true;
    }
    //#endregion
  });
  Object.seal(ListBoxPopup);
  //#endregion
  //#region DropDownListBoxPopup
  var DropDownListBoxPopup=$j.classes.PopupBox.extend({
    _ClassName:"DropDownListBoxPopup",
    init:function(owner,props) {
      var lbHeight,lbWidth,lbItemsHeight;
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._listBox=null;
        this._lbHeight=null;
        this._lbWidth=null;
        this._lbItemsHeight=null;
        this._dropDownListBox=owner;
        //#endregion
        if (!$j.tools.isNull(props)) {
          this._lbHeight=props.height;
          this._lbWidth=props.width;
          this._lbItemsHeight=props.itemsHeight;
          props=null;
        }
        this._listBox=$j.classes.createComponent(owner._listBoxClass,this,null,{"width":this._lbWidth,"height":this._lbHeight,"itemsHeight":this._lbItemsHeight});
        this._listBox._dropDownListBox=this._dropDownListBox;
        this.setClosePopups(false);
      }
    },
    //#region Method
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{listBox}"),tpl;
      if (a.length>1) {
        Array.prototype.push.apply(this._listBox.items,this._listBox._dropDownListBox.items);
        tpl=this._listBox.getTemplate();
        a.insert(a.length-1,tpl);
        html=a.join(String.empty);
      }
      return html;
    },
    show:function(x,y) {
      if ($j.tools.isNull(this._listBox)) {
        this._listBox=$j.classes.createComponent(this._dropDownListBox._listBoxClass,this,null,{"width":this._lbWidth,"height":this._lbHeight,"itemsHeight":this._lbItemsHeight});
        this._listBox._dropDownListBox=this.owner;
      }
      if ($j.tools.isNull(this._listBox.form)) this._listBox.form=this._control.form;
      if ($j.tools.isNull(this._listBox.app)) this._listBox.app=this._control.app;
      this._inherited(x,y);
      this._listBox._VScrollBar.setValue(this._owner._lastScrollTop);
      this._listBox.itemIndex=this._owner.itemIndex;
      if (this._listBox.itemIndex>-1) $j.CSS.addClass(this._listBox.items[this._listBox.itemIndex]._dom,"RowSelected");
    },
    destroy:function() {
      if ($j.tools.isNull(this._listBox)) return;
      this._owner._lastScrollTop=this._listBox._VScrollBar.value;
      this._inherited();
      this._listBox.destroy();
      this._listBox=null;
      this._control.opened=false;
      if ($j.browser.ie) this._control._DOMObj.setAttribute("data-opened",false);
      else this._control._DOMObj.dataset.opened=false;
      $j.CSS.removeClass(this._DOMObj,"animated");
      $j.CSS.removeClass(this._DOMObj,"fadeIn");
    },
    getChildsDOMObj: function() {
      this._listBox.getDOMObj(this._DOMObj.firstElementChild.id);
      this._listBox.getChildsDOMObj();
      this._listBox.refreshInnerHeight();
    }
    //#endregion
  });
  Object.seal(DropDownListBoxPopup);
  //#endregion
  //#region DropDownListBox
  var DropDownListBox=$j.classes.ThemedControl.extend({
    _ClassName:"DropDownListBox",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._dropDownPopup=null;
        this._content=null;
        this._input=null;
        this._listBoxClass=$j.classes.ListBoxPopup;
        this._lastScrollTop=0;
        //#endregion
        this.opened=false;
        this.editable=false;
        this.text=String.empty;
        this.items=[];
        this.dropDownCount=8;
        this.autoComplete=false;
        this.autoCompleteDelay=500;
        this.charCase=$j.types.charCases.NORMAL;
        this.itemIndex=-1;
        this.maxLength=0;
        this.itemsHeight=13;
        this.canFocused=true;
        this.autoCapture=true;
        this.setHitTest([true,false,true]);
        this.onChange=new $j.classes.NotifyEvent(this);
      }
    },
    //#region Setters
    setText:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.text!==newValue) {
        this.text=newValue;
        this.update();
      }
    },
    setEditable:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.editable!==newValue) {
        this.editable=newValue;
        this.update();
      }
    },
    setOpened:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.opened!==newValue) {
        this.opened=newValue;
        this.update();
        if (this.opened) this.showPopup();
        else this.form.destroyPopups();
      }
    },
    setDropDownCount:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<8) newValue=8;
      if (this.dropDownCount!==newValue) this.dropDownCount=newValue;
    },
    setAutoComplete:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.autoComplete!==newValue) this.autoComplete=newValue;
    },
    setAutoCompleteDelay:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.autoCompleteDelay!==newValue) this.autoCompleteDelay=newValue;
    },
    setCharCase:function(newValue) {
      if (!($j.tools.valueInSet(newValue,$j.types.charCases))) return;
      if (this.charCase!==newValue) {
        this.charCase=newValue;
        this.update();
      }
    },
    setItemIndex:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.itemIndex!==newValue) {
        if (newValue<0) newValue=0;
        if (newValue>this.items.length) newValue=this.items.length-1;
        this.itemIndex=newValue;
        if (newValue>-1) this.setText(this.items[newValue].text);
      }
    },
    setMaxLength:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0) newValue=0;
      if (this.maxLength!==newValue) {
        this.maxLength=newValue;
        this.update();
      }
    },
    setItemsHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<13) newValue=13;
      if (this.itemsHeight!==newValue) this.itemsHeight=newValue;
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      var lastStart=0,item,items=[];
      this._content=this._DOMObj.firstElementChild;
      this._content.jsObj=this;
      this._input=this._content.firstElementChild;
      this._input.jsObj=this;
      $j.tools.events.bind(this._input,$j.types.mouseEvents.DOWN,this.mouseDown);
      // on va chercher les items dans le CDATA
      var cdata=this._content.nextSibling;
      if (!$j.tools.isNull(cdata)) {
        while (cdata.nodeType!==$j.types.xmlNodeTypes.COMMENT_NODE) {
          cdata=cdata.nextSibling;
          if ($j.tools.isNull(cdata)) break;
        }
      }
      if (!$j.tools.isNull(cdata)) {
        if (cdata.nodeValue!==String.empty&&!$j.tools.isNull(cdata.nodeValue)) items=JSON.parse(cdata.nodeValue);
      }
      for (var i=0,l=items.length;i<l;i++) {
        item=$j.classes.createComponent($j.classes.ListBoxItemPopup,this,null,null,false);
        if (!$j.tools.isNull(items[i].height)) item.height=items[i].height;
        if (!$j.tools.isNull(items[i].isChecked)) item.isChecked=items[i].isChecked;
        if (!$j.tools.isNull(items[i].isHeader)) item.isHeader=items[i].isHeader;
        if (!$j.tools.isNull(items[i].enabled)) item.enabled=items[i].enabled;
        if (!$j.tools.isNull(items[i].css)) item.css=items[i].css;
        item.top=lastStart;
        if (!$j.tools.isNull(items[i].text)) item.text=items[i].text;
        this.items.push(item);
        lastStart+=item.height;
      }
    },
    _mouseDown:function(mouseEventArg) {
      if (this.jsObj.editable) $j.mouse.stopEvent(mouseEventArg);
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-editable"):this._DOMObj.dataset.editable;
      if (!$j.tools.isNull(data)) this.editable=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-autocomplete"):this._DOMObj.dataset.autocomplete;
      if (!$j.tools.isNull(data)) this.autoComplete=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-dropdowncount"):this._DOMObj.dataset.dropdowncount;
      if (!$j.tools.isNull(data)) this.dropDownCount=~~(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-autocompletedelay"):this._DOMObj.dataset.autocompletedelay;
      if (!$j.tools.isNull(data)) this.autoCompleteDelay=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-charcase"):this._DOMObj.dataset.charcase;
      if (!$j.tools.isNull(data)) this.charCase=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-maxlength"):this._DOMObj.dataset.maxlength;
      if (!$j.tools.isNull(data)) this.maxLength=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-text"):this._DOMObj.dataset.text;
      if (!$j.tools.isNull(data)) this.text=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemindex"):this._DOMObj.dataset.itemindex;
      if (!$j.tools.isNull(data)) this.setItemIndex(~~data);
      this.bindEventFromDOM("onChange");
    },
    update:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        if ($j.browser.ie) {
          this._DOMObj.setAttribute("data-opened",this.opened);
          this._DOMObj.setAttribute("data-editable",this.editable);
        } else {
          this._DOMObj.dataset.opened=this.opened;
          this._DOMObj.dataset.editable=this.editable;
        }
      }
      if (!$j.tools.isNull(this._input)) {
        this._input.value=this.text;
        if (this.maxLength>0) this._input.setAttribute("maxLength",this.maxLength);
      }
    },
    mouseDown: function(){
      if (!$j.tools.isNull(this.jsObj)) return;
      var lastOpened=this.opened;
      if (this===this.form._focusedControl) {
        if (lastOpened) this._closePopups=false;
      }
      this._inherited();
      this._closePopups=true;
      this.setOpened(!this.opened);
    },
    showPopup:function() {
      var pt=this.clientToDocument(),lbHeight;
      if ($j.tools.isNull(this._dropDownPopup)) {
        lbHeight=this.itemsHeight*this.dropDownCount;
        this._dropDownPopup=$j.classes.createComponent($j.classes.DropDownListBoxPopup,this,null,{"parentDOM":$j.doc.body,"width":this.width,"height":lbHeight,"itemsHeight":this.itemsHeight});
        this._dropDownPopup._control=this;
      }
      this._dropDownPopup.setVisible(true);
      this._dropDownPopup.show(pt.x,pt.y+this._DOMObj.offsetHeight);
      $j.CSS.addClass(this._dropDownPopup._DOMObj,"animated fadeIn");
    },
    destroyPopup:function() {
      if (!$j.tools.isNull(this._dropDownPopup)) {
        this._dropDownPopup.destroy();
        this._dropDownPopup=null;
      }
      //this.form.destroyPopups();
    },
    findItemFromText:function(text) {
      var items=this.items.filter(function(e,i,a) {
        return (e.text===text);
      });
      if (items.length>0) return items.first().getIndex();
      else return -1;
    }
    //#endregion
  });
  Object.seal(DropDownListBox);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,DropDownListBoxPopup,ListBoxPopup,ListBoxItemPopup);
  $j.classes.register($j.types.categories.COMMON,DropDownListBox);
  //#region Templates
  var DropDownListBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='DropDownListBox' class='DropDownListBox' data-theme='{theme}' style='{style}'>",
                       "<div class='DropDownListContent' data-theme='{theme}'>",
                       "<input type='text' class='csr_default' data-theme='{theme}' />",
                       "</div>",
                       "<span>(</span>",
                       "</div>"].join(String.empty),
      DropDownListBoxPopupTpl=["<div id='{internalId}' class='PopupBox PopupListBox csr_default' data-theme='{theme}' style='{style}'>",
                        "{listBox}",
                        "</div>"].join(String.empty),
      ListBoxItemPopupTpl=["<div class='ListBoxItemPopup VListBoxItem' data-theme='{theme}' data-idx='{idx}' data-size='{size}' data-isheader='{isheader}' data-ischecked='{ischecked}' data-enabled='{enabled}' style='{style}'>{caption}</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:DropDownListBox,template:DropDownListBoxTpl},{Class:DropDownListBoxPopup,template:DropDownListBoxPopupTpl},{Class:ListBoxItemPopup,template:ListBoxItemPopupTpl},
                                {Class:ListBoxPopup,template:$j.templates["ListBox"]}]);
  //#endregion
})();