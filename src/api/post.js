import request from '../utils/request';

const post = {    

    /**
     * 获取帖子列表
     * @param {object} params 分页参数和搜索输入关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getPostList (params) {
        return request({
            url: '/post-server/post/back/getPostList',
            method: 'get',
            params: params
        });
    },

    /**
     * 删除帖子
     * @param {object} params 帖子id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deletePost (params) {
        return request({
            url: '/post-server/post/back/deletePost',
            method: 'post',
            data: params
        })
    },

}

export default post;
