(function(){
  var OpenDialog=$j.classes.CommonDialog.extend({
    _ClassName: "OpenDialog",
    init: function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._inputFile=$j.doc.createElement($j.types.HTMLElements.INPUT);
        this._inputFile.type="file";
        this._inputFile.multiple=false;
        this._inputFile._owner=this;
        //#endregion
        this.fileFilter=String.empty;
        this.multiple=false;
        $j.tools.events.bind(this._inputFile,"change", this.handleFileSelection);
      }
    },
    //#region Properties
    //#endregion
    //#region Methods
    handleFileSelection:function(evt) {
      var files=evt.target.files,openDlg=evt.target._owner;
      if (!files) {
        //$j.dialogs.alert("At least one selected file is invalid - do not select any folders.\nPlease reselect and try again.");
        return;
      }
      openDlg.onClose.invoke(files);
    },
    loaded:function() {
      this._inherited();
      this._inputFile.setAttribute("accept",this.fileFilter);
      this._inputFile.setAttribute("multiple",this.multiple);
    },
    execute:function() {
      this._inherited();
      this._inputFile.click();
    },
    setFileFilter:function(newValue) {
      if (typeof newValue!==_const.STRING) return;
      if (this.fileFilter!==newValue) {
        this._inputFile.setAttribute("accept",newValue);
      }
    },
    setMultiple:function(newValue) {
      if (typeof newValue!==_const.BOOLEAN) return;
      if (this.multiple!==newValue) {
        this._inputFile.setAttribute("multiple",newValue);
      }
    }
    //#endregion
  });
  Object.seal(OpenDialog);
  $j.classes.register($j.types.categories.DIALOGS,OpenDialog);
})();