(function () {
  //#region CalendarModes
  $j.types.CalendarModes = {
    DAYS: null,
    MONTHS: "months",
    YEARS: "years",
    DECADES: "decades",
    CENTURIES: "centuries"
  };
  //#region CalendarModes
  var Calendar = $j.classes.ThemedControl.extend({
    _ClassName: "Calendar",
    init: function (owner, props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner, props);
        //#region Private
        this._prevMonth=null;
        this._thisDay=null
        this._nextMonth=null;
        this._thisMonth=null;
        this._weekDays=null;
        this._weeks=new Array(6);
        this._months=null;
        this._decades=null;
        this._century=null;
        this._lastSelectedDay=null;
        this._autoTranslate=true;
        //#endregion
        this.curDate=Date.now();
        this.viewWeeksNum=false;
        this.setHitTest([true,false,true]);
      }
    },
    //#region Setter
    setViewWeeksNum: function (newValue) {
      var mode;
      if (typeof newValue !== _const.BOOLEAN) return;
      if (this.viewWeeksNum !== newValue) {
        this.viewWeeksNum = newValue;
        if ($j.browser.ie) this._DOMObj.setAttribute("data-viewweeknum",this.viewWeeksNum);
        else this._DOMObj.dataset.viewweeknum=this.viewWeeksNum;
      }
    },
    setMode:function(newValue) {
      if (!$j.tools.valueInSet(newValue,$j.types.CalendarModes)) return;
      if (this.mode!==newValue) {
        this.mode=newValue;
        if ($j.browser.ie) this._DOMObj.setAttribute("data-mode",this.mode);
        else this._DOMObj.dataset.mode=this.mode;
        $j.CSS.addClass(this._months,"noDisplay");
        $j.CSS.addClass(this._decades,"noDisplay");
        $j.CSS.addClass(this._century,"noDisplay");
        switch (this.mode) {
          case $j.types.CalendarModes.DECADES:
            $j.CSS.removeClass(this._decades,"noDisplay");
            break;
          case $j.types.CalendarModes.CENTURIES:
            $j.CSS.removeClass(this._century,"noDisplay");
            break;
          default:
            $j.CSS.removeClass(this._months,"noDisplay");
            break;
        }
      }
    },
    //#endregion
    //#region Methods
    getChildsDOMObj: function () {
      if (!$j.tools.isNull(this._DOMObj)) {
        var content = this._DOMObj.firstElementChild, header = content.firstElementChild, weeks = null, j = 0;
        this._weekDays = header.nextSibling;
        while (this._weekDays.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._weekDays = this._weekDays.nextSibling;
        }
        this._prevMonth = header.firstElementChild;
        this._prevMonth.jsObj = this;
        $j.tools.events.bind(this._prevMonth, $j.types.mouseEvents.CLICK, this.decDate);
        this._thisDay = this._prevMonth.nextSibling;
        while (this._thisDay.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._thisDay = this._thisDay.nextSibling;
        }
        this._thisDay.jsObj = this;
        $j.tools.events.bind(this._thisDay, $j.types.mouseEvents.CLICK, this.goToThisDay);
        this._nextMonth = this._thisDay.nextSibling;
        while (this._nextMonth.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._nextMonth = this._nextMonth.nextSibling;
        }
        this._nextMonth.jsObj = this;
        $j.tools.events.bind(this._nextMonth, $j.types.mouseEvents.CLICK, this.incDate);
        this._thisMonth = this._nextMonth.nextSibling;
        while (this._thisMonth.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._thisMonth = this._thisMonth.nextSibling;
        }
        this._thisMonth.jsObj = this;
        $j.tools.events.bind(this._thisMonth, $j.types.mouseEvents.CLICK, this.viewMYDC);
        weeks = this._weekDays.nextSibling;
        while (weeks.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          weeks = weeks.nextSibling;
        }
        for (var i = 0, l = weeks.childNodes.length; i < l; i++) {
          if (weeks.childNodes[i].nodeType === $j.types.xmlNodeTypes.ELEMENT_NODE) {
            this._weeks[j] = weeks.childNodes[i];
            j++;
          }
        }
        this._months = content.nextSibling;
        while (this._months.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._months = this._months.nextSibling;
        }
        this._months.jsObj = this;
        this._decades = this._months.nextSibling;
        while (this._decades.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._decades = this._decades.nextSibling;
        }
        this._decades.jsObj = this;
        this._century = this._decades.nextSibling;
        while (this._century.nodeType !== $j.types.xmlNodeTypes.ELEMENT_NODE) {
          this._century = this._century.nextSibling;
        }
        this._century.jsObj = this;
      }
    },
    decDate: function (delta) {
      var obj=this.jsObj,data;
      if (!obj.isEnabled()) return;
      switch (obj.mode) {
        case $j.types.CalendarModes.YEARS:
          obj.curDate = obj.curDate.addYears(-1);
          obj._thisMonth.innerHTML=obj.curDate.getFullYear();
          break;
        case $j.types.CalendarModes.DECADES:
          obj.setMode($j.types.CalendarModes.YEARS);
          obj.curDate = obj.curDate.addYears(-10);
          obj.genereateMYDC();
          break;
        case $j.types.CalendarModes.CENTURIES:
          obj.setMode($j.types.CalendarModes.DECADES);
          obj.curDate = obj.curDate.addYears(-100);
          obj.genereateMYDC();
          break;
        default:
          obj.curDate = obj.curDate.addMonths(-1);
          obj.update();
          break;
      }
    },
    goToThisDay: function () {
      var obj = this.jsObj;
      if ($j.tools.isNull(obj)) obj=this;
      if (!obj.isEnabled()) return;
      obj.curDate = Date.now();
      obj.setMode($j.types.CalendarModes.DAYS);
      if ($j.browser.ie) obj._months.setAttribute("data-view",false);
      else obj._months.dataset.view=false;
      if ($j.browser.ie) obj._decades.setAttribute("data-view",false);
      else obj._decades.dataset.view=false;
      if ($j.browser.ie) obj._century.setAttribute("data-view",false);
      else obj._century.dataset.view=false;
      obj.update();
    },
    incDate: function (delta) {
      var obj=this.jsObj,data;
      if (!obj.isEnabled()) return;
      switch (obj.mode) {
        case $j.types.CalendarModes.YEARS:
          obj.curDate = obj.curDate.addYears(1);
          obj._thisMonth.innerHTML=obj.curDate.getFullYear();
          break;
        case $j.types.CalendarModes.DECADES:
          obj.setMode($j.types.CalendarModes.YEARS);
          obj.curDate = obj.curDate.addYears(10);
          obj.genereateMYDC();
          break;
        case $j.types.CalendarModes.CENTURIES:
          obj.setMode($j.types.CalendarModes.DECADES);
          obj.curDate = obj.curDate.addYears(100);
          obj.genereateMYDC();
          break;
        default:
          obj.curDate = obj.curDate.addMonths(1);
          obj.update();
          break;
      }
    },
    selectDay:function(mouseEventArgs) {
      var obj=this.jsObj,data;
      if (!obj.isEnabled()) return;
      if ($j.browser.ie) obj._lastSelectedDay.setAttribute("data-theme",obj.getThemeName());
      else obj._lastSelectedDay.theme=obj.getThemeName();
      $j.CSS.removeClass(obj._lastSelectedDay,"CalendarSelected");
      data=($j.browser.ie)?this.getAttribute("data-day"):this.dataset.day;
      if (!$j.tools.isNull(data)) obj.curDate.setDate(data);
      obj._lastSelectedDay=this;
      if ($j.browser.ie) obj._lastSelectedDay.setAttribute("data-theme",obj.getThemeName());
      else obj._lastSelectedDay.dataset.theme=obj.getThemeName();
      $j.CSS.addClass(obj._lastSelectedDay,"CalendarSelected");
    },
    selectMonth:function(mouseEventArgs) {
      var obj=this.jsObj,data;
      if (!obj.isEnabled()) return;
      data=($j.browser.ie)?this.getAttribute("data-month"):this.dataset.month;
      if (!$j.tools.isNull(data)) obj.curDate.setMonth(data);
      obj.setMode($j.types.CalendarModes.DAYS);
      $j.tools.events.bind(obj._months,$j.browser.vendorPrefix.split("-").join(String.empty)+"AnimationEnd",obj.animationEnd);
      if ($j.browser.ie) obj._months.setAttribute("data-view",false);
      else obj._months.dataset.view=false;
      data=($j.browser.ie)?this.getAttribute("data-month"):this.dataset.month;
      if (!$j.tools.isNull(data)) obj._thisMonth.innerHTML=$j.tools.getCulture().date.monthNames[data].firstCharUpper()+String.SPACE+obj.curDate.getFullYear();
      obj.update();
    },
    selectYear:function(mouseEventArgs) {
      var obj=this.jsObj,data;
      if (!obj.isEnabled()) return;
      data=($j.browser.ie)?this.getAttribute("data-year"):this.dataset.year;
      if (!$j.tools.isNull(data)) obj.curDate.setFullYear(data);
      obj.setMode($j.types.CalendarModes.YEARS);
      $j.tools.events.bind(obj._decades,$j.browser.vendorPrefix.split("-").join(String.empty)+"AnimationEnd",obj.animationEnd);
      if ($j.browser.ie) obj._decades.setAttribute("data-view",false);
      else obj._decades.dataset.view=false;
      obj._thisMonth.innerHTML = this.innerHTML;
    },
    selectDecades:function(mouseEventArgs) {
      var obj=this.jsObj,data;
      if (!obj.isEnabled()) return;
      data=($j.browser.ie)?this.getAttribute("data-decade"):this.dataset.decade;
      if (!$j.tools.isNull(data)) obj.curDate.setFullYear(data);
      obj.setMode($j.types.CalendarModes.YEARS);
      $j.tools.events.bind(obj._century,$j.browser.vendorPrefix.split("-").join(String.empty)+"AnimationEnd",obj.animationEnd);
      if ($j.browser.ie) obj._century.setAttribute("data-view",false);
      else obj._century.dataset.view=false;
      obj._thisMonth.innerHTML = this.innerHTML;
      obj.genereateMYDC();
    },
    animationEnd:function() {
      var data=($j.browser.ie)?this.getAttribute("data-view"):this.dataset.view;
      if (data==="false") {
        $j.CSS.addClass(this,"noDisplay");
        $j.tools.events.bind(this,$j.browser.vendorPrefix.split("-").join(String.empty)+"AnimationEnd",this.jsObj.animationEnd);
      }
    },
    viewMYDC: function () {
      var obj=this.jsObj,data;
      if (!obj.isEnabled()) return;
      if (obj.mode!==$j.types.CalendarModes.CENTURIES) obj.genereateMYDC();
    },
    genereateMYDC:function() {
      var i,l,div,data;
      switch (this.mode) {
        case $j.types.CalendarModes.YEARS:
          for (i=0,l=this._decades.childNodes.length;i<l;i++) {
            if (this._decades.childNodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
              $j.tools.events.unBind(this._decades.childNodes[i], $j.types.mouseEvents.CLICK, this.selectYear);
            }
          }
          this._decades.innerHTML = String.empty;
          if ($j.browser.ie) this._decades.setAttribute("data-view",true);
          else this._decades.dataset.view=true;
          this.setMode($j.types.CalendarModes.DECADES);
          l=this.curDate.getFullYear()-~~(this.curDate.getFullYear().toString().substr(3,1));
          for (i=l-1;i<l+11;i++) {
            div=$j.doc.createElement($j.types.HTMLElements.DIV);
            div.className="CalendarMDC "+(i===Date.now().getFullYear()?String.SPACE+"CalendarThis":String.empty)+(i===l-1||i===l+10?String.SPACE+"CalendarOutMonth":String.empty);
            if ($j.browser.ie) div.setAttribute("data-theme",this.getThemeName());
            else div.dataset.theme=this.getThemeName();
            if (i===this.curDate.getFullYear()) {
              div.className+=String.SPACE+"CalendarSelected";
            }
            div.innerHTML=i;
            if ($j.browser.ie) div.setAttribute("data-year",i);
            else div.dataset.year=i;
            div.jsObj=this;
            $j.tools.events.bind(div, $j.types.mouseEvents.CLICK, this.selectYear);
            this._decades.appendChild(div);
          }
          this._thisMonth.innerHTML=l+"-"+(l+9);
          break;
        case $j.types.CalendarModes.DECADES:
          var thisCentury=~~(this.curDate.getFullYear().toString().substr(0,2)+"00"),startCentury=thisCentury-10, endCentury=thisCentury+100;
          for (i=0,l=this._century.childNodes.length;i<l;i++) {
            if (this._century.childNodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
              $j.tools.events.unBind(this._century.childNodes[i], $j.types.mouseEvents.CLICK, this.selectCentury);
            }
          }
          this._century.innerHTML=String.empty;
          if ($j.browser.ie) this._century.setAttribute("data-view",true);
          else this._century.dataset.view=true;
          this.setMode($j.types.CalendarModes.CENTURIES);
          while (startCentury<endCentury) {
            div=$j.doc.createElement($j.types.HTMLElements.DIV);
            div.className="CalendarMDC CalendarMDCx2 "+(startCentury%thisCentury>100?String.SPACE+"CalendarOutMonth":String.empty);
            if ($j.browser.ie) div.setAttribute("data-theme",this.getThemeName());
            else div.dataset.theme=this.getThemeName();
            if (Date.now().getFullYear()>=startCentury&&Date.now().getFullYear()<=startCentury+9) {
              div.className+=String.SPACE+"CalendarThis";
            }
            if (this.curDate.getFullYear()>=startCentury&&this.curDate.getFullYear()<=startCentury+9) {
              div.className+=String.SPACE+"CalendarSelected";
            }
            div.innerHTML=startCentury+"<br />"+(startCentury+9);
            if ($j.browser.ie) div.setAttribute("data-decade",startCentury+~~(this.curDate.getFullYear().toString().substr(3,1)));
            else div.dataset.decade=startCentury+~~(this.curDate.getFullYear().toString().substr(3,1));
            div.jsObj=this;
            $j.tools.events.bind(div, $j.types.mouseEvents.CLICK, this.selectDecades);
            this._century.appendChild(div);
            startCentury+=10;
          }
          this._thisMonth.innerHTML = thisCentury+"-"+(endCentury-1);
          break;
        default:
          for (i=0,l=this._months.childNodes.length;i<l;i++) {
            if (this._months.childNodes[i].nodeType===$j.types.xmlNodeTypes.ELEMENT_NODE) {
              $j.tools.events.unBind(this._months.childNodes[i], $j.types.mouseEvents.CLICK, this.selectMonth);
            }
          }
          this._months.innerHTML = String.empty;
          if ($j.browser.ie) this._months.setAttribute("data-view",true);
          else this._months.dataset.view=true;
          this.setMode($j.types.CalendarModes.YEARS);
          for (i = 0; i < 12; i++) {
            div=$j.doc.createElement($j.types.HTMLElements.DIV);
            if ($j.browser.ie) div.setAttribute("data-theme",this.getThemeName());
            else div.dataset.theme=this.getThemeName();
            div.className="CalendarMDC "+(i===Date.now().getMonth()?String.SPACE+"CalendarThis":String.empty);
            if (i===this.curDate.getMonth()) {
              div.className+=String.SPACE+"CalendarSelected";
            }
            div.innerHTML=$j.tools.getCulture().date.abbreviatedMonthNames[i].firstCharUpper();
            if ($j.browser.ie) div.setAttribute("data-month",i);
            else div.dataset.month=i;
            div.jsObj=this;
            $j.tools.events.bind(div, $j.types.mouseEvents.CLICK, this.selectMonth);
            this._months.appendChild(div);
          }
          this._thisMonth.innerHTML = this.curDate.getFullYear();
          break;
      }
      if ($j.browser.ie) this.mode=this._DOMObj.getAttribute("data-mode");
      else this.mode=this._DOMObj.dataset.mode;
    },
    update: function () {
      var firstDay=this.curDate.getFirstDayOfMonth(),
          firstDayOfWeek=firstDay.day(),
          d=0,w=0,
          sdn=$j.tools.getCulture().date.shortestDayNames,div;
      if ($j.tools.isNull(this._DOMObj)) return;
      for (var i=0,l=this._weeks.length;i<l;i++) {
        for (var j=0,l1=this._weeks[i].childNodes.length;j<l1;j++) {
          $j.tools.events.unBind(this._weeks[i].childNodes[j], $j.types.mouseEvents.CLICK, this.selectDay);
        }
        this._weeks[i].innerHTML = String.empty;
      }
      this._weekDays.innerHTML = String.empty;
      this._thisMonth.innerHTML = String.empty;
      div=$j.doc.createElement($j.types.HTMLElements.DIV);
      if ($j.browser.ie) div.setAttribute("data-theme",this.getThemeName());
      else div.dataset.theme=this.getThemeName();
      div.className="CalendarWeekNum";
      div.innerHTML=$j.tools.getCulture().date.weekShortName;
      this._weekDays.appendChild(div);
      d = firstDayOfWeek;
      w = 0;
      while (w < 7) {
        div=$j.doc.createElement($j.types.HTMLElements.DIV);
        if ($j.browser.ie) div.setAttribute("data-theme",this.getThemeName());
        else div.dataset.theme=this.getThemeName();
        div.className="CalendarWeekDay";
        div.innerHTML=sdn[d].firstCharUpper();
        this._weekDays.appendChild(div);
        d++;
        if (d===7) d=0;
        w++;
      }
      this._thisMonth.innerHTML=$j.tools.getCulture().date.monthNames[this.curDate.getMonth()].firstCharUpper()+String.SPACE+this.curDate.year();
      firstDay = firstDay.getFirstDayOfWeek();
      w = d = 0;
      for (w = 0; w < this._weeks.length; w++) {
        div=$j.doc.createElement($j.types.HTMLElements.DIV);
        if ($j.browser.ie) div.setAttribute("data-theme",this.getThemeName());
        else div.dataset.theme=this.getThemeName();
        div.className="CalendarWeekNum";
        div.innerHTML=firstDay.week();
        this._weeks[w].appendChild(div);
        for (d=0;d<7;d++) {
          div=$j.doc.createElement($j.types.HTMLElements.DIV);
          if ($j.browser.ie) div.setAttribute("data-theme",this.getThemeName());
          else div.dataset.theme=this.getThemeName();
          div.className="CalendarDay";
          if (firstDay.getMonth()!==this.curDate.getMonth()) {
            div.className+=String.SPACE+"CalendarOutMonth";
          } else if (firstDay.getDate()===Date.now().getDate() && firstDay.getMonth()===Date.now().getMonth()) {
            div.className+=String.SPACE+"CalendarThisDay";
          }
          if (firstDay.getDate()===this.curDate.getDate()&&firstDay.getMonth()===this.curDate.getMonth()) {
            div.className+=String.SPACE+"CalendarSelected";
            this._lastSelectedDay=div;
          }
          div.innerHTML=firstDay.getDate();
          if ($j.browser.ie) div.setAttribute("data-day",firstDay.getDate());
          else div.dataset.day=firstDay.getDate();
          div.jsObj=this;
          $j.tools.events.bind(div, $j.types.mouseEvents.CLICK, this.selectDay);
          this._weeks[w].appendChild(div);
          firstDay = firstDay.addDays(1);
        }
      }
    },
    updateFromDOM: function () {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-date"):this._DOMObj.dataset.date;
      if (!$j.tools.isNull(data)) this.curDate=new Date(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-viewweeknum"):this._DOMObj.dataset.viewweeknum;
      if (!$j.tools.isNull(data)) this.viewWeeksNum=_conv.strToBool(data);
      this.update();
    }
    //#endregion
  });
  Object.seal(Calendar);
  $j.classes.register($j.types.categories.COMMON, Calendar);
  //#region Templates
  var CalendarTpl=["<div id='{internalId}' data-class='Calendar' data-name='{name}' class='Calendar' data-theme='{theme}' style='{style}' data-viewweeknum='false' data-date='{date}'>",
                   "<div class='CalendarContent' data-theme='{theme}'>",
                   "<div class='CalendarHeader' data-theme='{theme}'>",
                   "<div class='CalendarPrevMonth' data-theme='{theme}'><span></span></div>",
                   "<div class='CalendarNow' data-theme='{theme}' title='Aller à aujourd'hui'><span></span></div>",
                   "<div class='CalendarNextMonth' data-theme='{theme}'><span></span></div>",
                   "<div class='CalendarMonth' data-theme='{theme}'>Octobre 2014</div>",
                   "</div>",
                   "<div class='CalendarWeekDays' data-theme='{theme}'>",
                   "<div data-theme='{theme}' class='CalendarWeekNum'>se</div>",
                   "<div data-theme='{theme}' class='CalendarWeekDay'>Lu</div>",
                   "<div data-theme='{theme}' class='CalendarWeekDay'>Ma</div>",
                   "<div data-theme='{theme}' class='CalendarWeekDay'>Me</div>",
                   "<div data-theme='{theme}' class='CalendarWeekDay'>Je</div>",
                   "<div data-theme='{theme}' class='CalendarWeekDay'>Ve</div>",
                   "<div data-theme='{theme}' class='CalendarWeekDay'>Sa</div>",
                   "<div data-theme='{theme}' class='CalendarWeekDay'>Di</div>",
                   "</div>",
                   "<div class='CalendarWeeks' data-theme='{theme}'>",
                   "<div class='CalendarWeek CalendarFirstWeek Alternate' data-theme='{theme}'>",
                   "<div data-theme='{theme}' class='CalendarWeekNum'>40</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='29'>29</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='30'>30</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='1'>1</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='2'>2</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='3'>3</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='4'>4</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='5'>5</div>",
                   "</div>",
                   "<div class='CalendarWeek CalendarSecondWeek'>",
                   "<div data-theme='{theme}' class='CalendarWeekNum'>41</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='6'>6</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='7'>7</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarSelected' data-day='8'>8</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='9'>9</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='10'>10</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='11'>11</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='12'>12</div>",
                   "</div>",
                   "<div class='CalendarWeek CalendarThirdWeek Alternate' data-theme='{theme}'>",
                   "<div data-theme='{theme}' class='CalendarWeekNum'>42</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='13'>13</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='14'>14</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='15'>15</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='16'>16</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='17'>17</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='18'>18</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='19'>19</div>",
                   "</div>",
                   "<div class='CalendarWeek CalendarFourthWeek'>",
                   "<div data-theme='{theme}' class='CalendarWeekNum'>43</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='20'>20</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='21'>21</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='22'>22</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='23'>23</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='24'>24</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='25'>25</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='26'>26</div>",
                   "</div>",
                   "<div class='CalendarWeek CalendarFifthWeek Alternate' data-theme='{theme}'>",
                   "<div data-theme='{theme}' class='CalendarWeekNum'>44</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='27'>27</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='28'>28</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='29'>29</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='30'>30</div>",
                   "<div data-theme='{theme}' class='CalendarDay' data-day='31'>31</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='1'>1</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='2'>2</div>",
                   "</div>",
                   "<div class='CalendarWeek CalendarSixthWeek'>",
                   "<div data-theme='{theme}' class='CalendarWeekNum'>45</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='3'>3</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='4'>4</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='5'>5</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='6'>6</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='7'>7</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='8'>8</div>",
                   "<div data-theme='{theme}' class='CalendarDay CalendarOutMonth' data-day='9'>9</div>",
                   "</div>",
                   "</div>",
                   "</div>",
                   "<div class='CalendarMonths noDisplay' data-theme='{theme}' data-view='false'></div>",
                   "<div class='CalendarDecades noDisplay' data-theme='{theme}' data-view='false'></div>",
                   "<div class='CalendarCenturies noDisplay' data-theme='{theme}' data-view='false'></div>",
                   "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:Calendar,template:CalendarTpl}]);
  //endregion
})();