(function(){
  //#region NotifyEvent
  $j.classes.NotifyEvent=Class.extend({
    _ClassName: "NotifyEvent",
    init: function(sender){
      this.stopPropagation=false;
      this.listeners=[];
      this.sender=sender;
      //this.setStopPropagation=function(newValue) { 
      //  if (typeof newValue==_const.BOOLEAN) return;
      //  _stopPropagation=newValue;
      //};
    },
    //#region Methods
    addListener: function NotifyEvent_addListener(f,d){
      if (typeof f!==_const.FUNCTION) return;
      if (typeof d!==_const.NUMBER) d=0;
      this.listeners.push({func:f,delay:d});
    },
    removeListener: function NotifyEvent_removeListener(f){
      if (typeof f!==_const.FUNCTION) return;
      for (var i=0,l=this.listeners.length;i<l;i++) {
        if (this.listeners[i].func===f) {
          this.listeners.removeAt(i);
          break;
        }
      }
    },
    copyListenerTo: function NotifyEvent_copyListenerTo(listener) {
      if ($j.tools.isNull(listener)) return;
      for (var i=0,l=this.listeners.length;i<l;i++) {
        if (typeof this.listeners[i].func) listener.addListener(this.listeners[i].func,this.listeners[i].delay);
      }
    },
    invoke: function NotifyEvent_invoke(){
      var func,delay;
      if (!this.hasListener()) return;
      if (this.stopPropagation) return;
      for (var i=0,l=this.listeners.length;i<l;i++) {
        func=this.listeners[i].func,
        delay=this.listeners[i].delay;
        if (delay>0) {
          setTimeout(func.bind(this,this.sender,arguments),delay);
        } else func.apply(this.sender,arguments);
      }
    },
    hasListener: function NotifyEvent_hasListener(){
      return this.listeners.length>0;
    },
    clearListeners: function NotifyEvent_clearListeners() {
      this.listeners.length=0;
    }
    //#endregion
  });
  //#endregion
  //#region TimerEvent
  $j.classes.TimerEvent=$j.classes.NotifyEvent.extend({
    _ClassName: "TimerEvent",
    init: function(sender){
      this._inherited(sender);
      $j.looper.addListener(this);
    },
    //#region Methods
    processTick: function TimerEvent_processTick(){}
    //#endregion
  });
  //#endregion
})();