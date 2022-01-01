(function(){
  //#region DataSourceTypes
  $j.types.DataSourceTypes={
    WEBSERVICE:"webService",
    COLLECTION:"collection",
    MEMORYXML:"memoryXML",
    LOCALDB:"localDB",
    EXTERNALDB:"externalDB",
    MEMORYJSON:"memoryJSON",
    FILE:"file"
  }
  //#endregion
  //#region DataSource
  var DataSource=$j.classes.Component.extend({
    _ClassName:"DataSource",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        //#region Private
        this._controls=[];
        //#endregion
        this.autoEdit=true;
        this.dataType=$j.types.DataSourceTypes.MEMORYJSON;
        this.dataset=null;
        this.enabled=true;
      }
    },
    //#region Setters
    setAutoEdit:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.autoEdit!==newValue) {
        this.autoEdit=newValue;
      }
    },
    setDataset:function(newValue) {
      if (!(newValue instanceof $j.classes.DataSet)) return;
      if (this.dataset!==newValue) {
        this.dataset=newValue;
        this.dataset.dataSource=this;
      }
    },
    setEnabled:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.enabled!==newValue) {
        this.enabled=newValue;
      }
    },
    //#endregion
    //#region Methods
    addControl:function(control) {
      if (this._controls.indexOf(control)>-1) return;
      else this._controls.push(control);
    },
    removeControl:function(control) {
      if (this._controls.indexOf(control)>-1) return;
      else this._controls.remove(control);
    },
    refreshControls:function() {
      for (var i=0,l=this._controls.length;i<l;i++) {
        this._controls[i].refresh();
      }
    },
    updateFromDOM:function() {
      var data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-type"):this._DOMObj.dataset.type;
      if (!$j.tools.isNull(data)) {
        this.dataType=data;
      }
      if (this.dataType===$j.types.DataSourceTypes.MEMORYJSON) {
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-dataset"):this._DOMObj.dataset.dataset;
        if (!$j.tools.isNull(data)) {
          this.dataset=data;
        }
      }
      if (this.dataType===$j.types.DataSourceTypes.FILE) {
        data=($j.browser.ie)?this._DOMObj.getAttribute("data-dataset"):this._DOMObj.dataset.dataset;
        if (!$j.tools.isNull(data)) {
          this.dataset=data;
        }
      }
    },
    loaded:function() {
      this._inherited();
      if (!$j.tools.isNull(this.dataset)) {
        if (!$j.tools.isNull(this.form[this.dataset])) {
          this.setDataset(this.form[this.dataset]);
        }
      }
    }
    //#endregion
  });
  Object.seal(DataSource);
  $j.classes.register($j.types.categories.NONVISUAL,DataSource);
  //#endregion
})();