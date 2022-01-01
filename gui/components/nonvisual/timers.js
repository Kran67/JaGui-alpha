(function(){
  //#region Timer
  var Timer=$j.classes.Component.extend({
    _ClassName:"Timer",
    init: function(owner) {
      if(!$j.tools.isNull(owner)) {
        this._inherited(owner);
        //#region Private
        this._handle=null;
        //#endregion
        this.onTimer=new $j.classes.NotifyEvent(this);
        this.setEnabled=function(newValue) {
          if(typeof newValue!==_const.BOOLEAN) return;
          if(this.enabled!==newValue) {
            this.enabled=newValue;
            if(this.enabled) this.startTimer();
            else this.stopTimer();
          }
        };
        this.setInterval=function(newValue) {
          if(typeof newValue!==_const.NUMBER) return;
          if(this.interval!==newValue) {
            this.stopTimer();
            this.interval=newValue;
            if(this.interval<0) this.interval=0;
            this.startTimer();
          }
        };
        this.enabled=false;
        this.interval=1000;
      }
    },
    //#region Methods
    startTimer: function Timer_startTimer() {
      //var self=this;
      //this.stopTimer();
      //this._handle=setInterval(function() { self.onTimer(self); },this.interval);
      if ($j.tools.isNull(this._handle)) this._handle=setInterval(this._onTimer.bind(this),this.interval);
    },
    stopTimer: function Timer_stopTimer() {
      clearInterval(this._handle);
      this._handle=null;
      this.enabled=false;
    },
    _onTimer: function Timer__onTimer() {
      if(!this.enabled) return;
      this.onTimer.invoke();
    },
    loaded: function Timer_loaded() {
      $j.classes.Component.prototype.loaded.apply(this,[]);
      if(this.enabled) this.startTimer();
    }
    //#endregion
  });
  //#endregion
  Object.seal(Timer);
  $j.classes.register($j.types.categories.NONVISUAL,Timer);
  //#region ConstantTimer
  var ConstantTimer=$j.classes.Component.extend({
    _ClassName: "ConstantTimer",
    init: function(owner) {
      this.enabled=false;
      if(!$j.tools.isNull(owner)) {
        this._inherited(owner);
        this.onTimer=new $j.classes.NotifyEvent(this);
        this.setEnabled=function(newValue) {
          if(typeof newValue!==_const.BOOLEAN) return;
          if(newValue!==this.enabled) this.enabled=newValue;
          if(this.enabled) $j.looper.addListener(this);
          else $j.renderer.removeListener(this);
        };
      }
    },
    //#region Methods
    processTick: function ConstantTimer_processTick() {
      if(!this.enabled) return;
      this.onTimer.invoke();
    }
    //#endregion
  });
  //#endregion
  Object.seal(ConstantTimer);
  $j.classes.register($j.types.categories.NONVISUAL,ConstantTimer);
})();