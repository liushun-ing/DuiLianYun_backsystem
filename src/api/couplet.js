import request from '../utils/request';

const couplet = {
    /**
     * 获取楹联列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getCoupletList(params) {
        return request({
            url: '/couplet-server/couplet/back/getCoupletList',
            method: 'get',
            params: params
        });
    },

    /**
     * 添加楹联
     * @param {object} params 楹联相关数据
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    addCouplet(params) {
        return request({
            url: '/couplet-server/couplet/back/addCouplet',
            method: 'post',
            data: params
        });
    },

    /**
     * 修改楹联
     * @param {object} params 楹联信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyCouplet(params) {
        return request({
            url: '/couplet-server/couplet/back/modifyCouplet',
            method: 'post',
            data: params
        });
    },

    /**
     * 删除楹联
     * @param {object} params coupletId
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteCouplet(params) {
        return request({
            url: '/couplet-server/couplet/back/deleteCouplet',
            method: 'post',
            data: params
        });
    },

    /**
     * 推荐楹联
     * @param {object} params 推荐信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    recommendCouplet(params) {
        return request({
            url: '/couplet-server/couplet/back/recommendCouplet',
            method: 'post',
            data: params
        });
    },

    /**
     * 推荐楹联
     * @param {object} params 推荐相关时间
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    recommendCouplet(params) {
        return request({
            url: '/couplet-server/couplet/back/recommendCouplet',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取楹联类型列表
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getCoupletTypeList() {
        return request({
            url: '/couplet-server/couplet-type/getCoupletType',
            method: 'get'
        });
    },

    /**
     * 添加楹联类型
     * @param {object} params 楹联类型描述
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    addCoupletType(params) {
        return request({
            url: '/couplet-server/couplet-type/back/addCoupletType',
            method: 'post',
            data: params
        });
    },

    /**
     * 删除楹联类型
     * @param {object} params 楹联类型id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteCoupletType(params) {
        return request({
            url: '/couplet-server/couplet-type/back/deleteCoupletType',
            method: 'post',
            data: params
        });
    },

    /**
     * 修改楹联类型
     * @param {object} params 楹联类型实体
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyCoupletType(params) {
        return request({
            url: '/couplet-server/couplet-type/back/modifyCoupletType',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取楹联家列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getMasterList(params) {
        return request({
            url: '/couplet-server/master/back/getMasterList',
            method: 'get',
            params: params
        });
    },

    /**
     * 添加楹联家
     * @param {object} params 楹联家信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    addMaster(params) {
        return request({
            url: '/couplet-server/master/back/addMaster',
            method: 'post',
            data: params
        });
    },

    /**
     * 删除楹联家
     * @param {object} params 楹联家id和它对应的楹联作者id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteMaster(params) {
        return request({
            url: '/couplet-server/master/back/deleteMaster',
            method: 'post',
            data: params
        });
    },

    /**
     * 推荐楹联家
     * @param {object} params 楹联家id和推荐时间
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    recommendMaster(params) {
        return request({
            url: '/couplet-server/master/back/recommendMaster',
            method: 'post',
            data: params
        });
    },

    /**
     * 修改楹联家
     * @param {object} params 楹联家相关数据
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyMaster(params) {
        return request({
            url: '/couplet-server/master/back/modifyMaster',
            method: 'post',
            data: params
        });
    },

    /**
     * 删除头像
     * @param {object} params 图片路径
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deletePhoto(params) {
        return request({
            url: '/couplet-server/master/back/deletePhoto',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取指定时间范围内的对联
     * @param {object} params
     */
    getCoupletChosen(params) {
        return request({
            url: '/couplet-server/couplet/back/getCoupletChosen',
            params: params,
            method: 'get'
        });
    },

    /**
     * 获取作者简介
     * @param {object} params authorId
     * @returns
     */
    getAuthorIntroduction(params) {
        return request({
            url: '/couplet-server/master/back/getAuthorIntroduction',
            params: params,
            method: 'get'
        });
    },

    /**
     * 设为优秀作品
     * @param {*} params
     * @returns
     */
    setGood(params) {
        return request({
            url: '/couplet-server/couplet/back/setGood',
            data: params,
            method: 'post'
        });
    },

    /**
     * 取消优秀作品
     * @param {*} params
     * @returns
     */
    cancelGood(params) {
        return request({
            url: '/couplet-server/couplet/back/cancelGood',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取所有优秀作品
     * @returns 
     */
    getGoodList() {
        return request({
            url: '/couplet-server/couplet/back/getGoodList',
            method: 'get'
        });
    }
};

export default couplet;
