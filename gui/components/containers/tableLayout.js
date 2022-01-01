(function(){
  //#region TableCell
  TableCell=Class.extend({
    _ClassName: "TableCell",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        //#region Private
        this._owner=owner;
        this._DOMObj=(!$j.tools.isNull(props["DOMObj"])?props["DOMObj"]:null);
        //#endregion Private
        this.left=(!$j.tools.isNull(props["left"])?props["left"]:0);
        this.top=(!$j.tools.isNull(props["top"])?props["top"]:0);
        this.width=(!$j.tools.isNull(props["width"])?props["width"]:0);
        this.height=(!$j.tools.isNull(props["height"])?props["height"]:0);
        this.colSpan=(!$j.tools.isNull(props["colSpan"])?props["colSpan"]:1);
        this.rowSpan=(!$j.tools.isNull(props["rowSpan"])?props["rowSpan"]:1);
        this.col=(!$j.tools.isNull(props["col"])?props["col"]:0);
        this.row=(!$j.tools.isNull(props["row"])?props["row"]:0);
        this.visible=(!$j.tools.isNull(props["visible"])?props["visible"]:true);
      }
    },
    //#region Setters
    setBounds:function(l,t,w,h) {
      var style;
      if (typeof l!==_const.NUMBER) return;
      if (typeof t!==_const.NUMBER) return;
      if (typeof w!==_const.NUMBER) return;
      if (typeof h!==_const.NUMBER) return;
      this.left=l;
      this.top=t;
      this.width=w;
      this.height=h;
      if (!$j.tools.isNull(this._DOMObj)) {
        style=this._DOMObj.style;
        style[$j.types.jsCSSProperties.LEFT]=l+$j.types.CSSUnits.PX;
        style[$j.types.jsCSSProperties.TOP]=t+$j.types.CSSUnits.PX;
        style[$j.types.jsCSSProperties.WIDTH]=w+$j.types.CSSUnits.PX;
        style[$j.types.jsCSSProperties.HEIGHT]=h+$j.types.CSSUnits.PX;
      }
    },
    setVisible:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.visible!==newValue) {
        this.visible=newValue;
        if (!$j.tools.isNull(this._DOMObj)) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-visible");
          else this._DOMObj.dataset.visible=this.visible;
        }
      }
    },
    //#endregion Setters
    getChildsDOMObj:function Window_getChildsDOMObj(DOMObj) {
      var nodes=(!$j.tools.isNull(DOMObj))?DOMObj.childNodes:this._DOMObj.childNodes,obj,owner,dataClass,dataName;
      for (var i=0,l=nodes.length;i<l;i++) {
        if ($j.tools.isNull(nodes[i])) continue;
        if (nodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
          dataClass=($j.browser.ie)?nodes[i].getAttribute("data-class"):nodes[i].dataset.class;
          dataName=($j.browser.ie)?nodes[i].getAttribute("data-name"):nodes[i].dataset.name;
          if (!$j.tools.isNull(dataClass)) {
            owner=this._owner;
            if (!$j.tools.isNull($j.classes[dataClass])) {
              obj=$j.classes.createComponent($j.classes[dataClass],owner,dataName,null,false,nodes[i].id);
              obj.col=this.col;
              obj.row=this.row;
              obj.colSpan=this.colSpan;
              obj.rowSpan=this.rowSpan;
            }
          }
        }
      }
    },
    free:function() {
      this._owner=null;
      if (!$j.tools.isNull(this._DOMObj)) {
        this._DOMObj.remove();
      }
      this._DOMObj=null;
      this.left=null;
      this.top=null;
      this.width=null;
      this.height=null;
      this.colSpan=null;
      this.rowSpan=null;
      this.col=null;
      this.row=null;
      this.visible=null;
    }
  });
  //#endregion TableCell
  //#region TableColumn
  TableColumn=Class.extend({
    _ClassName: "TableColumn",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        //#region Private
        this._owner=owner;
        //#endregion Private
        this.left=(!$j.tools.isNull(props["left"])?props["left"]:0);;
        this.width=(!$j.tools.isNull(props["width"])?props["width"]:100);
        this.unit=(!$j.tools.isNull(props["unit"])?props["unit"]:$j.types.CSSUnits.PX);
      }
    },
    //region Setters
    setWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue!==this.width) {
        this.width=newValue;
        this._owner.onChange.invoke();
      }
    },
    setUnit:function(newValue) {
      if (!$j.tools.valueInSet(newValue,$j.types.CSSUnits)) return;
      if (newValue!==this.unit) {
        this.unit=newValue;
        this._owner.onChange.invoke();
      }
    }
    //endregion Setters
  });
  Object.seal(TableColumn);
  //#endregion TableColumn
  //#region TableColumnsCollection
  /*TableColumnsCollection=Class.extend({
    _ClassName: "TableColumnsCollection",
    init: function(owner) {
      if(!$j.tools.isNull(owner)) {
        $j.classes.newCollection(this,owner,$j.classes.TableColumn);
        this.items.onChange.addListener(owner.recalc);
      }
    },
    //#region Methods
    assign: function(source) {
      if(!(source instanceof $j.classes.TableColumnsCollection)) return;
      this.items.length=0;
      if(source.items.length>0) {
        for(var i=0,l=source.items.length;i<l;i++) this.items.push(new $j.classes.TableColumn());
      }
    },
    addColumn:function(column) {
      if ($j.tools.isNull(column)) {
        column=new $j.classes.TableColumn(this);
      }
      this.items.push(column);
    },
    removeColumn:function(column) {
      var idx=this.items.indexOf(column);
      if (idx>-1) this.removeColumnAt(idx);
    },
    removeColumnAt:function(index) {
      var i,l,canContinue=true;
      if(index<0||index>this.getCount()) return;
      if (!this._owner.hasComponentsInRow(index)) {
        $j.dialogs.warning("Cannot delete a column that contains controls.");
        return;
      }
      this._owner.deleteCellsFromColumn(index);
      this.items.removeAt(index);
      //this.onChange.invoke();
    }
    //#endregion Methods
  });
  Object.seal(TableColumnsCollection);*/
  //#endregion TableColumnsCollection
  //#region TableRow
  TableRow=Class.extend({
    _ClassName: "TableRow",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        //#region Private
        this._owner=owner;
        //#endregion Private
        this.top=(!$j.tools.isNull(props["top"])?props["top"]:0);
        this.height=(!$j.tools.isNull(props["height"])?props["height"]:100);
        this.unit=(!$j.tools.isNull(props["unit"])?props["unit"]:$j.types.CSSUnits.PX);
      }
    },
    //region Setters
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue!==this.height) {
        this.height=newValue;
        this._owner.onChange.invoke();
      }
    },
    setUnit:function(newValue) {
      if (!$j.tools.valueInSet(newValue,$j.types.CSSUnits)) return;
      if (newValue!==this.unit) {
        this.unit=newValue;
        this._owner.onChange.invoke();
      }
    }
    //endregion Setters
  });
  Object.seal(TableRow);
  //#endregion TableRow
  //#region TableRowsCollection
  /*TableRowsCollection=Class.extend({
    _ClassName: "TableRowsCollection",
    init: function(owner) {
      if(!$j.tools.isNull(owner)) {
        $j.classes.newCollection(this,owner,$j.classes.TableRow);
        //#region Private
        //this._itemsClass=$j.classes.TableRow;
        //#endregion Private
        this.items.onChange.addListener(owner.recalc);
      }
    },
    //#region Methods
    assign: function(source) {
      if(!(source instanceof $j.classes.TableRowsCollection)) return;
      this.items.length=0;
      if(source.items.length>0) {
        for(var i=0,l=source.items.length;i<l;i++) this.items.push(new $j.classes.TableRow());
      }
    },
    addRow:function(row) {
      if ($j.tools.isNull(row)) {
        row=new $j.classes.TableRow(this);
      }
      this.items.add(row);
    },
    removeRow:function(row) {
      var idx=this.items.indexOf(row);
      if (idx>-1) this.removeRowAt(idx);
    },
    removeRowAt:function(index) {
      var i,l,canContinue=true;
      if(index<0||index>this.getCount()) return;
      if (!this._owner.hasComponentsInRow(index)) {
        $j.dialogs.warning("Cannot delete a row that contains controls.");
        return;
      }
      this._owner.deleteCellsFromRow(index);
      this.items.removeAt(index);
      this.items.onChange.invoke();
    }
    //#endregion
  });*/
  //Object.seal(TableRowsCollection);
  //#endregion TableRowsCollection
  //#region TableLayout
  TableLayout=$j.classes.Layout.extend({
    _ClassName:"TableLayout",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._rowDeleted=false;
        this._colDeleted=false;
        //#endregion Private
        $j.classes.newCollection(this,owner,$j.classes.GradientPoint,"rows");
        $j.classes.newCollection(this,owner,$j.classes.GradientPoint,"columns");
        //this.rows=new $j.classes.TableRowsCollection(this);
        //this.columns=new $j.classes.TableColumnsCollection(this);
        this.cells=[];
        this.cellSpacing=0;
        this.cellPadding=0;
      }
    },
    updateFromDOM:function() {
      var data,i=0,l,rowIdx,colIdx,row,col,rows,units,cols,dataClass;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-showcells"):this._DOMObj.dataset.showcells;
      if (!$j.tools.isNull(data)) this.showCells=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-cellspacing"):this._DOMObj.dataset.cellspacing;
      if (!$j.tools.isNull(data)) this.cellSpacing=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-cellpadding"):this._DOMObj.dataset.cellpadding;
      if (!$j.tools.isNull(data)) this.cellPadding=~~data;
      // rows
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-rows"):this._DOMObj.dataset.rows;
      if (!$j.tools.isNull(data)) {
        data=data.split(";");
        rows=data[0].split(",");
        units=data[1].split(",");
        for (i=0,l=rows.length;i<l;i++) {
          row=new this.rows._itemClass(this.rows,{"height":~~rows[i],"unit":units[i]});
          this.rows.push(row);
        }
      }
      // columns
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-cols"):this._DOMObj.dataset.cols;
      if (!$j.tools.isNull(data)) {
        data=data.split(";");
        cols=data[0].split(",");
        units=data[1].split(",");
        for (i=0,l=rows.length;i<l;i++) {
          col=new this.columns._itemClass(this.columns,{"width":~~cols[i],"unit":units[i]});
          this.columns.push(col);
        }
      }
      // on va chercher les cellules
      data=this._DOMObj.querySelectorAll('[data-row]');
      l=data.length;
      for (i=0;i<l;i++) {
        dataClass=$j.browser.ie?data[i].getAttribute("data-class"):data[i].dataset.class;
        if (!$j.tools.isNull(dataClass)) continue;
        rowIdx=~~($j.browser.ie?data[i].getAttribute("data-row"):data[i].dataset.row);
        colIdx=~~($j.browser.ie?data[i].getAttribute("data-col"):data[i].dataset.col);
        if ($j.tools.isNull(this.cells[rowIdx])) this.cells[rowIdx]=[];
        this.cells[rowIdx][colIdx]=new $j.classes.TableCell(this,{"left":~~data[i].offsetLeft,"top":~~data[i].offsetTop,"width":~~data[i].offsetWidth,"height":~~data[i].offsetHeight,
                                                                  "colSpan":~~($j.browser.ie?data[i].getAttribute("data-colspan"):data[i].dataset.colspan),
                                                                  "rowSpan":~~($j.browser.ie?data[i].getAttribute("data-rowspan"):data[i].dataset.rowspan),
                                                                  "col":~~($j.browser.ie?data[i].getAttribute("data-col"):data[i].dataset.col),
                                                                  "row":~~($j.browser.ie?data[i].getAttribute("data-row"):data[i].dataset.row),
                                                                  "DOMObj":data[i],"visible":_conv.strToBool($j.browser.ie?data[i].getAttribute("data-visible"):data[i].dataset.visible)});
        this.cells[rowIdx][colIdx].getChildsDOMObj();
      }
    },
    hasComponentsInRow:function(index) {
      var i,l,canContinue=true;
      for (i=0,l=this._owner._components.length;i<l;i++) {
        if ((this._owner._components[i].col===i)&&(this._owner._components[i].row===index)) {
          canContinue=false;
          break;
        }
      }
      if (canContinue) {
        for (i=0,l=this.cells[index].length;i<l;i++) {
          if (!this.cells[index][i].visible) {
            canContinue=false;
            break;
          }
        }
      }
      return canContinue;
    },
    hasComponentsInColumn:function(index) {
      var i,l,canContinue=true;
      for (i=0,l=this._owner._components.length;i<l;i++) {
        if ((this._owner._components[i].col===index)&&(this._owner._components[i].row===i)) {
          canContinue=false;
          break;
        }
      }
      if (canContinue) {
        for (i=0,l=this.cells.length;i<l;i++) {
          if (!this.cells[i][index].visible) {
            canContinue=false;
            break;
          }
        }
      }
      return canContinue;
    },
    deleteCellsFromRow:function(index) {
      var i,l;
      for (i=this.cells.length-1;i>=0;i--) {
        this.cells[index][i].free();
        this.cells[index][i]=null;
      }
      this.cells.removeAt(index);
      this._rowDeleted=true;
      for (i=0,l=this._components.length;i<l;i++) {
        if (this._components[i].row>=index) {
          if (index>0) {
            this._components[i].row--;
          } else {
            this._components[i].row++;
          }
        }
      }
    },
    deleteCellsFromColumn:function(index) {
      var i,l;
      for (i=this.cells.length-1;i>=0;i--) {
        this.cells[i][index].free();
        this.cells[i][index]=null;
        this.cells[i].removeAt(index);
      }
      this._colDeleted=true;
      for (i=0,l=this._components.length;i<l;i++) {
        if (this._components[i].col>=index) {
          if (index>0) {
            this._components[i].col--;
          } else {
            this._components[i].cols++;
          }
        }
      }
    },
    recalc:function() {
      var i,lng,heights=widths=0,totalHeight=this.height,totalWidth=this.width,j,l,t,row,col,lng1,h,w,lastPo=-1,currentPo=0,totalPo=0;
      if (this._loading) return;
      // first getting rows height with px unit
      if (this._rowDeleted) {
        lng=this.rows.length;
        for (i=0;i<lng;i++) {
          if (this.rows[i].unit===$j.types.CSSUnits.PX) {
            heights+=this.rows[i].height;
          }
          if (this.rows[i].unit===$j.types.CSSUnits.PO) {
            totalPo+=this.rows[i].height;
            lastPo=i;
          }
        }
        totalHeight-=heights;
        if (totalPo>0) {
          totalPo-=this.rows[lastPo].height;
          heights=totalHeight-~~(totalHeight*(totalPo/100));
          currentPo=~~((heights*100)/this.height);
          this.rows[lastPo].height=currentPo;
        }
      }
      // first getting columns width with px unit
      if (this._colDeleted) {
        totalPo=0;
        lng=this.columns.length();
        for (i=0;i<lng;i++) {
          if (this.columns[i].unit===$j.types.CSSUnits.PX) {
            widths+=this.columns[i].width;
          }
          if (this.columns[i].unit===$j.types.CSSUnits.PO) {
            totalPo+=this.columns[i].width;
            lastPo=i;
          }
        }
        totalWidth-=widths;
        if (totalPo>0) {
          totalPo-=this.columns[lastPo].width;
          heights=totalWidth-~~(totalWidth*(totalPo/100));
          currentPo=~~((widths*100)/this.width);
          this.columns[lastPo].width=currentPo;
        }
      }
      // resize all cells
      l=0;
      t=0;
      for (i=0;i<this.rows.length;i++) {
        for (j=0;j<this.columns.length;j++) {
          if (this.columns[j].unit===$j.types.CSSUnits.PX) w=this.columns[j].width;
          else w=~~(this.width*(this.columns[j].width/100));
          if (this.rows[i].unit===$j.types.CSSUnits.PX) h=this.rows[i].height;
          else h=~~(this.height*(this.rows[i].height/100));
          this.cells[i][j].setBounds(l,t,w,h);
          this.cells[i][j].setVisible(true);
          l+=w;
        }
        t+=h;
        l=0;
      }
      this._rowDeleted=this._colDeleted=false;
      //
      // remove all components from cells
      for (i=0,l=this._components.length;i<l;i++) {
        this._components[i]._DOMObj.remove();
        this.cells[this._components[i].row][this._components[i].col]._DOMObj.appendChild(this._components[i]._DOMObj);
        //this._components[i].realign();
      }
    }
    //#endregion
  });
  Object.seal(TableLayout);
  //endregion TableLayout
  $j.classes.register($j.types.categories.CONTAINERS,TableLayout,/*TableRowsCollection,*/TableRow,/*TableColumnsCollection,*/TableColumn,TableCell);
  //#region Templates
  var TableLayoutTpl="<div id='{internalId}' data-name='{name}' data-class='TableLayout' class='TableLayout' data-theme='{theme}' style='{style}'></div>";
  $j.classes.registerTemplates([{Class:TableLayout,template:TableLayoutTpl}]);
  //endregion
})();