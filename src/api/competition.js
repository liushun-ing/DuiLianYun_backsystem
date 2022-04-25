import request from '../utils/request';

const competition = {    

    /**
     * 获取比赛列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getCompetitionList (params) {
        return request({
            url: '/post-server/competition/back/getCompetitionList',
            method: 'get',
            params: params
        });
    },

    /**
     * 删除比赛
     * @param {object} params competitionId
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    deleteCompetition (params) {
        return request({
            url: '/post-server/competition/back/deleteCompetition',
            method: 'post',
            data: params
        });
    },

    /**
     * 修改比赛
     * @param {object} params 比赛信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    modifyCompetition (params) {
        return request({
            url: '/post-server/competition/back/modifyCompetition',
            method: 'post',
            data: params
        });
    },

    /**
     * 发布比赛
     * @param {object} params 比赛信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    releaseCompetition (params) {
        return request({
            url: '/post-server/competition/back/releaseCompetition',
            method: 'post',
            data: params
        });
    },

    /**
     * 停止使用！！
     * 获取投稿列表
     * @param {object} params 分页参数和搜索关键字
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getManuscriptList (params) {
        return request({
            url: '/post-server/manuscript/back/getManuscriptList',
            method: 'get',
            params: params
        });
    },

    /**
     * 修改投稿
     * @param {*} params 
     * @returns 
     */
    modifyManuscript (params) {
      return request({
        url: '/post-server/manuscript/back/modifyManuscript',
        method: 'post',
        data: params
      })
    },

    /**
     * 退稿
     * @param {*} params manuscriptId
     * @returns 
     */
    deleteManuscript (params) {
      return request({
        url: '/post-server/manuscript/back/deleteManuscript',
        method: 'post',
        data: params
      })
    },

    /**
     * 获取对应比赛的所有投稿
     * @param {object} params 选择的比赛id
     * @returns 成功返回data，包含total，和投稿列表
     */
    getAllManuscript (params) {
        return request({
            url: '/post-server/manuscript/back/getAllManuscript',
            method: 'get',
            params: params
        });
    },

    /**
     * 获取该比赛的全部获奖作品
     * @param {object} params 比赛id
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getAllAward (params) {
        return request({
            url: '/post-server/award/back/getAllAward',
            method: 'get',
            params: params
        });
    },

    /**
     * 获取分配奖项的作品列表
     * @param {object} params 比赛id，分页信息
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getDistributeList (params) {
        return request({
            url: '/post-server/manuscript/back/getDistributeList',
            method: 'get',
            params: params
        });
    },

    /**
     * 设置奖项信息
     * @param {object} params 奖项信息
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    distributeAward (params) {
        return request({
            url: '/post-server/award/back/distributeAward',
            method: 'post',
            data: params
        });
    },

    /**
     * 获取所有的比赛
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getAllCompetition(){
        return request({
            url: '/post-server/competition/back/getAllCompetition',
            method: 'get'
        })
    },

    /**
     * 获取一审投稿
     * @param {object} params 管理员id和比赛id
     * @returns 成功返回data，失败返回rejected状态的promise对象
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
            params: params
        })
    },

    /**
     * 设置一审结果
     * @param {object} params 一审结果
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    uploadReviewDataFirst(params){
        return request({
            url: '/post-server/competition/back/uploadReviewDataFirst',
            method: 'post',
            data: params   
        })
    },
    
    /**
     * 获取二审投稿
     * @param {object} params 比赛id和管理员id
     * @returns 成功返回data，失败返回rejected状态的promise对象
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
     */
    getManuscriptSecond(params){
        return request({
            url: '/post-server/competition/back/getManuscriptSecond',
            method: 'get',
            params: params
        })
    },

    /**
     * 设置二审结果
     * @param {object} params 二审结果
     * @returns 成功无数据返回，失败返回rejected状态的promise对象
     */
    uploadReviewDataSecond(params){
        return request({
            url: '/post-server/competition/back/uploadReviewDataSecond',
            method: 'post',
            data: params
        })
    },

    /**
     * 将指定的投稿设为入围
     * @param {object} params 
     * @returns 
     */
    setManuscriptShortlisted(params) {
        return request({
            url: '/post-server/manuscript/back/setManuscriptShortlisted',
            method: 'post',
            data: params
        })
    }
}

export default competition;
