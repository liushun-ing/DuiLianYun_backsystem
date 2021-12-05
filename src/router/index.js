import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    // hash:路径带#符号，如http://localhost/#/login 
    // history:路径不带#符号，如http://localhost/login
    // 通过mode修改，默认是hash
    mode: 'history',
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
            children: [
                {
                    path: '/user_about/UserManage',
                    component: () => import(/* webpackChunkName: "UserManage" */ '../components/page/user_about/UserManage.vue'),
                    meta: { title: '所有用户管理' }
                },
                {
                    path: '/user_about/AssMemberManage',
                    component: () => import(/* webpackChunkName: "AssMemberManage" */ '../components/page/user_about/AssMemberManage.vue'),
                    meta: { title: '协会会员管理' }
                },
                {
                    path: '/user_about/UserMemberManage',
                    component: () => import(/* webpackChunkName: "UserMemberManage" */ '../components/page/user_about/UserMemberManage.vue'),
                    meta: { title: '用户会员管理' }
                },
                {
                    path: '/user_about/MemberCertification',
                    component: () => import(/* webpackChunkName: "MemberCertification" */ '../components/page/user_about/MemberCertification.vue'),
                    meta: { title: '协会会员认证审核' }
                },
                {
                    path: '/user_about/MemberApplication',
                    component: () => import(/* webpackChunkName: "MemberApplication" */ '../components/page/user_about/MemberApplication.vue'),
                    meta: { title: '用户会员申请审核' }
                },
                {
                    path: '/user_about/AuthorManage',
                    component: () => import(/* webpackChunkName: "AuthorManage" */ '../components/page/user_about/AuthorManage.vue'),
                    meta: { title: '楹联家管理' }
                },
                {
                    path: '/couplet_about/CoupletTypeManage',
                    component: () => import(/* webpackChunkName: "CoupletTypeManage" */ '../components/page/couplet_about/CoupletTypeManage.vue'),
                    meta: { title: '楹联类型管理' }
                },
                {
                    path: '/couplet_about/CoupletManage',
                    component: () => import(/* webpackChunkName: "CoupletManage" */ '../components/page/couplet_about/CoupletManage.vue'),
                    meta: { title: '楹联管理' }
                },
                {
                    path: '/post_about/PostTypeManage',
                    component: () => import(/* webpackChunkName: "PostTypeManage" */ '../components/page/post_about/PostTypeManage.vue'),
                    meta: { title: '帖子类型管理' }
                },
                {
                    path: '/post_about/PostManage',
                    component: () => import(/* webpackChunkName: "PostManage" */ '../components/page/post_about/PostManage.vue'),
                    meta: { title: '帖子管理' }
                },
                {
                    path: '/competition_about/ActivityManage',
                    component: () => import(/* webpackChunkName: "ActivityManage" */ '../components/page/competition_about/ActivityManage.vue'),
                    meta: { title: '比赛管理' }
                },
                {
                    path: '/competition_about/ActivityPush',
                    component: () => import(/* webpackChunkName: "ActivityPush" */ '../components/page/competition_about/ActivityPush.vue'),
                    meta: { title: '比赛发布' }
                },
                {
                    path: '/competition_about/ActivityCoupletManage',
                    component: () => import(/* webpackChunkName: "ActivityCoupletManage" */ '../components/page/competition_about/ActivityCoupletManage.vue'),
                    meta: { title: '比赛作品评选' }
                },
                {
                    path: '/competition_about/OneActivityCoupletManage',
                    component: () => import(/* webpackChunkName: "OneActivityCoupletManage" */ '../components/page/competition_about/OneActivityCoupletManage.vue'),
                    meta: { title: '单个比赛作品评选' }
                },
                {
                    path: '/competition_about/OneActivityAwardManage',
                    component: () => import(/* webpackChunkName: "OneActivityAwardManage" */ '../components/page/competition_about/OneActivityAwardManage.vue'),
                    meta: { title: '单个比赛获奖作品入库管理' }
                },
                {
                    path: '/competition_about/ActivityAwardManage',
                    component: () => import(/* webpackChunkName: "ActivityAwardManage" */ '../components/page/competition_about/ActivityAwardManage.vue'),
                    meta: { title: '获奖作品入库管理' }
                },
                {
                    path: '/document_about/DocumentUpload',
                    component: () => import(/* webpackChunkName: "DocumentUpload" */ '../components/page/document_about/DocumentUpload.vue'),
                    meta: { title: '资料上传' }
                },
                {
                    path: '/document_about/DocumentManage',
                    component: () => import(/* webpackChunkName: "DocumentManage" */ '../components/page/document_about/DocumentManage.vue'),
                    meta: { title: '资料管理' }
                },
                {
                    path: '/notice_about/AllUserNoticePush',
                    component: () => import(/* webpackChunkName: "AllUserNoticePush" */ '../components/page/notice_about/AllUserNoticePush.vue'),
                    meta: { title: '所有用户通知推送' }
                },
                {
                    path: '/notice_about/SingleUserNoticePush',
                    component: () => import(/* webpackChunkName: "SingleUserNoticePush" */ '../components/page/notice_about/SingleUserNoticePush.vue'),
                    meta: { title: '单个用户通知推送' }
                },
                {
                    path: '/admin_about/AdminManage',
                    component: () => import(/* webpackChunkName: "AdminManage" */ '../components/page/admin_about/AdminManage.vue'),
                    meta: { title: '管理员管理' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
