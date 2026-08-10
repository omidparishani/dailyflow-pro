let order=[],idx=0,t=0,int=null,times={};
const $=id=>document.getElementById(id);
function draw(){order=[...new Set($('names').value.split('\n').map(x=>x.trim()).filter(Boolean))].sort(()=>Math.random()-.5);idx=0;t=0;render()}
function render(){$('speaker').innerText=order[idx]||'پایان';$('next').innerText='نفر بعدی: '+(order[idx+1]||'-');$('list').innerHTML=order.map((n,i)=>'<li>'+n+' '+(times[n]?fmt(times[n]):'')+'</li>').join('')}
function start(){clearInterval(int);int=setInterval(()=>{t++;$('timer').innerText=fmt(t)},1000)}
function save(){if(order[idx])times[order[idx]]=t}
function pause(){clearInterval(int);save()}
function skip(){save();t=0;idx++;render();$('timer').innerText='00:00'}
function finish(){clearInterval(int);save();let total=Object.values(times).reduce((a,b)=>a+b,0);$('report').innerHTML=order.map((n,i)=>{let p=total?Math.round(times[n]/total*100):0;return n+' '+fmt(times[n]||0)+'<div class="bar" style="width:'+p+'%;background:hsl('+i*80+',70%,45%)">'+p+'%</div>'}).join('')}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}