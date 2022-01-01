(function(){
  //#region ColorDlg
  var ColorDlg=$j.classes.Window.extend({
    _ClassName:"ColorDlg",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    },
    //#region Setters
    setColor:function(newValue) {
      if (!(newValue instanceof $j.classes.Color)) return;
      if (!this.clrBoxCurColor.fillColor.equals(newValue)) {
        this.clrBoxCurColor.setColor(newValue);
        this.updateControls(newValue);
      }
    },
    //#endregion
    //#region Methods
    getTemplate:function() {
      var html=this._inherited(),a=html.split("{internalId_clrQuad}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_clrPicker}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblCurColor}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblNewColor}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_clrBoxCurColor}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_clrBoxNewColor}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnRGB}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnHSL}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnHSV}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_pnlRGB}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblRed}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrRed}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbRed}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblGreen}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrGreen}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbGreen}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblBlue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrBlue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbBlue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_pnlHSL}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrHue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbHSLHue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHSLHue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblSat}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrSat}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbHSLSat}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHSLSat}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblLight}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrLight}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbLight}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHSLLight}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_pnlHSV}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHSVHue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrHSVHue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbHSVHue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHSVHueDeg}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHSVSat}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrHVSSat}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbHSVSat}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblHSVSatPer}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblValue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrValue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbValue}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblValuePer}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblOpacity}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_slrOpacity}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbOpacity}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_lblOpacityPer}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnOk}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_btnCancel}");
      html=a.join(String.uniqueId());
      a=html.split("{internalId_txtbHex}");
      html=a.join(String.uniqueId());
      return html;
    },
    loaded:function() {
      this._inherited();
      this.setWidth(this.width+parseInt(getComputedStyle(this._layout._DOMObj).marginLeft,10)+parseInt(getComputedStyle(this._layout._DOMObj).marginRight,10));
      this.setHeight(this.height+parseInt(getComputedStyle(this._layout._DOMObj).marginTop,10)+parseInt(getComputedStyle(this._layout._DOMObj).marginBottom,10));
      this.btnRGB.setPressing(true);
      this.clrQuad.setColorBox(this.clrBoxNewColor);
    },
    // events
    clrQuad_onChange:function() {
      var form=this.form;
      form.updateControls(this.color);
    },
    slrRed_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbRed)) {
        c.setRed(v);
        form.updateControls(c);
      }
    },
    txtbRed_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      if (v<form.slrRed.min) v=form.slrRed.min;
      if (v>form.slrRed.max) v=form.slrRed.max;
      c.setRed(v);
      form.updateControls(c);
    },
    slrGreen_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbGreen)) {
        c.setGreen(v);
        form.updateControls(c);
      }
    },
    txtbGreen_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      if (v<form.slrGreen.min) v=form.slrGreen.min;
      if (v>form.slrGreen.max) v=form.slrGreen.max;
      c.setGreen(v);
      form.updateControls(c);
    },
    slrBlue_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbBlue)) {
        c.setBlue(v);
        form.updateControls(c);
      }
    },
    txtbBlue_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      if (v<form.slrBlue.min) v=form.slrBlue.min;
      if (v>form.slrBlue.max) v=form.slrBlue.max;
      c.setBlue(v);
      form.updateControls(c);
    },
    slrHue_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbHSLHue)) {
        c.setHue(v);
        form.updateControls(c);
      }
    },
    txtbHue_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      if (v<form.slrHue.min) v=form.slrHue.min;
      if (v>form.slrHue.max) v=form.slrHue.max;
      c.setHue(v);
      form.updateControls(c);
    },
    slrSat_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbHSLSat)) {
        c.setSaturation(v);
        form.updateControls(c);
      }
    },
    txtbSat_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      if (v<form.slrSat.min) v=form.slrSat.min;
      if (v>form.slrSat.max) v=form.slrSat.max;
      c.setSaturation(v);
      form.updateControls(c);
    },
    slrLight_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbLight)) {
        c.setLightness(v);
        form.updateControls(c);
      }
    },
    txtbLight_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      if (v<form.slrLight.min) v=form.slrLight.min;
      if (v>form.slrLight.max) v=form.slrLight.max;
      c.setLightness(v);
      form.updateControls(c);
    },
    slrHVSSat_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      c.setSaturation(v);
      form.updateControls(c);
    },
    slrValue_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbValue)) {
        c.setValue(v);
        form.updateControls(c);
      }
    },
    txtbValue_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=~~this.text;
      if (v<form.slrValue.min) v=form.slrValue.min;
      if (v>form.slrValue.max) v=form.slrValue.max;
      c.setValue(v);
      form.updateControls(c);
    },
    slrOpacity_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=this.values.first();
      if (!$j.tools.isNull(form.txtbOpacity)) {
        c.setAlpha(v);
        form.updateControls(c);
      }
    },
    txtbOpacity_onChange:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor),v=(~~this.text)/100;
      if (v<form.slrOpacity.min) v=form.slrOpacity.min;
      if (v>form.slrOpacity.max) v=form.slrOpacity.max;
      c.setAlpha(v);
      form.updateControls(c);
    },
    txtbHex_onChange:function() {
      var form=this.form,c=_colors.parse(this.text);
      c.setAlpha(1);
      form.updateControls(c);
    },
    btn_onClick:function() {
      var form=this.form,c=new $j.classes.Color(form.clrBoxNewColor.fillColor);
      if (this!==form.btnRGB) {
        form.btnRGB.setPressing(false);
        form.pnlRGB.setVisible(false);
      } 
      if (this!==form.btnHSL) {
        form.btnHSL.setPressing(false);
        form.pnlHSL.setVisible(false);
      }
      if (this!==form.btnHSV) {
        form.btnHSV.setPressing(false);
        form.pnlHSV.setVisible(false);
      }
      if (this===form.btnRGB) form.pnlRGB.setVisible(true);
      if (this===form.btnHSL) form.pnlHSL.setVisible(true);
      if (this===form.btnHSV) {
        form.pnlHSV.setVisible(true);
        form.clrQuad.setFormat($j.types.colorFormats.HSV);
        c.RGBtoHSV();
      } else {
        form.clrQuad.setFormat($j.types.colorFormats.HSL);
        if (this===form.btnHSL) {
          c.RGBtoHSL();
        }
      }
      form.updateControls(c);
    },
    updateControls:function(color) {
      if (this._loading||this._creating) return;
      color.setAlpha(this.slrOpacity.values.first());
      this.clrBoxNewColor.setColor(color);
      this.clrBoxNewColor.update();
      color.setAlpha(1);
      this.clrPicker.updating();
      this.clrPicker.setColor(color);
      this.clrPicker.updated();
      this.clrQuad.updating();
      this.clrQuad.setColor(color);
      this.clrQuad.updated();
      // RGB Tab
      this.slrRed.updating();
      this.slrRed.setValues([color.red,0]);
      this.slrRed.updated();
      this.txtbRed.updating();
      this.txtbRed.setText(_conv.intToStr(color.red));
      this.txtbRed.updated();
      this.slrGreen.updating();
      this.slrGreen.setValues([color.green,0]);
      this.slrGreen.updated();
      this.txtbGreen.updating();
      this.txtbGreen.setText(_conv.intToStr(color.green));
      this.txtbGreen.updated();
      this.slrBlue.updating();
      this.slrBlue.setValues([color.blue,0]);
      this.slrBlue.updated();
      this.txtbBlue.updating();
      this.txtbBlue.setText(_conv.intToStr(color.blue));
      this.txtbBlue.updated();
      // HSL Tab
      this.slrHue.updating();
      this.slrHue.setValues([color.hue,0]);
      this.slrHue.updated();
      this.txtbHSLHue.updating();
      this.txtbHSLHue.setText(_conv.intToStr(color.hue));
      this.txtbHSLHue.updated();
      this.slrSat.updating();
      this.slrSat.setValues([color.saturation,0]);
      this.slrSat.updated();
      this.txtbHSLSat.updating();
      this.txtbHSLSat.setText(_conv.intToStr(color.saturation));
      this.txtbHSLSat.updated();
      this.slrLight.updating();
      this.slrLight.setValues([color.lightness,0]);
      this.slrLight.updated();
      this.txtbLight.updating();
      this.txtbLight.setText(_conv.intToStr(color.lightness));
      this.txtbLight.updated();
      // HSV Tab
      this.slrHSVHue.updating();
      this.slrHSVHue.setValues([color.hue,0]);
      this.slrHSVHue.updated();
      this.txtbHSVHue.updating();
      this.txtbHSVHue.setText(_conv.intToStr(color.hue));
      this.txtbHSVHue.updated();
      this.slrHVSSat.updating();
      this.slrHVSSat.setValues([color.saturation,0]);
      this.slrHVSSat.updated();
      this.txtbHSVSat.updating();
      this.txtbHSVSat.setText(_conv.intToStr(color.saturation));
      this.txtbHSVSat.updated();
      this.slrValue.updating();
      this.slrValue.setValues([color.value,0]);
      this.slrValue.updated();
      this.txtbValue.updating();
      this.txtbValue.setText(_conv.intToStr(color.value));
      this.txtbValue.updated();
      // Opacity
      this.txtbOpacity.updating();
      this.txtbOpacity.setText(_conv.intToStr(~~(color.alpha*100)));
      this.txtbOpacity.updated();
      // Hex textBox
      this.txtbHex.updating();
      this.txtbHex.setText(color.toRGBHexString().toUpperCase());
      this.txtbHex.updated();
    }
    //#endregion
  });
  //#endregion
  //#region ColorDialog
  var ColorDialog=$j.classes.CommonDialog.extend({
    _ClassName:"ColorDialog",
    init:function(owner,props) {
      if (owner!==null){
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
      this._obj=obj;
      this._dlg=$j.classes.createComponent($j.classes.ColorDlg,$j.apps.activeApplication,null,{"parentDOM":$j.doc.body});
      if ($j.tools.isNull(obj)) {
        this._dlg.setColor(_colors.RED);
      }
      this._dlg.dialog=this;
      this._dlg.onClose.addListener(this.updateObj);
      this._dlg.setCaption("Couleurs");
      this._dlg.center();
      this._dlg.showModal();
      this._inherited();
    },
    updateObj:function() {}
    //#endregion
  });
  Object.seal(ColorDialog);
  //#endregion
  $j.classes.register($j.types.categories.INTERNAL,ColorDlg);
  $j.classes.register($j.types.categories.DIALOGS,ColorDialog);
  //#region Template
  var ColorDlgTpl=["<div id='{internalId}' data-name='{name}' data-class='Window' class='{appName} Window csr_default ColorDlg' data-theme='{theme}' data-borderstyle='dialog'>",
                  "<div id='{internalId_Layout}' data-class='Layout' class='WindowLayout' data-theme='{theme}'>",
                  $j.templates["WindowTitleBar"],
                  "<div id='{internalId_content}' data-name='color_content' data-class='WindowContent' class='WindowContent' data-theme='{theme}'>",
                  // ColorQuad
                  "<div id='{internalId_clrQuad}' data-name='clrQuad' data-class='ColorQuad' class='ColorQuad colorDlg_clrQuad' data-color='blue' data-format='hsl' data-onchange='clrQuad_onChange'>",
                  "<div class='ColorPickerIndicator'></div>",
                  "</div>",
                  // ColorPicker
                  "<div id='{internalId_clrPicker}' data-name='clrPicker' data-class='ColorPicker' class='ColorPicker colorDlg_clrPicker' data-colorquad='clrQuad' data-color='blue'>",
                  "<div class='ColorPickerIndicator'></div>",
                  "</div>",
                  // Label CurrentColor
                  "<label id='{internalId_lblCurColor}' data-name='lblCurColor' data-class='Label' class='Label csr_default colorDlg_lblCurColor' data-theme='{theme}'>Couleur actuelle :</label>",
                  // Label NewColor
                  "<label id='{internalId_lblNewColor}' data-name='lblNewColor' data-class='Label' class='Label csr_default colorDlg_lblNewColor' data-theme='{theme}'>Nouvelle couleur :</label>",
                  // ColorBox CurrentColor
                  "<div id='{internalId_clrBoxCurColor}' data-name='clrBoxCurColor' data-class='ColorBox' class='ColorBox colorDlg_clrBoxCurColor' data-color='blue'></div>",
                  // ColorBox NewColor
                  "<div id='{internalId_clrBoxNewColor}' data-name='clrBoxNewColor' data-class='ColorBox' class='ColorBox colorDlg_clrBoxNewColor' data-color='blue'></div>",
                  // BtnRGB
                  "<div id='colorDlg_btnContainer' data-name='colorDlg_btnContainer' data-class='Layout'>",
                  "<div id='{internalId_btnRGB}' data-name='btnRGB' data-class='Button' class='Button colorDlg_btnRGB pressed' data-theme='{theme}' data-onclick='btn_onClick' data-stayspressed='true'>",
                  "<span class='DownText2'>RGB</span>",
                  "</div>",
                  // BtnHSL
                  "<div id='{internalId_btnHSL}' data-name='btnHSL' data-class='Button' class='Button colorDlg_btnHSL' data-theme='{theme}' data-onclick='btn_onClick' data-stayspressed='true'>",
                  "<span>HSL</span>",
                  "</div>",
                  // BtnHSV
                  "<div id='{internalId_btnHSV}' data-name='btnHSV' data-class='Button' class='Button colorDlg_btnHSV' data-theme='{theme}' data-onclick='btn_onClick' data-stayspressed='true'>",
                  "<span>HSV</span>",
                  "</div>",
                  "</div>",
                  // PanelRGB
                  "<div id='{internalId_pnlRGB}' data-name='pnlRGB' data-class='Panel' class='Panel colorDlg_pnlRGB' data-theme='{theme}' data-visible='true'>",
                  // RedLabel
                  "<label id='{internalId_lblRed}' data-name='lblRed' data-class='Label' class='Label csr_default colorDlg_lblRed' data-theme='{theme}'>Rouge :</label>",
                  // RedSlider
                  "<div id='{internalId_slrRed}' data-name='slrRed' data-class='Slider' class='Slider colorDlg_slrRed' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='255' data-onchange='slrRed_onChange' data-decimalprecision='0'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // RedTextBox
                  "<div id='{internalId_txtbRed}' data-name='txtbRed' data-class='TextBox' class='TextBox colorDlg_txtbRed' data-theme='{theme}' data-onchange='txtbRed_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // GreenLabel
                  "<label id='{internalId_lblGreen}' data-name='lblGreen' data-class='Label' class='Label csr_default colorDlg_lblGreen' data-theme='{theme}'>Vert :</label>",
                  // GreenSlider
                  "<div id='{internalId_slrGreen}' data-name='slrGreen' data-class='Slider' class='Slider colorDlg_slrGreen' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='255' data-onchange='slrGreen_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // GreenTextBox
                  "<div id='{internalId_txtbGreen}' data-name='txtbGreen' data-class='TextBox' class='TextBox colorDlg_txtbGreen' data-theme='{theme}' data-onchange='txtbGreen_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // BlueLabel
                  "<label id='{internalId_lblBlue}' data-name='lblBlue' data-class='Label' class='Label csr_default colorDlg_lblBlue' data-theme='{theme}'>Bleu :</label>",
                  // BlueSlider
                  "<div id='{internalId_slrBlue}' data-name='slrBlue' data-class='Slider' class='Slider colorDlg_slrBlue' data-theme='{theme}' data-values='[255,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='255' data-onchange='slrBlue_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // BlueTextBox
                  "<div id='{internalId_txtbBlue}' data-name='txtbBlue' data-class='TextBox' class='TextBox colorDlg_txtbBlue' data-theme='{theme}' data-onchange='txtbBlue_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='255' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  "</div>",
                  // PanelHSL
                  "<div id='{internalId_pnlHSL}' data-name='pnlHSL' data-class='Panel' class='Panel colorDlg_pnlHSL hidden' data-theme='{theme}' data-visible='false'>",
                  // HSL_HueLabel
                  "<label id='{internalId_lblHue}' data-name='lblHue' data-class='Label' class='Label csr_default colorDlg_lblHue' data-theme='{theme}'>Hue :</label>",
                  // HueSlider
                  "<div id='{internalId_slrHue}' data-name='slrHue' data-class='Slider' class='Slider colorDlg_slrHue' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='359' data-onchange='slrHue_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // HSL_HueTextBox
                  "<div id='{internalId_txtbHSLHue}' data-name='txtbHSLHue' data-class='TextBox' class='TextBox colorDlg_txtbHSLHue' data-theme='{theme}' data-onchange='txtbHue_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // HSL_HueLabel
                  "<label id='{internalId_lblHSLHue}' data-name='lblHSLHue' data-class='Label' class='Label csr_default colorDlg_lblHSLHue' data-theme='{theme}'>°</label>",
                  // HSL_SatLabel
                  "<label id='{internalId_lblSat}' data-name='lblSat' data-class='Label' class='Label csr_default colorDlg_lblSat' data-theme='{theme}'>Saturation :</label>",
                  // SatSlider
                  "<div id='{internalId_slrSat}' data-name='slrSat' data-class='Slider' class='Slider colorDlg_slrSat' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='100' data-onchange='slrSat_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // HSL_SatTextBox
                  "<div id='{internalId_txtbHSLSat}' data-name='txtbHSLSat' data-class='TextBox' class='TextBox colorDlg_txtbHSLSat' data-theme='{theme}' data-onchange='txtbSat_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // HSL_SatLabel
                  "<label id='{internalId_lblHSLSat}' data-name='lblHSLSat' data-class='Label' class='Label csr_default colorDlg_lblHSLSat' data-theme='{theme}'>%</label>",
                  // HSL_LightLabel
                  "<label id='{internalId_lblLight}' data-name='lblLight' data-class='Label' class='Label csr_default colorDlg_lblLight' data-theme='{theme}'>Luminosité :</label>",
                  // LightSlider
                  "<div id='{internalId_slrLight}' data-name='slrLight' data-class='Slider' class='Slider colorDlg_slrLight' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='100' data-onchange='slrLight_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // LightTextBox
                  "<div id='{internalId_txtbLight}' data-name='txtbLight' data-class='TextBox' class='TextBox colorDlg_txtbLight' data-theme='{theme}' data-onchange='txtbLight_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // LightLabel
                  "<label id='{internalId_lblHSLLight}' data-name='lblHSLLight' data-class='Label' class='Label csr_default colorDlg_lblHSLLight' data-theme='{theme}'>%</label>",
                  "</div>",
                  // PanelHSV
                  "<div id='{internalId_pnlHSV}' data-name='pnlHSV' data-class='Panel' class='Panel colorDlg_pnlHSV hidden' data-theme='{theme}' data-visible='false'>",
                  // HSV_HueLabel
                  "<label id='{internalId_lblHSVHue}' data-name='lblHSVHue' data-class='Label' class='Label csr_default colorDlg_lblHSVHue' data-theme='{theme}'>Hue :</label>",
                  // HSV_HueSlider
                  "<div id='{internalId_slrHSVHue}' data-name='slrHSVHue' data-class='Slider' class='Slider colorDlg_slrHSVHue' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='360' data-onchange='slrHue_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // HSV_HueTextBox
                  "<div id='{internalId_txtbHSVHue}' data-name='txtbHSVHue' data-class='TextBox' class='TextBox colorDlg_txtbHSVHue' data-theme='{theme}' data-onchange='txtbHue_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // HVS_HueLabel
                  "<label id='{internalId_lblHSVHueDeg}' data-name='lblHSVHueDeg' data-class='Label' class='Label csr_default colorDlg_lblHSVHueDeg' data-theme='{theme}'>°</label>",
                  // HSV_SatLabel
                  "<label id='{internalId_lblHSVSat}' data-name='lblHSVSat' data-class='Label' class='Label csr_default colorDlg_lblHSVSat' data-theme='{theme}'>Saturation :</label>",
                  // HVS_SatSlider
                  "<div id='{internalId_slrHVSSat}' data-name='slrHVSSat' data-class='Slider' class='Slider colorDlg_slrHVSSat' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='100' data-onchange='slrSat_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // HSV_SatTextBox
                  "<div id='{internalId_txtbHSVSat}' data-name='txtbHSVSat' data-class='TextBox' class='TextBox colorDlg_txtbHSVSat' data-theme='{theme}' data-onchange='txtbSat_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // HSV_SatLabel
                  "<label id='{internalId_lblHSVSatPer}' data-name='lblHSVSatPer' data-class='Label' class='Label csr_default colorDlg_lblHSVSatPer' data-theme='{theme}'>%</label>",
                  // HSV_ValueLabel
                  "<label id='{internalId_lblValue}' data-name='lblValue' data-class='Label' class='Label csr_default colorDlg_lblValue' data-theme='{theme}'>Valeur :</label>",
                  // ValueSlider
                  "<div id='{internalId_slrValue}' data-name='slrValue' data-class='Slider' class='Slider colorDlg_slrValue' data-theme='{theme}' data-values='[0,0]' data-orientation='horizontal' data-mode='normal' data-frequency='1' data-min='0' data-max='100' data-onchange='slrValue_onChange'>",
                  "<div class='Slider_range hidden' data-theme='{theme}'></div>",
                  "<div class='Slider_thumb' data-theme='{theme}' style='left: 0px; width: 18px;'></div>",
                  "<div class='Slider_thumb hidden' data-theme='{theme}'></div>",
                  "</div>",
                  // ValueTextBox
                  "<div id='{internalId_txtbValue}' data-name='txtbValue' data-class='TextBox' class='TextBox colorDlg_txtbValue' data-theme='{theme}' data-onchange='txtbValue_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='0' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // ValueLabel
                  "<label id='{internalId_lblValuePer}' data-name='lblValuePer' data-class='Label' class='Label csr_default colorDlg_lblValuePer' data-theme='{theme}'>%</label>",
                  "</div>",
                  // OpacityLabel
                  "<label id='{internalId_lblOpacity}' data-name='lblOpacity' data-class='Label' class='Label csr_default colorDlg_lblOpacity' data-theme='{theme}'>Opacité :</label>",
                  // OpacitySilder
                  "<div id='{internalId_slrOpacity}' data-name='slrOpacity' data-class='AlphaSlider' class='AlphaSlider colorDlg_slrOpacity' data-theme='{theme}' data-values='[100,0]' data-mode='normal' data-orientation='horizontal' data-onchange='slrOpacity_onChange' data-decimalprecision='2'>",
                  "<div class='AlphaSlider_thumb' data-theme='{theme}'></div>",
                  "</div>",
                  // OpacityTextbox
                  "<div id='{internalId_txtbOpacity}' data-name='txtbOpacity' data-class='TextBox' class='TextBox colorDlg_txtbOpacity' data-theme='{theme}' data-onchange='txtbOpacity_onChange' data-maxlength='3' data-filterchars='0123456789'>",
                  "<input type='text' value='100' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // OpacityLabel
                  "<label id='{internalId_lblOpacityPer}' data-name='lblOpacityPer' data-class='Label' class='Label csr_default colorDlg_lblOpacityPer' data-theme='{theme}'>%</label>",
                  // HexTextbox
                  "<div id='{internalId_txtbHex}' data-name='txtbHex' data-class='TextBox' class='TextBox colorDlg_txtbHex' data-theme='{theme}' data-onchange='txtbHex_onChange' data-maxlength='7'>",
                  "<input type='text' value='#0000FF' class='csr_text' data-theme='{theme}' />",
                  "</div>",
                  // Bouton Ok
                  "<div id='{internalId_btnOk}' data-name='btnOk' data-class='Button' class='Button colorDlgBtnOk' data-theme='{theme}' data-modalresult='ok'>",
                  "<span>Ok</span></div>",
                  // Bouton Annuler
                  "<div id='{internalId_btnCancel}' data-name='btnCancel' data-class='Button' class='Button colorDlgBtnCancel' data-theme='{theme}' data-modalresult='cancel'>",
                  "<span>Annuler</span></div>",
                  "</div>",
                  "</div></div></div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ColorDlg,template:ColorDlgTpl}]);
  //#endregion
})();