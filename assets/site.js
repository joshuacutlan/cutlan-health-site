/* scroll bar + nav blur + reveal */
var bar=document.getElementById('bar'),hd=document.getElementById('hd');
addEventListener('scroll',function(){var h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;bar.style.width=p+'%';hd.classList.toggle('scrolled',h.scrollTop>16);});
(function(){var els=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});els.forEach(function(e){io.observe(e);});})();

/* ===== Quote funnel ===== */
var W3F_KEY="7ffefe64-442b-4c91-855e-443a1e4a228f";
var STEPS=[
 {key:"coverage",label:"Step 1 of 5 · Coverage",q:"What do you need covered?",sub:"So I know where to start.",opts:["Just health insurance","Health + dental & vision","I'm not sure yet"]},
 {key:"who",label:"Step 2 of 5 · Who",q:"Who is this for?",sub:"",opts:["Just me","Me + my spouse/partner","My whole family","My business or team"]},
 {key:"timing",label:"Step 3 of 5 · Timing",q:"How soon do you need it?",sub:"",opts:["As soon as possible","Within the next 30 days","Just exploring for now"]},
 {key:"age",label:"Step 4 of 5 · Age",q:"What's your age range?",sub:"Rates vary by age — this helps me quote accurately.",opts:["Under 30","30–44","45–54","55–64","65 or older"]},
 {key:"details",label:"Step 5 of 5 · Details",q:"Where should Josh send your free quote?",sub:"No spam, ever. Usually a same-day reply.",form:true}
];
var data={},cur=0;
var ov=document.getElementById('ov'),mbody=document.getElementById('mbody'),mstep=document.getElementById('mstep'),mfill=document.getElementById('mfill'),mx=document.getElementById('mx');

function openQuote(){cur=0;data={};ov.classList.add('open');document.body.style.overflow='hidden';render();}
function closeQuote(){ov.classList.remove('open');document.body.style.overflow='';}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

function render(){
 var s=STEPS[cur];
 mstep.textContent=s.label;
 mfill.style.width=((cur+1)/STEPS.length*100)+"%";
 var h='<h3>'+esc(s.q)+'</h3>'+(s.sub?'<p class="h-sub">'+esc(s.sub)+'</p>':'');
 if(s.form){
   h+='<div class="err" id="merr">Please complete the required fields.</div>';
   h+='<input id="f_name" placeholder="Full name" autocomplete="name">';
   h+='<input id="f_email" type="email" placeholder="Email" autocomplete="email">';
   h+='<input id="f_phone" type="tel" placeholder="Phone" autocomplete="tel">';
   h+='<input id="f_state" placeholder="Your state" autocomplete="address-level1">';
   h+='<label class="consent"><input type="checkbox" id="f_consent"><span>I agree to be contacted by phone, text, or email about my request. Consent is not a condition of purchase.</span></label>';
   h+='<button class="btn btn-gold full" id="msubmit">Get My Free Quote →</button>';
   h+='<div class="m-nav"><button class="m-back" id="mback">← Back</button><span></span></div>';
 } else {
   h+='<div class="opts">';
   s.opts.forEach(function(o,i){h+='<button class="opt" data-v="'+esc(o)+'">'+esc(o)+'</button>';});
   h+='</div>';
   if(cur>0) h+='<div class="m-nav"><button class="m-back" id="mback">← Back</button><span></span></div>';
 }
 mbody.innerHTML=h;
 // wire options
 var opts=mbody.querySelectorAll('.opt');
 opts.forEach(function(b){b.addEventListener('click',function(){data[s.key]=b.getAttribute('data-v');next();});});
 var back=document.getElementById('mback');
 if(back) back.addEventListener('click',prev);
 var sub=document.getElementById('msubmit');
 if(sub) sub.addEventListener('click',submit);
 var fn=document.getElementById('f_name'); if(fn) fn.focus();
}
function next(){if(cur<STEPS.length-1){cur++;render();}}
function prev(){if(cur>0){cur--;render();}}

function submit(){
 var name=document.getElementById('f_name').value.trim();
 var email=document.getElementById('f_email').value.trim();
 var phone=document.getElementById('f_phone').value.trim();
 var state=document.getElementById('f_state').value.trim();
 var consent=document.getElementById('f_consent').checked;
 var err=document.getElementById('merr');
 if(!name||!email||!phone||!consent){err.style.display='block';return;}
 data.name=name;data.email=email;data.phone=phone;data.state=state;
 var btn=document.getElementById('msubmit');btn.textContent='Sending…';btn.disabled=true;
 var msg="New quote request from cutlanhealth.com\n\n"+
   "Name: "+name+"\nEmail: "+email+"\nPhone: "+phone+"\nState: "+(state||"—")+"\n\n"+
   "Coverage: "+(data.coverage||"—")+"\nWho for: "+(data.who||"—")+"\nTiming: "+(data.timing||"—")+"\nAge range: "+(data.age||"—");
 var payload={access_key:W3F_KEY,subject:"New Quote Request — "+name,from_name:"Cutlan Health Solutions Website",
   name:name,email:email,phone:phone,state:state,coverage:data.coverage,who_for:data.who,timing:data.timing,age_range:data.age,message:msg};
 fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)})
  .then(function(r){return r.json();})
  .then(function(res){ if(res.success){done(name);} else {btn.textContent='Get My Free Quote →';btn.disabled=false;err.textContent='Something went wrong — please call or text (813) 601-6884.';err.style.display='block';} })
  .catch(function(){btn.textContent='Get My Free Quote →';btn.disabled=false;err.textContent='Something went wrong — please call or text (813) 601-6884.';err.style.display='block';});
}
function done(name){
 mstep.textContent='Done';mfill.style.width='100%';
 mbody.innerHTML='<div class="success"><div class="tick">✓</div><h3>Thanks, '+esc(name.split(' ')[0])+'!</h3><p class="h-sub">Your request is in. I\'ll personally reach out — usually the same day — with your real options. Need it faster?</p><a href="tel:+18136016884" class="btn btn-gold full" style="margin-bottom:10px;">📞 Call or Text (813) 601-6884</a><button class="btn btn-ghost full" id="mdone">Close</button></div>';
 document.getElementById('mdone').addEventListener('click',closeQuote);
}
/* triggers */
document.querySelectorAll('.js-quote').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openQuote();});});
mx.addEventListener('click',closeQuote);
ov.addEventListener('click',function(e){if(e.target===ov)closeQuote();});
addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('open'))closeQuote();});
/* open the quote form from links like /?quote=1 or #quote on any page */
if(/[?&]quote=1/.test(location.search)||location.hash==='#quote'){openQuote();}
