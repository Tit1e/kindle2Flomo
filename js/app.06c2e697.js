(function(t){function e(e){for(var i,a,c=e[0],r=e[1],l=e[2],d=0,p=[];d<c.length;d++)a=c[d],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&p.push(o[a][0]),o[a]=0;for(i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i]);u&&u(e);while(p.length)p.shift()();return s.push.apply(s,l||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],i=!0,c=1;c<n.length;c++){var r=n[c];0!==o[r]&&(i=!1)}i&&(s.splice(e--,1),t=a(a.s=n[0]))}return t}var i={},o={app:0},s=[];function a(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=i,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)a.d(n,i,function(e){return t[e]}.bind(null,i));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],r=c.push.bind(c);c.push=e,c=c.slice();for(var l=0;l<c.length;l++)e(c[l]);var u=r;s.push([1,"chunk-vendors"]),n()})({0:function(t,e){},"0130":function(t,e,n){"use strict";n("c1d4")},1:function(t,e,n){t.exports=n("56d7")},10:function(t,e){},11:function(t,e){},12:function(t,e){},13:function(t,e){},14:function(t,e){},15:function(t,e){},16:function(t,e){},17:function(t,e){},18:function(t,e){},"1a12":function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id="1a12"},"1c26":function(t,e,n){var i={"./build":"f885","./build.js":"f885","./clean":"f83a","./clean.js":"f83a","./configure":"8f0e","./configure.js":"8f0e","./info":"53b3","./info.js":"53b3","./install":"3b09","./install.js":"3b09","./node-pre-gyp":"95bb","./node-pre-gyp.js":"95bb","./package":"42e9","./package.js":"42e9","./pre-binding":"c2bf","./pre-binding.js":"c2bf","./publish":"96ac","./publish.js":"96ac","./rebuild":"efb3","./rebuild.js":"efb3","./reinstall":"39b2","./reinstall.js":"39b2","./reveal":"4997","./reveal.js":"4997","./testbinary":"5c9e","./testbinary.js":"5c9e","./testpackage":"4791","./testpackage.js":"4791","./unpublish":"012f","./unpublish.js":"012f","./util/abi_crosswalk":"63e9","./util/abi_crosswalk.json":"63e9","./util/compile":"99ca","./util/compile.js":"99ca","./util/handle_gyp_opts":"b608","./util/handle_gyp_opts.js":"b608","./util/napi":"3d34","./util/napi.js":"3d34","./util/nw-pre-gyp/index.html":"a716","./util/nw-pre-gyp/package":"4ca4","./util/nw-pre-gyp/package.json":"4ca4","./util/s3_setup":"606e","./util/s3_setup.js":"606e","./util/versioning":"f3dc","./util/versioning.js":"f3dc"};function o(t){var e=s(t);return n(e)}function s(t){if(!n.o(i,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return i[t]}o.keys=function(){return Object.keys(i)},o.resolve=s,t.exports=o,o.id="1c26"},"1cb7":function(t,e,n){"use strict";n("dcb8")},2:function(t,e){},3:function(t,e){},"3cd6":function(t,e,n){},4:function(t,e){},"4a26":function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id="4a26"},5:function(t,e){},"56d1":function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{id:"app","element-loading-text":t.loadingText}},[n("options",{attrs:{list:t.contentList,"tmp-list":t.tmpList},on:{submit:t.submit,parse:t.confirmFirstParse,reverse:t.reverseList,"list-update":t.listUpdate,"update-tag":t.updateTag,reset:t.reset}}),n("div",{staticClass:"editor radio flex-v"},[n("selected-text",{attrs:{selected:t.checkedMemo.length,total:t.contentList.length,"import-count":t.importCount,disabled:t.disabled},on:{change:t.checkAllChange}}),n("div",{staticClass:"flex-1 overauto"},[n("draggable",t._b({staticClass:"list-group",attrs:{tag:"ul",disabled:t.dragDisabled},on:{start:function(e){t.drag=!0},end:function(e){t.drag=!1}},model:{value:t.contentList,callback:function(e){t.contentList=e},expression:"contentList"}},"draggable",t.dragOptions,!1),[n("transition-group",{attrs:{type:"transition",name:t.drag?null:"flip-list"}},t._l(t.contentList,(function(e,i){return n("content-card",{key:e.text+i,staticClass:"list-group-item",attrs:{input:e.text,check:e.checked,edit:e.isEdit,info:e,disabled:t.disabled},on:{"update:input":function(n){return t.$set(e,"text",n)},"update:check":function(n){return t.$set(e,"checked",n)},"update:edit":function(n){return t.$set(e,"isEdit",n)}}})})),1)],1)],1)],1)],1)},s=[],a=n("ade3"),c=(n("4de4"),n("99af"),n("d81d"),n("ac1f"),n("1276"),n("a15b"),n("6829")),r=n.n(c),l=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"content-card"},[n("div",{staticClass:"checkbox"},[n("label",{staticClass:"label",class:t.disabled?"disabled":""},[n("i",{staticClass:"el-icon-success",class:t.checked?"active":""}),n("el-checkbox",{attrs:{disabled:t.disabled},model:{value:t.checked,callback:function(e){t.checked=e},expression:"checked"}})],1)]),n("div",{staticClass:"priview radio",on:{dblclick:t.handleEdit}},[t.isEdit?[n("el-input",{attrs:{type:"textarea",autosize:"",rows:5},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}}),n("div",{staticClass:"pt-10 text-right"},[n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.submit}},[t._v("完成")])],1)]:n("pre",[t._v(t._s(t.content))])],2)])},u=[],d={name:"ContentCard",props:{info:{type:Object,default:function(){return{}}},disabled:{type:Boolean,default:!1}},data:function(){return{content:this.info.text,checked:this.info.checked,isEdit:this.info.isEdit}},watch:{info:{handler:function(t){var e=t.checked,n=t.text,i=t.isEdit;this.content=n,this.checked=e,this.isEdit=i},deep:!0},isEdit:function(t){this.$emit("update:edit",t)},checked:function(t){this.$emit("update:check",t)}},methods:{handleEdit:function(){var t=this,e=localStorage.getItem("canDrag")||"0";"0"===e?this.$alert("有 MEMO 在编辑模式时，列表无法进行拖动排序。","提示",{confirmButtonText:"知道了，不再提示",callback:function(e){localStorage.setItem("canDrag","1"),t.$emit("update:edit",!0)}}):this.$emit("update:edit",!0)},submit:function(){this.$emit("update:edit",!1),this.$emit("update:input",this.content)}}},p=d,f=(n("daba"),n("2877")),h=Object(f["a"])(p,l,u,!1,null,"8e15e820",null),m=h.exports,b=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"options radio"},[n("div",{staticClass:"top"},[n("el-form",{ref:"form",attrs:{model:t.options,"label-width":"80px",size:"mini","label-suffix":"：","label-position":"top"}},[n("el-form-item",{attrs:{label:"Api"}},[n("el-input",{attrs:{type:"password","show-password":"",placeholder:"API 采用本地存储"},model:{value:t.options.api,callback:function(e){t.$set(t.options,"api",e)},expression:"options.api"}})],1),n("el-form-item",{attrs:{"label-width":"0"}},[n("el-upload",{staticStyle:{width:"100%"},attrs:{id:"fileSelect","show-file-list":!1,multiple:!1,action:"","auto-upload":!1,accept:".html,.txt"}},[n("div",{staticClass:"upload-content radio flex pd-10 border"},[n("i",{staticClass:"el-icon-folder-add"}),n("div",{staticClass:"el-upload__text"},[t._v(" 选择 HTML / TXT 文件 ")])])]),n("div",{staticClass:"how"},[n("i",{staticClass:"el-icon-question"}),n("a",{attrs:{href:"https://mp.weixin.qq.com/s/CPIYoGItJVWJGk30MoVNXA",target:"_blank"}},[t._v("如何导出 HTML？")]),n("el-tooltip",{attrs:{effect:"dark",placement:"right"}},[n("div",{attrs:{slot:"content"},slot:"content"},[n("div",{staticClass:"pb-10"},[t._v(" 将 Kindle 通过数据线连接至电脑 ")]),n("div",[t._v(" 文件位于：Kindle根目录 - document - My Clippings.txt ")])]),n("span",{staticClass:"pointer"},[t._v("My Clippings.txt 在哪？")])])],1)],1),t.isElectron?n("el-form-item",{attrs:{"label-width":"0"}},[n("div",{staticClass:"pointer text-center border pd-10 radio",on:{click:t.importNotes}},[t._v(" 从 Apple Books 导入 ")])]):n("el-form-item",{attrs:{"label-width":"0"}},[n("div",{staticClass:"pointer text-center border pd-10 radio"},[n("el-tooltip",{attrs:{effect:"dark",placement:"right"}},[n("div",{attrs:{slot:"content"},slot:"content"},[t._v(" 由于 Apple Books 笔记存储类型限制，只能通过安装应用读取。 "),n("br"),t._v(" 文件访问密码：47if ")]),n("a",{attrs:{href:"https://wwr.lanzoui.com/b02c3nkyf",target:"_blank"}},[t._v(" 从 Apple Books 导入 ")])])],1),n("a",{staticClass:"how",attrs:{href:"https://evolly.one/2021/05/30/158-mac-handle-bad-app/",target:"_blank"}},[t._v(" Kindle2Flomo.app 打不开？ ")])]),t.bookList.length?n("el-form-item",{attrs:{label:"选择书籍"}},[n("el-select",{on:{change:t.selectChange},model:{value:t.options.book,callback:function(e){t.$set(t.options,"book",e)},expression:"options.book"}},t._l(t.bookList,(function(t,e){return n("el-option",{key:t.index,attrs:{label:t.title,value:t.title}})})),1)],1):t._e(),n("el-form-item",{attrs:{label:"书名"}},[n("el-input",{attrs:{clearable:""},model:{value:t.options.title,callback:function(e){t.$set(t.options,"title",e)},expression:"options.title"}})],1),n("el-form-item",{attrs:{label:"Tag"}},[n("div",{staticClass:"flex"},[n("div",{staticClass:"flex-1"},[n("el-input",{attrs:{disabled:t.options.noTag,clearable:""},model:{value:t.options.tag,callback:function(e){t.$set(t.options,"tag",e)},expression:"options.tag"}})],1),n("div",{staticClass:"flex-1 pl-10"},[n("el-checkbox",{model:{value:t.options.noTag,callback:function(e){t.$set(t.options,"noTag",e)},expression:"options.noTag"}},[t._v("隐藏 tag")])],1)])]),t.options.noTag?t._e():[n("el-form-item",{attrs:{label:"Tag 位置"}},[n("el-switch",{attrs:{"active-text":"顶部","inactive-text":"底部"},model:{value:t.options.tagPosition,callback:function(e){t.$set(t.options,"tagPosition",e)},expression:"options.tagPosition"}})],1)],n("el-form-item",{attrs:{label:""}},[n("span",{attrs:{slot:"label"},slot:"label"},[n("el-tooltip",{staticClass:"item",attrs:{effect:"dark",placement:"left"}},[n("div",{staticStyle:{width:"200px","line-height":"1.5em"},attrs:{slot:"content"},slot:"content"},[t._v(" 如导入内容含有自己添加的笔记，请使用移动端 APP 导出 HTML 或 My Clippings.txt ")]),n("i",{staticClass:"el-icon-warning"})]),t._v(" 笔记位置： ")],1),n("el-switch",{attrs:{"active-text":"摘录上方","inactive-text":"摘录下方"},model:{value:t.options.notePosition,callback:function(e){t.$set(t.options,"notePosition",e)},expression:"options.notePosition"}})],1),n("el-form-item",{attrs:{label:"分隔符"}},[n("el-input",{attrs:{placeholder:"为空以空行填充，此空行无法禁用",clearable:""},model:{value:t.options.split,callback:function(e){t.$set(t.options,"split",e)},expression:"options.split"}}),n("span",{staticClass:"fz-12"},[t._v("分隔符"),n("b",{staticClass:"highlight"},[t._v("仅在有笔记时生效")]),t._v("，且总在笔记与摘录之间")])],1),n("el-form-item",{attrs:{label:"空行设置"}},[n("div",{staticClass:"flex"},[n("div",{staticClass:"flex-1 pl-10"},[n("el-checkbox",{on:{change:t.onlyTagChange},model:{value:t.options.onlyTag,callback:function(e){t.$set(t.options,"onlyTag",e)},expression:"options.onlyTag"}},[t._v("仅 Tag 前 / 后")])],1),n("div",{staticClass:"flex-1 pl-10"},[n("el-checkbox",{attrs:{disabled:t.options.onlyTag},model:{value:t.options.noEmptyLine,callback:function(e){t.$set(t.options,"noEmptyLine",e)},expression:"options.noEmptyLine"}},[t._v("禁用")])],1)])]),n("el-form-item",{attrs:{label:"列表顺序"}},[n("el-switch",{attrs:{"active-text":"倒序","inactive-text":"顺序"},on:{change:t.reverse},model:{value:t.options.reverse,callback:function(e){t.$set(t.options,"reverse",e)},expression:"options.reverse"}})],1)],2)],1),n("div",{staticClass:"bottom"},[n("el-button",{attrs:{type:"primary",size:"mini",disabled:!t.tmpList.length},on:{click:t.parse}},[t._v("解析")]),n("el-button",{attrs:{type:"primary",disabled:t.disabledSend,size:"mini"},on:{click:t.submit}},[t._v("导入 Flomo")])],1)])},g=[],v=n("5530"),x=(n("7db0"),n("b0c0"),n("498a"),n("a630"),n("3ca3"),n("53ca"));n("5319"),n("159b"),n("c740");function k(t){var e=Object(x["a"])(t);return"function"===e||"object"===e&&!!t}function y(t){if(!k(t))return t;for(var e,n,i=1,o=arguments.length;i<o;i++)for(n in e=arguments[i],e)t[n]=e[n];return t}function _(t){return-1!==t.indexOf("标注")?1:-1!==t.indexOf("笔记")||-1!==t.indexOf("书签")?2:void 0}var T={split_created:function(t){t=t.split("|").map((function(t){return t.trim()}));try{var e=/添加于\s+(\d{4})年(\d+)月(\d+)日.*(上|下)午(\d+):(\d+):(\d+)$/,n=e.exec(t[1]),i=+n[5],o="上"===n[4]?i:i+12===24?0:i+12,s=n[6],a=n[7],c=t[0].substr(2),r=c.replace(/[^0-9]/gi,""),l=_(c);return{type:l,position:1===l?c:r,note:"",date:new Date(n[1]+" "+n[2]+" "+n[3]+" "+o+":"+s+":"+a)}}catch(u){return{note:"",position:"",date:""}}},split_book:function(t){t=t.replace(/（/g,"(").replace(/）/g,")");try{var e=/(.+)\((.+)\)/,n=e.exec(t);return{book:n[1].trim(),author:n[2].trim()}}catch(i){console.log(i)}}};function O(t){this.position="",this.book="",this.author="",this.date=null,this.content="",this.texts=t,this.type="",this.init()}function C(t){t=t.split("==========").filter((function(t){return t}));var e=[],n=[];t.map(E).forEach((function(t){t&&(1===t.type&&t.content&&n.push(t),2===t.type&&t.content&&e.push(t))})),e.forEach((function(t){var e=n.findIndex((function(e){return-1!==e.position.indexOf(t.position)}));-1!==e&&(n[e].note=t.content)}));var i=[];return n.forEach((function(t){var e=i.findIndex((function(e){return e.title===t.book}));-1!==e?i[e].texts.push({text:t.content,note:t.note,checked:!1,isEdit:!1}):i.push({title:t.book,texts:[{text:t.content,note:t.note,checked:!1,isEdit:!1}]})})),i.reverse()}function E(t){return t=t.trim(),t?new O(t):null}O.prototype.init=function(){var t=this.texts.split("\r\n").filter((function(t){return t})),e=null;e=T.split_book(t[0]),y(this,e),t[1]&&(e=T.split_created(t[1]),y(this,e)),this.content=t[2],e=null};var w=C,N=n("1431");function L(t){var e=N.load(t),n=e(".bookTitle")[0],i=e(n).text().trim(),o=[],s=Array.from(e(".noteText")),a=[];while(s.length){var c=s.pop(),r=_(c.prev.prev.children[0].data),l=c.children.filter((function(t){return"text"===t.type})).map((function(t){return t.data.trim()})).join("");2===r&&a.push(l),1===r&&o.unshift({text:l,note:a.pop()||"",checked:!1,isEdit:!1})}return{title:i,texts:o}}var j=L,A=n("1da1"),S=(n("96cf"),n("d3b7"),n("fb6a"),{}),I={},$={},D=function(){},M=function(){return Promise.resolve([])};Object({VUE_APP_CLI_UI_URL:"",NODE_ENV:"production",BASE_URL:""}).IS_ELECTRON&&(S=n("3e8f"),I=n("3c43"),$=n("7781"),D=n("c7b3").db,M=function(){var t=I.homedir(),e="/Desktop/text/",n="";try{n=S.readdirSync("".concat(t).concat(e))}catch(s){return Promise.reject("未发现笔记文件")}var i=n.find((function(t){return"sqlite"===t.slice(-6).toLowerCase()}));if(!i)return Promise.reject("未发现笔记文件");var o=D("".concat(t).concat(e),i);return new Promise((function(e,n){o.all("\n          SELECT\n              ZANNOTATIONREPRESENTATIVETEXT as BroaderText,\n              ZANNOTATIONSELECTEDTEXT as SelectedText,\n              ZANNOTATIONNOTE as Note,\n              ZFUTUREPROOFING5 as Chapter,\n              ZANNOTATIONCREATIONDATE as Created,\n              ZANNOTATIONMODIFICATIONDATE as Modified,\n              ZANNOTATIONASSETID\n          FROM ZAEANNOTATION\n          WHERE ZANNOTATIONSELECTEDTEXT IS NOT NULL\n          ORDER BY ZANNOTATIONASSETID ASC\n        ",function(){var i=Object(A["a"])(regeneratorRuntime.mark((function i(o,a){var c,r,l,u;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:if(o){i.next=20;break}return c="".concat(t,"/Desktop/text/Books.plist"),r={},l=[],i.prev=4,i.next=7,$.parseFile(c);case 7:u=i.sent,r=u[0],l=r.Books,i.next=16;break;case 12:i.prev=12,i.t0=i["catch"](4),console.log(i.t0),n("图书列表解析出错");case 16:try{a.forEach((function(t){var e=l.findIndex((function(e){return e.BKGeneratedItemId===t.ZANNOTATIONASSETID}));if(e>=0){var n={text:t.SelectedText,note:t.Note,checked:!1,isEdit:!1};try{l[e].texts.push(n)}catch(s){l[e].texts=[],l[e].texts.push(n)}}}))}catch(s){console.log(s)}e(l.filter((function(t){return t.texts})).map((function(t){return{title:t.BKDisplayName,texts:t.texts}}))),i.next=21;break;case 20:n("笔记解析出错");case 21:case"end":return i.stop()}}),i,null,[[4,12]])})));return function(t,e){return i.apply(this,arguments)}}())}))});var P=M,U=n("5c96"),F=n.n(U),R={name:"Options",props:{list:{type:Array,default:function(){return[]}},tmpList:{type:Array,default:function(){return[]}}},data:function(){return{options:{book:"",title:"",split:"",tag:"kindle",api:"",noTag:!1,reverse:!1,tagPosition:!1,notePosition:!1,noEmptyLine:!0,onlyTag:!1},tag:"",bookList:[],isElectron:!!Object({VUE_APP_CLI_UI_URL:"",NODE_ENV:"production",BASE_URL:""}).IS_ELECTRON}},watch:{options:{handler:function(){this.computedTag()},deep:!0,immediate:!0}},computed:{checkedMemo:function(){return this.list.filter((function(t){return t.checked}))},disabledSend:function(){return!this.checkedMemo.length||!this.options.api}},created:function(){this.setOptions()},mounted:function(){var t=this;this.$nextTick((function(){t.listenFile()}))},methods:{onlyTagChange:function(t){t&&(this.options.noEmptyLine=!0)},importNotes:function(){var t=this,e=U["Loading"].service({body:!0,lock:!0,text:"正在读取笔记"});P().then((function(n){t.bookList=n;try{setTimeout((function(){var n=t.bookList[0];t.options.book=n.title,t.updateData(n),e.close()}),1500)}catch(i){e.close()}})).catch((function(n){t.$message.error(n),e.close()}))},selectChange:function(t){var e=this.bookList.find((function(e){return e.title===t}));this.updateData(e)},parse:function(){this.updateOptions(),this.$emit("parse",this.options)},submit:function(){this.$emit("submit",this.options.api)},reverse:function(){this.$emit("reverse")},setOptions:function(){var t=JSON.parse(localStorage.getItem("options"));this.$set(this,"options",Object(v["a"])(Object(v["a"])({},this.options),t))},reset:function(){this.bookList=[],this.$emit("reset")},listenFile:function(){var t=this;document.querySelector("#fileSelect input").addEventListener("change",(function(e){t.reset(),t.$nextTick((function(){var n=e.target.files[0],i=n.name.split(".").pop().toLowerCase(),o=new FileReader;o.onload=function(){if("txt"===i){t.bookList=w(o.result);try{var e=t.bookList[0];t.options.book=e.title,t.updateData(e)}catch(s){}}if("html"===i){var n=j(o.result);t.updateData(n)}},o.readAsText(n)}))}))},updateData:function(t){var e=t.title,n=t.texts;this.options.title=e,this.$emit("list-update",n),n.length?this.parse():this.$message.warning("未发现有效内容")},updateOptions:function(){var t=this.options,e=t.noTag,n=t.api,i=t.tag,o=t.split,s=t.tagPosition,a=t.reverse,c=t.noEmptyLine,r=t.onlyTag,l={noTag:e,api:n,tag:i,split:o,tagPosition:s,reverse:a,noEmptyLine:c,onlyTag:r};localStorage.setItem("options",JSON.stringify(l))},computedTag:function(){var t="",e=this.options,n=e.tag,i=e.title,o=e.noTag;if(o)return this.$emit("update-tag",t),this.tag=t,!1;t=n?"#".concat(n,"/").concat(i):"#".concat(i),this.$emit("update-tag",t),this.tag=t}}},B=R,Z=(n("1cb7"),Object(f["a"])(B,b,g,!1,null,"673eaf50",null)),J=Z.exports,q=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"selected-text radio flex"},[n("el-tooltip",{attrs:{effect:"dark",placement:"left"}},[n("div",{staticStyle:{width:"200px","line-height":"1.5em"},attrs:{slot:"content"},slot:"content"},[t._v(" 未经审视的生活不值得过，未经审视的思想也不应该汇入你的大脑。建议在导入前审视一遍内容。 ")]),n("div",{staticClass:"checkbox"},[n("label",{staticClass:"label",class:t.disabled?"disabled":""},[n("i",{staticClass:"el-icon-success",class:t.checkAll?"active":""}),n("el-checkbox",{attrs:{disabled:t.disabled},model:{value:t.checkAll,callback:function(e){t.checkAll=e},expression:"checkAll"}})],1)])]),n("div",{staticClass:"flex-1 flex"},[t._v(" 已选择 "),n("span",{staticClass:"highlight"},[t._v(t._s(t.selected))]),t._v(" 条 MEMO，共 "),n("span",{staticClass:"highlight"},[t._v(t._s(t.total))]),t._v(" 条。今天已导入 "),n("span",{staticClass:"highlight"},[t._v(t._s(t.importCount)+" / 100")]),t._v(" 条 MEMO "),n("a",{staticClass:"thanks",attrs:{href:"https://mp.weixin.qq.com/s/o793lUsBaWc61fLZzFDlxg",target:"_blank"}},[t._v(" 感谢 LP 的授权 ")]),n("div",{staticClass:"pl-10 pointer"},[n("el-tooltip",{attrs:{effect:"dark",content:"发送邮件至：evollyone@outlook.com",placement:"bottom"}},[n("span",{staticStyle:{color:"#d96767"}},[t._v(" 有问题？ ")])])],1)]),n("div",[n("el-dropdown",[n("span",[t._v(" 关于作者 ")]),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",[n("a",{attrs:{href:"https://evolly.one",target:"_blank"}},[t._v("博客")])]),n("el-dropdown-item",[n("a",{attrs:{href:"https://album.animalcrossing.life",target:"_blank"}},[t._v("Tit1e's Photo Studio")])]),n("el-dropdown-item",[n("a",{attrs:{href:"https://personal-1251959693.cos.ap-chengdu.myqcloud.com/2021-05-23-IMG_8849.PNG",target:"_blank"}},[n("img",{attrs:{src:"https://personal-1251959693.cos.ap-chengdu.myqcloud.com/2021-05-23-IMG_8849.PNG",width:"200px",alt:"即刻"}})])])],1)],1)],1)],1)},z=[],G=(n("a9e3"),{name:"SelectedText",props:{selected:{type:Number,default:0},total:{type:Number,default:0},disabled:{type:Boolean,default:!1},importCount:{type:Number,default:0}},data:function(){return{checkAll:!1}},watch:{checkAll:function(t){this.$emit("change",t)}},methods:{}}),V=G,K=(n("0130"),Object(f["a"])(V,q,z,!1,null,"af518c38",null)),X=K.exports,H=n("b76a"),W=n.n(H),Y={name:"app",components:{ContentCard:m,Options:J,SelectedText:X,draggable:W.a},filters:{},data:function(){return{date:"",contentList:[],tmpList:[],index:0,loading:!1,tag:"",drag:!1,dragOptions:{animation:200},importCount:0}},watch:{importCount:function(t){localStorage.setItem("importCount",JSON.stringify(Object(a["a"])({},this.date,t)))}},computed:{dragDisabled:function(){return!!this.contentList.filter((function(t){return t.isEdit})).length},disabled:function(){return this.checkedMemo.length>=100},checkedMemo:function(){return this.contentList.filter((function(t){return t.checked}))},loadingText:function(){return"为减轻服务器压力，导入间隔为 1s。导入进度： ".concat(this.index+1,"/").concat(this.checkedMemo.length)}},created:function(){this.date=this.setDate(),this.geImportCount(this.date)},methods:{checkAllChange:function(t){this.contentList=this.contentList.map((function(e,n){return t&&n<=99?(e.checked=!0,e):(e.checked=!1,e)}))},updateTag:function(t){this.tag=t},listUpdate:function(t){this.tmpList=t},sendMemo:function(t,e,n){var i=this,o={content:e[n].text};r.a.post(t,o).then((function(o){i.importCount+=1,n<e.length-1?setTimeout((function(){i.index+=1,i.sendMemo(t,e,i.index)}),1e3):(i.$message.success("导入完毕"),i.loading=!1)})).catch((function(t){console.error(t),i.loading=!1,i.$message.error("记录失败")}))},submit:function(t){this.loading=!0,this.index=0,this.sendMemo(t,this.checkedMemo,this.index)},confirmCanEdit:function(t){var e=this,n=localStorage.getItem("canEdit")||"0";"0"===n&&this.$alert("双击 MEMO 可进入编辑模式","提示",{confirmButtonText:"知道了，不再提示",callback:function(n){localStorage.setItem("canEdit","1"),e.parse(t)}})},confirmFirstParse:function(t){var e=this,n=localStorage.getItem("hasConfirm")||"0";"0"===n?this.$alert("每次修改“书名”、“Tag”、“Tag 位置”、“分隔符”后需重新解析才会生效，重新解析会还原编辑后的内容。","提示",{confirmButtonText:"知道了，不再提示",callback:function(n){localStorage.setItem("hasConfirm","1"),e.parse(t)}}):this.parse(t)},parse:function(t){var e=this,n=t.split,i=t.tagPosition,o=t.notePosition,s=t.noEmptyLine,a=t.onlyTag,c=t.noTag;this.contentList=[],this.$nextTick((function(){e.contentList=JSON.parse(JSON.stringify(e.tmpList)).map((function(t){var r="".concat(t.text,"\r\n"),l=t.note?"".concat(n).concat(n||s?"\r\n":""):"",u=t.note?[r,l,"".concat(t.note,"\r\n")]:[r,l];o&&u.reverse();var d=u.filter((function(t){return t})).join(s?"":"\r\n");return c||(i?d="".concat(e.tag,a?"\r\n\r\n":s?"\r\n":"\r\n\r\n")+d:d+=a?"\r\n".concat(e.tag):s?e.tag:"\r\n".concat(e.tag)),t.text=d,t})),e.confirmCanEdit(t)}))},reverseList:function(){this.contentList.reverse()},reset:function(){this.contentList=[],this.tmpList=[]},setDate:function(){var t=new Date,e=t.getFullYear(),n=t.getMonth()+1,i=t.getDate();return"".concat(e).concat(n).concat(i)},geImportCount:function(t){var e=JSON.parse(localStorage.getItem("importCount")||"{}");this.importCount=+e[t]||0}}},Q=Y,tt=(n("abb8"),Object(f["a"])(Q,o,s,!1,null,null,null)),et=tt.exports;n("0fae");i["default"].use(F.a);n("3cd6"),n("9536");i["default"].config.productionTip=!1,new i["default"]({render:function(t){return t(et)}}).$mount("#app")},"5b9d":function(t,e,n){var i={"./Find-VS2017.cs":"c3f6","./build":"c22b","./build.js":"c22b","./clean":"1910","./clean.js":"1910","./configure":"c0a3","./configure.js":"c0a3","./find-node-directory":"3265","./find-node-directory.js":"3265","./find-vs2017":"d3f3","./find-vs2017.js":"d3f3","./install":"1eed","./install.js":"1eed","./list":"7777","./list.js":"7777","./node-gyp":"a9a0","./node-gyp.js":"a9a0","./process-release":"4e82","./process-release.js":"4e82","./rebuild":"626c","./rebuild.js":"626c","./remove":"bcf9","./remove.js":"bcf9"};function o(t){var e=s(t);return n(e)}function s(t){if(!n.o(i,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return i[t]}o.keys=function(){return Object.keys(i)},o.resolve=s,t.exports=o,o.id="5b9d"},6:function(t,e){},"623a":function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id="623a"},7:function(t,e){},8:function(t,e){},9:function(t,e){},9536:function(t,e,n){},abb8:function(t,e,n){"use strict";n("56d1")},c1d4:function(t,e,n){},c7b3:function(t,e,n){n("a15b");var i=n("fc0d").verbose(),o=n("df7c"),s=function(t,e){return new i.Database(o.join(t,e))};t.exports={db:s}},daba:function(t,e,n){"use strict";n("e4ca")},dcb8:function(t,e,n){},e4ca:function(t,e,n){}});
//# sourceMappingURL=app.06c2e697.js.map