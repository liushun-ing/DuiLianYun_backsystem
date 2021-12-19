import request from '../utils/request';

const competition = {    

    // 样例
    // /**
    //  * 添加管理员
    //  * @param {object} params 账号和密码
    //  * @returns 成功返回data，失败返回rejected状态的promise对象
    //  */
    // addAdmin (params) {
    //     return request({
    //         url: '/user-server/admin/addAdmin',
    //         method: 'post',
    //         data: params
    //     })
    // },

    /**
     * 
     * @returns 
     */
    getAllCompetition(){
        return request({
            url: '/post-server/competition/back/getAllCompetition',
            method: 'get'
        })
    },

    /**
     * 
     * @param {object} params 
     * @returns 
     * {
     * manuscriptId: '',
     * competitionId: '',
     * userName:'',
     * userPrivince: '',
     * manuscriptTime: '',
     * }
     */
     getManuscriptFirst(params){
        return request({
            url: '/post-server/competition/back/getManuscriptFirst',
            method: 'get',
            data: params
        })
    },

    /**
     * 
     * @param {object} params 
     * params
     * @returns 
     */
    uploadReviewDataFirst(params){
        return request({
            url:'/post-server/competition/back/uploadReviewDataFirst',
            method: 'post',
            data:params   
        })
    },
    
    /**
     * 
     * @param {object} params 
     * {
     *      adminId:'',
     *      competitionId: ''
     * }
     * @returns 
     * 如果一审结束，返回:
     * isOver = true;
     * manuscriptList = [
     * {
     * manuscriptId: '',
     * competitionId: '',
     * userName:'',
     * userPrivince: '',
     * firstScore: '',
     * firstComment: '',
     * manuscriptContent: '',
     * manuscriptTime: '',
     * }]
     * ;
     * 如果一审未结束，返回
     * isOver = false;
     * manuscriptList = [],为空
     * ;
     * 
     */
     getManuscriptSecond(params){
        return request({
            url: '/post-server/competition/back/getManuscriptSecond',
            method: 'get',
            data: params
        })
    },

    /**
     * 
     * @param {object} params 
     * @returns 
     * 
     * 
     */
    uploadReviewDataSecond(params){
        return request({
            url: '/post-server/competition/back/uploadReviewDataSecond',
            method: 'post',
            data: params
        })
    },


}

export default competition;
