import request from '../utils/request';

const admin = {    
    /**
     * 管理员登陆
     * @param {object} params 账号和密码
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */ 
    // login (params) {        
    //     return request({
    //         url: '/user-server/admin/back/login',
    //         method: 'post',
    //         data: params
    //     });
    // },    

    /**
     * 获取管理员列表
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getAdminList () {
        return request({
            url: '/user-server/admin/back/getAdminList',
            method: 'get',
        })
    },

    /**
     * 添加管理员
     * @param {object} params 账号和密码
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    addAdmin (params) {
        return request({
            url: '/user-server/admin/back/addAdmin',
            method: 'post',
            data: params
        })
    },

    /**
     * 删除管理员
     * @param {object} params adminId
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    deleteAdmin (params) {
        return request({
            url: '/user-server/admin/back/deleteAdmin',
            method: 'post',
            data: params
        })
    },

    /**
     * 修改管理员信息
     * @param {object} params 管理员信息 
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyAdmin (params) {
        return request({
            url: '/user-server/admin/back/modifyAdmin',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取评审人员信息
     * @param {object} params 比赛id
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getReviewerList (params) {
        return request({
            url: '/post-server/manuscript/back/getReviewerList',
            method: 'get',
            params: params
        });
    },

    /**
     * 设置一审信息
     * @param {object} params 比赛id和评审列表
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    setReviewer (params) {
        return request({
            url: '/post-server/manuscript/back/setReviewer',
            method: 'post',
            data: params
        });
    },

    /**
     * 设置二审信息
     * @param {object} params 比赛id和评审列表
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
     setRechecker (params) {
        return request({
            url: '/post-server/manuscript/back/setRechecker',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取协会基本信息
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getAssociationInfo () {
        return request({
            url: '/user-server/association-information/getAssociationInfo',
            method: 'get'
        })
    },

    /**
     * 修改协会信息
     * @param {object} params 协会信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyAssociationInfo (params) {
        return request({
            url: '/user-server/association-information/back/modifyAssociationInfo',
            method: 'post',
            data: params
        });
    }
}

export default admin;
