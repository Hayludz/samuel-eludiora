// Shared scroll-reveal: rect-based so it works in every context (visible tabs get
// scroll-triggered animation; offscreen/throttled contexts still reveal everything).
// onReveal(el) runs once per element when it is revealed (for counters, bars, etc.).
export function initReveal(root, onReveal){
  if (!root) return function(){};
  root.classList.add('js-ready');
  const els = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
  function doEl(el){
    if (el._rev) return;
    el._rev = true;
    el.classList.add('seIn');
    if (onReveal){ try { onReveal(el); } catch(e){} }
  }
  function scan(){
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    for (let i=0;i<els.length;i++){
      const el = els[i];
      if (el._rev) continue;
      const r = el.getBoundingClientRect();
      if (r.top < vh*0.90 && r.bottom > -80) doEl(el);
    }
  }
  scan();
  window.addEventListener('scroll', scan, { passive:true });
  window.addEventListener('resize', scan);
  // settle passes for late layout/fonts
  setTimeout(scan, 250);
  setTimeout(scan, 800);
  // final safety: nothing stays hidden even if scroll never fires
  setTimeout(function(){ for (let i=0;i<els.length;i++) doEl(els[i]); }, 2600);
  return scan;
}
