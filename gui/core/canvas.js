(function(){
//#region $j.types.canvas
  $j.types.canvas={
    CURVEKAPPA:0.2761423749153967,CURVEKAPPAINV:0.7238576250846033,CURVE2KAPPA:0.5522847498307934,
    lineCaps:{BUTT:"butt",ROUND:"round",SQUARE:"square"},
    lineJoins:{MITER:"miter",ROUND:"round",BEVEL:"bevel"},
    globalCompositeOperations:{SOURCEOVER:"source-over",SOURCEIN:"source-in",SOURCEOUT:"source-out",SOURCEATOP:"source-atop",DESTINATIONOVER:"destination-over",DESTINATIONIN:"destination-in",DESTINATIONOUT:"destination-out",DESTINATIONATOP:"destination-atop",LIGHTER:"lighter",COPY:"copy",XOR:"xor"},
    pathOperations:{MOVE:0x234,LINE:0x235},
    sparkTypes:{LINE:"line",BAR:"bar",PIE:"pie",BOXPLOT:"boxPlot"},
    patternRepeats:{REPEAT:"repeat",REPEATX:"repeat-x",REPEATY:"repeat-y",NOREPEAT:"no-repeat"},
    linePositions:{LEFTTORIGHT:0x239,RIGHTTOLEFT:0x23A,NEAR:0x23B,MIDDLE:0x23C,FAR:0x23D},
    strokeDashs:{SOLID:[],SHORTDASH:[4,1],SHORTDOT:[1,1],SHORTDASHDOT:[4,1,1,1],SHORTDASHDOTDOT:[4,1,1,1,1,1],DOT:[1,3],DASH:[4,3],LONGDASH:[8,3],DASHDOT:[4,3,1,3],LONGDASHDOT:[8,3,1,3],LONGDASHDOTDOT:[8,3,1,3,1,3]}
  };
  Object.seal($j.types.canvas);Object.freeze($j.types.canvas);
  Object.seal($j.types.canvas.lineCaps);Object.freeze($j.types.canvas.lineCaps);
  Object.seal($j.types.canvas.lineJoins);Object.freeze($j.types.canvas.lineJoins);
  Object.seal($j.types.canvas.globalCompositeOperations);Object.freeze($j.types.canvas.globalCompositeOperations);
  Object.seal($j.types.canvas.pathOperations);Object.freeze($j.types.canvas.pathOperations);
  //Object.seal($j.types.canvas.lineTypes);Object.freeze($j.types.canvas.lineTypes);
  Object.seal($j.types.canvas.patternRepeats);Object.freeze($j.types.canvas.patternRepeats);
  Object.seal($j.types.canvas.strokeDashs);Object.freeze($j.types.canvas.strokeDashs);
//#endregion
//#region Extended CanvasRenderingContext2D
CanvasRenderingContext2D.prototype.borderWidth=1;
CanvasRenderingContext2D.prototype.setDash=function CanvasRenderingContext2D_setDash(dashArray){
  var dashses=[];
  for (var i=0,l=dashArray.length;i<l;i++){
    dashses.push(dashArray[i]*this.borderWidth);
  }
  if (typeof this[this.useNativeDash]===_const.FUNCTION) this[this.useNativeDash](dashses);
  else this[this.useNativeDash]=dashses;
};
CanvasRenderingContext2D.prototype.resize=function CanvasRenderingContext2D_resize(newWidth,newHeight){
  this.canvas.width=newWidth;
  this.canvas.height=newHeight;
  this.canvas.style.width=newWidth+$j.types.CSSUnits.PX;
  this.canvas.style.height=newHeight+$j.types.CSSUnits.PX;
};
CanvasRenderingContext2D.prototype.clear=function CanvasRenderingContext2D_clear(){
  this.clearRect(0,0,this.canvas.width,this.canvas.height);
  this.clearShadow();
};
CanvasRenderingContext2D.prototype.clearShadow=function CanvasRenderingContext2D_clearShadow(){
  this.shadowBlur=0;
  this.shadowOffsetX=0;
  this.shadowOffsetY=0;
  this.shadowColor=_colors.TRANSPARENT.toARGBString();
};
CanvasRenderingContext2D.prototype.drawPath=function CanvasRenderingContext2D_drawPath(comp,path,clip){
  var b,i,w,h,cp1,cp2,cp,sp=new $j.classes.Point(),pathData,result,lastX,lastY,pts=[],points=[];
  if (!(path instanceof $j.classes.PathData)) return;
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (!$j.tools.isNull(this.useNativeDash&&comp.borderDash)) this.setDash(comp.borderDash);
  if (!path.empty()){
    b=path.bounds();
    w=b.width();
    h=b.height();
    if (w*h===0) return;
    i=0;
    pathData=path.data;
    this.beginPath();
    var l=pathData.length;
    while (i<l){
      if (pathData[i].kind===$j.types.pathPointKinds.MOVETO){
        cp=pathData[i].point;
        this.moveTo(cp.x,cp.y);
        sp.assign(cp);
      }else if (pathData[i].kind===$j.types.pathPointKinds.LINETO){
        cp=pathData[i].point;
        this.lineTo(cp.x,cp.y);
      }else if (pathData[i].kind===$j.types.pathPointKinds.CURVETO){
        cp1=pathData[i].point;
        i++;
        cp2=pathData[i].point;
        i++;
        this.bezierCurveTo(cp1.x,cp1.y,cp2.x,cp2.y,pathData[i].point.x,pathData[i].point.y);
        cp=pathData[i].point;
      }else if (pathData[i].kind===$j.types.pathPointKinds.CLOSE) this.closePath();
      i++;
    }
    if (!clip){
      this.fill();
      if (!this.useNativeDash&&comp.borderDash.length>0){
        this.beginPath();
        i=0;
        while (i<l){
          if (pathData[i].kind===$j.types.pathPointKinds.MOVETO){
            cp=pathData[i].point;
            sp.assign(cp);
            lastX=cp.x;
            lastY=cp.y;
          }else if (pathData[i].kind===$j.types.pathPointKinds.LINETO){
            cp=pathData[i].point;
            result=this.dashedLineTo(comp.borderDash,lastX,lastY,cp.x,cp.y,result);
            lastX=cp.x;
            lastY=cp.y;
          }else if (pathData[i].kind===$j.types.pathPointKinds.CURVETO){
            cp1=pathData[i].point;
            i++;
            cp2=pathData[i].point;
            i++;
            pts.length=0;
            points.length=0;
            pts.push([lastX,lastY]);
            pts.push([cp1.x,cp1.y,cp2.x,cp2.y,pathData[i].point.x,pathData[i].point.y]);
            result=this.generateDasdedCurves(pts,points,bw,comp.borderDash,result);
            this.drawDashedCurve(points);
            cp=pathData[i].point;
            lastX=cp.x;
            lastY=cp.y;
          }else if (pathData[i].kind===$j.types.pathPointKinds.CLOSE) this.closePath();
          i++;
        }
      }
      this.stroke();
    } else this.clip();
  }
};
CanvasRenderingContext2D.prototype.drawShape=function CanvasRenderingContext2D_drawShape(comp,style,rect,clip){
  var r=comp.localRect,bw=style.borderWidth,tShapes=$j.types.shapes,br=style.bordersRadius?style.bordersRadius:{topLeft:0,topRight:0,bottomLeft:0,bottomRight:0},radius;
  if (rect instanceof $j.classes.Rect) r.assign(rect);
  /*if (!clip&&!r.empty())*/ r.reduce(1,1);
  switch (comp.shape){
    case tShapes.RECTANGLE:
    case tShapes.ROUNDRECT:
      if (comp.shape===tShapes.ROUNDRECT) {
        if (comp.width>comp.height) {
          radius=~~(comp.height/2);
        } else {
          radius=~~(comp.width/2);
        }
        br.topLeft.setValues(radius,radius);
        br.topRight.setValues(radius,radius);
        br.bottomLeft.setValues(radius,radius);
        br.bottomRight.setValues(radius,radius);
      }
      this.drawRect(r,br,comp,clip);
      break;
    case tShapes.ELLIPSE:
    case tShapes.CIRCLE:
      this.drawEllipse(r,comp,clip);
      break;
    case tShapes.CALLOUT:
      this.drawCallout(r,br,comp,clip);
      break;
    case tShapes.PATH:
      this.drawPath(comp,comp.path,clip);
      break;
    case tShapes.LINE:
      this.drawLine(r,comp);
      break;
    case tShapes.STAR:
      this.drawStar(r,comp,clip);
      break;
    case tShapes.TRAPEZOID:
      this.drawTrapezoid(r,comp,clip);
      break;
    case tShapes.PARALLELOGRAM:
      this.drawParallelogram(r,comp,clip);
      break;
    case tShapes.NINJASTAR:
      this.drawNinjaStar(r,comp,clip);
      break;
    case tShapes.REGULARPOLYGON:
      this.drawRegularPolygon(r,comp,clip);
      break;
  }
};
//CanvasRenderingContext2D.prototype.myMeasureText=function(text,onlyWidth,font){
//  var d,H=0;
//  if (typeof onlyWidth!==_const.BOOLEAN) onlyWidth=true;
//  if (typeof text!==_const.STRING) return;
//  if (!(font instanceof $j.classes.Font)) return;
//  if (!onlyWidth){
//    d=$j.doc.createElement("div");
//    d.style.position="absolute";
//    if (font) font.toCss(d);
//    d.innerHTML=text;
//    $j.doc.body.appendChild(d);
//    H=d.offsetHeight-1;
//    $j.doc.body.removeChild(d);
//  }
//  return { w: this.measureText(text).width,h:H };
//};
CanvasRenderingContext2D.prototype.applyStyle=function CanvasRenderingContext2D_applyStyle(object,type,gradientRect){
  if (object[type].style===$j.types.brushStyles.NONE) this[((type==="background")?"fill":"stroke")+"Style"]=_colors.TRANSPARENT.toARGBString();
  else if (object[type].style===$j.types.brushStyles.SOLID) this[((type==="background")?"fill":"stroke")+"Style"]=object[type].color.toARGBString();
  else if (object[type].style===$j.types.brushStyles.GRADIENT) this.gradientFromRect(gradientRect,object,type);
  else if (object[type].style===$j.types.brushStyles.BITMAP) {
    if (object[type].bitmap.complete) this[((type==="background")?"fill":"stroke")+"Style"]=this.createPattern(object[type].bitmap,object[type].bitmapRepeatMode);
  }
};
CanvasRenderingContext2D.prototype.applyBrush=function CanvasRenderingContext2D_applyBrush(brush,gradientRect,radius){
  if (brush.style===$j.types.brushStyles.NONE) this.fillStyle=_colors.TRANSPARENT.toARGBString();
  else if (brush.style===$j.types.brushStyles.SOLID) this.fillStyle=brush.color.toARGBString();
  else if (brush.style===$j.types.brushStyles.GRADIENT) this.gradientFromRectAndBrush(gradientRect,brush,radius);
  else if (brush.style===$j.types.brushStyles.BITMAP) {
    if (brush.bitmap.complete) this.fillStyle=this.createPattern(brush.bitmap,brush.bitmapRepeatMode);
  }
};
CanvasRenderingContext2D.prototype.applyStyleAndDraw=function CanvasRenderingContext2D_applyStyleAndDraw(styleType,object,rect){
  var back,middle,front,form=null,r=new $j.classes.Rect();
  if (!$j.tools.isNull(object.form)) form=object.form;
  else if (!$j.tools.isNull(object._owner)) form=object._owner.form;
  switch (styleType) {
    case $j.types.styles.NONE:
      back=object;
      break;
    case $j.types.styles.NORMAL:
      back=object.getStyle($j.types.styles.NORMAL,$j.types.styleObjects.BACK);
      if (!object.style.customNormal.back.empty())back=object.style.customNormal.back;
      middle=object.getStyle($j.types.styles.NORMAL,$j.types.styleObjects.MIDDLE);
      if (!object.style.customNormal.middle.empty())middle=object.style.customNormal.middle;
      front=object.getStyle($j.types.styles.NORMAL,$j.types.styleObjects.FRONT);
      if (!object.style.customNormal.front.empty())front=object.style.customNormal.front;
      break;
    case $j.types.styles.HOVERED:
      back=object.getStyle($j.types.styles.HOVERED,$j.types.styleObjects.BACK);
      if (!object.style.customHovered.back.empty())back=object.style.customHovered.back;
      middle=object.getStyle($j.types.styles.HOVERED,$j.types.styleObjects.MIDDLE);
      if (!object.style.customHovered.middle.empty())backmiddle=object.style.customHovered.middle;
      front=object.getStyle($j.types.styles.HOVERED,$j.types.styleObjects.FRONT);
      if (!object.style.customHovered.front.empty())front=object.style.customHovered.front;
      break;
    case $j.types.styles.PRESSED:
      back=object.getStyle($j.types.styles.PRESSED,$j.types.styleObjects.BACK);
      if (!object.style.customPressed.back.empty())back=object.style.customPressed.back;
      middle=object.getStyle($j.types.styles.PRESSED,$j.types.styleObjects.MIDDLE);
      if (!object.style.customPressed.middle.empty())middle=object.style.customPressed.middle;
      front=object.getStyle($j.types.styles.PRESSED,$j.types.styleObjects.FRONT);
      if (!object.style.customPressed.front.empty())front=object.style.customPressed.front;
      break;
  }
  r.assign(rect);
  // back
  //if (!back.margins.empty()) {
  //  r.assign(back.margins.marginRect(r));
  //}
  this.applyStyle(back,"background",r);
  if (back.borderWidth>0) {
    this.applyStyle(back,"border",r);
    this.lineWidth=back.borderWidth;
    this.borderWidth=back.borderWidth;
  } else {
    this.strokeStyle=_colors.TRANSPARENT.toARGBString();
    this.borderWidth=0;
  }
  this.drawShape(object,back,r);
  //r.assign(rect);
  // middle
  if (!$j.tools.isNull(middle)) {
    if (middle.visible) {
      if (middle.position==="absolute") {
        if (middle.left>0||middle.top>0||middle.right>0||middle.bottom>0) {
          r.left+=middle.left;
          r.top+=middle.top;
          r.right-=middle.right;
          r.bottom-=middle.bottom;
        }
        if (middle.width>0||middle.height>0) {
          r.right=r.left+middle.width;
          r.bottom=r.top+middle.height;
        }
      }
      if (!middle.margin.empty()) {
        r.assign(middle.margin.marginRect(r));
      }
      if (middle.outline.width>0&&!middle.outline.color.equals(_colors.TRANSPARENT)) {
        r.inflate(-middle.outline.width,-middle.outline.width);
      }
      this.applyStyle(middle,"background",r);
      if (middle.borderWidth>0) {
        this.applyStyle(middle,"border",r);
        this.lineWidth=middle.borderWidth;
        this.borderWidth=middle.borderWidth;
      } else {
        this.strokeStyle=_colors.TRANSPARENT.toARGBString();
        this.borderWidth=0;
      }
      this.drawShape(object,middle,r);
      if (middle.outline.width>0&&!middle.outline.color.equals(_colors.TRANSPARENT)) {
        r.inflate(middle.outline.width,middle.outline.width);
        this.strokeStyle=middle.outline.color.toARGBString();
        this.borderWidth=middle.outline.width;
        this.fillStyle=_colors.TRANSPARENT.toARGBString();
        this.drawShape(object,middle,r);
      }
    }
  }
  //r.assign(rect);
  // front
  if (!$j.tools.isNull(front)) {
    if (front.visible) {
      if (front.position==="absolute") {
        if (front.left>0||front.top>0||front.right>0||front.bottom>0) {
          r.left+=front.left;
          r.top+=front.top;
          r.right-=front.right;
          r.bottom-=front.bottom;
        }
        if (front.width>0||front.height>0) {
          r.right=r.left+front.width;
          r.bottom=r.top+front.height;
        }
      }
      if (!front.margin.empty()) {
        r.assign(front.margin.marginRect(r));
      }
      if (front.outline.width>0&&!front.outline.color.equals(_colors.TRANSPARENT)) {
        r.inflate(-front.outline.width,-front.outline.width);
      }
      this.applyStyle(front,"background",r);
      if (front.borderWidth>0) {
        this.applyStyle(front,"border",r);
        this.lineWidth=front.borderWidth;
        this.borderWidth=front.borderWidth;
      } else {
        this.strokeStyle=_colors.TRANSPARENT.toARGBString();
        this.borderWidth=0;
      }
      this.drawShape(object,front,r);
      if (front.outline.width>0&&!front.outline.color.equals(_colors.TRANSPARENT)) {
        r.inflate(front.outline.width,front.outline.width);
        this.strokeStyle=front.outline.color.toARGBString();
        this.borderWidth=front.outline.width;
        this.fillStyle=_colors.TRANSPARENT.toARGBString();
        this.drawShape(object,front,r);
      }
    }
  }
  //if (object._isFocused&&form!==null)
  //{
  //  var canvas=$j.tools.newCanvas(),ctx;
  //  canvas.width=rect.width+(form.focusEffect.shadowBlur*2);
  //  canvas.height=rect.height+(form.focusEffect.shadowBlur*2);
  //  ctx=canvas.getContext("2d");
  //  ctx.fillStyle=ctx.strokeStyle=$j.tools.colors.BLACK.toARGBString();
  //  if ((style.background.style!==$j.types.brushStyles.NONE)||(style.borderWidth>0)) {
  //    if (form.focusEffect.borderWidth>0) {
  //      this.lineWidth=form.focusEffect.borderWidth;
  //      this.borderWidth=form.focusEffect.borderWidth;
  //      this.strokeStyle=form.focusEffect.borderColor;
  //    } else if (form.focusEffect.shadowColor!==String.empty) {
  //      ctx.shadowOffsetX=form.focusEffect.shadowOffsetX;
  //      ctx.shadowOffsetY=form.focusEffect.shadowOffsetY;
  //      ctx.shadowBlur=form.focusEffect.shadowBlur;
  //      ctx.shadowColor=form.focusEffect.shadowColor;
  //      ctx.translate(form.focusEffect.shadowBlur,form.focusEffect.shadowBlur);
  //      ctx.drawShape(object,style,rect);
  //      ctx.clearShadow();
  //      ctx.globalCompositeOperation=$j.types.canvas.globalCompositeOperations.DESTINATIONOUT;
  //      ctx.drawShape(object,style,rect);
  //      this.drawImage(canvas,-form.focusEffect.shadowBlur,-form.focusEffect.shadowBlur);
  //    }
  //  }
  //}
};
CanvasRenderingContext2D.prototype.gradientFromRectAndBrush=function CanvasRenderingContext2D_gradientFromRectAndBrush(rect,brush,radius){
  var gradient,colorstops,gradientRect;
  if (brush.style!==$j.types.brushStyles.GRADIENT) return;
  gradientRect=rect;
  gradient=null;
  if (brush.gradient.style===$j.types.gradientStyles.LINEAR)
    gradient=this.createLinearGradient(gradientRect.left+brush.gradient.startPosition.x*gradientRect.width,
                                        gradientRect.top+brush.gradient.startPosition.y*gradientRect.height,
                                        gradientRect.left+brush.gradient.stopPosition.x*gradientRect.width,
                                        gradientRect.top+brush.gradient.stopPosition.y*gradientRect.height);
  else gradient=this.createRadialGradient(~~(gradientRect.width/2),~~(gradientRect.height/2),0,~~(gradientRect.width/2),~~(gradientRect.height/2),radius);
  colorstops=brush.gradient.items;
  for (var i=0,l=colorstops.length;i<l;i++) gradient.addColorStop(colorstops[i].offset,colorstops[i].color.toARGBString());
  this.fillStyle=gradient;
};
CanvasRenderingContext2D.prototype.gradientFromRect=function CanvasRenderingContext2D_gradientFromRect(rect,object,type){
  var gradient,colorstops,gradientRect;
  if (object[type].style!==$j.types.brushStyles.GRADIENT) return;
  gradientRect=rect;
  gradient=null;
  if (object[type].gradient.style===$j.types.gradientStyles.LINEAR)
    gradient=this.createLinearGradient(gradientRect.left+object[type].gradient.startPosition.x*gradientRect.width,
                                        gradientRect.top+object[type].gradient.startPosition.y*gradientRect.height,
                                        gradientRect.left+object[type].gradient.stopPosition.x*gradientRect.width,
                                        gradientRect.top+object[type].gradient.stopPosition.y*gradientRect.height);
  else gradient=this.createRadialGradient(gradientRect.left,gradientRect.top,gradientRect.width,gradientRect.height,0,0);
  colorstops=object[type].gradient.items;
  for (var i=0,l=colorstops.length;i<l;i++) gradient.addColorStop(colorstops[i].offset,colorstops[i].color.toARGBString());
  //this[((type==="background")?"fill":"stroke")+"Style"]=gradient;
  if (type==="background"||type==="brush") type="fill";
  else type="stroke";
  this[type+"Style"]=gradient;
};
CanvasRenderingContext2D.prototype.beginScanlines=function CanvasRenderingContext2D_beginScanlines(){return this.getImageData(0,0,this.canvas.width,this.canvas.height);};
CanvasRenderingContext2D.prototype.endScanlines=function CanvasRenderingContext2D_endScanlines(datas){this.putImageData(datas,0,0);};
CanvasRenderingContext2D.prototype.prepareText=function CanvasRenderingContext2D_prepareText(object,rect,calcRect){
  var font,/*self=this,*/txtHeight,words,txt=String.empty,fw=0,maxW=rect.width,maxWidth=0,lines=[],addLine=function(ctx,txt){
    var fx=0,lw=0;
    lw=ctx.measureText(txt).width;
    if(object.horizAlign===$j.types.textAligns.LEFT) fx=(!calcRect)?object.padding.left+rect.left:rect.left;
    else if(object.horizAlign===$j.types.textAligns.CENTER) fx=(rect.width>=lw)?(rect.width-lw)*0.5:0;
    if(object.horizAlign===$j.types.textAligns.RIGHT) fx=(!calcRect)?rect.width-lw-object.padding.right:rect.width-lw;
    lines.add({text:txt,w:lw,x:fx,h:txtHeight});
    if (maxWidth<lw) maxWidth=lw;
  };
  if (typeof calcRect===_const.UNDEFINED) calcRect=false;
  this.save();
  this.textAlign="left";//object.horizAlign;
  this.textBaseline="middle";
  if (!$j.tools.isNull(object.style)) {
    if (object.style.customNormal.back.empty()){
      //this.font=object.style.normal.font.string;
      //font=$j.themes[object.getThemeName()][object.ClassName()].normal.font;
      font=object.getStyle($j.types.styles.NORMAL,$j.types.styleObjects.FONT);
      this.font=font.string;
      //txtHeight=this.myMeasureText("°_",false,font).h;
      txtHeight=font.height;
    }else {
      this.font=object.style.customNormal.font.string;
      //txtHeight=this.myMeasureText("°_",false,object.style.customNormal.font).h;
      txtHeight=font.height;
    }
  } //else txtHeight=this.myMeasureText("°_",false,this.font).h;
  lines.length=0;
  words=$j.tools.text.wrapText(object.caption,object.wordWrap);
  for(var i=0,l=words.length;i<l;i++){
    if (words[i]==="¤"){
      if (txt!==String.empty) addLine(this,txt);
      txt=String.empty;
      continue;
    }
    var testLine=txt+words[i];
    fw=this.measureText(testLine).width;
    if(fw>maxW){
      if (txt!==String.empty) addLine(this,txt);
      txt=words[i];
    } else txt=testLine;
  }
  addLine(this,txt);
  object.lines=lines;
  if (calcRect){
    rect.setRight(rect.left+maxWidth);
    rect.setBottom(rect.top+txtHeight);
  }
  this.restore();
};
CanvasRenderingContext2D.prototype.drawText=function CanvasRenderingContext2D_drawText(object,rect){
  var txtHeight,y=0,text=String.empty,boffset=1,font;
  if (typeof object.caption!==_const.STRING) return;
  if (object.caption===String.empty) return;
  if (!object.lines) return;
  if (object.lines.length===0) return;
  this.save();
  if (!object.enabled) this.globalAlpha*=0.5;
  this.textAlign="left";
  this.textBaseline="middle";
  if (!$j.tools.isNull(object.style)) {
    if (object.style.customNormal.font.empty()){
      font=object.getStyle($j.types.styles.NORMAL,$j.types.styleObjects.FONT);
      this.font=font.string;
      boffset=~~((7*font.size)/100);
    } else {
      this.font=object.style.customNormal.font.string;
      boffset=~~((7*object.style.customNormal.font.size)/100);
    }
  }// else boffset=~~((7*object.style.customNormal.font.size)/100);
  txtHeight=object.lines[0].h;
  y=object.padding.top;
  if (boffset<1) boffset=1;
  if (object.lines.length>1) y=(rect.height-(object.lines.length*txtHeight))/2;
  else y=$j.ceil((rect.height-txtHeight)/2);
  if (y<0) y=0;
  for(var i=0,l=object.lines.length;i<l;i++){
    text=object.lines[i].text;
    if(i>0) y+=txtHeight;
      //if (object.style!==null) {
      //  if (object.style.customNormal.empty())this.fillStyle=object.style.normal.color.toARGBString();
      //  else this.fillStyle=object.style.customNormal.color.toARGBString();
      //}
      //var txtw=object.lines[i].w;
      this.fillText(text,object.lines[i].x+rect.left,$j.ceil(y+(txtHeight/2))+rect.top);
      if (this.borderWidth>0) this.strokeText(text,object.lines[i].x+rect.left,$j.ceil(y+(txtHeight/2))+rect.top);
  }
  this.restore();
};
CanvasRenderingContext2D.prototype.generateDasdedCurves=function CanvasRenderingContext2D_generateDasdedCurves(pts,points,borderWidth,dashArray,result){
  var bu=$j.tools.bezierUtils,p1;
	p1=pts[0];
  for(var i=1;i<pts.length;++i){
		var curves=[];
		result=bu.splitToDashedBezier(p1.concat(pts[i]),dashArray,curves,borderWidth,result);
		p1=[pts[i][4],pts[i][5]];
		points.push(curves);
	}
  return result;
};
CanvasRenderingContext2D.prototype.drawDashedCurve=function CanvasRenderingContext2D_drawDashedCurve(points){
	for(var i=0,l=points.length;i<l;++i){
    var curves=points[i];
    for(var j=0;j<curves.length;++j){
	    var curve=curves[j];
	    this.moveTo(curve[0],curve[1]);
	    this.bezierCurveTo(curve[2],curve[3],curve[4],curve[5],curve[6],curve[7]);
	  }
  }
};
CanvasRenderingContext2D.prototype.drawEllipse=function CanvasRenderingContext2D_drawEllipse(r,comp,clip){
	var pts=[],ox,oy,xe,ye,xm,ym,points=[],x,y,rH,rW;
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (!$j.tools.isNull(this.useNativeDash&&comp.borderDash)) this.setDash(comp.borderDash);
  x=r.left+0.5;
  y=r.top+0.5;
  rW=x+r.width;
  rH=y+r.height;
  ox=(r.width*0.5)*$j.types.canvas.CURVE2KAPPA;// control point offset horizontal 
  oy=(r.height*0.5)*$j.types.canvas.CURVE2KAPPA;// control point offset vertical 
  xe=rW;          // x-end 
  ye=rH;          // y-end 
  xm=x+r.width*0.5;      // x-middle 
  ym=y+r.height*0.5;       // y-middle 
  this.beginPath();
  this.moveTo(x,ym);
  this.bezierCurveTo(x,ym-oy,xm-ox,y,xm,y);
  this.bezierCurveTo(xm+ox,y,xe,ym-oy,xe,ym);
  this.bezierCurveTo(xe,ym+oy,xm+ox,ye,xm,ye);
  this.bezierCurveTo(xm-ox,ye,x,ym+oy,x,ym);
  this.closePath();
  if (!this.useNativeDash&&comp.borderDash.length>0){
    pts.push([r.left,ym]);
    pts.push([r.left,ym-oy,xm-ox,r.top,xm,r.top]);
    pts.push([xm+ox,r.top,xe,ym-oy,xe,ym]);
    pts.push([xe,ym+oy,xm+ox,ye,xm,ye]);
    pts.push([xm-ox,ye,r.left,ym+oy,r.left,ym]);
    this.generateDasdedCurves(pts,points,this.borderWidth,comp.borderDash);
    if (!clip){
      this.fill();
      this.beginPath();
			this.drawDashedCurve(points);
      this.closePath();
    }
  } else if (!clip){
    this.fill();
    this.stroke();
  } else this.clip();
};
CanvasRenderingContext2D.prototype.dashedLineTo=function CanvasRenderingContext2D_dashedLineTo(dashArray,x1,y1,x2,y2,prevResult){
	var result=0,r=0,dal=0,tlength=$j.tools.bezierUtils.distance(x1,y1,x2,y2),i=0,
		prevx=x1,prevy=y1,x,y;
	if (dashArray.length===0){
		this.moveTo(x1,y1);
		this.lineTo(x2,y2);
    return;
  }
  if(prevResult){
		dal=prevResult.l;
		i=prevResult.i;
	}else{
		dal+=dashArray[0]*this.borderWidth;
	}
	while($j.abs(1-r)>0.01){
		if(dal>tlength){
			result={l:dal-tlength,i:i};
			dal=tlength;
		}
		r=dal/tlength;
		x=x1+(x2-x1)*r;
		y=y1+(y2-y1)*r;
		if(!(i++%2)){
			this.moveTo(prevx,prevy);
			this.lineTo(x,y);
		}
		prevx=x;
		prevy=y;
		dal+=dashArray[i%dashArray.length]*this.borderWidth;
	}
	return result;
};
CanvasRenderingContext2D.prototype.drawLine=function CanvasRenderingContext2D_drawLine(r,comp){
  var xl=r.left,yt=r.top,rW=r.width+1,rH=r.height+1,xr=xl+rW,yb=yt+rH,t;
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  this.beginPath();
  switch (comp.lineType){
    case $j.types.canvas.lineTypes.NORMAL:
      if (linePosition===$j.types.canvas.linePositions.RIGHTTOLEFT) {
        t=xl;
        xl=xr;
        xr=t;
      }
      break;
    case $j.types.canvas.lineTypes.HORIZONTAL:
      switch (comp.linePosition){
        case $j.types.canvas.linePositions.NEAR:
          yb=yt;
          break;
        case $j.types.canvas.linePositions.MIDDLE:
          yt=yb=yt+(rH/2);
          break;
        case $j.types.canvas.linePositions.FAR:
          yt=yb;
          break;
      }
      break;
    case $j.types.canvas.lineTypes.VERTICAL:
      switch (comp.linePosition){
        case $j.types.canvas.linePositions.NEAR:
          xr=xl;
          break;
        case $j.types.canvas.linePositions.MIDDLE:
          xl=xr=xl+(rW/2);
          break;
        case $j.types.canvas.linePositions.FAR:
          xl=xr;
          break;
      }
      break;
  }
  if (!this.useNativeDash&&comp.borderDash.length===0) this.dashedLineTo(comp.borderDash,xl,yt,xr,yb);
  else {
    this.moveTo(xl,yt);
    this.lineTo(xr,yb);
  }
  this.stroke();
};
CanvasRenderingContext2D.prototype.drawRect=function CanvasRenderingContext2D_drawRect(r,bordersRadius,comp,clip) {
  var xw,yh,x1,x2,y1,y2,x3,x4,y3,y4,radiiX,radiiY,x,y,rW,rH,ratioX=0,ratioY=0,result,points=[],pts=[],
      tl=bordersRadius.topLeft,tr=bordersRadius.topRight,bl=bordersRadius.bottomLeft,br=bordersRadius.bottomRight,result;
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  // rectangle non arrondi
  x=r.left+0.5;
  y=r.top+0.5;
  rW=r.width;
  rH=r.height;
  if (rW<0||rH<0) return;
  xw=x+rW;
  yh=y+rH;
  if (tl.x+tr.x+br.x+bl.x+tl.y+tr.y+br.y+bl.y===0){
    if (!clip){
      this.beginPath();
      this.rect(x,y,rW,rH);
      this.fill();
      if (this.borderWidth>0) {
        if (!this.useNativeDash&&comp.borderDash.length>0){
          this.beginPath();
          if ((comp.sides&$j.types.sides.LEFT)===$j.types.sides.LEFT) result=this.dashedLineTo(comp.borderDash,x,y,x,yh,result);
          if ((comp.sides&$j.types.sides.TOP)===$j.types.sides.TOP) result=this.dashedLineTo(comp.borderDash,x,y,xw,y,result);
          if ((comp.sides&$j.types.sides.RIGHT)===$j.types.sides.RIGHT) result=this.dashedLineTo(comp.borderDash,xw,y,xw,yh,result);
          if ((comp.sides&$j.types.sides.BOTTOM)===$j.types.sides.BOTTOM) result=this.dashedLineTo(comp.borderDash,x,yh,xw,yh,result);
        } else {
          this.beginPath();
          this.moveTo(x,y);
          if ((comp.sides&$j.types.sides.TOP)===$j.types.sides.TOP) {
            this.lineTo(xw,y);
          } else this.moveTo(xw,y);
          if ((comp.sides&$j.types.sides.RIGHT)===$j.types.sides.RIGHT) {
            this.lineTo(xw,yh);
          } else this.moveTo(xw,yh);
          if ((comp.sides&$j.types.sides.BOTTOM)===$j.types.sides.BOTTOM) {
            this.lineTo(x,yh);
          } else this.moveTo(xw,yh);
          if ((comp.sides&$j.types.sides.LEFT)===$j.types.sides.LEFT) {
            this.lineTo(x,y);
          }
          if (comp.sides===$j.types.sides.ALL) this.closePath();
        }
        this.stroke();
      } else this.fillRect(x,y,rW,rH);
    } else {
      this.beginPath();
      this.rect(x,y,rW+1,rH+1);
      this.clip();
    }
  } else {
    if ((comp.corners&$j.types.corners.TOPLEFT)!==$j.types.corners.TOPLEFT) tl.setValues(0,0);
    if ((comp.corners&$j.types.corners.TOPRIGHT)!==$j.types.corners.TOPRIGHT) tr.setValues(0,0);
    if ((comp.corners&$j.types.corners.BOTTOMLEFT)!==$j.types.corners.BOTTOMLEFT) bl.setValues(0,0);
    if ((comp.corners&$j.types.corners.BOTTOMRIGHT)!==$j.types.corners.BOTTOMRIGHT) br.setValues(0,0);
    ratioX=$j.min(rW/(tl.x+tr.x),rW/(br.x+bl.x));
    if ((ratioX>0)&&(ratioX<1)) {
      tl.x*=ratioX;
      tr.x*=ratioX;
      bl.x*=ratioX;
      br.x*=ratioX;
    };
    ratioY=$j.min(rH/(tl.y+tr.y),rH/(br.y+bl.y));
    if ((ratioY>0)&&(ratioY<1)) {
      tl.y*=ratioY;
      tr.y*=ratioY;
      bl.y*=ratioY;
      br.y*=ratioY;
    }  ;
    x1=x+tl.x;
    x2=xw-tr.x;
    x3=xw-br.x;
    x4=x+bl.x;
    y1=y+tr.y;
    y2=yh-br.y;
    y3=yh-bl.y;
    y4=y+tl.y;
    this.beginPath();
    this.moveTo(x1,y);
    this.lineTo(x2,y);
    if ((comp.corners&$j.types.corners.TOPRIGHT)===$j.types.corners.TOPRIGHT) {
      radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
      radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
      this.bezierCurveTo(x2+radiiX,y,xw,y1-radiiY,xw,y1);
    }
    this.lineTo(xw,y2);
    if ((comp.corners&$j.types.corners.BOTTOMRIGHT)===$j.types.corners.BOTTOMRIGHT) {
      radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
      radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
      this.bezierCurveTo(xw,y2+radiiY,x3+radiiX,yh,x3,yh);
    }
    this.lineTo(x4,yh);
    if ((comp.corners&$j.types.corners.BOTTOMLEFT)===$j.types.corners.BOTTOMLEFT) {
      radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
      radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
      this.bezierCurveTo(x4-radiiX,yh,x,y3+radiiY,x,y3);
    }
    this.lineTo(x,y4);
    if ((comp.corners&$j.types.corners.TOPLEFT)===$j.types.corners.TOPLEFT) {
      radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
      radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
      this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
    }
    if (!clip){
      if (comp.sides===$j.types.sides.ALL) this.closePath();
      this.fill();
      //var ss=this.strokeStyle;
      //this.strokeStyle="rgba(0,0,255,0.5)";
      //this.stroke();
      //this.strokeStyle="rgba(255,0,0,0.5)";
    } else {
      this.clip();
      return;
    }
    if (this.borderWidth>0) {
      this.beginPath();
      if ((comp.sides&$j.types.sides.TOP)===$j.types.sides.TOP) {
        if (!this.useNativeDash&&comp.borderDash.length>0) result=this.dashedLineTo(comp.borderDash,x1,y,x2,y,result);
        else {
          this.moveTo(x1,y);
          this.lineTo(x2,y);
        }
      } else this.moveTo(x2,y);
      if ((comp.corners&$j.types.corners.TOPRIGHT)===$j.types.corners.TOPRIGHT) {
        radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
        radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
        if (!this.useNativeDash&&comp.borderDash.length>0){
          pts.length=0;
          points.length=0;
          pts.push([x2,y]);
          pts.push([x2+radiiX,y,xw,y1-radiiY,xw,y1]);
          result=this.generateDasdedCurves(pts,points,this.borderWidth,comp.borderDash,result);
        } else this.bezierCurveTo(x2+radiiX,y,xw,y1-radiiY,xw,y1);
      }
      if ((comp.sides&$j.types.sides.RIGHT)===$j.types.sides.RIGHT) {
        if (!this.useNativeDash&&comp.borderDash.length>0) result=this.dashedLineTo(comp.borderDash,xw,y1,xw,y2,result);
        else this.lineTo(xw,y2);
      } else this.moveTo(xw,y2);
      if ((comp.corners&$j.types.corners.BOTTOMRIGHT)===$j.types.corners.BOTTOMRIGHT) {
        radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
        radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
        if (!this.useNativeDash&&comp.borderDash.length>0){
          pts.length=0;
          points.length=0;
          pts.push([xw,y2]);
          pts.push([xw,y2+radiiY,x3+radiiX,yh,x3,yh]);
          result=this.generateDasdedCurves(pts,points,this.borderWidth,comp.borderDash,result);
        } else this.bezierCurveTo(xw,y2+radiiY,x3+radiiX,yh,x3,yh);
      }
      if ((comp.sides&$j.types.sides.BOTTOM)===$j.types.sides.BOTTOM) {
        if (!this.useNativeDash&&comp.borderDash.length>0) result=this.dashedLineTo(comp.borderDash,x3,yh,x4,yh,result);
        else this.lineTo(x4,yh);
      } else this.moveTo(x4,yh);
      if ((comp.corners&$j.types.corners.BOTTOMLEFT)===$j.types.corners.BOTTOMLEFT) {
        radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
        radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
        if (!this.useNativeDash&&comp.borderDash.length>0){
          pts.length=0;
          points.length=0;
          pts.push([x4,yh]);
          pts.push([x4-radiiX,yh,x,y3+radiiY,x,y3]);
          result=this.generateDasdedCurves(pts,points,this.borderWidth,comp.borderDash,result);
        } else this.bezierCurveTo(x4-radiiX,yh,x,y3+radiiY,x,y3);
      }
      if ((comp.sides&$j.types.sides.LEFT)===$j.types.sides.LEFT) {
        if (!this.useNativeDash&&comp.borderDash.length>0) result=this.dashedLineTo(comp.borderDash,x,y3,x,y4,result);
        else this.lineTo(x,y4);
      } else this.moveTo(x,y4);
      if ((comp.corners&$j.types.corners.TOPLEFT)===$j.types.corners.TOPLEFT) {
        radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
        radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
        if (!this.useNativeDash&&comp.borderDash.length>0){
          pts.length=0;
          points.length=0;
          pts.push([x,y4]);
          pts.push([x,y4-radiiY,x1-radiiX,y,x1,y]);
          result=this.generateDasdedCurves(pts,points,this.borderWidth,comp.borderDash,result);
        } else this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
      }
    }
    if (!clip){
      if (comp.sides===$j.types.sides.ALL) this.lineTo(x1,y);
      //if (comp.sides===$j.types.sides.ALL) this.closePath();
      //if (ulr+urr+llr+lrr>0) this.fill();
      //else this.fillRect(x,y,xw,yh);
      this.stroke();

    }
  }
};
CanvasRenderingContext2D.prototype.drawRoundRect=function CanvasRenderingContext2D_drawRoundRect(r,radius) {
  var x=r.left+0.5,y=r.top+0.5,w=r.width-0.5,h=r.height-0.5;
  this.beginPath();
  this.moveTo(x,y+radius);
  this.lineTo(x,y+h-radius); // gauche
  this.quadraticCurveTo(x,y+h,x+radius,y+h-0.5); // arrondi gauche-bas
  this.lineTo(x+w-radius-1,y+h-0.5); // bas
  this.quadraticCurveTo(x+w,y+h,x+w-0.5,y+h-radius); // arrondi bas-droit
  this.lineTo(x+w-0.5,y+radius); // droit
  this.quadraticCurveTo(x+w,y,x+w-radius,y); // arrondi droit-haut
  this.lineTo(x+radius-0.5,y); // haut
  this.quadraticCurveTo(x,y,x,y+radius); // arrondi haut-gauche
  this.fill();
  this.stroke();
  this.closePath();
};
CanvasRenderingContext2D.prototype.drawCallout=function CanvasRenderingContext2D_drawCallout(r,bordersRadius,comp,clip){
  var xw,yh,x1,x2,y1,y2,x3,x4,y3,y4,radiiX,radiiY,x,y,rW,rH,ratioX=0,ratioY=0,result,points=[],pts=[],xc1,xc2,xc3,yc1,yc2,yc3,
      tl=bordersRadius.topLeft,tr=bordersRadius.topRight,bl=bordersRadius.bottomLeft,br=bordersRadius.bottomRight,w2,h2,yt,yb,xl,xr;
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  // rectangle non arrondi
  xl=x=r.left+0.5;
  yt=y=r.top+0.5;
  rW=r.width;
  rH=r.height;
  xr=xw=x+rW;
  yb=yh=y+rH;
  if ((comp.corners&$j.types.corners.TOPLEFT)!==$j.types.corners.TOPLEFT) tl.setValues(0,0);
  if ((comp.corners&$j.types.corners.TOPRIGHT)!==$j.types.corners.TOPRIGHT) tr.setValues(0,0);
  if ((comp.corners&$j.types.corners.BOTTOMLEFT)!==$j.types.corners.BOTTOMLEFT) bl.setValues(0,0);
  if ((comp.corners&$j.types.corners.BOTTOMRIGHT)!==$j.types.corners.BOTTOMRIGHT) br.setValues(0,0);
  ratioX=$j.min(rW/(tl.x+tr.x),rW/(br.x+bl.x));
  if ((ratioX>0)&&(ratioX<1)) {
    tl.x*=ratioX;
    tr.x*=ratioX;
    bl.x*=ratioX;
    br.x*=ratioX;
  };
  ratioY=$j.min(rH/(tl.y+tr.y),rH/(br.y+bl.y));
  if ((ratioY>0)&&(ratioY<1)) {
    tl.y*=ratioY;
    tr.y*=ratioY;
    bl.y*=ratioY;
    br.y*=ratioY;
  };
  x1=x+tl.x;
  x2=xw-tr.x;
  x3=xw-br.x;
  x4=x+bl.x;
  y1=y+tr.y;
  y2=yh-br.y;
  y3=yh-bl.y;
  y4=y+tl.y;
  w2=r.width/2;
  h2=r.height/2;
  switch (comp.calloutPosition) {
    case $j.types.calloutPositions.TOP:
      if (comp.calloutOffset<0) {
        xc1=w2+comp.calloutOffset-~~(comp.calloutWidth/2);
        if (xc1<tl.x) xc1=tl.x+~~(this.borderWidth/2);
        xc2=xc1+~~(comp.calloutWidth/2);
        xc3=xc2+~~(comp.calloutWidth/2);
      } else {
        xc3=w2+comp.calloutOffset+~~(comp.calloutWidth/2);
        if (xc3>xw-tr.x) xc3=xw-tr.x-~~(this.borderWidth/2);
        xc2=xc3-~~(comp.calloutWidth/2);
        xc1=xc2-~~(comp.calloutWidth/2);
      }
      if (comp.calloutLength>=r.height) comp.calloutLength=11;
      y+=comp.calloutLength;
      y1+=comp.calloutLength;
      y4+=comp.calloutLength;
      break;
    case $j.types.calloutPositions.RIGHT:
      if (comp.calloutOffset<0) {
        yc1=h2+comp.calloutOffset-~~(comp.calloutWidth/2);
        if (yc1<tr.y) yc1=tr.y+~~(this.borderWidth/2);
        yc2=yc1+~~(comp.calloutWidth/2);
        yc3=yc2+~~(comp.calloutWidth/2);
      } else {
        yc3=h2+comp.calloutOffset+~~(comp.calloutWidth/2);
        if (yc3>yh-br.y) yc3=yh-br.y-~~(this.borderWidth/2);
        yc2=yc3-~~(comp.calloutWidth/2);
        yc1=yc2-~~(comp.calloutWidth/2);
      }
      if (comp.calloutLength>=r.width) comp.calloutLength=11;
      xr-=comp.calloutLength;
      x2-=comp.calloutLength;
      x3-=comp.calloutLength;
      break;
    case $j.types.calloutPositions.BOTTOM:
      if (comp.calloutOffset<0) {
        xc1=w2+comp.calloutOffset-~~(comp.calloutWidth/2);
        if (xc1<bl.x) xc1=bl.x+~~(this.borderWidth/2);
        xc2=xc1+~~(comp.calloutWidth/2);
        xc3=xc2+~~(comp.calloutWidth/2);
      } else {
        xc3=w2+comp.calloutOffset+~~(comp.calloutWidth/2);
        if (xc3>xw-br.x) xc3=xw-br.x-~~(this.borderWidth/2);
        xc2=xc3-~~(comp.calloutWidth/2);
        xc1=xc2-~~(comp.calloutWidth/2);
      }
      if (comp.calloutLength>=r.height) comp.calloutLength=11;
      yb-=comp.calloutLength;
      y2-=comp.calloutLength;
      y3-=comp.calloutLength;
      break;
    case $j.types.calloutPositions.LEFT:
      if (comp.calloutOffset<0) {
        yc1=h2+comp.calloutOffset-~~(comp.calloutWidth/2);
        if (yc1<tl.y) yc1=tl.y+~~(this.borderWidth/2);
        yc2=yc1+~~(comp.calloutWidth/2);
        yc3=yc2+~~(comp.calloutWidth/2);
      } else {
        yc3=h2+comp.calloutOffset+~~(comp.calloutWidth/2);
        if (yc3>yh-bl.y) yc3=yh-bl.y-~~(this.borderWidth/2);
        yc2=yc3-~~(comp.calloutWidth/2);
        yc1=yc2-~~(comp.calloutWidth/2);
      }
      if (comp.calloutLength>=r.width) comp.calloutLength=11;
      xl+=comp.calloutLength;
      x1+=comp.calloutLength;
      x4+=comp.calloutLength;
      break;
  }
  if (!clip){
    this.beginPath();
    switch (comp.calloutPosition) {
      case $j.types.calloutPositions.TOP:
        this.moveTo(x,y);
        if (!this.useNativeDash&&comp.borderDash.length>0){
          result=this.dashedLineTo(comp.borderDash,x,y,xc1,y,result);
          result=this.dashedLineTo(comp.borderDash,xc1,y,xc2,yt,result);
          result=this.dashedLineTo(comp.borderDash,xc2,yt,xc3,y,result);
          result=this.dashedLineTo(comp.borderDash,xc3,y,xw,y,result);
          result=this.dashedLineTo(comp.borderDash,xw,y,xw,yh,result);
          result=this.dashedLineTo(comp.borderDash,xw,yh,x,yh,result);
          result=this.dashedLineTo(comp.borderDash,x,yh,x,y,result);
        } else {
          this.lineTo(xc1,y);
          this.lineTo(xc2,yt);
          this.lineTo(xc3,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xw,y1-radiiY,xw,y1);
          this.lineTo(xw,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xw,y2+radiiY,x3+radiiX,yh,x3,yh);
          this.lineTo(x4,yh);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yh,x,y3+radiiY,x,y3);
          this.lineTo(x,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
        }
        break;
        case $j.types.calloutPositions.RIGHT:
          this.moveTo(x1,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xr,y1-radiiY,xr,y1);
          this.lineTo(xr,yc1);
          this.lineTo(xw,yc2);
          this.lineTo(xr,yc3);
          this.lineTo(xr,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xr,y2+radiiY,x3+radiiX,yh,x3,yh);
          this.lineTo(x4,yh);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yh,x,y3+radiiY,x,y3);
          this.lineTo(x,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
          break;
        case $j.types.calloutPositions.BOTTOM:
          this.moveTo(x,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xw,y1-radiiY,xw,y1);
          this.lineTo(xw,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xw,y2+radiiY,x3+radiiX,yb,x3,yb);
          this.lineTo(xc1,yb);
          this.lineTo(xc2,yh);
          this.lineTo(xc3,yb);
          this.lineTo(x4,yb);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yb,x,y3+radiiY,x,y3);
          this.lineTo(x,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
          break;
        case $j.types.calloutPositions.LEFT:
          this.moveTo(x1,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xr,y1-radiiY,xr,y1);
          this.lineTo(xw,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xr,y2+radiiY,x3+radiiX,yh,x3,yh);
          this.lineTo(x4,yh);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yh,xl,y3+radiiY,xl,y3);
          this.lineTo(xl,y3);
          this.lineTo(xl,yc3);
          this.lineTo(x,yc2);
          this.lineTo(xl,yc1);
          this.lineTo(xl,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(xl,y4-radiiY,x1-radiiX,y,x1,y);
          break;
    }
    this.fill();
    if (this.borderWidth>0) {
      this.beginPath();
      switch (comp.calloutPosition) {
        case $j.types.calloutPositions.TOP:
          this.moveTo(x1,y);
          this.lineTo(xc1,y);
          this.lineTo(xc2,yt);
          this.lineTo(xc3,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xw,y1-radiiY,xw,y1);
          this.lineTo(xw,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xw,y2+radiiY,x3+radiiX,yh,x3,yh);
          this.lineTo(x4,yh);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yh,x,y3+radiiY,x,y3);
          this.lineTo(x,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
          break;
        case $j.types.calloutPositions.RIGHT:
          this.moveTo(x1,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xr,y1-radiiY,xr,y1);
          this.lineTo(xr,yc1);
          this.lineTo(xw,yc2);
          this.lineTo(xr,yc3);
          this.lineTo(xr,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xr,y2+radiiY,x3+radiiX,yh,x3,yh);
          this.lineTo(x4,yh);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yh,x,y3+radiiY,x,y3);
          this.lineTo(x,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
          break;
        case $j.types.calloutPositions.BOTTOM:
          this.moveTo(x1,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xw,y1-radiiY,xw,y1);
          this.lineTo(xw,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xw,y2+radiiY,x3+radiiX,yb,x3,yb);
          this.lineTo(xc3,yb);
          this.lineTo(xc2,yh);
          this.lineTo(xc1,yb);
          this.lineTo(x4,yb);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yb,x,y3+radiiY,x,y3);
          this.lineTo(x,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(x,y4-radiiY,x1-radiiX,y,x1,y);
          break;
        case $j.types.calloutPositions.LEFT:
          this.moveTo(x1,y);
          this.lineTo(x2,y);
          radiiX=$j.types.canvas.CURVE2KAPPA*tr.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tr.y;
          this.bezierCurveTo(x2+radiiX,y,xr,y1-radiiY,xr,y1);
          this.lineTo(xw,y2);
          radiiX=$j.types.canvas.CURVE2KAPPA*br.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*br.y;
          this.bezierCurveTo(xr,y2+radiiY,x3+radiiX,yh,x3,yh);
          this.lineTo(x4,yh);
          radiiX=$j.types.canvas.CURVE2KAPPA*bl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*bl.y;
          this.bezierCurveTo(x4-radiiX,yh,xl,y3+radiiY,xl,y3);
          this.lineTo(xl,y3);
          this.lineTo(xl,yc3);
          this.lineTo(x,yc2);
          this.lineTo(xl,yc1);
          this.lineTo(xl,y4);
          radiiX=$j.types.canvas.CURVE2KAPPA*tl.x;
          radiiY=$j.types.canvas.CURVE2KAPPA*tl.y;
          this.bezierCurveTo(xl,y4-radiiY,x1-radiiX,y,x1,y);
          break;
      }
      if (comp.sides===$j.types.sides.ALL) this.closePath();
      this.stroke();
    } else this.fillRect(r.left+0.5,r.top+0.5,r.width,r.height);
  }
};
CanvasRenderingContext2D.prototype.drawPolygon=function CanvasRenderingContext2D_drawPolygon(a) {
  if (!Array.isArray(a)) return;
  this.beginPath();
  for (var i=0,l=a.length;i<l;i++) {
    if (i===0) this.moveTo(a[i].x,a[i].y);
    else this.lineTo(a[i].x,a[i].y);
  }
  this.closePath();
  this.fill();
  this.stroke();
};
CanvasRenderingContext2D.prototype.drawPolyline=function CanvasRenderingContext2D_drawPolyline(a) {
  if (!Array.isArray(a)) return;
  this.beginPath();
  for (var i=0,l=a.length;i<l;i++) {
    if (i===0) this.moveTo(a[i].x,a[i].y);
    else this.lineTo(a[i].x,a[i].y);
  }
  this.stroke();
};
CanvasRenderingContext2D.prototype.clipRect=function CanvasRenderingContext2D_clipRect(comp){
  var r=comp.localRect;
  this.beginPath();
  this.rect(r.left,r.top,r.width,r.height);
  this.clip();
};
CanvasRenderingContext2D.prototype.drawDigit=function CanvasRenderingContext2D_drawDigit(value,x,y,/*dp,*/height,outlineColor,fillColor){
  var width=10*height/13,segmentA=[],segmentB=[],segmentC=[],segmentD=[],segmentE=[],segmentF=[],segmentG=[],
      getX=function(x,width) { return x*width/12; },getY=function(y,height) { return y*height/15; };
  outlineColor.alpha=((40*100)/255)/100;
  //Segment A
  segmentA[0]=segmentA[4]=new $j.classes.Point(x+getX(2.8,width),y+getY(1,height));
  segmentA[1]=new $j.classes.Point(x+getX(10,width),y+getY(1,height));
  segmentA[2]=new $j.classes.Point(x+getX(8.8,width),y+getY(2,height));
  segmentA[3]=new $j.classes.Point(x+getX(3.8,width),y+getY(2,height));
  //Segment B
  segmentB[0]=segmentB[4]=new $j.classes.Point(x+getX(10,width),y+getY(1.4,height));
  segmentB[1]=new $j.classes.Point(x+getX(9.3,width),y+getY(6.8,height));
  segmentB[2]=new $j.classes.Point(x+getX(8.4,width),y+getY(6.4,height));
  segmentB[3]=new $j.classes.Point(x+getX(9,width),y+getY(2.2,height));
  //Segment C
  segmentC[0]=segmentC[4]=new $j.classes.Point(x+getX(9.2,width),y+getY(7.2,height));
  segmentC[1]=new $j.classes.Point(x+getX(8.7,width),y+getY(12.7,height));
  segmentC[2]=new $j.classes.Point(x+getX(7.6,width),y+getY(11.9,height));
  segmentC[3]=new $j.classes.Point(x+getX(8.2,width),y+getY(7.7,height));
  //Segment D
  segmentD[0]=segmentD[4]=new $j.classes.Point(x+getX(7.4,width),y+getY(12.1,height));
  segmentD[1]=new $j.classes.Point(x+getX(8.4,width),y+getY(13,height));
  segmentD[2]=new $j.classes.Point(x+getX(1.3,width),y+getY(13,height));
  segmentD[3]=new $j.classes.Point(x+getX(2.2,width),y+getY(12.1,height));
  //Segment E
  segmentE[0]=segmentE[4]=new $j.classes.Point(x+getX(2.2,width),y+getY(11.8,height));
  segmentE[1]=new $j.classes.Point(x+getX(1,width),y+getY(12.7,height));
  segmentE[2]=new $j.classes.Point(x+getX(1.7,width),y+getY(7.2,height));
  segmentE[3]=new $j.classes.Point(x+getX(2.8,width),y+getY(7.7,height));
  //Segment F
  segmentF[0]=segmentF[4]=new $j.classes.Point(x+getX(3,width),y+getY(6.4,height));
  segmentF[1]=new $j.classes.Point(x+getX(1.8,width),y+getY(6.8,height));
  segmentF[2]=new $j.classes.Point(x+getX(2.6,width),y+getY(1.3,height));
  segmentF[3]=new $j.classes.Point(x+getX(3.6,width),y+getY(2.2,height));
  //Segment G
  segmentG[0]=segmentG[6]=new $j.classes.Point(x+getX(2,width),y+getY(7,height));
  segmentG[1]=new $j.classes.Point(x+getX(3.1,width),y+getY(6.5,height));
  segmentG[2]=new $j.classes.Point(x+getX(8.3,width),y+getY(6.5,height));
  segmentG[3]=new $j.classes.Point(x+getX(9,width),y+getY(7,height));
  segmentG[4]=new $j.classes.Point(x+getX(8.2,width),y+getY(7.5,height));
  segmentG[5]=new $j.classes.Point(x+getX(2.9,width),y+getY(7.5,height));
  //Segment DP
  // Draw Segments Outline
  this.fillStyle=outlineColor.toARGBString();
  this.strokeStyle=outlineColor.toARGBString();
  this.drawPolygon(segmentA);
  this.drawPolygon(segmentB);
  this.drawPolygon(segmentC);
  this.drawPolygon(segmentD);
  this.drawPolygon(segmentE);
  this.drawPolygon(segmentF);
  this.drawPolygon(segmentG);
  // Fill Segments
  this.fillStyle=fillColor.toARGBString();
  this.strokeStyle=fillColor.toARGBString();
  //Fill SegmentA
  if ([0,2,3,5,6,7,8,9].indexOf(value)>-1) this.drawPolygon(segmentA);
  //Fill SegmentB
  if ([0,1,2,3,4,7,8,9].indexOf(value)>-1) this.drawPolygon(segmentB);
  //Fill SegmentC
  if ([0,1,3,4,5,6,7,8,9].indexOf(value)>-1) this.drawPolygon(segmentC);
  //Fill SegmentD
  if ([0,2,3,5,6,8,9].indexOf(value)>-1) this.drawPolygon(segmentD);
  //Fill SegmentE
  if ([0,2,6,8].indexOf(value)>-1) this.drawPolygon(segmentE);
  //Fill SegmentF
  if ([0,4,5,6,7,8,9].indexOf(value)>-1) this.drawPolygon(segmentF);
  //Fill SegmentG
  if ([2,3,4,5,6,8,9,-1].indexOf(value)>-1) this.drawPolygon(segmentG);
};
CanvasRenderingContext2D.prototype.drawReflection=function CanvasRenderingContext2D_drawReflection(canvas,object) {
  var h=(object._owner.height*object.length),c,ctx;
  c=$j.tools.newCanvas();
  c.width=object._owner.width;
  c.height=h;
  ctx=c.getContext("2d");
  ctx.save();
  ctx.translate(0,object._owner.height-1);
  ctx.scale(1,-1);
  ctx.drawImage(canvas,0,0);
  ctx.restore();
  ctx.globalCompositeOperation=$j.types.canvas.globalCompositeOperations.DESTINATIONOUT;
  var gradient=ctx.createLinearGradient(0,0,0,h);
  gradient.addColorStop(1,'white');
  gradient.addColorStop(0,'rgba(255,255,255,'+object.opacity+')');
  ctx.fillStyle=gradient;
  ctx.fillRect(0,0,object._owner.width,h*2);
  this.drawImage(c,0,object._owner.height+object.offset);
};
CanvasRenderingContext2D.prototype.setMatrix=function CanvasRenderingContext2D_setMatrix(mat){
  if (!(mat instanceof $j.classes.Matrix)) return;
  this.setTransform(mat.m11,mat.m12,mat.m21,mat.m22,mat.m31,mat.m32);
};
CanvasRenderingContext2D.prototype._restore=CanvasRenderingContext2D.prototype.restore;
CanvasRenderingContext2D.prototype.restore=function CanvasRenderingContext2D_restore() {
  $j.numRestore++;
  this._restore();
  this.borderWidth=this.lineWidth;
};
CanvasRenderingContext2D.prototype._save=CanvasRenderingContext2D.prototype.save;
CanvasRenderingContext2D.prototype.save=function CanvasRenderingContext2D_save() {
  $j.numSave++;
  this._save();
};
CanvasRenderingContext2D.prototype.floodFill=function CanvasRenderingContext2D_floodFill(x,y,color) {
  // if values are not set just exit
  if(!x || !y || !color) { return true; }
 
  var width = this.canvas.width,
      height = this.canvas.height,
      image = this.getImageData(0, 0, width, height),
      imageData = image.data,
      pixelStack = [[x, y]],
      px1, newPos, pixelPos, reachLeft, reachRight, colorTemp;
 
  function _getPixel(pixelPos) {
    return {r:imageData[pixelPos], g:imageData[pixelPos+1], b:imageData[pixelPos+2], a:imageData[pixelPos+3]};
  }
 
  function _setPixel(pixelPos) {
    imageData[pixelPos] = color.r;
    imageData[pixelPos+1] = color.g;
    imageData[pixelPos+2] = color.b;
    imageData[pixelPos+3] = color.a;
  }
 
  function _comparePixel(px2) {
    return (px1.r === px2.r && px1.g === px2.g && px1.b === px2.b && px1.a === px2.a);
  }
 
  // get pixel at x/y position
  px1 = _getPixel(((y * width) + x) * 4);
 
  // quick way to get formatted rgba color
  colorTemp =this.canvas.style.color;
  this.canvas.style.color = color;
  color = this.canvas.style.color.match(/^rgba?\((.*)\);?$/)[1].split(',');
  this.canvas.style.color = colorTemp;
 
  color = {
    r: parseInt(color[0], 10),
    g: parseInt(color[1], 10),
    b: parseInt(color[2], 10),
    a: parseInt(color[3] || 255, 10)
  };
 
  // if pixel and color the same do nothing
  if (_comparePixel(color)) { return true; }
 
  while (pixelStack.length) {
    newPos = pixelStack.pop();
 
    pixelPos = (newPos[1]*width + newPos[0]) * 4;
    while(newPos[1]-- >= 0 && _comparePixel(_getPixel(pixelPos))) {
      pixelPos -= width * 4;
    }
       
    pixelPos += width * 4;
    ++newPos[1];
    reachLeft = false;
    reachRight = false;
       
    while (newPos[1]++ < height-1 && _comparePixel(_getPixel(pixelPos))) {
      _setPixel(pixelPos);
 
      if (newPos[0] > 0) {
        if (_comparePixel(_getPixel(pixelPos - 4))) {
          if (!reachLeft) {
            pixelStack.push([newPos[0] - 1, newPos[1]]);
            reachLeft = true;
          }
        }
        else if(reachLeft) {
          reachLeft = false;
        }
      }
       
      if (newPos[0] < width-1) {
        if (_comparePixel(_getPixel(pixelPos + 4))) {
          if (!reachRight) {
            pixelStack.push([newPos[0] + 1, newPos[1]]);
            reachRight = true;
          }
        }
        else if(reachRight) {
          reachRight = false;
        }
      }
           
      pixelPos += width * 4;
    }
  }
 
  this.putImageData(image, 0, 0);
};
CanvasRenderingContext2D.prototype.drawStar=function CanvasRenderingContext2D_drawStar(r,comp,clip) {
  var w2,h2;
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  w2=r.width/2;
  h2=r.height/2;
  this.beginPath();
  this.moveTo(w2,0);
  this.lineTo(r.width*0.375,r.height*0.4);
  this.lineTo(r.left, r.height*0.4);
  this.lineTo(r.width*0.3,r.height*0.625);
  this.lineTo(r.width*0.2,r.height);
  this.lineTo(r.width*0.5,r.height*0.725);
  this.lineTo(r.width*0.8,r.height);
  this.lineTo(r.width*0.7,r.height*0.625);
  this.lineTo(r.width,r.height*0.4);
  this.lineTo(r.width*0.625,r.height*0.4);
  this.lineTo(r.width*0.5,r.top);
  this.closePath();
  if (!clip){
    this.fill();
    this.stroke();
  } else this.clip();
};
CanvasRenderingContext2D.prototype.drawTrapezoid=function CanvasRenderingContext2D_drawTrapezoid(r,comp,clip) {
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  this.beginPath();
  this.moveTo(r.width*0.2,r.top);
  this.lineTo(r.top,r.height);
  this.lineTo(r.width,r.height);
  this.lineTo(r.width*0.8,r.top);
  this.lineTo(r.width*0.3,r.top);
  this.closePath();
  if (!clip){
    this.fill();
    this.stroke();
  } else this.clip();
};
CanvasRenderingContext2D.prototype.drawParallelogram=function CanvasRenderingContext2D_drawParallelogram(r,comp,clip) {
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  this.beginPath();
  this.moveTo(r.width*0.3,r.top);
  this.lineTo(r.left,r.height);
  this.lineTo(r.width*0.7,r.height);
  this.lineTo(r.width,r.top);
  this.lineTo(r.width*0.3,r.top);
  this.closePath(); 
  if (!clip){
    this.fill();
    this.stroke();
  } else this.clip();
};
CanvasRenderingContext2D.prototype.drawNinjaStar=function CanvasRenderingContext2D_drawNinjaStar(r,comp,clip) {
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  this.beginPath();
  this.moveTo(r.width*0.5,r.top);
  this.lineTo(r.width*0.35,r.height*0.35);
  this.lineTo(r.left,r.height*0.5);
  this.lineTo(r.width*0.35,r.height*0.65);
  this.lineTo(r.width*0.5,r.height);
  this.lineTo(r.width*0.65,r.height*0.65);
  this.lineTo(r.width,r.height*0.5);
  this.lineTo(r.width*0.65,r.height*0.35);
  this.lineTo(r.width*0.5,r.top);
  this.closePath();  
  if (!clip){
    this.fill();
    this.stroke();
  } else this.clip();
};
CanvasRenderingContext2D.prototype.drawRegularPolygon=function CanvasRenderingContext2D_drawRegularPolygon(r,comp,clip) {
  var w2,h2,size,i;
  if (!comp.borderDash) comp.borderDash=$j.types.canvas.strokeDashs.SOLID;
  if (this.useNativeDash&&!$j.tools.isNull(comp.borderDash)) this.setDash(comp.borderDash);
  w2=r.width/2;
  h2=r.height/2;
  size=(comp.width>comp.height?comp.height:comp.width)/2;
  this.beginPath();
  this.moveTo(w2+size*$j.cos(0),h2+size*$j.sin(0));
  for (i=1;i<=comp.numberOfSides;i++) {
    this.lineTo(w2+size*$j.cos(i*2*Math.PI/comp.numberOfSides),h2+size*$j.sin(i*2*Math.PI/comp.numberOfSides));
  }
  if (!clip){
    this.fill();
    this.stroke();
  } else this.clip();
};
CanvasRenderingContext2D.prototype.drawSpark=function(data) {
  var type;
  if ($j.tools.isNull(data)) return;
  if (data.values.length===0) return;
  type=data.type;
  if ($j.tools.isNull(type)) type=$j.types.canvas.sparkLinesTypes.LINE;
  this.save();
  this.translate(0.5,0.5);
  switch (type) {
    case $j.types.canvas.sparkTypes.LINE:
      this.drawSparkLine(data);
      break;
    case $j.types.canvas.sparkTypes.BAR:
      this.translate(-0.5,-0.5);
      this.drawSparkBar(data);
      break;
    case $j.types.canvas.sparkTypes.PIE:
      this.drawSparkPie(data);
      break;
    case $j.types.canvas.sparkTypes.BOXPLOT:
      this.drawSparkBoxPlot(data);
      break;
  }
  this.restore();
};
CanvasRenderingContext2D.prototype.drawSparkLine=function(data) {
  var color,minColor,maxColor,height,width,i=0,l,maxy,miny,maxx,minx,y,x,rangex,rangey,xvalues=[],yvalues=[],path=[],filledColor;
  color=data.color;
  minColor=data.minColor;
  maxColor=data.maxColor;
  filledColor=data.filledColor;
  if ($j.tools.isNull(color)) color="black";
  if ($j.tools.isNull(minColor)) minColor="black";
  if ($j.tools.isNull(maxColor)) maxColor="black";
  height=this.canvas.height;
  width=this.canvas.width;
  l=data.values.length;
  for (;i<l;i++) {
    xvalues.push(i);
    yvalues.push(~~data.values[i]);
  }
  maxy=Math.max.apply(Math,yvalues);
  miny=Math.min.apply(Math,yvalues);
  maxx=Math.max.apply(Math,xvalues);
  minx=Math.min.apply(Math,xvalues);
  rangex=maxx-minx===0?1:maxx-minx;
  rangey=maxy-miny===0?1:maxy-miny;
  yvallast=yvalues.length-1;
  height-=3;
  for (i=0;i<l;i++) {
    x=xvalues[i];
    y=yvalues[i];
    xpos=2+$j.round((x-minx)*(width/rangex));
    if (y<miny) y=miny;
    if (y>maxy) y=maxy;
    if (path.length===0) {
      path.push({"x":xpos,"y":height+2});
    }
    path.push({"x":xpos,"y":2+$j.round(height-(height*((y-miny)/rangey)))});
  }
  if (path.length>2) {
    path[0] = {"x":path[0].x,"y":path[1].y};
  }
  l=path.length;
  if (!$j.tools.isNull(filledColor)) {
    this.fillStyle=filledColor;
    this.beginPath();
    this.moveTo(path[path.length-1].x,path[path.length-1].y);
    this.lineTo(path[path.length-1].x,height+2);
    this.lineTo(0,height+2);
    this.lineTo(0,path[0].y);
    for (i=0;i<l;i++) {
      this.lineTo(path[i].x,path[i].y);
    }
    this.fill();
  }
  this.strokeStyle=color;
  this.beginPath();
  this.moveTo(path[0].x,path[0].y);
  for (i=1;i<l;i++) {
    this.lineTo(path[i].x,path[i].y);
  }
  this.stroke();
};
CanvasRenderingContext2D.prototype.drawSparkBar=function(data) {
  var height,width,l,max,min,yOrg,barWidth,minColor,maxColor,offset=0;
  minColor=data.minColor;
  maxColor=data.maxColor;
  height=this.canvas.height;
  width=this.canvas.width;
  l=data.values.length;
  max=Math.max.apply(Math,data.values);
  min=Math.min.apply(Math,data.values);
  barWidth=~~((width-l)/l);
  offset=~~((width-(barWidth*l)-(l-1))/2)
  rangeHeight=height/(max-min);
  if (min<0) {
    yOrg=~~(max*rangeHeight);
  } else yOrg=height;
  i=0;
  x=0;
  this.translate(offset,0);
  for (;i<l;i++) {
    if (data.values[i]>=0) this.fillStyle=maxColor;
    else this.fillStyle=minColor;
    y=~~(data.values[i]*rangeHeight);
    if (yOrg<height) {
      if (data.values[i]<0) this.fillRect(x,yOrg,barWidth,$j.abs(y));
      else this.fillRect(x,yOrg-y,barWidth,y);
    } else {
      this.fillRect(x,height-y,barWidth,y);
    }
    x+=barWidth+1;
  }
};
CanvasRenderingContext2D.prototype.drawSparkPie=function(data) {
  var height,width,l,circle,radius,next,total,end,start,colors;
  colors=data.colors;
  colors=colors.split(",");
  height=this.canvas.height;
  width=this.canvas.width;
  l=data.values.length;
  radius=Math.floor(Math.min(width,height-1)/2);
  circle=2*Math.PI;
  next=0;
  total=i=0;
  for (;i<l;i++) total+=data.values[i];
  this.translate(~~((width-radius)/2),0);
  for (i=l;i--;) {
    if (data.values[i]!==0) {
      for (x=0;x<l;x++) {
        start=next;
        end=next;
        if (total>0) {
          end=next+(circle*(data.values[x]/total));
        }
        if (x===i) {
          this.fillStyle=colors[x%colors.length];
          this.beginPath();
          this.moveTo(radius,radius);
          this.arc(radius,radius,radius,start,end,false);
          this.lineTo(radius,radius);
          this.closePath();
          this.fill();
        }
        next=end;
      }
    }
  }
};
CanvasRenderingContext2D.prototype.drawSparkBoxPlot=function(data) {
  var height,width,l,loutlier,lwhisker,q1,q2,q3,rwhisker,routlier,iqr,left=0,unitSize,size,minValue,maxValue,quartile=function(values,q) {
    var vl;
    if (q===2) {
      vl=$j.floor(values.length/2);
      return values.length%2?values[vl]:(values[vl-1]+values[vl])/2;
    } else {
      if (values.length%2) { // odd
        vl=(values.length*q+q)/4;
        return vl%1?(values[$j.floor(vl)]+values[$j.floor(vl)-1])/2:values[vl-1];
      } else { //even
        vl=(values.length*q+2)/4;
        return vl%1?(values[$j.floor(vl)]+values[$j.floor(vl)-1])/2:values[vl-1];
      }
    }
  };
  minValue=$j.tools.isNull(data.chartRangeMin)?Math.min.apply(Math,data.values):data.chartRangeMin;
  maxValue=$j.tools.isNull(data.chartRangeMax)?Math.max.apply(Math,data.values):data.chartRangeMax;
  if ($j.tools.isNull(data.boxLineColor)) data.boxLineColor="black";
  if ($j.tools.isNull(data.boxFillColor)) data.boxFillColor="#C0D0F0";
  if ($j.tools.isNull(data.whiskerColor)) data.whiskerColor="black";
  if ($j.tools.isNull(data.outlierLineColor)) data.outlierLineColor="#303030";
  if ($j.tools.isNull(data.outlierFillColor)) data.outlierFillColor="#F0F0F0";
  if ($j.tools.isNull(data.medianColor)) data.medianColor="red";
  if ($j.tools.isNull(data.targetColor)) data.targetColor="#40A020";
  if ($j.tools.isNull(data.spotRadius)) data.spotRadius=1.5;
  if ($j.tools.isNull(data.outlierIQR)) data.outlierIQR=1.5;
  if ($j.tools.isNull(data.raw)) data.raw=false;
  if ($j.tools.isNull(data.showOutliers)) data.showOutliers=false;
  height=this.canvas.height;
  width=this.canvas.width;
  l=data.values.length;
  if (data.raw) {
    if (data.showOutliers&&data.values.length>5) {
      loutlier=data.values[0];
      lwhisker=data.values[1];
      q1=data.values[2];
      q2=data.values[3];
      q3=data.values[4];
      rwhisker=data.values[5];
      routlier=data.values[6];
    } else {
      lwhisker=data.values[0];
      q1=data.values[1];
      q2=data.values[2];
      q3=data.values[3];
      rwhisker=data.values[4];
    }
  } else {
    data.values.sort(function(a,b) { return a-b; });
    q1=quartile(data.values,1);
    q2=quartile(data.values,2);
    q3=quartile(data.values,3);
    iqr=q3-q1;
    if (data.showOutliers) {
      lwhisker=rwhisker=null;
      for (i=0;i<l;i++) {
        if ($j.tools.isNull(lwhisker)&&data.values[i]>q1-(iqr*data.outlierIQR)) {
          lwhisker=data.values[i];
        }
        if (data.values[i]<q3+(iqr*data.outlierIQR)) {
          rwhisker=data.values[i];
        }
      }
      loutlier=data.values[0];
      routlier=data.values[l-1];
    } else {
      lwhisker=data.values[0];
      rwhisker=data.values[l-1];
    }
  }
  unitSize=width/(maxValue-minValue+1);
  if (data.showOutliers) {
    left=$j.ceil(data.spotRadius);
    width-=2*$j.ceil(data.spotRadius);
    unitSize=width/(maxValue-minValue+1);
    if (loutlier<lwhisker) {
      this.strokeStyle=data.outlierLineColor;
      this.fillStyle=data.outlierFillColor;
      this.beginPath();
      this.arc((loutlier-minValue)*unitSize+left,height/2,data.spotRadius,0,Math.PI*2,true);
      this.fill();
      this.stroke();
    }
    if (routlier>rwhisker) {
      this.strokeStyle=data.outlierLineColor;
      this.fillStyle=data.outlierFillColor;
      this.beginPath();
      this.arc((routlier-minValue)*unitSize+left,height/2,data.spotRadius,0,Math.PI*2,true);
      this.fill();
      this.stroke();
    }
  }

  // box
  this.strokeStyle=data.boxLineColor;
  this.fillStyle=data.boxFillColor;
  this.fillRect($j.round((q1-minValue)*unitSize+left),$j.round(height*0.1),$j.round((q3-q1)*unitSize),$j.round(height*0.8));
  this.strokeRect($j.round((q1-minValue)*unitSize+left),$j.round(height*0.1),$j.round((q3-q1)*unitSize),$j.round(height*0.8));
  // left whisker
  this.strokeStyle=data.lineColor;
  this.beginPath();
  this.moveTo(~~((lwhisker-minValue)*unitSize+left),~~(height/2));
  this.lineTo(~~((q1-minValue)*unitSize+left),~~(height/2));
  this.stroke();
  this.strokeStyle=data.whiskerColor;
  this.beginPath();
  this.moveTo(~~((lwhisker-minValue)*unitSize+left),~~(height/4));
  this.lineTo(~~((lwhisker-minValue)*unitSize+left),~~(height-height/4));
  this.stroke();
  // right whisker
  this.strokeStyle=data.lineColor;
  this.beginPath();
  this.moveTo(~~((rwhisker-minValue)*unitSize+left),~~(height/2));
  this.lineTo(~~((q3-minValue)*unitSize+left),~~(height/2));
  this.stroke();
  this.strokeStyle=data.whiskerColor;
  this.beginPath();
  this.moveTo(~~((rwhisker-minValue)*unitSize+left),~~(height/4));
  this.lineTo(~~((rwhisker-minValue)*unitSize+left),~~(height-height/4));
  this.stroke();
  // median line
  this.strokeStyle=data.medianColor;
  this.beginPath();
  this.moveTo(~~((q2-minValue)*unitSize+left),~~(height*0.1));
  this.lineTo(~~((q2-minValue)*unitSize+left),~~(height*0.9));
  this.stroke();
  if (data.target) {
    size=Math.ceil(data.spotRadius);
    this.strokeStyle=data.targetColor;
    this.beginPath();
    this.moveTo(~~((data.target-minValue)*unitSize+left),~~((height/2)-size));
    this.lineTo(~~((data.target-minValue)*unitSize+left),~~((height/2)+size));
    this.stroke();
    this.strokeStyle=data.targetColor;
    this.beginPath();
    this.moveTo(~~((data.target-minValue)*unitSize+left-size),~~(height/2));
    this.lineTo(~~((data.target-minValue)*unitSize+left+size),~~(height/2));
    this.stroke();
  }
};
//#endregion
})();