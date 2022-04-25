import Element from 'element-ui';
import globalData from '../api/global_data.js';
import api from '@/api/index.js';
import axios from 'axios';
import qs from 'qs';
// 通知模板
// 将用户设为楹联家
var promoteUserNoticeTemplate = {
	noticeTitle: '荣誉通知',
	noticeContent: '恭喜您，已经升级为楹联家，成为了楹联家库中的一员。'
};
// 将帖子加入楹联库
var promotePostNoticeTemplate = {
    noticeTitle: '荣誉通知',
    noticeContent: '',
    setPostTitle: function (title) {
        this.noticeContent = '恭喜您，您的帖子-' + title + '-已被选入中华楹联库，可以进入我的楹联查看。';
    }
};
// 通过会员申请
var memberPassApplicationNoticeTemplate = {
	noticeTitle: '审核通知',
	noticeContent: '恭喜您，已经成功通过会员申请，成为了协会会员中的一员。如数据未更新，请刷新页面!'
};
// 拒绝会员申请
var memberDenyApplicationNoticeTemplate = {
	noticeTitle: '审核通知',
	noticeContent: '很遗憾，您的会员申请未能通过，你确认您填写的申请信息有效。'
};
// 通过会员认证
var memberPassCertificationNoticeTemplate = {
	noticeTitle: '审核通知',
	noticeContent: '恭喜您，已经成功通过会员认证，成为了协会会员中的一员。如数据未更新，请刷新页面!'
};
// 拒绝会员认证
var memberDenyCertificationNoticeTemplate = {
	noticeTitle: '审核通知',
	noticeContent: '很遗憾，您的会员认证未能通过，请确认您提交的认证材料有效。'
};
// 移除用户楹联家资格
var disPromoteUserNoticeTemplate = {
	noticeTitle: '荣誉通知',
	noticeContent: '很遗憾，管理员取消了您的楹联家资格。'
};
// 删除用户帖子
var deleteUserPostNoticeTemplate = {
	noticeTitle: '通知',
    noticeContent: '',
    setPostTitle: function (title) {
        this.noticeContent = '很遗憾，您的帖子-' + title + '-已被管理员删除。';
    }
};
// 删除用户楹联
var deleteUserCoupletNoticeTemplate = {
	noticeTitle: '通知',
    noticeContent: '',
    setPostTitle: function (title) {
        this.noticeContent = '很遗憾，您的楹联-' + title + '-已被管理员删除。';
    }
};
// 将用户设为楹联家
var passUserApplyMasterNoticeTemplate = {
	noticeTitle: '审核通知',
	noticeContent: '恭喜您，管理员同意了您的楹联家申请，您成为了楹联家库中的一员。'
};
// 将用户设为楹联家
var denyUserApplyMasterNoticeTemplate = {
	noticeTitle: '审核通知',
	noticeContent: '很遗憾，管理员未同意您的楹联家申请。'
};
// 自定义用户通知
var designedUserNoticeTemplate = {
  noticeTitle: '',
  noticeContent: '',
  attachmentSrc: '',
  setTitle: function (title) {
    this.noticeTitle = title
  },
  setContent: function (content) {
      this.noticeContent = content;
  },
  setAttachmentSrc: function (attachmentSrc) {
    this.attachmentSrc = attachmentSrc;
  }
};

/**
 * 获取短信模板
 * @param {number} type 
 *      0-promoteUserNoticeTemplate，
 *      1-promotePostNoticeTemplate，
 *      2-memberPassApplicationNoticeTemplate，
 *      3-memberDenyApplicationNoticeTemplate，
 *      4-memberPassCertificationNoticeTemplate,
 *      5-memberDenyCertificationNoticeTemplate,
 * 		6-disPromoteUserNoticeTemplate,
 * 		7-deleteUserPostNoticeTemplate,
 * 		8-deleteUserCoupletNoticeTemplate,
 * 		9-passUserApplyMasterNoticeTemplate,
 * 		10-denyUserApplyMasterNoticeTemplate
 *    11-designedUserNoticeTemplate
 */
