(function(){
  //#region FindReplaceDlg
  var FindReplaceDlg=$j.classes.Window.extend({
    _ClassName:"FindReplaceDlg",
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{internalId_switchBtn}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_caseBtn}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_wordBtn}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_regExpBtn}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_destDdlb}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_findDdlb}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_replaceDdlb}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_nextDdlb}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_allDdlb}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_nextSBtn}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_nextSBtn_Btn}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_nextSBtn_PopBtn}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_popup}");
      html=a.join(String.uniqueId());
      return html;
    },
    loaded:function() {
      this._inherited();
      this.DestinationDDLB.dropDownCount=this.DestinationDDLB.items.length;
    },
    expendCollapse:function() {
      var form=this.form,expended;
      expended=($j.browser.ie)?form._DOMObj.getAttribute("data-replace"):form._DOMObj.dataset.replace;
      if (expended==="on") {
        this.setCaption("(");
        if ($j.browser.ie) form._DOMObj.removeAttribute("data-replace");
        else form._DOMObj.dataset.replace=null;
      } else {
        this.setCaption("%");
        if ($j.browser.ie) form._DOMObj.addAttribute("data-replace","on");
        else form._DOMObj.dataset.replace="on";
      }
      form.DestinationDDLB.updateFromDOM();
    }
  });
  //#endregion
  //#region FindReplaceDialog
  var FindReplaceDialog=$j.classes.CommonDialog.extend({
    _ClassName:"FindReplaceDialog",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._dlg=null;
        //#endregion
      }
    },
    //#region Properties
    //#endregion
    //#region Methods
    execute:function() {
      this._dlg=$j.classes.createComponent($j.classes.FindReplaceDlg,$j.apps.activeApplication,null,{"parentDOM":$j.doc.body});
      this._dlg.setCaption("Find & replace");
      this._dlg.show();
      this._inherited();
    }
    //#endregion
  });
  Object.seal(FindReplaceDialog);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,FindReplaceDlg);
  $j.classes.register($j.types.categories.DIALOGS,FindReplaceDialog);
  //#region Template
  var FindReplaceDlgTpl=["<div id='{internalId}' data-name='{name}' data-class='Window' class='{appName} Window csr_default FindReplaceDlg' data-theme='{theme}' data-borderstyle='toolWindow'>",
                         "<div id='{internalId_Layout}' data-class='Layout' class='WindowLayout' data-theme='{theme}'>",
                         $j.templates["WindowTitleBar"],
                         "<div id='{internalId_content}' data-name='showMessage_content' data-class='WindowContent' class='WindowContent' data-theme='{theme}'>",
                         "<div id='{internalId_switchBtn}' data-name='SwitchBtn' data-class='Button' class='Button frDlgSwitchBtn' data-theme='{theme}' data-onclick='expendCollapse'>",
                         "<span>(</span></div>",
                         "<div id='{internalId_caseBtn}' data-name='CaseBtn' data-class='SpeedButton' class='SpeedButton frDlgCaseBtn' data-theme='{theme}' data-stayspressed='true'>",
                         "<span style='left:0;top:0;right:0;bottom:0;line-height:21px;'>Aa</span></div>",
                         "<div id='{internalId_wordBtn}' data-name='WordBtn' data-class='SpeedButton' class='SpeedButton frDlgWordBtn' data-theme='{theme}' data-stayspressed='true'>",
                         "<span></span></div>",
                         "<div id='{internalId_regExpBtn}' data-name='RegExpBtn' data-class='SpeedButton' class='SpeedButton frDlgRegExpBtn' data-theme='{theme}' data-stayspressed='true'>",
                         "<span></span></div>",
                         "<div id='{internalId_findDdlb}' data-name='FindDDLB' data-class='DropDownListBox' class='DropDownListBox frDlgFindDdlb' data-theme='{theme}' data-editable='true'>",
                         "<div class='DropDownListBoxContent' data-theme='{theme}'>",
                         "<input type='text' class='csr_text' data-theme='{theme}' />",
                         "</div></div>",
                         "<div id='{internalId_nextSBtn}' data-name='nextSBtn' data-class='SplitButton' class='SplitButton frDlgNextSplitBtn' data-theme='{theme}' data-popupmenu='PopupMenu'>",
                         "<div id='{internalId_nextSBtn_Btn}' data-name='nextSBtn_Btn' data-class='Button' class='Button frDlgSB_Btn' data-theme='{theme}'>",
                         "<span>F</span></div>",
                         "<div id='{internalId_nextSBtn_PopBtn}' data-name='nextSBtn_PopBtn' data-class='PopupButton' class='PopupButton frDlgSB_PopBtn' data-theme='{theme}'>",
                         "<span></span></div></div>",
                         "<div id='{internalId_replaceDdlb}' data-name='ReplaceDDLB' data-class='DropDownListBox' class='DropDownListBox frDlgReplaceDdlb' data-theme='{theme}' data-editable='true'>",
                         "<div class='DropDownListBoxContent' data-theme='{theme}'>",
                         "<input type='text' class='csr_text' data-theme='{theme}' />",
                         "</div></div>",
                         "<div id='{internalId_destDdlb}' data-name='DestinationDDLB' data-class='DropDownListBox' class='DropDownListBox frDlgDestinationDdlb' data-theme='{theme}' data-editable='false' data-itemindex='0'>",
                         "<div class='DropDownListBoxContent' data-theme='{theme}'>",
                         "<input type='text' class='csr_default' readonly data-theme='{theme}' />",
                         "</div>",
                         "<!--[{\"text\":\"Sélection\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":0},",
                         "{\"text\":\"Document actif\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":16},",
                         "{\"text\":\"Tous les documents ouverts\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":32},",
                         "{\"text\":\"Projet actif\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":48},",
                         "{\"text\":\"Solution complète\",\"size\":13,\"isChecked\":false,\"enabled\":true,\"isHeader\":false,\"top\":64}]-->",
                         "</div>",
                         "<div id='{internalId_nextBtn}' data-name='NextBtn' data-class='SpeedButton' class='SpeedButton frDlgNextBtn' data-theme='{theme}'>",
                         "<span></span></div>",
                         "<div id='{internalId_allBtn}' data-name='AllBtn' data-class='SpeedButton' class='SpeedButton frDlgAllBtn' data-theme='{theme}'>",
                         "<span></span></div>",
                         "<div id='{internalId_popup}' data-name='PopupMenu' data-class='PopupMenu' class='PopupMenu nonVisual' data-designer='false'>",
                         "<!--[{\"caption\":\"Suivant\",\"shortcut\":\"F3\",\"enabled\":true,\"visible\":true,\"items\":[]},",
                         "{\"caption\":\"Rechercher le précédent\",\"shortcut\":\"Maj+F3\",\"enabled\":true,\"visible\":true,\"items\":[]},",
                         "{\"caption\":\"Rechercher tout\",\"shortcut\":\"\",\"enabled\":true,\"visible\":true,\"items\":[]}]-->",
                         "<div class='nonVisualImg timer_design'>",
                         "<div class='nonVisualCaption'>PopupMenu1</div>",
                         "</div></div>",
                         "</div></div></div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:FindReplaceDlg,template:FindReplaceDlgTpl}]);
  //#endregion
})();