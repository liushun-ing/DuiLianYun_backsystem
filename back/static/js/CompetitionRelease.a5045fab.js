(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["CompetitionRelease"],{"0bb5":function(t,e,o){},cde3:function(t,e,o){"use strict";o("0bb5")},df95:function(t,e,o){"use strict";o.r(e);var r=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"crumbs"},[o("el-breadcrumb",{attrs:{separator:"/"}},[o("el-breadcrumb-item",[o("i",{staticClass:"el-icon-lx-cascades"}),t._v(" 比赛发布\n            ")])],1)],1),o("div",{staticClass:"container"},[o("div",{staticClass:"c_title_and_action"},[o("div",{staticClass:"c_title_wrap"},[t._v("比赛发布")]),o("div",{staticClass:"c_button_wrap"},[o("el-button",{attrs:{type:"warning"},on:{click:t.reset}},[t._v("重置")]),o("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.submit("competitionForm")}}},[t._v("发布比赛")])],1)]),o("div",{staticClass:"c-form-box"},[o("el-form",{ref:"competitionForm",attrs:{rules:t.rules,model:t.competitionForm,"label-width":"110px"}},[o("el-form-item",{attrs:{label:"比赛名称",prop:"competitionName"}},[o("el-input",{staticStyle:{width:"100%"},model:{value:t.competitionForm.competitionName,callback:function(e){t.$set(t.competitionForm,"competitionName",e)},expression:"competitionForm.competitionName"}})],1),o("el-form-item",{staticStyle:{width:"100%"},attrs:{label:"比赛起止时间",required:""}},[o("el-col",{attrs:{span:11}},[o("el-form-item",{attrs:{prop:"competitionStartDate"}},[o("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择开始时间"},model:{value:t.competitionForm.competitionStartDate,callback:function(e){t.$set(t.competitionForm,"competitionStartDate",e)},expression:"competitionForm.competitionStartDate"}})],1)],1),o("el-col",{staticStyle:{"text-align":"center"},attrs:{span:2}},[t._v("-")]),o("el-col",{attrs:{span:11}},[o("el-form-item",{attrs:{prop:"competitionEndDate"}},[o("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择结束时间"},model:{value:t.competitionForm.competitionEndDate,callback:function(e){t.$set(t.competitionForm,"competitionEndDate",e)},expression:"competitionForm.competitionEndDate"}})],1)],1)],1),o("el-form-item",{staticStyle:{width:"100%"},attrs:{label:"投稿起止时间",required:""}},[o("el-col",{attrs:{span:11}},[o("el-form-item",{attrs:{prop:"levyStartDate"}},[o("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择开始时间"},model:{value:t.competitionForm.levyStartDate,callback:function(e){t.$set(t.competitionForm,"levyStartDate",e)},expression:"competitionForm.levyStartDate"}})],1)],1),o("el-col",{staticStyle:{"text-align":"center"},attrs:{span:2}},[t._v("-")]),o("el-col",{attrs:{span:11}},[o("el-form-item",{attrs:{prop:"levyStartDate"}},[o("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择结束时间"},model:{value:t.competitionForm.levyEndDate,callback:function(e){t.$set(t.competitionForm,"levyEndDate",e)},expression:"competitionForm.levyEndDate"}})],1)],1)],1),o("el-form-item",{attrs:{"label-width":"0",required:""}},[o("el-col",{attrs:{span:12}},[o("el-form-item",{attrs:{label:"比赛封面图片最优宽高2:1",prop:"competitionImage"}},[o("el-upload",{ref:"upload",staticClass:"c-avatar-uploader",attrs:{action:"uploadURL","show-file-list":!1,limit:1,"http-request":t.uploadPicture,"before-upload":t.beforeAvatarUpload}},[t.competitionForm.competitionImage?o("el-image",{staticClass:"c-avatar",attrs:{src:t.competitionForm.competitionImage,fit:"contain"}}):o("i",{staticClass:"el-icon-plus c-avatar-uploader-icon"})],1)],1)],1)],1),o("el-form-item",{staticStyle:{width:"100%"},attrs:{label:"比赛简介",prop:"competitionIntroduction",required:""}},[o("mavon-editor",{ref:"md",attrs:{toolbars:t.toolbars,autofocus:!1},on:{imgAdd:t.$imgAdd,imgDel:t.$imgDel},model:{value:t.competitionForm.competitionIntroduction,callback:function(e){t.$set(t.competitionForm,"competitionIntroduction",e)},expression:"competitionForm.competitionIntroduction"}})],1)],1)],1)])])},i=[],a=(o("96cf"),o("1da1")),n=o("fa7d"),s={name:"CompetitionRelease",data:function(){return{toolbars:n["a"].toolbars,competitionForm:{competitionName:"",competitionIntroduction:"",competitionStartDate:"",competitionEndDate:"",levyStartDate:"",levyEndDate:"",competitionImage:"",createBy:""},rules:{competitionName:[{required:!0,message:"请输入比赛名称",trigger:"blur"}],competitionIntroduction:[{required:!0,message:"请输入比赛简介",trigger:"blur"}],competitionImage:[{required:!0,message:"请上传比赛图片",trigger:"blur"}],competitionStartDate:[{required:!0,message:"请选择比赛开始时间",trigger:"blur"}],competitionEndDate:[{required:!0,message:"请选择比赛结束时间",trigger:"blur"}],levyStartDate:[{required:!0,message:"请选择投稿开始时间",trigger:"blur"}],levyEndDate:[{required:!0,message:"请选择投稿结束时间",trigger:"blur"}]}}},activated:function(){this.competitionForm.createBy=n["a"].getSessionInfo("adminId")},methods:{$imgAdd:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(e,o){var r,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(this.beforeAvatarUpload(o)){t.next=2;break}return t.abrupt("return");case 2:return r=this.$message({message:"正在上传中...",type:"info",duration:0}),t.prev=3,t.next=6,n["a"].uploadFile("/post-server/manuscript/upload",o);case 6:i=t.sent,this.$refs.md.$img2Url(e,i.url),r.close(),this.$message({message:"图片上传成功",duration:2e3,type:"success"}),t.next=17;break;case 12:t.prev=12,t.t0=t["catch"](3),r.close(),this.$message({message:"图片上传失败",duration:2e3,type:"error"}),console.log(t.t0);case 17:case"end":return t.stop()}}),t,this,[[3,12]])})));function e(e,o){return t.apply(this,arguments)}return e}(),$imgDel:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(e,o){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r={url:e[0]},t.prev=1,t.next=4,this.$api.news.deleteImage(r);case 4:console.log("新闻内容图片删除成功"),t.next=11;break;case 7:t.prev=7,t.t0=t["catch"](1),console.log("新闻内容图片删除失败"),console.log(t.t0);case 11:case"end":return t.stop()}}),t,this,[[1,7]])})));function e(e,o){return t.apply(this,arguments)}return e}(),submit:function(t){var e=this;this.$refs[t].validate(function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(o){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!o){t.next=16;break}if(n["a"].compareCompetitionDate(e.competitionForm.competitionStartDate,e.competitionForm.competitionEndDate,e.competitionForm.levyStartDate,e.competitionForm.levyEndDate)){t.next=3;break}return t.abrupt("return",!1);case 3:return t.prev=3,t.next=6,e.$api.competition.releaseCompetition(e.competitionForm);case 6:e.$message({message:"比赛发布成功",duration:2e3,type:"success"}),e.reset(),t.next=14;break;case 10:t.prev=10,t.t0=t["catch"](3),e.$message({message:"比赛发布失败",duration:2e3,type:"error"}),console.log(t.t0);case 14:t.next=18;break;case 16:return console.log("发布比赛表单验证失败"),t.abrupt("return",!1);case 18:case"end":return t.stop()}}),t,null,[[3,10]])})));return function(e){return t.apply(this,arguments)}}())},uploadPicture:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(e){var o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n["a"].uploadFile("/post-server/manuscript/upload",e.file);case 3:o=t.sent,this.$set(this.competitionForm,"competitionImage",o.url),this.$message({message:"图片上传成功",duration:2e3,type:"success"}),this.$refs.upload.clearFiles(),t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](0),console.log(t.t0),this.$message({message:"图片上传失败",duration:2e3,type:"error"});case 13:case"end":return t.stop()}}),t,this,[[0,9]])})));function e(e){return t.apply(this,arguments)}return e}(),beforeAvatarUpload:function(t){var e="image/jpeg"===t.type||"image/png"===t.type;return e?this.$message({message:"上传中",duration:1e3,type:"info"}):this.$message.error("上传封面图片只能是 JPG或者PNG 格式!"),e},reset:function(){this.competitionForm={competitionName:"",competitionIntroduction:"",competitionStartDate:"",competitionEndDate:"",levyStartDate:"",levyEndDate:"",competitionImage:"",createBy:n["a"].getSessionInfo("adminId")},this.$refs["competitionForm"].clearValidate()}}},c=s,m=(o("cde3"),o("0c7c")),l=Object(m["a"])(c,r,i,!1,null,null,null);e["default"]=l.exports}}]);
//# sourceMappingURL=CompetitionRelease.a5045fab.js.map