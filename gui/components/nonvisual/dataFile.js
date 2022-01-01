(function(){
  //#region DataTypes
  $j.types.dataTypes={
    AUTO:"auto",
    XML:"xml",
    JSON:"json"
  };
  //#endregion
  //#region DataFile
  var DataFile=$j.classes.DataSet.extend({
    _ClassName:"DataFile",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        this.url=String.empty;
        this.dataType=$j.types.dataTypes.AUTO;
      }
    },
    //#region Setters
    //#endregion
    //#region Methods
    updateFromDOM:function() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-url"):this._DOMObj.dataset.url;
      if (!$j.tools.isNull(data)) this.url=$j.tools.uri.convertToRealURI(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-type"):this._DOMObj.dataset.type;
      if (!$j.tools.isNull(data)) this.dataType=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-keyfields"):this._DOMObj.dataset.keyfields;
      if (!$j.tools.isNull(data)) this.keyFields=data;
    },
    loaded:function() {
      this._inherited();
      if (this.url!==String.empty) {
        $j.tools.xhr.load(true,this.url+"?rnd="+new Date().getTime(),this.loadData,false,this);
      }
    },
    loadData:function(data,sender) {
      var fileExt;
      switch (sender.dataType) {
        case $j.types.dataTypes.AUTO:
          fileExt=$j.tools.uri.extractFileExt(sender.url);
          if (fileExt==="json") {
            sender._datas=JSON.parse(data);
            sender.dataType=$j.types.dataTypes.JSON;
          }
          if(fileExt==="xml") {
            sender.dataType=$j.types.dataTypes.XML;
          }
          break;
        case $j.types.dataTypes.XML:
            sender.dataType=$j.types.dataTypes.XML;

          break;
        case $j.types.dataTypes.JSON:
          sender._datas=JSON.parse(data);
          break;
      }
      sender.getDatasInfos();
      if (sender.activeOnLoad) sender.setActive(true);
    },
    getDatasInfos:function() {
      switch (this.dataType) {
        case $j.types.dataTypes.JSON:
          this._nbrRecords=this._datas.length;
          if (this._nbrRecords>0) this._nbrFields=Object.getOwnPropertyNames(this._datas[0]).length;
          break;
        case $j.types.dataTypes.XML:
          break;
      }
    }
    //#endregion
  });
  Object.seal(DataFile);
  $j.classes.register($j.types.categories.NONVISUAL,DataFile);
  //#endregion
})();