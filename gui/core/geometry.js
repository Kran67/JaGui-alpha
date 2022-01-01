(function() {
  $j.geometry={
    normalizeAngle: function Geometry_normalizeAngle(a) {
      if(typeof a!==_const.NUMBER) a=0;
      var result=a-(a*_const.INV360|0)*360;
      if(result< -180) result=result+360;
      return result;
    },
    createRotationMatrix: function Geometry_createRotationMatrix(a) {
      if(typeof a!==_const.NUMBER) a=0;
      var cosine=0,sine=0,x=$j.sinCos(a);
      cosine=x.cos;
      sine=x.sin;

      var result=_const.ZEROMATRIX.clone();
      result.m11=cosine;
      result.m12=sine;
      result.m13=0;
        
      result.m21= -sine;
      result.m22=cosine;
      result.m23=0;

      result.m31=0;
      result.m32=0;
      result.m33=1;
      cosine=sine=x=null;
      return result;
    },
    vectorLine: function Geometry_vectorLine(p,p1) {
      if(!(p instanceof $j.classes.Point)) return;
      if(!(p1 instanceof $j.classes.Point)) return;
      return p1.subtract(p);
    }
  };
  //#region Point
  $j.classes.Point=Class.extend({
    _ClassName: "Point",
    init: function(x,y) {
      if(isNaN(x)) x=0;
      if(isNaN(y)) y=0;
      this.x=+x;
      this.y=+y;
      //this.setX=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_x) _x=newValue;
      //};
      //this.setY=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_y) _y=newValue;
      //};
    },
    //#region Setters
    setValues:function Point_setValues(x,y) {
      x= +x;
      if(isNaN(x)) x=0;
      y= +y;
      if(isNaN(y)) y=0;
      this.x=x;
      this.y=y;
    },
    //#endregion
    //#region Methods
    empty: function() { return this.x+this.y===0; },
    length: function() { return $j.sqrt(this.x*this.x+this.y*this.y); },
    clone: function() {
      var p=new $j.classes.Point();
      p.assign(this);
      return p;
    },
    min: function Point_min(p) {
      if(!(p instanceof $j.classes.Point)) return this;
      if((p.y<this.y)||((p.y===this.y)&&(p.x<this.x))) return p;
      else return this;
    },
    scale: function Point_scale(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      this.x*=x;
      this.y*=y;
      return this;
    },
    inRect: function Point_inRect(r) {
      if(!(r instanceof $j.classes.Rect)) return false;
      return ((this.x>=r.left)&&(this.x<=r.right)&&(this.y>=r.top)&&(this.y<=r.bottom));
    },
    rotate: function Point_rotate(a,c) {
      if(!(c instanceof $j.classes.Point)) c=new $j.classes.Point(this.x,this.y);
      if(typeof a!==_const.NUMBER) a=0;
      a=_conv.deg2Rad(a);
      var /*s=$j.sin(a),c1=$j.cos(a),*/dx,dy;
      dx=this.x-c.x;
      dy=this.y-c.y;
      // calculate angle and distance
      var a1=$j.atan2(dy,dx);
      var dist=$j.sqrt(dx*dx+dy*dy);
      // calculate new angle
      var a2=a1+a;
      // calculate new coordinates
      this.x=$j.cos(a2)*dist+c.x;
      this.y=$j.sin(a2)*dist+c.y;
      return this;
    },
    multiply: function Point_multiply(v) {
      if(!v) return;
      if(v instanceof $j.classes.Point) {
        this.x*=v.x;
        this.y*=v.y;
      }
      else {
        if(typeof v!==_const.NUMBER) v=1;
        this.x*=v;
        this.y*=v;
      }
      return this;
    },
    divide: function Point_divide(v) {
      if(!v) return null;
      if(v instanceof $j.classes.Point) {
        this.x/=v.x;
        this.y/=v.y;
      } else {
        if(typeof v!==_const.NUMBER) v=1;
        this.x/=v;
        this.y/=v;
      }
      return this;
    },
    subtract: function Point_subtract(v) {
      if(!v) return null;
      if(v instanceof $j.classes.Point) {
        this.x-=v.x;
        this.y-=v.y;
      } else {
        if(typeof v!==_const.NUMBER) v=0;
        this.x-=v;
        this.y-=v;
      }
      return this;
    },
    add: function Point_add(v) {
      if(!v) return;
      if(v instanceof $j.classes.Point) {
        this.x+=v.x;
        this.y+=v.y;
      } else {
        if(typeof v!==_const.NUMBER) v=0;
        this.x+=v;
        this.y+=v;
      }
      return this;
    },
    distance: function Point_distance(p) {
      if(!(p instanceof $j.classes.Point)) return 0;
      var dx=p.x-this.x;
      var dy=p.y-this.y;
      return $j.sqrt(dx*dx+dy*dy);
    },
    directedAngle: function Point_directedAngle(p) {
      if(!(p instanceof $j.classes.Point)) return 0;
      return $j.atan2(this.cross(p),this.dot(p))*180/Math.PI;
    },
    cross: function Point_cross(p) {
      if(!(p instanceof $j.classes.Point)) return 0;
      return this.x*p.y-this.y*p.x;
    },
    dot: function Point_dot(p) {
      if(!(this instanceof $j.classes.Point)) return 0;
      if(!(p instanceof $j.classes.Point)) return 0;
      return this.x*p.x+this.y*p.y;
    },
    assign: function Point_assign(source) {
      if(!(source instanceof $j.classes.Point)) return;
      this.x=source.x;
      this.y=source.y;
    },
    inPolygon: function Point_inPolygon(pts) {
      var inside=false,c,j;
      if(!Array.isArray(pts)) return inside;
      if(pts.length<3) return inside;
      c=0;
      j=pts.length-1;
      j1=j;
      for(var i=0;i<=j;i++) {
        if((((pts[i].y<=this.y)&&(this.y<pts[j1].y))||
            ((pts[j1].y<=this.y)&&(this.y<pts[i].y)))&&
            (this.x<(pts[j1].x-pts[i].x)*(this.y-pts[i].y)/(pts[j1].y-pts[i].y)+pts[i].x)) {
          if(c===0) c=1;
          else c=0;
        }
        j1=i;
      }
      if(c!==0) inside=true;
      return inside;
    },
    inEllipse: function Point_inEllipse(r) {
      var x0=(r.left+r.right)*0.5;
      var y0=(r.top+r.bottom)*0.5;
      var a=(r.right-r.left)*0.5;
      var b=(r.bottom-r.top)*0.5;
      if($j.sqr((this.x-x0)/a)+$j.sqr((this.y-y0)/b)<=1.0) return true;
      else return false;
    },
    onLine: function Point_onLine() { },
    onPolyline: function Point_onPolyline() { },
    onBezier: function Point_onBezier() { },
    onArc: function Point_onArc() { },
    equals: function Point_equals(p) {
      return this.x===p.x&&this.y===p.y;
    }
    //#endregion
  });
  //#endregion
  //#region Rect
  $j.classes.Rect=Class.extend({
    _ClassName: "Rect",
    init: function(l,t,r,b) {
      if(isNaN(l)) l=0;
      if(isNaN(t)) t=0;
      if(isNaN(r)) r=0;
      if(isNaN(b)) b=0;
      this.left=+l;
      this.top=+t;
      this.right=+r;
      this.bottom=+b;
      //this.setLeft=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_l) _left=newValue;
      //};
      //this.setTop=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_t) _t=newValue;
      //};
      //this.setRight=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_r) _r=newValue;
      //};
      //this.setBottom=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_b) _b=newValue;
      //};
    },
    //#region Setters
    setTopLeft: function Rect_setTopLeft(newValue) {
      if(!(newValue instanceof $j.classes.Point)) return;
      this.left=newValue.x;
      this.top=newValue.y;
    },
    setTopRight: function Rect_setTopRight(newValue) {
      if(!(newValue instanceof $j.classes.Point)) return;
      this.top=newValue.y;
      this.right=newValue.x;
    },
    setBottomLeft: function Rect_setBottomLeft(newValue) {
      if(!(newValue instanceof $j.classes.Point)) return;
      this.bottom=newValue.y;
      this.left=newValue.x;
    },
    setBottomRight: function Rect_setBottomRight(newValue) {
      if(!(newValue instanceof $j.classes.Point)) return;
      this.bottom=newValue.y;
      this.right=newValue.x;
    },
    setValues: function Rect_setValues(l,t,r,b) {
      l=+l;
      t=+t;
      r=+r;
      b=+b;
      if(isNaN(l)) l=0;
      if(isNaN(t)) t=0;
      if(isNaN(r)) r=0;
      if(isNaN(b)) b=0;
      this.left=l;
      this.top=t;
      this.right=r;
      this.bottom=b;
    },
    //#endregion
    //#region Methods
    empty:function() { return ((this.width()<=0)||(this.height()<=0)); },
    width:function() {
      var w=this.right-this.left;
      return (w<0)?0:w;
    },
    height:function() {
      var h=this.bottom-this.top;
      return (h<0)?0:h;
    },
    topLeft:function() { return new $j.classes.Point(this.left,this.top); },
    topRight:function() { return new $j.classes.Point(this.width()-$j.abs(this.left),this.top); },
    bottomLeft:function() { return new $j.classes.Point(this.left,this.height()-$j.abs(this.top)); },
    bottomRight:function() { return new $j.classes.Point(this.width()-$j.abs(this.left),this.height()-$j.abs(this.top)); },
    clone:function() {
      var r=new $j.classes.Rect;
      r.assign(this);
      return r;
    },
    normalize: function Rect_normalize(a) {
      if(!Array.isArray(a)) return;
      //a.add(this);
      var result=new $j.classes.Rect(0xF000,0xF000,-0xF000,-0xF000);
      for(var i=0,l=a.length;i<l;i++) {
        if(!(a[i] instanceof $j.classes.Point)) continue;
        if(a[i].x<result.left) result.left=a[i].x;
        if(a[i].y<result.top) result.top=a[i].y;
        if(a[i].x>result.right) result.right=a[i].x;
        if(a[i].y>result.bottom) result.bottom=a[i].y;
      }
      return result;
    },
    normalize2: function Rect_normalize2(a) {
      if(!(a instanceof $j.classes.Rect)) return;
      this.normalize([new $j.classes.Point(a.left,a.top),new $j.classes.Point(a.right,a.top),new $j.classes.Point(a.right,a.bottom),new $j.classes.Point(a.left,a.bottom)]);
      return this;
    },
    reduce: function Rect_reduce(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      this.right-=x;
      this.bottom-=y;
      return this;
    },
    extend: function Rect_extend(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      this.right+=x;
      this.bottom+=y;
      return this;
    },
    center: function Rect_center(b) {
      if(!(b instanceof $j.classes.Rect)) return;
      this.offset(-this.left,-this.top);
      this.offset($j.round((b.width()-this.width())/2),$j.round((b.height()-this.height())/2));
      this.offset(b.left,b.top);
      return this;
    },
    fit: function Rect_fit(b) {
      if(!(b instanceof $j.classes.Rect)) return 0;
      var _ratio=1;
      if(b.empty()) return _ratio;
      if((this.width()/b.width())>(this.height()/b.height())) _ratio=this.width()/b.width();
      else _ratio=this.height()/b.height();
      if(_ratio<1) {
        this.right=this.width();
        this.bottom=this.height();
        this.left=0;
        this.top=0;
      } else {
        this.right=$j.round(this.width()/_ratio);
        this.bottom=$j.round(this.height()/_ratio);
        this.left=0;
        this.top=0;
      }
      this.center(b);
      return { rect: this,ratio: _ratio };
    },
    offset: function Rect_offset(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      this.left+=x;
      this.right+=x;
      this.top+=y;
      this.bottom+=y;
      return this;
    },
    multiply: function Rect_multiply(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      this.left*=x;
      this.right*=x;
      this.top*=y;
      this.bottom*=y;
      return this;
    },
    inflate: function Rect_inflate(x,y) {
      if(typeof x!==_const.NUMBER) x=0;
      if(typeof y!==_const.NUMBER) y=0;
      this.left-=x;
      this.right+=x;
      this.top-=y;
      this.bottom+=y;
      return this;
    },
    intersect: function Rect_intersect(r) {
      if(!(r instanceof $j.classes.Rect)) return false;
      return ((this.left<=r.right)&&(this.right>=r.left)&&(this.top<=r.bottom)&&(this.bottom>=r.top));
    },
    intersectRectDS: function Rect_intersectRectDS(r) {
      var result=(r.left<this.right)
          &&(r.right>this.left)
          &&(r.top<this.bottom)
          &&(r.bottom>this.top);

      if(result) {
        this.left=$j.max(this.left,r.left);
        this.top=$j.max(this.top,r.top);
        this.right=$j.min(this.right,r.right);
        this.bottom=$j.min(this.bottom,r.bottom);
      } else {
        this.left=0;
        this.top=0;
        this.right=0;
        this.bottom=0;
      }
    },
    union: function Rect_union(r) {
      if(!(r instanceof $j.classes.Rect)) return;
      var x1=$j.min(this.left,r.left);
      var x2=$j.max(this.left+this.width(),r.left+r.width());
      var y1=$j.min(this.top,r.top);
      var y2=$j.max(this.top+this.height(),r.top+r.height());
      this.left=x1;
      this.top=y1;
      this.right=x2;
      this.bottom=y2;
      return this;
    },
    includedRect: function Rect_includedRect(r) {
      if(!(r instanceof $j.classes.Rect)) return;
      if(this.left<r.left) this.left=r.left;
      if(this.top<r.top) this.top=r.top;
      if(this.right>r.right) this.right=r.right;
      if(this.bottom>r.bottom) this.bottom=r.bottom;
      return this;
    },
    equals: function Rect_equals(r) {
      if(!(r instanceof $j.classes.Rect)) return;
      return ((r.left===this.left)&&(r.top===this.top)&&(r.right===this.right)&&(r.bottom===this.bottom));
    },
    rotate: function Rect_rotate(angle) {
      //var m=$j.classes.Matrix.create(),tlp=$j.classes.Point.create(this.left,this.top),brp=$j.classes.Point.create(this.right,this.bottom);
      //m.assign(_const.IDENTITYMATRIX);
      //m.translate(this.left,this.top);
      //m.rotate(angle);
      //m.transformPoint(tlp);
      //m.transformPoint(trp);
      //m.transformPoint(blp);
      //m.transformPoint(brp);
      //this.left=tlp.x;
      //this.top=tlp.y;
      //this.right=brp.x;
      //this.bottom=brp.y;
      if(angle!==0) {
        var w=this.width(),h=this.height(),x=this.left,y=this.top;
        this.left=x+(w/2)*$j.cos(_conv.deg2Rad(angle))-(h/2)*$j.sin(_conv.deg2Rad(angle));
        this.top=y+(h/2)*$j.cos(_conv.deg2Rad(angle))+(w/2)*$j.sin(_conv.deg2Rad(angle));
        this.right=x-(w/2)*$j.cos(_conv.deg2Rad(angle))-(h/2)*$j.sin(_conv.deg2Rad(angle));
        this.bottom=y-(h/2)*$j.cos(_conv.deg2Rad(angle))+(w/2)*$j.sin(_conv.deg2Rad(angle));
      }
    },
    assign: function Rect_assign(source) {
      if(!(source instanceof $j.classes.Rect)) return;
      this.left=source.left;
      this.top=source.top;
      this.right=source.right;
      this.bottom=source.bottom;
    }
    //#endregion
  });
  //#endregion
  //#region Vector
  $j.classes.Vector=Class.extend({
    _ClassName: "Vector",
    init: function(x,y,z) {
      if(isNaN(x)) x=0;
      if(isNaN(y)) y=0;
      if(isNaN(z)) z=1;
      this.x=+x;
      this.y=+y;
      this.z=+z;
      //this.setX=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_x) _x=newValue;
      //};
      //this.setY=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_y) _y=newValue;
      //};
      //this.setZ=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_z) _z=newValue;
      //};
    },
    //#region Setters
    setValues:function Vector_setValues(x,y,z) {
      x=+x;
      y=+y;
      z=+z;
      if(isNaN(x)) x=0;
      if(isNaN(y)) y=0;
      if(isNaN(z)) z=0;
      this.x=x;
      this.y=y;
      this.z=z;
    },
    //#endregion
    //#region Methods
    point:function() { return new $j.classes.Point(this.x,this.y); },
    length:function() { return $j.sqrt(this.norm()); },
    clone:function() {
      var v=new $j.classes.Vector();
      v.assign(this);
      return v;
    },
    norm:function() { return this.x*this.x+this.y*this.y; },
    normalize:function() {
      var invlen=$j.RSqrt($j.abs(this.norm()));
      this.x*=invlen;
      this.y*=invlen;
      this.z=0.0;
      return this;
    },
    transform: function Vector_transform(m) {
      if(!(m instanceof $j.classes.Matrix)) return;
      var x=this.x,y=this.y,z=this.z;
      this.x=x*m.m11+y*m.m21+z*m.m31;
      this.y=x*m.m12+y*m.m22+z*m.m32;
      this.z=1.0;
      return this;
    },
    add: function Vector_add(v,v1) {
      if(!(v instanceof $j.classes.Vector)) return;
      if(!(v1 instanceof $j.classes.Vector)) return;
      var result=new $j.classes.Vector();
      result.x=v.x+v1.x;
      result.y=v.y+v1.y;
      result.z=1.0;
      return result;
    },
    subtract: function Vector_subtract(v) {
      if(!(v instanceof $j.classes.Vector)) return;
      this.x-=v.x;
      this.y-=v.y;
      this.z=1;
      return this;
    },
    scale: function Vector_scale(f) {
      if(typeof f!==_const.NUMBER) f=0;
      this.x*=f;
      this.y*=f;
      this.z=1;
      return this;
    },
    dotProduct: function Vector_dotProduct(v) {
      if(!(v instanceof $j.classes.Vector)) return;
      return this.x*v.x+this.y*v.y;
    },
    angleCosine: function Vector_angleCosine(v) {
      var dot,len1,len2,result;
      len1=$j.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z));
      len2=$j.sqrt((v.x*v.x)+(v.y*v.y)+(v.z*v.z));
      dot=(this.x*v.x+this.y*v.y+this.z*v.z);
      result=len1*len2;
      if($j.abs(result)>1e-40) result=dot/result;
      else result=1;
      return result;
    },
    crossProductZ: function Vector_crossProductZ(v) {
      if(!(v instanceof $j.classes.Vector)) return;
      return this.x*v.y-this.y*v.x;
    },
    combine2: function Vector_combine2(v,f,f1) {
      if(!(v instanceof $j.classes.Vector)) return;
      if(typeof f!==_const.NUMBER) f=0;
      if(typeof f1!==_const.NUMBER) f1=0;
      var x=this.x,y=this.y/*,z=this.z*/;
      this.x=(f*x)+(f1*v.x);
      this.y=(f*y)+(f1*v.y);
      this.z=1;
      return this;
    },
    reflect: function Vector_reflect(v) {
      if(!(v1 instanceof $j.classes.Vector)) return;
      return this.combine2(v,1,-2*this.dotProduct(v));
    },
    angle: function Vector_angle(v) {
      if(!(v instanceof $j.classes.Vector)) return;
      if(this.crossProductZ(v)<0) return _conv.rad2Deg($j.acos(this.angleCosine(v)));
      else return -_conv.rad2Deg($j.acos(this.angleCosine(v)));
    },
    assign: function Vector_assign(source) {
      if(!(source instanceof $j.classes.Vector)) return;
      this.x=source.x;
      this.y=source.y;
      this.z=source.z;
    },
    equals: function Vector_equals(vector) {
      return this.x===vector.x&&this.y===vector.y&&this.z===vector.z;
    }
    //#endregion
  });
  //#endregion
  //#region Matrix
  $j.classes.Matrix=Class.extend({
    _ClassName: "Matrix",
    init: function(v,v1,v2) {
      if(!(v instanceof $j.classes.Vector)) v=new $j.classes.Vector();
      if(!(v1 instanceof $j.classes.Vector)) v1=new $j.classes.Vector();
      if(!(v2 instanceof $j.classes.Vector)) v2=new $j.classes.Vector();
      this.m11=v.x;
      this.m12=v.y;
      this.m13=v.z;
      this.m21=v1.x;
      this.m22=v1.y;
      this.m23=v1.z;
      this.m31=v2.x;
      this.m32=v2.y;
      this.m33=v2.z;
      //this.setM11=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m11) _m11=newValue;
      //};
      //this.setM12=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m12) _m12=newValue;
      //};
      //this.setM13=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m13) _m13=newValue;
      //};
      //this.setM21=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m21) _m21=newValue;
      //};
      //this.setM22=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m22) _m22=newValue;
      //};
      //this.setM23=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m23) _m23=newValue;
      //};
      //this.setM31=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m31) _m31=newValue;
      //};
      //this.setM32=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m32) _m32=newValue;
      //};
      //this.setM33=function(newValue) {
      //  if(typeof newValue!==_const.NUMBER) return;
      //  if(newValue!==_m33) _m33=newValue;
      //};
    },
    //#region Setters
    setValues: function Matrix_setValues(m11,m12,m13,m21,m22,m23,m31,m32,m33) {
      m11=+m11;
      m12=+m12;
      m13=+m13;
      m21=+m21;
      m22=+m22;
      m23=+m23;
      m31=+m31;
      m32=+m32;
      m33=+m33;
      if(isNaN(m11)) m11=0;
      if(isNaN(m12)) m12=0;
      if(isNaN(m13)) m13=0;
      if(isNaN(m21)) m21=0;
      if(isNaN(m22)) m22=0;
      if(isNaN(m23)) m23=0;
      if(isNaN(m31)) m31=0;
      if(isNaN(m32)) m32=0;
      if(isNaN(m33)) m33=0;
      this.m11=m11;
      this.m12=m12;
      this.m13=m13;
      this.m21=m21;
      this.m22=m22;
      this.m23=m23;
      this.m31=m31;
      this.m32=m32;
      this.m33=m33;
    },
    //#endregion
    //#region Methods
    clone:function() {
      var mat=new $j.classes.Matrix();
      mat.assign(this);
      return mat;
    },
    determinant:function() {
      return this.m11*(this.m22*this.m33-this.m32*this.m23)
            -this.m12*(this.m21*this.m33-this.m31*this.m23)
            +this.m13*(this.m21*this.m32-this.m31*this.m22);
    },
    adjoint:function() {
      var a1,a2,a3,b1,b2,b3,c1,c2,c3;
      a1=this.m11;a2=this.m12;a3=this.m13;
      b1=this.m21;b2=this.m22;b3=this.m23;
      c1=this.m31;c2=this.m32;c3=this.m33;
      this.m11=(b2*c3-c2*b3);
      this.m12= -(a2*c3-c2*a3);
      this.m13=(a2*b3-b2*a3);
      this.m21= -(b1*c3-c1*b3);
      this.m22=(a1*c3-c1*a3);
      this.m23= -(a1*b3-b1*a3);
      this.m31=(b1*c2-c1*b2);
      this.m32= -(a1*c2-c1*a2);
      this.m33=(a1*b2-b1*a2);
      return this;
    },
    free: function Matrix_free() {
      this.m11=this.m12=this.m13=this.m21=this.m22=this.m23=this.m31=this.m32=this.m33=null;
      delete this.m11;
      delete this.m12;
      delete this.m13;
      delete this.m21;
      delete this.m22;
      delete this.m23;
      delete this.m31;
      delete this.m32;
      delete this.m33;
      this.multiply=null;
      delete this.multiply;
      this.determinant=null;
      delete this.determinant;
      this.adjoint=null;
      delete this.adjoint;
      this.assign=null;
      delete this.assign;
      this.createRotation=null;
      delete this.createRotation;
      this.rotate=null;
      delete this.rotate;
      this.translate=null;
      delete this.translate;
      this.transformPoint=null;
      delete this.transformPoint;
      this.scale=null;
      delete this.scale;
      this.invert=null;
      delete this.invert;
      this.equals=null;
      delete this.equals;
      this.free=null;
      delete this.free;
    },
    multiply: function Matrix_multiply(m1) {
      if(!(m1 instanceof $j.classes.Matrix)) return;
      var m=_const.ZEROMATRIX.clone();
      m.assign(this);
      this.m11=m.m11*m1.m11+m.m12*m1.m21+m.m13*m1.m31;
      this.m12=m.m11*m1.m12+m.m12*m1.m22+m.m13*m1.m32;
      this.m13=m.m11*m1.m13+m.m12*m1.m23+m.m13*m1.m33;
      this.m21=m.m21*m1.m11+m.m22*m1.m21+m.m23*m1.m31;
      this.m22=m.m21*m1.m12+m.m22*m1.m22+m.m23*m1.m32;
      this.m23=m.m21*m1.m13+m.m22*m1.m23+m.m23*m1.m33;
      this.m31=m.m31*m1.m11+m.m32*m1.m21+m.m33*m1.m31;
      this.m32=m.m31*m1.m12+m.m32*m1.m22+m.m33*m1.m32;
      this.m33=m.m31*m1.m13+m.m32*m1.m23+m.m33*m1.m33;
      m=null;
      return this;
    },
    assign: function Matrix_assign(source) {
      if(!(source instanceof $j.classes.Matrix)) return;
      this.m11=source.m11;
      this.m12=source.m12;
      this.m13=source.m13;
      this.m21=source.m21;
      this.m22=source.m22;
      this.m23=source.m23;
      this.m31=source.m31;
      this.m32=source.m32;
      this.m33=source.m33;
    },
    rotate: function Matrix_rotate(a) {
      var A=_conv.deg2Rad(a),x=$j.sinCos(A);
      var m=_const.ZEROMATRIX.clone();
      m.assign(this);
      this.m11=m.m11*x.cos+m.m21*x.sin;
      this.m12=m.m12*x.cos+m.m22*x.sin;
      this.m21=m.m11*-x.sin+m.m21*x.cos;
      this.m22=m.m12*-x.sin+m.m22*x.cos;
      A=x=m=null;
    },
    translate: function Matrix_translate(x,y) {
      var m=_const.ZEROMATRIX.clone();
      m.assign(this);
      this.m31+=m.m11*x+m.m21*y;
      this.m32+=m.m12*x+m.m22*y;
      m=null;
    },
    transformPoint: function Matrix_transformPoint(p) { // à voir
      var x=p.x,y=p.y;
      p.x=x*this.m11+y*this.m21+this.m31;
      p.y=x*this.m12+y*this.m22+this.m32;
      x=y=null;
      //return _geo.point(p.x,p.y);
    },
    scale: function Matrix_scale(x,y) {
      this.m11*=x;
      this.m12*=x;
      this.m21*=y;
      this.m22*=y;
    },
    invert: function Matrix_invert() {
      var d=1/(this.m11*this.m22-this.m12*this.m21);
      var m0=this.m22*d;
      var m1= -this.m12*d;
      var m2= -this.m21*d;
      var m3=this.m11*d;
      var m4=d*(this.m21*this.m32-this.m22*this.m31);
      var m5=d*(this.m12*this.m31-this.m11*this.m32);
      this.m11=m0;
      this.m12=m1;
      this.m21=m2;
      this.m22=m3;
      this.m31=m4;
      this.m32=m5;
      d=m0,m1,m2,m3,m4,m5=null;
    },
    equals: function Matrix_equals(m) {
      return this.m11===m.m11&&this.m12===m.m12&&
              this.m13===m.m13&&this.m21===m.m21&&
              this.m22===m.m22&&this.m23===m.m23&&
              this.m31===m.m31&&this.m32===m.m32&&
              this.m33===m.m33;
    }
    //#endregion
  });
  //#endregion
  //#region Line
  $j.classes.line=Class.extend({
    _ClassName: "_Line",
    init: function(p,p1,i) {
      if(!(p instanceof $j.classes.Point)) p=new $j.classes.Point;
      if(!(p1 instanceof $j.classes.Point)) p1=new $j.classes.Point;
      if(!i) i=false;
      if(typeof i!==_const.BOOLEAN) i=false;
      this.point1=p;
      this.point2=p1;
      this.infinite=i;
      //this.setPoint1=function(newValue) {
      //  if(!(newValue instanceof $j.classes.Point)) return;
      //  if(newValue!==_point1) _point1.assign(newValue);
      //};
      //this.setPoint2=function(newValue) {
      //  if(!(newValue instanceof $j.classes.Point)) return;
      //  if(newValue!==_point2) _point2.assign(newValue);
      //};
      //this.setInfinite=function(newValue) {
      //  if(typeof newValue!==_const.BOOLEAN) return;
      //  if(newValue!==this.infinite) _i=newValue;
      //};
    },
    //#region Methods
    intersect: function _Line_intersect(l) // Pas bon
    {
      var v=$j.clone(l),t1,t2;
      if(!(l instanceof $j.classes.Line)) return;
      var cross=this.vector.cross(l.vector);
      if($j.abs(cross)<=10e-6) return false;
      v.subtract(this.point);
      t1=v.cross(this.vector)/cross;
      t2=v.cross(l.vector)/cross;
      return (this.infinite||0<=t1&&t1<=1)&&(l.infinite||0<=t2&&t2<=1)?this.point.add(this.vector.multiply(t1)):null;
    },
    side: function _Line_side(p) {
      if(!(p instanceof $j.classes.Point)) return;
      var v1=$j.clone(this.vector),
      v2=p.subtract(this.point),
      ccw=v2.cross(v1);
      if(ccw===0) {
        ccw=v2.dot(v1);
        if(ccw>0) {
          v2.subtract(v1);
          ccw=v2.dot(v1);
          if(ccw<0) ccw=0;
        }
      }
      return ccw<0?-1:ccw>0?1:0;
    },
    assign: function _Line_assign(source) {
      if(!(source instanceof $j.classes.line)) return;
      this.point1.assign(source.point1);
      this.point2.assign(source.point2);
    }
    //#endregion
  });
  //#endregion
})();