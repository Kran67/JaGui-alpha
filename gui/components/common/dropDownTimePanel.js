(function(){
  //#region TimePanelPopup
  var TimePanelPopup=$j.classes.TimePanel.extend({
    _ClassName:"TimePanelPopup",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        this._forceMouseWheel=true;
      }
    },
    loaded:function() {
      this._inherited();
      this._hours._forceMouseWheel=true;
      this._minutes._forceMouseWheel=true;
      this._seconds._forceMouseWheel=true;
      this._meridiem._forceMouseWheel=true;
    }
  });
  //#endregion
  //#region DropDownTimePanelPopup
  var DropDownTimePanelPopup=$j.classes.PopupBox.extend({
    _ClassName:"DropDownTimePanelPopup",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        this._timePanel=$j.classes.createComponent($j.classes.TimePanelPopup,this);
        this._timePanel._dropDownPopup=owner;
        this._timePanel.onChange.addListener(this.change);
        this.setClosePopups(false);
      }
    },
    //#region Method
    change:function() {
      this._dropDownPopup.setText(this.time);
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{timePanel}"),tpl;
      if (a.length>1) {
        tpl=this._timePanel.getTemplate();
        a.insert(a.length-1,tpl);
        html=a.join(String.empty);
      }
      return html;
    },
    show:function(x,y) {
      this._inherited(x,y);
      if ($j.tools.isNull(this._timePanel._DOMObj)) {
        this._timePanel.getDOMObj(this._timePanel._internalId);
        this._timePanel.updateFromDOM();
      }
      this._timePanel.setUse24H(this._owner.use24H);
      this._timePanel.setViewSeconds(this._owner.viewSeconds);
      this._timePanel.setTime(this._owner.text);
    },
    destroy:function() {
      if (!this.onlyHide) {
        this._inherited();
        this._timePanel=null;
      } else $j.CSS.addClass(this._DOMObj,"hidden");
      this._control.opened=false;
      if ($j.browser.ie) this._control._DOMObj.setAttribute("data-opened",false);
      else this._control._DOMObj.dataset.opened=false;
      $j.CSS.removeClass(this._DOMObj,"animated");
      $j.CSS.removeClass(this._DOMObj,"fadeIn");
    },
    getChildsDOMObj: function() {
      this._timePanel.getDOMObj(this._DOMObj.firstElementChild.id);
      this._timePanel.getChildsDOMObj();
    }
    //#endregion
  });
  Object.seal(DropDownTimePanelPopup);
  //#endregion
  //#region DropDownTimePanel
  var DropDownTimePanel=$j.classes.ThemedControl.extend({
    _ClassName:"DropDownTimePanel",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._dropDownPopup=null;
        this._content=null;
        //#endregion
        this.opened=false;
        this.text=String.empty;
        this.canFocused=true;
        this.autoCapture=true;
        this.use24H=false;
        this.viewSeconds=false;
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
    setOpened:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.opened!==newValue) {
        this.opened=newValue;
        this.update();
        if (this.opened) this.showPopup();
        else this.form.destroyPopups();
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      this._content=this._DOMObj.firstElementChild;
      this._content.jsObj=this;
    },
    updateFromDOM:function() {
      var data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-text"):this._DOMObj.dataset.text;
      if (!$j.tools.isNull(data)) this.text=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-use24h"):this._DOMObj.dataset.use24h;
      if (!$j.tools.isNull(data)) this.use24H=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-viewseconds"):this._DOMObj.dataset.viewseconds;
      if (!$j.tools.isNull(data)) this.viewSeconds=_conv.strToBool(data);
      this._inherited();
    },
    update:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        if ($j.browser.ie) this._DOMObj.setAttribute("data-opened",this.opened);
        else this._DOMObj.dataset.opened=this.opened;
      }
      if (!$j.tools.isNull(this._content)) this._content.innerHTML=this.text;
    },
    mouseDown: function(){
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
        this._dropDownPopup=$j.classes.createComponent($j.classes.DropDownTimePanelPopup,this,null,{"parentDOM":$j.doc.body});
        this._dropDownPopup._control=this;
        this._dropDownPopup.onlyHide=true;
      }
      $j.CSS.removeClass(this._dropDownPopup._DOMObj,"hidden");
      this._dropDownPopup.show(pt.x,pt.y+this._DOMObj.offsetHeight);
      $j.CSS.addClass(this._dropDownPopup._DOMObj,"animated fadeIn");
    },
    destroyPopup:function() {
      this._dropDownPopup.destroy();
    }
    //#endregion
  });
  Object.seal(DropDownTimePanel);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,TimePanelPopup,DropDownTimePanelPopup);
  $j.classes.register($j.types.categories.COMMON,DropDownTimePanel);
  //#region Templates
  var DropDownTimePanelTpl=["<div id='{internalId}' data-name='{name}' data-class='DropDownTimePanel' class='DropDownTimePanel' data-theme='{theme}' style='{style}'>",
                            "<div class='DropDownTimePanelText' data-theme='{theme}'></div>",
                            "<span>(</span>",
                            "</div>"].join(String.empty),
      DropDownTimePanelPopupTpl=["<div id='{internalId}' class='PopupBox PopupTimePanel' data-theme='{theme}' style='{style}'>",
                                 "{timePanel}",
                                 "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:DropDownTimePanel,template:DropDownTimePanelTpl},{Class:DropDownTimePanelPopup,template:DropDownTimePanelPopupTpl},{Class:TimePanelPopup,template:$j.templates["TimePanel"]}]);
  //#endregion
})();