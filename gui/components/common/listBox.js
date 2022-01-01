(function(){
  //#region ListBoxItem
  var ListBoxItem=Class.extend({
    _ClassName: "ListBoxItem",
    init: function(owner,text) {
      if (!$j.tools.isNull(owner)) {
        //#region Private
        this._owner=owner;
        this._dom=null;
        this._left=0;
        this._top=0;
        //#endregion
        this.text=text;
        this.height=owner.itemsHeight;
        this.isChecked=false;
        this.isHeader=false;
        this.enabled=true;
        this.form=owner.form;
        this.selected=false;
        this.hitTest={mouseWheel:true};
        this.css=String.empty;
        this.isAlternate=false;
        this.state=$j.types.checkBoxStates.UNCHECKED;
        this.allowGrayed=false;
      }
    },
    //#region Setter
    setIsChecked:function(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if (this.allowGrayed) {
        switch (this.state) {
          case $j.types.checkBoxStates.UNCHECKED:
            this.state=$j.types.checkBoxStates.GRAYED;
            newValue=false;
            break;
          case $j.types.checkBoxStates.GRAYED:
            this.state=$j.types.checkBoxStates.CHECKED;
            newValue=true;
            break;
          case $j.types.checkBoxStates.CHECKED:
            this.state=$j.types.checkBoxStates.UNCHECKED;
            newValue=false;
            break;
        }
      }
      else if (newValue) this.state=$j.types.checkBoxStates.CHECKED;
      else this.state=$j.types.checkBoxStates.UNCHECKED;
      if(this.isChecked!==newValue) {
        this.isChecked=newValue;
        if (this._loading||this.form._loading) return;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.redraw();
        } else this.update();
        //if (!this._updating) this.onChange.invoke();
      }
    },
    setIsHeader:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.isHeader!==newValue) {
        this.isHeader=newValue;
        this.update();
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
      if (this.isHeader||!this.enabled) return; 
      if (this.selected!==newValue) {
        this.selected=newValue;
        this.update();
      }
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
      if (this._owner.orientation===$j.types.orientations.VERTICAL) this._owner._VScrollBar.mouseWheel();
      else this._owner._HScrollBar.mouseWheel();
    },
    update:function() {
      if (!$j.tools.isNull(this._dom)) {
        $j.CSS.removeClass(this._dom,"CheckBox");
        $j.CSS.removeClass(this._dom,"CheckBox");
        this._dom.removeAttribute("disabled");
        if (this._owner.viewCheckboxes) {
          $j.CSS.addClass(this._dom,"CheckBox");
          $j.CSS.addClass(this._dom,"CheckBox");
        }
        if (this.height!==this._owner.itemsHeight) {
          if (this._owner.orientation===$j.types.orientations.VERTICAL) this._dom.style[$j.types.jsCSSProperties.HEIGHT]=this.height+$j.types.CSSUnits.PX;
          else this._dom.style[$j.types.jsCSSProperties.WIDTH]=this.height+$j.types.CSSUnits.PX;
        }
        if (this._owner.orientation===$j.types.orientations.VERTICAL) this._dom.style[$j.types.jsCSSProperties.LINEHEIGHT]=this.height+$j.types.CSSUnits.PX;
        else this._dom.style[$j.types.jsCSSProperties.LINEHEIGHT]=this._dom.offsetHeight+$j.types.CSSUnits.PX;
        if (!this.enabled) this._dom.setAttribute("disabled","disabled");
        this._dom.innerHTML=this.text;
        if ($j.browser.ie) this._dom.setAttribute("data-theme",this._owner.getThemeName());
        else this._dom.dataset.theme=this._owner.getThemeName();
        this.updateDataSet();
      }
    },
    updateDataSet:function() {
      if ($j.browser.ie) {
        this._dom.setAttribute("data-height",this.height);
        this._dom.setAttribute("data-ischecked",(this.allowGrayed?this.state===$j.types.checkBoxStates.CHECKED:this.isChecked));
        this._dom.setAttribute("data-selected",this.selected);
        this._dom.setAttribute("data-isheader",this.isHeader);
        this._dom.setAttribute("data-enabled",this.enabled);
        this._dom.setAttribute("data-idx",this.getIndex());
        this._dom.setAttribute("data-alternate",this.isAlternate);
        this._dom.setAttribute("data-state",this.state);
      } else {
        this._dom.dataset.height=this.height;
        this._dom.dataset.ischecked=(this.allowGrayed?this.state===$j.types.checkBoxStates.CHECKED:this.isChecked);
        this._dom.dataset.isheader=this.isHeader;
        this._dom.dataset.selected=this.selected;
        this._dom.dataset.enabled=this.enabled;
        this._dom.dataset.idx=this.getIndex();
        this._dom.dataset.alternate=this.isAlternate;
        this._dom.dataset.state=this.state;
      }
    },
    getIndex:function() {
      return this._owner.items.indexOf(this);
    },
    isEnabled:function() {
      return this.enabled&&this._owner.isEnabled();
    },
    draw:function(alternate) {
	    if (!this._dom) {
		    this._dom=$j.doc.createElement($j.types.HTMLElements.DIV);
		    this._dom.innerHTML=this.text;
        this._dom.jsObj=this;
        this.isAlternate=(alternate?(this.getIndex()%2!=0):false);
        $j.CSS.addClass(this._dom,this._ClassName);
        if (this._owner.orientation===$j.types.orientations.VERTICAL) $j.CSS.addClass(this._dom,"VListBoxItem");
        else $j.CSS.addClass(this._dom,"HListBoxItem");
		    this._owner._content.appendChild(this._dom);
        $j.tools.events.bind(this._dom,$j.types.mouseEvents.CLICK,this._owner.selectItem);
	    }
      this.update();
      if (this._owner.orientation===$j.types.orientations.VERTICAL) this._dom.style[$j.types.jsCSSProperties.TOP]=(this._top-this._owner._scrollTop)+$j.types.CSSUnits.PX;
      else this._dom.style[$j.types.jsCSSProperties.LEFT]=(this._left-this._owner._scrollTop)+$j.types.CSSUnits.PX;
      if (this.css!==String.empty) {
        var cssPropsValues=this.css.split(";");
        for (var i=0,l=cssPropsValues.length;i<l;i++) {
          var cssPropValue=cssPropsValues[i].split(":");
          this._dom.style[cssPropValue[0]]=cssPropValue[1];
        }
      }
    },
    destroy:function() {
      $j.tools.events.unBind(this._dom,$j.types.mouseEvents.CLICK,this._owner.selectItem);
      if (!$j.tools.isNull(this._dom)) this._owner._content.removeChild(this._dom);
      this._dom=null;
    },
    isEnabled:function() {
      return this._owner.enabled;
    }
    //#endregion
  });
  Object.seal(ListBoxItem);
  //#endregion
  //#region ListBox
  var ListBox=$j.classes.ThemedControl.extend({
    _ClassName:"ListBox",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._content=null;
        this._visibleItems=[];
        this._scrollTop=0;
        this._innerHeight=0;
        this._VScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._VScrollBar.onChange.addListener(this.VScroll);
        this._VScrollBar.setOrientation($j.types.orientations.VERTICAL);
        this._HScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._HScrollBar.onChange.addListener(this.HScroll);
        this._HScrollAni=null;
        this._VScrollAni=null;
        this._lastDelta=new $j.classes.Point;
        this._downPos=new $j.classes.Point;
        this._currentPos=new $j.classes.Point;
        this._down=false;
        //#endregion
        this.multiSelect=false;
        this.sorted=false;
        this.itemsHeight=(!$j.tools.isNull(props.itemsHeight))?props.itemsHeight:16;
        //this.items=[];
        $j.classes.newCollection(this,this,$j.classes.ListBoxItem);
        this.useAlternateColor=false;
        this.viewCheckboxes=false;
        this.itemIndex=-1;
        this.columns=1;
        this.images=null;
        this.onChange=new $j.classes.NotifyEvent(this);
        this.canFocused=true;
        this.setHitTest(true);
        this.mouseTracking=true;
        this.animated=true;
        this.orientation=$j.types.orientations.VERTICAL;
        this._VScrollBar.smallChange=this.itemsHeight;
        this._HScrollBar.smallChange=this.itemsHeight;
      }
    },
    //#region Setters
    setMultiSelect:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.multiSelect!==newValue) {
        this.multiSelect=newValue;
      }
    },
    setSorted:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.sorted!==newValue) {
        this.sorted=newValue;
        if (this.sorted) {
          this.items.sort();
          this.draw();
        }
      }
    },
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
    setUseAlternateColor:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.useAlternateColor!==newValue) {
        this.useAlternateColor=newValue;
        this.updateDataSet();
      }
    },
    setViewCheckboxes:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this instanceof $j.classes.HorizontalListBox) return;
      if (this.viewCheckboxes!==newValue) {
        this.viewCheckboxes=newValue;
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
        if (!$j.tools.isNull(item)) item.setSelected(true);
      }
    },
    setOrientation:function(newValue) {
      if (!$j.tools.valueInSet(newValue,$j.types.orientations)) return;
      if (this.orientation!==newValue) {
        this.orientation=newValue;
        this.updateScrollBar();
        this.draw();
      }
    },
    //#endregion
    //#region Methods
    updateDataSet:function() {
      if ($j.browser.ie) {
        this._DOMObj.setAttribute("data-multiselect",this.multiSelect);
        this._DOMObj.setAttribute("data-sorted",this.sorted);
        this._DOMObj.setAttribute("data-itemsheight",this.itemsHeight);
        this._DOMObj.setAttribute("data-usealternatecolor",this.useAlternateColor);
        this._DOMObj.setAttribute("data-viewcheckboxes",this.viewCheckboxes);
        this._DOMObj.setAttribute("data-itemindex",this.itemIndex);
        this._DOMObj.setAttribute("data-columns",this.columns);
      } else {
        this._DOMObj.dataset.multiselect=this.multiSelect;
        this._DOMObj.dataset.sorted=this.sorted;
        this._DOMObj.dataset.itemsheight=this.itemsHeight;
        this._DOMObj.dataset.usealternatecolor=this.useAlternateColor;
        this._DOMObj.dataset.viewcheckboxes=this.viewCheckboxes;
        this._DOMObj.dataset.itemindex=this.itemIndex;
        this._DOMObj.dataset.columns=this.columns;
      }
    },
    getChildsDOMObj:function() {
      var items,item,node,lastStart=0,prop,data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-orientation"):this._DOMObj.dataset.orientation;
      if (!$j.tools.isNull(data)) this.orientation=data;
      if (!$j.tools.isNull(this._DOMObj)) {
        this._content=this._DOMObj.firstElementChild;
        this._content.jsObj=this;
        this._VScrollBar.getDOMObj(this._DOMObj.lastElementChild.id);
        this._VScrollBar.getChildsDOMObj();
        this._HScrollBar._DOMObj=this._VScrollBar._DOMObj.previousSibling;
        while (this._HScrollBar._DOMObj.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._HScrollBar._DOMObj=this._HScrollBar._DOMObj.previousSibling;
        }
        this._HScrollBar.getDOMObj(this._HScrollBar._DOMObj.id);
        this._HScrollBar.getChildsDOMObj();
        if (this.orientation===$j.types.orientations.VERTICAL) {
          $j.CSS.removeClass(this._VScrollBar._DOMObj,"hidden");
          $j.CSS.addClass(this._HScrollBar._DOMObj,"hidden");
        } else {
          $j.CSS.removeClass(this._HScrollBar._DOMObj,"hidden");
          $j.CSS.addClass(this._VScrollBar._DOMObj,"hidden");
        }
      }
      // on va chercher les items dans le CDATA
      var cdata=this._content.nextSibling;
      while (!$j.tools.isNull(cdata)&&cdata.nodeType!==$j.types.xmlNodeTypes.COMMENT_NODE) {
        cdata=cdata.nextSibling;
      }
      if (!$j.tools.isNull(cdata)&&cdata.nodeValue!==String.empty&&!$j.tools.isNull(cdata.nodeValue)) items=JSON.parse(cdata.nodeValue);
      this._innerHeight=0;
      if (this.orientation===$j.types.orientations.VERTICAL) prop="_top";
      else prop="_left";
      if (!$j.tools.isNull(items)) {
        for (var i=0,l=items.length;i<l;i++) {
          item=new $j.classes.ListBoxItem(this,items[i].text);
          if (!$j.tools.isNull(items[i].height)) item.height=items[i].height;
          if (!$j.tools.isNull(items[i].isChecked)) item.isChecked=items[i].isChecked;
          if (!$j.tools.isNull(items[i].isHeader)) item.isHeader=items[i].isHeader;
          if (!$j.tools.isNull(items[i].enabled)) item.enabled=items[i].enabled;
          if (!$j.tools.isNull(items[i].css)) item.css=items[i].css;
          item[prop]=lastStart;
          this.items.push(item);
          this._innerHeight+=item.height;
          lastStart+=item.height;
        }
      }
      // on va chercher les items visibles
      if (this._content.childNodes.length>0) {
        for (var i=0,l=this._content.childNodes.length;i<l;i++) {
          node=this._content.childNodes[i];
          if (node.nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
            data=($j.browser.ie)?node.getAttribute("data-idx"):node.dataset.idx;
            if (!$j.tools.isNull(data)) item=this.items[~~data];
            data=($j.browser.ie)?node.getAttribute("data-height"):node.dataset.height;
            if (!$j.tools.isNull(data)) item.height=~~data;
            data=($j.browser.ie)?node.getAttribute("data-ischecked"):node.dataset.ischecked;
            if (!$j.tools.isNull(data)) item.isChecked=_conv.strToBool(data);
            data=($j.browser.ie)?node.getAttribute("data-isheader"):node.dataset.isheader;
            if (!$j.tools.isNull(data)) item.isHeader=_conv.strToBool(data);
            data=($j.browser.ie)?node.getAttribute("data-enabled"):node.dataset.enabled;
            if (!$j.tools.isNull(data)) item.enabled=_conv.strToBool(data);
            data=($j.browser.ie)?node.getAttribute("data-css"):node.dataset.css;
            if (!$j.tools.isNull(data)) item.css=data;
            data=($j.browser.ie)?node.getAttribute("data-alternate"):node.dataset.alternate;
            if (!$j.tools.isNull(data)) item.isAlternate=_conv.strToBool(data);
            if (this.orientation===$j.types.orientations.VERTICAL) item._top=node.offsetTop;
            else item._left=node.offsetLeft;
            this._visibleItems.push(item);
            item._dom=node;
            item._dom.jsObj=item;
            $j.tools.events.bind(node,$j.types.mouseEvents.DOWN,this.selectItem);
          }
        }
      }
      this.items.onChange.addListener(this.refreshInnerHeight);
      //this.updateScrollBar();
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-usealternatecolor"):this._DOMObj.dataset.usealternatecolor;
      if (!$j.tools.isNull(data)) this.useAlternateColor=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-viewcheckboxes"):this._DOMObj.dataset.viewcheckboxes;
      if (!$j.tools.isNull(data)) this.viewCheckboxes=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-multiselect"):this._DOMObj.dataset.multiselect;
      if (!$j.tools.isNull(data)) this.multiSelect=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemsheight"):this._DOMObj.dataset.itemsheight;
      if (!$j.tools.isNull(data)) this.itemsHeight=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemindex"):this._DOMObj.dataset.itemindex;
      if (!$j.tools.isNull(data)) this.itemIndex=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-columns"):this._DOMObj.dataset.columns;
      if (!$j.tools.isNull(data)) this.columns=_conv.strToBool(data);
    },
    draw:function() {
      var oldVisibleItems=this._visibleItems,item,items=this.items,i,il,vert=(this.orientation===$j.types.orientations.VERTICAL),itemVisible=false,topIndex=0,maxIndex=0;
      if (vert) this._scrollTop=$j.max($j.min(this._scrollTop,this._innerHeight-this._content.offsetHeight),0);
      else this._scrollTop=$j.max($j.min(this._scrollTop,this._innerHeight-this._content.offsetWidth),0);
      this._visibleItems=[];
      topIndex=~~(this._scrollTop/this.itemsHeight);
      if (topIndex<0) topIndex=0;
      if (!oldVisibleItems.isEmpty()) maxIndex=topIndex+oldVisibleItems.length*2;
      else maxIndex=~~(this._content.offsetHeight/this.itemsHeight)+1;
      if (maxIndex>items.length) maxIndex=items.length;
      for (i=topIndex;i<maxIndex;i++) {
			  item=items[i];
        itemVisible=false;
			  if (vert&&((item._top+item.height>=this._scrollTop) && (item._top<=this.height+this._scrollTop))) itemVisible=true;
        else if (!vert&&((item._left+item.height>=this._scrollTop) && (item._left<=this.width+this._scrollTop))) itemVisible=true;
        if (itemVisible) {
				  if (!$j.tools.isNull(this._dropDownPopup)) item._dropDownPopup=this._dropDownPopup;
          item.draw(this.useAlternateColor);
				  this._visibleItems.push(item);
			  }
      }
		  for (i=0,il=oldVisibleItems.length;i<il;i++) {
			  item=oldVisibleItems[i];
			  if (this._visibleItems.indexOf(item)==-1) {
				  item.destroy();
			  }
		  }
    },
    VScroll:function() {
      var listBox=this._owner;
      listBox._scrollTop=listBox._VScrollBar.value;
      listBox.draw();
    },
    HScroll:function() {
      var listBox=this._owner;
      listBox._scrollTop=listBox._HScrollBar.value;
      listBox.draw();
    },
    selectItem:function() {
      var item=this.jsObj;
      if (item.isHeader||!item.enabled) return;
      if (!item._owner.enabled) return;
      if ((!$j.tools.isNull(item._owner._VScrollAni))&&(item._owner._VScrollAni.running)) return;
      if ((!$j.tools.isNull(item._owner._HScrollAni))&&(item._owner._HScrollAni.running)) return;
      if (item._owner.multiSelect&&($j.keyboard.ctrl)) item.setSelected(!item.selected);
      else item._owner.setItemIndex(item._owner.items.indexOf(item));
      if (item._owner.viewCheckboxes) item.setIsChecked(!item.isChecked);
      item._owner.mouseDown();
    },
    deselectItemIndex:function() {
      var item;
      if (this.itemIndex!==-1) {
        item=this.items[this.itemIndex];
        if(!$j.tools.isNull(item)) item.setSelected(false);
      }
    },
    refreshInnerHeight:function() {
      var item,items=this.items,lastStart=0,prop;
      if (this.orientation===$j.types.orientations.VERTICAL) prop="_top";
      else prop="_left";
      this._innerHeight=0;
      for (var i=0,l=items.length;i<l;i++) {
        item=items[i];
        item[prop]=lastStart;
        this._innerHeight+=item.height;
        lastStart+=item.height;
      }
      if (this._allowUpdate) {
        this.updateScrollBar();
        this.draw();
      }
    },
    addItem:function(item) {
      var lastItem=this.items.last(),prop;
      if (!(item instanceof $j.classes.ListBoxItem)) return;
      if (this.orientation===$j.types.orientations.VERTICAL) prop="_top";
      else prop="_left";
      item[prop]=lastItem[prop]+lastItem.height;
      this._innerHeight+=item.height;
      this.items.push(item);
      //if (this._allowUpdate) {
      //  this.updateScrollBar();
      //  this.draw();
      //}
    },
    deleteItem:function(item) {
      if (!(item instanceof $j.classes.ListBoxItem)) return;
      if (this.items.indexOf(item)===-1) return;
      this.items.remove(item);
      //if (this._allowUpdate) this.refreshInnerHeight();
    },
    deleteAt:function(index) {
      var item,lastTop,lastLeft;
      if (index<0||index>this.items.length) return;
      item=this.items[index];
      this.items.removeAt(index);
      //if (this._allowUpdate) this.refreshInnerHeight();
    },
    moveItem:function(itemToMove,itemBefore) {
      var s,l,i,t,l,prop,start;
      if (!(itemToMove instanceof $j.classes.ListBoxItem)) return;
      if (!(itemBefore instanceof $j.classes.ListBoxItem)) return;
      if (this.orientation===$j.types.orientations.VERTICAL) prop="_top";
      else prop="_left";
      s=itemToMove.getIndex()-1;
      l=itemBefore.getIndex()+1;
      if (this._visibleItems.indexOf(itemToMove)>-1) this.items.beginUpdate();
      this.items.remove(itemToMove);
      this.items.insert(itemBefore.getIndex()+1,itemToMove);
      if (l>this.items.length) l=this.items.length;
      start=this.items[s][prop];
      for (i=s;i<l;i++) {
        this.items[i][prop]=start;
        start+=this.items[i].height;
      }
      if (this._visibleItems.indexOf(itemToMove)>-1) {
        //if (this._allowUpdate) this.draw();
        this.items.endUpdate();
      }
      this.items.endUpdate();
    },
    beginUpdate:function() {
      this._allowUpdate=false;
      this.items.beginUpdate();
    },
    endUpdate:function() {
      this._allowUpdate=true;
      this.items.endUpdate();
      //this.refreshInnerHeight();
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
    clearSelection:function() {
		  var item;
      for (var i=0,il=this.items.length;i<il;i++) {
			  item=this.items[i];
				item.setSelected(false);
		  }
    },
    selectAll:function() {
		  var item;
      for (var i=0,il=this.items.length;i<il;i++) {
			  item=this.items[i];
				item.setSelected(true);
		  }
    },
    updateScrollBar:function() {
      if ($j.tools.isNull(this._DOMObj)) return;
      if (this.orientation===$j.types.orientations.VERTICAL) {
        if (this._innerHeight>this.height) {
          this._VScrollBar.updateFromDOM();
          this._VScrollBar.setMax(this._innerHeight);
          this._VScrollBar.setViewportSize(this._content.offsetHeight);
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.VERTICAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.VERTICAL;
        } else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.NONE);
          else this._DOMObj.dataset.scrollbars,$j.types.scrollbars.NONE;
        }
      } else {
        if (this._innerHeight>this.width) {
          this._HScrollBar.updateFromDOM();
          this._HScrollBar.setMax(this._innerHeight);
          this._HScrollBar.setViewportSize(this._content.offsetWidth);
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.HORIZONTAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.HORIZONTAL;
        } else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.NONE);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.NONE;
        }
      }
    },
    loaded:function() {
      this._inherited();
      this.updateScrollBar();
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
        } else if (data===$j.types.scrollbars.HORIZONTAL||data===$j.types.scrollbars.BOTH) {
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
          } else if (data===$j.types.scrollbars.HORIZONTAL||data===$j.types.scrollbars.BOTH) {
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
    },
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{HScrollBar_internalId}");
      html=a.join(this._HScrollBar._internalId);
      a=html.split("{VScrollBar_internalId}");
      html=a.join(this._VScrollBar._internalId);
      return html;
    }
    //#endregion
  });
  Object.seal(ListBox);
  //#endregion
  $j.classes.register($j.types.categories.COMMON,ListBox,ListBoxItem);
  //#region Templates
  var ListBoxTpl=["<div id='{internalId}' data-name='{name}' data-class='ListBox' class='ListBox' data-theme='{theme}' style='{style}' data-scrollbars='none' data-orientation='vertical'>",
                  "<div class='ListBoxContent' data-theme='{theme}'></div>",
                  "<div id='{HScrollBar_internalId}' class='ScrollBar ListBoxSB' data-theme='{theme}' style='height: 16px;' data-value='0' data-viewportsize='0' data-max='0' data-orientation='horizontal'>",
                  "<div class='ScrollBar_inner' data-theme='{theme}'>",
                  "<div class='ScrollBar_thumb' data-theme='{theme}' style='border-radius: 6px; width: 64px;'></div>",
                  "</div>",
                  "<div class='ScrollBarFirstButton' data-theme='{theme}'><span></span></div>",
                  "<div class='ScrollBarLastButton' data-theme='{theme}'><span></span></div>",
                  "</div>",
                  "<div id='{VScrollBar_internalId}' class='ScrollBar ListBoxSB hidden' data-theme='{theme}' style='width: 16px;' data-value='0' data-viewportsize='0' data-max='0' data-orientation='vertical'>",
                  "<div class='ScrollBar_inner' data-theme='{theme}'>",
                  "<div class='ScrollBar_thumb' data-theme='{theme}' style='left: 0px; border-radius: 6px; height: 64px;'></div>",
                  "</div>",
                  "<div class='ScrollBarFirstButton' data-theme='{theme}' style='line-height: 18px;'><span></span></div>",
                  "<div class='ScrollBarLastButton' data-theme='{theme}' style='line-height: 18px;'><span></span></div>",
                  "</div>",
                  "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ListBox,template:ListBoxTpl}]);
  //#endregion
})();