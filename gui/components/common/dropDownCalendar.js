(function(){
  //#region CalendarPopup
  var CalendarPopup=$j.classes.Calendar.extend({
    _ClassName:"CalendarPopup",
    //#region Method
    selectDay:function(mouseEventArgs) {
      var obj=this.jsObj;
      this._inherited(mouseEventArgs);
      obj._dropDownCalendar.setDate(obj.curDate);
      obj.form.destroyPopups();
    }
    //#endregion
  });
  //#endregion
  //#region DropDownCalendarPopup
  var DropDownCalendarPopup=$j.classes.PopupBox.extend({
    _ClassName:"DropDownCalendarPopup",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._calendar=$j.classes.createComponent($j.classes.CalendarPopup,this);
        this._calendar._dropDownCalendar=owner;
        //#endregion
        this.setClosePopups(false);
      }
    },
    //#region Method
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{calendar}"),tpl;
      tpl=this._calendar.getTemplate();
      a.insert(a.length-1,tpl);
      html=a.join(String.empty);
      a=html.split("{date}");
      a.insert(a.length-1,this._calendar._dropDownCalendar.date._toString());
      html=a.join(String.empty);
      return html;
    },
    show:function(x,y) {
      this._inherited(x,y);
      if ($j.tools.isNull(this._calendar._DOMObj)) {
        this._calendar.getDOMObj(this._calendar._internalId);
        this._calendar.updateFromDOM();
      }

    },
    destroy:function() {
      if (!this.onlyHide) {
        this._inherited();
        this._calendar=null;
      } else $j.CSS.addClass(this._DOMObj,"hidden");
      this._control.opened=false;
      if ($j.browser.ie) this._control._DOMObj.setAttribute("data-opened",false);
      else this._control._DOMObj.dataset.opened=false;
      $j.CSS.removeClass(this._DOMObj,"animated");
      $j.CSS.removeClass(this._DOMObj,"fadeIn");
    },
    getChildsDOMObj: function() {
      this._calendar.getDOMObj(this._DOMObj.firstElementChild.id);
      this._calendar.getChildsDOMObj();
      this._calendar.update();
    }
    //#endregion
  });
  Object.seal(DropDownCalendarPopup);
  //#endregion
  //#region DropDownCalendar
  var DropDownCalendar=$j.classes.ThemedControl.extend({
    _ClassName:"DropDownCalendar",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._content=null;
        //#endregion
        this.opened=false;
        //this.editable=false;
        this.date=new Date();
        this.text=String.empty;
        this.canFocused=true;
        this.autoCapture=true;
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
    setDate:function(newValue) {
      if (!(newValue instanceof Date)) return;
      if (!this.date.equals(newValue)) {
        this.date=new Date(newValue);
        this.setText(this.date.toString($j.tools.getCulture().date.formatPatterns.shortDate));
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      this._content=this._DOMObj.firstElementChild;
      this._content.jsObj=this;
    },
    updateFromDOM:function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-text"):this._DOMObj.dataset.text;
      if (!$j.tools.isNull(data)) this.text=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-date"):this._DOMObj.dataset.date;
      if (!$j.tools.isNull(data)) this.setDate(new Date(data));
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
        this._dropDownPopup=$j.classes.createComponent($j.classes.DropDownCalendarPopup,this,null,{"parentDOM":$j.doc.body});
        this._dropDownPopup._control=this;
        this._dropDownPopup.onlyHide=true;
        this._dropDownPopup._calendar.curDate=new Date(this.date);
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
  Object.seal(DropDownCalendar);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,CalendarPopup,DropDownCalendarPopup);
  $j.classes.register($j.types.categories.COMMON,DropDownCalendar);
  //#region Templates
  var DropDownCalendarTpl=["<div id='{internalId}' data-name='{name}' data-class='DropDownCalendar' class='DropDownCalendar' data-theme='{theme}' style='{style}'>",
                       "<div class='DropDownCalendarText' data-theme='{theme}'></div>",
                       "<span>(</span>",
                       "</div>"].join(String.empty),
      DropDownCalendarPopupTpl=["<div id='{internalId}' class='PopupBox PopupCalendar csr_default' data-theme='{theme}' style='{style}'>",
                                "{calendar}",
                                "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:DropDownCalendar,template:DropDownCalendarTpl},{Class:DropDownCalendarPopup,template:DropDownCalendarPopupTpl},{Class:CalendarPopup,template:$j.templates["Calendar"]}]);
  //#endregion
})();