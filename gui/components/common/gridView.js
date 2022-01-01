(function(){
  //#region GridView
  var GridView=$j.classes.ThemedControl.extend({
    _ClassName:"GridView",
    init:function(owner,props) {
      if (owner!==null){
        this._inherited(owner,props);
        // private
        this._viewPort=null;
        this._totalRowsHeight=0;
        this._totalColsWidth=0
        this._down=false;
        this._lastDelta=new $j.classes.Point;
        this._currentPos=new $j.classes.Point;
        this._minColWidth=10;
        this._content=null;
        this._rowIndicatorWidth=20;
        this._hasSparkLinesCells=-1;
        //this.pager=$j.classes.createComponent($j.classes.Pager,this,null,null,false);;
        this._HScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._VScrollBar=$j.classes.createComponent($j.classes.ScrollBar,this,null,null,false);
        this._HScrollBar.onChange.addListener(this.scroll);
        this._VScrollBar.onChange.addListener(this.scroll);
        this._HScrollBar.smallChange=~~(this._HScrollBar.viewportSize/5);
        this._VScrollBar.smallChange=~~(this._VScrollBar.viewportSize/5);
        // public
        this.width=320;
        this.height=120;
        this.fixedCols=0;
        this.fixedRows=0;
        this.vertLine=true;
        this.horzLine=false;
        this.rangeSelect=true;
        this.rowSizing=false;
        this.colSizing=false;
        this.rowMoving=false;
        this.colMoving=false;
        this.editing=false;
        this.tabs=false;
        this.alwaysShowEditor=false;
        this.rowHeight=24;
        this.colWidth=64;
        this.stretchLastCol=false;
        this.autoCols=true;
        this.autoSizeCols=true;
        this.header=null;
        this.rowsHeight=null;
        this.showHeader=true;
        this.showFooter=true;
        this.showPager=false;
        this.showRowIndicator=false;
        this.sortable=true;
        this.dataSource=null;
        this.animatedScroll=true;
        this.useAlternateColor=false;
        this.hitTest.mouseWheel=true;
      }
    },
    //#region Setters
    setDataSource:function(newValue) {
      if (!(newValue instanceof $j.classes.DataSource)) return;
      if (this.dataSource!==newValue) {
        if (this.dataSource instanceof $j.classes.DataSource) this.dataSource.removeControl(this);
        this.dataSource=newValue;
        this.dataSource.addControl(this);
      }
    },
    //#endregion
    //#region Methods
    refresh:function() {
      if (!(this.dataSource.dataset instanceof $j.classes.DataSet)) return;
      this.refreshTotalRowsHeight(false);
      this.refreshTotalColsWidth(false);
      this.moveToCursor();
      this.draw();
    },
    draw:function() {
      var l,t,/*r,b,*/minRow=0,minCol=0,maxRow=0,maxCol=0,wrapper=[],cell,curRow,curCol,row=[],cellValue,fieldsNames,rowHeight,colWidth,theme=this.getThemeName(),topOffset=0,
          rows,cols,colVisible,curLeft=0,leftOffset=0,headerHeight=parseInt($j.CSS.getCSSValue("GridView_header",$j.types.jsCSSProperties.HEIGHT,null,this.getThemeName()),10);
      if (isNaN(headerHeight)||(headerHeight===String.empty)) headerHeight=parseInt($j.CSS.getCSSValue("GridView_header",$j.types.jsCSSProperties.HEIGHT,null,$j.types.CSSFiles.JAGUI),10);
      l=this._HScrollBar.value;
      t=this._VScrollBar.value;
      //r=l+this._viewPort.clientWidth;
      //b=t+this._viewPort.clientHeight-headerHeight;
      if ($j.tools.isNull(this.rowsHeight)) {
        rowHeight=this.rowHeight;
      } else {
        rowHeight=0;
      }
      if (this.autoCols) {
        colWidth=this.colWidth;
        minCol=~~(l/colWidth)|0;
        maxCol=(minCol+~~(this._viewPort.offsetWidth/colWidth))+1;
        if (maxCol>this.dataSource.dataset._nbrFields) maxCol=this.dataSource.dataset._nbrFields;
      } else if (!$j.tools.isNull(this.header)) {
        maxCol=this.header.length;
      } else {
        maxCol=this.dataSource.dataset._nbrFields;
        headerHeight=0;
      }
      if ($j.tools.isNull(this.rowsHeight)) {
        minRow=~~(t/(rowHeight))|0;
        maxRow=(minRow+$j.round((this._viewPort.offsetHeight)/rowHeight));
        if (maxRow>this.dataSource.dataset._nbrRecords) maxRow=this.dataSource.dataset._nbrRecords;
      }
      if (this.showHeader) topOffset+=headerHeight;
      this._viewPort.innerHTML=String.empty;
      $j.CSS.addClass(this._viewPort,"hidden");
      if (this.dataSource.dataset.isOpen) {
        // clear all events
        rows=this._viewPort.childNodes;
        for (curRow=0;curRow<rows.length;curRow++) {
          cols=rows[curRow].childNodes;
          for (curCol=1;curCol<cols.length;curCol++) {
            $j.tools.events.unBind(cols[curCol],"click",this.sort);
          }
        }
        // gestion de l'entête
        if (this.showHeader) {
          if (this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()) curLeft=this._rowIndicatorWidth;
          else curLeft=0;
          curLeft+=leftOffset-l;
          row.push(["<div class='GridView_header GridView_rowLine' data-theme='",theme,"'>"].join(String.empty));
          if (this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()) row.push(["<div class='GridView_rowIndic",(this.vertLine)?" GridView_colLine":String.empty,"' data-theme='",theme,"'></div>"].join(String.empty));
          fieldsNames=Object.keys(this.dataSource.dataset._datas[0]);
          for (curCol=minCol;curCol<maxCol;curCol++) {
            colWidth=($j.tools.isNull(this.header))?colWidth:this.header[curCol].width;
            cellValue=fieldsNames[curCol];
            colVisible=true;
            if (!$j.tools.isNull(this.header)) {
              if (!$j.tools.isNull(this.header[curCol])) {
                if (!$j.tools.isNull(this.header[curCol].caption)) cellValue=this.header[curCol].caption;
                if (!$j.tools.isNull(this.header[curCol].visible)) colVisible=this.header[curCol].visible;
              } else colVisible=false;
            }
            if (colVisible) {
              cell=["<div class='GridView_cell",(this.vertLine)?" GridView_colLine":String.empty,"' style='width:",colWidth,"px;left:",curLeft,"px;' data-theme='",theme,"' data-idx='",curCol,"' data-sorted='",
                    (this.sortedColumn===curCol)?"true":"false","' data-sortedorder='",(this.sortedColumn===curCol)?this.sortedOrder:String.empty,"'>",
                    "<span class='GridView_cellValue verticalCenter' data-theme='",theme,"'>",cellValue,
                    "</span>",this.colSizing?"<div class='GridView_colResizer csr_colResize' data-theme='"+theme+"'></div>":String.empty,"</div>"].join(String.empty);
              row.push(cell);
              curLeft+=colWidth;//+(this.vertLine?1:0);
            }
          }
          row.push("</div>");
          wrapper.push(row.join(String.empty));
          row.clear();
        }
        curTop=topOffset-(t-(minRow*(rowHeight/*+(this.horzLine?1:0)*/)));
        for(curRow=minRow;curRow<maxRow;curRow++) {
          if (this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()) curLeft=this._rowIndicatorWidth;
          else curLeft=0;
          curLeft+=leftOffset-l;
          fieldsNames=Object.keys(this.dataSource.dataset._datas[curRow]);
          row.push(["<div class='GridView_row",(this.horzLine)?" GridView_rowLine":String.empty,"' style='height:",rowHeight,"px;top:",curTop,"px;' data-theme='",theme,
                    "' data-iscurrent='",(this.dataSource.dataset._cursorIdx===curRow)?"true":"false","' data-alternate='",(curRow%2!==0?(this.useAlternateColor?"true":"false"):"false"),"' data-idx='",curRow,"'>"].join(String.empty));
          if (this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()) row.push(["<div class='GridView_rowIndic GridView_rowLine",(this.vertLine)?" GridView_colLine":String.empty,"' data-theme='",theme,"' data-visible='",
                                               (this.dataSource.dataset._cursorIdx===curRow)?"true":"false","'></div>"].join(String.empty));
          for(curCol=minCol;curCol<maxCol;curCol++) {
            colWidth=($j.tools.isNull(this.header))?colWidth:this.header[curCol].width;
            cellValue=this.dataSource.dataset._datas[curRow][fieldsNames[curCol]];
            colVisible=true;
            if (!$j.tools.isNull(this.header)) {
              if (!$j.tools.isNull(this.header[curCol])) {
                if (!$j.tools.isNull(this.header[curCol].fieldName)) {
                  cellValue=this.dataSource.dataset._datas[curRow][this.header[curCol].fieldName];
                  if ($j.tools.isNull(cellValue)) cellValue=this.dataSource.dataset._datas[curRow][fieldsNames[curCol]];
                }
                if (!$j.tools.isNull(this.header[curCol].visible)) colVisible=this.header[curCol].visible
              } else colVisible=false;
            }
            if (colVisible) {
              cell=["<div class='GridView_cell",(this.vertLine)?" GridView_colLine":String.empty,"' style='width:",colWidth,"px;left:",curLeft,"px;' data-theme='",theme,"'>",
                    this.getCellTemplate(cellValue,curCol,colWidth),"</div>"].join(String.empty);
              row.push(cell);
              curLeft+=colWidth;//+(this.vertLine?1:0);
            }
          }
          row.push("</div>");
          wrapper.push(row.join(String.empty));
          row.clear();
          curTop+=rowHeight/*+(this.horzLine?1:0)*/;
        }
        this._viewPort.innerHTML=wrapper.join(String.empty);
        rows=this._viewPort.childNodes;
        if (this.autoSizeCols) {
          if ($j.tools.isNull(this.header)) {
            this.header=[];
          }
          for (curRow=0;curRow<rows.length;curRow++) {
            cols=rows[curRow].childNodes;
            curCol=(this.showRowIndicator&&this.dataSource.dataset.hasKeyfield())?1:0;
            for (;curCol<cols.length;curCol++) {
              if ($j.tools.isNull(this.header[curCol-(this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()?1:0)])) this.header[curCol-(this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()?1:0)]={"width":this.colWidth};
              if (cols[curCol].firstElementChild.offsetWidth>this.header[curCol-(this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()?1:0)].width) {
                this.header[curCol-(this.showRowIndicator&&this.dataSource.dataset.hasKeyfield()?1:0)].width=cols[curCol].firstElementChild.offsetWidth;
              }
            }
          }
        }
        if (!$j.tools.isNull(this.header)) {
          cols=rows[0].childNodes;
          for (curCol=1;curCol<cols.length;curCol++) {
            if (this.sortable) {
              cols[curCol].jsObj=this;
              cols[curCol].firstElementChild.jsObj=this;
              $j.tools.events.bind(cols[curCol],$j.types.mouseEvents.CLICK,this.sort);
            }
            if (this.colSizing) {
              cols[curCol].lastElementChild.jsObj=this;
              if ($j.browser.ie) cols[curCol].lastElementChild.setAttribute("data-colidx",curCol);
              else cols[curCol].lastElementChild.dataset.colidx=curCol;
              $j.tools.events.bind(cols[curCol].lastElementChild,$j.types.mouseEvents.DOWN,this.downColResizer);
              $j.tools.events.bind(cols[curCol].lastElementChild,$j.types.mouseEvents.MOVE,this.moveColResizer);
              $j.tools.events.bind(cols[curCol].lastElementChild,$j.types.mouseEvents.UP,this.upColResizer);
            }
          }
        }
        $j.CSS.removeClass(this._viewPort,"hidden");
        if (this._hasSparkLinesCells>-1) this.drawSparks();
      }
    },
    beginUpdate:function() {
      this._allowUpdate=false;
    },
    endUpdate:function() {
      this._allowUpdate=true;
      this.refresh();
    },
    refreshTotalRowsHeight:function(draw) {
      if (!(this.dataSource.dataset instanceof $j.classes.DataSet)) return;
      if (!this.dataSource.dataset.isOpen) return;
      var rows=this.dataSource.dataset;
      this._totalRowsHeight=0;
      if (!$j.tools.isNull(this.rowsHeight)) {
        for (var i=0,l=rows._nbrRecords;i<l;i++) {
          this._totalRowsHeight+=this.rowsHeight[i]/*+(this.horzLine?1:0)*/;
        }
      } else this._totalRowsHeight=(rows._nbrRecords/*+(this.showHeader?1:0)*/)*(this.rowHeight/*+(this.horzLine?1:0)*/);
      if (this._allowUpdate) {
        this.updateVScrollBar();
        if (draw) this.draw();
      }
    },
    refreshTotalColsWidth:function(draw) {
      if (!(this.dataSource.dataset instanceof $j.classes.DataSet)) return;
      if (!this.dataSource.dataset.isOpen) return;
      var rows=this.dataSource.dataset,colVisible=true;;
      this._totalColsWidth=0;
      if (!$j.tools.isNull(this.header)) {
        for (var i=0,l=rows._nbrFields;i<l;i++) {
          colVisible=true;
          if (!$j.tools.isNull(this.header[i])) {
            if (!$j.tools.isNull(this.header[i].visible)) colVisible=this.header[i].visible;
            if (colVisible) this._totalColsWidth+=this.header[i].width;
          }
        }
        if (this.showRowIndicator) this._totalColsWidth+=20;
      } else this._totalColsWidth=rows._nbrFields*this.colWidth;
      if (this._allowUpdate) {
        this.updateHScrollBar();
        if (draw) this.draw();
      }
    },
    updateHScrollBar:function() {
      var offset=0,data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) offset=this._VScrollBar.width;
      if (this._totalColsWidth>this._viewPort.offsetWidth) {
        if (this._totalRowsHeight<this._viewPort.offsetHeight) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.HORIZONTAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.HORIZONTAL;
        } else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.BOTH);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.BOTH;
        }
        this._HScrollBar.setMax(this._totalColsWidth+(this.showRowIndicator?this._rowIndicatorWidth:0));
        this._HScrollBar.setViewportSize(this._viewPort.offsetWidth);
        this._HScrollBar.smallChange=~~(this._HScrollBar.viewportSize/5);
      } else {
        if (this._totalRowsHeight<this._viewPort.offsetHeight+this._viewPort.offsetTop) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.NONE);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.NONE;
        } else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.VERTICAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.VERTICAL;
        }
      }
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) this.updateVScrollBar();
    },
    updateVScrollBar:function() {
      var rowHeight;
      if (this._totalRowsHeight>this._viewPort.offsetHeight) {
        if (this._totalColsWidth<this._viewPort.offsetWidth) {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.VERTICAL);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.VERTICAL;
        } else {
          if ($j.browser.ie) this._DOMObj.setAttribute("data-scrollbars",$j.types.scrollbars.BOTH);
          else this._DOMObj.dataset.scrollbars=$j.types.scrollbars.BOTH;
        }
        this._VScrollBar.setMax(this._totalRowsHeight+(this.showHeader?this.rowHeight/*+(this.horzLine?1:0)*/:0));
        this._VScrollBar.setViewportSize(this._viewPort.offsetHeight);
        this._VScrollBar.smallChange=~~(this._VScrollBar.viewportSize/5);
      } else {
        if (this._totalColsWidth<this._viewPort.offsetWidth+this._viewPort.offsetLeft) {
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
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-usealternatecolor"):this._DOMObj.dataset.usealternatecolor;
      if (!$j.tools.isNull(data)) this.useAlternateColor=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-editing"):this._DOMObj.dataset.columns;
      if (!$j.tools.isNull(data)) this.editing=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-source"):this._DOMObj.dataset.source;
      if (!$j.tools.isNull(data)) this.dataSource=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-showheader"):this._DOMObj.dataset.showheader;
      if (!$j.tools.isNull(data)) this.showHeader=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-showrowindicator"):this._DOMObj.dataset.showrowindicator;
      if (!$j.tools.isNull(data)) this.showRowIndicator=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-autocols"):this._DOMObj.dataset.autocols;
      if (!$j.tools.isNull(data)) this.autoCols=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-showpager"):this._DOMObj.dataset.showpager;
      if (!$j.tools.isNull(data)) this.showPager=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-sortable"):this._DOMObj.dataset.sortable;
      if (!$j.tools.isNull(data)) this.sortable=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-horzline"):this._DOMObj.dataset.horzline;
      if (!$j.tools.isNull(data)) this.horzLine=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-vertline"):this._DOMObj.dataset.vertline;
      if (!$j.tools.isNull(data)) this.vertLine=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-rowsizing"):this._DOMObj.dataset.rowsizing;
      if (!$j.tools.isNull(data)) this.rowSizing=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-colsizing"):this._DOMObj.dataset.colsizing;
      if (!$j.tools.isNull(data)) this.colSizing=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-rowmoving"):this._DOMObj.dataset.rowmoving;
      if (!$j.tools.isNull(data)) this.rowMoving=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-colmoving"):this._DOMObj.dataset.colmoving;
      if (!$j.tools.isNull(data)) this.colMoving=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-tabs"):this._DOMObj.dataset.tabs;
      if (!$j.tools.isNull(data)) this.tabs=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-alwaysshoweditor"):this._DOMObj.dataset.alwaysshoweditor;
      if (!$j.tools.isNull(data)) this.alwaysShowEditor=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-stretchlastcol"):this._DOMObj.dataset.stretchlastcol;
      if (!$j.tools.isNull(data)) this.stretchLastCol=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-autosizecols"):this._DOMObj.dataset.autosizecols;
      if (!$j.tools.isNull(data)) this.autoSizeCols=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-showfooter"):this._DOMObj.dataset.showfooter;
      if (!$j.tools.isNull(data)) this.showFooter=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-header"):this._DOMObj.dataset.header;
      if (!$j.tools.isNull(data)&&data!==String.empty) this.header=JSON.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-rowsheight"):this._DOMObj.dataset.rowsheight;
      if (!$j.tools.isNull(data)&&data!==String.empty) this.rowsHeight=JSON.parse(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-fixedcols"):this._DOMObj.dataset.fixedcols;
      if (!$j.tools.isNull(data)&&data!==String.empty) this.fixedCols=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-fixedrows"):this._DOMObj.dataset.fixedrows;
      if (!$j.tools.isNull(data)&&data!==String.empty) this.fixedRows=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-rangeselect"):this._DOMObj.dataset.rangeselect;
      if (!$j.tools.isNull(data)) this.rangeSelect=_conv.strToBool(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-animatedscroll"):this._DOMObj.dataset.animatedscroll;
      if (!$j.tools.isNull(data)) this.animatedScroll=_conv.strToBool(data);
      if (!$j.tools.isNull(this.header)) this.autoCols=this.autoSizeCols=false;
    },
    getChildsDOMObj:function() {
      this._content=this._DOMObj.firstElementChild;
      this._content.jsObj=this;
      this._viewPort=this._content.firstElementChild;
      this._viewPort.jsObj=this;
      this._VScrollBar.getDOMObj(this._content.lastElementChild.id);
      this._VScrollBar.getChildsDOMObj();
      this._VScrollBar.updateFromDOM();
      this._HScrollBar._DOMObj=this._VScrollBar._DOMObj.previousSibling;
      while (this._HScrollBar._DOMObj.nodeType!==$j.types.xmlNodeTypes.ELEMENT_NODE) {
        this._HScrollBar._DOMObj=this._HScrollBar._DOMObj.previousSibling;
      }
      this._HScrollBar.getDOMObj(this._HScrollBar._DOMObj.id);
      this._HScrollBar.getChildsDOMObj();
      this._HScrollBar.updateFromDOM();
    },
    update: function CustomTextControl_update() {
    },
    scroll:function() {
      this._owner.draw();
    },
    mouseWheel:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
      if ((data===$j.types.scrollbars.VERTICAL)||(data===$j.types.scrollbars.BOTH)) {
        this._VScrollBar.mouseWheel();
      } else if (data===$j.types.scrollbars.HORIZONTAL) {
        this._HScrollBar.mouseWheel();
      }
    },
    loaded:function() {
      this._inherited();
      if (!$j.tools.isNull(this.dataSource)) {
        if (!$j.tools.isNull(this.form[this.dataSource])) this.setDataSource(this.form[this.dataSource]);
      }
      this.refresh();
    },
    mouseDown:function() {
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT){
        this._lastDelta.setValues(0,0);
        this._currentPos.assign($j.mouse.screen);
        this._down=true;
        if ((!$j.tools.isNull(this._VScrollAni))&&(this._VScrollAni.running)) this._VScrollAni.stopAtCurrent();
        if ((!$j.tools.isNull(this._HScrollAni))&&(this._HScrollAni.running)) this._HScrollAni.stopAtCurrent();
      }
    },
    mouseMove:function() {
      var data;
      if (!$j.tools.isNull(this._curResizer)) this.moveColResizer.apply(this._curResizer,[$j.mouse.event]);
      else {
        this._inherited();
        if (this._down) {
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
      }
    },
    mouseUp:function() {
      var data;
      if (!$j.tools.isNull(this._curResizer)) {
        this._curResizer=null;
        $j.CSS.removeClass(this._viewPort.lastElementChild,"csr_colResize");
        // destruction du dernier élément dans viewPort
        this._viewPort.removeChild(this._viewPort.lastElementChild);
        this.refresh();
        return;
      }
      this._inherited();
      if (this._down) {
        this._down=false;
        if (this.animatedScroll&&((this._lastDelta.x!==0)||(this._lastDelta.y!==0))) {
          data=($j.browser.ie)?this._DOMObj.getAttribute("data-scrollbars"):this._DOMObj.dataset.scrollbars;
          if (data===$j.types.scrollbars.VERTICAL||data===$j.types.scrollbars.BOTH) {
            this.createVScrollAni();
            if (this._VScrollAni.running) this._VScrollAni.stopAtCurrent();
            this._VScrollAni.stopValue=this._VScrollBar.value-(this._lastDelta.y*20);
            this._VScrollAni.start();
          } else if (data===$j.types.scrollbars.HORIZONTAL||data===$j.types.scrollbars.BOTH) {
            this.createHScrollAni();
            if (this._HScrollAni.running) this._HScrollAni.stopAtCurrent();
            this._HScrollAni.stopValue=this._HScrollBar.value-(this._lastDelta.x*20);
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
    },
    sort:function(col,order) {
      var gridView,parentNode;
      if (!$j.tools.isNull(this.jsObj)) {
        gridView=this.jsObj;
        if (this instanceof HTMLSpanElement) parentNode=this.parentNode;
        else parentNode=this;
        if (gridView.colSizing&&col instanceof MouseEvent&&col.target===parentNode.lastElementChild) return;
        col=($j.browser.ie)?parentNode.getAttribute("data-idx"):parentNode.dataset.idx;
        if (!$j.tools.isNull(col)) col=parseInt(col,10);
        order=($j.browser.ie)?parentNode.getAttribute("data-sortedorder"):parentNode.dataset.sortedorder;
        if ($j.tools.isNull(order)||order===String.empty) order=$j.types.sortedOrders.DESC;
        if (!$j.tools.isNull(gridView.header)) {
          if (!$j.tools.isNull(gridView.header[col].sortable)) {
            if (!gridView.header[col].sortable) return;
          }
        }
      } else gridView=this;
      if ($j.tools.isNull(col)) return;
      gridView.sortedColumn=col;
      if ($j.tools.isNull(gridView.header)) gridView.sortedColType=_const.STRING;
      else gridView.sortedColtype=gridView.header[col].dataType;
      if (order===$j.types.sortedOrders.ASC) order=$j.types.sortedOrders.DESC;
      else order=$j.types.sortedOrders.ASC;
      gridView.sortedOrder=order;
      switch (gridView.sortedColtype) {
        case _const.DATE:
          gridView.dataSource.dataset._datas.sort(gridView.dataSource.dataset.sortByDate(col,order));
          break;
        case _const.NUMBER:
        case _const.INTEGER:
          gridView.dataSource.dataset._datas.sort(gridView.dataSource.dataset.sortByNumber(col,order));
          break;
        case _const.BOOLEAN:
          gridView.dataSource.dataset._datas.sort(gridView.dataSource.dataset.sortByBoolean(col,order));
          break;
        case _const.STRING:
        default:
          gridView.dataSource.dataset._datas.sort(gridView.dataSource.dataset.sortByString(col,order));
          break;
      }
      gridView.dataSource.dataset.goToCurrentCursor();
      gridView.moveToCursor();
      gridView.refresh();
    },
    downColResizer:function(event) {
      var obj=this.jsObj,resizeLine,x;
      if (!obj.isEnabled()) return;
      $j.mouse.getMouseInfos(event);
      obj._lastDelta.setValues(this.parentNode.offsetWidth,0);
      obj._curResizer=this;
      obj._currentPos.assign($j.mouse.document);
      $j.CSS.addClass(obj._viewPort.lastElementChild,"csr_colResize");
      obj.form._capturedControl=obj;
      obj.enterFocus();
      resizeLine=$j.doc.createElement($j.types.HTMLElements.DIV);
      $j.CSS.addClass(resizeLine,"vResizeLine");
      if ($j.browser.ie) resizeLine.setAttribute("data-theme",obj.getThemeName());
      else resizeLine.dataset.theme=obj.getThemeName();
      x=this.offsetLeft+this.parentNode.offsetLeft+this.offsetWidth;
      resizeLine.style[$j.types.jsCSSProperties.LEFT]=x+$j.types.CSSUnits.PX;
      obj._viewPort.appendChild(resizeLine);
      $j.mouse.stopEvent(event);
    },
    moveColResizer:function(event) {
      var obj=this.jsObj,newWidth,colIdx=0,x;
      if (!obj.isEnabled()) return;
      if (obj.form._capturedControl!==obj) return;
      if (obj._curResizer!==this) return;
      $j.mouse.getMouseInfos(event);
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        if (obj._curResizer===this) {
          newWidth=obj._lastDelta.x+($j.mouse.document.x-obj._currentPos.x);
          if (newWidth<obj._rowIndicatorWidth) newWidth=obj._rowIndicatorWidth;
          colIdx=parseInt(($j.browser.ie)?this.parentNode.getAttribute("data-idx"):this.parentNode.dataset.idx,10);
          x=newWidth+this.parentNode.offsetLeft;
          obj._viewPort.lastElementChild.style[$j.types.jsCSSProperties.LEFT]=x+$j.types.CSSUnits.PX;
          obj.header[colIdx].width=newWidth;
        }
      }
      $j.mouse.stopEvent(event);
    },
    upColResizer:function(event) {
      var obj=this.jsObj;
      if (!obj.isEnabled()) return;
      $j.mouse.getMouseInfos(event);
      $j.mouse.stopEvent(event);
      obj.mouseUp();
    },
    moveToCursor:function() {
      var top=0,i=0,l;
      if (!$j.tools.isNull(this.rowsHeight)) {
        l=this.rowsHeight.length;
        for (;i<l;i++) {

        }
      } else {
        //l=this.datasource.dataset._datas.length;
        while (i<this.dataSource.dataset._cursorIdx) {
          top+=this.rowHeight;
          i++;
        }
      }
      this._VScrollBar.setValue(top);
    },
    getCellTemplate:function(value,col,cellWidth) {
      var tpl,a,column,cellTemplate,w,val=value;
      if (!$j.tools.isNull(this.header)) {
        column=this.header[col];
        if (!$j.tools.isNull(column.cellTemplate)) cellTemplate="GridViewCell"+column.cellTemplate;
        else cellTemplate="GridViewCellLabel";
      } else cellTemplate="GridViewCellLabel";
      tpl=$j.templates[cellTemplate],a;
      a=tpl.split("{theme}");
      tpl=a.join(this.getThemeName());
      a=tpl.split("{value}");
      if (cellTemplate==="GridViewCellColor") {
        val=_colors.getColorName(_colors.parse(value));
      } else if (cellTemplate==="GridViewCellSparkLines") {
        val=JSON.stringify(value.values);
      }
      tpl=a.join(val);
      switch (cellTemplate) {
        case "GridViewCellRating":
          w=parseInt($j.CSS.getCSSValue(".GridviewCellRating","max-width",$j.types.CSSSelectorsFlags.ENDS,null,$j.types.CSSFiles.JAGUI),10);
          w=(w/column.cellEditor.classProperties.max)*value;
          a=tpl.split("{width}");
          tpl=a.join(w);
          break;
        case "GridViewCellProgressBar":
          w=~~((value/100)*cellWidth);
          a=tpl.split("{width}");
          tpl=a.join(w);
          break;
        case "GridViewCellImage":
          a=tpl.split("{width}");
          tpl=a.join(this.rowHeight);
          break;
        case "GridViewCellSparkLines":
          a=tpl.split("{width}");
          tpl=a.join(cellWidth-1);
          a=tpl.split("{height}");
          tpl=a.join(this.rowHeight-1);
          a=tpl.split("{color}");
          tpl=a.join(value.color);
          a=tpl.split("{minColor}");
          tpl=a.join(value.minColor);
          a=tpl.split("{maxColor}");
          tpl=a.join(value.maxColor);
          a=tpl.split("{filledColor}");
          if (!$j.tools.isNull(value.filledColor)) tpl=a.join(value.filledColor);
          else tpl=a.join(String.empty);
          a=tpl.split("{type}");
          tpl=a.join(value.type);
          this._hasSparkLinesCells=col;
          break;
      }
      return tpl;
    },
    drawSparks:function() {
      var cell,rows=this._viewPort.childNodes,row,r=0,tr=rows.length,canvas,ctx,idx;
      //if (!$j.tools.isNull(this.header)) {
        r=1;
        for (;r<tr;r++) {
          row=rows[r];
          if ($j.browser.ie) idx=row.getAttribute("data-idx");
          else idx=row.dataset.idx;
          cell=row.childNodes[this._hasSparkLinesCells];
          canvas=cell.firstElementChild;
          ctx=canvas.getContext("2d");
          ctx.drawSpark(this.dataSource.dataset._datas[idx][this.header[this._hasSparkLinesCells].fieldName]);
        }
      //}
    }
    //#endregion
  });
  //#endregion
  Object.seal(GridView);
  $j.classes.register($j.types.categories.COMMON,GridView);
  //#region Templates
  var GridViewTpl=["<div id='{internalId}' data-name='{name}' data-class='GridView' class='GridView' data-theme='{theme}' style='{style}' data-scrollbars='none'>",
                   "<div class='GridView_Content' data-theme='{theme}'>",
                   "<div class='GridView_ViewPort' data-theme='{theme}'></div>",
                   "<div id='{HScrollBar_internalId}' class='ScrollBar GridViewSB' data-theme='{theme}' style='height: 16px;' data-value='0' data-viewportsize='0' data-max='0' data-orientation='horizontal'>",
                   "<div class='ScrollBar_inner' data-theme='{theme}'>",
                   "<div class='ScrollBar_thumb' data-theme='{theme}' style='border-radius: 6px; width: 64px;'></div>",
                   "</div>",
                   "<div class='ScrollBarFirstButton' data-theme='{theme}'></div>",
                   "<div class='ScrollBarLastButton' data-theme='{theme}'></div>",
                   "</div>",
                   "<div id='{VScrollBar_internalId}' class='ScrollBar GridViewSB' data-theme='{theme}' style='width: 16px;' data-value='0' data-viewportsize='0' data-max='0' data-orientation='vertical'>",
                   "<div class='ScrollBar_inner' data-theme='{theme}'>",
                   "<div class='ScrollBar_thumb' data-theme='{theme}' style='left: 0px; border-radius: 6px; height: 64px;'></div>",
                   "</div>",
                   "<div class='ScrollBarFirstButton' data-theme='{theme}' style='line-height: 18px;'></div>",
                   "<div class='ScrollBarLastButton' data-theme='{theme}' style='line-height: 18px;'></div>",
                   "</div>",
                   "</div>",
                   "<div id='{Pager_internalId}' data-class='Pager' class='Pager' data-theme='{theme}'>",
                   "<div id='' data-class='Button' class='Button NavButton NavBtnFirst' data-theme='{theme}'><span></span></div>",
                   "<div id='' data-class='Button' class='Button NavButton NavBtnPrev' data-theme='{theme}'><span></span></div>",
                   "<div id='' data-class='Button' class='Button NavButton' data-theme='{theme}'><span>1</span></div>",
                   "<div id='' data-class='Button' class='Button NavButton' data-theme='{theme}'><span>2</span></div>",
                   "<div id='' data-class='Button' class='Button NavButton' data-theme='{theme}'><span>3</span></div>",
                   "<div id='' data-class='Button' class='Button NavButton NavBtnNext' data-theme='{theme}'><span></span></div>",
                   "<div id='' data-class='Button' class='Button NavButton NavBtnLast' data-theme='{theme}'><span></span></div>",
                   "<div id='' data-class='TextBox' class='TextBox NavItemsPerPage' data-theme='{theme}'><input type='text' value='10' class='csr_text' data-theme='{theme}' /></div>",
                   "<label id='' data-class='Label' class='Label csr_default NavLblItems' data-theme='{theme}'>items per page</label>",
                   "<label id='' data-class='Label' class='Label csr_default NavLblCurItems' data-theme='{theme}'>1 - 10 of 50 items</label>",
                   "</div></div>"].join(String.empty),
       GridViewCellLabelTpl="<label class='GridviewCellLabel csr_default verticalCenter GridView_cellValue' data-theme='{theme}'>{value}</label>",
       GridViewCellRatingTpl="<div class='GridviewCellRating Rating verticalCenter GridView_cellValue Rating-selected' data-theme='{theme}' data-nbitem='5' data-value='{value}' data-precision='wholeitem'><div class='Rating-selected' style='width:{width}px;'></div></div>",
       GridViewCellCheckBoxTpl="<div class='GridviewCellCheckBox CheckBox verticalCenter GridView_cellValue' data-theme='{theme}' data-ischecked='{value}'></div>",
       GridViewCellProgressBarTpl="<div class='GridviewCellProgressBar ProgressBar verticalCenter GridView_cellValue' style='width:{width}px' data-theme='{theme}' data-value='{value}' title='{value}'></div>",
       GridViewCellImageTpl="<div class='GridviewCellImage centerCenter GridView_cellValue' style='width:{width}px;height:{width}px;background-image:url({value});' data-theme='{theme}' title='{value}'></div>",
       GridViewCellColorTpl="<div data-theme='{theme}' class='GridViewCellColor verticalCenter GridView_cellValue'>{value}<div style='background-color:{value};'></div></div>",
       GridViewCellSparkLinesTpl="<canvas width='{width}' height='{height}' style='width:{width}px;height:{height}px;'></canvas>";
  $j.classes.registerTemplates([{Class:GridView,template:GridViewTpl},{Class:"GridViewCellLabel",template:GridViewCellLabelTpl},
                                {Class:"GridViewCellCheckBox",template:GridViewCellCheckBoxTpl},{Class:"GridViewCellRating",template:GridViewCellRatingTpl},
                                {Class:"GridViewCellProgressBar",template:GridViewCellProgressBarTpl},{Class:"GridViewCellColor",template:GridViewCellColorTpl},
                                {Class:"GridViewCellImage",template:GridViewCellImageTpl},{Class:"GridViewCellSparkLines",template:GridViewCellSparkLinesTpl}]);
  //#endregion
})();
/*
http://handsontable.com/demo/fixed.html
*/