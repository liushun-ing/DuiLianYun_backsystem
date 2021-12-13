import request from '../utils/request';

const notice = {    

    /**
     * 向全体用户发送通知
     * @param {object} params 
     * @returns 
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
     * @param {object} params 
     * @returns 
     */
    noticeAllMembers(params) {
        return request({
            url: '/user-server/notice/back/noticeAllMembers',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取全体用户
     * @returns 
     */
    getAllUsers() {
        return request({
            url: '/user-serve/user/back/getAllUsers',
            method: 'get',
        })
    },

    noticeSomeUsers(params) {
        return request({
            url: '/user-server/notice/back/noticeSomeUsers',
            method: 'post',
            data: params
        })
    }
}

export default notice;
