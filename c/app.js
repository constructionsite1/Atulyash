(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var rupee=function(n){return '₹'+Math.round(n).toLocaleString('en-IN')};
var KG_PRICE=120;

/* Image fallbacks (Veer poses) */
$$('img[data-fallback]').forEach(function(img){img.addEventListener('error',function(){if(img.dataset.fallback&&img.src.indexOf(img.dataset.fallback)<0){img.src=img.dataset.fallback}},{once:true})});

/* Header border on scroll; the phone bottom bar stays put (Veer lives in it) */
var hdr=$('#hdr'), bar=$('#bar'), hero=$('.hero'), shopSec=$('#shop');
function onScroll(){
  hdr.classList.toggle('scrolled',window.scrollY>8);
  var show=!document.body.classList.contains('sheet-open');
  if(bar.classList.contains('show')!==show){bar.classList.toggle('show',show);setBarH()}
  drawPath();
}
function setBarH(){
  var vis=bar.classList.contains('show') && getComputedStyle(bar).display!=='none';
  document.documentElement.style.setProperty('--bar-h',vis?bar.offsetHeight+'px':'0px');
}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',function(){setBarH();drawPath()});

/* Reveal: elements below the fold start 22px low and settle; text stays visible throughout */
if(!reduce && 'IntersectionObserver' in window){
  var rvio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');rvio.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  $$('.rv').forEach(function(el){if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('pre');rvio.observe(el)}});
}

/* Freshness comparison */
$$('[data-age]').forEach(function(b){b.addEventListener('click',function(){
  $$('[data-age]').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
  var d=+b.dataset.age; $('#ageEmpty').hidden=true; var res=$('#ageResult'); var first=res.hidden; res.hidden=false;
  $('#ageText').textContent=b.dataset.ageText;
  var y=$('#barYours'), o=$('#barOurs');
  requestAnimationFrame(function(){requestAnimationFrame(function(){y.style.transform='scaleX('+Math.min(1,d/45)+')';o.style.transform='scaleX('+(1/45+0.012)+')'})});
  if(first) veerSay('habitPick');
})});

/* Accordion builder */
function accordion(container,items,render){
  items.forEach(function(it,i){
    var id=container.id+'-'+i, wrap=document.createElement('div'); wrap.className='q-item';
    wrap.innerHTML='<button class="q-btn" type="button" aria-expanded="false" aria-controls="'+id+'">'+render.head(it,i)+'<span class="q-sign" aria-hidden="true"></span></button><div class="q-panel" id="'+id+'" role="region"><div><div class="q-body">'+render.body(it,i)+'</div></div></div>';
    container.appendChild(wrap);
    var btn=wrap.querySelector('.q-btn'), panel=wrap.querySelector('.q-panel');
    btn.addEventListener('click',function(){var open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',open?'false':'true');panel.classList.toggle('open',!open)});
  });
}

/* Six questions + compromises */
var QS=[
 {t:'The wheat',q:'Is the wheat named, and from one origin?',often:'Wheat quality varies a lot. When different lots or varieties are blended, the atta can change from bag to bag.',way:'Single-origin MP Sharbati wheat. No blending with other varieties.'},
 {t:'The cleaning',q:'Was the grain cleaned thoroughly before milling?',often:'Whatever is not cleaned away goes into the chakki with the wheat.',way:'Multi-stage cleaning before every batch.'},
 {t:'The mill',q:'Natural stone, emery stone or steel rollers?',often:'"Stone-ground" does not always mean natural stone. Most chakkis, including neighbourhood ones, use emery stones made by bonding abrasive particles into discs. Large mills use steel rollers.',way:'Natural stone chakkis only.'},
 {t:'The speed',q:'Was it milled slowly, or fast for more output?',often:'Speed creates friction, friction creates heat, and heat can affect the grain’s natural oils, aroma and character.',way:'We mill slowly, so the process stays gentle and controlled.'},
 {t:'The chokar',q:'Is the natural chokar kept in?',often:'Chokar is often removed to make atta look smoother, last longer on the shelf, or to be sold separately.',way:'Chokar kept in. Nothing removed, nothing added.'},
 {t:'The freshness',q:'When was it milled?',often:'Once milled, atta’s natural oils meet the air and its aroma slowly changes. Most atta is made to travel and sit for weeks or months.',way:'Milled in small batches the day before delivery. After milling, handling is controlled and packing is automated in a clean space.'}
];
var qList=$('#qList'), checks=[];
if(qList) accordion(qList,QS,{
  head:function(it,i){return '<span class="q-num">'+(i+1)+'</span><span><span class="q-topic">'+it.t+'</span><span class="q-text">'+it.q+'</span></span>'},
  body:function(it,i){return '<p class="often">'+it.often+'</p><div class="q-way"><b>At Atulyash</b>'+it.way+'</div><label class="q-check"><input type="checkbox" data-q="'+i+'"> My packet tells me this</label>'}
});
$$('input[data-q]').forEach(function(c){c.addEventListener('change',function(){
  var n=$$('input[data-q]').filter(function(x){return x.checked}).length; $('#tally').textContent=n+' of 6'; if(window.ATL_onTally) window.ATL_onTally(n);
})});

/* Films */
var FILMS=[
 {id:'pj7Y9ffc7IQ',t:'Everyday food deserves extraordinary thought',k:'Full conversation',img:'img/asha.webp',feature:true},
 {id:'cua0_aQ-UY0',t:'How fresh should your atta really be?',k:'Short film',img:'img/film-freshness.webp'},
 {id:'PzP9nVrr2Tk',t:'Does the way atta is ground really matter?',k:'Short film',img:'img/film-grinding-method.webp'},
 {id:'rEaM-MX7zoc',t:'What high-speed milling does to atta',k:'Short film',img:'img/film-high-speed-milling.webp'},
 {id:'FTo3DuW3ksk',t:'Why should bran stay in your atta?',k:'Short film',img:'img/film-bran.webp'},
 {id:'Z2dWNr6ez7E',t:'How milling affects cost and quality',k:'Short film',img:'img/film-wheat-milling-cost-quality.webp'},
 {id:'QQWG7bTq18E',t:'Is gluten bad for everyone?',k:'Short film',img:'img/film-gluten.webp'}
];
if($('#films')) $('#films').innerHTML=FILMS.map(function(f){return '<a class="film'+(f.feature?' feature':'')+'" role="listitem" href="https://www.youtube.com/watch?v='+f.id+'" target="_blank" rel="noopener"><span class="film-thumb"><img src="'+f.img+'" alt="" loading="lazy"'+(f.feature?' style="object-position:center 20%"':'')+'><span class="play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>Watch</span></span><span class="t">'+f.t+'</span><span class="k">'+f.k+' · opens YouTube</span></a>'}).join('');

/* Shop */
var shop={mode:'weekly',kg:2};
var qtyEl=$('#qty');
[2,4,6,8].forEach(function(k){var b=document.createElement('button');b.type='button';b.className='chip';b.dataset.kg=k;b.textContent=k+' kg';qtyEl.appendChild(b);b.addEventListener('click',function(){shop.kg=k;renderShop()})});
$$('[data-mode]').forEach(function(b){b.addEventListener('click',function(){shop.mode=b.dataset.mode;renderShop()})});
function renderShop(){
  if(window.ATL_onShop) window.ATL_onShop(shop);
  $$('[data-mode]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.mode===shop.mode?'true':'false')});
  $$('[data-kg]').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.kg===shop.kg?'true':'false')});
  $('#price').textContent=rupee(shop.kg*KG_PRICE);
  $('#modeLine').textContent=shop.mode==='weekly'?'every week':'one time';
  $('#delivLine').textContent=shop.mode==='weekly'?'Weekly deliveries are free. No automatic billing.':'Any delivery charge for a one-time pack is shown in your bag before you pay.';
}
renderShop();
var DETAILS=[
 {h:'What is inside?',b:'100% MP Sharbati wheat atta. Nothing added. Natural chokar kept in.'},
 {h:'Milling and packing',b:'Slow-milled on natural stone chakkis in small batches, then packed carefully to keep it fresh.'},
 {h:'Freshness and delivery',b:'Your delivery date is confirmed before you pay. Your atta is milled the day before and delivered the next morning.'}
];
if($('#details')) accordion($('#details'),DETAILS,{head:function(it){return '<span class="q-text">'+it.h+'</span>'},body:function(it){return '<p>'+it.b+'</p>'}});

/* Bag state */
var bag=[], user=null, step='bag', chosenDay=null;
function bagCount(){return bag.reduce(function(s,i){return s+1},0)}
function addToBag(mode,kg){
  var ex=bag.filter(function(i){return i.mode===mode&&i.kg===kg})[0];
  if(!ex) bag.push({mode:mode,kg:kg});
  var c=$('#bagCount'); c.hidden=false; c.textContent=bag.length; c.classList.add('bump'); setTimeout(function(){c.classList.remove('bump')},260);
  $('#barCta').textContent='View bag ('+bag.length+')'; $('#barCta').setAttribute('href','#'); $('#barCta').dataset.open='bag';
}
$('#addBtn').addEventListener('click',function(){
  var btn=this,lbl=$('#addLbl'); addToBag(shop.mode,shop.kg);
  btn.classList.add('swap'); setTimeout(function(){lbl.textContent='Added to bag';btn.classList.remove('swap')},200);
  setTimeout(function(){btn.classList.add('swap');setTimeout(function(){lbl.textContent='Add to bag';btn.classList.remove('swap')},200)},2200);
  veerSay('added',true);
});
$$('[data-quick]').forEach(function(b){b.addEventListener('click',function(){addToBag(b.dataset.quick,2);step='bag';openSheet('bag',b)})});

function itemPrice(i){return i.kg*KG_PRICE}
function renderBag(){
  var body=$('#bagBody'), foot=$('#bagFoot'), h=$('#bag-h');
  if(!bag.length){
    h.textContent='My bag';
    body.innerHTML='<div class="empty"><img src="img/sack.webp" alt=""><p><b>Your bag is empty.</b><br><span class="muted">Begin with one fresh batch.</span></p><a class="btn btn-solid" href="#shop" data-close>Choose a quantity</a></div><div class="sample-note">Included with every pack: natural-stone milled, natural chokar kept in, delivery date confirmed first.</div>';
    foot.innerHTML=''; foot.hidden=true; return;
  }
  foot.hidden=false;
  var sub=bag.reduce(function(s,i){return s+itemPrice(i)},0), onceKg=bag.filter(function(i){return i.mode==='once'}).length;
  var welcome=Math.min(100,sub);
  if(step==='bag'){
    h.textContent='My bag ('+bag.length+')';
    body.innerHTML=bag.map(function(i,ix){return '<div class="line-item"><img src="img/pack.webp" alt=""><div><b>Atulyash Atta, '+i.kg+' kg</b><span class="small muted">'+(i.mode==='weekly'?'Every week · free delivery':'One time')+'</span><br><button class="rm" type="button" data-rm="'+ix+'">Remove</button></div><b>'+rupee(itemPrice(i))+'</b></div>'}).join('')+
      '<div class="sum"><div><span>Subtotal</span><span>'+rupee(sub)+'</span></div><div><span>Welcome saving</span><span>−'+rupee(welcome)+'</span></div><div><span>Delivery</span><span>'+(onceKg?'Shown at next step':'Free')+'</span></div><div class="tot"><span>To pay</span><span>'+rupee(sub-welcome)+'</span></div></div>'+
      '<details class="profile" style="margin-top:14px"><summary>Have a coupon?</summary><div style="display:flex;gap:8px;margin-top:10px"><label class="visually-hidden" for="coupon">Coupon code</label><input class="input" id="coupon" style="font-size:18px" placeholder="Coupon code"><button class="btn btn-line btn-sm" type="button" id="applyC" style="min-height:56px">Apply</button></div><p class="small muted" id="cMsg" style="margin-top:8px"></p></details>'+
      '<p class="sample-note">Design sample. No real order is placed.</p>';
    foot.innerHTML='<button class="btn btn-solid btn-block" type="button" id="toDelivery">'+(user?'Choose delivery day':'Continue')+'</button><p class="small muted" style="text-align:center;margin-top:8px">Questions? Call +91 98185 88996</p>';
    $$('[data-rm]',body).forEach(function(b){b.addEventListener('click',function(){bag.splice(+b.dataset.rm,1);updateBadge();renderBag()})});
    var ap=$('#applyC'); if(ap) ap.addEventListener('click',function(){$('#cMsg').textContent='Coupons are checked at payment on the real site.'});
    $('#toDelivery').addEventListener('click',function(){step=user?'day':'signin';renderBag()});
  } else if(step==='signin'){
    h.textContent='Sign in to continue';
    renderSignIn(body,foot,function(){step='day';renderBag()});
  } else if(step==='day'){
    h.textContent='Choose a delivery day';
    var days=[];for(var d=1;d<=3;d++){var dt=new Date();dt.setDate(dt.getDate()+d);days.push(dt)}
    if(!chosenDay) chosenDay=days[0].toDateString();
    body.innerHTML='<div class="step-pane on"><p class="muted">We mill your atta the day before and deliver in the morning.</p><div class="days" role="group" aria-label="Delivery day">'+days.map(function(dt){var k=dt.toDateString();return '<button class="chip" type="button" data-day="'+k+'" aria-pressed="'+(k===chosenDay)+'">'+dt.toLocaleDateString('en-IN',{weekday:'short'})+'<small>'+dt.toLocaleDateString('en-IN',{day:'numeric',month:'short'})+'</small></button>'}).join('')+'</div><p class="small muted" style="margin-top:14px">Delivering to the address on your account. You can change it at the next step on the real site.</p><p class="sample-note">Design sample. Dates are examples.</p></div>';
    $$('[data-day]',body).forEach(function(b){b.addEventListener('click',function(){chosenDay=b.dataset.day;$$('[data-day]',body).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})})});
    foot.innerHTML='<button class="btn btn-solid btn-block" type="button" id="toPay">Continue to payment</button><button class="link-btn" type="button" id="backBag" style="width:100%;justify-content:center">Back to bag</button>';
    $('#toPay').addEventListener('click',function(){step='pay';renderBag()});
    $('#backBag').addEventListener('click',function(){step='bag';renderBag()});
  } else if(step==='pay'){
    h.textContent='Payment';
    var total=sub-welcome;
    body.innerHTML='<div class="step-pane on"><div class="sum" style="margin-top:0"><div><span>Delivery</span><span>'+new Date(chosenDay).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})+'</span></div><div><span>Atulyash wallet balance</span><span>'+rupee(0)+'</span></div><div class="tot"><span>Add to wallet and pay</span><span>'+rupee(total)+'</span></div></div><p class="muted small" style="margin-top:14px">Orders are paid from your Atulyash wallet. Add money with UPI, card or net banking, and the order is placed straight after.</p><p class="sample-note">Design sample. No payment is taken.</p></div>';
    foot.innerHTML='<button class="btn btn-solid btn-block" type="button" id="payNow">Add '+rupee(total)+' and place order</button><button class="link-btn" type="button" id="backDay" style="width:100%;justify-content:center">Change delivery day</button>';
    $('#payNow').addEventListener('click',function(){step='done';renderBag();veerSay('ordered',true)});
    $('#backDay').addEventListener('click',function(){step='day';renderBag()});
  } else if(step==='done'){
    h.textContent='Order placed';
    body.innerHTML='<div class="empty step-pane on"><span class="done-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><h3>Thank you. Your atta will be milled fresh for '+new Date(chosenDay).toLocaleDateString('en-IN',{weekday:'long'})+'.</h3><p class="muted">We will confirm on SMS and WhatsApp.</p><p class="sample-note">This was a design sample. Nothing was ordered.</p></div>';
    foot.innerHTML='<button class="btn btn-line btn-block" type="button" id="finish">Done</button>';
    $('#finish').addEventListener('click',function(){bag=[];step='bag';chosenDay=null;updateBadge();closeSheet()});
  }
}
function updateBadge(){var c=$('#bagCount');c.textContent=bag.length;c.hidden=!bag.length;var cta=$('#barCta');if(bag.length){cta.textContent='View bag ('+bag.length+')'}else{cta.textContent='Order fresh atta';cta.setAttribute('href','#shop');delete cta.dataset.open}}

