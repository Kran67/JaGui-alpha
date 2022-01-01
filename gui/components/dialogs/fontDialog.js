(function(){
  //#region FontDlg
  var FontDlg=$j.classes.Window.extend({
    _ClassName:"FontDlg",
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{internalId_lblPolice}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblStyle}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblSize}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnOk}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_ddlbPolice}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnCont}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnCancel}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_ddlbStyle}");
      html=a.join(String.uniqueId());
      a=html.split("{fontDlgDdlbSize}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_gbEffects}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_gbPreview}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblPreview}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_chkCrossed}");
      html=a.join(String.uniqueId());
      a=html.split("{fontDlg_chkUnderline}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblColor}");
      html=a.join(String.uniqueId());
      //a=html.split("{internalId_ddlbColor}");
      a=html.split("{internalId_btnColor}");
      html=a.join(String.uniqueId());
      return html;
    },
    loaded:function() {
      this._inherited();
      var lW=0,lastBtnLeft=0;
      lW+=parseInt(getComputedStyle(this._layout._DOMObj).marginLeft,10)+parseInt(getComputedStyle(this._layout._DOMObj).marginRight,10);
      this.setWidth(this.width+lW);
      this.btnOk.setLeft(lastBtnLeft);
      lW+=this.btnOk._DOMObj.offsetWidth;
      lastBtnLeft+=this.btnOk._DOMObj.offsetWidth+6;
      this.btnCancel.setLeft(lastBtnLeft);
      lW+=this.btnCancel._DOMObj.offsetWidth;
      lastBtnLeft+=this.btnCancel._DOMObj.offsetWidth+6;
      lW+=6;
      this.btnCont.setWidth(lW);
    },
    updatePreview:function() {
      var form=this.form;
      form.updateObject(form.lblPreview);
    },
    updateObject:function(obj) {
      obj._DOMObj.style[$j.types.jsCSSProperties.FONTFAMILY]=this.ddlbPolice.text;
      obj._DOMObj.style[$j.types.jsCSSProperties.FONTWEIGHT]=String.empty;
      obj._DOMObj.style[$j.types.jsCSSProperties.FONTSTYLE]=String.empty;
      switch (this.ddlbStyle.itemIndex) {
        case 1:
          obj._DOMObj.style[$j.types.jsCSSProperties.FONTWEIGHT]="bold";
          break;
        case 2:
          obj._DOMObj.style[$j.types.jsCSSProperties.FONTSTYLE]="oblique";
          break;
        case 3:
          obj._DOMObj.style[$j.types.jsCSSProperties.FONTWEIGHT]="bold";
          obj._DOMObj.style[$j.types.jsCSSProperties.FONTSTYLE]="oblique";
          break;
      }
      obj._DOMObj.style[$j.types.jsCSSProperties.FONTSIZE]=this.ddlbSize.text+$j.types.CSSUnits.PX;
      obj._DOMObj.style[$j.types.jsCSSProperties.TEXTDECORATION]=(this.chkUnderline.isChecked)?"underline":String.empty;
      obj._DOMObj.style[$j.types.jsCSSProperties.COLOR]=this.colorBtn.color.toRGBHexString();
    },
    updateFromObject:function(obj) {
      var value=parseInt(getComputedStyle(obj._DOMObj).fontSize,10),idx;
      // font-size
      if (!$j.tools.isNull(value)) {
        idx=this.ddlbSize.findItemFromText(_conv.intToStr(value));
        if (idx>-1) this.ddlbSize.setItemIndex(idx);
        else {
          this.ddlbSize.setItemIndex(-1);
          this.ddlbSize.setText(_conv.intToStr(value));
        }
      }
      // color
      value=getComputedStyle(obj._DOMObj).color;
      if (!$j.tools.isNull(value)) this.colorBtn.setColor(_colors.parse(value));
      // font-family
      value=getComputedStyle(obj._DOMObj).fontFamily;
      if (!$j.tools.isNull(value)) {
        value=value.split("'").join(String.empty);
        idx=this.ddlbPolice.findItemFromText(value);
        if (idx>-1) this.ddlbPolice.setItemIndex(idx);
        else {
          this.ddlbPolice.setItemIndex(-1);
          this.ddlbPolice.setText(value);
        }
      }
      // font style
      idx=0;
      // Bold
      value=getComputedStyle(obj._DOMObj).fontWeight;
      if (!$j.tools.isNull(value)) {
        if (value===$j.types.fontStyles.BOLD) idx++;
      }
      // Oblique
      value=getComputedStyle(obj._DOMObj).fontStyle;
      if (!$j.tools.isNull(value)) {
        if (value===$j.types.fontStyles.OBLIQUE) idx+=2;
      }
      this.ddlbStyle.setItemIndex(idx);
      this.ddlbStyle.setText(this.ddlbStyle.items[idx].text);
      // underline
      value=getComputedStyle(obj._DOMObj).textDecoration;
      if (!$j.tools.isNull(value)) {
        if (value==="underline") this.chkUnderline.setIsChecked(true);
      }

      this.updatePreview();
    }

  });
  //#endregion
  //#region FontDialog
  var FontDialog=$j.classes.CommonDialog.extend({
    _ClassName:"FontDialog",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._dlg=null;
        this._obj=null;
        //#endregion
      }
    },
    //#region Properties
    //#endregion
    //#region Methods
    execute:function(obj) {
      this._dlg=$j.classes.createComponent($j.classes.FontDlg,$j.apps.activeApplication,null,{"parentDOM":$j.doc.body});
      this._dlg.updateFromObject(obj);
      this._dlg.dialog=this;
      this._obj=obj;
      this._dlg.onClose.addListener(this.updateObj);
      this._dlg.setCaption("Police");
      this._dlg.center();
      this._dlg.showModal();
      this._inherited();
    },
    updateObj:function() {
      if (this._modalResult===$j.types.modalResults.OK) {
        this.updateObject(this.dialog._obj);
      }
    }
    //#endregion
  });
  Object.seal(FontDialog);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,FontDlg);
  $j.classes.register($j.types.categories.DIALOGS,FontDialog);
  //#region Template
  var FontDlgTpl=["<div id='{internalId}' data-name='{name}' data-class='Window' class='{appName} Window csr_default FontDlg' data-theme='{theme}' data-borderstyle='dialog'>",
                  "<div id='{internalId_Layout}' data-class='Layout' class='WindowLayout' data-theme='{theme}'>",
                  $j.templates["WindowTitleBar"],
                  "<div id='{internalId_content}' data-name='font_content' data-class='WindowContent' class='WindowContent' data-theme='{theme}'>",
                  // label Police
                  "<label id='{internalId_lblPolice}' data-name='lblPolice' data-class='Label' class='Label fontDlg_Police' data-theme='{theme}'>Police :</label>",
                  // dropDown Police
                  "<div id='{internalId_ddlbPolice}' data-name='ddlbPolice' data-class='DropDownListBox' class='DropDownListBox fontDlgDdlbPolice' data-theme='{theme}' data-editable='false' data-itemindex='0' data-dropdowncount='9' data-onchange='updatePreview'>",
                  "<div class='DropDownListBoxContent' data-theme='{theme}'>",
                  "<input type='text' class='csr_default' readonly data-theme='{theme}' />",
                  "</div><span></span>",
                  "<!--[{\"text\":\"Arial\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":0,\"css\":\"font-family:Arial\"},",
                  "{\"text\":\"Arial Black\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":16,\"css\":\"font-family:Arial Black\"},",
                  "{\"text\":\"Courier New\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":32,\"css\":\"font-family:Courier New\"},",
                  "{\"text\":\"Georgia\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":48,\"css\":\"font-family:Georgia\"},",
                  "{\"text\":\"Tahoma\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":64,\"css\":\"font-family:Tahoma\"},",
                  "{\"text\":\"Times\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":80,\"css\":\"font-family:Times\"},",
                  "{\"text\":\"Times New Roman\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":96,\"css\":\"font-family:Times New Roman\"},",
                  "{\"text\":\"Trebuchet MS\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":112,\"css\":\"font-family:Trebuchet MS\"},",
                  "{\"text\":\"Verdana\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":128,\"css\":\"font-family:Verdana\"}]-->",
                  "</div>",
                  // label Style
                  "<label id='{internalId_lblStyle}' data-name='lblStyle' data-class='Label' class='Label fontDlg_Style' data-theme='{theme}'>Style :</label>",
                  // dropDown Style
                  "<div id='{internalId_ddlbStyle}' data-name='ddlbStyle' data-class='DropDownListBox' class='DropDownListBox fontDlgDdlbStyle' data-theme='{theme}' data-editable='false' data-itemindex='0' data-dropdowncount='4' data-onchange='updatePreview'>",
                  "<div class='DropDownListBoxContent' data-theme='{theme}'>",
                  "<input type='text' class='csr_default' readonly data-theme='{theme}' />",
                  "</div><span></span>",
                  "<!--[{\"text\":\"Normal\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":0},",
                  "{\"text\":\"Gras\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":16,\"css\":\"font-weight:bold;\"},",
                  "{\"text\":\"Oblique\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":32,\"css\":\"font-style:oblique;\"},",
                  "{\"text\":\"Gras Oblique\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":48,\"css\":\"font-weight:bold;font-style:oblique;\"}]-->",
                  "</div>",
                  // label Taille
                  "<label id='{internalId_lblSize}' data-name='lblSize' data-class='Label' class='Label fontDlg_Size' data-theme='{theme}'>Taille :</label>",
                  // dropDown Taille
                  "<div id='{internalId_ddlbSize}' data-name='ddlbSize' data-class='DropDownListBox' class='DropDownListBox fontDlgDdlbSize' data-theme='{theme}' data-editable='false' data-itemindex='0' data-onchange='updatePreview'>",
                  "<div class='DropDownListBoxContent' data-theme='{theme}'>",
                  "<input type='text' class='csr_default' readonly data-theme='{theme}' />",
                  "</div><span></span>",
                  "<!--[{\"text\":\"8\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":0},",
                  "{\"text\":\"9\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":16},",
                  "{\"text\":\"10\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":32},",
                  "{\"text\":\"11\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":48},",
                  "{\"text\":\"12\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":64},",
                  "{\"text\":\"14\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":80},",
                  "{\"text\":\"16\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":96},",
                  "{\"text\":\"18\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":112},",
                  "{\"text\":\"20\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":128},",
                  "{\"text\":\"22\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":144},",
                  "{\"text\":\"24\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":160},",
                  "{\"text\":\"26\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":176},",
                  "{\"text\":\"28\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":192},",
                  "{\"text\":\"36\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":208},",
                  "{\"text\":\"48\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":224},",
                  "{\"text\":\"72\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":240}]-->",
                  "</div>",
                  // GroupBox Effets
                  "<fieldset id='{internalId_gbEffects}' data-name='gbEffects' data-class='GroupBox' class='GroupBox fontDlg_gbEffects' data-theme='{theme}'>",
                  "<legend>Effets</legend>",
                  // Checkbox barré
                  //"<div id='{internalId_chkCrossed}' data-name='chkCrossed' data-class='CheckBox' class='CheckBox fontDlg_chkCrossed' data-theme='{theme}' data-ischecked='false' data-onchange='updatePreview'>Barré</div>",
                  // Checkbox souligné
                  "<div id='{internalId_chkUnderline}' data-name='chkUnderline' data-class='CheckBox' class='CheckBox fontDlg_chkUnderline' data-theme='{theme}' data-ischecked='false' data-onchange='updatePreview'>Souligné</div>",
                  // Label Couleur
                  "<label id='{internalId_lblColor}' data-name='lblColor' data-class='Label' class='Label fontDlg_lblColor' data-theme='{theme}'>Couleur :</label>",
                  // dropdowncolor couleur
                  //"<div id='{internalId_ddlbColor}' data-name='ddlbColor' data-class='DropDownListBoxColor' class='DropDownListBoxColor fontDlg_ddlbColor' data-theme='{theme}' data-editable='false' data-itemindex='7' data-onchange='updatePreview'>",
                  //"<div class='DropDownListBoxColor_color'></div>",
                  //"<div class='DropDownListBoxColorContent' data-theme='{theme}'>",
                  //"<input type='text' readonly class='csr_default' data-theme='{theme}' />",
                  //"</div></div>",
                  "<div id='{internalId_btnColor}' data-name='colorBtn' data-class='ColorButton' class='ColorButton fontDlg_colorBtn' data-theme='{theme}' data-color='black' data-onchange='updatePreview'>",
                  "<span></span>",
                  "<div class='ColorButtonColor' data-theme='{theme}'></div>",
                  "</div>",
                  "</fieldset>",
                  // GroupBox Aperçu
                  "<fieldset id='{internalId_gbPreview}' data-name='gbPreview' data-class='GroupBox' class='GroupBox fontDlg_gbPreview' data-theme='{theme}'>",
                  "<legend>Aperçu</legend>",
                  "<label id='{internalId_lblPreview}' data-name='lblPreview' data-class='Label' class='Label fontDlg_lblPreview' data-theme='{theme}'>AaBbYyZz</label>",
                  "</fieldset>",
                  // Boutons layout
                  "<div id='{internalId_btnCont}' data-class='Layout' data-name='btnCont' class='Layout horizontalCenter fontDlg_btnCont' data-theme='{theme}'>",
                  // Bouton Ok
                  "<div id='{internalId_btnOk}' data-name='btnOk' data-class='Button' class='Button frDlgbtnOk' data-theme='{theme}' data-modalresult='ok'>",
                  "<span>Ok</span></div>",
                  // Bouton Annuler
                  "<div id='{internalId_btnCancel}' data-name='btnCancel' data-class='Button' class='Button frDlgbtnCancel' data-theme='{theme}' data-modalresult='cancel'>",
                  "<span>Annuler</span></div>",
                  "</div>",
                  "</div></div></div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:FontDlg,template:FontDlgTpl}]);
  //#endregion
})();