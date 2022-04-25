<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
        <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <template v-for="item in items">
                <template v-if="item.index !== '8'">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-submenu :index="item.index" :key="item.index" v-if="adminInfo.adminType == 0">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>                        
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import utils from '../../utils/utils';
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-user',
                    index: '0',
                    title: '用户相关',
                    subs: [
                        {
                            index: '/user_about/UserManage',
                            title: '用户管理'
                        },
                        // {
                        //     index: '/user_about/MemberManage',
                        //     title: '会员管理'
                        // },
                        {
                            index: '/user_about/ApplyMasterManage',
                            title: '楹联家申请审核'
                        },
                        // {
                        //     index: '/user_about/MemberCertification',
                        //     title: '会员认证审核'
                        // },
                        // {
                        //     index: '/user_about/MemberApplication',
                        //     title: '会员申请审核'
                        // },
                    ]
                },
                {
                    icon: 'el-icon-collection',
                    index: '1',
                    title: '楹联相关',
                    subs: [
                        {
                            index: '/couplet_about/CoupletManage',
                            title: '对联库管理'
                        },
                        {
                            index: '/couplet_about/MasterManage',
                            title: '楹联家管理'
                        },
                    ]
                },
                {
                    icon: 'el-icon-edit-outline',
                    index: '2',
                    title: '帖子相关',
                    subs: [
                        {
                            index: '/post_about/PostManage',
                            title: '帖子管理'
                        },
                        {
                            index: '/post_about/TypeManage',
                            title: '帖子/楹联类型管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-mobile-phone',
                    index: '3',
                    title: '新闻相关',
                    subs: [
                        {
                            index: '/news_about/NewsManage',
                            title: '新闻管理'
                        },
                        {
                            index: '/news_about/NewsRelease',
                            title: '新闻发布'
                        }
                    ]
                },
                {
                    icon: 'el-icon-position',
                    index: '4',
                    title: '推荐相关',
                    subs: [
                        {
                            index: '/recommend_about/CoupletRecommend',
                            title: '楹联推荐'
                        },
                        {
                            index: '/recommend_about/MasterRecommend',
                            title: '楹联家推荐'
                        },
                        {
                            index: '/recommend_about/NewsRecommend',
                            title: '新闻推荐'
                        },
                        {
                            index: '/recommend_about/CoupletClassRecommend',
                            title: '对联课堂推荐'
                        }
                    ]
                },
                {
                    icon: 'el-icon-orange',
                    index: '5',
                    title: '比赛相关',
                    subs: [
                        {
                            index: '/competition_about/CompetitionManage',
                            title: '比赛管理'
                        },
                        {
                            index: '/competition_about/CompetitionRelease',
                            title: '比赛发布'
                        },
                        {
                            index: '/competition_about/ManuscriptManage',
                            title: '投稿管理'
                        },
                        // {
                        //     index: '/competition_about/FirstReview',
                        //     title: '投稿一审'
                        // },
                        // {
                        //     index: '/competition_about/SecondReview',
                        //     title: '投稿二审'
                        // },
                        // {
                        //     index: '/competition_about/AwardDistribute',
                        //     title: '奖项分配'
                        // },
                        {
                            index: '/competition_about/AwardExport',
                            title: '获奖作品导出'
                        }
                    ]
                },
                {
                    icon: 'el-icon-folder-opened',
                    index: '6',
                    title: '资料相关',
                    subs: [
                        {
                            index: '/document_about/DocumentManage',
                            title: '资料管理'
                        },
                        {
                            index: '/document_about/DocumentUpload',
                            title: '资料上传'
                        },
                        {
                            index: '/document_about/CoupletClassManage',
                            title: '课堂资料管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-chat-line-round',
                    index: '7',
                    title: '通知推送相关',
                    subs: [
                        {
                            index: '/notice_about/AllUserNoticePush',
                            title: '全体用户通知推送'
                        },
                        // {
                        //     index: '/notice_about/AllMemberNoticePush',
                        //     title: '全体会员通知推送'
                        // },
                        {
                            index: '/notice_about/AwardNoticePush',
                            title: '获奖通知推送'
                        },
                        {
                            index: '/notice_about/AssignedUserNoticePush',
                            title: '指定用户通知推送'
                        }
                    ]
                },
                {
                    icon: 'el-icon-s-custom',
                    index: '8',
                    title: '管理员相关',
                    subs: [
                        {
                            index: '/admin_about/AdminManage',
                            title: '管理员管理'
                        },
                        // {
                        //     index: '/admin_about/ReviewerManage',
                        //     title: '评审人员管理'
                        // },
                        {
                            index: '/admin_about/AssociationInformation',
                            title: '关于我们'
                        }
                    ]
                },
            ],
            adminInfo: ''
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    },
    activated() {
        this.adminInfo = utils.getSessionInfo('adminInfo');
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
</style>
