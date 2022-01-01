(function(){
  //#region DataJSON
  var DataJSON=$j.classes.DataSet.extend({
    _ClassName:"DataJSON",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        this.json={};
      }
    },
    //#region Setters
    //#endregion
    //#region Methods
    updateFromDOM:function() {
      // on va chercher les items dans le CDATA
      cdata=this._DOMObj.childNodes;
      for (var i=0,l=cdata.length;i<l;i++) {
        if (cdata[i].nodeType===$j.types.xmlNodeTypes.COMMENT_NODE) {
          if (!$j.tools.isNull(cdata[i].nodeValue!==String.empty&&cdata[i].nodeValue)) this.json=JSON.parse(cdata[i].nodeValue);
        }
      }
    }
    //#endregion
  });
  Object.seal(DataJSON);
  $j.classes.register($j.types.categories.NONVISUAL,DataJSON);
  //#endregion
})();