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
                <template v-if="item.subs">
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
                    <div :index="item.index" :key="item.index" v-if="item.index != '/admin_about/AdminManage' || (item.index == '/admin_about/AdminManage' && adminInfo.adminType == 0)">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </el-menu-item>
                    </div>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
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
                            title: '所有用户管理'
                        },
                        {
                            index: '/user_about/AssMemberManage',
                            title: '协会会员管理'
                        },
                        {
                            index: '/user_about/UserMemberManage',
                            title: '用户会员管理'
                        },
                        {
                            index: '/user_about/MemberCertification',
                            title: '协会会员认证审核'
                        },
                        {
                            index: '/user_about/MemberApplication',
                            title: '用户会员申请审核'
                        },
                        {
                            index: '/user_about/AuthorManage',
                            title: '楹联家管理'
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '1',
                    title: '楹联相关',
                    subs: [
                        {
                            index: '/couplet_about/CoupletManage',
                            title: '楹联管理'
                        },
                        {
                            index: '/couplet_about/CoupletTypeManage',
                            title: '楹联类型管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-tickets',
                    index: '2',
                    title: '帖子相关',
                    subs: [
                        {
                            index: '/post_about/PostManage',
                            title: '帖子管理'
                        },
                        {
                            index: '/post_about/PostTypeManage',
                            title: '帖子类型管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-orange',
                    index: '3',
                    title: '比赛相关',
                    subs: [
                        {
                            index: '/competition_about/ActivityManage',
                            title: '比赛管理'
                        },
                        {
                            index: '/competition_about/ActivityPush',
                            title: '比赛发布'
                        },
                        {
                            index: '/competition_about/ActivityCoupletManage',
                            title: '比赛作品评选'
                        },
                        {
                            index: '/competition_about/ActivityAwardManage',
                            title: '获奖作品入库管理'
                        },
                        {
                            index: '/competition_about/OneActivityCoupletManage',
                            title: '单个比赛作品评选'
                        },
                        {
                            index: '/competition_about/OneActivityAwardManage',
                            title: '单个获奖作品入库管理'
                        },
                    ]
                },
                {
                    icon: 'el-icon-folder-opened',
                    index: '4',
                    title: '资料相关',
                    subs: [
                        {
                            index: '/document_about/DocumentManage',
                            title: '资料管理'
                        },
                        {
                            index: '/document_about/DocumentUpload',
                            title: '资料上传'
                        }
                    ]
                },
                {
                    icon: 'el-icon-chat-line-round',
                    index: '5',
                    title: '通知推送相关',
                    subs: [
                        {
                            index: '/notice_about/AllUserNoticePush',
                            title: '所有用户通知推送'
                        },
                        {
                            index: '/notice_about/SingleUserNoticePush',
                            title: '单个用户通知推送'
                        }
                    ]
                },
                {
                    icon: 'el-icon-user',
                    index: '/admin_about/AdminManage',
                    title: '管理员管理'
                }
            ],
            adminInfo: this.GLOBAL.adminInfo
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
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
