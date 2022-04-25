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

    /**
     * 将帖子加入楹联库
     * @param {object} params 帖子的相关信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    addToCouplet (params) {
        return request({
            url: '/post-server/post/back/addToCouplet',
            method: 'post',
            data: params
        })
    },

    /**
     * 获取帖子类型列表
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getPostTypeList () {
        return request({
            url: '/post-server/post-type/getPostType',
            method: 'get',
        })
    },

    /**
     * 添加帖子类型
     * @param {object} params 帖子类型描述
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    addPostType (params) {
        return request({
            url: '/post-server/post-type/back/addPostType',
            method: 'post',
            data: params
        })
    },

    /**
     * 删除帖子类型
     * @param {object} params 帖子类型id
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deletePostType (params) {
        return request({
            url: '/post-server/post-type/back/deletePostType',
            method: 'post',
            data: params
        })
    },

    /**
     * 修改帖子类型
     * @param {object} params 帖子类型实体
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyPostType (params) {
        return request({
            url: '/post-server/post-type/back/modifyPostType',
            method: 'post',
            data: params
        })
    },

    /**
     * 标记此页帖子已读
     * @param {object} params userId的一个数组
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    viewAll (params) {
        return request({
            url: '/post-server/post/back/viewAll',
            method: 'post',
            data: params
        })
    },

    /**
     * 批量帖子入库
     * @param {*} params 
     * @returns 
     */
    addManyToCouplet(params) {
      return request({
        url: '/post-server/post/back/addManyToCouplet',
        method: 'post',
        data: params
      });
    }

}

export default post;