/* Sign in (SMS code) */
function renderSignIn(body,foot,onDone){
  body.innerHTML='<div class="step-pane on" id="si1"><p class="muted">We will send a 6-digit code by SMS. No password needed.</p><label class="field-label" for="mob">Mobile number</label><div class="phone-row"><span>+91</span><input class="input" id="mob" inputmode="numeric" autocomplete="tel-national" maxlength="10" placeholder="98765 43210"></div><p class="err" id="mobErr"></p></div>'+
   '<div class="step-pane" id="si2"><p class="muted" id="sentTo"></p><span class="field-label" id="otp-l">Enter the code</span><div class="otp" role="group" aria-labelledby="otp-l">'+[0,1,2,3,4,5].map(function(i){return '<input class="input" inputmode="numeric" maxlength="1" autocomplete="'+(i?'off':'one-time-code')+'" aria-label="Digit '+(i+1)+'">'}).join('')+'</div><p class="err" id="otpErr"></p><button class="link-btn" type="button" id="chgMob">Change number</button></div><p class="sample-note">Design sample: no SMS is sent. Any 6 digits will work.</p>';
  foot.innerHTML='<button class="btn btn-solid btn-block" type="button" id="siBtn">Send code</button>';
  var mob=$('#mob',body), btn=$('#siBtn',foot), stage=1, boxes=$$('.otp input',body);
  setTimeout(function(){mob.focus()},320);
  btn.addEventListener('click',function(){
    if(stage===1){var v=mob.value.replace(/\D/g,'');if(v.length!==10||!/^[6-9]/.test(v)){$('#mobErr',body).textContent='Enter a 10-digit mobile number starting with 6, 7, 8 or 9.';mob.focus();return}
      $('#mobErr',body).textContent='';stage=2;$('#si1',body).classList.remove('on');$('#si2',body).classList.add('on');$('#sentTo',body).textContent='Code sent to +91 '+v.slice(0,5)+' '+v.slice(5)+'.';btn.textContent='Verify and continue';setTimeout(function(){boxes[0].focus()},50)}
    else{var code=boxes.map(function(b){return b.value}).join('');if(!/^\d{6}$/.test(code)){$('#otpErr',body).textContent='Enter all 6 digits of the code.';return}
      user={mobile:mob.value.replace(/\D/g,'')};refreshAcct();onDone()}
  });
  boxes.forEach(function(b,i){
    b.addEventListener('input',function(){b.value=b.value.replace(/\D/g,'').slice(-1);if(b.value&&boxes[i+1])boxes[i+1].focus();if(boxes.every(function(x){return x.value}))btn.click()});
    b.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!b.value&&boxes[i-1])boxes[i-1].focus()});
    b.addEventListener('paste',function(e){var t=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);if(t.length){e.preventDefault();t.split('').forEach(function(ch,j){if(boxes[j])boxes[j].value=ch});(boxes[t.length]||boxes[5]).focus();if(t.length===6)btn.click()}});
  });
  $('#chgMob',body).addEventListener('click',function(){stage=1;$('#si2',body).classList.remove('on');$('#si1',body).classList.add('on');btn.textContent='Send code';mob.focus()});
  mob.addEventListener('keydown',function(e){if(e.key==='Enter')btn.click()});
}
function refreshAcct(){
  var l=user?'My Atulyash':'Sign in'; $('#acctLabel').textContent=l; $('#menuAcct').textContent=user?'My Atulyash':'Sign in to My Atulyash';
}
function renderAcct(){
  var body=$('#acctBody');
  if(!user){var foot=document.createElement('div');body.innerHTML='';var wrapB=document.createElement('div');body.appendChild(wrapB);body.appendChild(foot);foot.style.marginTop='16px';renderSignIn(wrapB,foot,function(){renderAcct()});return}
  body.innerHTML='<p class="muted">Signed in as +91 '+user.mobile.slice(0,5)+' '+user.mobile.slice(5)+'</p><ul class="menu-links" style="margin-top:12px"><li><a href="#" data-acct>My weekly plan <span aria-hidden="true">›</span></a></li><li><a href="#" data-acct>Orders and deliveries <span aria-hidden="true">›</span></a></li><li><a href="#" data-acct>Wallet <span aria-hidden="true">›</span></a></li><li><a href="#" data-acct>Addresses <span aria-hidden="true">›</span></a></li></ul><p class="sample-note">Design sample. These open the account pages on the real site.</p><button class="btn btn-line btn-block" type="button" id="signOut" style="margin-top:16px">Sign out</button>';
  $$('[data-acct]',body).forEach(function(a){a.addEventListener('click',function(e){e.preventDefault()})});
  $('#signOut').addEventListener('click',function(){user=null;refreshAcct();renderAcct()});
}

