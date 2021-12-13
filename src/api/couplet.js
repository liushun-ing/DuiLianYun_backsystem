import request from '../utils/request';

const couplet = {

    /**
     * 分页获取楹联
     * @param {object} params params包含pageSize,currentPage,inputKey(搜索关键字，没有时为空)
     * @returns 返回pagesize个楹联，total和coupletList[{}]
     */
    getCoupletList (params) {
        return request({
            url: '/couplet-server/couplet/back/getCoupletList',
            method: 'get',
            data: params
        })
    },

    /**
     * 新增楹联
     * @param {object} params params包含楹联的标题，上联，下联，作者，楹联类型（id）等
     * @returns 
     */
    addCouplet (params) {
        return request({
            url: '/couplet-server/couplet/back/addCouplet',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取已有楹联类型
     * @returns 返回的数据包含coupletTypeList[{coupletId,coupletDetails}]和total
     */
    getCoupletTpyeList () {
        return request({
            url: '/couplet-server/couplet/back/getCoupletTypeList',
            method: 'get',
            data: params
        })
    },
      
    /**
     * 添加楹联类型
     * @param {object} params params包含楹联类型描述
     * @returns 
     */
    addCoupletType (params) {
        return request({
            url: '/couplet-server/couplet/back/addCoupletType',
            method: 'post',
            data: params
        })
    },

    /**
     * 
     * @param {object} params params为楹联类型的id和描述
     * @returns 
     */
    modifyCoupletType (params) {
        return request({
            url: '/couplet-server/couplet/back/modifyCoupletType',
            method: 'post',
            data: params
        })
    },

    /**
     * 删除楹联类型
     * @param {object} params params为楹联类型的id
     * @returns 
     */
    deleteCoupletType (params) {
        return request({
            url: '/couplet-server/couplet/back/deleteCoupletType',
            method: 'get',
            data: params
        })
    },
}

export default couplet;
