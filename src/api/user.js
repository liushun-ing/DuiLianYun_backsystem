import request from '../utils/request';

const user = {    
    
    /**
     * 获取用户列表
     * @param {object} params 分页参数和搜索关键字 
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getUserList (params) {        
        return request({
            url: '/user-server/user/back/getUserList',
            method: 'get',
            params: params
        }); 
    },

    /**
     * 禁用用户
     * @param {object} params 用户id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */   
    disableUser (params) {        
        return request({
            url: '/user-server/user/back/disableUser',
            method: 'POST',
            data: params
        });
    },

    /**
     * 启用用户
     * @param {object} params 用户Id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    enableUser (params) {
        return request({
            url: '/user-server/user/back/enableUser',
            method: 'post',
            data: params
        });
    },

    /**
     * 将用户设置为楹联家
     * @param {object} params 用户信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    promoteUser (params) {
        return request({
            url: '/user-server/user/back/promoteUser',
            method: 'post',
            data: params
        });
    },

    setUserDuty (params) {
        return request({
            url: 'user-server/user/back/setUserDuty',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取会员列表
     * @param {object} params 分页参数和搜索关键字 
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getMemberList (params) {
        return request({
            url: '/user-server/member/back/getMemberList',
            method: 'get',
            params: params
        });
    },

    /**
     * 删除会员
     * @param {object} params 会员id 
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteMember (params) {
        return request({
            url: '/user-server/member/back/deleteMember',
            method: 'post',
            data: params
        });
    },

    /**
     * 修改会员
     * @param {object} params 会员信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyMember (params) {
        return request({
            url: '/user-server/member/back/modifyMember',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取会员申请列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getMemberApplicationList (params) {
        return request({
            url: '/user-server/member/back/getMemberApplicationList',
            method: 'get',
            params: params
        });
    },

    /**
     * 通过会员申请
     * @param {object} params 分配的memberUid
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    passMemberApplication (params) {
        return request({
            url: '/user-server/member/back/passMemberApplication',
            method: 'post',
            data: params
        });
    },

    /**
     * 解决会员申请
     * @param {object} params memberId
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    denyMemberApplication (params) {
        return request({
            url: 'user-server/member/back/denyMemberApplication',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取会员认证列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getMemberCertificationList (params) {
        return request({
            url: '/user-server/member/back/getMemberCertificationList',
            method: 'get',
            params: params
        });
    },

    /**
     * 通过会员认证
     * @param {object} params 分配的memberUid，以及其他信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    passMemberCertification (params) {
        return request({
            url: '/user-server/member/back/passMemberCertification',
            method: 'post',
            data: params
        });
    },

    /**
     * 拒绝会员认证
     * @param {object} params memberId
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    denyMemberCertification (params) {
        return request({
            url: 'user-server/member/back/denyMemberCertification',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取楹联家申请列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getMasterApplyList (params) {
        return request({
            url: '/user-server/user/back/getMasterApplyList',
            method: 'get',
            params: params
        })
    },

    /**
     * 拒绝用户楹联家申请
     * @param {object} params 用户id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    denyMasterApply (params) {
        return request({
            url: '/user-server/user/back/denyMasterApply',
            method: 'post',
            data: params
        })
    },
}

export default user;