function getNoticeTemplate(type) {
    if(type === 0) {
        return promoteUserNoticeTemplate;
    } else if(type === 1) {
        return promotePostNoticeTemplate;
    } else if(type === 2) {
        return memberPassApplicationNoticeTemplate;
    } else if(type === 3) {
        return memberDenyApplicationNoticeTemplate;
    } else if(type === 4) {
        return memberPassCertificationNoticeTemplate;
    } else if(type === 5) {
        return memberDenyCertificationNoticeTemplate;
    } else if(type === 6) {
      return disPromoteUserNoticeTemplate;
    } else if(type === 7) {
      return deleteUserPostNoticeTemplate;
    } else if(type === 8) {
      return deleteUserCoupletNoticeTemplate;
    } else if(type === 9) {
      return passUserApplyMasterNoticeTemplate;
    } else if(type === 10) {
      return denyUserApplyMasterNoticeTemplate;
    } else if(type === 11) {
      return designedUserNoticeTemplate;
    }
};

/**
 * arguments
 * [0] String userId 必填
 * [1] number type 必填，发送哪个通知：
 *      0-promoteUserNoticeTemplate，
 *      1-promotePostNoticeTemplate，
 *      2-memberPassApplicationNoticeTemplate，
 *      3-memberDenyApplicationNoticeTemplate，
 *      4-memberPassCertificationNoticeTemplate,
 *      5-memberDenyCertificationNoticeTemplate,
 * 		6-disPromoteUserNoticeTemplate,
 * 		7-deleteUserPostNoticeTemplate,
 * 		8-deleteUserCoupletNoticeTemplate
* 		9-passUserApplyMasterNoticeTemplate,
 * 		10-denyUserApplyMasterNoticeTemplate
 *    11-designedUserNoticeTemplate
 * [2] String title 可选，只有当type=1, 7, 8, 11时才需要
 */
async function sendNotice () {
    let params;
    if(arguments[1] === 0) {
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: promoteUserNoticeTemplate.noticeTitle,
            noticeContent: promoteUserNoticeTemplate.noticeContent
        };
    } else if(arguments[1] === 1) {
        promotePostNoticeTemplate.setPostTitle(arguments[2]);
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: promotePostNoticeTemplate.noticeTitle,
            noticeContent: promotePostNoticeTemplate.noticeContent
        };
    } else if(arguments[1] === 2) {
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: memberPassApplicationNoticeTemplate.noticeTitle,
            noticeContent: memberPassApplicationNoticeTemplate.noticeContent
        }
    } else if(arguments[1] === 3) {
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: memberDenyApplicationNoticeTemplate.noticeTitle,
            noticeContent: memberDenyApplicationNoticeTemplate.noticeContent
        }
    } else if(arguments[1] === 4) {
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: memberPassCertificationNoticeTemplate.noticeTitle,
            noticeContent: memberPassCertificationNoticeTemplate.noticeContent
        }
    } else if(arguments[1] === 5) {
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: memberDenyCertificationNoticeTemplate.noticeTitle,
            noticeContent: memberDenyCertificationNoticeTemplate.noticeContent
        }
    } else if(arguments[1] === 6) {
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: disPromoteUserNoticeTemplate.noticeTitle,
            noticeContent: disPromoteUserNoticeTemplate.noticeContent
        }
	} else if(arguments[1] === 7) {
        deleteUserPostNoticeTemplate.setPostTitle(arguments[2]);
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: deleteUserPostNoticeTemplate.noticeTitle,
            noticeContent: deleteUserPostNoticeTemplate.noticeContent
        };
    } else if(arguments[1] === 8) {
        deleteUserCoupletNoticeTemplate.setPostTitle(arguments[2]);
        params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: deleteUserCoupletNoticeTemplate.noticeTitle,
            noticeContent: deleteUserCoupletNoticeTemplate.noticeContent
        };
    } else if(arguments[1] === 9) {
		params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: passUserApplyMasterNoticeTemplate.noticeTitle,
            noticeContent: passUserApplyMasterNoticeTemplate.noticeContent
        }
	} else if(arguments[1] === 10) {
		params = {
            noticeBindedUserId: arguments[0],
            noticeTitle: denyUserApplyMasterNoticeTemplate.noticeTitle,
            noticeContent: denyUserApplyMasterNoticeTemplate.noticeContent
        }
	} else if(arguments[1] === 11) {
    designedUserNoticeTemplate.setTitle(arguments[2]);
    designedUserNoticeTemplate.setContent(arguments[3]);
    designedUserNoticeTemplate.setAttachmentSrc(arguments[4]);
    params = {
      noticeBindedUserId: arguments[0],
      noticeTitle: designedUserNoticeTemplate.noticeTitle,
      noticeContent: designedUserNoticeTemplate.noticeContent,
      attachmentSrc: designedUserNoticeTemplate.attachmentSrc
  }
  }
  try {
        await api.notice.sendOneNotice(params);
        return "发送成功";
    } catch (error) {
        Element.Message({
            message: '发送通知失败，如有需要，请前往通知模块继续发送',
            duration: 2000,
            type: 'error'
        });
        console.log(error);
        return "发送失败";
    };
};

