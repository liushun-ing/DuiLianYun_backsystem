(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["NewsManage"],{"0d1b":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"crumbs"},[n("el-breadcrumb",{attrs:{separator:"/"}},[n("el-breadcrumb-item",[n("i",{staticClass:"el-icon-lx-cascades"}),e._v(" 新闻管理\n            ")])],1)],1),n("div",{staticClass:"container"},[n("div",{staticClass:"handle-box"},[n("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"标题/编辑人关键字"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleSearch(t)}},model:{value:e.inputKey,callback:function(t){e.inputKey=t},expression:"inputKey"}}),n("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.handleRefresh}},[e._v("刷新")]),n("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handleSearch}},[e._v("搜索")]),n("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.handleAdd}},[e._v("新增")])],1),n("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:e.newsList,border:"","header-cell-class-name":"table-header"}},[n("el-table-column",{attrs:{prop:"newsTitle",label:"新闻标题","min-width":"280",align:"center"}}),n("el-table-column",{attrs:{prop:"newsEditor",label:"编辑人","min-width":"150",align:"center"}}),n("el-table-column",{attrs:{prop:"newsImage",label:"封面图","min-width":"150",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.newsImage?n("el-image",{staticClass:"table-td-thumb",attrs:{src:t.row.newsImage,"preview-src-list":[t.row.newsImage]}}):n("div",[e._v("暂无图片")])]}}])}),n("el-table-column",{attrs:{prop:"newsCreateTime",label:"发布时间",width:"160",align:"center",sortable:""}}),n("el-table-column",{attrs:{label:"操作",width:"250",align:"center",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{staticClass:"green",attrs:{type:"text",icon:"el-icon-view"},on:{click:function(n){return e.handleView(t.$index,t.row)}}},[e._v("查看")]),n("el-button",{attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(n){return e.handleEdit(t.$index,t.row)}}},[e._v("编辑")]),n("el-button",{staticClass:"red",attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(n){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")]),e.whetherShow(t.$index,t.row)?n("el-button",{staticClass:"orange",attrs:{type:"text",icon:"el-icon-s-promotion"},on:{click:function(n){return e.handleRecommend(t.$index,t.row)}}},[e._v("推荐")]):e._e()]}}])})],1),n("div",{staticClass:"pagination"},[n("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":e.currentPage,"page-size":e.pageSize,total:e.total},on:{"current-change":e.handlePageChange,"prev-click":e.handlePagePrev,"next-click":e.handlePageNext}})],1)],1),n("el-dialog",{attrs:{title:"推荐",visible:e.recommendVisible,width:"30%","show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(t){e.recommendVisible=t}}},[n("el-form",{ref:"recommendForm",attrs:{model:e.recommendForm,rules:e.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"新闻标题",prop:"newsTitle"}},[n("el-input",{attrs:{disabled:!0},model:{value:e.recommendForm.newsTitle,callback:function(t){e.$set(e.recommendForm,"newsTitle",t)},expression:"recommendForm.newsTitle"}})],1),n("el-form-item",{attrs:{label:"推荐开始时间",prop:"newsRecommendStartTime"}},[n("el-date-picker",{attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择开始推荐时间"},model:{value:e.recommendForm.newsRecommendStartTime,callback:function(t){e.$set(e.recommendForm,"newsRecommendStartTime",t)},expression:"recommendForm.newsRecommendStartTime"}})],1),n("el-form-item",{attrs:{label:"推荐结束时间",prop:"newsRecommendEndTime"}},[n("el-date-picker",{attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择结束推荐时间"},model:{value:e.recommendForm.newsRecommendEndTime,callback:function(t){e.$set(e.recommendForm,"newsRecommendEndTime",t)},expression:"recommendForm.newsRecommendEndTime"}})],1)],1),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.cancelRecommend}},[e._v("取 消")]),n("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.saveRecommend("recommendForm")}}},[e._v("确 定")])],1)],1)],1)},a=[],s=(n("96cf"),n("1da1")),i=n("fa7d"),o={name:"NewsManage",data:function(){return{inputKey:"",newsList:[],currentPage:1,pageSize:10,total:0,recommendIndex:-1,recommendForm:{},recommendVisible:!1,rules:{newsRecommendStartTime:[{required:!0,message:"请选择推荐开始时间",trigger:"blur"}],newsRecommendEndTime:[{required:!0,message:"请选择推荐结束时间",trigger:"blur"}]}}},activated:function(){this.currentPage=1,this.inputKey="",this.getNewsList()},methods:{getNewsList:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={currentPage:this.currentPage,pageSize:this.pageSize,inputKey:this.inputKey},e.prev=1,e.next=4,this.$api.news.getNewsList(t);case 4:n=e.sent,this.newsList=n.newsList,this.total=n.total,e.next=13;break;case 9:e.prev=9,e.t0=e["catch"](1),this.$message({message:"获取新闻列表失败",duration:2e3,type:"error"}),console.log(e.t0);case 13:case"end":return e.stop()}}),e,this,[[1,9]])})));function t(){return e.apply(this,arguments)}return t}(),whetherShow:function(e,t){if(t.newsRecommendStartTime){var n=new Date(t.newsRecommendStartTime).getTime(),r=new Date(t.newsRecommendEndTime).getTime(),a=(new Date).getTime();return!(a>n&&a<r)}return!0},handleRefresh:function(){var e=this.$message("刷新中");this.currentPage=1,this.inputKey="",this.getNewsList(),e.close()},handleSearch:function(){this.currentPage=1,this.getNewsList()},handlePageChange:function(e){this.currentPage=e,this.getNewsList()},handlePagePrev:function(){this.currentPage--},handlePageNext:function(){this.currentPage++},handleView:function(e,t){this.$router.push({name:"NewsView",params:{newsId:t.newsId}})},handleEdit:function(e,t){this.$router.push({name:"NewsEdit",query:{newsId:t.newsId}})},handleDelete:function(e,t){var n=this;this.$confirm("该新闻将永久删除，确定要继续吗？","提示",{type:"warning",confirmButtonText:"确定",cancelButtonText:"取消"}).then(Object(s["a"])(regeneratorRuntime.mark((function e(){var r,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=t.newsImage,a={newsId:t.newsId},e.prev=2,e.next=5,n.$api.news.deleteNews(a);case 5:if(n.$message({message:"删除成功",duration:2e3,type:"success"}),!r){e.next=17;break}return a={url:r},e.prev=8,e.next=11,n.$api.news.deleteImage(a);case 11:console.log("删除新闻封面图片成功"),e.next=17;break;case 14:e.prev=14,e.t0=e["catch"](8),console.log("删除新闻封面图片失败");case 17:n.getNewsList(),e.next=24;break;case 20:e.prev=20,e.t1=e["catch"](2),n.$message({message:"删除失败",duration:2e3,type:"error"}),console.log(e.t1);case 24:case"end":return e.stop()}}),e,null,[[2,20],[8,14]])})))).catch((function(){n.$message({message:"操作已取消",duration:1500,type:"info"})}))},cancelRecommend:function(){this.recommendVisible=!1,this.$message({message:"操作已取消",duration:1500,type:"info"}),this.recommendForm={},this.$refs["recommendForm"].clearValidate()},handleRecommend:function(e,t){this.recommendVisible=!0,this.recommendIndex=e,this.recommendForm=JSON.parse(JSON.stringify(t))},saveRecommend:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!n){e.next=18;break}if(r={newsId:t.recommendForm.newsId,newsRecommendStartTime:t.recommendForm.newsRecommendStartTime,newsRecommendEndTime:t.recommendForm.newsRecommendEndTime},i["a"].compareRecommendDate(r.newsRecommendStartTime,r.newsRecommendEndTime)){e.next=4;break}return e.abrupt("return",!1);case 4:return t.recommendVisible=!1,e.prev=5,e.next=8,t.$api.news.recommendNews(r);case 8:t.$message({message:"推荐成功",duration:2e3,type:"success"}),t.$set(t.newsList,t.recommendIndex,t.recommendForm),e.next=16;break;case 12:e.prev=12,e.t0=e["catch"](5),t.$message({message:"推荐失败",duration:2e3,type:"error"}),console.log(e.t0);case 16:e.next=20;break;case 18:return console.log("推荐新闻表单验证失败"),e.abrupt("return",!1);case 20:case"end":return e.stop()}}),e,null,[[5,12]])})));return function(t){return e.apply(this,arguments)}}())},handleAdd:function(){this.$router.push({name:"NewsRelease"})}}},c=o,m=(n("b7d7"),n("0c7c")),l=Object(m["a"])(c,r,a,!1,null,"337fd5d4",null);t["default"]=l.exports},"243e":function(e,t,n){},b7d7:function(e,t,n){"use strict";n("243e")}}]);
//# sourceMappingURL=NewsManage.b7d74a8a.js.map