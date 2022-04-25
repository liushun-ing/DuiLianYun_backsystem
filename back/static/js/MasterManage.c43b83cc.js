(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MasterManage"],{"28c3":function(e,t,r){},ccbb:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"crumbs"},[r("el-breadcrumb",{attrs:{separator:">"}},[r("el-breadcrumb-item",[r("i",{staticClass:"el-icon-lx-cascades"}),e._v(" 楹联家管理\n            ")])],1)],1),r("div",{staticClass:"container"},[r("div",{staticClass:"handle-box"},[r("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"楹联家名字"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleSearch(t)}},model:{value:e.inputKey,callback:function(t){e.inputKey=t},expression:"inputKey"}}),r("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.handleRefresh}},[e._v("刷新")]),r("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handleSearch}},[e._v("搜索")]),r("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.handleAdd}},[e._v("新增古代楹联家")])],1),r("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:e.masterList,border:"","header-cell-class-name":"table-header"}},[r("el-table-column",{attrs:{prop:"masterName","min-width":"100",label:"楹联家名字",align:"center"}}),r("el-table-column",{attrs:{prop:"masterDynasty","min-width":"80",label:"朝代",align:"center"}}),r("el-table-column",{attrs:{label:"头像(查看大图)","min-width":"130",align:"center"},scopedSlots:e._u([{key:"default",fn:function(e){return[r("el-image",{staticClass:"table-td-thumb",attrs:{src:e.row.masterPhoto,"preview-src-list":[e.row.masterPhoto]}})]}}])}),r("el-table-column",{attrs:{prop:"masterIntroduction","min-width":"300",label:"简介",align:"center"}}),r("el-table-column",{attrs:{prop:"masterCreateTime",width:"160",label:"创建的时间",align:"center",sortable:""}}),r("el-table-column",{attrs:{label:"操作",width:"200",align:"center",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{staticClass:"blue",attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(r){return e.handleEdit(t.$index,t.row)}}},[e._v("修改")]),r("el-button",{staticClass:"red",attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(r){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")]),e.whetherShow(t.$index,t.row)?r("el-button",{staticClass:"orange",attrs:{type:"text",icon:"el-icon-s-promotion"},on:{click:function(r){return e.handleRecommend(t.$index,t.row)}}},[e._v("推荐")]):e._e(),r("el-button",{staticClass:"green",attrs:{type:"text",icon:"el-icon-circle-plus"},on:{click:function(r){return e.handleAddCouplet(t.$index,t.row)}}},[e._v("为他/她新增楹联")])]}}])})],1),r("div",{staticClass:"pagination"},[r("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":e.currentPage,"page-size":e.pageSize,total:e.total},on:{"current-change":e.handlePageChange,"prev-click":e.handlePagePrev,"next-click":e.handlePageNext}})],1)],1),r("el-dialog",{attrs:{title:"编辑",visible:e.editVisible,width:"40%","show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(t){e.editVisible=t}}},[r("el-form",{ref:"editForm",attrs:{model:e.editForm,rules:e.rules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"楹联家姓名",prop:"masterName"}},[r("el-input",{model:{value:e.editForm.masterName,callback:function(t){e.$set(e.editForm,"masterName",t)},expression:"editForm.masterName"}})],1),r("el-form-item",{attrs:{label:"楹联家朝代"}},[r("el-input",{attrs:{disabled:""},model:{value:e.editForm.masterDynasty,callback:function(t){e.$set(e.editForm,"masterDynasty",t)},expression:"editForm.masterDynasty"}})],1),r("el-form-item",{attrs:{label:"楹联家简介",prop:"masterIntroduction"}},[r("el-input",{attrs:{type:"textarea",autosize:""},model:{value:e.editForm.masterIntroduction,callback:function(t){e.$set(e.editForm,"masterIntroduction",t)},expression:"editForm.masterIntroduction"}})],1),r("el-form-item",{attrs:{label:"楹联家头像最优宽高1:1",prop:"masterPhoto"}},[r("el-upload",{ref:"upload",staticClass:"m-avatar-uploader",attrs:{action:"uploadUrl","show-file-list":!1,limit:1,"http-request":e.uploadPicture,"before-upload":e.beforeAvatarUpload}},[e.editForm.masterPhoto?r("el-image",{staticClass:"m-avatar",attrs:{src:e.editForm.masterPhoto,fit:"contain"}}):r("i",{staticClass:"el-icon-plus m-avatar-uploader-icon"})],1)],1)],1),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.cancelEdit}},[e._v("取 消")]),r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.saveEdit("editForm")}}},[e._v("确 定")])],1)],1),r("el-dialog",{attrs:{title:"新增",visible:e.addVisible,width:"40%","show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(t){e.addVisible=t}}},[r("el-form",{ref:"addForm",attrs:{model:e.addForm,rules:e.rules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"楹联家姓名",prop:"masterName"}},[r("el-input",{model:{value:e.addForm.masterName,callback:function(t){e.$set(e.addForm,"masterName",t)},expression:"addForm.masterName"}})],1),r("el-form-item",{attrs:{label:"楹联家朝代",prop:"masterDynasty"}},[r("el-input",{model:{value:e.addForm.masterDynasty,callback:function(t){e.$set(e.addForm,"masterDynasty",t)},expression:"addForm.masterDynasty"}})],1),r("el-form-item",{attrs:{label:"楹联家简介",prop:"masterIntroduction"}},[r("el-input",{attrs:{type:"textarea",autosize:""},model:{value:e.addForm.masterIntroduction,callback:function(t){e.$set(e.addForm,"masterIntroduction",t)},expression:"addForm.masterIntroduction"}})],1),r("el-form-item",{attrs:{label:"楹联家头像最优宽高1:1",prop:"masterPhoto"}},[r("el-upload",{ref:"upload",staticClass:"m-avatar-uploader",attrs:{action:"uploadUrl","show-file-list":!1,limit:1,"http-request":e.uploadPicture_add,"before-upload":e.beforeAvatarUpload}},[e.addForm.masterPhoto?r("el-image",{staticClass:"m-avatar",attrs:{src:e.addForm.masterPhoto,fit:"contain"}}):r("i",{staticClass:"el-icon-plus m-avatar-uploader-icon"})],1)],1)],1),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.cancelAdd}},[e._v("取 消")]),r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.saveAdd("addForm")}}},[e._v("确 定")])],1)],1),r("el-dialog",{attrs:{title:"推荐",visible:e.recommendVisible,width:"30%","show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(t){e.recommendVisible=t}}},[r("el-form",{ref:"recommendForm",attrs:{model:e.recommendForm,rules:e.rules,"label-width":"120px"}},[r("el-form-item",{attrs:{label:"楹联家名字",prop:"masterName"}},[r("el-input",{attrs:{disabled:!0},model:{value:e.recommendForm.masterName,callback:function(t){e.$set(e.recommendForm,"masterName",t)},expression:"recommendForm.masterName"}})],1),r("el-form-item",{attrs:{label:"推荐开始时间",prop:"masterRecommendStartDate"}},[r("el-date-picker",{attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择开始推荐时间"},model:{value:e.recommendForm.masterRecommendStartDate,callback:function(t){e.$set(e.recommendForm,"masterRecommendStartDate",t)},expression:"recommendForm.masterRecommendStartDate"}})],1),r("el-form-item",{attrs:{label:"推荐结束时间",prop:"masterRecommendEndDate"}},[r("el-date-picker",{attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择结束推荐时间"},model:{value:e.recommendForm.masterRecommendEndDate,callback:function(t){e.$set(e.recommendForm,"masterRecommendEndDate",t)},expression:"recommendForm.masterRecommendEndDate"}})],1)],1),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.cancelRecommend}},[e._v("取 消")]),r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.saveRecommend("recommendForm")}}},[e._v("确 定")])],1)],1)],1)},s=[],n=(r("96cf"),r("1da1")),o=r("fa7d"),i={name:"MasterManage",data:function(){var e=function(e,t,r){t?"当代"==t||"现代"==t?r(new Error("当/现代楹联家只能从用户中设置")):r():r(new Error("请输入楹联家朝代"))};return{inputKey:"",masterList:[],coupletTypeList:[],currentPage:1,pageSize:10,total:0,whetherChange:!1,editIndex:-1,recommendIndex:-1,editVisible:!1,addVisible:!1,recommendVisible:!1,editForm:{},addForm:{},recommendForm:{},rules:{masterName:[{required:!0,message:"请输入楹联家姓名",trigger:"blur"}],masterIntroduction:[{required:!0,message:"请输入楹联家简介",trigger:"blur"}],masterPhoto:[{required:!0,message:"请选择楹联家头像",trigger:"blur"}],masterDynasty:[{required:!0,validator:e,trigger:"blur"}],masterRecommendStartDate:[{required:!0,message:"请选择推荐开始时间",trigger:"blur"}],masterRecommendEndDate:[{required:!0,message:"请选择推荐结束时间",trigger:"blur"}]}}},activated:function(){this.inputKey="",this.currentPage=1,this.getMasterList()},methods:{getMasterList:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(){var t,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={inputKey:this.inputKey,pageSize:this.pageSize,currentPage:this.currentPage},e.prev=1,e.next=4,this.$api.couplet.getMasterList(t);case 4:r=e.sent,this.total=r.total,this.masterList=r.masterList,e.next=13;break;case 9:e.prev=9,e.t0=e["catch"](1),this.$message({message:"获取楹联家失败",duration:2e3,type:"error"}),console.log(e.t0);case 13:case"end":return e.stop()}}),e,this,[[1,9]])})));function t(){return e.apply(this,arguments)}return t}(),handleRefresh:function(){var e=this.$message("刷新中");this.currentPage=1,this.inputKey="",this.getMasterList(),e.close()},handleSearch:function(){this.currentPage=1,this.getMasterList()},whetherShow:function(e,t){if(t.masterRecommendStartDate){var r=new Date(t.masterRecommendStartDate).getTime(),a=new Date(t.masterRecommendEndDate).getTime(),s=(new Date).getTime();return!(s>r&&s<a)}return!0},handlePageChange:function(e){this.currentPage=e,this.getMasterList()},handlePagePrev:function(){this.currentPage--},handlePageNext:function(){this.currentPage++},uploadPicture_add:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o["a"].uploadFile("/couplet-server/master/back/uploadPhoto",t.file);case 3:r=e.sent,this.$set(this.addForm,"masterPhoto",r.url),this.$message({message:"图片上传成功",duration:2e3,type:"success"}),this.$refs.upload.clearFiles(),e.next=13;break;case 9:e.prev=9,e.t0=e["catch"](0),console.log(e.t0),this.$message({message:"图片上传失败",duration:2e3,type:"error"});case 13:case"end":return e.stop()}}),e,this,[[0,9]])})));function t(t){return e.apply(this,arguments)}return t}(),uploadPicture:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o["a"].uploadFile("/couplet-server/master/back/uploadPhoto",t.file);case 3:r=e.sent,this.$set(this.editForm,"masterPhoto",r.url),this.$message({message:"图片上传成功",duration:2e3,type:"success"}),this.whetherChange=!0,this.$refs.upload.clearFiles(),e.next=14;break;case 10:e.prev=10,e.t0=e["catch"](0),console.log(e.t0),this.$message({message:"图片上传失败",duration:2e3,type:"error"});case 14:case"end":return e.stop()}}),e,this,[[0,10]])})));function t(t){return e.apply(this,arguments)}return t}(),deletePhoto:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={url:this.masterList[this.editIndex].masterPhoto},e.prev=1,e.next=4,this.$api.couplet.deletePhoto(t);case 4:console.log(this.masterList[this.editIndex].masterName+"的原有图片删除成功"),e.next=11;break;case 7:e.prev=7,e.t0=e["catch"](1),console.log(this.masterList[this.editIndex].masterName+"的原有图片删除失败"),console.log(e.t0);case 11:case"end":return e.stop()}}),e,this,[[1,7]])})));function t(){return e.apply(this,arguments)}return t}(),beforeAvatarUpload:function(e){var t="image/jpeg"===e.type||"image/png"===e.type;return t?this.$message({message:"上传中",duration:1e3,type:"info"}):this.$message.error("上传封面图片只能是 JPG或者PNG 格式!"),t},handleEdit:function(e,t){this.editIndex=e,this.editForm=JSON.parse(JSON.stringify(t)),this.editVisible=!0,this.whetherChange=!1},cancelEdit:function(){this.editVisible=!1,this.$message({message:"操作已取消",duration:1500,type:"info"}),this.editForm={},this.$refs["editForm"].clearValidate()},handleDelete:function(e,t){var r=this,a=t.masterBindedUserId;this.$confirm("该楹联家将永久删除，确定要继续吗？\r\n 删除后，将会自动通知用户结果","提示",{type:"warning",confirmButtonText:"确定",cancelButtonText:"取消"}).then(Object(n["a"])(regeneratorRuntime.mark((function e(){var s,n,i,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=t.masterPhoto,n=t.masterBindedUserId,i=t.masterBindedUserId?{masterId:t.masterId,coupletAuthorId:t.masterBindedUserId,userId:t.masterBindedUserId}:{masterId:t.masterId,coupletAuthorId:t.masterId,userId:""},e.prev=3,e.next=6,r.$api.couplet.deleteMaster(i);case 6:if(r.$message({message:"删除成功",duration:2e3,type:"success"}),!s||n){e.next=20;break}return c={url:s},e.prev=9,e.next=12,r.$api.couplet.deletePhoto(c);case 12:return e.next=14,e.sent;case 14:console.log("删除楹联家头像图片成功"),e.next=20;break;case 17:e.prev=17,e.t0=e["catch"](9),console.log("删除楹联家头像图片失败");case 20:r.getMasterList(),a&&setTimeout((function(){o["a"].sendNotice(a,6)}),1e3),e.next=28;break;case 24:e.prev=24,e.t1=e["catch"](3),r.$message({message:"删除失败",duration:2e3,type:"error"}),console.log(e.t1);case 28:case"end":return e.stop()}}),e,null,[[3,24],[9,17]])})))).catch((function(){r.$message({message:"操作已取消",duration:1500,type:"info"})}))},handleAdd:function(){this.addVisible=!0,this.addForm={masterIntroduction:"",masterName:"",masterDynasty:"",masterPhoto:""}},cancelAdd:function(){this.addVisible=!1,this.$message({message:"操作已取消",duration:1500,type:"info"}),this.addForm={},this.$refs["addForm"].clearValidate()},cancelRecommend:function(){this.recommendVisible=!1,this.$message({message:"操作已取消",duration:1500,type:"info"}),this.recommendForm={},this.$refs["recommendForm"].clearValidate()},handleRecommend:function(e,t){this.recommendVisible=!0,this.recommendIndex=e,this.recommendForm=JSON.parse(JSON.stringify(t))},handleAddCouplet:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:r.masterBindedUserId?this.$router.push({name:"CoupletAdd",query:{coupletAuthorId:r.masterBindedUserId,coupletAuthorName:r.masterName,coupletDynasty:"当代"}}):this.$router.push({name:"CoupletAdd",query:{coupletAuthorId:r.masterId,coupletAuthorName:r.masterName,coupletDynasty:r.masterDynasty}});case 1:case"end":return e.stop()}}),e,this)})));function t(t,r){return e.apply(this,arguments)}return t}(),saveAdd:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!r){e.next=15;break}return t.addVisible=!1,e.prev=2,e.next=5,t.$api.couplet.addMaster(t.addForm);case 5:t.$message({message:"添加成功",duration:2e3,type:"success"}),t.getMasterList(),e.next=13;break;case 9:e.prev=9,e.t0=e["catch"](2),t.$message({message:"添加失败",duration:2e3,type:"error"}),console.log(e.t0);case 13:e.next=17;break;case 15:return console.log("增加楹联家表单验证失败"),e.abrupt("return",!1);case 17:case"end":return e.stop()}}),e,null,[[2,9]])})));return function(t){return e.apply(this,arguments)}}())},saveEdit:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(r){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!r){e.next=17;break}return t.editVisible=!1,a={masterId:t.editForm.masterId,masterName:t.editForm.masterName,masterIntroduction:t.editForm.masterIntroduction,masterPhoto:t.editForm.masterPhoto},e.prev=3,e.next=6,t.$api.couplet.modifyMaster(a);case 6:t.$message({message:"修改成功",duration:2e3,type:"success"}),t.$set(t.masterList,t.editIndex,t.editForm),t.whetherChange&&t.deletePhoto(),e.next=15;break;case 11:e.prev=11,e.t0=e["catch"](3),t.$message({message:"修改失败",duration:2e3,type:"error"}),console.log(e.t0);case 15:e.next=19;break;case 17:return console.log("修改楹联家表单验证失败"),e.abrupt("return",!1);case 19:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(t){return e.apply(this,arguments)}}())},saveRecommend:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(r){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!r){e.next=18;break}if(a={masterId:t.recommendForm.masterId,masterRecommendStartDate:t.recommendForm.masterRecommendStartDate,masterRecommendEndDate:t.recommendForm.masterRecommendEndDate},o["a"].compareRecommendDate(a.masterRecommendStartDate,a.masterRecommendEndDate)){e.next=4;break}return e.abrupt("return",!1);case 4:return t.recommendVisible=!1,e.prev=5,e.next=8,t.$api.couplet.recommendMaster(a);case 8:t.$message({message:"推荐成功",duration:2e3,type:"success"}),t.$set(t.masterList,t.recommendIndex,t.recommendForm),e.next=16;break;case 12:e.prev=12,e.t0=e["catch"](5),t.$message({message:"推荐失败",duration:2e3,type:"error"}),console.log(e.t0);case 16:e.next=20;break;case 18:return console.log("推荐楹联家表单验证失败"),e.abrupt("return",!1);case 20:case"end":return e.stop()}}),e,null,[[5,12]])})));return function(t){return e.apply(this,arguments)}}())}}},c=i,l=(r("cf13"),r("0c7c")),m=Object(l["a"])(c,a,s,!1,null,null,null);t["default"]=m.exports},cf13:function(e,t,r){"use strict";r("28c3")}}]);
//# sourceMappingURL=MasterManage.c43b83cc.js.map