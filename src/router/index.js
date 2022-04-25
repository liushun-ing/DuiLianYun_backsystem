import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    // hash:路径带#符号，如http://localhost/#/login 
    // history:路径不带#符号，如http://localhost/login
    // 通过mode修改，默认是hash
    mode: 'history',
    base: '/back/',
    routes: [
        {
            path: '/',
            redirect: '/user_about/UserManage'
        },
        {
            path: '/',
            // 路由懒加载，在跳转到该页面时，再下载该页面的js
            component: () => import(/* webpackChunkName: "Home" */ '../components/common/Home.vue'),
            meta: { title: '对联云后台管理' },
            props: true,
            children: [
                {
                    path: '/user_about/UserManage',
                    name: 'UserManage',
                    component: () => import(/* webpackChunkName: "UserManage" */ '../components/page/user_about/UserManage.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/user_about/MemberManage',
                    name: 'MemberManage',
                    component: () => import(/* webpackChunkName: "MemberManage" */ '../components/page/user_about/MemberManage.vue'),
                    meta: { title: '会员管理' }
                },
                {
                    path: '/user_about/ApplyMasterManage',
                    name: 'ApplyMasterManage',
                    component: () => import(/* webpackChunkName: "ApplyMasterManage" */ '../components/page/user_about/ApplyMasterManage.vue'),
                    meta: { title: '楹联家申请审核' }
                },
                {
                    path: '/user_about/MemberCertification',
                    name: 'MemberCertification',
                    component: () => import(/* webpackChunkName: "MemberCertification" */ '../components/page/user_about/MemberCertification.vue'),
                    meta: { title: '协会会员认证审核' }
                },
                {
                    path: '/user_about/MemberApplication',
                    name: 'MemberApplication',
                    component: () => import(/* webpackChunkName: "MemberApplication" */ '../components/page/user_about/MemberApplication.vue'),
                    meta: { title: '用户会员申请审核' }
                },
                {
                    path: '/couplet_about/CoupletManage',
                    name: 'CoupletManage',
                    component: () => import(/* webpackChunkName: "CoupletManage" */ '../components/page/couplet_about/CoupletManage.vue'),
                    meta: { title: '对联库管理' }
                },
                {
                    path: '/couplet_about/MasterManage',
                    name: 'MasterManage',
                    component: () => import(/* webpackChunkName: "MasterManage" */ '../components/page/couplet_about/MasterManage.vue'),
                    meta: { title: '楹联家管理' },
                },
                {
                    path: '/CoupletAdd',
                    name: 'CoupletAdd',
                    component: () => import(/* webpackChunkName: "CoupletAdd" */ '../components/page/couplet_about/CoupletAdd.vue'),
                    meta: { title: '楹联添加' }
                },
                {
                    path: '/post_about/TypeManage',
                    name: 'TypeManage',
                    component: () => import(/* webpackChunkName: "TypeManage" */ '../components/page/post_about/TypeManage.vue'),
                    meta: { title: '帖子/楹联类型管理' }
                },
                {
                    path: '/post_about/PostManage',
                    name: 'PostManage',
                    component: () => import(/* webpackChunkName: "PostManage" */ '../components/page/post_about/PostManage.vue'),
                    meta: { title: '帖子管理' }
                },
                {
                    path: '/competition_about/CompetitionManage',
                    name: 'CompetitionManage',
                    component: () => import(/* webpackChunkName: "CompetitionManage" */ '../components/page/competition_about/CompetitionManage.vue'),
                    meta: { title: '比赛管理' }
                },
                {
                    path: '/competition_about/CompetitionRelease',
                    name: 'CompetitionRelease',
                    component: () => import(/* webpackChunkName: "CompetitionRelease" */ '../components/page/competition_about/CompetitionRelease.vue'),
                    meta: { title: '比赛发布' }
                },
                {
                    path: '/competition_about/ManuscriptManage',
                    name: 'ManuscriptManage',
                    component: () => import(/* webpackChunkName: "ManuscriptManage" */ '../components/page/competition_about/ManuscriptManage.vue'),
                    meta: { title: '投稿管理' }
                },
                {
                    path: '/competition_about/FirstReview',
                    name: 'FirstReview',
                    component: () => import(/* webpackChunkName: "FirstReview" */ '../components/page/competition_about/FirstReview.vue'),
                    meta:{title: '投稿一审'}
                },
                {
                    path: '/competition_about/SecondReview',
                    name: 'SecondReview',
                    component: () => import(/* webpackChunkName: "SecondReview" */ '../components/page/competition_about/SecondReview.vue'),
                    meta:{title: '投稿二审'}
                },
                {
                    path: '/competition_about/AwardDistribute',
                    name: 'AwardDistribute',
                    component: () => import(/* webpackChunkName: "AwardDistribute" */ '../components/page/competition_about/AwardDistribute.vue'),
                    meta: { title: '奖项分配' }
                },
                {
                    path: '/competition_about/AwardExport',
                    name: 'AwardExport',
                    component: () => import(/* webpackChunkName: "AwardStore" */ '../components/page/competition_about/AwardExport.vue'),
                    meta: { title: '获奖作品导出' }
                },
                {
                    path: '/document_about/DocumentUpload',
                    name: 'DocumentUpload',
                    component: () => import(/* webpackChunkName: "DocumentUpload" */ '../components/page/document_about/DocumentUpload.vue'),
                    meta: { title: '资料上传' }
                },
                {
                    path: '/document_about/DocumentManage',
                    name: 'DocumentManage',
                    component: () => import(/* webpackChunkName: "DocumentManage" */ '../components/page/document_about/DocumentManage.vue'),
                    meta: { title: '资料管理' }
                },
                {
                    path: '/document_about/CoupletClassManage',
                    name: 'CoupletClassManage',
                    component: () => import(/* webpackChunkName: "CoupletClassManage" */ '../components/page/document_about/CoupletClassManage.vue'),
                    meta: { title: '课堂资料管理' }
                },
                {
                    path: '/notice_about/AllUserNoticePush',
                    name: 'AllUserNoticePush',
                    component: () => import(/* webpackChunkName: "AllUserNoticePush" */ '../components/page/notice_about/AllUserNoticePush.vue'),
                    meta: { title: '全体用户通知推送' }
                },
                {
                    path: '/notice_about/AllMemberNoticePush',
                    name: 'AllMemberNoticePush',
                    component: () => import(/* webpackChunkName: "AllMemberNoticePush" */ '../components/page/notice_about/AllMemberNoticePush.vue'),
                    meta: { title: '全体会员通知推送' }
                },
                {
                    path: '/notice_about/AwardNoticePush',
                    name: 'AwardNoticePush',
                    component: () => import(/* webpackChunkName: "AwardNoticePush" */ '../components/page/notice_about/AwardNoticePush.vue'),
                    meta:{title: '获奖通知推送'}
                },
                {
                    path: '/notice_about/AssignedUserNoticePush',
                    name: 'AssignedUserNoticePush',
                    component: () => import(/* webpackChunkName: "AssignedUserNoticePush" */ '../components/page/notice_about/AssignedUserNoticePush.vue'),
                    meta: { title: '指定用户通知推送' }
                },
                {
                    path: '/news_about/NewsManage',
                    name: 'NewsManage',
                    component: () => import(/* webpackChunkName: "NewsManage" */ '../components/page/news_about/NewsManage.vue'),
                    meta: { title: '新闻管理' }
                },
                {
                    path: '/news_about/NewsView/:newsId',
                    name: 'NewsView',
                    component: () => import(/* webpackChunkName: "NewsView" */ '../components/page/news_about/NewsView.vue'),
                    meta: { title: '新闻查看' }
                },
                {
                    path: '/news_about/NewsEdit',
                    name: 'NewsEdit',
                    component: () => import(/* webpackChunkName: "NewsEdit" */ '../components/page/news_about/NewsEdit.vue'),
                    meta: { title: '新闻编辑' }
                },
                {
                    path: '/news_about/NewsRelease',
                    name: 'NewsRelease',
                    component: () => import(/* webpackChunkName: "NewsRelease" */ '../components/page/news_about/NewsRelease.vue'),
                    meta: { title: '新闻发布' }
                },
                {
                    path: '/recommend_about/CoupletRecommend',
                    name: 'CoupletRecommend',
                    component: () => import(/* webpackChunkName: "CoupletRecommend" */ '../components/page/recommend_about/CoupletRecommend.vue'),
                    meta: { title: '楹联推荐管理' }
                },
                {
                    path: '/recommend_about/MasterRecommend',
                    name: 'MasterRecommend',
                    component: () => import(/* webpackChunkName: "MasterRecommend" */ '../components/page/recommend_about/MasterRecommend.vue'),
                    meta: { title: '楹联家推荐管理' }
                },
                {
                    path: '/recommend_about/NewsRecommend',
                    name: 'NewsRecommend',
                    component: () => import(/* webpackChunkName: "NewsRecommend" */ '../components/page/recommend_about/NewsRecommend.vue'),
                    meta: { title: '新闻推荐管理' }
                },
                {
                    path: '/recommend_about/CoupletClassRecommend',
                    name: 'CoupletClassRecommend',
                    component: () => import(/* webpackChunkName: "NewsRecommend" */ '../components/page/recommend_about/CoupletClassRecommend.vue'),
                    meta: { title: '对联课堂推荐管理' }
                },
                {
                    path: '/admin_about/AdminManage',
                    name: 'AdminManage',
                    component: () => import(/* webpackChunkName: "AdminManage" */ '../components/page/admin_about/AdminManage.vue'),
                    meta: { title: '管理员管理' }
                },
                {
                    path: '/admin_about/ReviewerManage',
                    name: 'ReviewerManage',
                    component: () => import(/* webpackChunkName: "ReviewerManage" */ '../components/page/admin_about/ReviewerManage.vue'),
                    meta: { title: '评审人员管理' }
                },
                {
                    path: '/admin_about/AssociationInformation',
                    name: 'AssociationInformation',
                    component: () => import(/* webpackChunkName: "AssociationInformation" */ '../components/page/admin_about/AssociationInformation.vue'),
                    meta: { title: '关于我们' }
                },
                {
                    path: '/404',
                    name: '404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    name: '403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
