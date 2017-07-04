!function(e){function t(s){if(n[s])return n[s].exports;var i=n[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,s){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:s})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t){var n=Vue.component("task-textarea",{template:'<div>    <div class="task-info">残り {{todo_count}}/{{ count }} タスク. {{todo_sizes}}/{{ sizes }} 規模. [{{sepaMode.mode}}]</div>    <div id="editor"></div>  </div>',props:["tasks","line"],data:function(){return{count:0,todo_count:0,doing_count:0,done_count:0,sizes:0,todo_sizes:0,doing_sizes:0,done_sizes:0,text:"",sepaMode:this.judgeSepaMode(""),editor:null,beforeCursor:{row:-1,column:-1}}},watch:{tasks:function(){this.updateTasks()},line:function(){this.editor.gotoLine(this.line,this.beforeCursor.column),this.editor.focus()}},mounted:function(){var e=this;localStorage.text?e.text=localStorage.text:e.text=["テキストに書いたタスクがTreemapとして表示されるよ 35 Todo Aさん","フォーマットは[タスク名][規模][ステータス][アサイン]だよ 40 Todo","[規模][ステータス][アサイン]は省略可能だよ 30 Doing","ダブルクリックするとステータスが変わるよ 50 Todo Cさん","アサイン名をタスクにドラッグできるよ 60 Todo","タスクを選択すると対応するテキストにフォーカスするよ 70 Doing Aさん","カーソル位置に対応するタスクが選択されるよ 80 Done","Excelからコピペできるよ 55 Todo Aさん","区切りはタブとスペースに対応しているよ 45 Doing","ステータスがDoneになると残り規模が減るよ 35 Done Cさん","タスクはローカルストレージに保存されるよ 90 Done Bさん"].join("\n"),e.editor=ace.edit("editor"),e.editor.setTheme("ace/theme/chaos"),e.editor.getSession().setUseWrapMode(!0),e.editor.$blockScrolling=1/0,e.editor.session.setOptions({tabSize:2,useSoftTabs:!1}),e.editor.on("change",function(){e.text=e.editor.getValue(),e.updateText()}),e.editor.session.selection.on("changeCursor",function(t){var n=e.editor.selection.getCursor(),s=e.beforeCursor.row;e.beforeCursor=n,s!=n.row&&e.updateText()}),e.editor.setValue(e.text,-1)},methods:{getSizes:function(e){return 0==e.length?0:1==e.length?e[0].size:e.map(function(e){return e.size}).reduce(function(e,t){return e+t})},judgeSepaMode:function(e){return e.match(/\t/)?{mode:"tab",delim:"\t",reg:/^([^\t]+)([\t]+([\d\.]+)(([\t]+(\w+))([\t]+([^\t]+))?)?)?/}:{mode:"space",delim:" ",reg:/^(\S+)([ ]+([\d\.]+)(([ ]+(\S+))([ ]+(\S+))?)?)?/}},setTaskStatus:function(e){var t=this,n=e.filter(function(e){return null!=e.status&&e.status.match(/Doing/i)}),s=e.filter(function(e){return null!=e.status&&e.status.match(/Done/i)}),i=e.filter(function(e){return null==e.status||!e.status.match(/Done/i)});t.count=e.length,t.todo_count=i.length,t.doing_count=n.length,t.done_count=s.length,t.sizes=t.getSizes(e),t.todo_sizes=t.getSizes(i),t.doing_sizes=t.getSizes(n),t.done_sizes=t.getSizes(s)},updateText:function(){var e=this;localStorage&&(localStorage.text=e.text),e.sepaMode=e.judgeSepaMode(e.text);var t=e.editor.selection.getCursor(),n=e.text.split("\n").map(function(n,s){var i=n.match(e.sepaMode.reg);return null==i?null:{i:s+1,cursor:s==t.row,name:i[1],size:i[3]?Number(i[3]):1,status:i[6]?i[6]:"Todo",assignee:i[8]?i[8]:""}}).filter(function(e){return null!=e});e.setTaskStatus(n),e.$emit("update-tasks",{tasks:{children:n,line:t.row+1}})},updateTasks:function(){var e=this,t=e.sepaMode.delim,n=e.tasks.children,s=[],i=-1;n.forEach(function(e,n){s.push(e.name+t+e.size+t+e.status+t+(e.assignee?e.assignee:"")),e.cursor&&(i=n+1)}),e.text=s.join("\n"),e.editor.setValue(e.text,-1),e.editor.gotoLine(i,e.beforeCursor.column),e.editor.focus()}}});e.exports=n},function(e,t){var n=Vue.component("task-treemap",{template:'<div>    <div class="task-info">      <button v-on:click="hideDone=!hideDone">Done</button>      残り規模       <span class="user-info" v-for="user in users" draggable="true" @dragstart="dragstart(user, $event)" @dragend="dragend">        <span v-bind:class="user.class">{{user.name}} {{user.todo_sizes}}/{{user.sizes}}</span>      </span>    </div>    <div id="treemap"></div>  </div>',props:["tasks"],data:function(){return{ColorMax:9,users:[],draggingItem:null,hideDone:!1}},watch:{tasks:function(){this.setTasks()},hideDone:function(){this.update()}},mounted:function(){this.addResizeHandler()},methods:{setTasks:function(){this.update()},getColorNo:function(e){var t=this;return 0==e?0:e%t.ColorMax+1},getStatusColor:function(e){var t="#6aa43e";return null==e?t:e.match(/Done/i)?"#666666":e.match(/Doing/i)?"#149bdf":t},getSizes:function(e){return 0==e.length?0:1==e.length?e[0].size:e.map(function(e){return e.size}).reduce(function(e,t){return e+t})},getNextStatus:function(e){return null==e?"Doing":e.match(/Done/i)?"Todo":e.match(/Doing/i)?"Done":"Doing"},update:function(){var e=this;if(e.users=[],null!=e.tasks&&null!=e.tasks.children){var t=e.tasks.children,n={"":{id:0,children:[]}},s=0;t.forEach(function(e){var t=null!=e.assignee?e.assignee:"";null==n[t]?n[t]={id:++s,children:[e]}:n[t].children.push(e)});var i={name:"root_dir",children:Object.keys(n).map(function(t){return{name:t,children:n[t].children.filter(function(t){return!e.hideDone||!t.status.match(/Done/i)})}}).filter(function(e){return 0!=e.children.length})};e.users=i.children.map(function(t){return{name:t.name,class:"assignee-list-elem task-assignee assignee-"+e.getColorNo(n[t.name].id),sizes:e.getSizes(t.children),todo_sizes:e.getSizes(t.children.filter(function(e){return null==e.status||!e.status.match(/Done/i)}))}});var o=document.getElementById("treemap").clientHeight,r=document.getElementById("treemap").clientWidth,a=d3.layout.treemap().size([r,o]).value(function(e){return e.size});if(d3.select("#treemap").selectAll("div").remove(),0!=t.length){var u=d3.select("#treemap").selectAll("div").data(a.nodes(i));u.enter().append("div").on("click",function(t){e.$emit("select-task",{no:t.i})}).on("dblclick",function(n){n.status=e.getNextStatus(n.status);var s={children:null};s.children=t,e.$emit("update-tasks",{tasks:s})}).on("dragover",function(e){d3.event.preventDefault()}).on("drop",function(n){t.forEach(function(e){e.cursor=!1}),n.assignee=e.draggingItem.name,n.cursor=!0;var s={children:null};s.children=t,e.$emit("update-tasks",{tasks:s})}),u.exit().remove(),d3.select("#treemap").selectAll("div").attr("class","task-elem").style("left",function(e){return e.x+"px"}).style("top",function(e){return e.y+"px"}).style("width",function(e){return e.dx-6+"px"}).style("height",function(e){return e.dy-6+"px"}).style("background",function(t,n){return t.size?e.getStatusColor(t.status):"#333"}).style("border",function(e){return e.cursor?"solid 3px #f8e352":"solid 3px #333"}).style("color",function(e){return e.cursor?"firebrick":"black"}).style("left",function(e){return e.x+"px"}).html(function(t){return t.children?"":[t.assignee?'<div class="assignee-div"><span class="task-assignee assignee-'+e.getColorNo(n[t.assignee].id)+'">'+t.assignee+"</span></div>":"",'<div class="task-name">'+t.name+"</div>",'<div class="task-size">'+t.size+"</div>"].join("")})}}},dragstart:function(e,t){this.draggingItem=e,t.target.style.opacity=.5},dragend:function(e){e.target.style.opacity=1},addResizeHandler:function(){var e,t=this,n=Math.floor(1e3/60*10);window.addEventListener("resize",function(s){e!==!1&&clearTimeout(e),e=setTimeout(function(){t.update()},n)})}}});e.exports=n},function(e,t,n){n(1),n(0);new Vue({el:"#app",data:{tasks:null,textTasks:null,taskLine:0},methods:{updateTasks:function(e){this.tasks=e.tasks,this.setTaskLine(e.tasks)},updateTextTasks:function(e){this.textTasks=e.tasks,this.setTaskLine(e.tasks)},selectTask:function(e){this.taskLine=e.no},setTaskLine:function(e){var t=e.children.filter(function(e){return 1==e.cursor})[0];return t?void(this.taskLine=t.i):e.line?void(this.taskLine=e.line):void 0}}})}]);