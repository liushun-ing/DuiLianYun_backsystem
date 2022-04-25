import request from '../utils/request';

const news = {    

    /**
     * 获取新闻列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getNewsList (params) {
        return request({
            url: '/post-server/news/back/getNewsList',
            method: 'get',
            params: params
        });
    },

    /**
     * 删除新闻
     * @param {object} params 新闻id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteNews (params) {
        return request({
            url: '/post-server/news/back/deleteNews',
            method: 'post',
            data: params
        });
    },

    /**
     * 推荐新闻
     * @param {object} params 推荐时间
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    recommendNews (params) {
        return request({
            url: '/post-server/news/back/recommendNews',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取新闻详情
     * @param {object} params 新闻id
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getNewsDetail (params) {
        return request({
            url: '/post-server/news/back/getNewsDetail',
            method: 'get',
            params: params
        })
    },

    /**
     * 发布新闻
     * @param {object} params 新闻数据
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    releaseNews (params) {
        return request({
            url: '/post-server/news/back/releaseNews',
            method: 'post',
            data: params
        });
    },

    /**
     * 修改新闻
     * @param {object} params 新闻数据
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyNews (params) {
        return request({
            url: '/post-server/news/back/modifyNews',
            method: 'post',
            data: params
        })
    },

    /**
     * 删除图片
     * @param {object} params 图片路径
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteImage (params) {
        return request({
            url: '/post-server/manuscript/delete',
            method: 'post',
            data: params
        });
    },

}

export default news;
