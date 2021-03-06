(function() {
  /******************************************************************************/
  /*                                                                          */
  /*date.js cette partie définit les fonctions supplémentaires de l'objet Date*/
  /*                                                                          */
  /******************************************************************************/
  if (!Date.prototype.day) {
    Date.prototype.day=function(){ return this.getDate(); };
  }
  if (!Date.prototype.dayName) {
    Date.prototype.dayName=function(){ return Date.dayNames[this.getDay()]; };
  }
  if (!Date.prototype.shortDayName) {
    Date.prototype.shortDayName=function(){ return Date.dayNames[this.getDay()].substr(0,3); };
  }
  if (!Date.prototype.month) {
    Date.prototype.month=function(){ return this.getMonth()+1; };
  }
  if (!Date.prototype.monthName) {
    Date.prototype.monthName=function(){ return Date.monthNames[this.getMonth()]; };
  }
  if (!Date.prototype.shortMonthName) {
    Date.prototype.shortMonthName=function(){
      var cmonth=String.empty;
      var nmonth=this.getMonth();
      cmonth=Date.monthNames[nmonth];
      if ((nmonth===5)||(nmonth===6)) cmonth.remove(2,1);
      return cmonth.substr(0,3);
    };
  }
  if (!Date.prototype.year) {
    Date.prototype.year=function(){ return this.getFullYear(); };
  }
  if (!Date.prototype.hours) {
    Date.prototype.hours=function(){ return this.getHours(); };
  }
  if (!Date.prototype.minutes) {
    Date.prototype.minutes=function(){ return this.getMinutes(); };
  }
  if (!Date.prototype.seconds) {
    Date.prototype.seconds=function(){ return this.getSeconds(); };
  }
  if (!Date.prototype.milliseconds) {
    Date.prototype.milliseconds=function(){ return this.getMilliseconds(); };
  }
  if (!Date.prototype.addDays) {
    Date.prototype.addDays=function(d){
      d=d|0;
      var a=new Date(this.getFullYear(),this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
      a.setDate(this.getDate()+d);
      return a;
    };
  }
  if (!Date.prototype.addMonths) {
    Date.prototype.addMonths=function(m){
      m=m|0;
      var a=new Date(this.getFullYear(),this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
      if (a.getMonth()+m>11) {
        a.setMonth(0);
        a.setFullYear(a.getFullYear()+1);
      } else a.setMonth(a.getMonth()+m);
      return a;
    };
  }
  if (!Date.prototype.addYears) {
    Date.prototype.addYears=function(y){
      y=y|0;
      var a=new Date(this.getFullYear(),this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
      a.setFullYear(a.getFullYear()+y);
      return a;
    };
  }
  if (!Date.prototype.addHours) {
    Date.prototype.addHours=function(a){
      a=a|0;
      return this.addMilliseconds(a*3600000);
    };
  }
  if (!Date.prototype.addMinutes) {
    Date.prototype.addMinutes=function(a){
      a=a|0;
      return this.addMilliseconds(a*60000);
    };
  }
  if (!Date.prototype.addSeconds) {
    Date.prototype.addSeconds=function(a){
      a=a|0;
      return this.addMilliseconds(a*1000);
    };
  }
  if (!Date.prototype.addMilliseconds) {
    Date.prototype.addMilliseconds=function(m){
      m=m|0;
      var a=new Date(this.getFullYear(),this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
      a.setMilliseconds(a.getMilliseconds()+m);
      return a;
    };
  }
  if (!Date.prototype.compareTo) {
    Date.prototype.compareTo=function(a){
      if (!a) return false;
      if (a instanceof Date) return (this>a)?1:(this<a)?-1:0;
      else alert("Invalide Date (Date-compareTo)");
    };
  }
  //if (typeof Date.daysInMonth) {
  //  Date.daysInMonth=[[0,31,28,31,30,31,30,31,31,30,31,30,31],
  //      [0,31,29,31,30,31,30,31,31,30,31,30,31]];
  //}
  //if (typeof Date.dayNames) {
  //  Date.dayNames=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  //  Object.freeze(Date.dayNames);
  //}
  //if (typeof Date.monthNames) {
  //  Date.monthNames=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aôut',
  //                   'Septembre','Octobre','Novembre','Décembre'];
  //  Object.freeze(Date.monthNames);
  //}
  //if (typeof Date.shortMonthNames) {
  //  Date.shortMonthNames=['Janv.','Févr.','Mars','Avr.','Mai','Juin','Juil.','Aôut',
  //                        'Sept.','Oct.','Nov.','Déc.'];
  //  Object.freeze(Date.shortMonthNames);
  //}
  if (!Date.prototype.clearTime) {
    Date.prototype.clearTime=function(){
      this.setHours(0);
      this.setMinutes(0);
      this.setSeconds(0);
      this.setMilliseconds(0);
      return this;
    };
  }
  if (!Date.prototype.isLeapYear) {
    Date.prototype.isLeapYear=function(){
      var y=this.getFullYear();
      return ((($j.mod(y,4)===0)&&($j.mod(y,100) !== 0))||($j.mod(y,400)===0));
    };
  }
  /**
  *Determines if the current date instance is within a LeapYear.
  *@param {Number}   The year (0-9999).
  *@return {Boolean} true if date is within a LeapYear,otherwise false.
  */
  Date.isLeapYear=function(a) {
    a=a|0;
    return ((($j.mod(a,4)===0)&&($j.mod(a,100) !== 0))||($j.mod(a,400)===0));
  };
  /**
  *Gets the number of days in the month,given a year and month value. Automatically corrects for LeapYear.
  *@param {Number}   The year (0-9999).
  *@param {Number}   The month (0-11).
  *@return {Number}  The number of days in the month.
  */
  Date.getDaysInMonth=function(y,m) {
    y=y|0;
    m=m|0;
    return [31,(Date.isLeapYear(y)?29:28),31,30,31,30,31,31,30,31,30,31][m];
  }; 
  /**
  *Get the number of days in the current month,adjusted for leap year.
  *@return {Number}  The number of days in the month
  */
  if (!Date.prototype.getDaysInMonth) {
    Date.prototype.daysInMonth=function(){ return Date.getDaysInMonth(this.getFullYear(),this.getMonth()); };
  }
  if (!Date.prototype.equals) {
    Date.prototype.equals=function(a){ return (this.compareTo(a)===0); };
  }
  if (!Date.prototype.between) {
    Date.prototype.between=function(s,e){
      if (!s || !e) return;
      if (!s instanceof Date) return false;
      if (!e instanceof Date) return false;
      var t=this.getTime();
      return t>=s.getTime()&&t<=e.getTime();
    };
  }
  if (!Date.prototype.addWeeks) {
    Date.prototype.addWeeks=function(a){
      a=a|0;
      return this.addMilliseconds(a*604800000);
    };
  }
  if (!Date.prototype.JJMMAAAA) {
    Date.prototype.JJMMAAAA=function(a){
      if (!a) a="/";
      if (typeof a!==_const.STRING) a="/";
      return String(this.day()).padLeft(2,'0')+a+String(this.month()).padLeft(2,'0')+a+this.year();
    };
  }
  if (!Date.prototype.HHMMSS) {
    Date.prototype.HHMMSS=function(a){
      if (!a) a=":";
      if (typeof a!==_const.STRING) a=":";
      return String(this.hours()).padLeft(2,'0')+a+String(this.minutes()).padLeft(2,'0')+a+String(this.seconds()).padLeft(2,'0');
    };
  }
  if (!Date.prototype.getFirstDayOfMonth) {
    Date.prototype.getFirstDayOfMonth=function(){
      return new Date(this.getFullYear(), this.getMonth(), 1, 0, 0, 0, 0);
    };
  }
  Date.toDay=function() {
    return new Date().clearTime();
  };
  Date.now=function() { return new Date(); };
  // private
  Date.prototype._toString=Date.prototype.toString;
  if (!Date.prototype.clone) {
    Date.prototype.clone=function() {
       return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
    }
  }

  if (!Date.prototype.getFirstDayOfWeek) {
    Date.prototype.getFirstDayOfWeek=function() {
      var w=this.week(),d=this.clone(),w1=d.week();
      while (w===w1) {
        d=d.addDays(-1);
        w1=d.week();
      }
      d=d.addDays(1);
      return d;
    }
  }

  /**
  *Converts the value of the current Date object to its equivalent string representation.
  *Format Specifiers
  <pre>
  Format  Description                                                                  Example
  ------  ---------------------------------------------------------------------------  -----------------------
  s      The seconds of the minute between 1-59.                                      "1" to "59"
  ss     The seconds of the minute with leading zero if required.                     "01" to "59"
 
  m      The minute of the hour between 0-59.                                         "1"  or "59"
  mm     The minute of the hour with leading zero if required.                        "01" or "59"
 
  h      The hour of the day between 1-12.                                            "1"  to "12"
  hh     The hour of the day with leading zero if required.                           "01" to "12"
 
  H      The hour of the day between 1-23.                                            "1"  to "23"
  HH     The hour of the day with leading zero if required.                           "01" to "23"
 
  d      The day of the month between 1 and 31.                                       "1"  to "31"
  dd     The day of the month with leading zero if required.                          "01" to "31"
  ddd    Abbreviated day name. Date.CultureInfo.abbreviatedDayNames.                  "Mon" to "Sun" 
  dddd   The full day name. Date.CultureInfo.dayNames.                                "Monday" to "Sunday"
 
  M      The month of the year between 1-12.                                          "1" to "12"
  MM     The month of the year with leading zero if required.                         "01" to "12"
  MMM    Abbreviated month name. Date.CultureInfo.abbreviatedMonthNames.              "Jan" to "Dec"
  MMMM   The full month name. Date.CultureInfo.monthNames.                            "January" to "December"

  yy     Displays the year as a maximum two-digit number.                             "99" or "07"
  yyyy   Displays the full four digit year.                                           "1999" or "2007"
 
  t      Displays the first character of the A.M./P.M. designator.                    "A" or "P"
  Date.CultureInfo.amDesignator or Date.CultureInfo.pmDesignator
  tt     Displays the A.M./P.M. designator.                                           "AM" or "PM"
  Date.CultureInfo.amDesignator or Date.CultureInfo.pmDesignator
  </pre>
  *@param {String}   A format string consisting of one or more format spcifiers [Optional].
  *@return {String}  A string representation of the current Date object.
  */
  Date.prototype.toString=function(format) {
    //if (format===null) return String.empty;
    if (typeof format!==_const.STRING) format=String.empty;
    var p=function(s) {
          return (s.toString().length===1)?"0"+s:s;
        },self=this;
    return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,
    function (f) {
      if (f==="hh") return p(self.getHours()<13?self.getHours():(self.getHours()-12));
      else if (f==="h") return self.getHours()<13?self.getHours():(self.getHours()-12);
      else if (f==="HH") return p(self.getHours());
      else if (f==="H") return self.getHours();
      else if (f==="mm") return p(self.getMinutes());
      else if (f==="m") return self.getMinutes();
      else if (f==="ss") return p(self.getSeconds());
      else if (f==="s") return self.getSeconds();
      else if (f==="yyyy") return self.getFullYear();
      else if (f==="yy") return self.getFullYear().toString().substring(2,4);
      else if (f==="dddd") return self.getDayName();
      else if (f==="ddd") return self.getDayName(true);
      else if (f==="dd") return p(self.getDate());
      else if (f==="d") return self.getDate().toString();
      else if (f==="MMMM") return self.getMonthName();
      else if (f==="MMM") return self.getMonthName(true);
      else if (f==="MM") return p((self.getMonth()+1));
      else if (f==="M") return self.getMonth()+1;
      else if (f==="t") return self.getHours()<12?$j.currentCulture.am.substring(0,1):$j.currentCulture.pm.substring(0,1);
      else if (f==="tt") return self.getHours()<12?$j.currentCulture.am:$j.currentCulture.pm;
      else if (f==="zzz"||f==="zz"||f==="z") return String.empty;
    }
    ):this._toString();
  };
  
  if (!Date.prototype.yearDay) {
    Date.prototype.yearDay=function(){
      //var year=this.getFullYear();
      var month=this.getMonth(),day=this.getDate(),offset=[0,31,59,90,120,151,181,212,243,273,304,334],bissextile;
      //l'année bissextile n'est utile qu'à partir de mars
      bissextile=this.isLeapYear();  //(month<2)?0:(year % 400 == 0||(year % 4 == 0 && year % 100 != 0));
      return (day+offset[month]+bissextile)|0;
    };
  }
  //if (!Date.prototype.monday) {
  //  Date.prototype.monday=function(){
  //    var offset=$j.mod((this.getDay()+6),7);
  //    return new Date(this.getFullYear(),this.getMonth(),this.getDate()-offset);
  //  };
  //}
  //
  //if (!Date.prototype.getMonday) {
  //  Date.prototype.getMonday=function() {
  //    var day = this.getDay(),
  //        diff = this.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  //    return new Date(this.setDate(diff));
  //  }
  //}

  if (!Date.prototype.getYearDay) {
    Date.prototype.getYearDay = function ()
    {
      var here = new Date(this.getTime());
      here.setMonth(0, 1);
      return Math.round((this - here) / (60 * 60 * 24 * 1000));
    }
  }

  if (!Date.prototype.week) {
    Date.prototype.week=function(){
			var tempDate = new Date(this);
			tempDate.setDate(tempDate.getDate() - (tempDate.getDay() + 6) % 7 + 3);
			var dms = tempDate.valueOf();
			tempDate.setMonth(0);
			tempDate.setDate(4);
			return Math.round((dms - tempDate.valueOf()) / (604800000)) + 1;
    };
  }
  Date.isDate=function (a) {
    if (!a) return;
    // Cette fonction permet de vérifier la validité d'une date au format jj/mm/aa ou jj/mm/aaaa
    // Par Romuald
  
    // si la variable est vide on retourne faux
    if (a===String.empty) return false;
  
    var e=new RegExp("^[0-9]{1,2}\/[0-9]{1,2}\/([0-9]{2}|[0-9]{4})");
  
    // On teste l'expression régulière pour valider la forme de la date
    if (!e.test(a)) return false; // Si pas bon,retourne faux
  
    // On sépare la date en 3 variables pour vérification,parseInt() converti du texte en entier
    d=[];
    d[0]=(a.split("/")[0])|0; // jour
    d[1]=(a.split("/")[1])|0; // mois
    d[2]=(a.split("/")[2])|0; // année
  
    // Si l'année n'est composée que de 2 chiffres on complète automatiquement
    if (d[2]<1000) {
      if (d[2]<89) d[2]+=2000; // Si a<89 alors on ajoute 2000 sinon on ajoute 1900
      else d[2]+=1900;
    }
  
    // Définition du dernier jour de février
    // Année bissextile si annnée divisible par 4 et que ce n'est pas un siècle,ou bien si divisible par 400
    if ($j.mod(d[2],4)===0 && $j.mod(d[2],100)!==0||$j.Mod(d[2],400)===0) d[3]=29;
    else d[3]=28;
  
    // Nombre de jours pour chaque mois
    d[4]=new Array(31,d[3],31,30,31,30,31,31,30,31,30,31);
    e=null;
    a=null;
    // Enfin,retourne vrai si le jour est bien entre 1 et le bon nombre de jours,idem pour les mois,sinon retourn faux
    return (d[1]>=1&&d[1]<=12&&d[0]>=1&&d[0]<=d[4][d[1]-1]);
  };
  
  Date.dateExists=function (a) {
    if ($j.tools.isNull(a)) return false;
    if (typeof a!==_const.STRING) return false;
    var d=a.split("/"),c=d[0]+d[1]+d[2];
    if (a.length!==10||a.charAt(2)!=="/"||a.charAt(5)!=="/") return false;
    for (var x=0,l=d.length;x<l;x++) if (c.charAt(x)<"0"||c.charAt(x)>"9") return false;
    x=null;
    c=null;
    return (d[1]>12||d[0]>new Date(d[2],d[1],0).getDate())?false:true;
  };
  //Date.fromString=function(strDate,dateSep,dateFormat) {
  //  if (strDate===null) return false;
  //  if (typeof strDate!==_const.STRING) return false;
  //  if (dateSep===null) dateSep="/";
  //  var d=a.split(dateSep),c=d[0]+d[1]+d[2];
  //
  //};
})();