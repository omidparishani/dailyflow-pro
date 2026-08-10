
let order=[],index=0,seconds=0,interval=null,times={};
const $=x=>document.getElementById(x);

function fmt(s){
 return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")
}
function names(){
 return [...new Set($("names").value.split("\n").map(x=>x.trim()).filter(Boolean))]
}
function render(){
 $("current").textContent=order[index]||"پایان";
 $("next").textContent="نفر بعدی: "+(order[index+1]||"ندارد");
 $("list").innerHTML=order.map((n,i)=>`<li>${i+1}. ${n} ${times[n]?fmt(times[n]):""}</li>`).join("");
}
function draw(){
 order=names().sort(()=>Math.random()-.5);
 index=0;seconds=0;times={};render();
}
function save(){
 if(order[index]) times[order[index]]=seconds;
}
$("start").onclick=()=>{
 clearInterval(interval);
 interval=setInterval(()=>{
  seconds++;
  $("timer").textContent=fmt(seconds);
 },1000)
}
$("pause").onclick=()=>{
 clearInterval(interval);save();render();
}
$("skip").onclick=()=>{
 save();seconds=0;index++;
 $("timer").textContent="00:00";
 render();
}
$("finish").onclick=()=>{
 clearInterval(interval);
 save();
 let total=Object.values(times).reduce((a,b)=>a+b,0);
 $("report").innerHTML=order.map((n,i)=>{
  let p=total?Math.round((times[n]||0)*100/total):0;
  return `<div><b>${n}</b> - ${fmt(times[n]||0)}
  <div class="bar" style="width:${p}%;background:hsl(${i*65},70%,45%)">${p}%</div></div>`
 }).join("");
}
$("draw").onclick=draw;
render();
