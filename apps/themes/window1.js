(function() {
  function _Circle(vx,vy,cx,cy) {
    this.color=$j.apps.activeApplication.activeWindow._colors[(Math.random()*$j.apps.activeApplication.activeWindow._colors.length)|0];
    this.pos={ x: cx,y: cy };
    this.vel={ x: vx,y: vy };
    this.frame=1;
    this.ctx=null;
  };
  _Circle.prototype.update=function(ctx) {
    this.frame+=0.0001;
    this.vel.x*=this.frame;
    this.vel.y*=this.frame;
    this.pos.x+=this.vel.x;
    this.pos.y+=this.vel.y;

    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x,this.pos.y,2,0,2*Math.PI);
    ctx.fill();
  };
  function _Star(form,ctx){
    this.size = form.rand(form._size);
    this.x = Math.random() * ctx.canvas.width;
    this.y = -this.size*2;
    this.vy = this.size/10;
    this.vx = Math.random() * 6 - 3;
    this.ay = this.size/5000;
    this.shine = 0;
    this.shineDir = form.rand(form._shineDir);
    this.color = 'hsla(hue, 80%, brightness%, .15)'.replace('hue', form._frame%360);
    this.rot = Math.random() * 2 * Math.PI;
    this.omega = form.rand(form._angSpeed);
    if(Math.random() < .5) this.omega *= -1;
    this.form=form;
    this.ctx=ctx;
  };
  _Star.prototype.use = function(){
    this.x += this.vx;
    this.y += this.vy += this.ay;
  
    var newShine = this.shine + this.shineDir;
    if(newShine < 0 || newShine > 1) this.shineDir *= -1
    else this.shine = newShine;
    this.rot += this.omega;
  
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.rot);
    this.ctx.fillStyle = this.color.replace('brightness', (.25 + this.shine/2)*100);
    this.ctx.beginPath();
    this.ctx.moveTo(this.size, 0);
  
    for(var i = 0; i < 5; ++i){
      var rad = this.form._pentaRadiant * i,
          halfRad = rad + this.form._pentaRadiant/2;
      this.ctx.lineTo(Math.cos(rad) * this.size, Math.sin(rad) * this.size);
      this.ctx.lineTo(Math.cos(halfRad) * this.size/2, Math.sin(halfRad) * this.size/2);
    }
    this.ctx.closePath();
  
    this.ctx.fill();
  
    this.ctx.rotate(-this.rot);
    this.ctx.translate(-this.x, -this.y);
  };
  var Window1=$j.classes.Window.extend({
    _ClassName: "Window1",
    init: function(owner) {
      this._inherited(owner);
      this.onCreate.addListener(this.formCreated);
      this._MAX_DEPTH=32;
      this._stars=[];
      this._totalStars=512;
      this._size=[10,30];
      this._shineDir=[.01,.05];
      this._angSpeed=[.01,.04];
      this._pentaRadiant=Math.PI*2/5;
      this._colors=['#ff0000','#ff7f00','#ffff00','#00ff00','#0000ff','#4b0082','#8b00ff'];
      this._frame = (Math.random()*360)|0;
    },
    rand:function(ar){
      return Math.random() * (ar[1] - ar[0]) + ar[0];
    },
    formCreated: function(id) {
      this._inherited(id);
      if($j.renderer!==$j.types.renderers.DOM) {
        //this.Gauge2.createArrow=this.createArrowBlue;
        //this.Gauge3.createArrow=this.createArrowBlack;
      }
      this.initStars();
      $j.looper.addListener(this);
    },
    initStars: function() {
      for(var i=0;i<this._totalStars;i++) {
        this._stars[i]={
          x: this.randomRange(-25,25),
          y: this.randomRange(-25,25),
          z: this.randomRange(1,this._MAX_DEPTH)
        }
      }
      this.PaintBox1.drawType=0;
    },
    randomRange: function(minVal,maxVal) {
      return $j.floor($j.random()*(maxVal-minVal-1))+minVal;
    },
    Button1_onClick: function(sender) {
      var t=new Date().getTime(),btn,span,style,div=[],confirm;
      confirm=$j.dialogs.confirm("This operation takes several seconds.<br />It depends on your CPU.<br />Proceed?");
      confirm.onClose.addListener(this.form.createListBoxItems);
    },
    createListBoxItems:function() {
      if(this._modalResult===$j.types.modalResults.OK) {
        var t=new Date().getTime();
        this.app.activeWindow.ListBox2.beginUpdate();
        for(var i=0;i<1000000;i++) {
          span=new $j.classes.ListBoxItem(this.app.activeWindow.ListBox2,"item"+i);
          this.app.activeWindow.ListBox2.addItem(span);
        }
        this.app.activeWindow.ListBox2.endUpdate();
        console.log((new Date().getTime()-t)+"ms");
      }
    },
    RoundButton1_onClick: function() {
      this.form.OpenDialog1.execute();
    },
    Label1_onClick: function() {
      this.form.FontDialog1.execute(this);
    },
    processTick: function() {
      //this.PaintBox1.onPaint.invoke();
    },
    PaintBox1_onClick: function() {
      this.drawType++;
      if(this.drawType>2) this.drawType=0;
      this.form._stars.clear();
      if(this.drawType===0) this.form.initStars();
    },
    PaintBox1_onPaint: function() {
      var halfWidth=this.width/2,halfHeight=this.height/2,star;

      switch(this.drawType) {
        case 0:
          this._ctx.globalCompositeOperation=$j.types.canvas.globalCompositeOperations.SOURCEOVER;
          this._ctx.fillStyle='rgba(0, 0, 0, 0.1)';
          this._ctx.fillRect(0,0,this.width,this.height);
          for(var i=0;i<this.form._stars.length;i++) {
            star=this.form._stars[i];
            star.z-=0.2;

            if(star.z<=0) {
              star.x=this.form.randomRange(-25,25);
              star.y=this.form.randomRange(-25,25);
              star.z=this.form._MAX_DEPTH;
            }

            var k=128.0/star.z;
            var px=star.x*k+halfWidth;
            var py=star.y*k+halfHeight;

            if(px>=0&&px<=500&&py>=0&&py<=400) {
              var size=(1-star.z/32.0)*5;
              var shade=parseInt((1-star.z/32.0)*255);
              this._ctx.fillStyle="rgb("+shade+","+shade+","+shade+")";
              this._ctx.fillRect(px,py,size,size);
            }
          }
          break;
        case 1:
          ++this.form._frame;
          this._ctx.globalCompositeOperation = $j.types.canvas.globalCompositeOperations.DESTINATIONOUT;
          this._ctx.fillStyle = 'rgba(0, 0, 0, .1)';
          this._ctx.fillRect(0, 0, this.width, this.height);
          this._ctx.globalCompositeOperation = $j.types.canvas.globalCompositeOperations.LIGHTER;
          
          if($j.random() < .3) this.form._stars.push(new _Star(this.form,this._ctx));
          
          for(var s = 0; s < this.form._stars.length; ++s){
            star=this.form._stars[s];
            star.use();
          
            if((star.x + star.size < 0)||(star.y + star.size > this.height+star.size*2)||(star.x + star.size > this.width+star.size*2)){ 
              this.form._stars.splice(s, 1);
              --s;
            }
          }
          break;
        case 2:
          var total=~~(this.width*.5);
          this._ctx.globalCompositeOperation=$j.types.canvas.globalCompositeOperations.SOURCEOVER;
          for(var i=0;i<this.form._stars.length;++i) {
            this.form._stars[i].update(this._ctx);
            if(this.form._stars[i].pos.y<0||this.form._stars[i].pos.y>this.height||this.form._stars[i].pos.x<0||this.form._stars[i].pos.x>this.width) {
              this.form._stars.splice(i,1);
            }
          }
          if(this.form._stars.length<total) this.form._stars.push(new _Circle(Math.random()-0.5,Math.random()-0.5,halfWidth,halfHeight));
          this._ctx.fillStyle='rgba(0, 0, 0, 0.1)';
          this._ctx.fillRect(0,0,this.width,this.height);

          break;
      }
    },
    PlotGrid1_onPaint: function() {
      var p=new Array(200),x,y,i;
      this._ctx.save();
      // Paint sin
      for(i=0,l=p.length;i<l;i++) {
        // calc only in PlotGrid area
        x=-(this.width/2)+((i/l)*this.width);
        x=x/this.frequency;
        // formula here
        y=$j.sin(x);
        p[i]=new $j.classes.Point(this.width/2+x*this.frequency,this.height/2-y*this.frequency);
      }
      this._ctx.lineWidth=2;
      this._ctx.strokeStyle="red";
      this._ctx.drawPolyline(p);
      // Paint cos * x
      p=new Array(500);
      for(i=0,l=p.length;i<l;i++) {
        // calc only in PlotGrid area
        x=-(this.width/2)+((i/l)*this.width);
        x=x/this.frequency;
        // formula here
        y=$j.cos(x)*x;
        p[i]=new $j.classes.Point(this.width/2+x*this.frequency,this.height/2-y*this.frequency);
      }
      this._ctx.linewidth=2;
      this._ctx.strokeStyle="green";
      this._ctx.drawPolyline(p);
      // Paint x * x }
      p=new Array(100);
      for(i=0,l=p.length;i<l;i++) {
        // calc only in PlotGrid area
        x=-(this.width/2)+((i/l)*this.width);
        x=x/this.frequency;
        // formula here
        y=x*x;
        p[i]=new $j.classes.Point(this.width/2+x*this.frequency,this.height/2-y*this.frequency);
      }
      this._ctx.lineWidth=2;
      this._ctx.strokeStyle="blue";
      this._ctx.drawPolyline(p);
      // End Paint
      this._ctx.restore();
    },
    ToolButton1_onClick: function() {
      window.location.href=$j.tools.uri.base()+"index.html";
    },
    changeTheme: function() {
      this.app.setThemeName(this.caption.replace(String.SPACE,String.empty).toLowerCase());
    },
    SpeedButton1_onClick: function() {
      //this.app.addWindow($j.tools.getPath($j.types.internalCategories.APPS)+this.app.name+"/window2");
      this.app.newWindow($j.tools.getPath($j.types.internalCategories.APPS)+this.app.name+"/window2");
    }
  });
  $j.apps.activeApplication._windowsClass[$j.tools.getFuncName(Window1)]=Window1;
}());