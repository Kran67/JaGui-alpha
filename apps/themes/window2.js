(function(){
  var Window2=$j.classes.Window.extend({
    _ClassName: "Window2",
    init: function(owner) {
      this._inherited(owner);
    },
    formCreated: function(id) {
      var div,div1;
      this._inherited(id);
      this.DropDownListBox1.setText(this.app.themeName.capitalise());
      this.DropDownListBox2.setText(this.app.themeName.capitalise());
      div=$j.doc.getElementById("_wt0h9yj");
      div.style.top=this._titleBar._DOMObj.offsetHeight+$j.types.CSSUnits.PX;
      div=$j.doc.getElementById("_d5f4g2e");
      div1=$j.doc.getElementById("_9s9nxfh");
      div.style.width=(div1.firstElementChild.offsetWidth-(div.offsetLeft*2))+$j.types.CSSUnits.PX;
      div.style.height=(div1.firstElementChild.offsetHeight-(div.offsetTop*2))+$j.types.CSSUnits.PX;
      div=$j.doc.getElementById("_wt0h8yj");
      div.style.top=this._titleBar._DOMObj.offsetHeight+$j.types.CSSUnits.PX;
      div=$j.doc.getElementById("_d5f8g2e");
      div1=$j.doc.getElementById("_9s8nxfh");
      div.style.width=(div1.firstElementChild.offsetWidth-(div.offsetLeft*2))+$j.types.CSSUnits.PX;
      div.style.height=(div1.firstElementChild.offsetHeight-(div.offsetTop*2))+$j.types.CSSUnits.PX;
      div=$j.doc.getElementById("_5lnrkvf");
      div.style.top=this._titleBar._DOMObj.offsetHeight+$j.types.CSSUnits.PX;
    }
  });
  $j.apps.activeApplication._windowsClass[$j.tools.getFuncName(Window2)]=Window2;
}());