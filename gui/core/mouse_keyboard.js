(function(){
  //#region Properties
  $j.types.mouseButtons={};
  $j.types.mouseButtons.NONE="none";
  $j.types.mouseButtons.LEFT="left";
  $j.types.mouseButtons.RIGHT="right";
  $j.types.mouseButtons.MIDDLE="middle";
  $j.types.mouseWheelDirs={};
  $j.types.mouseWheelDirs.NONE="none";
  $j.types.mouseWheelDirs.UP="up";
  $j.types.mouseWheelDirs.DOWN="down";
  $j.types.keybordEvents={};
  $j.types.keybordEvents.NONE="none";
  $j.types.keybordEvents.UP="keyup";
  $j.types.keybordEvents.DOWN="keydown";
  $j.types.keybordEvents.PRESS="keypress";
  $j.types.touchEvents={};
  $j.types.touchEvents.START="touchstart";
  $j.types.touchEvents.MOVE="touchmove";
  $j.types.touchEvents.END="touchend";
  $j.types.touchEvents.CANCEL="touchcancel";
  $j.types.pointerEvents={};
  $j.types.pointerEvents.DOWN="pointerdown";
  $j.types.pointerEvents.MOVE="pointermove";
  $j.types.pointerEvents.UP="pointerup";
  $j.types.pointerEvents.CANCEL="pointercancel";
  $j.types.MSPointerEvents={};
  $j.types.MSPointerEvents.DOWN="MSPointerDown";
  $j.types.MSPointerEvents.MOVE="MSPointerMove";
  $j.types.MSPointerEvents.UP="MSPointerUp";
  $j.types.MSPointerEvents.CANCEL="MSPointerCancel";
  $j.types.mouseEvents={};
  $j.types.mouseEvents.EVENT="mouseevent";
  $j.types.mouseEvents.MOVE="mousemove";
  $j.types.mouseEvents.DOWN="mousedown";
  $j.types.mouseEvents.UP="mouseup";
  $j.types.mouseEvents.CANCEL="mousecancel";
  $j.types.mouseEvents.WHEEL="mousewheel";
  $j.types.mouseEvents.DBLCLICK="mousedblclick";
  $j.types.mouseEvents.DOMSCROLL="DOMMouseScroll";
  $j.types.mouseEvents.OUT="mouseout";
  $j.types.mouseEvents.OVER="mouseover";
  $j.types.mouseEvents.ENTER="mouseenter";
  $j.types.mouseEvents.LEAVE="mouseleave";
  $j.types.mouseEvents.CLICK="click";
  //#endregion
  //#region VKeysCodes
  $j.types.VKeysCodes={};
  $j.types.VKeysCodes.VK_NONE=0x00;
  $j.types.VKeysCodes.VK_LBUTTON=0x01; //Left mouse button
  $j.types.VKeysCodes.VK_RBUTTON=0x02; //Right mouse button
  $j.types.VKeysCodes.VK_CANCEL=0x03; //Control-break processing
  $j.types.VKeysCodes.VK_MBUTTON=0x04; //Middle mouse button (three-button mouse)
  $j.types.VKeysCodes.VK_BACKSPACE=0x08; //BACKSPACE key
  $j.types.VKeysCodes.VK_TAB=0x09; //TAB key
  $j.types.VKeysCodes.VK_CLEAR=0x0C; //CLEAR key
  $j.types.VKeysCodes.VK_RETURN=0x0D; //ENTER key
  $j.types.VKeysCodes.VK_SHIFT=0x10; //SHIFT key
  $j.types.VKeysCodes.VK_CONTROL=0x11; //CTRL key
  $j.types.VKeysCodes.VK_ALT=0x12; //ALT key
  $j.types.VKeysCodes.VK_PAUSE=0x13; //PAUSE key
  $j.types.VKeysCodes.VK_CAPITAL=0x14; //CAPS LOCK key
  $j.types.VKeysCodes.VK_ESCAPE=0x1B; //ESC key
  $j.types.VKeysCodes.VK_SPACE=0x20; //SPACEBAR
  $j.types.VKeysCodes.VK_PRIOR=0x21; //PAGE UP key
  $j.types.VKeysCodes.VK_NEXT=0x22; //PAGE DOWN key
  $j.types.VKeysCodes.VK_END=0x23; //END key
  $j.types.VKeysCodes.VK_HOME=0x24; //HOME key
  $j.types.VKeysCodes.VK_LEFT=0x25; //LEFT ARROW key
  $j.types.VKeysCodes.VK_UP=0x26; //UP ARROW key
  $j.types.VKeysCodes.VK_RIGHT=0x27; //RIGHT ARROW key
  $j.types.VKeysCodes.VK_DOWN=0x28; //DOWN ARROW key
  $j.types.VKeysCodes.VK_SELECT=0x29; //SELECT key
  $j.types.VKeysCodes.VK_PRINT=0x2A; //PRINT key
  $j.types.VKeysCodes.VK_EXECUTE=0x2B; //EXECUTE key
  $j.types.VKeysCodes.VK_SNAPSHOT=0x2C; //PRINT SCREEN key
  $j.types.VKeysCodes.VK_INSERT=0x2D; //INS key
  $j.types.VKeysCodes.VK_DELETE=0x2E; //DEL key
  $j.types.VKeysCodes.VK_HELP=0x2F; //HELP key
  $j.types.VKeysCodes.VK_0=0x30; //0 key
  $j.types.VKeysCodes.VK_1=0x31; //1 key
  $j.types.VKeysCodes.VK_2=0x32; //2 key
  $j.types.VKeysCodes.VK_3=0x33; //3 key
  $j.types.VKeysCodes.VK_4=0x34; //4 key
  $j.types.VKeysCodes.VK_5=0x35; //5 key
  $j.types.VKeysCodes.VK_6=0x36; //6 key
  $j.types.VKeysCodes.VK_7=0x37; //7 key
  $j.types.VKeysCodes.VK_8=0x38; //8 key
  $j.types.VKeysCodes.VK_9=0x39; //9 key
  $j.types.VKeysCodes.VK_TWOPOINT=0x3A; //: key
  $j.types.VKeysCodes.VK_SEMICOLON=0x3B; //; key
  $j.types.VKeysCodes.VK_LESS_THAN=0x3C; //< key
  $j.types.VKeysCodes.VK_EQUAL=0x3D; //= key
  $j.types.VKeysCodes.VK_GREATER_THAN=0x3E; //> key
  $j.types.VKeysCodes.VK_QUESTION_MARK=0x3F; //? key
  $j.types.VKeysCodes.VK_AT=0x40; //@ key
  $j.types.VKeysCodes.VK_A=0x41; //A key
  $j.types.VKeysCodes.VK_B=0x42; //B key
  $j.types.VKeysCodes.VK_C=0x43; //C key
  $j.types.VKeysCodes.VK_D=0x44; //D key
  $j.types.VKeysCodes.VK_E=0x45; //E key
  $j.types.VKeysCodes.VK_F=0x46; //F key
  $j.types.VKeysCodes.VK_G=0x47; //G key
  $j.types.VKeysCodes.VK_H=0x48; //H key
  $j.types.VKeysCodes.VK_I=0x49; //I key
  $j.types.VKeysCodes.VK_J=0x4A; //J key
  $j.types.VKeysCodes.VK_K=0x4B; //K key
  $j.types.VKeysCodes.VK_L=0x4C; //L key
  $j.types.VKeysCodes.VK_M=0x4D; //M key
  $j.types.VKeysCodes.VK_N=0x4E; //N key
  $j.types.VKeysCodes.VK_O=0x4F; //O key
  $j.types.VKeysCodes.VK_P=0x50; //P key
  $j.types.VKeysCodes.VK_Q=0x51; //Q key
  $j.types.VKeysCodes.VK_R=0x52; //R key
  $j.types.VKeysCodes.VK_S=0x53; //S key
  $j.types.VKeysCodes.VK_T=0x54; //T key
  $j.types.VKeysCodes.VK_U=0x55; //U key
  $j.types.VKeysCodes.VK_V=0x56; //V key
  $j.types.VKeysCodes.VK_W=0x57; //W key
  $j.types.VKeysCodes.VK_X=0x58; //X key
  $j.types.VKeysCodes.VK_Y=0x59; //Y key
  $j.types.VKeysCodes.VK_Z=0x5A; //Z key
  $j.types.VKeysCodes.VK_LAPP=0x5B; //Left App key
  $j.types.VKeysCodes.VK_RAPP=0x5C; //Right App key
  $j.types.VKeysCodes.VK_MENU=0x5D; //Menu key
  //Object.defineProperty($j.types.VKeysCodes.VK_APP=0x5E;
  //Object.defineProperty($j.types.VKeysCodes.VK_APP=0x5F;
  $j.types.VKeysCodes.VK_NUMPAD0=0x60; //Numeric keypad 0 key
  $j.types.VKeysCodes.VK_NUMPAD1=0x61; //Numeric keypad 1 key
  $j.types.VKeysCodes.VK_NUMPAD2=0x62; //Numeric keypad 2 key
  $j.types.VKeysCodes.VK_NUMPAD3=0x63; //Numeric keypad 3 key
  $j.types.VKeysCodes.VK_NUMPAD4=0x64; //Numeric keypad 4 key
  $j.types.VKeysCodes.VK_NUMPAD5=0x65; //Numeric keypad 5 key
  $j.types.VKeysCodes.VK_NUMPAD6=0x66; //Numeric keypad 6 key
  $j.types.VKeysCodes.VK_NUMPAD7=0x67; //Numeric keypad 7 key
  $j.types.VKeysCodes.VK_NUMPAD8=0x68; //Numeric keypad 8 key
  $j.types.VKeysCodes.VK_NUMPAD9=0x69; //Numeric keypad 9 key
  $j.types.VKeysCodes.VK_MUTLIPLY=0x6A; //Numeric keypad * key
  $j.types.VKeysCodes.VK_ADD=0x6B; //Numeric keypad + key
  $j.types.VKeysCodes.VK_SEPARATOR=0x6C; //Separator key
  $j.types.VKeysCodes.VK_SUBTRACT=0x6D; //Subtract key
  $j.types.VKeysCodes.VK_DECIMAL=0x6E; //Decimal key
  $j.types.VKeysCodes.VK_DIVIDE=0x6F; //Divide key
  $j.types.VKeysCodes.VK_F1=0x70; //F1 key
  $j.types.VKeysCodes.VK_F2=0x71; //F2 key
  $j.types.VKeysCodes.VK_F3=0x72; //F3 key
  $j.types.VKeysCodes.VK_F4=0x73; //F4 key
  $j.types.VKeysCodes.VK_F5=0x74; //F5 key
  $j.types.VKeysCodes.VK_F6=0x75; //F6 key
  $j.types.VKeysCodes.VK_F7=0x76; //F7 key
  $j.types.VKeysCodes.VK_F8=0x77; //F8 key
  $j.types.VKeysCodes.VK_F9=0x78; //F9 key
  $j.types.VKeysCodes.VK_F10=0x79; //F10 key
  $j.types.VKeysCodes.VK_F11=0x7A; //F11 key
  $j.types.VKeysCodes.VK_F12=0x7B; //F12 key
  $j.types.VKeysCodes.VK_NUMLOCK=0x90; //NUM LOCK key
  $j.types.VKeysCodes.VK_SCROLL=0x91; //SCROLL LOCK key
  $j.types.VKeysCodes.VK_CARET=0xA0; //^ key
  //Object.defineProperty($j.types.VKeysCodes.VK_RSHIFT=0xA1; //Right SHIFT key
  //Object.defineProperty($j.types.VKeysCodes.VK_LCONTROL=0xA2; //Left CONTROL key
  //Object.defineProperty($j.types.VKeysCodes.VK_RCONTROL=0xA3; //Right CONTROL key
  $j.types.VKeysCodes.VK_DOLLAR=0xA4; //$ key
  $j.types.VKeysCodes.VK_UACCENT=0xA5; //ù key
  $j.types.VKeysCodes.VK_ASTERIX=0xAA; //* key
  $j.types.VKeysCodes.VK_COLON=0xBC; //, key
  $j.types.VKeysCodes.VK_OEM_MINUS=0xBD; //MINUS
  $j.types.VKeysCodes.VK_POINT=0xBE; //. key
  $j.types.VKeysCodes.VK_SLASH=0xBF; /// key
  $j.types.VKeysCodes.VK_192=0xC0; //` key
  $j.types.VKeysCodes.VK_OPENBRACKET=0xDB; //[ key
  $j.types.VKeysCodes.VK_BACKSLASH=0xDC; //\ key
  $j.types.VKeysCodes.VK_CLOSEBRACKET=0xDD; //] key
  //Object.defineProperty($j.types.VKeysCodes.addProperty("VK_CLOSEBRACKET",null,null,true,false,false,0xDE); //] key
  $j.types.VKeysCodes.VK_PLAY=0xFA; //Play key
  $j.types.VKeysCodes.VK_ZOOM=0xFB; //Zoom key
  //#endregion
  //#region Mouse
  var Mouse=Class.extend({
    _ClassName: "Mouse",
    init: function() {
      this.target=new $j.classes.Point;
      this.screen=new $j.classes.Point;
      this.button=$j.types.mouseButtons.NONE;
      this.document=new $j.classes.Point;
      this.window=new $j.classes.Point;
      this.wheelDir=$j.types.mouseWheelDirs.NONE;
      this.wheelDelta=0;
      this.eventType=String.empty;
      this.event=null;
    },
    //#region Methods
    getMouseInfos: function Mouse_getMouseInfos(mouseEventArg){
      var style,borderLeftWidth=0,borderTopWidth=0,rect={top:0,left:0};
      this.event=mouseEventArg;
      this.eventType=mouseEventArg.type;
      this.screen.setValues(mouseEventArg.screenX,mouseEventArg.screenY);
      this.window.setValues(mouseEventArg.clientX,mouseEventArg.clientY);
      this.document.setValues(mouseEventArg.pageX,mouseEventArg.pageY);
      this.target.setValues(mouseEventArg.layerX?mouseEventArg.layerX:mouseEventArg.offsetX,mouseEventArg.layerY?mouseEventArg.layerY:mouseEventArg.offsetY);
      if ($j.isDOMRenderer) {
        if (mouseEventArg.currentTarget!==$j.doc) {
          style=mouseEventArg.currentTarget.currentStyle||getComputedStyle(mouseEventArg.currentTarget);
          if (!$j.tools.isNull(style)) {
            borderLeftWidth=parseInt(style.borderLeftWidth,10);
            borderTopWidth=parseInt(style.borderTopWidth,10);
            rect=mouseEventArg.currentTarget.getBoundingClientRect();
          }
          this.target.setValues(mouseEventArg.clientX-borderLeftWidth-rect.left,mouseEventArg.clientY-borderTopWidth-rect.top);
        }
      }
      if (!$j.isMouseDown&&!$j.isDOMRenderer) this.button=$j.types.mouseButtons.NONE;
      else this.button=(mouseEventArg.which===1)?$j.types.mouseButtons.LEFT:((mouseEventArg.which===2)?$j.types.mouseButtons.MIDDLE:$j.types.mouseButtons.RIGHT);
      if ((mouseEventArg.type===$j.types.mouseEvents.WHEEL.toLowerCase()) || (mouseEventArg.type===$j.types.mouseEvents.DOMSCROLL)){
        //wheel 
        var delta=0;
        if (mouseEventArg.wheelDelta){
          delta=mouseEventArg.wheelDelta*0.0083333333333333;
          if ($j.browser.opera) delta=-delta;
        } else if (mouseEventArg.detail) delta=-mouseEventArg.detail*0.3333333333333333;
        if (delta!==0){
          if (delta<0) this.wheelDir=$j.types.mouseWheelDirs.DOWN;
          else this.wheelDir=$j.types.mouseWheelDirs.UP;
          this.wheelDelta=delta;
        } else {
          this.wheelDir=$j.types.mouseWheelDirs.NONE;
          this.wheelDelta=0;
        }
      }
      if (typeof $j.onGetMouseInfos===_const.FUNCTION) $j.onGetMouseInfos();
    },
    getWheelDetail: function Mouse_getWheelDetail(mouseEventArg){
      delta=mouseEventArg.wheelDelta?mouseEventArg.wheelDelta*0.0083333333333333:mouseEventArg.detail*0.3333333333333333;
      if ($j.browser.ie||$j.browser.chrome||$j.browser.safari||$j.browser.opera) delta=-delta;
      return delta;
    },
    stopEvent: function Mouse_stopEvent(mouseEventArg) {
      this.target.setValues(0,0);
      this.screen.setValues(0,0);
      this.button=$j.types.mouseButtons.NONE;
      this.document.setValues(0,0);
      this.window.setValues(0,0);
      this.wheelDir=$j.types.mouseWheelDirs.NONE;
      this.wheelDelta=0;
      mouseEventArg.stopPropagation();
      //mouseEventArg.preventDefault();

    }
    //#endregion
  });
  //#endregion
  //#region Keyboard
  var Keyboard=Class.extend({
    _ClassName: "Keyboard",
    init: function() {
      this.ctrl=false;
      this.alt=false;
      this.shift=false;
      this.meta=false;
      this.keyCode=$j.types.VKeysCodes.NONE;
      this.keyEvent=$j.types.keybordEvents.NONE;
      this.keyChar=String.empty;
      this.keyCodeTable=[];
      this.event=null;
      this.isNavigationKey=function() {
        return [$j.types.VKeysCodes.VK_BACKSPACE,
                $j.types.VKeysCodes.VK_PRIOR,
                $j.types.VKeysCodes.VK_NEXT,
                $j.types.VKeysCodes.VK_END,
                $j.types.VKeysCodes.VK_HOME,
                $j.types.VKeysCodes.VK_LEFT,
                $j.types.VKeysCodes.VK_UP,
                $j.types.VKeysCodes.VK_RIGHT,
                $j.types.VKeysCodes.VK_DOWN,
                $j.types.VKeysCodes.VK_INSERT,
                $j.types.VKeysCodes.VK_DELETE,
                $j.types.VKeysCodes.VK_LAPP,
                $j.types.VKeysCodes.VK_RAPP,
                $j.types.VKeysCodes.VK_MENU,
                $j.types.VKeysCodes.VK_RETURN
                ].indexOf(this.keyCode)>-1;
      };
      if ($j.browser.ff) {
        var c={32:" ",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:";",61:"=",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",
               76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",107:"+",109:"-",110:".",188:",",190:".",191:"/",192:"`",219:"[",
               220:"\\",221:"]",222:'"'};
        // à modifier avec getOwnPropertyNames
        for (var b in c) {
          if (c.hasOwnProperty(b)) {
            var d=c[b];
            this.keyCodeTable[d.charCodeAt(0)]=parseInt(b,10);
            if (d.toUpperCase() != d) this.keyCodeTable[d.toUpperCase().charCodeAt(0)]=parseInt(b,10);
          }
        }
      }
    },
    //#region Methods
    getKeyboardInfos: function Keyboard_getKeyboardInfos(keyboardEventArg){
      this.event=keyboardEventArg;
      this.ctrl=keyboardEventArg.ctrlKey;
      this.alt=keyboardEventArg.altKey;
      this.shift=keyboardEventArg.shiftKey;
      if (keyboardEventArg.type==="keypress") this.keyCode=(keyboardEventArg.charCode!==0)?keyboardEventArg.charCode:keyboardEventArg.keyCode;
      else this.keyCode=keyboardEventArg.keyCode;
      this.meta=keyboardEventArg.metaKey;
      if ($j.browser.ff&&(keyboardEventArg.type==="keypress")) {
        this.keyCode=keyboardEventArg.charCode!==0&&this.keyCodeTable[keyboardEventArg.charCode]?this.keyCodeTable[keyboardEventArg.charCode]:keyboardEventArg.keyCode;
        this.keyChar=keyboardEventArg.charCode!==0?String.fromCharCode(keyboardEventArg.charCode):String.empty;
      } else this.keyChar=String.fromCharCode(keyboardEventArg.which || keyboardEventArg.keyCode);
      if (!this.shift) this.keyChar=this.keyChar.toLowerCase();
      if (!$j.isKeyDown) this.keyEvent=$j.types.keybordEvents.NONE;
      else this.keyEvent=$j.types.keybordEvents.DOWN;
      if (typeof $j.onGetMouseInfos===_const.FUNCTION) $j.onGetMouseInfos();
    },
    stopEvent: function Keyboard_stopEvent() {
      this.event.cancelBubble=true;
      this.event.stopPropagation();
      this.event.preventDefault();
      this.ctrl=false;
      this.alt=false;
      this.shift=false;
      this.keyCode=false;
      this.keyEvent=$j.types.keybordEvents.NONE;
      this.keyChar=String.empty;
    }
    //#endregion
  });
  //#endregion
  //#region Touch
  //function Touch(){
  //  this.target=$j.classes.Point.create();
  //  this.screen=$j.classes.Point.create();
  //  this.document=$j.classes.Point.create();
  //}
  //p=Touch.prototype;
  //p.getTouchInfos=function(touchEventArg){
  //  //$j.stopEvent(touchEventArg);
  //  if (touchEventArg.touches!==undefined && touchEventArg.touches.length===1){// Only deal with one finger
  //    var touch=touchEventArg.touches[0];
  //    // Get the information for finger #1
  //    this.screen.setValues(touch.screenX,touch.screenY);
  //    this.window.setValues(touch.clientX,touch.clientY);
  //    this.document.setValues(touch.pageX,touch.pageY);
  //    this.target.setValues(touch.layerX?touch.layerX:touch.offsetX,touch.layerY?touch.layerY:touch.offsetY);
  //  }
  //}
  //Object.seal(Touch);
  //#endregion
  $j.mouse=new Mouse;
  $j.keyboard=new Keyboard;
})();