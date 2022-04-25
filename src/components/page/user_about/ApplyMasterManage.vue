<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 楹联家申请管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="昵称/姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="masterApplyList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="userNickname" label="昵称" min-width="150" align="center"></el-table-column>
                <el-table-column prop="userName" label="姓名" min-width="150" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.userPortrait"
                            :preview-src-list="[scope.row.userPortrait]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="userPhone" label="电话" min-width="150" align="center"></el-table-column>
                <el-table-column prop="userBirthday" label="出生日期" min-width="150" align="center"></el-table-column>
                <el-table-column prop="userLocation" label="住址" min-width="200" align="center"></el-table-column>
                <el-table-column prop="userMotto" label="座右铭" min-width="200" align="center"></el-table-column>
                <el-table-column prop="userIntroduction" label="个人简介" min-width="300" align="center"></el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div v-if="scope.row.userApplyStatus === 1">
                            <el-button
                                type="text"
                                icon="el-icon-success"
                                @click="handlePass(scope.$index, scope.row)"
                            >通过</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-error"
                                class="red"
                                @click="handleDeny(scope.$index, scope.row)"
                            >不通过</el-button>
                        </div>
                        <div v-else-if="scope.row.userApplyStatus === 2">
                            <el-tag>已通过</el-tag>
                        </div>
                        <div v-else>
                            <el-tag type="info">已拒绝</el-tag>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                    @prev-click="handlePagePrev"
                    @next-click="handlePageNext"
                ></el-pagination>
            </div>
        </div>

        <el-dialog title="申请审核" :visible.sync="passVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px;">将通过该用户的楹联家申请，确定要继续吗？</div>
            <el-checkbox v-model="isSendNotice">是否自动发送如下通知</el-checkbox>
            <el-descriptions :column="1" style="padding-top: 10px;" border>
                <el-descriptions-item label="通知标题">{{noticeForm.noticeTitle}}</el-descriptions-item>
                <el-descriptions-item label="通知内容">{{noticeForm.noticeContent}}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPass">取 消</el-button>
                <el-button type="primary" @click="savePass">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="申请审核" :visible.sync="denyVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px;">将拒绝该用户的楹联家申请，确定要继续吗？</div>
            <el-checkbox v-model="isSendNotice">是否自动发送如下通知</el-checkbox>
            <el-descriptions :column="1" style="padding-top: 10px;" border>
                <el-descriptions-item label="通知标题">{{noticeForm.noticeTitle}}</el-descriptions-item>
                <el-descriptions-item label="通知内容">{{noticeForm.noticeContent}}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDeny">取 消</el-button>
                <el-button type="primary" @click="saveDeny">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js'
export default {
    name: 'ApplyMasterManage',
    data() {
        return {
            inputKey: '',
            masterApplyList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,

            passVisible: false,
            passForm: {},
            passIndex: -1,

            denyVisible: false,
            denyForm: {},
            denyIndex: -1,

            noticeForm: {},
            isSendNotice: true,
        };
    },
    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getMasterApplyList();
    },
    methods: {
        async getMasterApplyList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.user.getMasterApplyList(params);
                this.masterApplyList = res.masterApplyList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取楹联家申请列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getMasterApplyList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getMasterApplyList();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getMasterApplyList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },

        cancelDeny() {
            this.denyVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['denyForm'].clearValidate();
        },

        handleDeny(index, row) {
            this.denyVisible = true;
            this.denyIndex = index;
            this.denyForm = JSON.parse(JSON.stringify(row));
            this.isSendNotice = true;
            this.noticeForm = utils.getNoticeTemplate(10);
        },

        async saveDeny() {
            this.denyVisible = false;
            let params = {
                userId: this.denyForm.userId
            };
            try {
                await this.$api.user.denyMasterApply(params);
                this.$message({
                    message: '拒绝申请成功',
                    duration: 2000,
                    type: 'success'
                });
                this.masterApplyList[this.denyIndex].userApplyStatus = 0;
                if(this.isSendNotice) {
                    setTimeout(() => {
                        utils.sendNotice(this.denyForm.userId, 10);
                    }, 1000);
                }
            } catch (error) {
                this.$message({
                    message: '拒绝申请失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            };
        },

        handlePass(index, row) {
            this.passVisible = true;
            this.passIndex = index;
            this.passForm = JSON.parse(JSON.stringify(row));
            this.isSendNotice = true;
            this.noticeForm = utils.getNoticeTemplate(9);
        },

        cancelPass() {
            this.passVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['passForm'].clearValidate();
        },

        async savePass() {
            this.passVisible = false;
            let params = {
                masterName: this.passForm.userName,
                masterDynasty: '当代',
                masterIntroduction: this.passForm.userIntroduction,
                masterPhoto: this.passForm.userPortrait,
                masterBindedUserId: this.passForm.userId
            };
            try {
                await this.$api.user.promoteUser(params);
                this.$message({
                    message: '通过楹联家申请成功',
                    duration: 2000,
                    type: 'success'
                });
                this.masterApplyList[this.passIndex].userApplyStatus = 2;
                // 发送通知
                if(this.isSendNotice) {
                    setTimeout(() => {
                        utils.sendNotice(this.passForm.userId, 9);
                    }, 1000);
                }
            } catch (error) {
                this.$message({
                    message: '通过楹联家申请失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            };
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.green {
    color: green;
}
.yellowgreen {
    color: yellowgreen;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
