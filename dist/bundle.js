!function(e){function t(o){if(n[o])return n[o].exports;var a=n[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t){var n=Vue.component("task-textarea",{template:'<div>    <div class="sepa-mode">      <input type="radio" id="space" value="space" v-model="sepaMode">      <label for="space">Space</label>      <input type="radio" id="tab" value="tab" v-model="sepaMode">      <label for="tab">Tab</label>    </div>    <textarea v-model="text" placeholder="Title 30 Todo/Doing/Done Assignee"></textarea>  </div>',props:[],data:function(){return{sepaMode:"space",text:""}},watch:{sepaMode:function(){this.updateText()},text:function(){this.updateText()}},mounted:function(){this.text=["タスク1 30 Todo","タスク2 40 Todo","タスク3 50 Todo Cさん","タスク4 60 Todo","タスク5 70 Doing Aさん","タスク6 80 Done","タスク7 55 Todo Aさん","タスク8 45 Doing","タスク9 35 Done Cさん","タスク10 90 Done Bさん"].join("\n")},methods:{getReg:function(){return"space"==this.sepaMode?/(\S+)[ ]+([\d\.]+)([ ]+(\S+))?([ ]+(\S+))?/:/(.+)[\t]+([\d\.]+)([\t]+(\w+))?([\t]+(.+))?/},updateText:function(){var e=this,t=e.getReg(),n={children:null},o=e.text.split("\n").filter(function(e){return null!=e.match(t)}).map(function(e){var n=e.match(t);return{name:n[1],size:Number(n[2]),status:n[4]?n[4]:"Todo",assignee:n[6]}});n.children=o,e.$emit("update-tasks",{tasks:n})}}});e.exports=n},function(e,t){var n=Vue.component("task-treemap",{template:'<div id="treemap"></div>',props:["tasks"],data:function(){return{ColorMax:9}},watch:{tasks:function(){this.setTasks()}},methods:{setTasks:function(){this.update()},getColorNo:function(e){return e%(this.ColorMax-1)+1},getStatusColor:function(e){var t="rgb(152, 223, 138)";return null==e?t:e.match(/Done/i)?"rgb(199, 199, 199)":e.match(/Doing/i)?"rgb(174, 199, 232)":t},update:function(){for(var e=this,t=document.getElementById("treemap");t.firstChild;)t.removeChild(t.firstChild);if(null!=e.tasks&&null!=e.tasks.children&&0!=e.tasks.children.length){var n=e.tasks.children,o={"":{id:0,children:[]}},a=0;n.forEach(function(e){var t=null!=e.assignee?e.assignee:"";null==o[t]?o[t]={id:a++,children:[e]}:o[t].children.push(e)});var i={name:"root_dir",children:Object.keys(o).map(function(e){return{name:e,children:o[e].children}})},s=document.getElementById("treemap").clientHeight,r=document.getElementById("treemap").clientWidth,l=d3.layout.treemap().size([r,s]).value(function(e){return e.size});d3.select("#treemap").datum(i).selectAll("div").data(l.nodes).enter().append("div").style("left",function(e){return e.x+"px"}).style("top",function(e){return e.y+"px"}).style("width",function(e){return e.dx-2+"px"}).style("height",function(e){return e.dy-2+"px"}).style("background",function(t,n){return e.getStatusColor(t.status)}).style("position","absolute").style("overflow","hidden").style("border","solid 1px #333").style("padding","0px").on("click",function(e){console.log(e)}).html(function(t){return t.children?"":[t.assignee?'<div><span class="task-assignee assignee-'+e.getColorNo(o[t.assignee].id)+'">'+t.assignee+"</span></div>":"",'<div class="task-name">'+t.name+"</div>",'<div class="task-size">'+t.size+"</div>"].join("")})}}}});e.exports=n},function(e,t,n){n(1),n(0);new Vue({el:"#app",data:{tasks:null},methods:{updateTasks:function(e){this.tasks=e.tasks}}})}]);