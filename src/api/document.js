import request from '../utils/request';

const document = {    

    /**
     * 上传资料
     * @param {object} params 资料信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    addDocument (params) {
        return request({
            url: '/file-server/document/back/addDocument',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取资料列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getDocumentList (params) {
        return request({
            url: '/file-server/document/back/getDocumentList',
            method: 'get',
            params: params
        });
    },

    /**
     * 删除资料
     * @param {object} params 资料id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteDocument (params) {
        return request({
            url: '/file-server/document/back/deleteDocument',
            method: 'post',
            data: params
        });
    },

    /**
     * 修改资料
     * @param {object} params 资料信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyDocument (params) {
        return request({
            url: '/file-server/document/back/modifyDocument',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取文件
     * @param {object} params 文件Id
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getFile (params) {
        return request({
            url: '/file-server/file/back/getFile',
            method: 'get',
            params: params
        });
    },

    /**
     * 删除文件
     * @param {object} params 文件id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteFile (params) {
        return request({
            url: '/file-server/file/back/deleteAllFile',
            method: 'post',
            data: params
        });
    },

    /**
     * 删除图片
     * @param {object} params 图片路径
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deletePicture (params) {
        return request({
            url: '/file-server/document/back/deletePicture',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取课堂资料
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getCoupletClassList (params) {
        return request({
            url: '/file-server/couplet-class/back/getCoupletClass',
            method: 'get',
            params: params
        })
    },

    /**
     * 删除课堂资料
     * @param {object} params 课堂资料Id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteCoupletClass (params) {
        return request({
            url: '/file-server/couplet-class/back/deleteCoupletClass',
            method: 'post',
            data: params
        })
    },

    /**
     * 修改课堂资料
     * @param {object} params 课堂资料属性
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyCoupletClass (params) {
        return request({
            url: '/file-server/couplet-class/back/modifyCoupletClass',
            method: 'post',
            data: params
        })
    },

    /**
     * 新增课堂资料
     * @param {object} params 课堂资料内容
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    addCoupletClass (params) {
        return request({
            url: '/file-server/couplet-class/back/addCoupletClass',
            method: 'post',
            data: params
        })
    },
    
    /**
     * 推荐对联课堂
     * @param {object} params 推荐对联课堂
     * @return 
     */
     recommendCoupletClass (params){ 
        return request({
            url: '/file-server/couplet-class/back/recommendCouplet',
            method: 'post',
            data: params
        })
    }
}

export default document;