/**
 * 上传文件,图片等
 * @param {String} url 路径
 * @param {Object} file 文件对象
 */
function uploadFile(url, file) {
	let params = new FormData();
	params.append('file', file);
	let res = axios({
		url: globalData.baseURL + url,
		method: 'post',
		data: params,
		headers: {
		    'Content-Type': 'multipart/form-data',
			'token': JSON.parse(sessionStorage.getItem('adminToken')).token
		},
	}).then((res) => {
		if(res.data.code !== 20000) {
			return Promise.reject("图片|文件上传失败");
		} else {
			return Promise.resolve(res.data.data);
		}
	}).catch((error) => {
		return Promise.reject(error);
	});

	return res;
};

function login(params) {
	let res = axios({
		url: globalData.baseURL + '/user-server/admin/back/login',
		method: 'post',
		data: qs.stringify(params),
		headers: {
		    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		},
	}).then((res) => {
		if(res.data.code !== 20000) {
			return Promise.reject("登陆失败");
		} else {
			return Promise.resolve(res.data.data);
		}
	}).catch((error) => {
		return Promise.reject(error);
	});

	return res;
}

/**
 * 格式化文本，换行，空格等显示问题
 * @param {String} string 文本
 * @returns 格式化后的字符串
 */
function formatText(string) {
	//替换所有的换行符
	string = string.replace(/\r\n/g,"<br>")
	string = string.replace(/\n/g,"<br>");
	
	// //替换所有的空格（中文空格、英文空格都会被替换）
	// string = string.replace(/\s/g,"&nbsp;");

	return string;
}

/**
 * 获取session中的信息
 * @param {String} name 名称 
 * @returns 匹配的信息
 */
function getSessionInfo(name) {
	if(name === 'token') {
		return JSON.parse(sessionStorage.getItem('adminToken')).token;
	} else if (name === 'adminId') {
		return JSON.parse(sessionStorage.getItem('adminToken')).adminInfo.adminId;
	} else if (name === 'adminName') {
		return JSON.parse(sessionStorage.getItem('adminToken')).adminInfo.adminName;
	} else if (name === 'adminType') {
		return JSON.parse(sessionStorage.getItem('adminToken')).adminInfo.adminType;
	} else if (name === 'adminInfo') {
		return JSON.parse(sessionStorage.getItem('adminToken')).adminInfo;
	} else if (name === 'adminToken') {
		return JSON.parse(sessionStorage.getItem('adminToken'));
	}
}

/**
 * 比较推荐时两个时间的大小，并且是否结束时间大于当前时间
 * @param {String} date1 推荐开始时间
 * @param {String} date2 推荐结束时间
 * @returns 推荐时间是否符合规范
 */
function compareRecommendDate(date1, date2) {
	let time1 = new Date(date1).getTime();
	let time2 = new Date(date2).getTime();
	let now = new Date().getTime();
	if(time2 <= now) {
		Element.Message({
			message: '推荐结束时间不能小于当前时间',
			type: 'warning'
		});
		return false;
	}
	if(time1 >= time2) {
		Element.Message({
			message: '推荐结束时间不能小于开始时间',
			type: 'warning'
		});
		return false;
	}
	return true;
}

