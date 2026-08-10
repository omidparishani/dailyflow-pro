let order = [];
let currentIndex = 0;

let timer = 0;
let interval = null;

let speakingTimes = {};
let history = JSON.parse(localStorage.getItem("dailyflow_history")) || [];

let colors = {};

const $ = id => document.getElementById(id);



function formatTime(seconds){

    let m = Math.floor(seconds / 60);
    let s = seconds % 60;

    return String(m).padStart(2,"0")
        + ":"
        + String(s).padStart(2,"0");

}



function getNames(){

    return [
        ...new Set(
            $("names")
            .value
            .split("\n")
            .map(x=>x.trim())
            .filter(Boolean)
        )
    ];

}




function randomColor(name){

    if(!colors[name]){

        colors[name] =
        `hsl(${Math.random()*360},70%,50%)`;

    }

    return colors[name];

}




function render(){

    let current =
    order[currentIndex] || "پایان";

    $("current").innerHTML =
    "🎤 " + current;


    $("timer").innerHTML =
    formatTime(timer);



    let next =
    order[currentIndex+1]
    ||
    "ندارد";


    $("next").innerHTML =
    next;



    $("orderList").innerHTML =
    order.map((name,index)=>{


        let active =
        index===currentIndex
        ?
        "active"
        :
        "";


        return `

        <li class="${active}">

        ${index+1} -
        ${name}

        <span>
        ${
        formatTime(
        speakingTimes[name] || 0
        )
        }
        </span>

        </li>

        `;


    }).join("");



}




function draw(){

    let names=getNames();


    order =
    names.sort(
        ()=>Math.random()-0.5
    );


    currentIndex=0;

    timer=0;

    speakingTimes={};


    localStorage.setItem(
        "dailyflow_order",
        JSON.stringify(order)
    );


    render();

}





function saveCurrentTime(){

    let name =
    order[currentIndex];


    if(!name)
    return;



    speakingTimes[name] =
    (speakingTimes[name] || 0)
    +
    timer;


}





function stopTimer(){

    clearInterval(interval);

    interval=null;

}




$("start").onclick=()=>{


    stopTimer();


    interval=setInterval(()=>{

        timer++;

        render();


    },1000);


};





$("pause").onclick=()=>{


    saveCurrentTime();

    stopTimer();

    timer=0;

    render();


};





$("skip").onclick=()=>{


    saveCurrentTime();


    stopTimer();


    timer=0;


    currentIndex =
    Math.min(
        currentIndex+1,
        order.length-1
    );


    render();


};





$("back").onclick=()=>{


    saveCurrentTime();


    stopTimer();


    timer=0;


    currentIndex =
    Math.max(
        currentIndex-1,
        0
    );


    render();


};





$("finish").onclick=()=>{


    saveCurrentTime();

    stopTimer();



    let total =
    Object.values(
        speakingTimes
    )
    .reduce(
        (a,b)=>a+b,
        0
    );



    $("report").innerHTML =

    order
    .map(name=>{


        let time =
        speakingTimes[name] || 0;


        let percent =
        total
        ?
        Math.round(
        time*100/total
        )
        :
        0;



        return `

        <div class="reportRow">


        <b>
        ${name}
        </b>


        <span>
        ${formatTime(time)}
        </span>


        <div class="progress">


        <div class="bar"
        style="
        width:${percent}%;
        background:${randomColor(name)}
        ">

        ${percent}%

        </div>


        </div>


        </div>

        `;


    })
    .join("");



    saveHistory();


};







function saveHistory(){


    history.unshift({

        date:
        new Date()
        .toLocaleString("fa-IR"),


        order,
        speakingTimes


    });



    history =
    history.slice(0,10);



    localStorage.setItem(
        "dailyflow_history",
        JSON.stringify(history)
    );


    renderHistory();

}





function renderHistory(){


$("history").innerHTML =


history.map((item,index)=>{


return `


<div class="historyItem">


<b>
جلسه ${index+1}
</b>


<br>


${item.date}


<br>


<button onclick="showHistory(${index})">

مشاهده

</button>


</div>


`;


}).join("");



}





window.showHistory=function(index){


let item=history[index];


$("report").innerHTML =


item.order.map(name=>{


return `

<div>

${name}

-

${formatTime(
item.speakingTimes[name]||0
)}

</div>

`;

}).join("");



};






$("draw").onclick=draw;




$("themeBtn").onclick=()=>{


document.body.classList.toggle(
"dark"
);


localStorage.setItem(
"dark",
document.body.classList.contains("dark")
);


};





if(
localStorage.getItem("dark")
==="true"
){

document.body.classList.add("dark");

}




renderHistory();

render();