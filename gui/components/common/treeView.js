(function(){
  //#region TreeViewItem
  var TreeViewItem=Class.extend({
    _ClassName: "TreeViewItem",
    init:function(owner,parentNode) {
      if (!$j.tools.isNull(owner)){
        //#region Private
        this._owner=owner;
        this._parentNodes=[];
        this._dom=null;
        this._left=0;
        this._level=0;
        this._checkedChildsNb=0;
        //#endregion
        this.text=String.empty;
        this.height=owner.itemsHeight;
        this.isChecked=false;
        this.state=$j.types.checkBoxStates.UNCHECKED;
        this.allowGrayed=false;
        this.enabled=true;
        this.expanded=false;
        this.form=owner.form;
        this.selected=false;
        this.visible=true;
        this.items=[];
        this.hitTest={mouseWheel:true};
        if (!$j.tools.isNull(parentNode)) {
          this._parentNodes.push.apply(this._parentNodes,parentNode._parentNodes);
          this._parentNodes.push(parentNode);
          this._level=parentNode._level+1;
        }
      }
    },
    //#region Setter
    setIsChecked:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.isChecked!==newValue) {
        this.isChecked=newValue;
        if (this.isChecked) this.state=$j.types.checkBoxStates.CHECKED;
        else this.state=$j.types.checkBoxStates.UNCHECKED;
        this.update();
        this.updateChildsCheck(this.isChecked);
        this.updateParentCheck(this.isChecked);
      }
    },
    setEnabled:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.enabled!==newValue) {
        this.enabled=newValue;
        this.update();
      }
    },
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.height!==newValue) {
        this.height=newValue;
        this._owner.refreshInnerHeight();
      }
    },
    setText:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.text!==newValue) {
        this.text=newValue;
        this.update();
      }
    },
    setSelected:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (!this.enabled) return; 
      if (this.selected!==newValue) {
        this.selected=newValue;
        this.update();
      }
    },
    setExpanded:function() {
      var i,l,top=this.top+this.height;
      if (this.expanded) this.expanded=false;
      else this.expanded=true;
      for(i=0,l=this.items.length;i<l;i++) {
        this.items[i].visible=this.expanded;
        this.items[i]._level=this._level+1;
        if (!$j.tools.isNull(this.items[i]._dom)) {
          this.items[i].destroy();
        }
        this.items[i].updateDataSet();
      }
      this.updateDataSet();
      if (this._owner.itemIndex>-1) {
        var item=this._owner.items[this._owner.itemIndex],i;
        for (i=item._parentNodes.length-1;i>=0;i--) {
          if (item._parentNodes[i]===this) {
            this._owner.setItemIndex(this.getIndex());
            break;
          }
        }
      }
      this._owner.refreshInnerHeight();
    },
    //#endregion
    //#region Methods
    mouseMove:function() {
      this._owner.mouseMove();
    },
    mouseEnter:$j.tools.emptyFunc,
    mouseLeave:$j.tools.emptyFunc,
    mouseDown:function() {
      this._owner.mouseDown();
    },
    mouseUp:function() {
      this._owner.mouseUp();
    },
    mouseWheel:function() {
      this._owner.mouseWheel();
    },
    update:function() {
      if (!$j.tools.isNull(this._dom)) {
        $j.CSS.removeClass(this._dom.firstElementChild,"CheckBox");
        this._dom.removeAttribute("disabled");
        if (this._owner.viewCheckboxes) {
          $j.CSS.addClass(this._dom.firstElementChild,"CheckBox");
        }
        if (this.height!==this._owner.itemsHeight) {
          this._dom.style[$j.types.jsCSSProperties.HEIGHT]=this.height+$j.types.CSSUnits.PX;
        }
        if (!this.enabled) this._dom.setAttribute("disabled","disabled");
        if (this.selected) $j.CSS.addClass(this._dom.firstElementChild,"RowSelected");
        else $j.CSS.removeClass(this._dom.firstElementChild,"RowSelected");
        this._dom.firstElementChild.innerHTML=this.text;
        if ($j.browser.ie) this._dom.firstElementChild.setAttribute("data-theme",this._owner.getThemeName());
        else this._dom.firstElementChild.dataset.theme=this._owner.getThemeName();
        this.updateDataSet();
      }
    },
    updateDataSet:function() {
      if ($j.tools.isNull(this._dom)) return;
      if ($j.browser.ie) {
        this._dom.setAttribute("data-height",this.height);
        this._dom.setAttribute("data-ischecked",this.isChecked);
        this._dom.setAttribute("data-enabled",this.enabled);
        this._dom.setAttribute("data-idx",this.getIndex());
        this._dom.setAttribute("data-expanded",this.expanded);
        this._dom.setAttribute("data-visible",this.visible);
      } else {
        this._dom.dataset.height=this.height;
        this._dom.dataset.ischecked=this.isChecked;
        this._dom.dataset.enabled=this.enabled;
        this._dom.dataset.idx=this.getIndex();
        this._dom.dataset.expanded=this.expanded;
        this._dom.dataset.visible=this.visible;
      }
      if (this._owner.viewCheckboxes) {
        if (!$j.tools.isNull(this._dom.firstElementChild)) {
          if ($j.browser.ie) {
            this._dom.firstElementChild.setAttribute("data-ischecked",this.isChecked);
            this._dom.firstElementChild.setAttribute("data-state",this.state);
            this._dom.firstElementChild.setAttribute("data-allowgrayed",this.allowGrayed);
          } else {
            this._dom.firstElementChild.dataset.ischecked=this.isChecked;
            this._dom.firstElementChild.dataset.state=this.state;
            this._dom.firstElementChild.dataset.allowgrayed=this.allowGrayed;
          }
        }
      }
    },
    getIndex:function() {
      return this._owner.items.indexOf(this);
    },
    isEnabled:function() {
      return this.enabled&&this._owner.isEnabled();
    },
    isVisible:function() {
      var ret=true;
      for (var i=this._parentNodes.length-1;i>=0;i--) {
        if (!this._parentNodes[i].isExpanded()) {
          ret=false;
          break;
        }
      }
      return ret&&this.visible;
    },
    isExpanded:function() {
      return this.expanded;
    },
    draw:function() {
	    var span;
      if (!this._dom) {
		    span=$j.doc.createElement($j.types.HTMLElements.SPAN);
        this._dom=$j.doc.createElement($j.types.HTMLElements.DIV);
        if ($j.browser.ie) this._dom.setAttribute("data-theme",this._owner.getThemeName());
        else this._dom.dataset.theme=this._owner.getThemeName();
		    this._dom.appendChild(span);
        span.innerHTML=this.text;
        this._dom.jsObj=this;
        $j.CSS.addClass(this._dom,this._ClassName);
        $j.CSS.addClass(this._dom,this._owner._ClassName[0]+this._ClassName);
        if (this.items.length>0) {
          $j.CSS.addClass(this._dom,"TVIHasChild");
        }
        this._owner._content.appendChild(this._dom);
        $j.tools.events.bind(this._dom,$j.types.mouseEvents.CLICK,this._owner.selectItem);
	    }
      if (this._level>0) this._dom.style[$j.types.jsCSSProperties.MARGINLEFT]=(this._level*this._owner._offsetLevel)+$j.types.CSSUnits.PX;
      this._dom.style[$j.types.jsCSSProperties.TOP]=(this.top-this._owner._scrollTop)+$j.types.CSSUnits.PX;
      this.update();
    },
    destroy:function() {
      if (!$j.tools.isNull(this._dom)) {
        $j.tools.events.unBind(this._dom,$j.types.mouseEvents.CLICK,this._owner.selectItem);
        this._dom.removeChild(this._dom.firstElementChild);
        this._dom.parentNode.removeChild(this._dom);
        this._dom=null;
      }
    },
    addItem:function() {
    },
    removeItem:function() {
    },
    updateChildsCheck:function(checked) {
      var item;
      if (this.items.length>0) {
        for (var i=0,l=this.items.length;i<l;i++) {
          item=this.items[i];
          item.isChecked=checked;
          if (checked) item.state=$j.types.checkBoxStates.CHECKED;
          else item.state=$j.types.checkBoxStates.UNCHECKED;
          item.updateDataSet();
          item.updateChildsCheck(checked);
        }
      }
    },
    updateParentCheck:function() {
      var nbs=0,p;
      for (var i=this._parentNodes.length-1;i>=0;i--) {
        p=this._parentNodes[i];
        nbs=p.getNbCheckedChilds();
        p.isChecked=false;
        if (nbs.nbChecked===p.items.length) {
          p.state=$j.types.checkBoxStates.CHECKED;
          p.isChecked=true;
        } else if (nbs.nbChecked+nbs.nbGrayed!==0) p.state=$j.types.checkBoxStates.GRAYED;
        else if (nbs.nbChecked+nbs.nbGrayed===0) p.state=$j.types.checkBoxStates.UNCHECKED;
        p.updateDataSet();
      }
    },
    getNbCheckedChilds:function() {
      var nbC=0,nbG=0,item;
      for (var i=0,l=this.items.length;i<l;i++) {
        item=this.items[i];
        if (item.isChecked) nbC++;
        else if (item.state===$j.types.checkBoxStates.GRAYED) nbG++;
      }
      return { "nbChecked":nbC,"nbGrayed":nbG };
    },
    isEnabled:function() {
      return this._owner.enabled;
    }
    //#endregion
  });
  Object.seal(TreeViewItem);
  //#endregion
  //#region TreeView
  var TreeView=$j.classes.ThemedControl.extend({
    _ClassName:"TreeView",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._content=null;
        this._visibleItems=[];
        this._VScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._VScrollBar.onChange.addListener(this.VScroll);
        this._HScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._HScrollBar.onChange.addListener(this.HScroll);
        this._HScrollBar.smallChange=this.itemsHeight;
        this._scrollTop=0;
        this._scrollLeft=0;
        this._innerHeight=0;
        this._innerWidth=0;
        this._offsetLevel=10;
        this._lastDelta=new $j.classes.Point;
        this._downPos=new $j.classes.Point;
        this._currentPos=new $j.classes.Point;
        this._down=false;
        this._HScrollAni=null;
        this._VScrollAni=null;
        //#endregion
        this.items=[];
        this.itemsHeight=16;
        this.viewCheckboxes=false;
        this.setHitTest(true);
        this.itemIndex=-1;
        this.canFocused=true;
        this.hotTrack=false;
        this.multiSelect=false;
        //this.toolTips=false;
        this.mouseTracking=true;
        this.animated=true;
      }
    },
    //#region Setter
    setItemsHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.itemsHeight!==newValue) {
        for (var i=0,l=this.items.length;i<l;i++) {
          if (this.items[i].height===this.itemsHeight) {
            this.items[i].height=newValue;
          }
        }
        this.itemsHeight=newValue;
        this.draw();
      }
    },
    setViewCheckboxes:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this instanceof $j.classes.HorizontalListBox) return;
      if (this.viewCheckboxes!==newValue) {
        this.viewCheckboxes=newValue;
        if (this.viewCheckboxes) this._offsetLevel=16;
        else this._offsetLevel=10;
        this.draw();
      }
    },
    setItemIndex:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue>this.items.length) return;
      if (newValue<-1) newValue=-1;
      if (this.itemIndex!==newValue) {
        if (this.itemIndex>-1) this.deselectItemIndex();
        this.itemIndex=newValue;
        var item=this.items[this.itemIndex];
        item.setSelected(true);
      }
    },
    //#endregion
    //#region Methods
    updateDataSet:function() {
      if ($j.browser.ie) {
        this._DOMObj.setAttribute("data-itemsheight",this.itemsHeight);
        this._DOMObj.setAttribute("data-viewcheckboxes",this.viewCheckboxes);
        this._DOMObj.setAttribute("data-itemindex",this.itemIndex);
      } else {
        this._DOMObj.dataset.itemsheight=this.itemsHeight;
        this._DOMObj.dataset.viewcheckboxes=this.viewCheckboxes;
        this._DOMObj.dataset.itemindex=this.itemIndex;
      }
    },
    getChildsDOMObj:function() {
      var items,item,lastStart=0,top=null,queue=[],parentItems=[],nodes=[],i,l,data;
      if (!$j.tools.isNull(this._DOMObj)) {
        this._content=this._DOMObj.firstElementChild;
        this._content.jsObj=this;
        this._VScrollBar.getDOMObj(this._DOMObj.lastElementChild.id);
        this._VScrollBar.getChildsDOMObj();
        this._VScrollBar.updateFromDOM();

        this._HScrollBar._DOMObj=this._VScrollBar._DOMObj.previousSibling;
        while (this._HScrollBar._DOMObj.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._HScrollBar._DOMObj=this._HScrollBar._DOMObj.previousSibling;
        }
        this._HScrollBar.getDOMObj(this._HScrollBar._DOMObj.id);
        this._HScrollBar.getChildsDOMObj();
        this._HScrollBar.updateFromDOM();
      }
      // on va chercher les items dans le CDATA
      var cdata=this._content.nextSibling;
      while (cdata.nodeType!==$j.types.xmlNodeTypes.COMMENT_NODE) {
        cdata=cdata.nextSibling;
      }
      if (cdata.nodeValue!==String.empty&&!$j.tools.isNull(cdata.nodeValue)) items=JSON.parse(cdata.nodeValue);
      this._innerHeight=0;
      l=items.length;
      for (i=0;i<l;i++) queue.push(items[i]);
      while (!queue.isEmpty()) {
        top = queue.shift();
        item=new $j.classes.TreeViewItem(this,top.parent);
        item.text=top.text;
        item.height=top.height;
        item.isChecked=top.isChecked;
        item.enabled=top.enabled;
        item.expanded=top.expanded;
        item.visible=top.visible;
        item.allowGrayed=top.allowGrayed;
        item.isChecked=top.isChecked;
        item.state=top.state;
        item.top=lastStart;
        if (!$j.tools.isNull(top.parent)) {
          top.parent.items.push(item);
          if (item.isChecked) top.parent._checkedChildsNb++;
        }
        this.items.push(item);
        if (item.visible) {
          this._innerHeight+=item.height;
          lastStart+=item.height;
        }
        l=top.items.length;
        for (i=0;i<l;i++) {
          top.items[i].parent=item;
          queue.insert(i,top.items[i]);
        }
      }
      // on va chercher les items visibles
      if (this._content.childNodes.length>0) {
        l=this._content.childNodes.length;
        for (i=0;i<l;i++) {
          item=this._content.childNodes[i];
          if (item.nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) nodes.push(item);
        }
        l=nodes.length;
        for (i=0;i<l;i++) {
          this.items[i].text=nodes[i].firstElementChild.innerHTML;
          data=($j.browser.ie)?nodes[i].getAttribute("data-ischecked"):nodes[i].dataset.ischecked;
          if (!$j.tools.isNull(data)) this.items[i].isChecked=_conv.strToBool(data);
          data=($j.browser.ie)?nodes[i].getAttribute("data-enabled"):nodes[i].dataset.enabled;
          if (!$j.tools.isNull(data)) this.items[i].enabled=_conv.strToBool(data);
          data=($j.browser.ie)?nodes[i].getAttribute("data-height"):nodes[i].dataset.height;
          if (!$j.tools.isNull(data)) this.items[i].height=~~data;
          data=($j.browser.ie)?nodes[i].getAttribute("data-expanded"):nodes[i].dataset.expanded;
          if (!$j.tools.isNull(data)) this.items[i].expanded=_conv.strToBool(data);
          data=($j.browser.ie)?nodes[i].getAttribute("data-visible"):nodes[i].dataset.visible;
          if (!$j.tools.isNull(data)) this.items[i].visible=_conv.strToBool(data);
          this.items[i].top=nodes[i].offsetTop;
          this.items[i]._dom=nodes[i];
          data=($j.browser.ie)?nodes[i].firstElementChild.getAttribute("data-allowgrayed"):nodes[i].firstElementChild.dataset.allowgrayed;
          if (!$j.tools.isNull(data)) this.items[i].allowGrayed=_conv.strToBool(data);
          data=($j.browser.ie)?nodes[i].firstElementChild.getAttribute("data-ischecked"):nodes[i].firstElementChild.dataset.ischecked;
          if (!$j.tools.isNull(data)) this.items[i].isChecked=_conv.strToBool(data);
          data=($j.browser.ie)?nodes[i].firstElementChild.getAttribute("data-state"):nodes[i].firstElementChild.dataset.state;
          if (!$j.tools.isNull(data)) this.items[i].state=data;
          this.items[i]._dom.jsObj=this.items[i];
          $j.tools.events.bind(this.items[i]._dom,$j.types.mouseEvents.DOWN,this.selectItem);
          this._visibleItems.push(this.items[i]);
        }
      }
      this._VScrollBar.smallChange=~~(this._VScrollBar.viewportSize/5);
      if (this._innerHeight<this._VScrollBar.max) this._innerHeight=this._VScrollBar.max;
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-viewcheckboxes"):this._DOMObj.dataset.viewcheckboxes;
      if (!$j.tools.isNull(data)) this.viewCheckboxes=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemsheight"):this._DOMObj.dataset.itemsheight;
      if (!$j.tools.isNull(data)) this.itemsHeight=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemindex"):this._DOMObj.dataset.itemindex;
      if (!$j.tools.isNull(data)) this.itemIndex=_conv.strToBool(data);
      if (this.viewCheckboxes) this._offsetLevel=16;
      else this._offsetLevel=10;
      if ($j.tools.Debugger.debug) console.log(this._offsetLevel);
    },
    draw:function() {
      var oldVisibleItems=this._visibleItems,item,items=this.items,i,il,itemVisible=false,topIndex=0,top,reelItemWidth=0;
      this._scrollTop=$j.max($j.min(this._scrollTop,this._innerHeight-this._content.offsetHeight),0);
      this._visibleItems=[];
      topIndex=~~(this._scrollTop/this.itemsHeight);
      if (topIndex<0) topIndex=0;
      top=items[topIndex].top;
      this._innerWidth=0;
      for (i=topIndex;i<items.length;i++) {
        itemVisible=false;
			  item=items[i];
        if (i>topIndex) item.top=top;
        if ((item.top+item.height>=this._scrollTop) && (item.top<=this._content.offsetHeight+this._scrollTop)) itemVisible=true;
        itemVisible=itemVisible&&item.isVisible();
        if (itemVisible) {
				  item.draw();
				  this._visibleItems.push(item);
          if (item._dom.offsetTop+item._dom.offsetHeight>this._content.clientHeight) break;
          top+=item.height;
          reelItemWidth=item._dom.offsetLeft+parseInt(getComputedStyle(item._dom).paddingLeft,10)+item._dom.firstElementChild.offsetWidth+
            parseInt(getComputedStyle(item._dom.firstElementChild).marginLeft,10)+
            parseInt(getComputedStyle(this._content).marginRight,10);
          if (this._innerWidth<reelItemWidth) this._innerWidth=reelItemWidth;
        }
      }
		  for (i=0,il=oldVisibleItems.length;i<il;i++) {
			  item=oldVisibleItems[i];
			  if (this._visibleItems.indexOf(item)==-1) {
				  item.destroy();
			  }
		  }
      this.updateHScrollBar();
    },
    VScroll:function() {
      var treeView=this._owner;
      treeView._scrollTop=treeView._VScrollBar.value;
      treeView.draw();
    },
    HScroll:function() {
      var treeView=this._owner;
      treeView._content.style[$j.types.jsCSSProperties.LEFT]=-treeView._HScrollBar.value+$j.types.CSSUnits.PX;
    },
    selectItem:function(mouseEventArg) {
      var item=this.jsObj;
      if (!item.enabled) return;
      if (!item._owner.enabled) return;
      if ((!$j.tools.isNull(item._owner._VScrollAni))&&(item._owner._VScrollAni.running)) return;
      if ((!$j.tools.isNull(item._owner._HScrollAni))&&(item._owner._HScrollAni.running)) return;
      $j.mouse.getMouseInfos(mouseEventArg);
      if ($j.mouse.target.y>=0&&$j.mouse.target.y<=item._owner.itemsHeight) {
        if ($j.mouse.target.x>=0&&$j.mouse.target.x<=10) {
          if (item.items.length>0) item.setExpanded();
        } else {
          if ($j.mouse.event.target===item._dom.firstElementChild) {
            item._owner.setItemIndex(item._owner.items.indexOf(item));
            if (item._owner.viewCheckboxes) {
              if ($j.mouse.target.x>=11&&$j.mouse.target.x<=24) {
                item.setIsChecked(!item.isChecked);
              }
            }
          }
        }
      }
      if(item._owner.canFocused&&!item._owner._isFocused&&(item._owner.form._focusedControl!==item._owner)) item._owner.setFocus();
    },
    deselectItemIndex:function() {
      var item;
      if (this.itemIndex!==-1) {
        item=this.items[this.itemIndex];
        item.setSelected(false);
      }
    },
    refreshInnerHeight:function() {
      var item,items=this.items,lastStart=0;
      this._innerHeight=0;
      for (var i=0,l=items.length;i<l;i++) {
        item=items[i];
        if (item.visible&&item.isVisible()) {
          item.top=lastStart;
          this._innerHeight+=item.height;
          lastStart+=item.height;
        }
      }
      if (this._allowUpdate) {
        this.updateVScrollBar();
        this.draw();
      }
    },
    addItem:function(item) {
      var lastItem=this.items.last();
      if (!(item instanceof $j.classes.TreeViewItem)) return;
      item.top=lastItem.top+lastItem.height;
      this._innerHeight+=item.height;
      this.items.push(item);
      if (this._allowUpdate) {
        this.updateVScrollBar();
        this.draw();
      }
    },
    deleteItem:function(item) {
      if (!(item instanceof $j.classes.TreeViewItem)) return;
      if (this.items.indexOf(item)===-1) return;
      this.items.remove(item);
      if (this._allowUpdate) this.refreshInnerHeight();
    },
    deleteAt:function(index) {
      var item,lastTop,lastLeft;
      if (index<0||index>this.items.length) return;
      item=this.items[index];
      this.items.removeAt(index);
      if (this._allowUpdate) this.refreshInnerHeight();
    },
    moveItem:function(itemToMove,itemBefore) {
      var s,l,i,t,l,prop,start;
      if (!(itemToMove instanceof $j.classes.TreeViewItem)) return;
      if (!(itemBefore instanceof $j.classes.TreeViewItem)) return;
      prop="top";
      s=itemToMove.getIndex()-1;
      l=itemBefore.getIndex()+1;
      this.items.remove(itemToMove);
      this.items.insert(itemBefore.getIndex()+1,itemToMove);
      if (l>this.items.length) l=this.items.length;
      start=this.items[s][prop];
      for (i=s;i<l;i++) {
        this.items[i][prop]=start;
        start+=this.items[i].height;
      }
      if (this._visibleItems.indexOf(itemToMove)>-1) {
        if (this._allowUpdate) this.draw();
      }
    },
    beginUpdate:function() {
      this._allowUpdate=false;
    },
    endUpdate:function() {
      this._allowUpdate=true;
      this.refreshInnerHeight();
    },
    clear:function() {
		  var item;
      for (var i=0,il=this._visibleItems.length;i<il;i++) {
			  item=this._visibleItems[i];
				item.destroy();
		  }
      this._visibleItems.clear();
      this.items.clear();
    },
    updateVScrollBar:function() {
      if (this._innerHeight>this._content.offsetHeight) {
        if (this._innerWidth<this._content.offsetWidth+this._content.offsetLeft) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.VERTICAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.VERTICAL;
        } else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.BOTH);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.BOTH;
        }
        this._VScrollBar.setMax(this._innerHeight);
        this._VScrollBar.setViewportSize(this._content.offsetHeight);
      } else {
        if (this._innerWidth<this._content.offsetWidth+this._content.offsetLeft) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.NONE);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.NONE;
        } else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.HORIZONTAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.HORIZONTAL;
        }
        this._VScrollBar.setMax(0);
        this._VScrollBar.setViewportSize(0);
        this._VScrollBar.setValue(0);
      }
    },
    updateHScrollBar:function() {
      var offset=0,data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) offset=this._VScrollBar.width;
      if (this._innerWidth<=this._content.offsetWidth+this._content.offsetLeft) {
        if (data===$j.types.scrollbars.BOTH) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.VERTICAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.VERTICAL;
        } else if (data===$j.types.scrollbars.HORIZONTAL) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.NONE);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.NONE;
        }
      } else {
        if (data===$j.types.scrollbars.VERTICAL) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.BOTH);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.BOTH;
        } else if (data===$j.types.scrollbars.NONE) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.HORIZONTAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.HORIZONTAL;
        }
        this._HScrollBar.setMax(this._innerWidth);
        this._HScrollBar.setViewportSize(this._content.offsetWidth+this._content.offsetLeft);
      }
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) this.updateVScrollBar();
    },
    mouseWheel:function() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) {
        this._VScrollBar.mouseWheel();
      } else if (data===$j.types.scrollbars.HORIZONTAL) {
        this._HScrollBar.mouseWheel();
      }
    },
    mouseDown:function() {
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT&&this.mouseTracking){
        this._lastDelta.setValues(0,0);
        this._downPos.assign($j.mouse.screen);
        this._currentPos.assign($j.mouse.screen);
        this._down=true;
        if ((!$j.tools.isNull(this._VScrollAni))&&(this._VScrollAni.running)) this._VScrollAni.stopAtCurrent();
        if ((!$j.tools.isNull(this._HScrollAni))&&(this._HScrollAni.running)) this._HScrollAni.stopAtCurrent();
      }
    },
    mouseMove:function() {
      var data;
      this._inherited();
      if (this._down&&this.mouseTracking) {
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
        if (data===$j.types.scrollbars.VERTICAL||data===$j.types.scrollbars.BOTH) {
          this._VScrollBar.setValue(this._VScrollBar.value-($j.mouse.screen.y-this._currentPos.y));
          this._lastDelta.y=($j.mouse.screen.y-this._currentPos.y);
        }
        if (data===$j.types.scrollbars.HORIZONTAL||data===$j.types.scrollbars.BOTH) {
          this._HScrollBar.setValue(this._HScrollBar.value-($j.mouse.screen.x-this._currentPos.x));
          this._lastDelta.x=($j.mouse.screen.x-this._currentPos.x);
        }
        this._currentPos.assign($j.mouse.screen);
      }
    },
    mouseUp:function() {
      var data;
      this._inherited();
      if (this._down&&this.mouseTracking) {
        this._down=false;
        if (this.animated&&((this._lastDelta.x!==0)||(this._lastDelta.y!==0))) {
          data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
          if (data===$j.types.scrollbars.VERTICAL||data===$j.types.scrollbars.BOTH) {
            this.createVScrollAni();
            if (this._VScrollAni.running) this._VScrollAni.stopAtCurrent();
            this._VScrollAni.stopValue=this._VScrollBar.value-(this._lastDelta.y*7);
            this._VScrollAni.start();
          }
          if (data===$j.types.scrollbars.HORIZONTAL||data===$j.types.scrollbars.BOTH) {
            this.createHScrollAni();
            if (this._HScrollAni.running) this._HScrollAni.stopAtCurrent();
            this._HScrollAni.stopValue=this._HScrollBar.value-(this._lastDelta.x*7);
            this._HScrollAni.start();
          }
        }
      }
    },
    createVScrollAni:function() {
      if ($j.tools.isNull(this._VScrollAni)) {
        this._VScrollAni=new $j.classes.FloatAnimation(this);
        this._VScrollAni.animationType=$j.types.animationTypes.OUT;
        this._VScrollAni.interpolation=$j.types.interpolationTypes.QUADRATIC;
        this._VScrollAni.duration=1;
        this._VScrollAni.control=this._VScrollBar;
        this._VScrollAni.propertyName="value";
        this._VScrollAni.startFromCurrent=true;
        this._VScrollAni.convertToCSS=false;
      }
    },
    createHScrollAni:function() {
      if ($j.tools.isNull(this._HScrollAni)) {
        this._HScrollAni=new $j.classes.FloatAnimation(this);
        this._HScrollAni.animationType=$j.types.animationTypes.OUT;
        this._HScrollAni.interpolation=$j.types.interpolationTypes.QUADRATIC;
        this._HScrollAni.duration=1;
        this._HScrollAni.control=this._HScrollBar;
        this._HScrollAni.propertyName="value";
        this._HScrollAni.startFromCurrent=true;
        this._HScrollAni.convertToCSS=false;
      }
    }
    //#endregion
  });
  Object.seal(TreeView);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,TreeViewItem);
  $j.classes.register($j.types.categories.COMMON,TreeView);
  //#region Templates
  var TreeViewTpl=["<div id='{internalId}' data-name='{name}' data-class='TreeView' class='TreeView' data-theme='{theme}' style='{style}' data-scrollbars='none'>",
                   "<div class='TreeViewContent' data-theme='{theme}'>",
                   "</div>",
                   "{horizontalScrollBar}",
                   "{verticalScrollBar}",
                   "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:TreeView,template:TreeViewTpl}]);
  //#endregion
})();