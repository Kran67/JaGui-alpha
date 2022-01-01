(function() {
  //#region Bindable
  $j.classes.Bindable=Class.extend({
    _ClassName: "Bindable",
    init: function Bindable_init() {
      //#region Private
      this._dataBindings=[];
      //#endregion
      //$j.tools.Debugger.log(arguments,this,t);
    },
    //#region Methods
    propertyChanged: function Bindable_propertyChanged(propName) {
      //var t=new Date().getTime();
      //var infos,value;
      //if($j.classes.Control===null) return;
      //if(this instanceof $j.classes.Control) {
      //  for(var i=0,l=this.dataBindings.length;i<l;i++) {
      //    infos=this.dataBindings[i].split(",");
      //    if(this.form[infos[1]]) {
      //      if(!infos[0].contains(".")) {
      //        value=this[infos[0]];
      //        if(typeof this.form[infos[1]][infos[2]]==="string") value=value.toString();
      //        infos[2]=infos[2].firstCharUpper();
      //        //if (typeof this.form[infos[1]]["set"+infos[2]]===_const.FUNCTION) this.form[infos[1]]["set"+infos[2]](value);
      //        this.form[infos[1]][infos[2]]=value;
      //      } else {
      //      }
      //    }
      //  }
      //}
      //$j.tools.Debugger.log(arguments,this,t);
    },
    addDataBinding: function Bindable_addDataBinding(propertyToBind,objectName,objectProperty) {
      //var t=new Date().getTime();
      //this.dataBindings.push(propertyToBind+","+objectName+","+objectProperty);
      //var prop=objectProperty.firstCharUpper(),value=this[propertyToBind];
      //if(typeof this.form[objectName][objectProperty]==="string") value=value.toString();
      ////this.form[objectName]["set"+prop](value);
      //this.form[objectName][prop]=value;
      //$j.tools.Debugger.log(arguments,this,t);
    },
    removeDataBinding: function Bindable_removeDataBinding(propertyToBind,objectName) {
      //var t=new Date().getTime();
      //if(this.dataBindings[propertyToBind]) {
      //  if(this.dataBindings[propertyToBind][objectName]) this.dataBindings[propertyToBind][objectName]=null;
      //}
      //$j.tools.Debugger.log(arguments,this,t);
    }
    //#endregion
  });
  //#endregion
  //#region Application
  $j.classes.Application=Class.extend({
    _ClassName: "Application",
    init: function(appName) {
      //#region Private
      this._toolTipTimerHandle=null;
      this._windows=[];
      this._windowsClass={};
      this._globalComponentName=[];
      //#endregion
      this.themeName=$j.defaultTheme;
      this.toolTip=null;
      this.showMainWindow=true;
      $j.tools.scripts.push($j.tools.getPath($j.types.internalCategories.COMPONENTS)+"controls");
      this.name=appName;
      this.setThemeName=function(newValue) {
        if(typeof newValue!==_const.STRING) return;
        if(newValue!==this.themeName) {
          this.themeName=newValue.toLowerCase();
          this.changeTheme();
        }
      };
      //this.setHint=function(newValue) {
      //  if(typeof newValue!==_const.STRING) return;
      //  if(newValue!==_hint) {
      //    _hint=newValue;
      //  }
      //};
      this.mainWindow=null;
      //this.setShowMainWindow=function(newValue) {
      //  if(typeof newValue!==_const.BOOLEAN) return;
      //  if(newValue!==_showMainWindow) _showMainWindow=newValue;
      //};
      this.activeWindow=null;
      this.title=String.empty;
      this._lastActiveWindow=[];
      this.localCulture=null;
      this._localCultures={};
      $j.apps.applications[this.name]=this;
    },
    //#region Methods
    //Application.create=function Application_create(appName) {
    //  $j.tools.scripts.push($j.getPath($j.types.internalCategories.COMPONENTS)+"controls");
    //  return new this(appName);
    //};
    isUniqueGlobalComponentName: function Application_isUniqueGlobalComponentName(name) {
      return this._globalComponentName.indexOf(name)===-1;
    },
    changeTheme: function Application_changeTheme() {
      var i,j,l,l1,style;
      for(i=0,l=this._windows.length;i<l;i++) {
        this.changeWindowTheme(this._windows[i]);
        //this.windows[i].redraw();
        //this.windows[i].addControlToRedraw(this.windows[i]);
      }
      //this.loadTheme(this.themeName);
      if ($j.browser.ie) $j.doc.body.setAttribute("data-theme",this.themeName);
      else $j.doc.body.dataset.theme=this.themeName;
    },
    changeWindowTheme:function(window) {
      var ctrls=[];
      if ($j.browser.ie) window._DOMObj.setAttribute("data-theme",this.themeName);
      else window._DOMObj.dataset.theme=this.themeName;
      ctrls=window._DOMObj.querySelectorAll("[data-theme]");
      for(j=0,l1=ctrls.length;j<l1;j++) {
        if ($j.browser.ie) ctrls[j].setAttribute("data-theme",this.themeName);
        else ctrls[j].dataset.theme=this.themeName;
        if (!$j.tools.isNull(ctrls[j].jsObj)) {
          if (!$j.tools.isNull(ctrls[j].jsObj.themeName)) {
            if (ctrls[j].jsObj.themeName!==String.empty) {
              if ($j.browser.ie) ctrls[j].setAttribute("data-theme",this.themeName);
              else ctrls[j].jsObj.themeName=this.themeName;
            }
          }
        }
      }
      window.themeName=this.themeName;
      window.resize();
      window.onThemeChanged.invoke();
    },
    uniqueName: function Application_uniqueName(object) {
      var _class=object._ClassName,idx,a;
      if(!this['_'+_class+'s']) {
        this['_'+_class+'s']={};
        this['_'+_class+'s'].names=[''];
      }
      a=this['_'+_class+'s'].names;
      for(idx=1;idx<a.length;idx++) {
        if($j.tools.isNull(a[idx])) break;
      }
      return _class+idx;
    },
    removeName: function Application_removeName(object) {
      var _class=object._ClassName,a,idx;
      if(this["_"+_class+"s"]) {
        a=this["_"+_class+"s"].names;
        idx=a.indexOf(object.name);
        if(idx>-1) a[idx]=null;
      }
    },
    addName: function Application_addName(object) {
      var _class=object._ClassName,a,idx;
      if(this['_'+_class+'s']) {
        a=this['_'+_class+'s'].names;
        idx=a.indexOf(object.name);
        if(idx===-1) {
          var tab=object.name.match(/\d+$/);
          if(tab) {
            var n=~~(tab[0]);
            a[n]=object.name;
          }
        }
      }
    },
    terminate: function Application_terminate() {
      var i=this._windows.length-1;
      while(i>0) {
        this._windows[i].close();
        this._windows[i].destroy();
        this._windows.removeAt(i);
        i--;
      }
      $j.apps.applications.remove(this);
    },
    run: function Application_run() {
      var waiting=$j.doc.getElementById("waiting"),data;
      //if(waiting) $j.CSS.addClass(waiting,"hidden");
      var loading_logo=$j.doc.getElementById("loading_logo");
      if(loading_logo) $j.CSS.removeClass(loading_logo,"rotateAnimation");
      if(waiting) {
        $j.CSS.addClass(waiting,"hidden");
        $j.doc.body.removeChild(waiting);
      }
      var wins=$j.doc.getElementsByClassName(this.name),form;
      for(var i=0,l=wins.length;i<l;i++) {
        data=($j.browser.ie)?wins[i].getAttribute("data-class"):wins[i].dataset.class;
        form=this.createForm(wins[i].id,data);
        //this._windows.push(form);
        if(wins[i].style.display!=="none") {
          if($j.tools.isNull(this.mainWindow)) {
            if($j.tools.isNull(this.mainWindow)&&(form instanceof $j.classes.Window)) {
              this.mainWindow=this.activeWindow=form;
            }
          }
        }
      }
      this.mainWindow.show();
    },
    createForm: function Application_createForm(id,instanceClass) {
      var form=new this._windowsClass[instanceClass](this);
      form.formCreated(id);
      this.changeWindowTheme(form);
      return form;
    },
    initialize: function Application_initialize() {
      if ($j.tools.isNull(this.localCulture)) this.localCulture=$j.currentCulture;
      if($j.isDOMRenderer) {
            // création de l'emplacement des css en runtime
            $j.rtStyle=$j.doc.createElement("style");
            $j.rtStyle.setAttribute("id","rtStyle");
            $j.rtStyle.setAttribute("type","text/css");
            $j.rtStyle.setAttribute("media","screen");
            $j.doc.getElementsByTagName("head")[0].appendChild($j.rtStyle);
            var styleSheet=$j.rtStyle.sheet;
            //styleSheet.insertRule(".hidden {display:none !important;}", styleSheet.cssRules.length);
        return;
      }
      var themes=Object.getOwnPropertyNames($j.themes);
      //for(var i=0,l=themes.length;i<l;i++) {
      //  if(themes[i]!=="jagui") this.loadTheme(themes[i]);
      //}
    },
    /*loadTheme: function Application_loadTheme(themeName) {
      var props=Object.getOwnPropertyNames($j.themes[themeName]),style;
      if(props.length===0) {
        props=Object.getOwnPropertyNames($j.classes);
        for(var i=0,l=props.length;i<l;i++) {
          if(typeof $j.classes[props[i]]===_const.FUNCTION) {
            if(typeof $j.classes[props[i]].prototype.style===_const.OBJECT) {
              if(props[i]!=="ThemedControl") {
                $j.themes[themeName][props[i]]={
                  hovered: {
                    back: new $j.classes.ExtendedDrawingInfo(this),
                    middle: new $j.classes.ExtendedDrawingInfo(this),
                    front: new $j.classes.ExtendedDrawingInfo(this),
                    font: new $j.classes.Font(this)
                  },
                  pressed: {
                    back: new $j.classes.ExtendedDrawingInfo(this),
                    middle: new $j.classes.ExtendedDrawingInfo(this),
                    front: new $j.classes.ExtendedDrawingInfo(this),
                    font: new $j.classes.Font(this)
                  },
                  normal: {
                    back: new $j.classes.ExtendedDrawingInfo(this),
                    middle: new $j.classes.ExtendedDrawingInfo(this),
                    front: new $j.classes.ExtendedDrawingInfo(this),
                    font: new $j.classes.Font(this)
                  }
                };
                style=$j.themes[themeName][props[i]];
                if(!$j.isDOMRenderer) {
                  $j.CSS.CSSFont2Canvas("*",style.normal.font,true);
                  $j.CSS.CSSFont2Canvas(props[i],style.normal.font,true);
                  $j.CSS.CSSFont2Canvas(themeName+"_"+props[i],style.normal.font,true);

                  style.normal.font.stringify();
                  style.hovered.font.assign(style.normal.font);
                  style.pressed.font.assign(style.normal.font);

                  $j.CSS.CSSFont2Canvas(props[i]+$j.types.pseudoCSSClass.HOVER,style.hovered.font,true);
                  $j.CSS.CSSFont2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.HOVER,style.hovered.font,true);

                  $j.CSS.CSSFont2Canvas(props[i]+$j.types.pseudoCSSClass.HOVER,style.pressed.font,true);
                  $j.CSS.CSSFont2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.HOVER,style.pressed.font,true);

                  $j.CSS.CSS2Canvas(props[i],style.normal.back);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i],style.normal.back);

                  style.hovered.back.assign(style.normal.back);
                  style.pressed.back.assign(style.normal.back);

                  $j.CSS.CSS2Canvas(props[i]+$j.types.pseudoCSSClass.HOVER,style.hovered.back);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.HOVER,style.hovered.back);

                  $j.CSS.CSS2Canvas(props[i]+$j.types.pseudoCSSClass.ACTIVE,style.pressed.back);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.ACTIVE,style.pressed.back);

                  $j.CSS.CSS2Canvas(props[i]+$j.types.pseudoCSSClass.BEFORE,style.normal.middle);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.BEFORE,style.normal.middle);
                  style.hovered.middle.assign(style.normal.middle);
                  style.pressed.middle.assign(style.normal.middle);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.HOVER+$j.types.pseudoCSSClass.BEFORE,style.hovered.middle);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.ACTIVE+$j.types.pseudoCSSClass.BEFORE,style.pressed.middle);

                  $j.CSS.CSS2Canvas(props[i]+$j.types.pseudoCSSClass.AFTER,style.normal.front);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.AFTER,style.normal.front);
                  style.hovered.front.assign(style.normal.front);
                  style.pressed.front.assign(style.normal.front);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.HOVER+$j.types.pseudoCSSClass.AFTER,style.hovered.front);
                  $j.CSS.CSS2Canvas(themeName+"_"+props[i]+$j.types.pseudoCSSClass.ACTIVE+$j.types.pseudoCSSClass.AFTER,style.pressed.front);
                }
              }
            }
          }
        }
      }
    },*/
    addWindows: function Application_addWindows(windowsPath) {
      for(var i=0,l=windowsPath.length;i<l;i++) {
        $j.tools.scripts.push(windowsPath[i]);
        $j.tools.loadFormRes(windowsPath[i]);
      }
    },
    addWindow: function Application_addWindows(windowPath) {
      $j.tools.scripts.push(windowPath);
      $j.tools.loadFormRes(windowPath);
    },
    newWindow:function(windowPath) {
      // tester si la fiche est déjà chargée
      var html_doc=document.getElementsByTagName("head")[0];
      var style=$j.doc.createElement("link");
      style.setAttribute("rel","stylesheet");
      style.setAttribute("href",$j.tools.uri.base()+windowPath+".css?rnd="+new Date().getTime());
      style.setAttribute("media","screen");
      html_doc.appendChild(style);
      style=$j.doc.createElement("link");
      var node=document.createElement("script");
      node.setAttribute("type","text/javascript");
      node.addEventListener("load",function() {
        $j.tools.xhr.load(true,$j.tools.uri.base()+windowPath+".html?rnd="+new Date().getTime(),function(dx) {
          var div=$j.doc.createElement($j.types.HTMLElements.DIV);
          div.innerHTML=dx;
          $j.doc.body.appendChild(div.firstElementChild);
          var app=$j.apps.activeApplication;
          var wins=$j.doc.documentElement.getElementsByClassName(app.name),form;
          for(var i=0,l=wins.length;i<l;i++) {
            data=($j.browser.ie)?wins[i].getAttribute("data-class"):wins[i].dataset.class;
            if (data.toLowerCase()===$j.tools.uri.split(windowPath,true)) {
              form=app.createForm(wins[i].id,data);
              form.center();
              form.show();
            }
          }
        },false);
      },false);
      node.addEventListener("error",function() {
        console.log(windowPath+" not loaded");
      },false);
      node.setAttribute("src",$j.tools.uri.base()+windowPath+".js?rnd="+new Date().getTime());
      html_doc.appendChild(node);
    },
    setLocalCulture:function(culture) {
      var comps,i,l,j,l1;
      if ($j.tools.cultureExist(culture)) {
        if (!$j.tools.isNull(this._localCultures[culture])) {
          if (this.localCulture!==culture) {
            this.localCulture=culture;
            for (i=0,l=this._windows.length;i<l;i++) {
              if (this._windows[i].visible) {
                comps=this.activeWindow._controls.filter(
                  function(e,i,a){
                    return (e instanceof $j.classes.Control)&&(e._autoTranslate===true)&&(e.visible===true);
                  }
                );
                for (j=0,l1=comps.length;j<l1;j++) {
                  if ((comps[j] instanceof $j.classes.CaptionControl)||(comps[j] instanceof $j.classes.CustomTextControl)) this.getLocalText(comps[j]);
                  else comps[j].update();
                }
              }
            }
          }
        }
      }
    },
    getLocalText:function(obj) {
      if (!(obj instanceof $j.classes.CaptionControl)&&(!(obj instanceof $j.classes.CustomTextControl))) return;
      var c=this._localCultures[this.localCulture];
      if (!$j.tools.isNull(c)) {
        if (!$j.tools.isNull(c[obj.name])) {
          if (obj instanceof $j.classes.CaptionControl) obj.setCaption(c[obj.name]);
          else if (obj instanceof $j.classes.CustomTextControl) obj.setPlaceHolder(c[obj.name]);
        }
      }
    },
    showToolTip:function(obj,coord) {
      var wrapper,tpl,a,text=String.empty,tx=0,ty=0,tt,exit=false;
      this.destroyToolTip();
      if (!obj.showToolTip) exit=true;
      if (obj instanceof $j.classes.CustomTextControl) {
        if (!obj.hasError) exit=true;
      }
      if (exit) return;
      wrapper=$j.doc.createElement($j.types.HTMLElements.DIV);
      tpl=$j.templates["ToolTip"];
      a=tpl.split("{theme}");
      a.insert(a.length-1,obj.form.getThemeName());
      tpl=a.join(String.empty);
      if (obj.toolTip!==String.empty) {
        text=obj.toolTip;
      } else if (obj.ownerShowToolTip) {
        if (obj._owner.toolTip!==String.empty) {
          text=obj._owner.toolTip;
        }
      }
      if (obj instanceof $j.classes.CustomTextControl) {
        if (obj.hasError) text=obj.errorMsg;
      }
      if (text!==String.empty) {
        a=tpl.split("{text}");
        a.insert(a.length-1,text);
        tpl=a.join(String.empty);
        wrapper.innerHTML=tpl;
        $j.doc.body.appendChild(wrapper.firstElementChild);
        this.toolTip=$j.doc.body.lastElementChild;
        setTimeout(function() { 
          if (!$j.tools.isNull($j.apps.activeApplication.toolTip)) {
            if ($j.browser.ie) $j.apps.activeApplication.toolTip.setAttribute("data-fade","on");
            else $j.apps.activeApplication.toolTip.dataset.fade="on";
          }
        },10);
        this.placeToolTip(coord);
        this.closeToolTip();
      }
    },
    placeToolTip:function(coord) {
      var tt,tx=0,ty=0;
      tt=this.toolTip;
      tx=coord.x;
      if (tx+tt.offsetWidth>$j.doc.body.offsetWidth) tx=$j.doc.body.offsetWidth-tt.offsetWidth;
      ty=coord.y+20;
      if (ty+tt.offsetHeight>$j.doc.body.offsetHeight) ty=coord.y-tt.offsetHeight;
      tt.style[$j.types.jsCSSProperties.LEFT]=tx+$j.types.CSSUnits.PX;
      tt.style[$j.types.jsCSSProperties.TOP]=ty+$j.types.CSSUnits.PX;
    },
    closeToolTip:function() {
      this._toolTipTimerHandle=setTimeout(function() {
        $j.apps.activeApplication.destroyToolTip();
      },4000);
    },
    destroyToolTip:function() {
      if (!$j.tools.isNull(this.toolTip)) {
        clearTimeout(this._toolTipTimerHandle);
        $j.doc.body.removeChild(this.toolTip);
        this.toolTip=null;
      }
    }
    //#endregion
  });
  //#endregion
  //#region Bounds
  $j.classes.Bounds=Class.extend({
    _ClassName: "Bounds",
    init: function(rect,owner) {
      if(!(rect instanceof $j.classes.Rect)) rect=new $j.classes.Rect;
      //#region Private
      this._owner=owner;
      //#endregion
      this.rect=rect;
      this.setRect=function(newValue) {
        if(!(newValue instanceof $j.classes.Rect)) return;
        if(!newValue.equals(this.rect)) {
          this.rect.assign(newValue);
          this.onChange.invoke();
        }
      };
      this.onChange=new $j.classes.NotifyEvent(owner);
      //this.setOwner=function(newValue) {
      //  if(newValue!==_owner) _owner=newValue;
      //};
      this.setValues=function Bounds_setValues(left,top,right,bottom) {
        this.rect.setValues(left,top,right,bottom);
        this.onChange.invoke();
      };
    },
    //#region Methods
    empty:function() { return (this.rect.left===0)&&(this.rect.top===0)&&(this.rect.right===0)&&(this.rect.bottom===0); },
    left:function() { return this.rect.left; },
    top:function() { return this.rect.top; },
    right:function() { return this.rect.right; },
    bottom:function() { return this.rect.bottom; },
    width:function() { return this.rect.width; },
    height:function() { return this.rect.height; },
    assign: function Bounds_assign(source) {
      if(!(source instanceof $j.classes.Bounds)) return;
      this.rect.assign(source.rect);
      this.onChange.invoke();
    },
    marginRect: function Bounds_marginRect(rect) {
      if(!(rect instanceof $j.classes.Rect)) return;
      return new $j.classes.Rect(rect.left+this.rect.left,rect.top+this.rect.top,rect.right-this.rect.right,rect.bottom-this.rect.bottom);
    },
    paddingRect: function Bounds_paddingRect(rect) {
      if(!(rect instanceof $j.classes.Rect)) return;
      return new $j.classes.Rect(rect.left+this.rect.left,rect.top+this.rect.top,rect.right-this.rect.right,rect.bottom-this.rect.bottom);
    },
    equals: function Bounds_equals(bound) { return this.rect.equals(bound.rect); },
    applyTo: function Bounds_applyTo(obj) { obj.left+=this.rect.left; obj.top+=this.rect.top; obj.width-=this.rect.right; obj.height-=this.rect.bottom; },
    apply: function Bounds_apply() { this._owner.left+=this.rect.left; this._owner.top+=this.rect.top; this._owner.width-=this.rect.right+this.rect.left; this._owner.height-=this.rect.bottom+this.rect.top; },
    toCSS: function Bounds_toCSS() {
      return this.top+$j.types.CSSUnits.PX+String.SPACE+this.right+$j.types.CSSUnits.PX+String.SPACE+this.bottom+$j.types.CSSUnits.PX+String.SPACE+this.left+$j.types.CSSUnits.PX;
    }
    //#endregion
  });
  //#endregion
  //#region Position
  // TODO : support of databinding
  $j.classes.Position=Class.extend({
    _ClassName: "Position",
    init: function(point,owner) {
      if(!(point instanceof $j.classes.Point)) point=new $j.classes.Point;
      this.x=point.x;
      this.y=point.y;
      this.setX=function(newValue) {
        if(typeof newValue!==_const.NUMBER) return;
        if(newValue!==this.x) {
          this.x=newValue;
          this.onChange.invoke();
        }
      };
      this.setY=function(newValue) {
        if(typeof newValue!==_const.NUMBER) return;
        if(newValue!==this.y) {
          this.y=newValue;
          this.onChange.invoke();
        }
      };
      this.onChange=new $j.classes.NotifyEvent(owner);
      this._owner=owner;
      this.setValues=function Position_setValues(x,y) {
        x=+x;
        y=+y;
        if(isNaN(x)) x=0;
        if(isNaN(y)) y=0;
        this.x=x;
        this.y=y;
        this.onChange.invoke();
      };
    },
    //#region Methods
    empty:function() { return this.x===0&&this.y===0; },
    point:function() { return new $j.classes.Point(this.x,this.y); },
    reflect: function Position_reflect(/*value*/) {/*_vector.reflect(a);*/ },
    assign: function Position_assign(source) {
      if(!(source instanceof $j.classes.Position||source instanceof $j.classes.Point)) return;
      this.x=source.x;
      this.y=source.y;
    }
    //#endregion
  });
  //#endregion
  //#region Collection
  /*$j.classes.Collection=Class.extend({
    _ClassName: "Collection",
    init: function(owner) {
      //#region Private
      this._itemsClass=null;
      this._owner=owner;
      //#endregion
      this.items=[];
      this.onChange=new $j.classes.NotifyEvent(owner);
      this.getCount=function() { return this.items.length; };
    },
    //#region Methods
    add: function Collection_add(item) {
      if(item!==undefined) {
        if(!(item instanceof this._itemsClass)) return;
      } else item=new this._itemsClass(this);
      this.items.push(item);
      this.onChange.invoke();
      return item;
    },
    removeItem: function Collection_removeItem(item) {
      if(!(item instanceof this._itemsClass)) return;
      this.items.remove(item);
      this.onChange.invoke();
    },
    remove: function Collection_remove(index) {
      if(index<0||index>this.getCount()) return;
      this.items.removeAt(index);
      this.onChange.invoke();
    },
    newItem:function() {
    },
    clear: function Collection_clear() {
      this.items.length=0;
      this.onChange.invoke();
    }
    //#endregion
  });*/
  //#endregion
  //#region GradientPoint
  $j.classes.GradientPoint=Class.extend({
    _ClassName: "GradientPoint",
    init: function(offset,color) {
      if(typeof offset!==_const.NUMBER) offset=0;
      if(!(color instanceof $j.classes.Color)) color=_colors.BLACK;
      this.offset=offset;
      this.color=color;
      //this.setOffset=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_offset) _offset=newValue;
      //};
      //this.setColor=function(newValue) {
      //  if(!(newValue instanceof $j.classes.Color)) return;
      //  if(!newValue.equals(_color)) _color.assign(newValue);
      //};
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region Gradient
  // TODO : support of databinding
  $j.classes.Gradient=Class.extend({
    _ClassName: "Gradient",
    init: function(owner) {
      if(!$j.tools.isNull(owner)) {
        $j.classes.newCollection(this,owner,$j.classes.GradientPoint);
        this.startPosition=new $j.classes.Position(null,owner);
        this.startPosition.onChange.addListener(this.positionChanged);
        this.stopPosition=new $j.classes.Position(new $j.classes.Point(0,1),owner);
        this.stopPosition.onChange.addListener(this.positionChanged);
        this.style=$j.types.gradientStyles.LINEAR;
        this.items.push(new $j.classes.GradientPoint(0,_colors.BLACK));
        this.items.push(new $j.classes.GradientPoint(1,_colors.WHITE));
      }
    },
    //#region Setters
    setStartPosition:function(newValue) {
      if(!(newValue instanceof $j.classes.Position)) return;
      if(!newValue.equals(this.startPosition)) {
        this.startPosition.assign(newValue);
        if(this._owner._allowUpdate) {
          this._owner.form.updateRects.push(this._owner.getClipParentRect());
          this._owner.update();
          this._owner.form.updateRects.push(this._owner.getClipParentRect());
        }
      }
    },
    setStopPosition:function(newValue) {
      if(!(newValue instanceof $j.classes.Position)) return;
      if(!newValue.equals(_stopPosition)) {
        _stopPosition.assign(newValue);
        if(this._owner._allowUpdate) {
          this._owner.form.updateRects.push(this._owner.getClipParentRect());
          this._owner.update();
          this._owner.form.updateRects.push(this._owner.getClipParentRect());
        }
      }
    },
    setStyle:function(newValue) {
      if(!$j.tools.valueInSet(newValue,$j.types.gradientStyles)) return;
      if(newValue!==this.style) {
        this.style=newValue;
        if(this._owner._allowUpdate) {
          this._owner.form.updateRects.push(this._owner.getClipParentRect());
          this._owner.update();
          this._owner.form.updateRects.push(this._owner.getClipParentRect());
        }
      }
    },
    //#endregion Setter
    //#region Methods
    assign: function Gradient_assign(source) {
      if(!(source instanceof $j.classes.Gradient)) return;
      this.startPosition.assign(source.startPosition);
      this.stopPosition.assign(source.stopPosition);
      this.style=source.style;
      this.items.length=0;
      if(source.items.length>0) {
        for(var i=0,l=source.items.length;i<l;i++) this.items.push(new $j.classes.GradientPoint(source.items[i].offset,source.items[i].color));
      }
    },
    positionChanged: function Gradient_positionChanged() { this.onChange.invoke(); },
    change: function Gradient_change() { this._owner.onChange.invoke(); },
    interpolateColor: function Gradient_interpolateColor(offset) {
      if(typeof offset!==_const.NUMBER) return;
      var result=_colors.TRANSPARENT.clone();
      if(this.items.length>1) {
        if(offset<0) offset=0;
        if(offset>1) offset=1;
        this.items.sort(function(a,b) { return a.offset>b.offset; });
        if(offset<this.items[0].offset) {
          result.assign(this.items[0].color);
          return result;
        }
        if(offset>this.items[this.items.length-1].offset) {
          result.assign(this.items[this.items.length-1].color);
          return result;
        }
        if(this.items.length>0) {
          for(var i=0,l=this.items.length-1;i<l;i++) {
            if(offset<this.items[i].offset) continue;
            if(this.items[i+1].offset-this.items[i].offset<=0) result.assign(this.items[i].color);
            else if((i=this.items.length-2)&&(offset>this.items[this.items.length-1].offset)) result.assign(this.items[this.items.length-1].color);
            else result.assign(_anims.interpolateColor(this.items[i].color,this.items[i+1].color,(offset-this.items[i].offset)/(this.items[i+1].offset-this.items[i].offset)));
          }
        }
        return result;
      }
    }
    //#endregion
  });
  //#endregion
  //#region Brush
  // TODO : support of databinding
  $j.classes.Brush=$j.classes.Bindable.extend({
    _ClassName: "Gradient",
    init: function(style,color,owner) {
      this.gradient=new $j.classes.Gradient(this);
      this.bitmap=new Image();
      this.color=color;
      this.bitmapRepeatMode=$j.types.bitmapRepeatModes.REPEAT;
      this.style=style;
      if(!$j.tools.isNull(owner)) {
        if(!(color instanceof $j.classes.Color)) color=_colors.BLACK;
        this.setColor=function(newValue) {
          if(!(newValue instanceof $j.classes.Color)) return;
          if(!newValue.equals(this.color)) {
            this.color.assign(newValue);
            this.onChange.invoke();
          }
        };
        this.setGradient=function(newValue) {
          if(!(newValue instanceof $j.classes.Gradient)) return;
          this.gradient.assign(newValue);
          this.onChange.invoke();
        };
        this.gradient.items.onChange.addListener(this.gradientChanged);
        this.setBitmap=function(newValue) {
          if(typeof newValue!==_const.STRING) return;
          if(newValue!==this.bitmap.src) {
            this.bitmap.src=newValue;
            this.onChange.invoke();
          }
        };
        this.bitmap.obj=this;
        this.setBitmapRepeatMode=function(newValue) {
          if(!$j.tools.valueInSet(newValue,$j.types.bitmapRepeatModes)) return;
          if(newValue!==this.bitmapRepeatMode) {
            this.bitmapRepeatMode=newValue;
            this.onChange.invoke();
          }
        };
        this.setStyle=function(newValue) {
          if(!$j.tools.valueInSet(newValue,$j.types.brushStyles)) return;
          if(newValue!==this.style) {
            this.style=newValue;
            this.onChange.invoke();
          }
        };
        this.onChange=new $j.classes.NotifyEvent(owner);
        this._owner=owner;
      }
    },
    //#region Methods
    assign: function Brush_assign(source) {
      if(!(source instanceof $j.classes.Brush)) return;
      this.color.assign(source.color);
      if(source.bitmap.src!==String.empty) {
        this.bitmap.src=source.bitmap.src;
      }
      this.style=source.style;
      if(this.gradient) {
        if(source.gradient) this.gradient.assign(source.gradient);
      }
    },
    gradientChanged: function Brush_gradientChanged() { this.obj.onChange.invoke(); },
    bitmapChanged: function Brush_bitmapChanged() {
      var obj=this.obj;
      if(this.obj.onChange.hasListener()) this.obj.onChange.invoke();
      else //setTimeout(function() { obj.owner.redraw(); }, 0);
        this.obj.form.addControlToRedraw(this.obj);
    },
    clear: function Brush_clear() {
      this.style=$j.types.brushStyles.NONE;
      this.color.assign(_colors.TRANSPARENT);
    }
    //#endregion
  });
  //#endregion
  //#region Font
  // TODO : support of databinding
  $j.classes.Font=Class.extend({
    _ClassName: "Font",
    init: function(owner) {
      this.underline=false;
      this.strikeout=false;
      this.size=10;
      this.sizeUnit=$j.types.CSSUnits.PT;
      this.family="Tahoma";
      this.style=$j.types.fontStyles.NORMAL;
      if(!$j.tools.isNull(owner)) {
        this.string=String.empty;
        this.onChange=new $j.classes.NotifyEvent(owner);
        this.setUnderline=function(newValue) {
          if(typeof newValue!==_const.BOOLEAN) return;
          if(newValue!==this.underline) {
            this.underline=newValue;
            if($j.isDOMRenderer) this.stringify();
            this.onChange.invoke();
          }
        };
        this.setStrikeout=function(newValue) {
          if(typeof newValue!==_const.BOOLEAN) return;
          if(newValue!==this.strikeout) {
            this.strikeout=newValue;
            if($j.isDOMRenderer) this.stringify();
            this.onChange.invoke();
          }
        };
        this.setSize=function(newValue) {
          if(typeof newValue!==_const.NUMBER) return;
          if(newValue!==this.size) {
            this.size=newValue;
            if($j.isDOMRenderer) this.stringify();
            this.onChange.invoke();
          }
        };
        this.setSizeUnit=function(newValue) {
          if(!$j.tools.valueInSet(newValue,$j.types.CSSUnits)) return;
          if(newValue!==this.sizeUnit) {
            this.sizeUnit=newValue;
            this.onChange.invoke();
          }
        };
        this.setFamily=function(newValue) {
          if(typeof newValue!==_const.STRING) return;
          if(newValue!==this.family) {
            this.family=newValue;
            if($j.isDOMRenderer) this.stringify();
            this.onChange.invoke();
          }
        };
        this.getStyle=function(newValue) {
          if(!($j.tools.valueInSet(newValue,$j.types.brushStyles))) return;
          if(newValue!==this.style) {
            this.style=newValue;
            if($j.isDOMRenderer) this.stringify();
            this.onChange.invoke();
            if(this._owner._allowUpdate) this._owner.form.addControlToRedraw(this._owner);
            //if(this.owner._allowUpdate){
            //  this.owner.form.updateRects.push(this.owner.getClipParentRect());
            //  this.owner.update();
            //  this.owner.form.updateRects.push(this.owner.getClipParentRect());
            //  //$j.canvas.needUpdate=true;
            //}
          }
        };
        this.height=0;
        this._owner=owner;
        this.brush=new $j.classes.Brush($j.types.brushStyles.NONE,_colors.TRANSPARENT,owner);
        this.stringify();
      }
    },
    //#region Methods
    empty:function() { return (this.underline===false)&&(this.strikeout===false)&&(this.size===10)&&(this.family==="Tahoma")&&(this.style===$j.types.fontStyles.NORMAL)&&((this.brush.style===$j.types.brushStyles.NONE)&&(this.brush.color.equals(_colors.TRANSPARENT))); },
    stringify: function Font_stringify() {
      this.string=String.empty;
      if(this.style===$j.types.fontStyles.BOLD) this.string+=" bold";
      if(this.style===$j.types.fontStyles.ITALIC) this.string+=" italic";
      this.string+=String.SPACE+this.size+this.sizeUnit+String.SPACE+this.family;
      this.string.trim();
      this.height=$j.tools.font.getTextHeight("°_",this);
      if($j.tools.isNull($j.tools.font.fontsInfos[this.family])) {
        $j.tools.font.fontsInfos[this.family]={};
        $j.tools.font.fontsInfos[this.family].sizes={};
        if($j.tools.isNull($j.tools.font.fontsInfos[this.family].sizes[this.size])) {
          $j.tools.font.fontsInfos[this.family].sizes[this.size]={};
          $j.tools.font.fontsInfos[this.family].sizes[this.size].chars={};
          if($j.tools.isNull($j.tools.font.fontsInfos[this.family].sizes[this.size].chars['A'])) this.generateChars();
        }
      }
    },
    toCss: function Font_toCss(object) {
      if(!(object instanceof HTMLElement)) return;
      object.style.fontFamily=this.family;
      object.style.fontSize=this.size+this.sizeUnit;
      object.style.fontWeight=String.empty;
      object.style.fontStyle=String.empty;
      object.style.textDecoration=String.empty;
      if(this.style===$j.types.fontStyles.BOLD) object.style.fontWeight="bold";
      if(this.style===$j.types.fontStyles.ITALIC) object.style.fontStyle="italic";
      if(this.underline) object.style.textDecoration="underline";
      if(this.strikeout) {
        if(object.style.textDecoration!==String.empty) object.style.textDecoration+=",";
        object.style.textDecoration+="line-through";
      }
    },
    toCssString: function Font_toCssString() {
      var str=String.empty;
      /*str+="font-family:"+this.family+";";
      str+="font-size:"+this.size+this.sizeUnit+";";
      if (this.style===$j.types.fontStyles.BOLD) str+="font-weight:bold;";
      if (this.style===$j.types.fontStyles.ITALIC) str+="font-style:italic;";
      if(this.underline) str+="text-decoration:underline;";
      if(this.strikeout){
        if(object.style.textDecoration!==String.empty) str+=",";
        str+="line-through;";
      }*/
      str+=this.size+this.sizeUnit;
      str+=String.SPACE+'"'+this.family+'"';
      if(this.style===$j.types.fontStyles.BOLD) str+=String.SPACE+"bold";
      if(this.style===$j.types.fontStyles.ITALIC) str+=String.SPACE+"italic";
      if(this.underline) str+=String.SPACE+"underline";
      if(this.strikeout) {
        //if(object.style.textDecoration!==String.empty) str+=",";
        str+=String.SPACE+"line-through";
      }
      str+=";";
      return str;
    },
    fromString: function Font_fromString(str) {
      if(typeof str!==_const.STRING) return;
      str=str.toLowerCase();
      this.size=0;
      this.family=String.empty;
      this.style=$j.types.fontStyles.NORMAL;
      this.underline=false;
      this.strikeout=false;
      str=str.split(String.SPACE);
      for(var i=0,l=str.length;i<l;i++) {
        if(!isNaN(parseFloat(str[i]))) {
          if(str[i].endsWith($j.types.CSSUnits.PO)) this.sizeUnit=$j.types.CSSUnits.PO;
          else if(str[i].endsWith($j.types.CSSUnits.REM)) this.sizeUnit=$j.types.CSSUnits.REM;
          else this.sizeUnit=str[i].substr(str[i].length-2,2).toLowerCase();
          this.size=parseFloat(str[i]);
        }
        else if(str[i].contains("bold")) $j.tools.include(this,"style",$j.types.fontStyle.BOLD);
        else if(str[i].contains("italic")) $j.tools.include(this,"style",$j.types.fontStyle.ITALIC);
        else this.family=str[i].replace(/"/g,String.empty);
      }
      if($j.renderer!==$j.types.renderers.DOM) this.stringify();
    },
    assign: function Font_assign(source) {
      if(!(source instanceof $j.classes.Font)) return;
      this.family=source.family;
      this.size=source.size;
      this.strikeout=source.strikeout;
      this.style=source.style;
      this.underline=source.underline;
      this.sizeUnit=source.sizeUnit;
      this.onChange.invoke();
      this.brush.assign(source.brush);
      //this.stringify();
      this.string=source.string;
    },
    equals: function Font_equals(font) {
      var ret=false;
      if(font.size===this.size) ret=true;
      else ret=false;
      if(font.family===this.family) ret=true;
      else ret=false;
      if(font.style===this.style) ret=true;
      else ret=false;
      if(font.underline===this.underline) ret=true;
      else ret=false;
      if(font.strikeout===this.strikeout) ret=true;
      else ret=false;
      if(font.sizeUnit===this.sizeUnit) ret=true;
      else ret=false;
      return ret;
    },
    reset: function Font_reset() {
      this.underline=this.strikeout=false;
      this.size=10;
      this.sizeUnit=$j.types.CSSUnits.PT;
      this.family="Tahoma";
      this.style=$j.types.fontStyles.NORMAL;
      this.height=0;
      this.brush.clear();
      this.stringify();
    },
    generateChars: function Font_generateChars() {
      var i,canvas=$j.tools.newCanvas(),ctx=canvas.getContext("2d");
      ctx.font=this.string;
      $j.tools.font.fontsInfos[this.family].sizes[this.size].chars[String.SPACE]=ctx.measureText(String.SPACE).width;
      //$j.tools.font.fontsInfos[this.family].sizes[this.size].chars["\t"]=ctx.measureText("\t").width;
      for(i=32;i<255;i++) {
        $j.tools.font.fontsInfos[this.family].sizes[this.size].chars[i]=ctx.measureText(String.fromCharCode(i)).width;
      }
    }
    //#endregion
  });
  //#endregion
  //#region PathPoint
  $j.classes.PathPoint=Class.extend({
    _ClassName: "PathPoint",
    init: function() {
      this.kind=$j.types.pathPointKinds.MOVETO;
      this.point=new $j.classes.Point;
      this.cp1=new $j.classes.Point;
      this.cp2=new $j.classes.Point;
      //this.setKind=function(newValue) {
      //  if(!$j.tools.valueInSet(newValue,$j.types.pathPointKinds)) return;
      //  if(newValue!==_kind) _kind=newValue;
      //};
      //this.setPoint=function(newValue) {
      //  if(!(newValue instanceof $j.classes.Point)) return;
      //  if(newValue!==_point) _point.assign(newValue);
      //};
      //this.setCp1=function(newValue) {
      //  if(!(newValue instanceof $j.classes.Point)) return;
      //  if(newValue!==_cp1) _cp1.assign(newValue);
      //};
      //this.setCp2=function(newValue) {
      //  if(!(newValue instanceof $j.classes.Point)) return;
      //  if(newValue!==_cp2) _cp2.assign(newValue);
      //};
    }
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region PathData
  $j.classes.PathData=Class.extend({
    _ClassName: "PathData",
    init: function(owner) {
      this.startPoint=new $j.classes.Point;
      if(!$j.tools.isNull(owner)) {
        this.onChange=new $j.classes.NotifyEvent(owner);
        this.setStartPoint=function(newValue) {
          if(!(newValue instanceof $j.classes.Point)) return;
          if(newValue!==this.startPoint) {
            this.startPoint.assign(newValue);
            this.onChange.invoke();
          }
        };
        this._owner=owner;
        this.data=[];
        this.originalBounds=new $j.classes.Rect;
      }
    },
    //#region getters/setters
    getPathString: function PathData_getPathString() {
      var i=0,result=String.empty;
      while(i<this.data.length) {
        if(this.data[i].kind===$j.types.pathPointKinds.MOVETO) result+='M '+this.data[i].point.x+','+this.data[i].point.y+String.SPACE;
        else if(this.data[i].kind===$j.types.pathPointKinds.LINETO) result+='L '+this.data[i].point.x+','+this.data[i].point.y+String.SPACE;
        else if(this.data[i].kind===$j.types.pathPointKinds.CURVETO) {
          result+='C '+this.data[i].point.x+','+this.data[i].point.y+String.SPACE+
                    this.data[i+1].point.x+','+this.data[i+1].point.y+String.SPACE+
                    this.data[i+2].point.x+','+this.data[i+2].point.y+String.SPACE;
          i+=2;
        } else if(this.data[i].kind===$j.types.pathPointKinds.CLOSE) result+='Z ';
        i++;
      }
      return result;
    },
    setPathString: function PathData_setPathString(value) {
      var s=String.empty,toks,tok,r,cp1,cp2,angle,large,sweet,lastlen,pos,o;
      if(typeof value!==_const.STRING) return;
      if(value.length>0) {
        for(var i=0,l=value.length;i<l;i++) {
          if(['\t','\r','\n','"',"'"].indexOf(value.charAt(i))>-1) continue;
          s+=value.charAt(i);
        }
      }
      this.data.length=0;
      pos=0;
      while(s!==String.empty) {
        lastlen=pos;
        tok=$j.tools.text.getTok(s,pos);
        pos=tok.pos;
        toks=tok.s;
        while(toks!==String.empty) {
          tok=toks.charAt(0);
          toks=toks.remove(0,1);
          try {
            if(['z','Z'].indexOf(tok)>-1) this.closePath();
            if(tok==='M') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.moveTo(o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points }
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.lineTo(o.Point);
              }
            }
            if(tok==='m') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.moveToRel(o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.lineToRel(o.Point);
              }
            }
            if(tok==='L') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.lineTo(o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.lineTo(o.Point);
              }
            }
            if(tok==='l') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.lineToRel(o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.lineToRel(o.Point);
              }
            }
            if(tok==='C') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp1=o.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp2=o.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.curveTo(cp1,cp2,o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                cp1=o.Point;
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                cp2=o.Point;
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.curveTo(cp1,cp2,o.Point);
              }
            }
            if(tok==='c') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp1=o.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp2=o.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.curveToRel(cp1,cp2,o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                cp1=o.Point;
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                cp2=o.Point;
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.curveToRel(cp1,cp2,o.Point);
              }
            }
            if(tok==='S') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp2=o.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.smoothCurveTo(cp2,o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                cp2=o.Point;
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.smoothCurveTo(cp2,o.Point);
              }
            }
            if(tok==='s') {
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp2=o.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              this.smoothCurveToRel(cp2,o.Point);
              while((s!==String.empty)&&(['0','1','2','3','4','5','6','7','8','9','-'].indexOf(s.charAt(pos))>-1)) {
                //next points }
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                cp2=o.Point;
                o=$j.tools.text.getPoint(s,pos);
                pos=o.Pos;
                this.smoothCurveToRel(cp2,o.Point);
              }
            }
            if(tok==='H') {
              //skip horizontal line
              o=$j.tools.text.getNum(s,pos);
              pos=o.Pos;
              this.hLineTo(+o.Result);
            }
            if(tok==='h') {
              //skip horizontal line
              o=$j.tools.text.getNum(s,pos);
              pos=o.Pos;
              this.hLineToRel(+o.Result);
            }
            if(tok==='V') {
              //skip vertical line
              o=$j.tools.text.getNum(s,pos);
              pos=o.Pos;
              this.vLineTo(+o.Result);
            }
            if(tok==='v') {
              //skip vertical line
              o=$j.tools.text.getNum(s,pos);
              pos=o.Pos;
              this.vLineToRel(+o.Result);
            }
            if(tok==='Q') {
              //skip quadratic bezier
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
            }
            if(tok==='q') {
              //skip quadratic bezier
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
            }
            if(tok==='T') {
              //skip show quadratic bezier
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
            }
            if(tok==='t') {
              //skip show quadratic bezier
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
            }
            if(tok==='A') {
              //arc
              if(this.data.length>0) cp1=this.data[this.data.length-1].point;
              else cp1=new $j.classes.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              r=o.Point;
              o=$j.tools.text.getNum(s,pos);
              pos=o.Pos;
              angle=+o.Result;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              large=o.Point.x==1;
              sweet=o.Point.y==1;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp2=o.Point;
              this.addArcSvg(cp1,r,angle,large,sweet,cp2);
            }
            if(tok==='a') {
              //arc rel
              if(this.data.length>0) cp1=this.data[this.data.length-1].point;
              else cp1=new $j.classes.Point;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              r=o.Point;
              o=$j.tools.text.getNum(s,pos);
              pos=o.Pos;
              angle=+o.Result;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              large=o.Point.x==1;
              sweet=o.Point.y==1;
              o=$j.tools.text.getPoint(s,pos);
              pos=o.Pos;
              cp2=o.Point;
              cp2.setValues(cp1.x+cp2.x,cp1.y+cp2.y);
              this.addArcSvg(cp1,r,angle,large,sweet,cp2);
            }
          }
          catch(e) { alert(e); }
        }
        if(lastlen===pos) {
          pos=0;
          break;
        }
      }
      this.originalBounds.assign(this.bounds());
      this.onChange.invoke(this._owner);
      if(this._owner._allowUpdate) {
        //this.owner.update();
        //  $j.canvas.needUpdate=true;
      }
    },
    //#endregion
    //#region Methods
    empty:function() { return this.data.length===0; },
    bounds:function() {
      var result;
      if(this.data.length===0) return new $j.classes.Rect;
      result=new $j.classes.Rect(0xFFFF,0xFFFF,-0xFFFF,-0xFFFF);
      if(this.data.length>0) {
        for(var i=0,l=this.data.length;i<l;i++) {
          if(this.data[i].kind===$j.types.pathPointKinds.CLOSE) continue;
          if(this.data[i].point.x<result.left) result.left=this.data[i].point.x;
          if(this.data[i].point.x>result.right) result.right=this.data[i].point.x;
          if(this.data[i].point.y<result.top) result.top=this.data[i].point.y;
          if(this.data[i].point.y>result.bottom) result.bottom=this.data[i].point.y;
        }
      }
      //add small amount
      if(result.width()===0) result.right=result.left+0.001;
      if(result.height()===0) result.bottom=result.top+0.001;
      return result;
    },
    lastPoint:function() {
      if(this.data.length>0) return this.data[this.data.length-1].point;
      else return new $j.classes.Point;
    },
    assign: function PathData_assign(source) {
      if(!(source instanceof $j.classes.PathData)) return;
      source.copyDataTo(this.data);
      this.onChange.invoke();
    },
    copyDataTo: function PathData_copyDataTo(dest) {
      if(!Array.isArray(dest)) return;
      dest.length=0;
      for(var i=0,l=this.data.length;i<l;i++) {
        var pathPoint=new $j.classes.PathPoint;
        pathPoint.kind=this.data[i].kind;
        pathPoint.point.setValues(this.data[i].x,this.data[i].y);
        dest.push(pathPoint);
      }
    },
    addArcSvgPart: function PathData_addArcSvgPart(center,ray,angle,sweep) {
      //var s=sweep;
      if(!(center instanceof $j.classes.Point)) return;
      if(!(ray instanceof $j.classes.Point)) return;
      if(typeof angle!==_const.NUMBER) return;
      if(typeof sweep!==_const.NUMBER) return;
      var bezier_arc_angle_epsilon=0.01,usemoveto,i,f,total_sweep,local_sweep,prev_sweep,done;
      angle=_conv.deg2Rad(angle);
      sweep=_conv.deg2Rad(sweep);
      i=$j.trunc(angle*0,1591549430918953);
      angle=f=angle-(i*_const._2PI);
      if(sweep>=_const._2PI) sweep=_const._2PI;
      if(sweep<=-_const._2PI) sweep=-_const._2PI;
      if($j.abs(sweep)<1e-10) return;
      total_sweep=0;
      done=false;
      usemoveto=false;
      while(!done) {
        if(sweep<0) {
          prev_sweep=total_sweep;
          local_sweep=-Math.PI*0.5;
          total_sweep=total_sweep-(Math.PI*0.5);
          if(total_sweep<=sweep+bezier_arc_angle_epsilon) {
            local_sweep=sweep-prev_sweep;
            done=true;
          }
        } else {
          prev_sweep=total_sweep;
          local_sweep=Math.PI*0.5;
          total_sweep=total_sweep+(Math.PI*0.5);
          if(total_sweep>=sweep-bezier_arc_angle_epsilon) {
            local_sweep=sweep-prev_sweep;
            done=true;
          }
        }
        this.drawArcWithBezier(this,center.x,center.y,ray.x,ray.y,angle,local_sweep,usemoveto);
        usemoveto=false;
        angle+=local_sweep;
      }
    },
    addArcSvg: function PathData_addArcSvg(p1,r,a,l,f,p2) {
      //if(!p1||!r||!l||!f||!p2) return;
      if(!(p1 instanceof $j.classes.Point)) return;
      if(!(r instanceof $j.classes.Point)) return;
      if(!(p2 instanceof $j.classes.Point)) return;
      if(typeof a!==_const.NUMBER) return;
      if(typeof l!==_const.BOOLEAN) return;
      if(typeof f!==_const.BOOLEAN) return;
      var i,m_radii_ok,v,p,n,sq,rx,ry,x0,y0,x1,y1,x2,y2,cx,cy,ux,uy,vx,vy,
          dx2,dy2,prx,pry,px1,py1,cx1,cy1,sx2,sy2,sign,coef,radii_check,start_angle,sweep_angle,
          cos_a,sin_a,tm,len,m;
      rx=r.x;
      ry=r.y;
      x0=p1.x;
      y0=p1.y;
      x2=p2.x;
      y2=p2.y;
      a=_conv.deg2Rad(a);
      m_radii_ok=true;
      if(rx<0) rx=-rx;
      if(ry<0) ry=-rx;
      //Calculate the middle point between
      //the current and the final points
      dx2=(x0-x2)*0.5;
      dy2=(y0-y2)*0.5;
      //Convert a from degrees to radians
      cos_a=$j.cos(a);
      sin_a=$j.sin(a);
      //Calculate (x1,y1)
      x1=cos_a*dx2+sin_a*dy2;
      y1=-sin_a*dx2+cos_a*dy2;
      //Ensure radii are large enough
      prx=rx*rx;
      pry=ry*ry;
      px1=x1*x1;
      py1=y1*y1;
      //Check that radii are large enough
      radii_check=px1/prx+py1/pry;
      if(radii_check>1) {
        rx=$j.sqrt(radii_check)*rx;
        ry=$j.sqrt(radii_check)*ry;
        prx=rx*rx;
        pry=ry*ry;
        if(radii_check>10) m_radii_ok=false;
      }
      //Calculate (cx1,cy1)
      if(l===f) sign=-1;
      else sign=1;
      sq=(prx*pry-prx*py1-pry*px1)/(prx*py1+pry*px1);
      if(sq<0) coef=sign*$j.sqrt(0);
      else coef=sign*$j.sqrt(sq);
      cx1=coef*((rx*y1)/ry);
      cy1=coef*-((ry*x1)/rx);
      //Calculate (cx,cy) from (cx1,cy1)
      sx2=(x0+x2)*0.5;
      sy2=(y0+y2)*0.5;
      cx=sx2+(cos_a*cx1-sin_a*cy1);
      cy=sy2+(sin_a*cx1+cos_a*cy1);
      //Calculate the start_a (a1) and the sweep_a (da)
      ux=(x1-cx1)/rx;
      uy=(y1-cy1)/ry;
      vx=(-x1-cx1)/rx;
      vy=(-y1-cy1)/ry;
      //Calculate the a start
      n=$j.sqrt(ux*ux+uy*uy);
      p=ux;//(1*ux)+(0*uy)
      if(uy<0) sign=-1;
      else sign=1;
      v=p/n;
      if(v<-1) v=-1;
      if(v>1) v=1;
      start_angle=sign*$j.acos(v);
      //Calculate the sweep a
      n=$j.sqrt((ux*ux+uy*uy)*(vx*vx+vy*vy));
      p=ux*vx+uy*vy;
      if(ux*vy-uy*vx<0) sign=-1;
      else sign=1;
      v=p/n;
      if(v<-1) v=-1;
      if(v>1) v=1.0;
      sweep_angle=sign*$j.acos(v);
      if((!f)&&(sweep_angle>0)) sweep_angle=sweep_angle-pi*2;
      else if(f&&(sweep_angle<0)) sweep_angle+=Math.PI*2;
      len=this.data.length;
      this.addArcSvgPart(new $j.classes.Point(),new $j.classes.Point(rx,ry),_conv.rad2Deg(start_angle),_conv.rad2Deg(sweep_angle));
      tm=_const.IDENTITYMATRIX.clone();
      tm.m31=cx;
      tm.m32=cy;
      m=$j.geometry.createRotationMatrix(a);
      tm=m.multiply(tm);
      i=len;
      while(i<this.data.length) {
        v=new $j.classes.Vector(this.data[i].point.x,this.data[i].point.y,1);
        v.transform(tm);
        this.data[i].point.x=v.x;
        this.data[i].point.y=v.y;
        i++;
      }
    },
    calculateBezierCoefficients: function PathData_calculateBezierCoefficients(bezier) {
      var result={};
      result.cx=3*(bezier[1].x-bezier[0].x);
      result.cy=3*(bezier[1].y-bezier[0].y);
      result.bx=3*(bezier[2].x-bezier[1].x)-result.cx;
      result.by=3*(bezier[2].y-bezier[1].y)-result.cy;
      result.ax=bezier[3].x-bezier[0].x-result.cx-result.bx;
      result.ay=bezier[3].y-bezier[0].y-result.cy-result.by;
      return result;
    },
    pointOnBezier: function PathData_pointOnBezier(p,ax,bx,cx,ay,by,cy,t) {
      if(!(p instanceof $j.classes.Point)) return;
      if(typeof ax!==_const.NUMBER) return;
      if(typeof bx!==_const.NUMBER) return;
      if(typeof cx!==_const.NUMBER) return;
      if(typeof ay!==_const.NUMBER) return;
      if(typeof by!==_const.NUMBER) return;
      if(typeof cy!==_const.NUMBER) return;
      var tsqr,tcube,result=new $j.classes.Point;
      tsqr=t*t;
      tcube=tsqr*t;
      result.setValues((ax*tcube)+(bx*tsqr)+(cx*t)+p.x,(ay*tcube)+(by*tsqr)+(cy*t)+p.y);
      return result;
    },
    createBezier: function PathData_createBezier(bezier,coef) {
      var dt,bc,t,result=[];
      if(coef===0) return;
      dt=1/(1*coef-1);
      t=0;
      bc=this.calculateBezierCoefficients(bezier);
      for(var i=0;i<coef;i++) {
        result[i]=this.pointOnBezier(bezier[0],bc.ax,bc.bx,bc.cx,bc.ay,bc.by,bc.cy,t);
        t=t+dt;
      }
      return result;
    },
    drawArcWithBezier: function PathData_drawArcWithBezier(p,cx,cy,rx,ry,sa,sr,u) {
      if(typeof cx!==_const.NUMBER) return;
      if(typeof cy!==_const.NUMBER) return;
      if(typeof rx!==_const.NUMBER) return;
      if(typeof ry!==_const.NUMBER) return;
      if(typeof sa!==_const.NUMBER) return;
      if(typeof sr!==_const.NUMBER) return;
      if(typeof u!==_const.BOOLEAN) return;
      var coord=[],pts=[],a,b,c,x,y,ss,cc;
      if(sr===0) {
        if(u) {
          if(p.data.length===0) p.moveTo(new $j.classes.Point(cx+rx*$j.cos(sa),cy-ry*$j.sin(sa)));
          else p.lineTo(new $j.classes.Point(cx+rx*$j.cos(sa),cy-ry*$j.sin(sa)));
        }
        p.lineTo(new $j.classes.Point(cx+rx*$j.cos(sa),cy-ry*$j.sin(sa)));
        return;
      }
      b=$j.sin(sr*0.5);
      c=$j.cos(sr*0.5);
      a=1-c;
      x=a*4.0/3.0;
      y=b-x*c/b;
      ss=$j.sin(sa+sr*0.5);
      cc=$j.cos(sa+sr*0.5);
      coord[0]=new $j.classes.Point(c,-b);
      coord[1]=new $j.classes.Point(c+x,-y);
      coord[2]=new $j.classes.Point(c+x,y);
      coord[3]=new $j.classes.Point(c,b);
      for(var i=0;i<4;i++) pts[i]=new $j.classes.Point(cx+rx*(coord[i].x*cc-coord[i].y*ss),cy+ry*(coord[i].x*ss+coord[i].y*cc));
      if(u) {
        if(p.data.length===0) p.moveTo(pts[0]);
        else p.lineTo(pts[0]);
      }
      p.curveTo(pts[1],pts[2],pts[3]);
    },
    moveTo: function PathData_moveTo(point) {
      if(!(point instanceof $j.classes.Point)) return;
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.MOVETO;
      pathPoint.point.setValues(point.x,point.y);
      this.data.push(pathPoint);
      this.startPoint.setValues(point.x,point.y);
    },
    moveToRel: function PathData_moveToRel(point) {
      if(!(point instanceof $j.classes.Point)) return;
      var pathPoint=new $j.classes.PathPoint(),lp=this.lastPoint();
      pathPoint.kind=$j.types.pathPointKinds.MOVETO;
      pathPoint.point.setValues(lp.x+point.x,lp.y+point.y);
      this.data.push(pathPoint);
      this.startPoint.setValues(pathPoint.point.x,pathPoint.point.y);
    },
    lineTo: function PathData_lineTo(point) {
      if(!(point instanceof $j.classes.Point)) return;
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.LINETO;
      pathPoint.point.setValues(point.x,point.y);
      this.data.push(pathPoint);
    },
    lineToRel: function PathData_lineToRel(point) {
      if(!(point instanceof $j.classes.Point)) return;
      var pathPoint=new $j.classes.PathPoint(),lp=this.lastPoint();
      pathPoint.kind=$j.types.pathPointKinds.LINETO;
      pathPoint.point.setValues(lp.x+point.x,lp.y+point.y);
      this.data.push(pathPoint);
    },
    hLineTo: function PathData_hLineTo(x) {
      if(typeof x!==_const.NUMBER) return;
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.LINETO;
      pathPoint.point.setValues(x,this.data[this.data.length-1].point.y);
      this.data.push(pathPoint);
    },
    hLineToRel: function PathData_hLineToRel(a) {
      if(typeof a!==_const.NUMBER) return;
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.LINETO;
      pathPoint.point.setValues(this.lastPoint().x+a,this.lastPoint().y);
      this.data.push(pathPoint);
    },
    vLineTo: function PathData_vLineTo(y) {
      if(typeof y!==_const.NUMBER) return;
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.LINETO;
      pathPoint.point.setValues(this.data[this.data.length-1].point.x,y);
      this.data.push(pathPoint);
    },
    vLineToRel: function PathData_vLineToRel(y) {
      if(typeof y!==_const.NUMBER) return;
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.LINETO;
      pathPoint.point.setValues(this.lastPoint().x,this.lastPoint().y+y);
      this.data.push(pathPoint);
    },
    curveTo: function PathData_curveTo(point1,point2,endpoint) {
      var p1=point1,p2=point2,e=endpoint;
      if(!(p1 instanceof $j.classes.Point)) return;
      if(!(p2 instanceof $j.classes.Point)) return;
      if(!(e instanceof $j.classes.Point)) return;
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(p1.x,p1.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(p2.x,p2.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(e.x,e.y);
      this.data.push(pathPoint);
    },
    curveToRel: function PathData_curveToRel(point1,point2,endpoint) {
      var p1=point1,p2=point2,e=endpoint;
      if(!(p1 instanceof $j.classes.Point)) return;
      if(!(p2 instanceof $j.classes.Point)) return;
      if(!(e instanceof $j.classes.Point)) return;
      var pathPoint=new $j.classes.PathPoint(),lp=this.lastPoint();
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(lp.x+p1.x,lp.y+p1.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(lp.x+p2.x,lp.y+p2.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(lp.x+e.x,lp.y+e.y);
      this.data.push(pathPoint);
    },
    smoothCurveTo: function PathData_smoothCurveTo(point2,endpoint) {
      var p2=point2,e=endpoint;
      if(!(p2 instanceof $j.classes.Point)) return;
      if(!(e instanceof $j.classes.Point)) return;
      var controlPoint1=new $j.classes.Point(),pathPoint=new $j.classes.PathPoint;
      if(this.data.length>2) {
        controlPoint1.setValues(this.lastPoint().x+(this.lastPoint().x-this.data[this.data.length-1].point.x),
                                this.lastPoint().y+(this.lastPoint().y-this.data[this.data.length-1].point.y));
      } else {
        controlPoint1.setValues(p2.x,p2.y);
      }
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(controlPoint1.x,controlPoint1.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(p2.x,p2.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(e.x,e.y);
      this.data.push(pathPoint);
    },
    smoothCurveToRel: function PathData_smoothCurveToRel(point2,endpoint) {
      var p2=point2,e=endpoint;
      if(!(p2 instanceof $j.classes.Point)) return;
      if(!(e instanceof $j.classes.Point)) return;
      var controlPoint1=new $j.classes.Point(),pathPoint=new $j.classes.PathPoint(),lp;
      if(this.data.length>2) {
        controlPoint1.setValues(this.lastPoint().x+(this.lastPoint().x-this.data[this.data.length-1].point.x),
                                this.lastPoint().y+(this.lastPoint().y-this.data[this.data.length-1].point.y));
      } else {
        controlPoint1.X=p2.x;
        controlPoint1.Y=p2.y;
      }
      lp=this.lastPoint();
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(controlPoint1.x,controlPoint1.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(lp.x+p2.x,lp.y+p2.y);
      this.data.push(pathPoint);
      pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CURVETO;
      pathPoint.point.setValues(lp.x+e.x,lp.y+e.y);
      this.data.push(pathPoint);
    },
    closePath: function PathData_closePath() {
      var pathPoint=new $j.classes.PathPoint;
      pathPoint.kind=$j.types.pathPointKinds.CLOSE;
      pathPoint.point.setValues(this.startPoint.x,this.startPoint.y);
      this.data.push(pathPoint);
    },
    addEllipse: function PathData_addEllipse(rect) { // � voir
      if(!(rect instanceof $j.classes.Rect)) return;
      var cx,cy,px,py,rw=rect.width(),rh=rect.height();
      cx=(rect.left+rw)*0.5;
      cy=(rect.top+rh)*0.5;
      px=$j.types.canvas.CURVE2KAPPA*(rw*0.5);
      py=$j.types.canvas.CURVE2KAPPA*(rh*0.5);
      this.moveTo(new $j.classes.Point(rect.left,cy));
      this.curveTo(new $j.classes.Point(rect.left,cy-py),new $j.classes.Point(cx-px,rect.top),new $j.classes.Point(cx,rect.top));
      this.curveTo(new $j.classes.Point(cx+px,rect.top),new $j.classes.Point(rw,cy-py),new $j.classes.Point(rw,cy));
      this.curveTo(new $j.classes.Point(rw,cy+py),new $j.classes.Point(cx+px,rh),new $j.classes.Point(cx,rh));
      this.curveTo(new $j.classes.Point(cx-px,rh),new $j.classes.Point(rect.left,cy+py),new $j.classes.Point(rect.left,cy));
      this.originalPathString=this.PathString();
    },
    addRectangle: function PathData_addRectangle(r,radius) {
      var /*r=rect,*/ulr=radius.topLeft,urr=radius.topRight,lrr=radius.bottomLeft,llr=radius.bottomRight;
      if(!(r instanceof $j.classes.Rect)) return;
      var rW=r.width(),rW2=rW*.5,x,y,xw,yh,x1,x2,x3,x4,y1,y2,y3,y4,radii,rH=r.height(),ratio=0;
      ratio=$j.min($j.min(rW/(ulr+urr),rW/(llr+lrr)),$j.min(rH/(ulr+llr),rH/(urr+lrr)));
      if((ratio>0)&&(ratio<1)) {
        ulr*=ratio;
        urr*=ratio;
        llr*=ratio;
        lrr*=ratio;
      }
      x=r.left+.5;
      y=r.top+.5;
      xw=x+rW;
      yh=y+rH;
      x1=x+ulr;
      x2=xw-urr;
      x3=xw-lrr;
      x4=x+llr;
      y1=y+urr;
      y2=yh-lrr;
      y3=yh-llr;
      y4=y+ulr;
      if(urr+lrr+llr+ulr===0) {
        this.moveTo(new $j.classes.Point(x1,y));
        this.lineTo(new $j.classes.Point(xw,y));
        this.lineTo(new $j.classes.Point(xw,yh));
        this.lineTo(new $j.classes.Point(x,yh));
      } else {
        if(ulr>0) this.moveTo(new $j.classes.Point(x1,y));
        else this.moveTo(new $j.classes.Point(x,y));
        if(urr>0) {
          this.lineTo(new $j.classes.Point(x2,y));
          radii=$j.types.canvas.CURVE2KAPPA*urr;
          this.curveTo(new $j.classes.Point(x2+radii,y),new $j.classes.Point(xw,y1-radii),new $j.classes.Point(xw,y1));
          this.lineTo(new $j.classes.Point(xw,y2));
        } else {
          this.lineTo(new $j.classes.Point(xw,y));
          this.lineTo(new $j.classes.Point(xw,yh));
        }
        if(lrr>0) {
          radii=$j.types.canvas.CURVE2KAPPA*lrr;
          this.curveTo(new $j.classes.Point(xw,y2+radii),new $j.classes.Point(x3+radii,yh),new $j.classes.Point(x3,yh));
          this.lineTo(new $j.classes.Point(x4,yh));
        } else {
          this.lineTo(new $j.classes.Point(x,yh));
        } /// ici
        if(llr>0) {
          radii=$j.types.canvas.CURVE2KAPPA*llr;
          this.curveTo(new $j.classes.Point(x4-radii,yh),new $j.classes.Point(x,y3+radii),new $j.classes.Point(x,y3));
          this.lineTo(new $j.classes.Point(x,y4));
        } else {
          this.lineTo(new $j.classes.Point(x,yh));
        }
        if(ulr>0) {
          radii=$j.types.canvas.CURVE2KAPPA*ulr;
          this.curveTo(new $j.classes.Point(x,y4-radii),new $j.classes.Point(x1-radii,y),new $j.classes.Point(x1,y));
        } else {
          this.lineTo(new $j.classes.Point(x,y));
        }
      }
      this.closePath();
    },
    addPie: function PathData_addPie(rect,object) {
      var r=rect,o=object;
      if(!(r instanceof $j.classes.Rect)) return;
      var cx=rx=r.width()*0.5,cy=ry=r.height()*0.5;
      if(!(o instanceof $j.classes.Chord)) this.moveTo(new $j.classes.Point(r.left+cx,r.top+cy));
      this.addArc(new $j.classes.Point(r.left+cx,r.top+cy),new $j.classes.Point(rx,ry),o.startAngle,o.endAngle-o.startAngle);
      //if(o.closed) {
        if(!(o instanceof $j.classes.Chord)) this.lineTo(new $j.classes.Point(r.left+cx,r.top+cy));
        this.closePath();
      //}
    },
    addArc: function PathData_addArc(center,radius,startangle,angle) {
      var c=center,r=radius,sa=startangle,a=angle;
      if(!(c instanceof $j.classes.Point)) return;
      if(!(r instanceof $j.classes.Point)) return;
      if(typeof sa!==_const.NUMBER) return;
      if(typeof a!==_const.NUMBER) return;
      var bezier_arc_angle_epsilon=0.01,usemoveto,i,f,total_sweep,local_sweep,prev_sweep,done;
      sa=_conv.deg2Rad(sa);
      a=_conv.deg2Rad(a);
      i=$j.trunc(sa*0.1591549430918953);
      sa=f=sa-(i*_const._2PI);
      if(a>=_const._2PI) a=_const._2PI;
      if(a<=-_const._2PI) a=-_const._2PI;
      if($j.abs(a)<1e-10) return;
      total_sweep=0;
      done=false;
      usemoveto=true;
      while(!done) {
        if(a<0) {
          prev_sweep=total_sweep;
          local_sweep=-Math.PI*0.5;
          total_sweep=total_sweep-(Math.PI*0.5);
          if(total_sweep<=a+bezier_arc_angle_epsilon) {
            local_sweep=a-prev_sweep;
            done=true;
          }
        } else {
          prev_sweep=total_sweep;
          local_sweep=Math.PI*0.5;
          total_sweep=total_sweep+(Math.PI*0.5);
          if(total_sweep>=a-bezier_arc_angle_epsilon) {
            local_sweep=a-prev_sweep;
            done=true;
          }
        }
        this.drawArcWithBezier(this,c.x,c.y,r.x,r.y,sa,local_sweep,usemoveto);
        usemoveto=false;
        sa+=local_sweep;
      }
    },
    addCallout: function PathData_addCallout(rect,object) {
      var ulr=object.bordersRadius.topLeft,urr=object.bordersRadius.topRight,
          lrr=object.bordersRadius.bottomLeft,llr=object.bordersRadius.bottomRight,
          offset=object.calloutOffset;
      if(!(rect instanceof $j.classes.Rect)) return;
      var rW=rect.width(),rW2=rW/2,x,y,xw,yh,x1,x2,x3,x4,y1,y2,y3,y4,radii,rH=rect.height(),rH2=rH/2,ratio=0,coW2=object.calloutWidth/2;
      ratio=$j.min($j.min(rW/(ulr+urr),rW/(llr+lrr)),$j.min(rH/(ulr+llr),rH/(urr+lrr)));
      if((ratio>0)&&(ratio<1)) {
        ulr*=ratio;
        urr*=ratio;
        llr*=ratio;
        lrr*=ratio;
      }
      x=rect.left;
      y=rect.top;
      xw=x+rW;
      yh=y+rH;
      x1=x+ulr;
      x2=xw-urr;
      x3=xw-lrr;
      x4=x+llr;
      y1=y+urr;
      y2=yh-lrr;
      y3=yh-llr;
      y4=y+ulr;
      if(object.calloutPosition===$j.types.calloutPositions.TOP) {
        this.moveTo(new $j.classes.Point(x1,y+object.calloutLength));
        if(offset!==0) {
          if(offset>rW-x2) offset=rW2-(rW-x2)-coW2;
          else if(offset<x1) offset=-(rW2-x1-coW2);
        }
        this.lineTo(new $j.classes.Point(rW2-coW2+offset,y+object.calloutLength));
        this.lineTo(new $j.classes.Point(rW2+offset,y));
        this.lineTo(new $j.classes.Point(rW2+coW2+offset,y+object.calloutLength));
        this.lineTo(new $j.classes.Point(x2,y+object.calloutLength));
        radii=$j.types.canvas.CURVE2KAPPA*urr;
        this.curveTo(new $j.classes.Point(x2+radii,y+object.calloutLength),new $j.classes.Point(xw,y1-radii+object.calloutLength),new $j.classes.Point(xw,y1+object.calloutLength));
        this.lineTo(new $j.classes.Point(xw,y2));
        radii=$j.types.canvas.CURVE2KAPPA*lrr;
        this.curveTo(new $j.classes.Point(xw,y2+radii),new $j.classes.Point(x3+radii,yh),new $j.classes.Point(x3,yh));
        this.lineTo(new $j.classes.Point(x4,yh));
        radii=$j.types.canvas.CURVE2KAPPA*llr;
        this.curveTo(new $j.classes.Point(x4-radii,yh),new $j.classes.Point(x,y3+radii),new $j.classes.Point(x,y3));
        this.lineTo(new $j.classes.Point(x,y4+object.calloutLength));
        radii=$j.types.canvas.CURVE2KAPPA*ulr;
        this.curveTo(new $j.classes.Point(x,y4-radii+object.calloutLength),new $j.classes.Point(x1-radii,y+object.calloutLength),new $j.classes.Point(x1,y+object.calloutLength));
      } else if(object.calloutPosition===$j.types.calloutPositions.RIGHT) {
        this.moveTo(new $j.classes.Point(x1,y));
        this.lineTo(new $j.classes.Point(x2-object.calloutLength,y));
        radii=$j.types.canvas.CURVE2KAPPA*urr;
        this.curveTo(new $j.classes.Point(x2+radii-object.calloutLength,y),new $j.classes.Point(xw-object.calloutLength,y1-radii),new $j.classes.Point(xw-object.calloutLength,y1));
        if(offset!==0) {
          if(offset>rH-y2) offset=rH2-(rH-y2)-coW2;
          else if(offset<y1) offset=-(rH2-y1-coW2);
        }
        this.lineTo(new $j.classes.Point(xw-object.calloutLength,rH2-coW2+offset));
        this.lineTo(new $j.classes.Point(xw,rH2+offset));
        this.lineTo(new $j.classes.Point(xw-object.calloutLength,rH2+coW2+offset));
        this.lineTo(new $j.classes.Point(xw-object.calloutLength,y2));
        radii=$j.types.canvas.CURVE2KAPPA*lrr;
        this.curveTo(new $j.classes.Point(xw-object.calloutLength,y2+radii),new $j.classes.Point(x3-object.calloutLength+radii,yh),new $j.classes.Point(x3-object.calloutLength,yh));
        this.lineTo(new $j.classes.Point(x4,yh));
        radii=$j.types.canvas.CURVE2KAPPA*llr;
        this.curveTo(new $j.classes.Point(x4-radii,yh),new $j.classes.Point(x,y3+radii),new $j.classes.Point(x,y3));
        this.lineTo(new $j.classes.Point(x,y4));
        radii=$j.types.canvas.CURVE2KAPPA*ulr;
        this.curveTo(new $j.classes.Point(x,y4-radii),new $j.classes.Point(x1-radii,y),new $j.classes.Point(x1,y));
      } else if(object.calloutPosition===$j.types.calloutPositions.BOTTOM) {
        this.moveTo(new $j.classes.Point(x1,y));
        this.lineTo(new $j.classes.Point(x2,y));
        radii=$j.types.canvas.CURVE2KAPPA*urr;
        this.curveTo(new $j.classes.Point(x2+radii,y),new $j.classes.Point(xw,y1-radii),new $j.classes.Point(xw,y1));
        this.lineTo(new $j.classes.Point(xw,y2-object.calloutLength));
        radii=$j.types.canvas.CURVE2KAPPA*lrr;
        this.curveTo(new $j.classes.Point(xw,y2+radii-object.calloutLength),new $j.classes.Point(x3+radii,yh-object.calloutLength),new $j.classes.Point(x3,yh-object.calloutLength));
        if(offset!==0) {
          if(offset>rW-x3) offset=rW2-(rW-x3)-coW2;
          else if(offset<x4) offset=-(rW2-x4-coW2);
        }
        this.lineTo(new $j.classes.Point(rW2+coW2+offset,yh-object.calloutLength));
        this.lineTo(new $j.classes.Point(rW2+offset,yh));
        this.lineTo(new $j.classes.Point(rW2-coW2+offset,yh-object.calloutLength));
        this.lineTo(new $j.classes.Point(x4,yh-object.calloutLength));
        radii=$j.types.canvas.CURVE2KAPPA*llr;
        this.curveTo(new $j.classes.Point(x4-radii,yh-object.calloutLength),new $j.classes.Point(x,y3+radii-object.calloutLength),new $j.classes.Point(x,y3-object.calloutLength));
        this.lineTo(new $j.classes.Point(x,y4));
        radii=$j.types.canvas.CURVE2KAPPA*ulr;
        this.curveTo(new $j.classes.Point(x,y4-radii),new $j.classes.Point(x1-radii,y),new $j.classes.Point(x1,y));
      } else if(object.calloutPosition===$j.types.calloutPositions.LEFT) {
        this.moveTo(new $j.classes.Point(x1+object.calloutLength,y));
        this.lineTo(new $j.classes.Point(x2,y));
        radii=$j.types.canvas.CURVE2KAPPA*urr;
        this.curveTo(new $j.classes.Point(x2+radii,y),new $j.classes.Point(xw,y1-radii),new $j.classes.Point(xw,y1));
        this.lineTo(new $j.classes.Point(xw,y2));
        radii=$j.types.canvas.CURVE2KAPPA*lrr;
        this.curveTo(new $j.classes.Point(xw,y2+radii),new $j.classes.Point(x3+radii,yh),new $j.classes.Point(x3,yh));
        this.lineTo(new $j.classes.Point(x4+object.calloutLength,yh));
        radii=$j.types.canvas.CURVE2KAPPA*llr;
        this.curveTo(new $j.classes.Point(x4-radii+object.calloutLength,yh),new $j.classes.Point(x+object.calloutLength,y3+radii),new $j.classes.Point(x+object.calloutLength,y3));
        if(offset!==0) {
          if(offset>rH-y3) offset=rH2-(rH-y3)-coW2;
          else if(offset<y4) offset=-(rH2-y4-coW2);
        }
        this.lineTo(new $j.classes.Point(x+object.calloutLength,rH2+coW2+offset));
        this.lineTo(new $j.classes.Point(x,rH2+offset));
        this.lineTo(new $j.classes.Point(x+object.calloutLength,rH2-coW2+offset));
        this.lineTo(new $j.classes.Point(x+object.calloutLength,y4));
        radii=$j.types.canvas.CURVE2KAPPA*ulr;
        this.curveTo(new $j.classes.Point(x+object.calloutLength,y4-radii),new $j.classes.Point(x1+object.calloutLength-radii,y),new $j.classes.Point(x1+object.calloutLength,y));
      }
      this.closePath();
    },
    clear: function PathData_clear() {
      this.data.length=0;
      this.onChange.invoke();
    },
    flatten: function PathData_flatten(coef) {
      var bpts,b,len,segCount,oldPathData,curPoint,f,s,bounds,r,v,i,j,l;
      if(typeof coef!==_const.NUMBER) coef=0.25;
      //scale }
      if(this.data.length>0) {
        bounds=this.bounds;
        r=bounds;
        //r.fit(_geo.rect(0,0,100,100)).rect;
        s=$j.min(bounds.width()*0.01,bounds.height()*0.01);
        f=coef*s;
        if(f<0.05) f=0.05;
        //copy data
        if(this.data.length>0) {
          for(i=0,l=this.data.length;i<l;i++) oldPathData.push(this.data[i]);
        }
        this.data.length=0;
        i=0;
        while(i<oldPathData.length) {
          if(oldPathData[i].kind===$j.types.pathPointKinds.MOVETO) {
            this.moveTo(oldPathData[i].point);
            curPoint.assign(oldPathData[i].point);
          } else if(oldPathData[i].kind===$j.types.pathPointKinds.LINETO) {
            this.lineTo(oldPathData[i].point);
            curPoint.assign(oldPathData[i].point);
          } else if(oldPathData[i].kind===$j.types.pathPointKinds.CURVETO) {
            b[0]=curPoint;
            b[1]=oldPathData[i].point;
            i++;
            b[2]=oldPathData[i].point;
            i++;
            b[3]=oldPathData[i].point;
            v=$j.clone(new $j.classes.Point(b[1]));
            v.subtract(new $j.classes.Point(b[3]));
            len=v.length;
            segCount=$j.round(len/f);
            if(segCount<2) segCount=2;
            bpts=this.createBezier(b,segCount);
            if(bpts.length>0) {
              for(j=0,l=bpts.length;j<l;j++) this.lineTo(bpts[j]);
            }
            curPoint.assign(oldPathData[i].point);
          } else if(oldPathData[i].kind===$j.types.pathPointKinds.CLOSE) this.closePath();
          i++;
        }
        this.onChange.invoke();
      }
    },
    scale: function PathData_scale(x,y) {
      if(typeof x!==_const.NUMBER) return;
      if(typeof y!==_const.NUMBER) return;
      if(this.data.length>0) {
        for(var i=0,l=this.data.length;i<l;i++) {
          if((this.data[i].kind===$j.types.pathPointKinds.MOVETO)||(this.data[i].kind===$j.types.pathPointKinds.LINETO)||(this.data[i].kind===$j.types.pathPointKinds.CURVETO)) {
            this.data[i].point.setValues(this.data[i].point.x*x,this.data[i].point.y*y);
          }
        }
      }
    },
    offset: function PathData_offset(x,y) {
      if(this.data.length>0) {
        for(var i=0,l=this.data.length;i<l;i++) {
          if((this.data[i].kind===$j.types.pathPointKinds.MOVETO)||(this.data[i].kind===$j.types.pathPointKinds.LINETO)||(this.data[i].kind===$j.types.pathPointKinds.CURVETO)) {
            this.data[i].point.setValues(this.data[i].point.x+x,this.data[i].point.y+y);
          }
        }
      }
    },
    applyMatrix: function PathData_applyMatrix(matrix) {
      var m=matrix;
      var v;
      if(!(m instanceof $j.classes.Matrix)) return;
      if(this.data.length>0) {
        for(var i=0,l=this.data.length;i<l;i++) {
          if((this.data[i].kind===$j.types.pathPointKinds.MOVETO)||(this.data[i].kind===$j.types.pathPoint.kinds.LINETO)||(this.data[i].kind===$j.types.pathPointKinds.CURVETO)) {
            v=new $j.classes.Vector(this.data[i].point);
            v.transform(m);
            this.data[i].point.setValues(v.x,v.y);
          }
        }
      }
    },
    flattenToPolygon: function PathData_flattenToPolygon(flattenCoef) {
      var i,bpts,b=[],sp,curPoint=new $j.classes.Point(),len,segCount,f=flattenCoef,s,bounds,r=new $j.classes.Rect/*,result=$j.classes.Point.create()*/,polygon=[],v,v1;
      if(typeof f!==_const.NUMBER) f=0.25;
      if(this.data.length>0) {
        bounds=this.bounds();
        r.assign(bounds);
        r.fit(new $j.classes.Rect(0,0,100,100)).rect;
        s=$j.min(bounds.width()*0.01,bounds.height()*0.01);
        f=f*s;
        if(f<0.05) f=0.05;
        i=0;
        while(i<this.data.length) {
          if(this.data[i].kind===$j.types.pathPointKinds.MOVETO) {
            polygon.push(this.data[i].point);
            curPoint.assign(this.data[i].point);
            sp=curPoint;
          } else if(this.data[i].kind===$j.types.pathPointKinds.LINETO) {
            polygon.push(this.data[i].point);
            curPoint.assign(this.data[i].point);
          } else if(this.data[i].kind===$j.types.pathPointKinds.CURVETO) {
            b[0]=curPoint;
            b[1]=this.data[i].point;
            i++;
            b[2]=this.data[i].point;
            i++;
            b[3]=this.data[i].point;
            v=new $j.classes.Vector(b[1].x,b[1].y,1);
            v.subtract(new $j.classes.Vector(b[3].x,b[3].y,1));
            len=v.length();
            segCount=$j.round(len/f);
            if(segCount<2) segCount=2;
            bpts=this.createBezier(b,segCount);
            if(bpts.length>0) {
              for(var j=0,l=bpts.length;j<l;j++) polygon.push(bpts[j]);
            }
            curPoint.assign(this.data[i].point);
          } else if(this.data[i].kind===$j.types.pathPointKinds.CLOSE) {
            polygon.push(sp);
            polygon.push(_const.CLOSEPOLYGON.clone());//� voir
          }
          i++;
        }
        with(this.bounds()) return { Polygon: polygon,Result: new $j.classes.Point($j.abs(width()-left),$j.abs(height()-top)) };
      }
    },
    resizeToRect: function PathData_resizeToRect(rect) {
      var r=rect;
      if(!(r instanceof $j.classes.Rect)) return;
      if(r.empty()) return;
      if(this.empty()) return;
      var b,pathData,i=0,w,h,newW,newH;
      if(!this.bounds().equals(r)) {
        b=this.bounds();
        pathData=this.data;
        w=b.width();
        h=b.height();
        newW=r.width();
        newH=r.height();
        while(i<pathData.length) {
          pathData[i].point.x=r.left+(pathData[i].point.x-b.left)/w*newW;
          pathData[i].point.y=r.top+(pathData[i].point.y-b.top)/h*newH;
          i++;
        }
      }
    },
    reduce: function PathData_reduce(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      if(this.empty()) return;
      var b,pathData,i=0;
      b=this.bounds();
      pathData=this.data;
      while(i<pathData.length) {
        if(pathData[i].point.x>0) pathData[i].point.x-=x;
        if(pathData[i].point.y>0) pathData[i].point.y-=y;
        i++;
      }
    },
    extend: function PathData_extend(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      if(this.empty()) return;
      var b,pathData,i=0;
      b=this.bounds();
      pathData=this.data;
      while(i<pathData.length) {
        if(pathData[i].point.x>0) pathData[i].point.x+=x;
        if(pathData[i].point.y>0) pathData[i].point.y+=y;
        i++;
      }
    },
    inflate: function PathData_inflate(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      if(this.empty()) return;
      var b,pathData,i=0;
      b=this.bounds();
      pathData=this.data;
      while(i<pathData.length) {
        if(pathData[i].point.x>b.width()*0.5) pathData[i].point.x+=x;
        else pathData[i].point.x-=x;
        if(pathData[i].point.y>b.height()*0.5) pathData[i].point.y+=y;
        else pathData[i].point.y-=y;
        i++;
      }
    }
    //#endregion
  });
  //#endregion
  //#region Component
  $j.classes.Component=$j.classes.Bindable.extend({
    _ClassName: "Component",
    init: function Component_init(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      var t=new Date().getTime();
      if(!$j.tools.isNull(owner)) {
        this._inherited();
        //#region Private
        this._componentIndex=-1;
        this._owner=owner;
        this._owners=[];
        this._DOMObj=null;
        this._DOMObjStyle=null;
        this._freeNotifies=[];
        this._components=[];
        this._loading=true;
        this._destroying=false;
        this._designing=false;
        this._updating=false;
        this._freeNotification=false;
        this._designInstance=false;
        this._cssBorder=new $j.classes.Rect;
        this._internalId=String.uniqueId();
        //#endregion
        this.app=null;
        this.form=null;
        this.name=String.empty;
        if(owner instanceof $j.classes.Application) {
          this.app=owner;
          this.app._windows.push(this);
        } else this.app=owner.app;
        this.left=0;
        this.top=0;
        if(owner instanceof $j.classes.Component) {
          this.form=owner.form;
          owner.insertComponent(this);
        } else this.form=this;
        this.tag=null;
        if (owner instanceof $j.classes.Component) {
          this._owners.addRange(owner._owners);
          this._owners.push(owner);
        }
        if ($j.tools.isNull(props)) props={};
        // à modifier avec getOwnPropertyNames
        for (var prop in props) {
          if (this.hasOwnProperty(prop)) {
            this[prop]=props[prop];
          }
        }
        $j.tools.Debugger.log(arguments,this,t);
      }
    },
    //#region Setters
    getComponentIndex:function() {
      if(this._owner&&(this._owner._components.length>0)) return this._owner._components.indexOf(this);
      else return -1;
    },
    setComponentIndex:function(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      if(newValue<0) newValue=0;
      if(this._owner) {
        var i=this._owner._components.indexOf(this);
        if(i>=0) {
          var count=this._owner._components.length;
          if(newValue<0) newValue=0;
          if(newValue>=count) newValue=count-1;
          if(newValue!==i) {
            this._owner._components.splice(i,1);
            this._owner._components.insert(newValue,this);
          }
        }
      }
    },
    //#endregion
    //#region Methods
    setName:function(newValue) {
      if(typeof newValue!==_const.STRING) return;
      if(newValue.trim()===String.empty) return;
      if(this.name!==newValue) {
        //if ((newValue!==String.empty) && !$j.tools.isValidIdent(newValue)) throw $j.errMsg.INVALIDNAME.format(newValue);
        //if (this.owner instanceof $j.classes.Component) this.owner.validateRename(this,this.name,newValue);
        //else this.validateRename(null,this.name,newValue);
        if (this.form!==this){
          if (this.form){
            if (this.form[this.name]) delete this.form[this.name];
          }
        }
        ////if ((this.owner instanceof $j.classes.Control)&&(this instanceof $j.classes.Control)){
        ////  if (this.owner.controlsName.indexOf(this.name)>-1) this.owner.controlsName.remove(this.name);
        ////}
        //this.app.removeName(this);
        this.name=newValue;
        //this.app.addName(this);
        //if (this instanceof $j.classes.Control) this.objName=newValue;
        if(this.form!==this&&this!==this.form._layout&&this!==this.form._content) {
          if(!$j.tools.isNull(this.form)) {
            if(!this.form[this.name]) this.form[this.name]=this;
          }
        }
        //if ((this.owner instanceof $j.classes.Control)&&(this instanceof $j.classes.Control)){
        //  if (this.owner.controlsName.indexOf(this.name)===-1) this.owner.controlsName.push(this.name);
        //}
      }
    },
    removeNotification: function Component_removeNotification(component) {
      var t=new Date().getTime();
      if(this._freeNotifies.length>0) {
        var idx=this._freeNotifies.indexOf(component);
        if(idx>-1) this._freeNotifies.splice(idx,1);
        //if (this._freeNotifies.length===0){
        //  FFreeNotifies.Free;
        //  FFreeNotifies := nil;
        //end;
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    destroy: function Component_destroy() {
      var t=new Date().getTime();
      this.destroying();
      while(this._freeNotifies.length>0) this._freeNotifies[this._freeNotifies.length-1].notification(this,$j.operations.REMOVE);
      //destroy(this._freeNotifies);
      this._freeNotifies.clear();
      //this._freeNotifies=null;
      //delete (this._freeNotifies);
      this.destroyComponents();
      if(!$j.tools.isNull(this._owner)) this._owner.removeComponent(this);
      $j.tools.Debugger.log(arguments,this,t);
      if (this instanceof $j.classes.Control) {
        if (!$j.tools.isNull(this._DOMObj)) this._DOMObj.parentNode.removeChild(this._DOMObj);
        this._DOMObj=null;
      }
      this.app=null;
      this.form=null;
      this.name=null;
      this.left=null;
      this.top=null;
      this.tag=null;
    },
    loaded: function Component_loaded() {
      var t=new Date().getTime(),data;
      if($j.tools.Debugger.debug) console.log(this._ClassName+" loaded");
      this._loading=false;
      for(var i=0,l=this._components.length;i<l;i++) {
        if(!$j.tools.isNull(this._components[i].loaded)) this._components[i].loaded();
      }
      if (!$j.tools.isNull(this._DOMObj)) {
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-popupmenu"):this._DOMObj.dataset.popupmenu;
        if (!$j.tools.isNull(data)) {
          if (!$j.tools.isNull(this.form[data])) {
            if (this.form[data] instanceof $j.classes.PopupMenu) {
              this.popupMenu=this.form[data];
              this.popupMenu._control=this;
            }
          }
        }
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    insert: function Component_insert(component) {
      var t=new Date().getTime();
      if(this._components.indexOf(component)>-1) return;
      if(component instanceof $j.classes.BaseEffect) this.effects.push(component);
      else this._components.push(component);
      component.app=this.app;
      component._owner=this;
      if(this.form!==this) {
        if(component instanceof $j.classes.Component) {
          if (!$j.tools.isNull(this.form)) this.form._controls.push(component);
        }
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    remove: function Component_remove(component) {
      var t=new Date().getTime();
      if(this._components.indexOf(component)===-1) return;
      var idx=this._components.indexOf(component);
      if(idx>-1) this._components.splice(idx,1);
      idx=this.form._controls.indexOf(component);
      this.form._controls[this.form._controls.indexOf(component)]={ controlIdx: component.controlIdx };
      if(this.form[component.name]) {
        if(component.xmlNode) $j.tools.xml.delNode(component.xmlNode);
        this.form[component.name]=null;
        delete this.form[component.name];
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    insertComponent: function Component_insertComponent(component) {
      var t=new Date().getTime();
      if(component._owner) component._owner.removeComponent(component);
      this.insert(component);
      $j.tools.Debugger.log(arguments,this,t);
    },
    removeComponent: function Component_removeComponent(component) {
      var t=new Date().getTime();
      this.validateRename(component,component.name,String.empty);
      this.notification(component,$j.types.operations.REMOVE);
      this.remove(component);
      if(component instanceof $j.classes.Control) {
        if(component.align!==$j.types.aligns.NONE) this.realign();
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    removeFreeNotification: function Component_removeFreeNotification(component) {
      var t=new Date().getTime();
      //this.removeNotification(component);
      //component.removeNotification(this);
      $j.tools.Debugger.log(arguments,this,t);
    },
    notification: function Component_notification(component,operation) {
      var t=new Date().getTime();
      //var args=arguments;
      //if ((operation===$j.types.operations.REMOVE)&&component) this.removeFreeNotification(component);
      //if (this._components.length>0){
      //  var i=this._components.length-1;
      //  while (i>=0){
      //    this._components[i].notification(component,operation);
      //    i--;
      //    if (i>=this._components.length) i=this._components.length-1;
      //  }
      //}
      $j.tools.Debugger.log(arguments,this,t);
    },
    getComponent: function Component_getComponent(index) {
      if((this._components.length===0)||(index>=this._components.length)) {
        throw $j.errMsg.LISTINDEXERROR.format(index);
        //return null;
      }
      return this._components[index];
      $j.tools.Debugger.log(arguments,this,t);
    },
    validateContainer: function Component_validateContainer(component) {
      var t=new Date().getTime();
      component.validateInsert(this);
      $j.tools.Debugger.log(arguments,this,t);
    },
    validateInsert: function Component_validateInsert(component) { },
    beforeDestruction: function Component_beforeDestruction() {
      var t=new Date().getTime();
      if(!this._destroying) this.destroying();
      $j.tools.Debugger.log(arguments,this,t);
    },
    destroyComponents: function Component_destroyComponents() {
      var t=new Date().getTime();
      var instance;
      while(this._components.length>0) {
        instance=this._components.last();
        if(instance._freeNotification) this.removeComponent(instance);
        else this.remove(instance);
        instance.destroy();
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    destroying: function Component_destroying() {
      var t=new Date().getTime();
      if(!this._destroying) {
        this._destroying=true;
        for(var i=0,l=this._components.length;i<l;i++) this._components[i].destroying();
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    findComponent: function Component_findComponent(name) {
      var t=new Date().getTime();
      if(name!==String.empty)
        for(var i=0,l=this._components.length;i<l;i++) {
          var result=this._components[i];
          if(result.name===name) return result;
        }
      $j.tools.Debugger.log(arguments,this,t);
      return null;
    },
    updating: function Component_updating() {
      var t=new Date().getTime();
      this._updating=true;
      $j.tools.Debugger.log(arguments,this,t);
    },
    updated: function Component_updated() {
      var t=new Date().getTime();
      this._updating=false;
      $j.tools.Debugger.log(arguments,this,t);
    },
    validateRename: function Component_validateRename(component,curName,newName) {
      var t=new Date().getTime();
      //if (component&&(curName!==newName)&&(component.owner===this)&&this.findComponent(newName)) throw $j.errMsg.DUPLICATENAME.format(newName);
      if(this.designing&&this._owner) {
        if(!(this._owner instanceof $j.classes.App)) this._owner.validateRename(component,curName,newName);
      }
      $j.tools.Debugger.log(arguments,this,t);
    },
    setChildOrder: function Component_setChildOrder(child,order) { },
    beginUpdate: function Component_beginUpdate() { },
    endUpdate: function Component_endUpdate() { },
    getTemplate:function() {
      var html=$j.classes.getTemplate(this._ClassName),a=html.split("{name}");
      html=a.join(this.name);
      return html;
    },
    getDOMObj:function(id) {
      var data;
      this._DOMObj=$j.doc.getElementById(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._DOMObjStyle=this._DOMObj.style;
        if ($j.tools.isNull(this._DOMObj.jsObj)) this._DOMObj.jsObj=this;
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-name"):this._DOMObj.dataset.name;
        if (!$j.tools.isNull(data)) this.setName(data);
      }
      if ($j.tools.isNull(this._internalId)||this._internalId!==id) {
        this._internalId=id;
      }
    },
    getChildsDOMObj:function() {},
    updateFromDOM: function() {},
    clientToDocument:function() {
      var result=new $j.classes.Point(0,0), bRect=this._DOMObj.getBoundingClientRect();
      result.setValues(bRect.left,bRect.top);
      return result;
    },
    getCSSBorder:function() {
      this._cssBorder.left=parseInt(getComputedStyle(this._DOMObj).borderLeftWidth,10);
      this._cssBorder.top=parseInt(getComputedStyle(this._DOMObj).borderTopWidth,10);
      this._cssBorder.right=parseInt(getComputedStyle(this._DOMObj).borderRightWidth,10);
      this._cssBorder.bottom=parseInt(getComputedStyle(this._DOMObj).borderBottomWidth,10);
    }
    //#endregion
  });
  //#endregion
  //#region SizeConstraints
  $j.classes.SizeConstraints=Class.extend({
    _ClassName: "SizeConstraints",
    init: function(control) {
      if(!(control instanceof $j.classes.Control)) return;
      //#region Private
      this._control=control;
      //#endregion
      this.maxHeight=0;
      this.maxWidth=0;
      this.minHeight=0;
      this.minWidth=0;
      if(!$j.tools.isNull(control)) {
        this.onChange=new $j.classes.NotifyEvent(control);
        this.setControl=function(newValue) {
          if(!(newValue instanceof $j.classes.Control)) return;
          if(newValue!==this._control) {
            this._control=newValue;
            this.onChange.invoke();
          }
        };
        this.setMaxHeight=function(newValue) {
          if(typeof newValue!==_const.NUMBER) return;
          if(newValue!==this.maxHeight) {
            this.maxHeight=newValue;
            this.onChange.invoke();
          }
        };
        this.setMaxWidth=function(newValue) {
          if(typeof newValue!==_const.NUMBER) return;
          if(newValue!==this.maxWidth) {
            this.maxWidth=newValue;
            this.onChange.invoke();
          }
        };
        this.setMinHeight=function(newValue) {
          if(typeof newValue!==_const.NUMBER) return;
          if(newValue!==this.minHeight) {
            this.minHeight=newValue;
            this.onChange.invoke();
          }
        };
        this.setMinWidth=function(newValue) {
          if(typeof newValue!==_const.NUMBER) return;
          if(newValue!==this.minWidth) {
            this.minWidth=newValue;
            this.onChange.invoke();
          }
        };
      }
    },
    //#region Methods
    empty:function() { return (this.maxHeight===0)&&(this.maxWidth===0)&&(this.minHeight===0)&&(this.minWidth===0); },
    setConstraints: function SizeConstraints_setConstraints(index,value) {
      if(typeof index!==_const.NUMBER) return;
      if(typeof value!==_const.NUMBER) return;
      switch(index) {
        case 0:
          if(value!==this.maxHeight) {
            this.maxHeight=value;
            if((value>0)&&(value<this.minHeight)) this.minHeight=value;
            this.change();
          }
          break;
        case 1:
          if(value!==this.maxWidth) {
            this.maxWidth=value;
            if((value>0)&&(value<this.minWidth)) this.minWidth=value;
            this.change();
          }
          break;
        case 2:
          if(value!==this.minHeight) {
            this.minHeight=value;
            if((this.maxHeight>0)&&(value>this.maxHeight)) this.maxHeight=value;
            this.change();
          }
          break;
        case 3:
          if(value!==this.minWidth) {
            this.minWidth=value;
            if((this.maxWidth>0)&&(value>this.maxWidth)) this.maxWidth=value;
            this.change();
          }
          break;
      }
    },
    change: function SizeConstraints_change() { this.onChange.invoke(); },
    setValues: function SizeConstraints_setValues(minWidth,minHeight,maxWidth,maxHeight) {
      if(typeof minWidth!==_const.NUMBER) return;
      if(typeof minHeight!==_const.NUMBER) return;
      if(typeof maxWidth!==_const.NUMBER) return;
      if(typeof maxHeight!==_const.NUMBER) return;
      this.maxHeight=maxHeight;
      this.maxWidth=maxWidth;
      this.minHeight=minHeight;
      this.minWidth=minWidth;
    },
    assignTo: function SizeConstraints_assignTo(dest) {
      if(dest instanceof $j.classes.SizeConstraints) {
        dest.minHeight=this.minHeight;
        dest.maxHeight=this.maxHeight;
        dest.minWidth=this.minWidth;
        dest.maxWidth=this.maxWidth;
        dest.change();
      }
    }
    //#endregion
  });
  //#endregion
  //#region CSSResource
  $j.classes.CSSResource=Class.extend({
    _ClassName: "CSSResource"
    //#region Methods
    //#endregion
  });
  //#endregion
  //#region BaseEffect
  $j.classes.BaseEffect=$j.classes.Component.extend({
    _ClassName: "BaseEffect",
    init: function(owner) {
      this.enabled=false;
      this.trigger=String.empty;
      if(!$j.tools.isNull(owner)) {
        this._inherited(owner);
        this.prepareBeforePaint=false;
        this.applyOnChilds=false;
        this.disablePaint=false;
        this.setEnabled=function(newValue) {
          if(typeof newValue!==_const.BOOLEAN) return;
          if(this.enabled!==newValue) {
            var lastRect=this._owner.screenRect();
            this.enabled=newValue;
            this._owner.form.addControlToRedraw(this._owner);
          }
        };
        this.setTrigger=function(newValue) {
          if(typeof newValue!==_const.STRING) return;
          if(this.trigger!==newValue) {
            this.trigger=newValue;
          }
        };
      }
    },
    //#region Methods
    rect: function BaseEffect_getRect(rect) { },
    applyEffect: function BaseEffect_applyEffect() { },
    applyTrigger: function BaseEffect_applyTrigger(instance,trigger) {
      var startValue=false,line,setter,prop,value;
      if(!instance) return;
      if(this.trigger.toLowerCase().indexOf(trigger.toLowerCase())===-1) return;
      line=this.trigger;
      setter=line.split(';');
      startValue=false;
      while(setter.length>0) {
        prop=setter[0].split('=')[0];
        value=setter[0].split('=')[1];
        if(instance.hasOwnProperty(prop)) {
          startValue=instance[prop].toString().toLowerCase()===value.toLowerCase();
        }
        setter.removeAt(0);
      }
      this.enabled=startValue;
    }
    //#endregion
  });
  //#endregion
  //#region AnimatedCursor
  $j.classes.AnimatedCursor=Class.extend({
    _ClassName: "AnimatedCursor",
    init: function() {
      this._DOMObj=null;
      this._maxFrame=null;
      this._curFrame=null;
      this._className=null;
      this._iterationBetweenFrames=0;
      this._iteration=0;
    },
    //#region Methods
    processTick: function AnimatedCursor_processTick(elapsedTime) {
      if (this._iterationBetweenFrames>0) {
        if (this._iteration<this._iterationBetweenFrames) {
          this._iteration++;
          //console.log("frame skipped");
          return;
        }
      }
      //console.log("rendering frame");
      $j.CSS.removeClass(this._DOMObj,this._className+this._curFrame);
      this._curFrame++;
      if(this._curFrame>this._maxFrame) this._curFrame=0;
      $j.CSS.addClass(this._DOMObj,this._className+this._curFrame);
      this._iteration=0;
    },
    initAnimation: function AnimatedCursor_initAnimation(domObj,className) {
      var theme=domObj.jsObj.form.getThemeName();
      this._DOMObj=domObj;
      this._className=className;
      this._curFrame=0;
      $j.CSS.removeClass(this._DOMObj,this._className);
      $j.CSS.addClass(this._DOMObj,this._className+this._curFrame);
      this._maxFrame=~~$j.CSS.getCSSValue(this._className+this._curFrame+'[data-theme="'+theme+'"]',$j.browser.getVendorPrefixedCssProperty("animation-iteration-count"),null,theme);
      this._iterationBetweenFrames=parseInt($j.CSS.getCSSValue(this._className+this._curFrame+'[data-theme="'+theme+'"]',$j.browser.getVendorPrefixedCssProperty("animation-duration"),null,theme),10)|0;
      //console.log(this._maxSkippedFrames);
      $j.looper.addListener(this);
    },
    stopAnimation: function AnimatedCursor_stopAnimation() {
      $j.looper.removeListener(this);
      $j.CSS.removeClass(this._DOMObj,this._className+this._curFrame);
    }
    //#endregion Methods
  });
  //#endregion
  //#region DataSet
  $j.classes.DataSet=$j.classes.Component.extend({
    _ClassName:"DataSet",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._datas=null;
        this._cursorIdx=-1;
        this._cursor=null;
        this._nbrFields=0;
        this._nbrRecords=0;
        this._keyValues=String.empty;
        //#endregion
        this.dataSource=null;
        this.active=false;
        this.activeOnLoad=true;
        this.isOpen=false;
        this.keyFields=String.empty;
      }
    },
    //#region Setters
    setKeyFields:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.keyFields!==newValue) {
        this.keyFields=newValue;
        this.dataSource.refreshControls();
      }
    },
    setActive:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.active!==newValue) {
        this.active=newValue;
        if (this.active) this.open();
        else this.close();
        this._cursorIdx=0;
        this.getKeyValues();
      }
    },
    //#endregion
    //#region Methods
    open:function() {
      if (!$j.tools.isNull(this._datas)) {
        this._cursorIdx=0;
        this._cursor=this._datas[this._cursorIdx];
        this.isOpen=true;
        this.dataSource.refreshControls();
      }
    },
    close:function() {
      this.isOpen=false;
      this._cursorIdx=-1;
      this._keyValues=String.empty;
      this.dataSource.refreshControls();
    },
    next:function() {
      this._cursorIdx++;
      if (this._cursorIdx>this._nbrRecords) this._cursorIdx=this._nbrRecords-1;
      this.getKeyValues();
      this.dataSource.refreshControls();
    },
    prev:function() {
      this._cursorIdx--;
      if (this._cursorIdx<0) this._cursorIdx=0;
      this.getKeyValues();
      this.dataSource.refreshControls();
    },
    first:function() {
      this._cursorIdx=0;
      this.getKeyValues();
      this.dataSource.refreshControls();
    },
    last:function() {
      this._cursorIdx=this._nbrRecords-1;
      this.getKeyValues();
      this.dataSource.refreshControls();
    },
    hasKeyfield:function() {
      return !this.keyFields.isEmpty();
    },
    getKeyValues:function() {
      var keyFields,i,l,cursor;
      if (this.keyFields!==String.empty) {
        keyFields=this.keyFields.split(",");
        cursor=this._datas[this._cursorIdx];
        this._keyValues=String.empty;
        for (i=0,l=keyFields.length;i<l;i++) {
          if (!$j.tools.isNull(cursor[keyFields[i]])) {
            if (i>0) this._keyValues+="|";
            this._keyValues+=cursor[keyFields[i]];
          }
        }
      }
    },
    goToCurrentCursor:function() {
      var keyValues=this._keyValues,keyValue=String.empty,keyFields=this.keyFields.split(","),idx=-1,currentCursor=this._datas.filter(
        function(e,i,a){
          var ret=false;
          keyValue=String.empty;
          for (var j=0,l=keyFields.length;j<l;j++) {
            if (j>0) keyValue+="|";
            keyValue+=e[keyFields[j]];
          }
          if (keyValue===keyValues) {
            ret=true;
            idx=i;
          }
          return ret;
        }
      );
      this._cursorIdx=idx;
      this._cursor=this._datas[this._cursorIdx];
    },
    sortByString:function(col,order) {
      return function(a,b) {
        var fieldsNames=Object.keys(a);
        a=a[fieldsNames[col]];
        fieldsNames=Object.keys(b);
        b=b[fieldsNames[col]];
        if (order===$j.types.sortedOrders.ASC) {
          return a===b?0:(a<b?-1:1);
        } else {
          return a===b?0:(a<b?1:-1);
        }
      }
    },
    sortByDate:function(col,order) {
      return function(a,b) {
        var fieldsNames=Object.keys(a);
        a=a[fieldsNames[col]];
        fieldsNames=Object.keys(b);
        b=b[fieldsNames[col]];
        if (order===$j.types.sortedOrders.ASC) {
          return a===b?0:(a<b?-1:1);
        } else {
          return a===b?0:(a<b?1:-1);
        }
      }
    },
    sortByNumber:function(col,order) {
      return function(a,b) {
        var fieldsNames=Object.keys(a);
        a=parseFloat(a[fieldsNames[col]]);
        fieldsNames=Object.keys(b);
        b=parseFloat(b[fieldsNames[col]]);
        if (order===$j.types.sortedOrders.ASC) {
          return a===b?0:(a<b?-1:1);
        } else {
          return a===b?0:(a<b?1:-1);
        }
      }
    },
    sortByBoolean:function(col,order) {
      return function(a,b) {
        var fieldsNames=Object.keys(a);
        if (typeof a[fieldsNames[col]]===_const.BOOLEAN) a=a[fieldsNames[col]];
        else a=_const.strToBool(a[fieldsNames[col]].toString());
        fieldsNames=Object.keys(b);
        if (typeof b[fieldsNames[col]]===_const.BOOLEAN) b=b[fieldsNames[col]];
        else b=_const.strToBool(b[fieldsNames[col]].toString());
        if (order===$j.types.sortedOrders.ASC) {
          return a===b?0:(a<b?-1:1);
        } else {
          return a===b?0:(a<b?1:-1);
        }
      }
    }
    //#endregion
  });
  //#endregion
})();