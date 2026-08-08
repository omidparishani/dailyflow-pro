const $=id=>document.getElementById(id), fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
let order=[],current=0,drawing=false;
const names=$("names");
function getNames(){return [...new Set(names.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean))]}
function updateCount(){$("count").textContent=fa(getNames().length)+" نفر"}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(t){let x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function render(){
 if(!order.length){$("empty").classList.remove("hidden");$("order").innerHTML="";$("nextPanel").classList.add("hidden");$("status").textContent="برای شروع قرعه‌کشی کن.";return}
 $("empty").classList.add("hidden");
 $("order").innerHTML=order.map((n,i)=>`<li class="${i===current?"current":""} ${i<current?"done":""}" style="animation-delay:${i*35}ms"><span class="num">${fa(i+1)}</span><span class="person">${esc(n)}</span>${i===current?'<span class="badge">در حال صحبت</span>':i<current?'<span class="badge">✓ تمام شد</span>':""}</li>`).join("");
 if(current<order.length){$("nextPanel").classList.remove("hidden");$("nextName").textContent=order[current];$("nextBtn").textContent=current===order.length-1?"✓ پایان":"▶ شروع صحبت";$("status").textContent=`${fa(current+1)} از ${fa(order.length)} نفر`}
 else{$("nextPanel").classList.add("hidden");$("status").textContent="همه صحبت کردند 🎉"}
}
function historyRender(){
 let h=JSON.parse(localStorage.getItem("df_history")||"[]");
 $("history").innerHTML=h.length?h.map(x=>`<div class="history-item"><strong>${esc(x.order.join(" → "))}</strong><span>${esc(x.date)}</span></div>`).join(""):'<p>هنوز قرعه‌کشی‌ای ثبت نشده.</p>';
}
function saveHistory(){
 let h=JSON.parse(localStorage.getItem("df_history")||"[]");
 h.unshift({order,date:new Date().toLocaleString("fa-IR",{dateStyle:"short",timeStyle:"short"})});
 localStorage.setItem("df_history",JSON.stringify(h.slice(0,12)));
}
async function draw(){
 if(drawing)return;let n=getNames();if(n.length<2){toast("حداقل دو نفر وارد کن.");return}
 drawing=true;$("empty").classList.add("hidden");$("order").innerHTML="";$("nextPanel").classList.add("hidden");$("roulette").classList.remove("hidden");
 let pool=shuffle(n),last=JSON.parse(localStorage.getItem("df_last")||"null");
 if($("avoidRepeat").checked&&last&&pool[0]===last.first&&pool.length>1)[pool[0],pool[1]]=[pool[1],pool[0]];
 let cycles=Math.min(22,Math.max(10,n.length*4)),i=0;
 let timer=setInterval(()=>{$("rouletteName").textContent=pool[i%n.length];i++},70);
 await new Promise(r=>setTimeout(r,Math.max(1200,cycles*70)));clearInterval(timer);
 order=pool;current=0;drawing=false;$("roulette").classList.add("hidden");
 localStorage.setItem("df_last",JSON.stringify({first:order[0],date:new Date().toISOString()}));saveHistory();render();historyRender();toast("ترتیب امروز آماده شد ✨");
}
$("drawBtn").onclick=draw;$("nextBtn").onclick=()=>{if(current<order.length)current++;render()};$("resetBtn").onclick=()=>{current=0;render()};
names.oninput=()=>{updateCount();localStorage.setItem("df_names",names.value)};
$("clearBtn").onclick=()=>{names.value="";updateCount();render();localStorage.removeItem("df_names")};
$("sampleBtn").onclick=()=>{names.value="علی\nمحمد\nسارا\nرضا\nامیر";updateCount();localStorage.setItem("df_names",names.value)};
$("clearHistory").onclick=()=>{localStorage.removeItem("df_history");historyRender();toast("تاریخچه حذف شد")};
$("themeBtn").onclick=()=>{document.documentElement.classList.toggle("dark");let dark=document.documentElement.classList.contains("dark");localStorage.setItem("df_dark",dark);$("themeBtn").textContent=dark?"☀":"☾"};
if(localStorage.getItem("df_names"))names.value=localStorage.getItem("df_names");
if(localStorage.getItem("df_dark")==="true"){document.documentElement.classList.add("dark");$("themeBtn").textContent="☀"}
$("today").textContent=new Date().toLocaleDateString("fa-IR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
updateCount();render();historyRender();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
