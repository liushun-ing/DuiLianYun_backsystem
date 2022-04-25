import request from '../utils/request';

const recommend = {    

    /**
     * 获取推荐楹联列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getCoupletRecommendList (params) {
        return request({
            url: '/couplet-server/couplet/back/getCoupletRecommendList',
            method: 'get',
            params: params
        });
    },

    /**
     * 取消推荐楹联
     * @param {object} params coupletId 
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    cancelRecommendCouplet (params) {
        return request({
            url: '/couplet-server/couplet/back/cancelRecommendCouplet',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取楹联家推荐列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getMasterRecommendList (params) {
        return request({
            url: '/couplet-server/master/back/getMasterRecommendList',
            method: 'get',
            params: params
        });
    },

    /**
     * 取消推荐楹联家
     * @param {object} params masterId
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    cancelRecommendMaster (params) {
        return request({
            url: '/couplet-server/master/back/cancelRecommendMaster',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取新闻推荐列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
     getNewsRecommendList (params) {
        return request({
            url: '/post-server/news/back/getNewsRecommendList',
            method: 'get',
            params: params
        });
    },

    /**
     * 取消推荐新闻
     * @param {object} params masterId
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    cancelRecommendNews (params) {
        return request({
            url: '/post-server/news/back/cancelRecommendNews',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取所有推荐中的对联课堂
     * @param {object} params 
     * @returns 
     */
    getCoupletClassRecommendList (params) {
        return request({
            url: '/file-server/couplet-class/back/getCoupletClassRecommendList',
            method: 'get',
            params: params
        })
    },

    /**
     * 
     * @param {object} params 
     * @returns 
     */
    cancelRecommendCoupletClass (params) {
        return request({
            url: '/file-server/couplet-class/back/cancelRecommendCoupletClass',
            method: 'post',
            data: params
        })
    }
}

export default recommend;
