//TODO : finir MenuItem
(function(){
  //#region MenuItem
  var MenuItem=$j.classes.Component.extend({
    _ClassName: "MenuItem",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._owner=owner;
        this._internalId=String.uniqueId();
        this._inMainMenu=false;
        this._parentPopupMenu=null;
        this._domCaption=null;
        this._domShortcut=null;
        this._domHasSubMenu=null;
        //#endregion
        this.caption=String.empty;
        this.shortcut=String.empty;
        this.enabled=true;
        this.visible=true;
        this.isChecked=false;
        this.isRadioItem=false;
        this.groupIndex=0;
        this.imageIndex=-1;
        this.hint=String.empty;
        this.items=[];
        this.onClick=new $j.classes.NotifyEvent(this);
        this.autoCheck=false;
        this.popupMenu=null;
        this.form=owner.form;
        this.active=false;
      }
    },
    //#region Setters
    setCaption:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.caption!==newValue) {
        this.caption=newValue;

      }
    },
    setShortcut:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.shortcut!==newValue) {
        this.shortcut=newValue;

      }
    },
    setEnabled:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.enabled!==newValue) {
        this.enabled=newValue;

      }
    },
    setVisible:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.visible!==newValue) {
        this.visible=newValue;

      }
    },
    setIsChecked:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.isChecked!==newValue) {
        if(newValue) this.isChecked=newValue;
        var list=this._owner.items,c=0,cc=0;
        for(var i=0,l=list.length;i<l;i++)
          if(list[i] instanceof $j.classes.MenuItem&&(list[i]!==this)&&(list[i].groupIndex===this.groupIndex)) {
            if(list[i].isChecked) cc++;
            if(newValue) list[i].setIsChecked(false);
            c++;
          }
        list=null;
        // check 
        if(!newValue&&(c===0)) return;
        if(!newValue&&(cc===0)) return;
        this.isChecked=newValue;
      }
    },
    setIsRadioItem:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.isRadioItem!==newValue) {
        this.isRadioItem=newValue;

      }
    },
    setGroupItem:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.groupIndex!==newValue) {
        this.groupIndex=newValue;

      }
    },
    setImageIndex:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.imageIndex!==newValue) {
        this.imageIndex=newValue;

      }
    },
    setHint:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.hint!==newValue) {
        this.hint=newValue;

      }
    },
    setAutoCheck:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.autoCheck!==newValue) {
        this.autoCheck=newValue;

      }
    },
    setActive:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.active!==newValue) {
        this.active=newValue;
        if (!$j.tools.isNull(this._DOMObj)) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-active",newValue);
          else this._DOMObj.dataset.active=newValue;
        }
      }
    },
    //#endregion
    //#region Methods
    insert:function(index,item) {
    },
    delete:function(index) {
    },
    clear:function() {
      var i,l;
      l=this.items.length-1;
      for (i=l;i>=0;i--) {
        this.items[i].clear();
        this.items[i].destroy();
      }
      this.items.clear();
      this.destroySubMenu();
      if (!$j.tools.isNull(this._domHasSubMenu)) {
        if ($j.browser.ie) this._domHasSubMenu.setAttribute("data-visible","false");
        this._domHasSubMenu.dataset.visible=false;
      }
    },
    find:function(caption) {
      var i,l;
      if (typeof caption!==_const.STRING) return;
      caption=caption.split(_const.HOTKEYPREFIX).join(String.empty);
      l=this.items.length;
      for (i=0;i<l;i++) {
        if (caption===this.items[i].caption.split(_const.HOTKEYPREFIX).join(String.empty)) {
          return this.items[i];
        }
      }
      return null;
    },
    indexOf:function(item) {
      return this.items.indexOf(item);
    },
    isLine:function() {
      return this.caption===_const.LINECAPTION;
    },
    insertNewLine:function(before,item) {
      if (!$j.tools.isNull(before)) before=false;
      if (before) this.insertNewLineBefore(item);
      else this.insertNewLineAfter(item);
    },
    insertNewLineBefore:function(item) {
    },
    insertNewLineAfter:function(item) {
    },
    add:function(item) {
    },
    addItemsFromArray:function(itemsArray) {
    },
    removeItem:function(item) {
      if (!(item instanceof $j.classes.MenuItem)) return;
      if (this.items.indexOf(item)===-1) return;
      this.item.remove(item);
    },
    showSubMenu:function() {
      var left=0,top=0;
      if ($j.tools.isNull(this.popupMenu)) {
        if (this._owner instanceof $j.classes.MainMenu) {
          var pt=this.clientToDocument();
          left=pt.x;
          top=pt.y+this._owner.form.menu._DOMObj.offsetHeight;
        } else {
          left=this._parentPopupMenu._DOMObj.offsetLeft+this._DOMObj.offsetWidth;
          top=this._parentPopupMenu._DOMObj.offsetTop+this._DOMObj.offsetTop;
        }
        this.popupMenu=$j.classes.createComponent($j.classes.PopupMenu,this,null,{"left":left,"top":top},false);
        if (this._owner instanceof $j.classes.MainMenu) {
          if (this._owner.images instanceof $j.classes.ImageList) this.popupMenu.images=this._owner.images;
        } else {
          this.popupMenu.images=this._parentPopupMenu._DOMObj.images;
          this.popupMenu._zIndex=this._parentPopupMenu._DOMObj._zIndex+1;
        }
        this.popupMenu._control=this;
        this.popupMenu.items=this.items;
        this.popupMenu.show(left,top);
      }
      this.setActive(true);
    },
    text:function() {
      return $j.tools.text.replace(this.caption,_const.HOTKEYPREFIX,String.empty);
    },
    captionToHTML:function() {
      var idx=this.caption.indexOf(_const.HOTKEYPREFIX);
      if (idx>-1) return this.caption.substr(0,idx)+"<u>"+this.caption.substr(idx+1,1)+"</u>"+this.caption.substr(idx+2,this.caption.length-idx+2);
      else return this.caption;
    },
    click:function(mouseEventArg) {
      var jsObj=this.jsObj;
      if (jsObj._inMainMenu) {
        if (jsObj._inMainMenu) jsObj.form.mainMenu._isActive=true;
        jsObj.form.destroyPopups();
      }
      if (jsObj.items.length>0) {
        if ($j.tools.isNull(jsObj.popupMenu)) jsObj.showSubMenu();
      } else {
        jsObj.onClick.invoke();
        $j.mouse.stopEvent(mouseEventArg);
        jsObj.form.destroyPopups();
        jsObj.form.mainMenu._isActive=false;
        if (jsObj.autoCheck) {
          jsObj.setIsChecked(!jsObj.isChecked);
        }
      }
    },
    getTemplate:function() {
      var html,a,theme=this.form.getThemeName(),popupMenu=null;
      if (this.caption===_const.LINECAPTION) {
        html=$j.templates["MenuItemSep"];
      } else {
        html=this._inherited();
        a=html.split("{caption}");
        a.insert(a.length-1,this.captionToHTML());
        html=a.join(String.empty);
        a=html.split("{asChilds}");
        if (this.items.length>0) a.insert(a.length-1,"true");
        else a.insert(a.length-1,"false");
        html=a.join(String.empty);
        a=html.split("{shortcut}");
        a.insert(a.length-1,this.shortcut);
        html=a.join(String.empty);
      }
      a=html.split("{internalId}")
      a.insert(a.length-1,this._internalId);
      html=a.join(String.empty);
      a=html.split("{theme}");
      for (var i=0,l=a.length;i<l-1;i++) {
        a[i]+=theme;
      }
      html=a.join(String.empty);
      if (this._owner instanceof $j.classes.PopupMenu) popupMenu=this._owner;
      else if (this._owner.popupMenu instanceof $j.classes.PopupMenu) popupMenu=this._owner.popupMenu;
      if (!$j.tools.isNull(popupMenu.images)) {
        if (!$j.tools.isNull(this.imageIndex>-1&&popupMenu.images.images[this.imageIndex])) {
          a=html.split("{icon}");
          a.insert(a.length-1,"style='background-image:url(\""+popupMenu.images.images[this.imageIndex]+"\");background-size:"+
            popupMenu.images.width+$j.types.CSSUnits.PX+String.SPACE+popupMenu.images.height+$j.types.CSSUnits.PX+"'");
          html=a.join(String.empty);
        }
      }
      return html;
    },
    destroySubMenu:function() {
      if (!$j.tools.isNull(this.popupMenu)) {
        this.popupMenu.destroy();
        this.popupMenu=null;
      }
      this.setActive(false);
    },
    DOMmouseEnter:function(mouseEventArg) {
      var jsObj=this.jsObj,popupMenu,i,items,l;
      if (jsObj._inMainMenu&&jsObj.form.mainMenu._isActive) {
        jsObj.form.destroyPopups();
        jsObj.form._lastSelectedMenuItem=null;
        jsObj.showSubMenu();
      } else if (!$j.tools.isNull(jsObj.form._lastSelectedMenuItem)) {
        if (jsObj.form._lastSelectedMenuItem.items.length>0) {
          if (!$j.tools.isNull(jsObj.form._lastSelectedMenuItem.popupMenu)) {
            if (jsObj.form._lastSelectedMenuItem.popupMenu!==jsObj._parentPopupMenu) {
              jsObj.form._lastSelectedMenuItem.destroySubMenu();
              jsObj.form._lastSelectedMenuItem.setActive(false);
            }
          }
        }
        i=jsObj.form._popups.length-1;
        if (jsObj.form._popups.length>0) {
          if (jsObj!==jsObj.form._popups.last()._control) {
            if (jsObj.form._popups.indexOf(jsObj._parentPopupMenu)>-1) {
              while (jsObj.form._popups[i]!==jsObj._parentPopupMenu) {
                if (!$j.tools.isNull(jsObj.form._popups[i])) {
                  if (jsObj.form._popups[i]._control instanceof $j.classes.Control) jsObj.form._popups[i].destroy();
                  else jsObj.form._popups[i]._control.destroySubMenu();
                  jsObj.form._popups.removeAt(i);
                }
                i--;
              }
            }
          }
        }
        if (!$j.tools.isNull(jsObj._parentPopupMenu)) {
          items=jsObj._parentPopupMenu.items.filter(function(el) {
            return el.active;
          });
        }
      }
      if ($j.tools.isNull(jsObj.popupMenu)&&jsObj.items.length>0) {
        if (!jsObj._inMainMenu) jsObj.showSubMenu();
      }
    },
    DOMmouseLeave:function(mouseEventArg) {
      var jsObj=this.jsObj;
      if (!$j.tools.isNull(jsObj)) jsObj.form._lastSelectedMenuItem=jsObj;
    },
    destroy:function() {
      if ($j.tools.isNull(this._DOMObj)) return;
      this._DOMObj.jsObj=null;
      if (!$j.tools.isNull(this._DOMObj)) {
        $j.tools.events.unBind(this._DOMObj,$j.types.mouseEvents.CLICK,this.click);
        $j.tools.events.unBind(this._DOMObj,$j.types.mouseEvents.ENTER,this.DOMmouseEnter);
        $j.tools.events.unBind(this._DOMObj,$j.types.mouseEvents.LEAVE,this.DOMmouseLeave);
        if (!$j.tools.isNull(this._domCaption)) this._domCaption.remove();
        if (!$j.tools.isNull(this._domShortcut)) this._domShortcut.remove();
        if (!$j.tools.isNull(this._domHasSubMenu)) this._domHasSubMenu.remove();
        if (!$j.tools.isNull(this.popupMenu)) this.popupMenu.destroy();
        this._domCaption=null;
        this._domShortcut=null;
        this._domHasSubMenu=null;
        this.popupMenu=null;
        this._parentPopupMenu=null;
      }
      this._DOMObj.parentNode.removeChild(this._DOMObj);
      this._DOMObj=null;
      for (var i=0,l=this.items.length;i<l;i++) {
        this.items[i].destroy();
        this.items[i]=null;
      }
      this.items.clear();
      this._inherited();
    },
    isEnabled:function() {
      return this._owner.enabled;
    },
    getChildsDOMObj:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._domCaption=this._DOMObj.firstElementChild;
        this._domShortcut=this._domCaption.nextSibling;
        while (this._domShortcut.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._domShortcut=this._domShortcut.nextSibling;
        }
        this._domHasSubMenu=this._DOMObj.lastElementChild;
      }
    }
  //#endregion
  });
  //#endregion
  //#region MainMenu
  var MainMenu=$j.classes.Component.extend({
    _ClassName:"MainMenu",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._isActive=false;
        //#endregion
        this.items=[];
        this.images=null;
        owner.form.menu=this;
      }
    },
    //#region Methods
    getChildsDOMObj:function() {
      var items,item,queue=[],parent=null,nodes=[],i,l,cdata,top,data;
      // on va chercher les items dans le CDATA
      cdata=this._DOMObj.firstElementChild;
      if (!$j.tools.isNull(cdata)) {
        while (cdata.nodeType!==$j.types.xmlNodeTypes.COMMENT_NODE) {
          cdata=cdata.nextSibling;
        }
        if (cdata.nodeValue!==String.empty&&!$j.tools.isNull(cdata.nodeValue)) items=JSON.parse(cdata.nodeValue);
      }
      l=items.length;
      i=0;
      Array.prototype.push.apply(nodes,items);
      while (!nodes.isEmpty()) {
        top=nodes.shift();
        item=new $j.classes.MenuItem(($j.tools.isNull(parent))?this:parent);
        item.name=top.name;
        item.caption=top.caption;
        item.shortcut=top.shortcut;
        item.enabled=top.enabled;
        item.visible=top.visible;
        item.imageIndex=top.imageIndex;
        if (!$j.tools.isNull(top.isChecked)) item.isChecked=top.isChecked;
        if (!$j.tools.isNull(top.autoCheck)) item.autoCheck=top.autoCheck;
        if (!$j.tools.isNull(top.isRadioItem)) item.isRadioItem=top.isRadioItem;
        if (!$j.tools.isNull(top.onClick)) {
          if (typeof this.form[top.onClick]===_const.FUNCTION) item.onClick.addListener(this.form[top.onClick]);
          else if (typeof top.onClick===_const.STRING) {
            if (top.onClick!==String.empty) item.onClick.addListener(new Function(top.onClick));
          }
        }
        item.form=this.form;
        if (item.name!==String.empty) item.form[item.name]=item;
        if (!$j.tools.isNull(parent)) parent.items.push(item);
        else this.items.push(item);
        if (top.items.length>0) {
          queue.push({"parent":parent,"items":nodes});
          parent=item;
          nodes=top.items;
        }
        if (nodes.isEmpty()&&!queue.isEmpty()) {
          nodes=queue.pop();
          parent=nodes.parent;
          nodes=nodes.items;
        }
      }
      // on va chercher les items visibles
      if (this._DOMObj.childNodes.length>0) {
        top=0;
        for (i=0,l=this._DOMObj.childNodes.length;i<l;i++) {
          node=this._DOMObj.childNodes[i];
          if (node.nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
            item=this.items[top];
            item.caption=$j.tools.text.replace($j.tools.text.replace(node.firstElementChild.innerHTML,"<u>","&"),"</u>",String.empty);
            data=($j.browser.ie)?node.getAttribute("data-visible"):node.dataset.visible;
            if (!$j.tools.isNull(data)) item.visible=_conv.strToBool(data);
            data=($j.browser.ie)?node.getAttribute("data-enabled"):node.dataset.enabled;
            if (!$j.tools.isNull(data)) item.enabled=_conv.strToBool(data);
            data=($j.browser.ie)?node.getAttribute("data-ischecked"):node.dataset.ischecked;
            if (!$j.tools.isNull(data)) item.isChecked=_conv.strToBool(data);
            data=($j.browser.ie)?node.getAttribute("data-isradioitem"):node.dataset.isradioitem;
            if (!$j.tools.isNull(data)) item.isRadioItem=_conv.strToBool(data);
            data=($j.browser.ie)?node.getAttribute("data-groupindex"):node.dataset.groupindex;
            if (!$j.tools.isNull(data)) item.groupIndex=~~data;
            data=($j.browser.ie)?node.getAttribute("data-imageindex"):node.dataset.imageindex;
            if (!$j.tools.isNull(data)) item.imageIndex=~~data;
            data=($j.browser.ie)?node.getAttribute("data-hint"):node.dataset.hint;
            if (!$j.tools.isNull(data)) item.hint=data;
            data=($j.browser.ie)?node.getAttribute("data-autocheck"):node.dataset.autocheck;
            if (!$j.tools.isNull(data)) item.autoCheck=_conv.strToBool(data);
            node.jsObj=item;
            item._DOMObj=node;
            item.getChildsDOMObj();
            item._inMainMenu=true;
            $j.tools.events.bind(node,$j.types.mouseEvents.CLICK,item.click);
            $j.tools.events.bind(node,$j.types.mouseEvents.ENTER,item.DOMmouseEnter);
            top++;
          }
        }
      }
    },
    updateFromDOM:function() {
      this.left=this._DOMObj.offsetLeft;
      this.top=this._DOMObj.offsetTop;
      this.width=this._DOMObj.clientWidth;
      this.height=this._DOMObj.clientHeight;
      this.getImages();
    },
    destroy:function() {
      if ($j.tools.isNull(this.images)) this.images.destroy();
      this.images=null;
      this._owner.form.menu=null;
      for (var i=0,l=this.items.length;i<l;i++) {
        if (!$j.tools.isNull(this.items[i])) this.items.destroy();
        this.items[i]=null;
      }
      this.items.clear();
      this._inherited();
    },
    getImages:function() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-images"):this._DOMObj.dataset.images;
      if (!$j.tools.isNull(data)) {
        if (!$j.tools.isNull(this.form[data])) {
          this.images=this.form[data];
        }
      }
    },
    isEnabled:function() {
      return this.enabled;
    }
    //#endregion
  });
  Object.seal(MainMenu);
  //#endregion
  //#region PopupMenu
  var PopupMenu=$j.classes.PopupBox.extend({
    _ClassName:"PopupMenu",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._zIndex=10000;
        this._direction=$j.types.directions.RIGHT;
        //#endregion
        this.images=null;
        this.items=[];
      }
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{items}"),item,tpl;
      for (var i=0,l=this.items.length;i<l;i++) {
        item=this.items[i];
        tpl=item.getTemplate();
        a.insert(a.length-1,tpl);
      }
      html=a.join(String.empty);
      return html;
    },
    destroy:function() {
      if ($j.tools.isNull(this.form)) return;
      for (var i=0,l=this.items.length;i<l;i++) {
        var item=this.items[i];
        item.setActive(false);
        item._DOMObj.jsObj=null;
        $j.tools.events.unBind(item._DOMObj,$j.types.mouseEvents.CLICK,item.click);
        $j.tools.events.unBind(item._DOMObj,$j.types.mouseEvents.ENTER,item.mouseEnter);
        $j.tools.events.unBind(item._DOMObj,$j.types.mouseEvents.LEAVE,item.mouseLeave);
        item._DOMObj.parentNode.removeChild(item._DOMObj);
        item._DOMObj=null;
      }
      this._DOMObj.removeChild(this._DOMObj.firstElementChild);
      this.form._popups.remove(this);
      this._inherited();
      this._control=null;
    },
    getChildsDOMObj:function() {
      var items,item,queue=[],parent=null,nodes=[],i,l,cdata,top;
      if (!$j.tools.isNull(this._DOMObj)) {
        // on va chercher les items dans le CDATA
        cdata=this._DOMObj.childNodes;
        for (var i=0,l=cdata.length;i<l;i++) {
          if (cdata[i].nodeType===$j.types.xmlNodeTypes.COMMENT_NODE) {
            if (cdata[i].nodeValue!==String.empty&&!$j.tools.isNull(cdata[i].nodeValue)) {
              items=JSON.parse(cdata[i].nodeValue);
              break;
            }
          }
        }
        l=items.length;
        i=0;
        Array.prototype.push.apply(nodes,items);
        while (!nodes.isEmpty()) {
          top=nodes.shift();
          item=new $j.classes.MenuItem(($j.tools.isNull(parent))?this:parent);
          item.name=top.name;
          item.caption=top.caption;
          item.shortcut=top.shortcut;
          item.enabled=top.enabled;
          item.visible=top.visible;
          item.imageIndex=top.imageIndex;
          if (!$j.tools.isNull(top.isChecked)) item.isChecked=top.isChecked;
          if (!$j.tools.isNull(top.autoCheck)) item.autoCheck=top.autoCheck;
          if (!$j.tools.isNull(top.isRadioItem)) item.isRadioItem=top.isRadioItem;
          if (!$j.tools.isNull(top.onClick)) {
            if (typeof this.form[top.onClick]===_const.FUNCTION) item.onClick.addListener(this.form[top.onClick]);
            else if (typeof top.onClick===_const.STRING) {
              if (top.onClick!==String.empty) item.onClick.addListener(new Function(top.onClick));
            }
          }
          item.form=this.form;
          if (item.name!==String.empty) item.form[item.name]=item;
          if (!$j.tools.isNull(parent)) parent.items.push(item);
          else this.items.push(item);
          if (top.items.length>0) {
            queue.push({"parent":parent,"items":nodes});
            parent=item;
            nodes=top.items;
          }
          if (nodes.isEmpty()&&!queue.isEmpty()) {
            nodes=queue.pop();
            parent=nodes.parent;
            nodes=nodes.items;
          }
        }
      }
    },
    loaded:function() {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._DOMObj.jsObj=null;
        this._DOMObj.parentNode.removeChild(this._DOMObj);
        this._DOMObj=null;
      }
    },
    show:function(x,y) {
      if (!$j.tools.isNull(x)) this.left=x;
      if (!$j.tools.isNull(y)) this.top=y;
      this._inherited(x,y);
      this._direction=$j.types.directions.RIGHT;
      for (var i=0,l=this.items.length;i<l;i++) {
        var item=this.items[i];
        item._DOMObj=$j.doc.getElementById(item._internalId);
        item._DOMObj.jsObj=item;
        if ($j.browser.ie) {
          item._DOMObj.setAttribute("data-ischecked",item.isChecked);
          item._DOMObj.setAttribute("data-isradioitem",item.isRadioItem);
        } else {
          item._DOMObj.dataset.ischecked=item.isChecked;
          item._DOMObj.dataset.isradioitem=item.isRadioItem;
        }
        item._parentPopupMenu=this;
        if (item.caption!==_const.LINECAPTION) {
          item._domCaption=item._DOMObj.firstElementChild;
          item._domShortcut=item._domCaption.nextSibling;
          while (item._domShortcut.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
            item._domShortcut=item._domShortcut.nextSibling;
          }
          item._domHasSubMenu=item._DOMObj.lastElementChild;
        }
        $j.tools.events.bind(item._DOMObj,$j.types.mouseEvents.CLICK,item.click);
        $j.tools.events.bind(item._DOMObj,$j.types.mouseEvents.ENTER,item.DOMmouseEnter);
        $j.tools.events.bind(item._DOMObj,$j.types.mouseEvents.LEAVE,item.DOMmouseLeave);
      }
      if (this._DOMObj.offsetTop+this._DOMObj.offsetHeight>$j.doc.body.offsetHeight) {
        if (this._control instanceof $j.classes.MenuItem) {
          this._DOMObj.style[$j.types.jsCSSProperties.TOP]=(this._DOMObj.offsetTop-this._DOMObj.offsetHeight+this._control._DOMObj.offsetHeight)+$j.types.CSSUnits.PX;
        } else this._DOMObj.style[$j.types.jsCSSProperties.TOP]=($j.doc.body.offsetHeight-this._DOMObj.offsetHeight-5)+$j.types.CSSUnits.PX;
      }
      if (!(this._control instanceof $j.classes.MenuItem)) {
        if (this._DOMObj.offsetLeft+this._DOMObj.offsetWidth>$j.doc.body.offsetWidth) {
          this._DOMObj.style[$j.types.jsCSSProperties.LEFT]="0"+$j.types.CSSUnits.PX;
          this._DOMObj.style[$j.types.jsCSSProperties.LEFT]=($j.doc.body.offsetWidth-this._DOMObj.offsetWidth-5)+$j.types.CSSUnits.PX;
          this._direction=$j.types.directions.LEFT;
        }
      } else {
        if (!$j.tools.isNull(this._control._parentPopupMenu)) this._direction=this._control._parentPopupMenu._direction;
        if (this._DOMObj.offsetLeft+this._DOMObj.offsetWidth>$j.doc.body.offsetWidth) this._direction=$j.types.directions.LEFT;
        // on part de droite à gauche
        if (this._direction===$j.types.directions.LEFT) {
          this._DOMObj.style[$j.types.jsCSSProperties.LEFT]="0"+$j.types.CSSUnits.PX;
          this._DOMObj.style[$j.types.jsCSSProperties.LEFT]=(this._control._parentPopupMenu._DOMObj.offsetLeft-this._DOMObj.offsetWidth)+$j.types.CSSUnits.PX;
        }
      }
      this._DOMObj.style[$j.types.jsCSSProperties.ZINDEX]=this._zIndex;
      $j.CSS.addClass(this._DOMObj,"animated fadeIn");
    }
  });
  //#endregion
  $j.classes.register($j.types.categories.MENUS,MenuItem,MainMenu,PopupMenu);
  //#region Templates
  var MainMenuTpl="<div id='{internalId}' data-name='{name}' data-class='MainMenu' class='MainMenu' data-theme='{theme}'></div>",
      MenuItemTpl=["<div id='{internalId}' class='MenuItem' data-theme='{theme}'>",
                   "<span class='MenuItemCaption' data-theme='{theme}' {icon}>{caption}</span>",
                   "<span class='MenuItemShortCut' data-theme='{theme}'>{shortcut}</span>",
                   "<span class='MenuItemHasSubMenu' data-theme='{theme}' data-visible='{asChilds}'></span>",
                   "</div>"].join(String.empty),
      PopupMenuTpl=["<div id='{internalId}' data-name='{name}' data-class='PopupMenu' class='PopupMenu PopupBox csr_default animated' data-theme='{theme}' style='{style}'>",
                    "<div class='subMenu' data-theme='{theme}'>",
                    "{items}",
                    "<div>",
                    "</div>"].join(String.empty),
      MenuItemSepTpl="<div id='{internalId}' class='MenuItemSep' data-theme='{theme}'></div>";
  $j.classes.registerTemplates([{Class:MenuItem,template:MenuItemTpl},{Class:MainMenu,template:MainMenuTpl},{Class:PopupMenu,template:PopupMenuTpl},{Class:"MenuItemSep",template:MenuItemSepTpl}]);
  //#endregion
})();