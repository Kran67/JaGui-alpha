(function(){
  $j.types.tabStyles={TABS:"tabs",BUTTONS:"buttons",FLATBUTTONS:"flatButtons"};
  $j.types.tabPositions={TOP:"top",BOTTOM:"bottom",LEFT:"left",RIGHT:"right"};
  //#region TabSheet
  var TabSheet=$j.classes.CaptionControl.extend({
    _ClassName: "TabSheet",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._pageControl=owner;
        this._DOMPage=null;
        //#endregion
        this.caption=(!$j.tools.isNull(props.caption)?props.caption:this._ClassName+(owner._tabSheets.length+1));
        this.setHitTest(true);
        this.imageIndex=-1;
        this.showCaption=true;
      }
    },
    //#region Setter
    setImageIndex:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<-1) newValue=-1;
      if (!$j.tools.isNull(this._pageControl.images)) {
        if (newValue<this._pageControl.images.length) {
          this.imageIndex=newValue;
          this.update();
        }
      }
    },
    setPageIndex:function(newValue) {
    },
    setEnabled:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.enabled!==newValue) {
        this._inherited(newValue);
      }
    },
    //#endregion
    //#region Methods
    show:function() {
      if (this._pageControl.activeTab===this) return;
      if (!$j.tools.isNull(this._pageControl.activeTab)) this._pageControl.activeTab.hide();
      this._pageControl.activeTab=this;
      $j.CSS.removeClass(this._DOMPage,"hidden");
      $j.CSS.addClass(this._DOMObj,this._ClassName+"_selected");
      if (!this._pageControl._updating) this._pageControl.onChange.invoke();
    },
    hide:function() {
      $j.CSS.addClass(this._DOMPage,"hidden");
      $j.CSS.removeClass(this._DOMObj,this._ClassName+"_selected");
    },
    mouseDown:function(){
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT){
        this.show();
      }
    },
    updateFromDOM:function() {
      this._inherited();
      this.caption=this._DOMObj.innerHTML;
    },
    update:function() {
      this._inherited();
      if (this.imageIndex>-1) {
      } else {
      }
    }
    //#endregion
  });
  Object.seal(TabSheet);
  //#endregion
  //#region PageControl
  var PageControl=$j.classes.ThemedControl.extend({
    _ClassName: "PageControl",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._pageContent=null;
        this._tabSheets=[];
        this._btnLeft=null;
        this._btnRight=null;
        this._tabSheets_Container=null;
        this._firstVisibleTab=0;
        this._lastVisibleTab=0;
        //#endregion
        this.width=this.height=200;
        this.autoCapture=true;
        this.activeTab=null;
        this.images=null;
        this.tabStyle=$j.types.tabStyles.TABS;
        this.tabPosition=$j.types.tabPositions.TOP;
        this.onChange=new $j.classes.NotifyEvent(this);
        this.canChange=true;
      }
    },
    //#region Methods
    changeActiveTab: function(tabSheet) {
      if (tabSheet!==this.activeTab) {
        tabSheet.show();
      }
    },
    deleteTab:function(index) {
      if (index<0||index>this._tabSheets.length-1) return null;
      var tab=this._tabSheets[index];
      this._pageContent.removeChild(tab._DOMPage);
      // supprimer les controles de la page
      this._tabSheets_Container.removeChild(tab._DOMObj);
      this._tabSheets.removeAt(index);
      this.checkViewBtns();
    },
    getActiveTabIndex: function() {
      return this._tabSheets.indexOf(this.activeTab);
    },
    getTab:function(index) {
      if (index<0||index>this._tabSheets.length-1) return null;
      return this._tabSheets[index];
    },
    newTab:function(caption) {
      var tab,tpl,a,div=$j.doc.createElement($j.types.HTMLElements.DIV);
      if ($j.tools.isNull(caption)) caption="tab"+(this._tabSheets.length+1);
      tab=$j.classes.createComponent($j.classes.TabSheet,this,caption.firstCharUpper(),{"parentDOM":this._tabSheets_Container,"caption":caption},true);
      this._tabSheets.push(tab);
      tpl=$j.templates["Page"];
      a=tpl.split("{theme}");
      tpl=a.join(this.getThemeName());
      a=tpl.split("{name}");
      tpl=a.join(tab.name);
      div.innerHTML=tpl;
      this._pageContent.appendChild(div.firstElementChild);
      this.checkLastVisibleTab();
      this.checkViewBtns();
    },
    /*insertTab:function(tab,index) {
      var tpl,a,div=$j.doc.createElement($j.types.HTMLElements.DIV);
      if (!(tab instanceof $j.classes.TabSheet)) return;
      if (typeof index===_const.NUMBER) {
        if (index<0) index=0;
        else if (index>this._tabSheets.length-1) index=this._tabSheets.length-1;
        this._tabSheets.insert(index,tab);
      } else this._tabSheets.push(tab);
      tab.owner=this;
      tab._pageControl=this;
      if (!$j.tools.isNull(tab._DOMPage)) {
        tpl=$j.templates["Page"];
        a=tpl.split("{theme}");
        tpl=a.join(this.getThemeName());
        a=tpl.split("{name}");
        tpl=a.join(tab.name);
        div.innerHTML=tpl;
        this._pageContent.appendChild(div.firstElementChild);
        tab._DOMPage=this._pageContent.lastElementChild;
      } else this._pageContent.appendChild(tab._DOMPage);
      this.checkLastVisibleTab();
      this.checkViewBtns();
    },*/
    moveTab: function(fromIndex,toIndex) {
      if (fromIndex<0||fromIndex>this._tabSheets.length-1) return;
      if (toIndex<0||toIndex>this._tabSheets.length-1) return;
      var curTab=this.getTab(fromIndex);
      this._tabSheets.splice(fromIndex, 1);
      this._tabSheets.splice(toIndex, 0, curTab);
      curTab._DOMObj.remove();
      toIndex++;
      if (toIndex>this._tabSheets.length-1) this._tabSheets_Container.insertBefore(curTab._DOMObj,this._pageContent);
      else this._tabSheets_Container.insertBefore(curTab._DOMObj,this.getTab(toIndex)._DOMObj);
    },
    setActiveTabIndex:function(index) {
      if (index<0||index>this._tabSheets.length-1) return null;
      this._tabSheets[index].show();
    },
    findNextPage:function(goForward,checkTabVisible) {
      var startIndex=this.getActiveTabIndex(),i,result=null;
      if (this._tabSheets.length!==0) {
        if (startIndex===-1) {
          if (goForward) startIndex=this._tabSheets.length-1 
          else startIndex=0;
        }
        i=startIndex;
        do {
          if (goForward) {
            i++;
            if (i===this._tabSheets.length) i=0;
          } else {
            if (i===0) i=this._tabSheets.length;
            i--;
          }
          result=this._tabSheets[i];
          if (!checkTabVisible || result.visible) return result;
        }
        while (i===startIndex)
      }
      return result;
    },
    selectNextPage:function(goForward,checkTabVisible) {
      var tab=this.findNextPage(goForward,checkTabVisible);
      if ((!$j.tools.isNull(tab)) && (tab!==this.activeTab) && this.canChange) {
        this.changeActiveTab(tab);
        this.change();
      }
    },
    change:function() {
      if (!this._updating) this.onChange.invoke();
    },
    getChildsDOMObj: function(id) {
      var nodes,i,l,tab,data;
      if (!$j.tools.isNull(this._DOMObj)) {
        this._tabSheets_Container=this._DOMObj.getElementsByClassName("TabSheets_container")[0];
        nodes=this._tabSheets_Container.childNodes;
        for (i=0,l=nodes.length;i<l;i++) {
          if (nodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
            data=($j.browser.ie)?nodes[i].getAttribute("data-class"):nodes[i].dataset.class;
            if (!$j.tools.isNull(data)) {
              obj=new $j.classes[data](this);
              obj._DOMObj=nodes[i];
              nodes[i].jsObj=obj;
              data=($j.browser.ie)?nodes[i].getAttribute("data-name"):nodes[i].dataset.name;
              if (!$j.tools.isNull(data)) obj.setName(data);
              obj.updateFromDOM();
              this._tabSheets.push(obj);
            }
          }
        }
        this._components.clear();
        this._pageContent=this._DOMObj.lastElementChild;
        data=($j.browser.ie)?this._pageContent.getAttribute("data-class"):this._pageContent.dataset.class;
        this._pageContent=new $j.classes[data](this);
        this._pageContent._DOMObj=this._DOMObj.lastElementChild;
        this._pageContent._DOMObj.jsObj=this._pageContent;
        this._pageContent.updateFromDOM();
        nodes=this._pageContent._DOMObj.childNodes;
        for (i=0,l=nodes.length;i<l;i++) {
          if (nodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
            data=($j.browser.ie)?nodes[i].getAttribute("data-tab"):nodes[i].dataset.tab;
            if (!$j.tools.isNull(data)) {
              tab=this.form[data];
              if (!$j.tools.isNull(tab)) {
                if (tab instanceof $j.classes.TabSheet) {
                  tab._DOMPage=nodes[i];
                  tab._DOMPage.jsObj=tab;
                  tab.getChildsDOMObj(tab._DOMPage,this._pageContent);
                }
              }
            }
          }
        }
        this._btnLeft=this._DOMObj.getElementsByClassName("PageControl_LeftBtn")[0];
        this._btnLeft.jsObj=this;
        this._btnLeft.addEventListener("click",this.moveTabs,false);
        this._btnRight=this._DOMObj.getElementsByClassName("PageControl_RightBtn")[0];
        this._btnRight.jsObj=this;
        this._btnRight.addEventListener("click",this.moveTabs,false);
      }
      this.checkViewBtns();
      this.checkLastVisibleTab();
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-activetab"):this._DOMObj.dataset.activetab;
      if (!$j.tools.isNull(data)) this.activeTab=this.form[data];
    },
    checkViewBtns:function() {
      if (this._tabSheets_Container.offsetWidth<this._tabSheets_Container.scrollWidth) {
        $j.CSS.removeClass(this._btnLeft,"hidden");
        $j.CSS.removeClass(this._btnRight,"hidden");
        if ($j.browser.ie) this._btnRight.removeAttribute("enabled");
        else this._btnRight.dataset.enabled=true;
        if (this._tabSheets_Container.offsetLeft===2) {
          if ($j.browser.ie) this._btnLeft.setAttribute("enabled","false");
          else this._btnLeft.dataset.enabled=false;
        } else {
          if ($j.browser.ie) this._btnLeft.removeAttribute("enabled");
          else this._btnLeft.dataset.enabled=true;
        }
      } else {
        $j.CSS.addClass(this._btnLeft,"hidden");
        $j.CSS.addClass(this._btnRight,"hidden");
      }
    },
    moveTabs:function() {
      var jsObj=this.jsObj,enabled=true;
      if ($j.browser.ie) enabled=_conv.strToBool(this.getAttribute("enabled"));
      else enabled=_conv.strToBool(this.dataset.enabled);
      if (!enabled) return;
      if (jsObj._btnLeft===this) {
        jsObj._firstVisibleTab--;
        jsObj._tabSheets_Container.style[$j.types.jsCSSProperties.LEFT]=(jsObj._tabSheets_Container.offsetLeft+jsObj._tabSheets[jsObj._firstVisibleTab]._DOMObj.offsetWidth)+$j.types.CSSUnits.PX;
      } else {
        jsObj._tabSheets_Container.style[$j.types.jsCSSProperties.LEFT]=(jsObj._tabSheets_Container.offsetLeft-jsObj._tabSheets[jsObj._firstVisibleTab]._DOMObj.offsetWidth)+$j.types.CSSUnits.PX;
        jsObj._firstVisibleTab++;
      }
      if (jsObj._firstVisibleTab>0) {
        if ($j.browser.ie) jsObj._btnLeft.removeAttribute("enabled");
        else jsObj._btnLeft.dataset.enabled=true;
      } else {
        if ($j.browser.ie) jsObj._btnLeft.setAttribute("enabled","false");
        else jsObj._btnLeft.dataset.enabled=false;
      }
      jsObj.checkLastVisibleTab();
      if (jsObj._lastVisibleTab<jsObj._tabSheets.length-1) {
        if ($j.browser.ie) jsObj._btnRight.setAttribute("enabled","true");
        else jsObj._btnRight.dataset.enabled=true;
      } else {
        if ($j.browser.ie) jsObj._btnRight.setAttribute("enabled","false");
        else jsObj._btnRight.dataset.enabled=false;
      }
    },
    checkLastVisibleTab:function() {
      var i,l=this._tabSheets.length;
      this._lastVisibleTab=-1;
      for (i=this._firstVisibleTab;i<l;i++) {
        if ((this._tabSheets[i]._DOMObj.offsetLeft+this._tabSheets[i]._DOMObj.offsetWidth)+this._tabSheets_Container.offsetLeft>this._btnLeft.offsetLeft) {
          this._lastVisibleTab=i-1;
          break;
        }
      }
      if (this._lastVisibleTab===-1) this._lastVisibleTab=this._tabSheets.length-1;
    }
    //#endregion
  });
  //#endregion
  Object.seal(PageControl);
  $j.classes.register($j.types.categories.CONTAINERS,TabSheet,PageControl);
  //#region Template
  var TabSheetTpl="<label id='{internalId}' data-class='TabSheet' data-name='{name}' class='TabSheet csr_default' data-theme='{theme}'>{caption}</label>",
      PageControlTpl=["<div id='{internalId}' data-name='{name}' data-class='PageControl' style='{style}' class='PageControl' data-theme='{theme}'>",
                      "<div class='PageControl_LeftBtn' data-theme='{theme}'><span>*</span></div>",
                      "<div class='PageControl_RightBtn' data-theme='{theme}'><span>)</span></div>",
                      "<div class='PageHeaderSep' data-theme='{theme}'></div>",
                      "</div>"].join(String.empty),
      PageTpl="<div class='PageContent noDisplay' data-theme='{theme}' data-tab='{name}'></div>";
  $j.classes.registerTemplates([{Class:TabSheet,template:TabSheetTpl},{Class:PageControl,template:PageControlTpl},{Class:"Page",template:PageTpl}]);
  //#endregion
})();