window.fromIdx=1;
window.toIdx=-1;
window.curGallery=null;
window.requestAnimFrame=(function(){
  return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback,element){
            window.setTimeout(callback,16.66666666666667);
          };
  netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
})();
$(document).ready(function () {
  $("#demo_total").html($("#demos h5").length);
  $("#visualcontrols_total").html($("#visualcontrols li").length);
  $("#nonvisualcontrols_total").html($("#nonvisualcontrols li").length);
  $("#themes_total").html($("#themes h5").length);
  var el = document.getElementById("demo_prev");
  el.addEventListener("click", prev_gallery, false);
  el = document.getElementById("demo_next");
  el.addEventListener("click", next_gallery, false);
  var navbuts=document.getElementsByClassName("nav_but");
  for (var i=0,l=navbuts.length;i<l;i++) navbuts[i].addEventListener("click", changeGallery, false);
  el = document.getElementById("theme_prev");
  el.addEventListener("click", prev_gallery, false);
  el = document.getElementById("theme_next");
  el.addEventListener("click", next_gallery, false);
});
function next_gallery(e) {
  var el=e.target,p=el.parentNode,childs=p.getElementsByClassName("gallery_cont"),curEl,nxtEl=null;
  var divs=el.parentNode.getElementsByTagName("div"),lastDiv=divs[divs.length-1];
  for (var i=0,l=childs.length;i<l;i++) {
    if (childs[i].className==="gallery_cont") {
      curEl=childs[i];
      nxtEl=childs[i+1];
      if (i===l-2) $(lastDiv).addClass("hidden");
      else $(divs[0]).removeClass("hidden");
      break;
    }
  }
  move_left(curEl,nxtEl);
}
function prev_gallery(e) {
  var el=e.target,p=el.parentNode,childs=p.getElementsByClassName("gallery_cont"),curEl,prvEl=null;
  var divs=el.parentNode.getElementsByTagName("div"),lastDiv=divs[divs.length-1];
  for (var i=0,l=childs.length;i<l;i++) {
    if (childs[i].className==="gallery_cont") {
      curEl=childs[i];
      prvEl=childs[i-1];
      if (i===1) $(divs[0]).addClass("hidden");
      else $(lastDiv).removeClass("hidden");
      break;
    }
  }
  move_right(curEl,prvEl);
}
function move_right(curEl,prvEl) {
  var offset=(toIdx!==-1)?230:30;
  if (curEl.offsetLeft>=940) {
    $(curEl).addClass("pos_right");
    $("#navbut"+curEl.id).removeClass("selBut");
    prvEl.style.left="27px";
    $(prvEl).removeClass("pos_left");
    $("#navbut"+prvEl.id).addClass("selBut");
    if (toIdx!==-1) goToGallery();
    return;
  }
  curEl.style.left=(curEl.offsetLeft+offset)+"px";
  if (prvEl) prvEl.style.left=(curEl.offsetLeft-prvEl.offsetWidth-35)+"px";
  requestAnimFrame(function() { move_right(curEl,prvEl); });
}
function move_left(curEl,nxtEl) {
  var offset=(toIdx!==-1)?230:30;
  if (curEl.offsetLeft+curEl.offsetWidth<=0) {
    $(curEl).addClass("pos_left");
    $("#navbut"+curEl.id).removeClass("selBut");
    nxtEl.style.left="27px";
    $(nxtEl).removeClass("pos_right");
    $("#navbut"+nxtEl.id).addClass("selBut");
    if (toIdx!==-1) goToGallery();
    return;
  }
  curEl.style.left=(curEl.offsetLeft-offset)+"px";
  if (nxtEl) nxtEl.style.left=(curEl.offsetLeft+curEl.offsetWidth+35)+"px";
  requestAnimFrame(function() { move_left(curEl,nxtEl); });
}
function changeGallery(e) {
  var el=e.target;
  curGallery=el.parentNode.parentNode;
  fromIdx=parseInt(el.parentNode.getElementsByClassName("selBut")[0].dataset.idx,10);
  toIdx=parseInt(el.dataset.idx,10);
  goToGallery();
}
function goToGallery() {
  var button=curGallery.getElementsByClassName("nav_cont")[0];
  if (fromIdx===toIdx) {
    toIdx=-1;
    return;
  }
  if (fromIdx<toIdx) {
    fromIdx++;
    fireClick(button.getElementsByClassName("nav_next")[0]);
  } else if (fromIdx>toIdx) {
    fromIdx--;
    fireClick(button.getElementsByClassName("nav_prev")[0]);
  }
}
function fireClick(node){
	if ( document.createEvent ) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		node.dispatchEvent(evt);	
	} else if( document.createEventObject ) {
		node.fireEvent('onclick') ;	
	} else if (typeof node.onclick == 'function' ) {
		node.onclick();	
	}
}
