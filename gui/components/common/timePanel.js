(function(){
  //#region TimePanel
  var TimePanel=$j.classes.ThemedControl.extend({
    _ClassName:"TimePanel",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._hours=$j.classes.createComponent($j.classes.NumberWheel,this,null,null,false);
        this._hours.max=23;
        this._hours.onChange.addListener(this.change);
        this._minutes=$j.classes.createComponent($j.classes.NumberWheel,this,null,null,false);
        this._minutes.max=59;
        this._minutes.onChange.addListener(this.change);
        this._seconds=$j.classes.createComponent($j.classes.NumberWheel,this,null,null,false);
        this._seconds.max=59;
        this._seconds.onChange.addListener(this.change);
        this._meridiem=$j.classes.createComponent($j.classes.ItemsWheel,this,null,null,false);
        this._meridiem.items.push("AM");
        this._meridiem.items.push("PM");
        this._meridiem.onChange.addListener(this.change);
        //#endregion
        this.time=String.empty;
        this.use24H=true;
        this.viewSeconds=false;
        this.onChange=new $j.classes.NotifyEvent(this);
      }
    },
    //#region Setters
    setTime:function(newValue) {
      var timeParts;
      if (typeof newValue!==_const.STRING) return;
      if (this.time!==newValue) {
        this.time=newValue;
        timeParts=this.time.split(String.SPACE);
        if (timeParts.length>1) this._meridiem.setValue(timeParts.last());
        timeParts=timeParts[0].split(":");
        this._hours.setValue(timeParts[0]);
        this._minutes.setValue(timeParts[1]);
        if (timeParts.length>2) this._seconds.setValue(timeParts[2]);
      }
    },
    setUse24H:function(newValue) {
      var max=24,str;
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.use24H!==newValue) {
        this.use24H=newValue;
        if (!this.use24H) max=12;
        this._hours.items.clear();
        this._hours.setMax(max);
        this.update();
      }
    },
    setViewSeconds:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this._viewSeconds!==newValue) {
        this._viewSeconds=newValue;
        this.update();
      }
    },
    //#endregion
    //#region Methods
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{hours}"),tpl;
      tpl=this._hours.getTemplate();
      a.insert(a.length-1,tpl);
      html=a.join(String.empty);
      a=html.split("{minutes}");
      tpl=this._minutes.getTemplate();
      a.insert(a.length-1,tpl);
      html=a.join(String.empty);
      a=html.split("{seconds}");
      tpl=this._seconds.getTemplate();
      a.insert(a.length-1,tpl);
      html=a.join(String.empty);
      a=html.split("{meridiem}");
      tpl=this._meridiem.getTemplate();
      a.insert(a.length-1,tpl);
      html=a.join(String.empty);
      return html;
    },
    getChildsDOMObj:function() {
      var min,sec,mer;
      this._hours.getDOMObj(this._DOMObj.firstElementChild.id);
      $j.CSS.addClass(this._hours._DOMObj,"TimePanel_Hours");
      min=this._hours._DOMObj.nextSibling;
      while (min.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
        min=min.nextSibling;
      }
      this._minutes.getDOMObj(min.id);
      $j.CSS.addClass(this._minutes._DOMObj,"TimePanel_Minutes");
      sec=min.nextSibling;
      while (sec.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
        sec=sec.nextSibling;
      }
      this._seconds.getDOMObj(sec.id);
      $j.CSS.addClass(this._seconds._DOMObj,"TimePanel_Seconds");
      mer=this._DOMObj.lastElementChild;
      this._meridiem.getDOMObj(mer.id);
      $j.CSS.addClass(this._meridiem._DOMObj,"TimePanel_Meridiem");
    },
    updateFromDOM:function() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-use24h"):this._DOMObj.dataset.use24h;
      if (!$j.tools.isNull(data)) this.use24H=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-viewseconds"):this._DOMObj.dataset.viewseconds;
      if (!$j.tools.isNull(data)) this.viewSeconds=_conv.strToBool();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-time"):this._DOMObj.dataset.time;
      if (!$j.tools.isNull(data)) this.time=data;
      this._inherited();
    },
    update:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        if ($j.browser.ie) {
          this._DOMObj.setAttribute("data-use24h",this.use24H);
          this._DOMObj.setAttribute("data-viewseconds",this.viewSeconds);
        } else {
          this._DOMObj.dataset.use24h=this.use24H;
          this._DOMObj.dataset.viewseconds=this.viewSeconds;
        }
      }
    },
    change:function() {
      var hr,mi,se,me,val;
      hr=this._owner._hours.value;
      mi=this._owner._minutes.value;
      se=this._owner._seconds.value;
      me=this._owner._meridiem.value;
      val=hr+":"+mi;
      if (this._owner.viewSeconds) val+=":"+se;
      if (!this._owner.use24H) val+=String.SPACE+me;
      this._owner.time=val;
      if (!this._owner._updating) this._owner.onChange.invoke();
    },
    loaded:function() {
      var oldVal=this.time;
      this._inherited();
      if (this.time!==String.empty) {
        this.time=String.empty;
        this.setTime(oldVal);
      }
    }
    //#endregion
  });
  $j.classes.register($j.types.categories.COMMON,TimePanel);
  //#endregion
  //#region Templates
  var TimePanelTpl=["<div id='{internalId}' data-name='{name}' data-class='TimePanel' class='TimePanel' data-theme='{theme}' data-use24h='false' data-viewseconds='false' data-time='00:00 AM'>",
                    "{hours}",
                    "{minutes}",
                    "{seconds}",
                    "{meridiem}",
                    "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:TimePanel,template:TimePanelTpl}]);
  //#endregion
})();