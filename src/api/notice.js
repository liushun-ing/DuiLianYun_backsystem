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
            url: '/user-server/user/back/getAllUsers',
            method: 'get',
        })
    },

    /**
     * 
     * @param {object} params 
     * @returns 
     */
    noticeSomeUsers(params) {
        return request({
            url: '/user-server/notice/back/noticeSomeUsers',
            method: 'post',
            data: params
        })
    },

    /**
     * 
     * @param {object} params 
     * params {
     *      noticeTitle: null,
     *      noticeContent: null,
     *      competitionId: null
     * }
     * @returns 
     */
    noticeAwardUsers(params) {
        return request({
            url: '/user-server/notice/back/noticeAwardUsers',
            method: 'post',
            data: params
        })
    }
}

export default notice;
