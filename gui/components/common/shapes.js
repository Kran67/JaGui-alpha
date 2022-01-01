(function(){
  //#region Direction of Line
  $j.types.LineDirections={
    TOPLEFT_BOTTOMRIGHT:"tl2br",
    TOPRIGHT_BOTTOMLEFT:"tr2bl"
  };
  //#endregion
  //#region Line
  var Line=$j.classes.GraphicControl.extend({
    _ClassName:"Line",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        //#region Private
        this._svg=null;
        this._line=null;
        //#endregion
        this.startPoint=new $j.classes.Point;
        this.endPoint=new $j.classes.Point;
        this._inherited(owner,props);
      }
    },
    //#region Setter
    setStartPoint:function(newValue) {
      if (!(newValue instanceof $j.classes.Point)) return;
      if (!this.startPoint.equals(newValue)) {
        this.startPoint.assign(newValue);
        this.update();
      }
    },
    setEndPoint:function(newValue) {
      if (!(newValue instanceof $j.classes.Point)) return;
      if (!this.endPoint.equals(newValue)) {
        this.endPoint.assign(newValue);
        this.update();
      }
    },
    setWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.width!==newValue) {
        this._inherited(newValue);
        this.endPoint.x=this.startPoint.x+newValue;
        this.update();
      }
    },
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.height!==newValue) {
        this._inherited(newValue);
        this.endPoint.y=this.startPoint.y+newValue;
        this.update();
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      this._svg=this._DOMObj.firstElementChild;
      this._line=this._svg.firstElementChild;
      this.startPoint.x=this._line.getAttribute("x1");
      this.startPoint.y=this._line.getAttribute("y1");
      this.endPoint.x=this._line.getAttribute("x2");
      this.endPoint.y=this._line.getAttribute("y2");
    },
    update:function() {
      var w,h,l,t,d;
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._line)) return;
      this._inherited();

      if (this.startPoint.x<this.endPoint.x) {
        w=this.endPoint.x-this.startPoint.x;
        l=this.startPoint.x;
      }
      else {
        w=this.startPoint.x-this.endPoint.x;
        l=this.endPoint.x;
      }
      if (this.startPoint.y<this.endPoint.y) {
        h=this.endPoint.y-this.startPoint.y;
        t=this.startPoint.y;
      } else {
        h=this.startPoint.y-this.endPoint.y;
        t=this.endPoint.y;
      }
      if (this.startPoint.x<this.endPoint.x&&this.startPoint.y<this.endPoint.y) d=$j.types.LineDirections.TOPLEFT_BOTTOMRIGHT;
      else if (this.startPoint.x<this.endPoint.x&&this.startPoint.y>this.endPoint.y) d=$j.types.LineDirections.TOPRIGHT_BOTTOMLEFT;
      else if (this.startPoint.x>this.endPoint.x&&this.startPoint.y<this.endPoint.y) d=$j.types.LineDirections.TOPRIGHT_BOTTOMLEFT;
      else d=$j.types.LineDirections.TOPLEFT_BOTTOMRIGHT;
      // svg part
      this._svg.setAttribute($j.types.jsCSSProperties.WIDTH,w);
      this._svg.setAttribute($j.types.jsCSSProperties.HEIGHT,h);
      // line part
      switch (d) {
        case $j.types.LineDirections.TOPLEFT_BOTTOMRIGHT:
          this._line.setAttribute("x1",0);
          this._line.setAttribute("y1",0);
          this._line.setAttribute("x2",w);
          this._line.setAttribute("y2",h);
          break;
        case $j.types.LineDirections.TOPRIGHT_BOTTOMLEFT:
          this._line.setAttribute("x1",0);
          this._line.setAttribute("y1",h);
          this._line.setAttribute("x2",w);
          this._line.setAttribute("y2",0);
          break;
      }
      this._line.setAttribute("stroke",this.strokeColor.toARGBString());
      this._line.setAttribute("stroke-width",this.strokeWidth);
    },
    updateFromDOM:function() {
      var pt;
      this._inherited();
      if (!$j.tools.isNull(this._line)) {
        this.startPoint.x=this._line.getAttribute("x1");
        this.startPoint.y=this._line.getAttribute("y1");
        this.endPoint.x=this._line.getAttribute("x2");
        this.endPoint.y=this._line.getAttribute("y2");
      }
    }
    //#endregion
  });
  Object.seal(Line);
  Object.freeze(Line);
  //#endregion
  //#region Rectangle
  var Rectangle=$j.classes.Control.extend({
    _ClassName:"Rectangle"//,
    //init:function(owner,props) {
    //  if (!$j.tools.isNull(owner)){
    //    this._inherited(owner,props);
    //    //this._svg=null;
    //    //this._rect=null;
    //  }
    //},
    //#region Setters
    //setWidth:function(newValue) {
    //  if (typeof newValue!==_const.NUMBER) return;
    //  if (this.width!==newValue) {
    //    this._inherited(newValue);
    //    this.update();
    //  }
    //},
    //setHeight:function(newValue) {
    //  if (typeof newValue!==_const.NUMBER) return;
    //  if (this.height!==newValue) {
    //    this._inherited(newValue);
    //    this.update();
    //  }
    //},
    //#endregion
    //#region Methods
    //getChildsDOMObj:function() {
    //  this._svg=this._DOMObj.firstElementChild;
    //  this._rect=this._svg.firstElementChild;
    //},
    //update:function() {
    //  if (this._loading||this.form._loading) return;
    //  if ($j.tools.isNull(this._rect)) return;
    //  this._inherited();
    //  // rect part
    //  this._rect.setAttribute("x",0);
    //  this._rect.setAttribute("y",0);
    //  this._rect.setAttribute("width",this.width);
    //  this._rect.setAttribute("height",this.height);
    //  this._rect.setAttribute("stroke",this.strokeColor.toARGBString());
    //  this._rect.setAttribute("fill",this.fillColor.toARGBString());
    //  this._rect.setAttribute("stroke-width",this.strokeWidth);
    //}
    //#endregion
  });
  Object.seal(Rectangle);
  Object.freeze(Rectangle);
  //#endregion
  //#region RoundRect (Canvas:ok,SVG:ko)
  var RoundRect=Rectangle.extend({
    _ClassName:"RoundRect",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.topLeftRadius=0;
        this.topRightRadius=0;
        this.bottomLeftRadius=0;
        this.bottomRightRadius=0;
      }
    },
    //#region Setters
    //#endregion
    //#region Methods
    assign:function(source){
      if(!(source instanceof $j.classes.RoundRect)) return;
      this._inherited(source);
    },
    update:function() {
      if (this._loading||this.form._loading) return;
      //if ($j.tools.isNull(this._rect)) return;
      this._inherited();
      // rect part
      //this._rect.removeAttribute("x");
      //this._rect.removeAttribute("y");
      //this._rect.removeAttribute("width");
      //this._rect.removeAttribute("height");
      //this._rect.setAttribute("d",["M",this.topLeftRadius,",",0,String.SPACE,
      //                            "L",this.width-this.topRightRadius,",",0,String.SPACE,"Q",this.width,",",0,String.SPACE,this.width,",",this.topRightRadius,String.SPACE,
      //                            "L",this.width,",",this.height-this.bottomRightRadius,String.SPACE,"Q",this.width,",",this.height,String.SPACE,this.width-this.bottomRightRadius,",",this.height,String.SPACE,
      //                            "L",this.bottomLeftRadius,",",this.height,String.SPACE,"Q",0,",",this.height,String.SPACE,0,",",this.height-this.bottomLeftRadius,String.SPACE,
      //                            "L",0,",",this.topLeftRadius,String.SPACE,"Q",0,",",0,String.SPACE,this.topLeftRadius,",",0,String.SPACE,
      //                            "Z"].join(String.empty));
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-topleftradius"):this._DOMObj.dataset.topleftradius;
      if (!$j.tools.isNull(data)) this.topLeftRadius=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-toprightradius"):this._DOMObj.dataset.toprightradius;
      if (!$j.tools.isNull(data)) this.topRightRadius=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-bottomleftradius"):this._DOMObj.dataset.bottomleftradius;
      if (!$j.tools.isNull(data)) this.bottomLeftRadius=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-bottomrightradius"):this._DOMObj.dataset.bottomrightradius;
      if (!$j.tools.isNull(data)) this.bottomRightRadius=~~data;
    }
    //#endregion
  });
  Object.seal(RoundRect);
  Object.freeze(RoundRect);
  //#endregion
  //#region Ellipse
  var Ellipse=$j.classes.GraphicControl.extend({
    _ClassName:"Ellipse",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //this._svg=null;
        //this._ellipse=null;
      }
    }//,
    //#region Setters
    //setWidth:function(newValue) {
    //  if (typeof newValue!==_const.NUMBER) return;
    //  if (this.width!==newValue) {
    //    this._inherited(newValue);
    //    this.update();
    //  }
    //},
    //setHeight:function(newValue) {
    //  if (typeof newValue!==_const.NUMBER) return;
    //  if (this.height!==newValue) {
    //    this._inherited(newValue);
    //    this.update();
    //  }
    //},
    //#endregion
    //#region Methods
    //getChildsDOMObj:function() {
    //  this._svg=this._DOMObj.firstElementChild;
    //  this._ellipse=this._svg.firstElementChild;
    //},
    //update:function() {
    //  if (this._loading||this.form._loading) return;
    //  if ($j.tools.isNull(this._ellipse)) return;
    //  this._inherited();
    //  // ellipse part
    //  this._ellipse.setAttribute("cx",~~(this.width/2));
    //  this._ellipse.setAttribute("cy",~~(this.height/2));
    //  this._ellipse.setAttribute("rx",~~(this.width/2));
    //  this._ellipse.setAttribute("ry",~~(this.height/2));
    //  this._ellipse.setAttribute("stroke",this.strokeColor.toARGBString());
    //  this._ellipse.setAttribute("fill",this.fillColor.toARGBString());
    //  this._ellipse.setAttribute("stroke-width",this.strokeWidth);
    //}
    //#endregion
  });
  Object.seal(Ellipse);
  Object.freeze(Ellipse);
  //#endregion
  //#region Circle (Canvas:ok,SVG:ko)
  var Circle=Ellipse.extend({
    _ClassName:"Circle",
    //#region Setters
    setWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.width!==newValue) {
        this._inherited(newValue);
        if (this.width>this.height) this.height=this.width;
        //this.update();
      }
    },
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.height!==newValue) {
        this._inherited(newValue);
        if (this.height>this.width) this.width=this.height;
        //this.update();
      }
    }//,
    //#endregion
    //#region Methods
    //update:function() {
    //  if (this._loading||this.form._loading) return;
    //  if ($j.tools.isNull(this._ellipse)) return;
    //  this._inherited();
    //  // svg part
    //  this._svg.setAttribute($j.types.jsCSSProperties.WIDTH,this.width);
    //  this._svg.setAttribute($j.types.jsCSSProperties.HEIGHT,this.height);
    //  // ellipse part
    //  this._ellipse.setAttribute("cx",~~(this.width/2));
    //  this._ellipse.setAttribute("cy",~~(this.height/2));
    //  this._ellipse.removeAttribute("rx");
    //  this._ellipse.removeAttribute("ry");
    //  this._ellipse.setAttribute("r",~~(this.width/2));
    //  this._ellipse.setAttribute("stroke",this.strokeColor.toARGBString());
    //  this._ellipse.setAttribute("fill",this.fillColor.toARGBString());
    //  this._ellipse.setAttribute("stroke-width",this.strokeWidth);
    //}
    //#endregion
  });
  Object.seal(Circle);
  Object.freeze(Circle);
  //#endregion
  //#region Path (Canvas:ok,SVG:ko)
  var Path=$j.classes.GraphicControl.extend({
    _ClassName:"Path",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this._svg=null;
        this._path=null;
        this.strPath=String.empty;
      }
    },
    //#region Setters
    setWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.width!==newValue) {
        this._inherited(newValue);
        if (this.width>this.height) this.height=this.width;
        this.update();
      }
    },
    setHeight:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.height!==newValue) {
        this._inherited(newValue);
        if (this.height>this.width) this.width=this.height;
        this.update();
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj:function() {
      this._svg=this._DOMObj.firstElementChild;
      this._path=this._svg.firstElementChild;
    },
    update:function(){
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._path)) return;
      this._inherited();
      // path part
      this._path.setAttribute("d",this.strPath);
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-strpath"):this._DOMObj.dataset.strpath;
      if (!$j.tools.isNull(data)) this.strPath=data;
    }
    //#endregion
  });
  //#endregion
  //#region Pie (Canvas:ok,SVG:ko)
  // Inheritance of Pie
  var Pie=Path.extend({
    _ClassName:"Pie",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.startAngle=0;
        this.endAngle=0;

      }
    },
    //#region Methods
    assign:function(source){
      if(!(source instanceof $j.pie)) return;
      this._inherited(source);
      this.startAngle=source.startAngle;
      this.endAngle=source.endAngle;
    },
    update:function(){
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._path)) return;
      this._inherited();
      var path=new $j.classes.PathData(this);
      path.addPie(new $j.classes.Rect(0,0,this.width,this.height),this);
      this._path.setAttribute("d",path.getPathString());
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-startangle"):this._DOMObj.dataset.startangle;
      if (!$j.tools.isNull(data)) this.startAngle=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-endangle"):this._DOMObj.dataset.endangle;
      if (!$j.tools.isNull(data)) this.endAngle=~~data;
    }
    //#endregion
  });
  Object.seal(Pie);
  Object.freeze(Pie);
  //#endregion
  //#region Chord (Canvas:ok,SVG:ko)
  // Inheritance of Chord
  var Chord=Pie.extend({
    _ClassName:"Chord"
    //#region Methods
    //#endregion
  });
  Object.seal(Chord);
  Object.freeze(Chord);
  //#endregion
  //#region Arc (Canvas:ok,SVG:ko)
  // Inheritance of Arc
  var Arc=Path.extend({
    _ClassName:"Arc",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.startAngle=0;
        this.endAngle=90;
      }
    },
    //#region Setters
    //#endregion
    //#region Methods
    assign:function(source){
      if(!(source instanceof $j.pie)) return;
      this._inherited(source);
      this.startAngle=source.startAngle;
      this.endAngle=source.endAngle;
    },
    update:function(){
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._path)) return;
      this._inherited();
      var path=new $j.classes.PathData(this);
      path.addArc(new $j.classes.Point(~~(this.width/2),~~(this.height/2)),new $j.classes.Point(~~(this.width/2),~~(this.height/2)),this.startAngle,this.endAngle-this.startAngle);
      this._path.setAttribute("d",path.getPathString());
      this._path.setAttribute("fill","transparent");
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-startangle"):this._DOMObj.dataset.startangle;
      if (!$j.tools.isNull(data)) this.startAngle=~~data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-endangle"):this._DOMObj.dataset.endangle;
      if (!$j.tools.isNull(data)) this.endAngle=~~data;
    }
    //#endregion
  });
  Object.seal(Arc);
  Object.freeze(Arc);
  //#endregion
  //#region Star
  var Star=Path.extend({
    _ClassName:"Star",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.spikes=4;
      }
    },
    //#region Setters
    setSpikes:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (this.spikes!==newValue) {
        if (newValue<4) newValue=4;
        this.spikes=newValue;
        this.update();
      }
    },
    //#endregion
    //#region Methods
    updateFromDOM:function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-spikes"):this._DOMObj.dataset.spikes;
      if (!$j.tools.isNull(data)) this.spikes=data;
    },
    update:function() {
      var rot=Math.PI/2*3,cx=~~(this.width/2),cy=~~(this.height/2),step=Math.PI/this.spikes,outerRadius=~~(this.width/2),innerRadius=~~(this.width/4),i,x,y,pts=[];
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._path)) return;
      this._inherited();
      pts.push("M"+cx+","+$j.round(cy-outerRadius));
      for (i=0;i<this.spikes;i++) {
        x=$j.round(cx+$j.cos(rot)*outerRadius);
        y=$j.round(cy+$j.sin(rot)*outerRadius);
        pts.push(" L"+x+","+y);
        rot+=step;
        x=$j.round(cx+$j.cos(rot)*innerRadius);
        y=$j.round(cy+$j.sin(rot)*innerRadius);
        pts.push(" L"+x+","+y);
        rot+=step;
      }
      pts.push(" Z");
      this._path.setAttribute("d",pts.join(String.empty));
    }
    //#endregion
  });
  Object.seal(Star);
  Object.freeze(Star);
  //#endregion
  //#region Polygon
  $j.types.polygonSides={
    TRIANGLE:3,
    LOSANGE:4,
    PENTAGONE:5,
    HEXAGONE:6,
    HEPTAGONE:7,
    OCTOGONE:8,
    ENNEAGONE:9,
    DECAGONE:10,
    HENDECAGONE:11,
    DODECAGONE:12,
    TRIDECAGONE:13,
    TETRADECAGONE:14,
    PENTADECAGONE:15,
    HEXADECAGONE:16,
    HEPTADECAGONE:17,
    OCTADECAGONE:18,
    ENNEADECAGONE:19,
    ICOSAGONE:20,
    HENICOSAGONE:21,
    DOICOSAGONE:22,
    TRIAICOSAGONE:23,
    TETRAICOSAGONE:24,
    PENTAICOSAGONE:25,
    HEXAICOSAGONE:26,
    HEPTAICOSAGONE:27,
    OCTAICOSAGONE:28,
    ENNEAICOSAGONE:29,
    TRIACONTAGONE:30,
    HENTRIACONTAGONE:31,
    DOTRIACONTAGONE:32,
    TRITRIACONTAGONE:33,
    TETRATRIACONTAGONE:34,
    PENTATRIACONTAGONE:35,
    HEXATRIACONTAGONE:36,
    HEPTATRIACONTAGONE:37,
    OCTATRIACONTAGONE:38,
    ENNEATRIACONTAGONE:39,
    TETRACONTAGONE:40,
    PENTACONTAGONE:50,
    HEXACONTAGONE:60,
    HEPTACONTAGONE:70,
    OCTACONTAGONE:80,
    ENNEACONTAGONE:90,
    HECTOGONE:100,
    DIHECTOGONE:200,
    TRIHECTOGONE:300,
    TETRAHECTOGONE:400,
    PENTAHECTOGONE:500,
    HEXAHECTOGONE:600,
    HEPTAHECTOGONE:700,
    OCTAHECTOGONE:800,
    ENNEAHECTOGONE:900,
    CHILIOGONE:1000,
    MYRIAGONE:10000
  };
  Polygon=Path.extend({
    _ClassName:"Polygon",
    init:function Polygon(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.sides=$j.types.polygonSides.TRIANGLE;
      }
    },
    //#region Methods
    update:function() {
      var pts=[],cx,cy,s;
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._path)) return;
      this._inherited();
      cx=~~(this.width/2);
      cy=~~(this.height/2);
      s=~~(this.width/2);
      pts.push("M"+$j.round(cx+s*$j.cos(0))+","+$j.round(cy+s*$j.sin(0)));
      for (var i=1;i<=this.sides-1;i++) {
        pts.push(" L"+$j.round(cx+s*$j.cos(i*2*Math.PI/this.sides))+","+$j.round(cy+s*$j.sin(i*2*Math.PI/this.sides)));
      }
      pts.push(" Z");
      this._path.setAttribute("d",pts.join(String.empty));
    },
    updateFromDOM:function() {
      var data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-sides"):this._DOMObj.dataset.sides;
      if (!$j.tools.isNull(data)) this.sides=~~data;
    }
    //#endregion
  });
  Object.seal(Polygon);
  Object.freeze(Polygon);
  //#endregion
  $j.classes.register($j.types.categories.SHAPES,Line,Rectangle,RoundRect,/*CalloutRectangle,*/Ellipse,Circle,Pie,Chord,Arc,Path,Star/*,Trapezoid,Parallelogram*/,Polygon);
  //#region Templates
  var LineTpl=["<div id='{internalId}' data-name='{name}' data-class='Line' class='Line' style='{style}'>",
               "<svg>",
               "<line x1='{x}' y1='{y}' x2='{x1}' y2='{y1}' stroke='{strokecolor}' stroke-width='{strokewidth}'></line>",
               "</svg>",
               "</div>"].join(String.empty),
      RectangleTpl=["<div id='{internalId}' data-name='{name}' data-class='Rectangle' class='Rectangle' style='{style}'>",
                    //"<svg>",
                    //"<rect x='{x}' y='{y}' width='{width}' height='{height}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></rect>",
                    //"</svg>",
                    "</div>"].join(String.empty),
      RoundRectTpl=["<div id='{internalId}' data-name='{name}' data-class='RoundRect' class='RoundRect' style='{style}'>",
                    //"<svg>",
                    //"<path d='{path}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></path>",
                    //"</svg>",
                    "</div>"].join(String.empty),
      EllipseTpl=["<div id='{internalId}' data-name='{name}' data-class='Ellipse' class='Ellipse' style='{style}'>",
                  //"<svg>",
                  //"<ellipse cx='{cx}' cy='{cy}' rx='{rx}' ry='{ry}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></ellipse>",
                  //"</svg>",
                  "</div>"].join(String.empty),
      CircleTpl=["<div id='{internalId}' data-name='{name}' data-class='Circle' class='Circle' style='{style}'>",
                 //"<svg>",
                 //"<circle cx='{cx}' cy='{cy}' r='{r}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></circle>",
                 //"</svg>",
                 "</div>"].join(String.empty),
      PieTpl=["<div id='{internalId}' data-name='{name}' data-class='Pie' class='Pie' style='{style}'>",
              "<svg>",
              "<path d='{path}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></path>",
              "</svg>",
              "</div>"].join(String.empty),
      ChordTpl=["<div id='{internalId}' data-name='{name}' data-class='Chord' class='Chord' style='{style}'>",
                "<svg>",
                "<path d='{path}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></path>",
                "</svg>",
                "</div>"].join(String.empty),
      ArcTpl=["<div id='{internalId}' data-name='{name}' data-class='Arc' class='Arc' style='{style}' data-startangle='0' data-endangle='90'>",
              "<svg>",
              "<path d='{path}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></path>",
              "</svg>",
              "</div>"].join(String.empty),
      PathTpl=["<div id='{internalId}' data-name='{name}' data-class='Path' class='Path' style='{style}'>",
               "<svg>",
               "<path d='{path}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></path>",
               "</svg>",
               "</div>"].join(String.empty),
      StarTpl=["<div id='{internalId}' data-name='{name}' data-class='Star' class='Star' style='{style}' data-spikes='4'>",
               "<svg>",
               "<path d='{path}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></path>",
               "</svg>",
               "</div>"].join(String.empty),
      //Trapezoid=[""].join(String.empty),
      //Parallelogram=[""].join(String.empty),
      PolygonTpl=["<div id='{internalId}' data-name='{name}' data-class='Polygon' class='Polygon' style='{style}' data-sides='3'>",
               "<svg>",
               "<path d='{path}' fill='{fillcolor}' stroke='{strokecolor}' stroke-width='{strokewidth}'></path>",
               "</svg>",
               "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:Line,template:LineTpl},{Class:Rectangle,template:RectangleTpl},{Class:RoundRect,template:RoundRectTpl},{Class:Ellipse,template:EllipseTpl},
                                {Class:Circle,template:CircleTpl},{Class:Pie,template:PieTpl},{Class:Chord,template:ChordTpl},{Class:Arc,template:ArcTpl},{Class:Path,template:PathTpl},
                                {Class:Star,template:StarTpl},/*{Class:Trapezoid,template:TrapezoidTpl},{Class:Parallelogram,template:ParallelogramTpl},*/{Class:Polygon,template:PolygonTpl}]);
  //#endregion
})();
/*
http://www.tumuski.com/2005/01/3d-via-css/
https://hacks.mozilla.org/2011/08/rendering-3d-with-css-and-javascript-with-dom3d-guest-post/
https://code.google.com/p/poly2tri/
http://www.codeproject.com/Articles/44370/Triangulation-of-Arbitrary-Polygons
http://barradeau.com/js/utils/geometry/Triangulator.js
*/