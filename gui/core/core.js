(function() {
  window.requestAnimationFrameRate=function(fps) {
    var period, starter, limit, jitter, maxFPS=60, frame=0;
    if (typeof fps!=='number') fps=maxFPS;
    else fps=Math.max(1,Math.min(maxFPS,fps));
    period=1000/fps;
    jitter=period*0.1;
    limit=period-jitter;
    function requestAnimationFrameAtFPS(renderFrameCallBack) {
      return (function() {
        var handle,rAF=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame;
        function renderer(time) {
          var lastPeriod;
          starter=starter||time;
          lastPeriod=time-starter;
          if (lastPeriod<limit) handle=rAF(renderer);
          else {
            renderFrameCallBack(lastPeriod);
            starter=time;
          }
        }
        handle=rAF(renderer);
        return function() {
          window.cancelAnimationFrame(handle);
        };
      })();
    }
    return requestAnimationFrameAtFPS;
  };
  window.cancelAnimationFrameRate = function(handle) {
    handle();
  };
  var initializing=false,fnTest=/xyz/.test(function() { xyz; })?/\b_inherited\b/:/.*/;

  // The base Class implementation (does nothing)
  this.Class=function() { };

  // Create a new Class that inherits from this class
  Class.extend=function(prop) {
    var _inherited=this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing=true;
    var prototype=new this();
    initializing=false;

    // Copy the properties over onto the new prototype
    for(var name in prop) {
      // Check if we're overwriting an existing function
      //if(name==="ClassName") continue;
      prototype[name]=typeof prop[name]=="function"&&
            typeof _inherited[name]=="function"&&fnTest.test(prop[name])?
            (function(name,fn) {
              return function() {
                var tmp=this._inherited;

                // Add a new ._super() method that is the same method
                // but on the super-class
                this._inherited=_inherited[name];

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret=fn.apply(this,arguments);
                this._inherited=tmp;

                return ret;
              };
            })(name,prop[name]):
            prop[name];
    }

    // The dummy class constructor
    eval("var F=function "+prop._ClassName+"() { if(!initializing&&this.init) this.init.apply(this,arguments);  }");
    F.prototype=prototype;
    F.prototype.constructor=Class;
    F.extend=arguments.callee;
    F.mixin=function(dest) {
      for (var k in this) {
        if (this.hasOwnProperty(k)) {
          dest[k]=this[k];
        }
      }
    };
    return F;
  };
  Object.prototype.indexOf=function Object_indexOf(prop) {
    var i=-1;
    for(var key in this) {
      if(this.hasOwnProperty(key)) {
        i++;
        if(this[key]===prop) break;
      }
    }
    return i;
  };
  //window.NULL=undefined;
  //#region JaGui
  var JaGui=Class.extend({
    _ClassName: "JaGui",
    init: function() {
      var _renderer="dom";
      this.classes=Classes;
      this.tools=new Tools();
      this.themes={};
      this.apps=new Apps();
      this.getRenderer=function() {
        return _renderer;
      };
      this.setRenderer=function(newValue) {
        if(typeof newValue!==_const.STRING) return;
        _renderer=newValue;
        if(_renderer!==$j.types.renderers.DOM) {
          this.css=new CSS2JSON().css;
          this.tools.events.bind(window,"resize",function() {
            var form;
            for(var i=0,l=$j.apps.applications.length;i<l;i++) {
              for(var j=0,l1=$j.apps.applications[i]._windows.length;j<l1;j++) {
                form=this.apps.applications[i]._windows[j];
                if(form.windowState===this.types.windowStates.MAXIMIZED) {
                  form.width=window.innerWidth;
                  form.height=window.innerHeight;
                  form.resize();
                }
              }
            }
          });
        }
      };
      this.isDOMRenderer=function() {
        return this.getRenderer()===$j.types.renderers.DOM;
      };
      this.isCANVASRenderer=function() {
        return this.getRenderer()===$j.types.renderers.CANVAS;
      };
      this.isWEBGLRenderer=function() {
        return this.getRenderer()===$j.types.renderers.WEBGL;
      };
      this.onGetMouseInfos=null;
      this.doc=null;
      this.clipboard=null;
      this.ready=null;
      this.rtStyle=null;
      this.defaultTheme="carbon";
      this.disableAnimation=false;
      this.isMouseDown=false;
      this.ghostWindow=null;
      this.dragWindow=null;
      this.windowZIndex=0;
      this.numRestore=0;
      this.numSave=0;
      this.templates={};
      this.looper=new Looper();
      this.currentCulture=null;
      this.cultures={};
      this.folders={"{BASE}":"JaGui-alpha","{GUI}":"gui/","{CORE}":"gui/core/","{COMPONENTS}":"gui/components/","{COMMON}":"gui/components/common/","{COLOR}":"gui/components/color/",
                    "{CONTAINERS}":"gui/components/containers/","{DATA}":"gui/components/data/","{EXTENDED}":"gui/components/extended/","{EXTRAS}":"gui/components/extras/",
                    "{LISTS}":"gui/components/lists/","{MENUS}":"gui/components/menus/","{TOOLBARS}":"gui/components/toolbars/","{NONVISUAL}":"gui/components/nonvisual/",
                    "{APPS}":"apps/","{DEMOS}":"demos/","{CULTURES}":"gui/cultures/","{CONTROLS}":"controls/","{CSS}":"css/","{THEMES}":"css/themes/","{IMAGES}":"images/",
                    "{EFFECTS}":"gui/effects/","{DIALOGS}":"gui/components/dialogs/"};
      //this.currentCulture=null;
    },
    //#region Methods
    start: function JaGui_init() {
      var language=window.navigator.userLanguage||window.navigator.language;
      if(language.indexOf("-")===-1) language=language+"-"+language.toUpperCase();
      this.currentCulture=language;
      this.tools.uses(this.folders["{CORE}"]+"geometry",
                      this.folders["{CORE}"]+"browser",
                      this.folders["{CORE}"]+"css",
                      this.folders["{CORE}"]+"types",
                      this.folders["{CORE}"]+"ext_array",
                      this.folders["{CORE}"]+"ext_string",
                      this.folders["{CORE}"]+"ext_math",
                      this.folders["{CORE}"]+"ext_date",
                      this.folders["{CORE}"]+"events",
                      this.folders["{CORE}"]+"convertion",
                      this.folders["{CORE}"]+"mouse_keyboard",
                      this.folders["{CORE}"]+"canvas",
                      this.folders["{CORE}"]+"classes",
                      this.folders["{CORE}"]+"colors",
                      this.folders["{CULTURES}"]+this.currentCulture);
      //this.renderer=0x183;
      $j.looper.setFPS(25);
      $j.doc=document;
      $j.doc.oncontextmenu=function() { return false; };
      $j.doc.addEventListener("DOMContentLoaded",
        function() {
          var logo,waiting,progressOuter,progressInner,text,ie=false;
          var match=navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
          if(match) ie=match.length>0;
          $j.tools.loadTheme($j.defaultTheme);
          if($j.renderer!==0x183) {
            $j.clipboard=$j.doc.createElement("textarea");
            $j.clipboard.id="jaguiClipboard";
            $j.clipboard.value=".";
            $j.doc.body.appendChild($j.clipboard);
          }
          if(!$j.DOMParentElement) {
            //$j.doc.documentElement.ClassName=$j.defaultTheme+"_body "+$j.defaultTheme+"_default";
            if (ie) {
              $j.doc.body.setAttribute("data-theme",$j.defaultTheme);
              $j.doc.body.setAttribute("data-ie","true");
            } else $j.doc.body.dataset.theme=$j.defaultTheme;
          }
          logo=$j.doc.createElement("span");
          logo.className="JAGUI";
          //logo.innerHTML="D";
          if(!$j.DOMParentElement) $j.doc.body.appendChild(logo);
          else $j.DOMParentElement.appendChild(logo);
          waiting=$j.doc.createElement("div");
          waiting.className="loading";
          if (ie) waiting.setAttribute("data-theme",$j.defaultTheme);
          else waiting.dataset.theme=$j.defaultTheme;
          waiting.id="waiting";
          logo=$j.doc.createElement("div");
          logo.id="loading_logo";
          logo.className="loading_logo rotateAnimation";
          waiting.appendChild(logo);
          progressOuter=$j.doc.createElement("div");
          progressOuter.className="loading_progressOuter";
          if (ie) progressOuter.setAttribute("data-theme",$j.defaultTheme);
          else progressOuter.dataset.theme=$j.defaultTheme;
          progressOuter.id="progressOuter";
          progressInner=$j.doc.createElement("div");
          progressInner.id="progressInner";
          progressInner.className="loading_progressInner";
          if (ie) progressInner.setAttribute("data-theme",$j.defaultTheme);
          else progressInner.dataset.theme=$j.defaultTheme;
          progressOuter.appendChild(progressInner);
          waiting.appendChild(progressOuter);
          text=$j.doc.createElement("div");
          text.className="loading_text";
          if (ie) text.setAttribute("data-theme",$j.defaultTheme);
          else text.dataset.theme=$j.defaultTheme;
          text.id="file_text";
          text.value=".";
          waiting.appendChild(text);
          if(!$j.DOMParentElement) $j.doc.body.appendChild(waiting);
          else $j.DOMParentElement.appendChild(waiting);
          $j.tools.step=~~(178/($j.tools.scripts.length-1));
          //if($j.DOMParentElement) $j.DOMParentElement.ClassName=$j.defaultTheme+"_body";
          if($j.DOMParentElement) {
            if (ie) $j.DOMParentElement.setAttribute("data-theme",$j.defaultTheme);
            else $j.DOMParentElement.dataset.theme=$j.defaultTheme;
          }
          $j.tools.loadScript();
          $j.tools.afterLoadScripts=function() {
            $j.animatedCursor=new $j.classes.AnimatedCursor();
            if(typeof $j.ready==="function") $j.ready();
          };
        },false
      );
    }
    //#endregion Methods
  });

  //#region Classes
  var Classes={
    //#region Methods
    nameSpace: function(nameSpace) {
      $j.classes[nameSpace]={};
    },
    register: function() {
      var className,Class,categorie;
      categorie=arguments[0]
      if(!$j.tools.valueInSet(categorie,$j.types.categories)&&!$j.tools.valueInSet(categorie,$j.types.internalCategories)) return;
      if(!$j.classes[categorie]) $j.classes.nameSpace(categorie);
      for(var i=1,l=arguments.length;i<l;i++) {
        Class=arguments[i];
        //className=Class.name!==undefined?Class.name:;
        className=$j.tools.getFuncName(Class);
        $j.classes[categorie][className]=Class;
        $j.classes[className]=Class;
      }
    },
    registerTemplates: function(arrayOfTemplate) {
      var tpl,className;
      if(!Array.isArray(arrayOfTemplate)) return;
      for(var i=0,l=arrayOfTemplate.length;i<l;i++) {
        className=arrayOfTemplate[i].Class;
        className=(typeof className!==_const.STRING)?$j.tools.getFuncName(className):className;
        tpl=arrayOfTemplate[i].template;
        tpl=$j.tools.text.replace(tpl,"{className}",className);
        $j.templates[className]=tpl;
      }
    },
    getTemplate:function(className) {
      if (!$j.tools.isNull($j.templates[className])) return $j.templates[className];
      else return String.empty;
    },
    createComponent: function(Class,owner,name,props,withTpl,internalId) {
      var obj=new Class(owner,props),tpl,container;
      if (obj instanceof $j.classes.Component) {
        if ($j.tools.isNull(withTpl)) withTpl=true;
        if ($j.tools.isNull(props)) props={};
        if ($j.tools.isNull(name)) name=String.empty;
        if ($j.tools.isNull(internalId)) obj._internalId=String.uniqueId();
        else obj._internalId=internalId;
        if (withTpl) {
          obj.name=name;
          tpl=obj.getTemplate();
          if ($j.tools.isNull(props.parentDOM)) {
            owner.insertTemplate(tpl);
          } else {
            container=$j.doc.createElement($j.types.HTMLElements.DIV);
            container.innerHTML=tpl;
            props.parentDOM.appendChild(container.firstElementChild);
          }
        }
        obj.getDOMObj(obj._internalId);
        if (!$j.tools.isNull(obj._DOMObj)) {
          obj.getChildsDOMObj(obj._DOMObj);
          obj.updateFromDOM();
          obj.loaded();
        }
      }
      return obj;
    },
    newCollection:function(obj,owner,itemsClass,propName) {
      if ($j.tools.isNull(propName)) propName="items";
      obj[propName]=[];
      obj[propName].convertToCollection(owner,itemsClass);
    }
    /*,
    getClassName:function(Class) {
      if (Class.name!==undefined) return Class.name;
      else return Class.toString().match(/^function\s*([^\s(]+)/)[1];
    }*/
    //#endregion Methods
  };
  //#endregion Classes
  //#region Exception
  var Exception={
    //#region Methods
    createFmt: function Exception_createFmt() {
      alert(arguments[0].format(arguments[1]));
    }
    //#endregion Methods
  };
  //#endregion Exception
  //#region Apps
  var Apps=Class.extend({
    _ClassName: "Apps",
    init: function() {
      this.applications={};
      this.activeApplication=null;
    },
    //#region Methods
    createApp: function Apps_createApp(appName,path) {
      if(!path) path=$j.folders["{APPS}"];
      else if(!path.endsWith("/")) path+="/";
      $j.tools.scripts.length=0;
      $j.tools.scripts.idx=0;
      $j.tools.currentProgress="progressInner";
      $j.tools.uses(path+appName+"/"+appName);
      $j.tools.step=~ ~(180/($j.tools.scripts.length-1));
      if($j.tools.step<=0) $j.tools.step=180;
      $j.tools.loadScript();
    },
    killApp: function Apps_killApp() {
      $j.apps.activeApplication.terminate();
    }
    //#endregion Methods
  });
  //#endregion Apps
  //#region Tools
  var Tools=Class.extend({
    _ClassName: "Tools",
    init: function() {
      this.events=Event;
      this.cookie=Cookie;
      this.sorter=Sorter;
      this.text=Text;
      this.uri=Uri;
      this.xhr=new Xhr();
      this.bezierUtils=new BezierUtils;
      this.font=new Font;
      this.DOMParentElement=null;
      this.afterLoadScripts=null;
      this.scripts=[];
      this.loadedScripts=[];
      this.idx=0;
      this.currentProgress="progressOuter";
      this.step=0;
      this.Debugger={ debug: false,useFragment: false,log: function(arg,obj,t) { if($j.tools.Debugger.debug&&!obj._loading/*&&!obj.form._loading*/) console.log(arg.callee.name+String.SPACE+(new Date().getTime()-t)+"ms"); } };
    },
    //#region Methods
    include: function Tools_include(object,property,value) {
      if(!$j.tools.bitTest(object[property],value)) object[property].push(value);
    },
    bitTest: function Tools_bitTest(flags,value) {
      return (flags.indexOf(value)!==-1);
    },
    exclude: function Tools_exclude(object,property,value) {
      if($j.tools.bitTest(object[property],value)) {
        var idx=object[property].indexOf(value);
        if(idx>-1) object[property].splice(idx,1);
      }
    },
    isValidIdent: function Tools_isValidIdent(ident,allowDots) {
      var alphaChars='A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,_';
      var alpha=alphaChars.split(",");
      var alphaNumeric=(alpha.join(",")+',0,1,2,3,4,5,6,7,8,9').split(",");
      var alphaNumericDot=(alphaNumeric.join(",")+',.').split(","),i,l;
      if(typeof ident!==_const.STRING) return false;
      if(typeof allowDots!==_const.BOOLEAN) allowDots=false;
      if((ident.length===0)||(alpha.indexOf(ident[0]))===-1) return false;
      if(allowDots) {
        for(i=1,l=ident.length;i<l;i++)
          if(alphaNumericDot.indexOf(ident[i])===-1) return false;
      } else {
        for(i=1,l=ident.length;i<l;i++)
          if(alphaNumeric.indexOf(ident[i])===-1) return false;
      }
      return true;
    },
    valueInSet: function Tools_valueInSet(value,set) {
      var founded=false;
      if(typeof set!==_const.OBJECT) return;
      var names=Object.getOwnPropertyNames(set);
      for(var i=0,l=names.length;i<l;i++) {
        if(set[names[i]]===value) {
          founded=true;
          break;
        }
      }
      return founded;
    },
    emptyFunc: function Tools_emptyFunc() { },
    loadNextScript: function Tools_loadNextScript() {
      $j.tools.idx++;
      if($j.tools.idx>=$j.tools.scripts.length) {
        $j.tools.scripts.length=0;
        $j.tools.idx=0;
        if(typeof $j.tools.afterLoadScripts==="function") $j.tools.afterLoadScripts();
        $j.tools.afterLoadScripts=null;
      } else $j.tools.loadScript();
    },
    loadScript: function Tools_loadScript() {
      var html_doc=document.getElementsByTagName("head")[0];
      var node=document.createElement("script");
      node.setAttribute("type","text/javascript");
      node.addEventListener("load",function() {
        var p=$j.doc.getElementById($j.tools.currentProgress);
        if(p) {
          if($j.tools.currentProgress==="progressOuter") p.style.width=((p.offsetWidth-2)+$j.tools.step)+"px";
          else p.style.width=(p.offsetWidth+$j.tools.step)+"px";
        }
        $j.tools.loadNextScript();
      },false);
      node.addEventListener("error",function() {
        if ($j.tools.Debugger.debug) console.log($j.tools.scripts[$j.tools.idx]+" not loaded");
        $j.tools.loadedScripts.remove($j.tools.scripts[$j.tools.idx]);
        $j.tools.loadNextScript();
      },false);
      node.setAttribute("src",$j.tools.uri.base()+$j.tools.scripts[$j.tools.idx]+".js");//".js?rnd="+new Date().getTime());
      var fileText=$j.doc.getElementById("file_text");
      if(fileText) {
        fileText.innerHTML=$j.tools.scripts[$j.tools.idx]+".js";
      }
      $j.tools.loadedScripts.push($j.tools.uri.split($j.tools.scripts[$j.tools.idx],true));
      html_doc.appendChild(node);
      node=null;
      html_doc=null;
    },
    uses: function Tools_uses() {
      for(var i=0,l=arguments.length;i<l;i++) {
        if(($j.tools.loadedScripts.indexOf(arguments[i])===-1)&&$j.tools.scripts.indexOf(arguments[i])===-1) $j.tools.scripts.push(arguments[i]);
      }
      if($j.tools.currentProgress==="progressInner") {
        var p=$j.doc.getElementById($j.tools.currentProgress);
        if(p) {
          p.style.width="0px";
          $j.tools.step=~~(180/$j.tools.scripts.length+1);
        }
      }
    },
    loadFormRes: function Tools_loadFormRes(resName,object) {
      var args=arguments;
      var fileText=$j.doc.getElementById("file_text");
      if(fileText) {
        fileText.innerHTML="Creating window & objects\nPlease wait...";
      }
      var p=$j.doc.getElementById($j.tools.currentProgress);
      if(p) {
        if($j.tools.currentProgress==="progressInner") p.style.width="99%";
      }
      var style=$j.doc.createElement("link");
      style.setAttribute("rel","stylesheet");
      style.setAttribute("href",$j.tools.uri.base()+resName+".css?rnd="+new Date().getTime());
      style.setAttribute("media","screen");
      $j.doc.getElementsByTagName("head")[0].appendChild(style);
      style=$j.doc.createElement("link");
      style.setAttribute("rel","stylesheet");
      style.setAttribute("href",$j.tools.uri.base()+"css/animate.css?rnd="+new Date().getTime());
      style.setAttribute("media","screen");
      $j.doc.getElementsByTagName("head")[0].appendChild(style);
      $j.tools.xhr.load(true,$j.tools.uri.base()+resName+".html?rnd="+new Date().getTime(),function(dx) {
        $j.doc.body.innerHTML+=dx;
      },false);
    },
    getObjectFromString: function Tools_getObjectFromString(_object,stringProp) {
      var tab=stringProp.split("."),obj=_object[tab[0]];
      if(typeof obj===_const.OBJECT&&obj) {
        for(var i=1,l=tab.length-1;i<l;i++) {
          obj=obj[tab[i]];
        }
        return { object: obj,property: tab.last() };
      }
      return { object: _object,property: stringProp };
    },
    execFunc: function Tools_execFunc(object,func,param,timeToWait) {
      setTimeout(function() { object[func](param); },timeToWait?timeToWait:0);
    },
    newCanvas: function Tools_newCanvas() {
      var c=$j.doc.createElement("canvas"),ctx=c.getContext("2d");
      ctx.useNativeDash=ctx.setLineDash?"setLineDash":($j.browser.ff?"mozDash":null);
      //ctx.useNativeDash=null;
      if(!ctx.useNativeDash) ctx.dashOffset=0;
      return c;
    },
    getPath: function JaGui_getPath(subfolder) {
      var path="{"+subfolder.toUpperCase()+"}";
      path=$j.folders[path];  
      //switch(subfolder) {
      //  case "base":
      //    path=this.folders["JaGui6";
      //    break;
      //  case "gui":
      //    path="gui/";
      //    break;
      //  case "core":
      //    path="gui/core/";
      //    break;
      //  case "components":
      //    path="gui/components/";
      //    break;
      //  case "common":
      //    path="gui/components/common/";
      //    break;
      //  case "color":
      //    path="gui/components/color/";
      //    break;
      //  case "containers":
      //    path="gui/components/containers/";
      //    break;
      //  case "data":
      //    path="gui/components/data/";
      //    break;
      //  case "extended":
      //    path="gui/components/extended/";
      //    break;
      //  case "extras":
      //    path="gui/components/extras/";
      //    break;
      //  case "lists":
      //    path="gui/components/lists/";
      //    break;
      //  case "menus":
      //    path="gui/components/menus/";
      //    break;
      //  case "toolbars":
      //    path="gui/components/toolbars/";
      //    break;
      //  case "nonvisual":
      //    path="gui/components/nonvisual/";
      //    break;
      //  case "apps":
      //    path="apps/";
      //    break;
      //  case "demos":
      //    path="demos/";
      //    break;
      //  case "cultures":
      //    path="gui/cultures/";
      //    break;
      //  case "controls":
      //    path="controls/";
      //    break;
      //  case "css":
      //    path="css/";
      //    break;
      //  case "styles":
      //    path="styles/";
      //    break;
      //  case "images":
      //    path="images/";
      //    break;
      //  case "effects":
      //    path="gui/effects/";
      //    break;
      //  case "dialogs":
      //    path="gui/components/dialogs/";
      //    break;
      //}
      return path;
    },
    loadTheme: function JaGui_loadTheme(themeName) {
      //vérification que le thème n'est pas déjà été chargé
      for(var i=0,l=document.styleSheets.length;i<l;i++) {
        if(document.styleSheets[i].id===themeName) return;
      }
      var style=$j.doc.createElement("link");
      style.setAttribute("rel","stylesheet");
      style.setAttribute("href",$j.tools.uri.base()+this.getPath("themes")+themeName+"/"+themeName.toLowerCase()+".css?rnd="+new Date().getTime());
      //style.setAttribute("id",themeName);
      style.setAttribute("media","screen");
      document.getElementsByTagName("head")[0].appendChild(style);
      $j.themes[themeName]={};
    },
    clone: function JaGui_clone(object) {
      //answer a new instance of target's type
      if(typeof object===_const.OBJECT) {
        var Clone=function() { object.constructor.apply(this); };
        Clone.prototype=object;
        return new Clone();
      } else return object;
    },
    copy: function JaGui_copy(object) {
      //answer a shallow copy of target
      var value,c,property,names,i,l;

      if(typeof object!==_const.OBJECT) {
        return object;
      } else {
        value=object.valueOf();
        if(object!==value) {
          return new object.constructor(value);
        } else {
          if(object instanceof object.constructor&&
              object.constructor!==Object) {
            c=$j.clone(object.constructor.prototype);
            names=Object.getOwnPropertyNames(object);
            for(i=0,l=names;i<l;i++) {
              if(object.hasOwnProperty(names[i])) {
                c[names[i]]=object[names[i]];
              }
            }
          } else {
            c={};
            names=Object.getOwnPropertyNames(object);
            for(i=0,l=names;i<l;i++) {
              if(!c[names[i]]) {
                c[names[i]]=object[names[i]];
              }
            }
          }
          return c;
        }
      }
    },
    destroyGhostWindow: function JaGui_destroyGhostWindow() {
      this.tools.events.unBind(this.doc,"mousemove",this.ghostWindow.mouseMove);
      this.tools.events.unBind(this.doc,"mouseup",this.ghostWindow.mouseUp);
      this.doc.documentElement.removeChild(this.ghostWindow.div);
      destroy(this.ghostWindow);
      this.ghostWindow=null;
    },
    getCulture: function() {
      if (!$j.tools.isNull($j.apps.activeApplication.localCulture)) {
        if (!$j.tools.isNull($j.cultures[$j.apps.activeApplication.localCulture])) return $j.cultures[$j.apps.activeApplication.localCulture];
        else $j.cultures[$j.currentCulture];
      } else return $j.cultures[$j.currentCulture];
    },
    getDefaultCulture: function() {
      return $j.cultures[$j.currentCulture];
    },
    cultureExist: function(culture) {
      return !$j.tools.isNull($j.cultures[$j.currentCulture]);
    },
    isNull:function(obj) {
      return (obj===undefined)||(obj===null);
    },
    getFuncName:function(func) {
      if (func.name!==undefined) return func.name;
      else return func.toString().match(/^function\s*([^\s(]+)/)[1];
    }
    //setData:function(HTMLObj,name,value) {
    //  if (HTMLObj.dataset!==null) HTMLObj.dataset[name]=value;
    //  else if (HTMLObj.getAttribute(name)!==null) HTMLObj.setAttribute(name,value);
    //},
    //getData:function(HTMLObj,name) {
    //  if (HTMLObj.dataset!==null) return HTMLObj.dataset[name];
    //  else if (HTMLObj.getAttribute("data-"+name)!==null) return HTMLObj.getAttribute("data-"+name);
    //  else return null;
    //}
    //#endregion Methods
  });
  //#endregion Tools
  //#region Event
  var Event={
    //#region Methods
    bind: function Event_bind(object,eventName,callBack) {
      if(typeof callBack!==_const.FUNCTION) return;
      if(!object) return;
      if(typeof eventName!==_const.STRING) return;
      object.addEventListener(eventName,callBack,false);
    },
    unBind: function Event_unBind(object,eventName,callBack) {
      var args=arguments;
      if(typeof callBack!==_const.FUNCTION) return;
      if(!object) return;
      if(typeof eventName!==_const.STRING) return;
      object.removeEventListener(eventName,callBack,false);
    },
    stop: function Event_stop(eventArg) {
      eventArg.cancelBubble=true;
      eventArg.stopPropagation();
      eventArg.preventDefault();
    },
    whichTransitionEvent:function() {
      var t,el=$j.doc.createElement('fakeelement'),transitions={
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      },props;
      props=Object.keys(transitions);
      for(i=0;i<props.length;i++){
        if (!$j.tools.isNull(el.style[props[i]])) return transitions[props[i]];
      }
    },
    whichAnimationEvent:function() {
      var t,el=$j.doc.createElement('fakeelement'),transitions={
        'animation':'animationend',
        'OAnimation':'oAnimationEnd',
        'MozAnimation':'animationend',
        'WebkitAnimation':'webkitAnimationEnd'
      },props;
      props=Object.keys(transitions);
      for(i=0;i<props.length;i++){
        if (!$j.tools.isNull(el.style[props[i]])) return transitions[props[i]];
      }
    }
    //#endregion Methods
  };
  //#endregion Event 
  //#region Cookie
  var Cookie={
    //#region Methods
    _new: function Cookie_new(name,value,days) {
      var date,expires;
      if(days) {
        date=new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires="; expires="+date.toGMTString();
      }
      else expires="";
      document.cookie=name+"="+value+expires+"; path=/";
    },
    read: function Cookie_read(name) {
      var nameEQ=name+"=",ca=document.cookie.split(';');
      for(var i=0;i<ca.length;i++) {
        var c=ca[i];
        while(c.charAt(0)===String.SPACE) c=c.substring(1,c.length);
        if(c.indexOf(nameEQ)===0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    },
    erase: function Cookie_erase(name) {
      $j.createCookie(name,String.empty,-1);
    }
    //#endregion Methods
  };
  //#endregion Cookie
  //#region Sorter
  var Sorter={
    //#region Methods
    compareListItem: function Sorter_compareListItem(item1,item2) {
      if((item1 instanceof $j.listBoxItem)&&(item2 instanceof $j.listBoxItem)) {
        if(item1.ListBox()&&(typeof item1.ListBox().onCompare===_const.FUNCTION)) return item1.ListBox().onCompare(item1,item2);
        else return item1.text.compareTo(item2.text);
      } else return 0;
    },
    compareTreeItem: function Sorter_compareTreeItem(item1,item2) {
      if((item1 instanceof $j.treeViewItem)&&(item2 instanceof $j.treeViewItem)) {
        if(item1.TreeView()&&(typeof item1.TreeView().onCompare===_const.FUNCTION)) return item1.TreeView().onCompare(item1,item2);
        else return item1.text.compareTo(item2.text);
      } else return 0;
    }
    //#endregion Methods
  };
  //#endregion Sorter
  //#region Text
  var Text={
    //#region Methods
    wrapText: function Text_wrapText(text,withSpace) {
      if(typeof text!==_const.STRING) return [];
      if(text===String.empty) return text.split();
      if(typeof withSpace===_const.UNDEFINED) withSpace=false;
      if(withSpace) text=text.replace(/ /g," [|]");
      text=text.replace(/\\n/g,"[|]¤[|]");
      text=text.replace(/\n/g,"[|]¤[|]");
      text=text.replace(/<br \/>/g,"[|]¤[|]");
      text=text.replace(/<br>/g,"[|]¤[|]");
      text=text.replace(/<br\/>/g,"[|]¤[|]");
      text=text.split("[|]");
      return text;
    },
    wordWrapText: function Text_wordWrapText(ctx,text,maxWidth) {
      var words,line='',testLine,testWidth,lines=[];
      words=$j.tools.text.replace(text,' ','\f ');
      words=words.split(' ');
      for(var n=0;n<words.length;n++) {
        testLine=line+words[n];
        testWidth=ctx.measureText(testLine.replace('\f',' ')).width;
        if(testWidth>maxWidth-5&&n>0) {
          line=$j.tools.text.replace(line,'\f',' ');
          lines.push(line);
          line=words[n];
        }
        else {
          line=testLine;
        }
      }
      line=$j.tools.text.replace(line,'\f',' ');
      lines.push(line);
      return lines;
    },
    findWordBreak: function Text_findWordBreak(text,col,step) {
      if(step<0) col+=step;
      var d=this.isWordSeparator(text[col]);
      if(d&&step>0) return col+step;
      for(col=col;col>=0&&col<text.length;col+=step)
        if(this.isWordSeparator(text[col])!==d) return step<0?col-=step:col+step;
      return step<0?0:text.length;
    },
    isWordSeparator: function Text_isWordSeparator(c) {
      return " \t'\",;.!~@#$%^&*?=<>()[]:\\+-".indexOf(c)!==-1;
    },
    getTok: function Text_getTok(string,position) {
      if(typeof string!==_const.STRING) return;
      var result=String.empty,len=string.length;
      if(position>len) return;
      while((position<=len)&&(string.charAt(position)===String.SPACE)) position++;
      for(var i=position;i<len;i++) {
        if('zmlchvsqtaZMLCHVSQTA'.indexOf(string.charAt(i))===-1) break;
        result+=string.charAt(i);
      }
      return { s: result,pos: i };
    },
    getNum: function Text_getNum(string,position) {
      if(typeof string!==_const.STRING) return;
      var result=String.empty,len=string.length;
      if(position>len) return;
      while((position<=len)&&(string.charAt(position)===String.SPACE)) position++;
      for(var i=position;i<len;i++) {
        if(string.charAt(i)==='e') {
          result+=string.charAt(i);
          continue;
        }
        if((string.charAt(i)==='-')&&(len>0)&&(result.charAt(result.length-1)==='e')) {
          result+=string.charAt(i);
          continue;
        }
        if(('0123456789.'.indexOf(string.charAt(i))===-1)&&!((i===position)&&string.charAt(i)==='-')) break;
        result+=string.charAt(i);
      }
      while(string.charAt(position)===String.SPACE) position++;
      return { Result: result,Pos: i };
    },
    getPoint: function Text_getPoint(string,position) {
      if(typeof string!==_const.STRING) return;
      position=position;
      var x,y,result,len=string.length,_pos,o;
      if(position>len) return;
      while((position<=len)&&([',',String.SPACE].indexOf(string.charAt(position))!==-1)) position++;
      o=$j.tools.text.getNum(string,position);
      x=o.Result;
      position=o.Pos;
      while((position<=len)&&([',',String.SPACE].indexOf(string.charAt(position))!==-1)) position++;
      o=$j.tools.text.getNum(string,position);
      y=o.Result;
      position=o.Pos;
      while((position<=len)&&([',',String.SPACE].indexOf(string.charAt(position))!==-1)) position++;
      return { Point: new $j.classes.Point($j.convert.strToFloat(x),$j.convert.strToFloat(y)),Pos: position };
    },
    getTextSizes: function Text_getTextSizes(text,_class,domObj) {
      var d,H=0,W=0;
      if(typeof text!==_const.STRING) return;
      //if (font!==null) {
      //  if (!(font instanceof $j.classes.Font)) return;
      //}
      d=$j.doc.createElement($j.types.HTMLElements.SPAN);
      if(!$j.tools.isNull(_class)) $j.CSS.addClass(d,_class);
      else if(!$j.tools.isNull(domObj)) {
        d.style.fontFamily=getComputedStyle(domObj).fontFamily;
        d.style.fontSize=parseInt(getComputedStyle(domObj).fontsize,10);
        d.style.fontStretch=getComputedStyle(domObj).fontStretch;
        d.style.fontStyle=getComputedStyle(domObj).fontStyle;
        d.style.fontWeight=getComputedStyle(domObj).fontWeight;
        //d.style.font=getComputedStyle(domObj).getPropertyValue("font");
      }
      //d.style.position="absolute";
      //if (font) font.toCss(d);
      d.innerHTML=text;
      $j.doc.documentElement.appendChild(d);
      H=d.offsetHeight;
      W=d.offsetWidth;
      $j.doc.documentElement.removeChild(d);
      return { w: W,h: H };
    },
    replace: function Text_replace(s,f,r) {
      return s.replace(new RegExp(f,'g'),r);
    },
    getLastNumber: function(str) {
      return str.match(/\d+$/)[0];
    }
    //#endregion Methods
  };
  //#endregion Text
  //#region Uri
  var Uri={
    //#region Methods
    clean: function Uri_clean(uri) {
      return uri.replace("url(",String.empty).replace(")",String.empty).replace(/"/g,String.empty);
    },
    split: function Uri_split(path,returnLast) {
      var splited=path.split("/");
      if(returnLast) return splited[splited.length-1];
      else return splited;
    },
    base: function Uri_base() {
      var uri=location.protocol+'//'+location.hostname+(location.port?':'+location.port:'')+"/";
      if(location.href.toLowerCase().indexOf($j.tools.getPath("base").toLowerCase())>-1) uri+=$j.tools.getPath("base")+"/";
      return uri;
    },
    extractFileName: function Uri_extractFileName(url) {
      return $j.tools.uri.split(url,true);
    },
    extractFileExt: function Uri_extractFileName(url) {
      return url.split(".").last();
    },
    getParamValue: function Uri_getParamValue(param,url) {
      var u=url===null?document.location.href:url,reg=new RegExp('(\\?|&|^)'+param+'=(.*?)(&|$)'),matches=u.match(reg);
      return (!$j.tools.isNull(matches&&matches[2]))?decodeURIComponent(matches[2]).replace(/\+/g,' '):'';
    },
    convertToRealURI:function(uri) {
      var newUri,props;
      props=Object.keys($j.folders);
      for (var i=0;i<props.length;i++) {
        newUri=uri.split(props[i]);
        if (newUri.length>1) uri=newUri.join($j.folders[props[i]]);
      }
      return uri;
    }
    //#endregion Methods
  };
  //#endregion Uri
  //#region Xhr
  var Xhr=Class.extend({
    _ClassName: "Xhr",
    init: function() {
      this.xmlHTTPR=(window.ActiveXObject)?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
    },
    //#region Methods
    load: function Xhr_load(async,url,callback,xml,params) {
      if(typeof async!==_const.BOOLEAN) async=false;
      if(typeof xml!==_const.BOOLEAN) xml=false;
      if(!callback) callback=null;
      $j.tools.xhr.xmlHTTPR.onreadystatechange=function() {
        if(($j.tools.xhr.xmlHTTPR.readyState===4)&&($j.tools.xhr.xmlHTTPR.status===200)) {
          if(typeof callback===_const.FUNCTION) {
            if(async) {
              if(!xml) callback($j.tools.xhr.xmlHTTPR.responseText,params);
              else callback($j.tools.xhr.xmlHTTPR.responseXML,params);
            }
          }
        }
      };
      $j.tools.xhr.xmlHTTPR.open("GET",url,async);
      $j.tools.xhr.xmlHTTPR.send(null);
      if(!async) {
        if(typeof callback===_const.FUNCTION) {
          if(!xml) callback($j.tools.xhr.xmlHTTPR.responseText,params);
          else callback($j.tools.xhr.xmlHTTPR.responseXML,params);
        }
      }
    }
    //#endregion Methods
  });
  //#endregion Xhr
  //#region Xml
  var Xml={
    //#region Methods
    newDocument: function Xml_newDocument(encoding,version,standalone,rootName) {
      if(!encoding) encoding='ISO-8859-1';
      if(!version) version='1.0';
      if($j.tools.isNull(standalone)) standalone='false';
      if(!rootName) rootName='root';
      var xmlDoc='<?xml version="'+version+'" encoding="'+encoding+'" ?><'+rootName+'></'+rootName+'>';
      if(!$j.tools.isNull(window.ActiveXObject)) { // IE
        var doc=new ActiveXObject('Microsoft.XMLDOM');
        doc.async=false;
        doc.loadXML(xmlDoc);
        return doc;
      } else {// Mozilla, Firefox, Opera, etc.
        return (new DOMParser()).parseFromString(xmlDoc,'text/xml');
      }
    },
    findNodes: function Xml_findNodes(xml,xpath) {
      var nodes,arr=[],i,obj,j;
      if(!$j.tools.isNull(window.ActiveXObject)) {
        nodes=xml.selectNodes(xpath);
        for(i=0;i<nodes.length;i++) arr.push(nodes[i]);
      } else {
        nodes=xml.evaluate(xpath,xml,null,XPathResult.ANY_TYPE,null);
        var result=nodes.iterateNext();
        while(result) {
          arr.push(result);
          result=nodes.iterateNext();
        }
      }
      return arr;
    },
    addNode: function Xml_addNode(xml,parentNode,name) {
      var newNode;
      newNode=xml.createElement(name);
      parentNode.appendChild(newNode);
      return newNode;
    },
    delNode: function Xml_delNode(node) {
      node.parentNode.removeChild(node);
    }
    //#endregion Methods
  };
  //#endregion Xml
  //#region BezierUtils
  var BezierUtils=Class.extend({
    _ClassName: "BezierUtils",
    init: function() {
      this.error=0.1;
    },
    //#region Methods
    distance: function BezierUtils_distance(x1,y1,x2,y2) {
      return $j.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    },
    arcAsBezier: function BezierUtils_arcAsBezier(alpha) {
      var cosa=$j.cos(alpha),sina=$j.sin(alpha),p2=new $j.classes.Point(cosa+(4/3)*(1-cosa),sina-(4/3)*cosa*(1-cosa)/sina);
      return {
        s: new $j.classes.Point(cosa,-sina),
        c1: new $j.classes.Point(p2.x,-p2.y),
        c2: p2,
        e: new $j.classes.Point(cosa,sina)
      };
    },
    splitToDashedBezier: function BezierUtils_splitToDashedBezier(points,dashArray,newPoints,lineWidth,prevResult) {
      var result=0,t=0,dash,i=0;
      if(prevResult) {
        dash=prevResult.l;
        i=prevResult.i;
      } else {
        dash=dashArray[0]*lineWidth;
      }
      while(t<1) {
        // get the 't' corresponding to the given dash value.
        t=$j.tools.bezierUtils.tAtLength(points,dash);
        if(t===1) {
          var rl=$j.tools.bezierUtils.computeLength(points);
          result={ l: dash-rl,i: i };
        }
        // split bezier at t: left part is the "dash" curve, right part is the remaining bezier points
        var curves=$j.tools.bezierUtils.splitBezierAtT(points,t);
        if(!(i%2)) {
          // only keep the "dash" curve
          newPoints.push(curves[0]);
        }
        points=curves[1];
        ++i;
        dash=dashArray[i%dashArray.length]*lineWidth;
      }
      return result;
    },
    tAtLength: function BezierUtils_tAtLength(points,length) {
      var t=0,quadratic=points.length===6,currentLen=0,splitCount=0,bu=$j.tools.bezierUtils,splitFunc=quadratic?bu.splitQBezierAtT:bu.splitBezierAtT;
      var _compute=function(p,error) {
        // control points polygon length
        var pLen=0,chord,newbezier;
        for(var i=0;i<p.length-2;i+=2)
          pLen+=bu.distance(p[i],p[i+1],p[i+2],p[i+3]);
        // chord length
        chord=quadratic?bu.distance(points[0],points[1],points[4],points[5]):bu.distance(points[0],points[1],points[6],points[7]);
        // if needs more approx. or if currentLen is greater than the target length,
        // split the curve one more time
        if(pLen-chord>error||currentLen+pLen>length+error) {
          ++splitCount;
          newbezier=splitFunc(p,0.5);
          // check 1st subpath
          _compute(newbezier[0],error);
          // the 1st subcurve was the good one, we stop
          if($j.abs(currentLen-length)<=error) return;
          // need to continue with the 2nde subcurve
          _compute(newbezier[1],error);
          return;
        }
        currentLen+=pLen;
        t+=1.0/(1<<splitCount);
      };
      if(length) _compute(points,0.5);
      return t;
    },
    splitCBezierAtT: function BezierUtils_splitCBezierAtT(points,t) {
      var r=1-t,r2=r*r,r3=r2*r,t2=t*t,t3=t2*t,p1x=points[0],p1y=points[1],c1x=points[2],c1y=points[3],c2x=points[4],
          c2y=points[5],p2x=points[6],p2y=points[7],ax=r*p1x+t*c1x,ay=r*p1y+t*c1y,cx=r*c2x+t*p2x,cy=r*c2y+t*p2y,
          mx=r2*p1x+2*r*t*c1x+t2*c2x,my=r2*p1y+2*r*t*c1y+t2*c2y,nx=r2*c1x+2*r*t*c2x+t2*p2x,ny=r2*c1y+2*r*t*c2y+t2*p2y,
          px=r3*p1x+3*r2*t*c1x+3*r*t2*c2x+t3*p2x,py=r3*p1y+3*r2*t*c1y+3*r*t2*c2y+t3*p2y;
      return [[p1x,p1y,ax,ay,mx,my,px,py],
              [px,py,nx,ny,cx,cy,p2x,p2y]];
    },
    splitQBezierAtT: function BezierUtils_splitQBezierAtT(points,t) {
      var r=1-t,r2=r*r,t2=t*t,p1x=points[0],p1y=points[1],cx=points[2],cy=points[3],p2x=points[4],p2y=points[5],
          ax=r*p1x+t*cx,ay=r*p1y+t*cy,bx=r*cx+t*p2x,by=r*cy+t*p2y,px=r2*p1x+2*r*t*cx+t2*p2x,py=r2*p1y+2*r*t*cy+t2*p2y;
      return [[p1x,p1y,ax,ay,px,py],
              [px,py,bx,by,p2x,p2y]];
    },
    computeLength: function BezierUtils_computeLength(points) {
      var quadratic=points.length===6,pLen=0,chord,newBeziers,length,bu=$j.tools.bezierUtils;
      // control points polygon length
      for(var i=0;i<points.length-2;i+=2)
        pLen+=bu.distance(points[i],points[i+1],points[i+2],points[i+3]);
      // chord length
      chord=quadratic?bu.distance(points[0],points[1],points[4],points[5]):bu.distance(points[0],points[1],points[6],points[7]);
      // split polygons until the polygon and the chord are "the same"
      if(pLen-chord>bu.error) {
        newBeziers=quadratic?bu.splitQBezierAtT(points,0.5):bu.splitCBezierAtT(points,0.5);
        length=bu.computeLength(newBeziers[0],quadratic);
        length+=bu.computeLength(newBeziers[1],quadratic);
        return length;
      }
      // pLen is close enough, done.
      return pLen;
    },
    splitBezierAtT: function BezierUtils_splitBezierAtT(points,t) {
      var bu=$j.tools.bezierUtils;
      return points.length===6?bu.splitQBezierAtT(points,t):bu.splitCBezierAtT(points,t);
    }
    //#endregion Methods
  });
  //#endregion BezierUtils
  //#region Font
  var Font=Class.extend({
    _ClassName: "Font",
    init: function() {
      this.fontsInfos={};
    },
    //#region Methods
    getTextHeight: function Font_getTextHeight(text,font) {
      var d,H=0;
      if(typeof text!==_const.STRING) return;
      if(!$j.tools.isNull(font)) {
        if(!(font instanceof $j.classes.Font)) return;
      }
      d=$j.doc.createElement("div");
      //d.style.position="absolute";
      if(!$j.tools.isNull(font)) font.toCss(d);
      d.innerHTML=text;
      $j.doc.documentElement.appendChild(d);
      H=d.offsetHeight-1;
      $j.doc.documentElement.removeChild(d);
      return H;
    },
    getCharWidth: function Font_getCharWidth(font,char) {
      return $j.tools.font.fontsInfos[font.family].sizes[font.size].chars[char.charCodeAt(0)];
    }
    //#endregion Methods
  });
  //#endregion Font
  //#region CSS2JSON
  var CSS2JSON=Class.extend({
    _ClassName: "CSS2JSON",
    init: function() {
      this.css={};
      var isCSSRule,strObj,styleSheets=document.styleSheets,jsonStrObj,selector,p,lp;
      for(var i=0,li=styleSheets.length;i<li;i++) {
        var rules=[];
        try {
          if(styleSheets[i].rules) rules=styleSheets[i].rules
          else if(styleSheets[i].cssRules) rules=styleSheets[i].cssRules;
        } catch(e) {
        }
        for(var j=0,lj=rules.length;j<lj;j++) {
          if($j.browser.opera) isCSSRule=(rules[j].toString().contains("CSSStyleRule"));
          else isCSSRule=(rules[j] instanceof CSSStyleRule);
          if(isCSSRule) {
            var selectors=String.empty;
            if(rules[j].selectorText.indexOf(",")) selectors=rules[j].selectorText.split(",");
            strObj={};
            var style=rules[j].style,names;
            for(var l=0,ll=style.length;l<ll;l++) {
              strObj[this.CSSName2JS(style[l])]=style[this.CSSName2JS(style[l])];
            }
            jsonStrObj=JSON.stringify(strObj);
            if(typeof selectors!=="string") {
              for(var k=0,lk=selectors.length;k<lk;k++) {
                selector=selectors[k].trim();
                selector=selector.replace(".",String.empty);
                if(!this.css[selector]) {
                  this.css[selector]=JSON.parse(jsonStrObj);
                } else {
                  names=Object.getOwnPropertyNames(strObj);
                  for(p=0,lp=names.length;p<lp;p++) {
                    //if(strObj.hasOwnProperty(names[p])) {
                      this.css[selector][this.CSSName2JS(names[p])]=strObj[this.CSSName2JS(names[p])];
                    //}
                  }
                }
              }
            } else {
              selector=selectors.trim();
              selector=selector.replace(".",String.empty);
              if(!this.css[selector]) {
                this.css[selector]=JSON.parse(jsonStrObj);
              } else {
                names=Object.getOwnPropertyNames(strObj);
                for(p=0,lp=names.length;p<lp;p++) {
                  if(strObj.hasOwnProperty(names[p])) {
                    this.css[selector][this.CSSName2JS(names[p])]=strObj[this.CSSName2JS(names[p])];
                  }
                }
                //for (var prop in strObj){
                //  if (strObj.hasOwnProperty(prop)){
                //    this.css[selector][this.CSSName2JS(prop)]=strObj[this.CSSName2JS(prop)];
                //  }
                //}
              }
            }
          }
        }
      }
    },
    //#region Methods
    CSSName2JS: function CSS2JSON_CSSName2JS(cssName) {
      var words;
      if(cssName.indexOf("-")) {
        cssName=cssName.replace(/-value/g,String.empty);
        words=cssName.split("-");
        for(var i=0,l=words.length;i<l;i++) {
          if(i>0) words[i]=words[i].firstCharUpper();
          else if(words[i]==='moz'||words[i]==='o'||words[i]==='ms'||words[i]==='webkit') words[i]='-'+words[i];
        }
        return words.join(String.empty);
      } else return cssName;
    }
    //#endregion
  });
  //#endregion CSS2JSON
  //#region Looper
  var Looper=Class.extend({
    _ClassName: "Looper",
    init: function() {
      this.listeners=[];
      this.fps=60;
      this.handle=null;
      this.paused=false;
      this.rAF=null;
      this.isBusy=false;
    },
    //#region Getter/Setter
    setFPS:function(fps) {
      if (typeof fps!=="number") return;
      if (this.fps!==fps) {
        this.stop();
        this.fps=fps;
        this.rAF=window.requestAnimationFrameRate(this.fps);
        this.start();
      }
    },
    //#endregion
    start:function() {
      this.handle=this.rAF(this.loop);
    },
    stop:function() {
      if (this.handle!==null) window.cancelAnimationFrameRate(this.handle);
      this.handle=null;
    },
    pause:function() {
    },
    //#region Methods
    loop: function Looper_loop(elapsedTime) {
      if ($j.looper.paused||$j.looper.isBusy) return;
      $j.looper.isBusy=true;
      $j.looper.rAF($j.looper.loop);
      for(var i=0,l=($j.looper.listeners?$j.looper.listeners.length:0) ;i<l;i++) {
        var listener=$j.looper.listeners[i];
        if(listener.processTick) {
          listener.processTick(elapsedTime);
        } else if(listener instanceof Function) { listener(); }
      }
      $j.looper.isBusy=false;
    },
    addListener: function Looper_addListener(obj) {
      if(!obj) return;
      //_initRenderer();
      this.removeListener(obj);
      //_pauseable[_listeners.length]=(!pauseable)?true:pauseable;
      this.listeners.push(obj);
    },
    removeListener: function Looper_removeListener(obj) {
      //if (!this.listeners){ return; }
      var index=this.listeners.indexOf(obj);
      if(index!==-1) {
        this.listeners.splice(index,1);
        //_pauseable.splice(index,1);
      }
    },
    removeAllListeners: function Looper_removeAllListeners() {
      this.listeners.length=0;
      //_pauseable.length=0;
    }
    //#endregion
  });
  //#endregion

  $j=new JaGui;
  $j.start();
})();