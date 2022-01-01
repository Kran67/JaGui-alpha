(function(){
  //#region ListBoxItemColor
  var ListBoxItemColor=$j.classes.ListBoxItemPopup.extend({
    _ClassName:"ListBoxItemColor",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._forceMouseWheel=true;
        //#endregion
        this.color=_colors.newColor(0,0,0,0);
      }
    },
    //#region Methods
    draw:function(alternate) {
      var colorDiv;
      this._inherited(alternate);
      colorDiv=$j.doc.createElement($j.types.HTMLElements.DIV);
      colorDiv.style[$j.types.jsCSSProperties.BACKGROUNDCOLOR]=this.color.toARGBString();
      this._dom.appendChild(colorDiv);
    }
    //#endregion
  });
  //#endregion
  //#region ListBoxColorPopup
  var ListBoxColorPopup=$j.classes.ListBoxPopup.extend({
    _ClassName:"ListBoxColorPopup",
    //#region Method
    selectItem:function() {
      var jsObj=this.jsObj;
      this._inherited();
      jsObj._owner._dropDownListBox.setColor(jsObj._owner.itemIndex);
      //jsObj._owner.itemIndex=jsObj.getIndex();
      jsObj._owner._dropDownListBox.itemIndex=jsObj._owner.itemIndex;
      jsObj.form.destroyPopups(jsObj.hidePopups);
    }
    //#endregion
  });
  Object.seal(ListBoxColorPopup);
  //#endregion
  //#region DropDownListBoxColor
  var DropDownListBoxColor=$j.classes.DropDownListBox.extend({
    _ClassName:"DropDownListBoxColor",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      var item,top=0,colors,i,l;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this._listBoxClass=$j.classes.ListBoxColorPopup;
        this.color=_colors.newColor(0,0,0,0);
        this._selectedColor=null;
        this.itemIndex=-1;
        colors=Object.keys(_colors);
        i=0;
        l=colors.length;
        for (;i<l;i++) {
          if (_colors[colors[i]] instanceof $j.classes.Color) {
            item=$j.classes.createComponent($j.classes.ListBoxItemColor,this,null,null,false);
            item.top=top;
            item.color.assign(_colors[colors[i]]);
            item.text=colors[i].firstCharUpper();
            top+=this.itemsSize;
            this.items.push(item);
          }
        }
      }
    },
    //#region Setter
    setColor:function(newValue) {
      var item;
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0) return;
      if (newValue>this.items.length) return;
      item=this.items[newValue];
      this.setText(item.text);
      this._selectedColor.style[$j.types.jsCSSProperties.BACKGROUNDCOLOR]=item.color.toARGBString();
      this.color.assign(item.color);
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      var lastStart=0,item,items=[];
      this._selectedColor=this._DOMObj.firstElementChild;
      this._selectedColor.jsObj=this;
      this._content=this._DOMObj.lastElementChild;
      this._content.jsObj=this;
      this._input=this._content.firstElementChild;
      this._input.jsObj=this;
      for (var i=0,l=items.length;i<l;i++) {
        item=$j.classes.createComponent($j.classes.DropDownListBoxItem,this,null,null,false);
        if (!$j.tools.isNull(items[i].size)) item.size=items[i].size;
        if (!$j.tools.isNull(items[i].isChecked)) item.isChecked=items[i].isChecked;
        if (!$j.tools.isNull(items[i].isHeader)) item.isHeader=items[i].isHeader;
        if (!$j.tools.isNull(items[i].enabled)) item.enabled=items[i].enabled;
        item.top=lastStart;
        this.items.push(item);
        lastStart+=item.size;
      }
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-itemindex"):this._DOMObj.dataset.itemindex;
      if (!$j.tools.isNull(data)) this.itemindex=~~data;
    },
    loaded:function() {
      this._inherited();
      if (this.itemIndex>-1) this.setColor(this.itemIndex);
    }
    //#endregion
  });
  Object.seal(DropDownListBoxColor);
  //#endregion
  $j.classes.register($j.types.categories.COLOR,DropDownListBoxColor, ListBoxItemColor, ListBoxColorPopup);
  //#region Templates
  var DropDownListBoxColorTpl=["<div id='{internalId}' data-name='{name}' data-class='DropDownListBoxColor' class='DropDownListBoxColor' data-theme='{theme}' style='{style}' data-editable='{editable}'>",
                         "<div class='DropDownListBoxColorPopup_color'></div>",
                         "<span>(</span>",
                         "<div class='DropDownListBoxColorPopupContent' data-theme='{theme}'>",
                         "<input type='text' readonly='readonly' class='csr_default' data-theme='{theme}'>",
                         "</div>",
                         "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:DropDownListBoxColor,template:DropDownListBoxColorTpl},{Class:ListBoxColorPopup,template:$j.templates["ListBox"]}]);
  //#endregion
})();