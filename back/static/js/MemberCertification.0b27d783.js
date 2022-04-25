(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["MemberCertification"],{"6b72":function(e,t,r){},"950b":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"crumbs"},[r("el-breadcrumb",{attrs:{separator:"/"}},[r("el-breadcrumb-item",[r("i",{staticClass:"el-icon-lx-cascades"}),e._v(" 会员认证审核\n            ")])],1)],1),r("div",{staticClass:"container"},[r("div",{staticClass:"handle-box"},[r("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"姓名"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleSearch(t)}},model:{value:e.inputKey,callback:function(t){e.inputKey=t},expression:"inputKey"}}),r("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.handleRefresh}},[e._v("刷新")]),r("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handleSearch}},[e._v("搜索")])],1),r("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:e.memberCertificationList,border:"","header-cell-class-name":"table-header"}},[r("el-table-column",{attrs:{prop:"memberPhone",label:"电话号码",align:"center"}}),r("el-table-column",{attrs:{label:"认证材料",align:"center"},scopedSlots:e._u([{key:"default",fn:function(e){return[r("el-image",{staticClass:"table-td-thumb",attrs:{src:e.row.memberApplicationReason,"preview-src-list":[e.row.memberApplicationReason]}})]}}])}),r("el-table-column",{attrs:{prop:"memberCreateTime",label:"提交认证时间",align:"center",sortable:""}}),r("el-table-column",{attrs:{label:"操作",width:"150",align:"center",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[1===t.row.memberType?r("div",[r("el-button",{attrs:{type:"text",icon:"el-icon-success"},on:{click:function(r){return e.handlePass(t.$index,t.row)}}},[e._v("通过")]),r("el-button",{staticClass:"red",attrs:{type:"text",icon:"el-icon-error"},on:{click:function(r){return e.handleDeny(t.$index,t.row)}}},[e._v("不通过")])],1):2===t.row.memberType?r("div",[r("el-tag",[e._v("已通过")])],1):r("div",[r("el-tag",{attrs:{type:"info"}},[e._v("已拒绝")])],1)]}}])})],1),r("div",{staticClass:"pagination"},[r("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":e.currentPage,"page-size":e.pageSize,total:e.total},on:{"current-change":e.handlePageChange,"prev-click":e.handlePagePrev,"next-click":e.handlePageNext}})],1)],1),r("el-dialog",{attrs:{title:"认证",visible:e.passVisible,width:"40%","show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(t){e.passVisible=t}}},[r("el-form",{ref:"passForm",attrs:{model:e.passForm,rules:e.rules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"认证材料",prop:"memberApplicationReason"}},[r("el-image",{staticClass:"passImage",attrs:{src:e.passForm.memberApplicationReason,"preview-src-list":[e.passForm.memberApplicationReason]}})],1),r("el-form-item",{attrs:{label:"会员姓名",prop:"memberName"}},[r("el-input",{model:{value:e.passForm.memberName,callback:function(t){e.$set(e.passForm,"memberName",t)},expression:"passForm.memberName"}})],1),r("el-form-item",{attrs:{label:"会员身份证",prop:"memberIdcard"}},[r("el-input",{attrs:{maxlength:18,minlength:15},model:{value:e.passForm.memberIdcard,callback:function(t){e.$set(e.passForm,"memberIdcard",t)},expression:"passForm.memberIdcard"}})],1),r("el-form-item",{attrs:{label:"会员证编号",prop:"memberUid"}},[r("el-input",{model:{value:e.passForm.memberUid,callback:function(t){e.$set(e.passForm,"memberUid",t)},expression:"passForm.memberUid"}})],1),r("el-form-item",{attrs:{label:"性别",prop:"memberGender"}},[r("el-radio-group",{model:{value:e.passForm.memberGender,callback:function(t){e.$set(e.passForm,"memberGender",t)},expression:"passForm.memberGender"}},[r("el-radio",{attrs:{label:"男"}},[e._v("男")]),r("el-radio",{attrs:{label:"女"}},[e._v("女")])],1)],1),r("el-form-item",{attrs:{label:"生日",prop:"memberBirthday"}},[r("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"选择日期"},model:{value:e.passForm.memberBirthday,callback:function(t){e.$set(e.passForm,"memberBirthday",t)},expression:"passForm.memberBirthday"}})],1),r("el-form-item",{attrs:{label:"入会时间",prop:"memberCreateTime"}},[r("el-date-picker",{attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择日期"},model:{value:e.passForm.memberCreateTime,callback:function(t){e.$set(e.passForm,"memberCreateTime",t)},expression:"passForm.memberCreateTime"}})],1)],1),r("el-checkbox",{model:{value:e.isSendNotice,callback:function(t){e.isSendNotice=t},expression:"isSendNotice"}},[e._v("是否自动发送如下通知")]),r("el-descriptions",{staticStyle:{"padding-top":"10px"},attrs:{column:1,border:""}},[r("el-descriptions-item",{attrs:{label:"通知标题"}},[e._v(e._s(e.noticeForm.noticeTitle))]),r("el-descriptions-item",{attrs:{label:"通知内容"}},[e._v(e._s(e.noticeForm.noticeContent))])],1),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.cancelPass}},[e._v("取 消")]),r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.savePass("passForm")}}},[e._v("确 定")])],1)],1),r("el-dialog",{attrs:{title:"提示",visible:e.denyVisible,width:"40%","show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(t){e.denyVisible=t}}},[r("div",{staticStyle:{"font-size":"18px","font-weight":"600","padding-bottom":"30px"}},[e._v("将拒绝该用户的会员认证，确定要继续吗？")]),r("el-checkbox",{model:{value:e.isSendNotice,callback:function(t){e.isSendNotice=t},expression:"isSendNotice"}},[e._v("是否自动发送如下通知")]),r("el-descriptions",{staticStyle:{"padding-top":"10px"},attrs:{column:1,border:""}},[r("el-descriptions-item",{attrs:{label:"通知标题"}},[e._v(e._s(e.noticeForm.noticeTitle))]),r("el-descriptions-item",{attrs:{label:"通知内容"}},[e._v(e._s(e.noticeForm.noticeContent))])],1),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.cancelDeny}},[e._v("取 消")]),r("el-button",{attrs:{type:"primary"},on:{click:e.saveDeny}},[e._v("确 定")])],1)],1)],1)},s=[],i=(r("96cf"),r("1da1")),n=r("fa7d"),o={name:"MemberCertification",data:function(){var e=function(e,t,r){t?/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(t)?r():r(new Error("身份证不合法")):r(new Error("请输入身份证号"))};return{inputKey:"",allData:[],memberCertificationList:[],currentPage:1,total:0,pageSize:10,passForm:{},passIndex:-1,passVisible:!1,denyVisible:!1,denyIndex:-1,denyForm:{},noticeForm:{},isSendNotice:!0,rules:{memberUid:[{required:!0,message:"请输入会员证编号",trigger:"blur"}],memberName:[{required:!0,message:"请输入会员证姓名",trigger:"blur"}],memberIdcard:[{required:!0,validator:e,trigger:"blur"}],memberGender:[{required:!0,message:"请选择会员性别",trigger:"blur"}],memberCreateTime:[{required:!0,message:"请选择入会时间",trigger:"blur"}],memberBirthday:[{required:!0,message:"请选择出生日期",trigger:"blur"}]}}},activated:function(){this.currentPage=1,this.inputKey="",this.getMemberCertificationList()},methods:{getMemberCertificationList:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={currentPage:this.currentPage,pageSize:this.pageSize,inputKey:this.inputKey},e.prev=1,e.next=4,this.$api.user.getMemberCertificationList(t);case 4:r=e.sent,this.memberCertificationList=r.memberCertificationList,this.total=r.total,e.next=13;break;case 9:e.prev=9,e.t0=e["catch"](1),this.$message({message:"获取认证会员列表失败",duration:2e3,type:"error"}),console.log(e.t0);case 13:case"end":return e.stop()}}),e,this,[[1,9]])})));function t(){return e.apply(this,arguments)}return t}(),handleRefresh:function(){var e=this.$message("刷新中");this.currentPage=1,this.inputKey="",this.getMemberCertificationList(),e.close()},handleSearch:function(){this.currentPage=1,this.getMemberCertificationList()},cancelDeny:function(){this.denyVisible=!1,this.$message({message:"操作已取消",duration:1500,type:"info"}),this.$refs["denyForm"].clearValidate()},handleDeny:function(e,t){this.denyVisible=!0,this.denyIndex=e,this.denyForm=JSON.parse(JSON.stringify(t)),this.isSendNotice=!0,this.noticeForm=n["a"].getNoticeTemplate(5)},saveDeny:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.denyVisible=!1,t={memberId:this.denyForm.memberId},e.prev=2,e.next=5,this.$api.user.denyMemberCertification(t);case 5:this.$message({message:"拒绝会员认证成功",duration:2e3,type:"success"}),this.memberCertificationList[this.denyIndex].memberType=3,this.isSendNotice&&setTimeout((function(){n["a"].sendNotice(r.denyForm.memberBindedUserId,5)}),1e3),e.next=14;break;case 10:e.prev=10,e.t0=e["catch"](2),this.$message({message:"拒绝会员认证失败",duration:2e3,type:"error"}),console.log(e.t0);case 14:case 15:case"end":return e.stop()}}),e,this,[[2,10]])})));function t(){return e.apply(this,arguments)}return t}(),handlePass:function(e,t){this.passVisible=!0,this.passIndex=e,this.passForm=JSON.parse(JSON.stringify(t)),this.isSendNotice=!0,this.noticeForm=n["a"].getNoticeTemplate(4)},cancelPass:function(){this.passVisible=!1,this.$message({message:"操作已取消",duration:1500,type:"info"}),this.$refs["passForm"].clearValidate()},savePass:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(r){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!r){e.next=17;break}return t.passVisible=!1,a={memberId:t.passForm.memberId,memberGender:t.passForm.memberGender,memberUid:t.passForm.memberUid,memberName:t.passForm.memberName,memberIdcard:t.passForm.memberIdcard,memberCreateTime:t.passForm.memberCreateTime,memberBirthday:t.passForm.memberBirthday,memberBinderUserId:t.passForm.memberBinderUserId},e.prev=3,e.next=6,t.$api.user.passMemberCertification(a);case 6:t.$message({message:"通过会员认证成功",duration:2e3,type:"success"}),t.memberCertificationList[t.passIndex].memberType=2,t.isSendNotice&&setTimeout((function(){n["a"].sendNotice(t.passForm.memberBindedUserId,4)}),1e3),e.next=15;break;case 11:e.prev=11,e.t0=e["catch"](3),t.$message({message:"通过会员认证失败",duration:2e3,type:"error"}),console.log(e.t0);case 15:e.next=19;break;case 17:return console.log("通过会员认证表单验证失败"),e.abrupt("return",!1);case 19:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(t){return e.apply(this,arguments)}}())},handlePageChange:function(e){this.currentPage=e,this.getMemberCertificationList()},handlePagePrev:function(){this.currentPage--},handlePageNext:function(){this.currentPage++}}},l=o,m=(r("cf30"),r("0c7c")),c=Object(m["a"])(l,a,s,!1,null,"0affbfa9",null);t["default"]=c.exports},cf30:function(e,t,r){"use strict";r("6b72")}}]);
//# sourceMappingURL=MemberCertification.0b27d783.js.map