/**
 * 判断比赛时间设置是否符合规范
 * @param {String} start 比赛开始时间
 * @param {String} end 比赛结束时间
 * @param {String} levyStart 投稿开始时间
 * @param {String} levyEnd 投稿结束时间
 * @returns 时间设置是否符合规范
 */
function compareCompetitionDate(start, end, levyStart, levyEnd) {
	let c_start = new Date(start).getTime();
	let c_end = new Date(end).getTime();
	let l_start = new Date(levyStart).getTime();
	let l_end = new Date(levyEnd).getTime();
	let now = new Date().getTime();
	if(c_start >= c_end) {
		Element.Message({
			message: '比赛结束时间不能小于等于开始时间',
			type: 'warning',
		});
		return false;
	}
	if(l_start >= l_end) {
		Element.Message({
			message: '投稿结束时间不能小于等于开始时间',
			type: 'warning'
		});
		return false;
	}
	if(l_start <= c_start || l_end >= c_end) {
		Element.Message({
			message: '投稿时间需在比赛时间范围内',
			type: 'warning'
		});
		return false;
	}
	if(l_end <= now || c_end <= now) {
		Element.Message({
			message: '结束时间不能小于当前时间',
			type: 'warning'
		});
		return false;
	}
	return true;
}


// markdown编辑器工具栏
// 新闻发布工具栏
var toolbars = {
	bold: true, // 粗体
	italic: true, // 斜体
	header: true, // 标题
	underline: true, // 下划线
	strikethrough: true, // 中划线
	mark: true, // 标记
	superscript: true, // 上角标
	subscript: true, // 下角标
	quote: true, // 引用
	ol: true, // 有序列表
	ul: true, // 无序列表
	link: true, // 链接
	imagelink: true, // 图片链接
	code: true, // code
	table: true, // 表格
	fullscreen: true, // 全屏编辑
	readmodel: true, // 沉浸式阅读
	htmlcode: true, // 展示html源码
	help: true, // 帮助
	/* 1.3.5 */
	undo: true, // 上一步
	redo: true, // 下一步
	trash: true, // 清空
	save: true, // 保存（触发events中的save事件）
	/* 1.4.2 */
	navigation: false, // 导航目录
	/* 2.1.8 */
	alignleft: false, // 左对齐
	aligncenter: false, // 居中
	alignright: false, // 右对齐
	/* 2.2.1 */
	subfield: true, // 单双栏模式
	preview: true, // 预览
};
// 分配奖项工具栏
var awardToolbars = {
	bold: true, // 粗体
	italic: true, // 斜体
	header: true, // 标题
	underline: true, // 下划线
	strikethrough: true, // 中划线
	mark: true, // 标记
	superscript: false, // 上角标
	subscript: false, // 下角标
	quote: true, // 引用
	ol: false, // 有序列表
	ul: false, // 无序列表
	link: false, // 链接
	imagelink: false, // 图片链接
	code: false, // code
	table: false, // 表格
	fullscreen: false, // 全屏编辑
	readmodel: false, // 沉浸式阅读
	htmlcode: false, // 展示html源码
	help: true, // 帮助
	/* 1.3.5 */
	undo: false, // 上一步
	redo: false, // 下一步
	trash: false, // 清空
	save: false, // 保存（触发events中的save事件）
	/* 1.4.2 */
	navigation: false, // 导航目录
	/* 2.1.8 */
	alignleft: false, // 左对齐
	aligncenter: false, // 居中
	alignright: false, // 右对齐
	/* 2.2.1 */
	subfield: false, // 单双栏模式
	preview: true, // 预览
};

export default {
    toolbars,
    awardToolbars,
    getNoticeTemplate,
    sendNotice,
	uploadFile,
	formatText,
	login,
	getSessionInfo,
	compareRecommendDate,
	compareCompetitionDate
}