/* PIN check */
var NCR=['110','120','121','122','124','201'];
$('#pinForm').addEventListener('submit',function(e){
  e.preventDefault(); var v=$('#pinIn').value.replace(/\D/g,''), res=$('#pinRes');
  if(v.length!==6){$('#pinErr').textContent='Enter all 6 digits of your PIN code.';res.innerHTML='';return}
  $('#pinErr').textContent='';
  if(NCR.indexOf(v.slice(0,3))>-1){res.innerHTML='<div class="ok-msg"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:0 0 22px;margin-top:2px"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><div><b>Yes, we deliver to '+v+'.</b><br>Choose your atta and pick a delivery day at checkout.</div></div><a class="btn btn-solid btn-block" href="#shop" data-close style="margin-top:14px">Choose my atta</a>'}
  else{res.innerHTML='<div class="no-msg"><b>We do not deliver to '+v+' yet.</b><br>Leave your number and we will tell you when we do.</div><label class="field-label" for="notifyMob">Mobile number</label><input class="input" id="notifyMob" inputmode="numeric" maxlength="10" style="margin-top:10px"><label class="q-check" style="margin-top:6px"><input type="checkbox" id="notifyOk"> I agree to be contacted about delivery in my area.</label><button class="btn btn-solid btn-block" type="button" id="notifyBtn">Notify me</button><p class="err" id="notifyMsg"></p>';
    $('#notifyBtn').addEventListener('click',function(){var m=$('#notifyMob').value.replace(/\D/g,'');if(m.length!==10){$('#notifyMsg').textContent='Enter a 10-digit mobile number.';return}if(!$('#notifyOk').checked){$('#notifyMsg').textContent='Please tick the box so we can contact you.';return}$('#notifyMsg').style.color='var(--forest-900)';$('#notifyMsg').textContent='Thank you. We will let you know. (Design sample: nothing was saved.)'})}
  bindClosers(res);
});
$('#pinIn').addEventListener('input',function(){this.value=this.value.replace(/\D/g,'').slice(0,6)});
$('#locBtn').addEventListener('click',function(){
  var msg=$('#pinErr');
  if(!navigator.geolocation){msg.textContent='Location is not available here. Please type your PIN code.';return}
  navigator.geolocation.getCurrentPosition(function(){msg.textContent='Location found. On the real site this fills your PIN code.'},function(){msg.textContent='Location is not available here. Please type your PIN code.'},{timeout:6000});
});

