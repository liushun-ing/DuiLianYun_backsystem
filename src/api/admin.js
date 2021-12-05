import request from '../utils/request';

const admin = {    
    /**
     * 管理员登陆
     * @param {object} params 账号和密码
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */ 
    login (params) {        
        return request({
            url: '/user-server/admin/login',
            method: 'post',
            data: params
        });
    },    

    /**
     * 添加管理员
     * @param {object} params 账号和密码
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    addAdmin (params) {
        return request({
            url: '/user-server/admin/addAdmin',
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
            url: '/user-server/admin/deleteAdmin',
            method: 'post',
            data: params
        })
    }
}

export default admin;
