import request from '../utils/request';

const notice = {    

    /**
     * 向全体用户发送通知
     * @param {object} params 通知信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    noticeAllUsers(params) {
        return request({
            url: '/user-server/notice/back/noticeAllUsers',
            method: 'post',
            data: params
        })
    },

    /**
     * 向全体会员发送通知
     * @param {object} params 通知信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    noticeAllMembers(params) {
        return request({
            url: '/user-server/notice/back/noticeAllMembers',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取搜索用户
     * @param {object} params 搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getSearchUsers(params) {
        return request({
            url: '/user-server/user/back/searchUsers',
            method: 'get',
            params: params
        });
    },

    /**
     * 向选中用户发送通知
     * @param {object} params 选中用户和通知信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    noticeSomeUsers(params) {
        return request({
            url: '/user-server/notice/back/noticeSomeUsers',
            method: 'post',
            data: params
        })
    },

    /**
     * 给获奖者发送通知
     * @param {object} params 通知信息，比赛Id
     * params {
     *      noticeTitle: null,
     *      noticeContent: null,
     *      competitionId: null
     * }
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    noticeAwardUsers(params) {
        return request({
            url: '/user-server/notice/back/noticeAwardUsers',
            method: 'post',
            data: params
        })
    },

    /**
     * 给一个用户发送消息
     * @param {pbject} params 通知内容和对象
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    sendOneNotice (params) {
        return request({
            url: '/user-server/notice/back/sendOneNotice',
            method: 'post',
            data: params
        });
    }
}

export default notice;