/* Roti calculator */
var calc={rotis:8,extra:15};
var EXTRAS=[[15,'Sometimes'],[20,'Weekly'],[25,'Often'],[30,'Most days']];
var extEl=$('#extras');
EXTRAS.forEach(function(x){var b=document.createElement('button');b.type='button';b.className='chip';b.dataset.extra=x[0];b.innerHTML=x[1]+'<small>+'+x[0]+'%</small>';extEl.appendChild(b);b.addEventListener('click',function(){calc.extra=x[0];renderCalc()})});
$('#rotMinus').addEventListener('click',function(){calc.rotis=Math.max(1,calc.rotis-1);renderCalc()});
$('#rotPlus').addEventListener('click',function(){calc.rotis=Math.min(60,calc.rotis+1);renderCalc()});
var shownKg=null;
function animateNum(el,from,to){
  if(reduce||from===null){el.textContent=to.toFixed(2);return}
  var t0=performance.now(),dur=320;(function f(t){var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=(from+(to-from)*e).toFixed(2);if(p<1)requestAnimationFrame(f)})(t0);
}
function calcPlan(){var kg=calc.rotis*30*7*(1+calc.extra/100)/1000;var plan=[2,4,6,8].filter(function(p){return p>=kg})[0]||8;return {kg:kg,plan:plan,over:kg>8}}
function renderCalc(){
  $$('[data-extra]').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.extra===calc.extra?'true':'false')});
  $('#rotOut').innerHTML=calc.rotis+'<small>rotis a day</small>';
  var r=calcPlan(); animateNum($('#kgOut'),shownKg,r.kg); shownKg=r.kg;
  $('#kg4').textContent=(r.kg*4).toFixed(1);
  $('#usePlan').textContent='Choose '+r.plan+' kg every week';
  $('#calcHow').textContent=calc.rotis+' rotis × 30 g × 7 days, plus '+calc.extra+'% for extras. One medium roti uses about 30 g of atta. This is an estimate.'+(r.over?' For more than 8 kg a week, call us and we will set it up.':'');
}
renderCalc();
$('#usePlan').addEventListener('click',function(){var r=calcPlan();shop.mode='weekly';shop.kg=r.plan;renderShop();document.getElementById('shop').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){veerSay('planSet',true)},700)});
$$('[data-go="calc"]').forEach(function(b){b.addEventListener('click',function(){document.getElementById('calc').scrollIntoView({behavior:reduce?'auto':'smooth'})})});

/* Help */
var HELP=[
 {h:'Do you deliver to my area?',b:'We deliver with our own riders. Enter your PIN code to check. <button class="link-btn" type="button" data-open="pin">Check my PIN code</button>'},
 {h:'When will it reach me?',b:'You choose a delivery day at checkout, and it is confirmed before you pay. Your atta is milled the day before and delivered in the morning.'},
 {h:'How do I pay?',b:'Orders are paid from your Atulyash wallet. You add money with UPI, card or net banking at checkout.'},
 {h:'Is the weekly plan billed automatically?',b:'No. There is no automatic billing. Weekly deliveries are free.'},
 {h:'How should I store fresh atta?',b:'Keep it in a clean, dry, airtight container away from heat and sunlight, and use it within the week. That is why we deliver weekly.'},
 {h:'Will my rotis feel different?',b:'Atta with its chokar kept in has a little more texture and a fuller wheat taste. Most families adjust in a few days. If you are unsure, start with one 2 kg pack.'}
];
if($('#helpList')) accordion($('#helpList'),HELP,{head:function(it){return '<span class="q-text" style="font-size:22px">'+it.h+'</span>'},body:function(it){return '<p>'+it.b+'</p>'}});
if($('#copyNum')) $('#copyNum').addEventListener('click',function(){var b=this,n='+919818588996';var ok=function(){b.textContent='Copied'};var fail=function(){var r=document.createRange();r.selectNodeContents($('#careNum'));var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Number selected'};try{navigator.clipboard.writeText(n).then(ok,fail)}catch(e){fail()}setTimeout(function(){b.textContent='Copy number'},2200)});

/* Way path: line fills as you scroll through the six steps */
var path=$('#path'), pathLine=$('.path-line i'), steps=$$('#path li');
if(!pathLine) path=null;
function drawPath(){
  if(!path) return; var r=path.getBoundingClientRect(), vh=window.innerHeight, desk=window.innerWidth>=900;
  var p=desk?Math.min(1,Math.max(0,(vh*0.85-r.top)/(vh*0.5))):Math.min(1,Math.max(0,(vh*0.7-r.top)/r.height));
  if(reduce) p=r.top<vh?1:0;
  pathLine.style.setProperty('--p',p.toFixed(3));
  steps.forEach(function(li,i){li.classList.toggle('lit',p>=(i+0.35)/steps.length||(p>=1))});
}

/* Sheets */
var openId=null, lastFocus=null, backdrop=$('#backdrop');
function openSheet(id,from){
  if(openId) closeSheet(true);
  var s=document.getElementById(id); if(!s) return; lastFocus=from||document.activeElement; openId=id;
  if(id==='bag') renderBag(); if(id==='account') renderAcct();
  s.hidden=false; backdrop.hidden=false; document.body.classList.add('sheet-open'); document.body.style.overflow='hidden';
  bar.classList.remove('show'); setBarH(); veer.classList.add('away');
  requestAnimationFrame(function(){requestAnimationFrame(function(){s.classList.add('open');backdrop.classList.add('open')})});
  setTimeout(function(){var f=s.querySelector('input,button:not([data-close]),a[href]');if(f&&id!=='bag'&&id!=='account')f.focus();else s.querySelector('[data-close]').focus()},60);
}
function closeSheet(instant){
  if(!openId) return; var s=document.getElementById(openId); openId=null;
  s.classList.add('closing'); s.classList.remove('open'); backdrop.classList.remove('open');
  document.body.classList.remove('sheet-open'); document.body.style.overflow='';
  var done=function(){s.hidden=true;s.classList.remove('closing');if(!openId)backdrop.hidden=true};
  if(instant||reduce) done(); else setTimeout(done,250);
  if(!veerHidden) veer.classList.remove('away'); onScroll();
  if(lastFocus&&lastFocus.focus&&!instant) lastFocus.focus();
}
function bindClosers(root){$$('[data-close]',root).forEach(function(el){if(el._bc)return;el._bc=1;el.addEventListener('click',function(){closeSheet()})})}
document.addEventListener('click',function(e){var t=e.target.closest('[data-open]');if(t){e.preventDefault();var id=t.dataset.open;if(id==='bag')step=bag.length&&step==='done'?'bag':step;openSheet(id,t)}
  var c=e.target.closest('#bagBody [data-close], #pinRes [data-close]');if(c)closeSheet()});
bindClosers(document);
backdrop.addEventListener('click',function(){closeSheet()});
document.addEventListener('keydown',function(e){
  if(!openId) return; var s=document.getElementById(openId);
  if(e.key==='Escape'){closeSheet();return}
  if(e.key==='Tab'){var f=$$('a[href],button:not([disabled]),input,summary,[tabindex]:not([tabindex="-1"])',s).filter(function(x){return x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
});
/* Drag the sheet down to close (phone) */
$$('.sheet').forEach(function(s){
  var y0=null,t0=0,dy=0;
  s.addEventListener('touchstart',function(e){if(window.innerWidth>=900)return;var bd=s.querySelector('.sheet-bd');if(bd&&bd.scrollTop>0&&!e.target.closest('.sheet-hd,.sheet-grab'))return;y0=e.touches[0].clientY;t0=Date.now();dy=0;s.style.transition='none'},{passive:true});
  s.addEventListener('touchmove',function(e){if(y0===null)return;dy=e.touches[0].clientY-y0;if(dy<0)dy=dy*0.2;s.style.transform='translateY('+dy+'px)'},{passive:true});
  s.addEventListener('touchend',function(){if(y0===null)return;var v=Math.abs(dy)/(Date.now()-t0);s.style.transition='';s.style.transform='';if(dy>120||(dy>24&&v>0.11))closeSheet();y0=null});
});

/* Veer companion */
var veer=$('#veer'), bubble=$('#veerBubble'), vText=$('#veerText'), veerMe=$('#veerMe'), veerTab=$('#veerTab');
var veerHidden=false, said={}, hideT=null;
try{veerHidden=localStorage.getItem('atl-veer-hidden')==='1'}catch(e){}
/* Frame set: every file shares one canvas size, scale and foot line */
var FRAMES=['idle','blink','talk','wave','point','packet','roti','thumbs'], frameEl={}, pose='idle', blinkT=null, talkT=null;
FRAMES.forEach(function(n){var im=document.createElement('img');im.className='frame';im.alt='';im.src='img/veer/'+n+'.webp';im.decoding='async';$('#veerFrames').appendChild(im);frameEl[n]=im});
frameEl.idle.classList.add('on');
function show(n,fade){FRAMES.forEach(function(k){var el=frameEl[k];el.classList.toggle('fade',!!fade&&!reduce);el.classList.toggle('on',k===n)})}
function setPose(p){if(p===pose)return;pose=p;show(p,true)}
function blinkLoop(){clearTimeout(blinkT);blinkT=setTimeout(function(){if(pose==='idle'&&!talkT&&!reduce){show('blink');setTimeout(function(){if(pose==='idle'&&!talkT)show('idle')},130)}blinkLoop()},2600+Math.random()*2600)}
function talk(ms){if(reduce||pose!=='idle')return;var t0=Date.now(),open=false;clearInterval(talkT);talkT=setInterval(function(){if(Date.now()-t0>ms||pose!=='idle'){clearInterval(talkT);talkT=null;if(pose==='idle')show('idle');return}open=!open;show(open?'talk':'idle')},150)}
blinkLoop();
var LINES=Object.assign({
  hero:['wave','Namaste! I am Veer. I will walk with you. Tap me any time.'],
  habit:['point','Pick when you bought your bag. I am curious too.'],
  habitPick:['idle','See the difference? Fresh atta should be counted in days.'],
  questions:['packet','Bring your packet from the kitchen. Let us see what it tells you.'],
  way:['point','This is how every bag of ours is made, one step at a time.'],
  asha:['idle','Dr. Asha explains this far better than I can. The films are short.'],
  shop:['point','Not sure how much? The roti calculator just below works it out.'],
  calc:['idle','Count everyone at home, even the little ones.'],
  help:['idle','Still unsure? Call or WhatsApp us. We are happy to help.'],
  start:['roti','Fresh atta, soft rotis. Shall we begin?'],
  added:['thumbs','Added to your bag. Open the bag when you are ready.'],
  planSet:['thumbs','I have set your plan. Check it and add it to your bag.'],
  ordered:['thumbs','Wonderful. Your atta will be milled fresh for you.']
},window.ATL_LINES||{});
/* Tips Veer offers when tapped, after the line for the section you are in */
var TIPS=window.ATL_TIPS||[
  'Tap Bag at the top to see what you have chosen.',
  'Weekly deliveries are free, and there is no automatic billing.',
  'Your delivery date is confirmed before you pay.',
  'Questions? WhatsApp us on +91 98185 88996.'
], tipI=0;
function veerSay(key,force,text,poseName){
  if(veerHidden||openId) return;
  if(!text){ if(said[key]&&!force) return; var l=LINES[key]; if(!l) return; said[key]=1; poseName=l[0]; text=l[1] }
  vText.textContent=text; setPose(poseName||'idle'); bubble.classList.add('show'); shownAt=Date.now();
  if(pose==='idle') talk(Math.min(2400,600+text.length*25));
  if(!reduce&&pose!=='idle'){veerMe.classList.remove('hop');void veerMe.offsetWidth;veerMe.classList.add('hop')}
  clearTimeout(hideT); hideT=setTimeout(hideBubble,Math.max(6000,text.length*90));
}
function hideBubble(){clearTimeout(hideT);bubble.classList.remove('show');setTimeout(function(){if(!bubble.classList.contains('show'))setPose('idle')},300)}
/* Tapping the bubble closes it; tapping elsewhere also tucks it away so it never blocks a control */
bubble.addEventListener('click',function(e){if(!e.target.closest('#veerHide'))hideBubble()});
document.addEventListener('pointerdown',function(e){if(bubble.classList.contains('show')&&!e.target.closest('.veer')&&Date.now()-shownAt>600)hideBubble()},true);
function applyVeer(){veer.classList.toggle('away',veerHidden);veerTab.classList.toggle('show',veerHidden);document.body.classList.toggle('veer-off',veerHidden)}
applyVeer();
$('#veerHide').addEventListener('click',function(){hideBubble();veerHidden=true;try{localStorage.setItem('atl-veer-hidden','1')}catch(e){}applyVeer()});
veerTab.addEventListener('click',function(){veerHidden=false;try{localStorage.removeItem('atl-veer-hidden')}catch(e){}applyVeer();said={};veerSay('hero',true)});
/* A tap always gets an answer: the line for this section first, then useful tips in turn */
var lastTapKey=null;
veerMe.addEventListener('click',function(){
  var l=LINES[current];
  if(l&&lastTapKey!==current){lastTapKey=current;veerSay(current,true);return}
  veerSay(null,true,TIPS[tipI++%TIPS.length],'idle');
});
/* Veer stays with you the whole way. When you reach a new section he says its line once, shortly after you arrive */
var current='hero', sayT=null, shownAt=0;
if('IntersectionObserver' in window){
  var vio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.target.dataset.veer!==current){current=e.target.dataset.veer;lastTapKey=null;clearTimeout(sayT);sayT=setTimeout(function(){veerSay(current)},700)}})},{threshold:0,rootMargin:'-40% 0px -40% 0px'});
  $$('[data-veer]').forEach(function(s){vio.observe(s)});
}
setTimeout(function(){if(window.scrollY<200)veerSay('hero')},1200);

onScroll();
})();
