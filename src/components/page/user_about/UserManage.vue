<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 所有用户管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input
                    @keyup.enter.native="handleSearch"
                    v-model="inputKey"
                    placeholder="昵称/姓名/电话号码"
                    class="handle-input mr10"
                ></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="userList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="userNickname" label="昵称" min-width="120" align="center"></el-table-column>
                <el-table-column prop="userName" label="姓名" min-width="100" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.userPortrait"
                            :preview-src-list="[scope.row.userPortrait]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="userPhone" min-width="130" label="电话" align="center"></el-table-column>
                <!-- <el-table-column prop="userLoginTime" label="注册时间" min-width="100" align="center" sortable></el-table-column> -->
                <el-table-column label="类型" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.userType === 0" type="info" style="display: block">普通用户</el-tag>
                        <el-tag v-else-if="scope.row.userType === 1" type="warning" style="display: block">协会会员</el-tag>
                        <el-tag v-else-if="scope.row.userType === 2" type="warning" style="display: block">楹联家</el-tag>
                        <el-tag v-else-if="scope.row.userType === 3" type="danger" style="display: block">会员&楹联家</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="职称" min-width="130" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-tag v-if="scope.row.userDuty === null" type="info">暂无</el-tag>
                            <el-tag v-else type="warning">{{ scope.row.userDuty }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.userIsDisable === 0 ? 'success' : 'danger'">{{
                            scope.row.userIsDisable === 0 ? '正常' : '禁用'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="userLoginTime" min-width="160" label="注册时间" align="center"></el-table-column>
                <el-table-column label="操作" min-width="220" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div v-if="scope.row.userIsDisable === 0">
                            <el-button type="text" icon="el-icon-view" class="green" @click="handleViewDetails(scope.row)">查看</el-button>
                            <el-button type="text" icon="el-icon-circle-close" class="red" @click="handleDisable(scope.$index, scope.row)"
                                >禁用</el-button
                            >
                            <el-button
                                style="color: orange"
                                v-if="scope.row.userType === 0 || scope.row.userType === 1"
                                type="text"
                                icon="el-icon-s-promotion"
                                @click="handlePromote(scope.$index, scope.row)"
                                >设为楹联家</el-button
                            >
                            <el-button style="color: rgb(144, 147, 153)" v-else disabled type="text" icon="el-icon-s-promotion"
                                >已为楹联家</el-button
                            >
                            <el-button
                                style="color: rgb(13, 147, 224)"
                                type="text"
                                icon="el-icon-user"
                                @click="handleSetDuty(scope.$index, scope.row)"
                                >设置职务</el-button
                            >
                            <el-button
                                style="color: rgb(128, 128, 0)"
                                type="text"
                                icon="el-icon-s-comment"
                                @click="handleSendNotice(scope.$index, scope.row)"
                                >发通知</el-button
                            >
                        </div>
                        <div v-else>
                            <el-button type="text" icon="el-icon-view" class="green" @click="handleViewDetsails(scope.row)">查看</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                class="yellowgreen"
                                @click="handleDisable(scope.$index, scope.row)"
                                >启用</el-button
                            >
                            <el-button
                                style="color: orange"
                                v-if="scope.row.userType === 0 || scope.row.userType === 1"
                                type="text"
                                icon="el-icon-s-promotion"
                                @click="handlePromote(scope.$index, scope.row)"
                                >设为楹联家</el-button
                            >
                            <el-button style="color: rgb(144, 147, 153)" v-else disabled type="text" icon="el-icon-s-promotion"
                                >已为楹联家</el-button
                            >
                            <el-button
                                style="color: rgb(13, 147, 224)"
                                type="text"
                                icon="el-icon-user"
                                @click="handleSetDuty(scope.$index, scope.row)"
                                >设置职务</el-button
                            >
                            <el-button
                                style="color: rgb(255, 255, 0)"
                                type="text"
                                icon="el-icon-s-comment"
                                @click="handleSendNotice(scope.$index, scope.row)"
                                >发通知</el-button
                            >
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

        <el-dialog :visible.sync="dialogInfoVisible" width="50%" :close-on-click-modal="false">
            <el-descriptions title="用户信息" direction="vertical" :column="3" border size="medium">
                <el-descriptions-item label="昵称" :span="1">{{ chosenUser.userNickname }}</el-descriptions-item>
                <el-descriptions-item label="姓名" :span="1">{{ chosenUser.userName }}</el-descriptions-item>
                <el-descriptions-item label="系统职称" :span="1">{{ chosenUser.userDuty }}</el-descriptions-item>
                <el-descriptions-item label="手机号" :span="1">{{ chosenUser.userPhone }}</el-descriptions-item>
                <el-descriptions-item label="居住地" :span="2">{{ chosenUser.userLocation }}</el-descriptions-item>
                <el-descriptions-item label="出生日期" :span="1">{{ chosenUser.userBirthday }}</el-descriptions-item>
                <el-descriptions-item label="邮箱地址" :span="1">{{ chosenUser.userEmail }}</el-descriptions-item>
                <el-descriptions-item label="注册日期" :span="1">{{ chosenUser.userLoginTime }}</el-descriptions-item>
                <el-descriptions-item label="座右铭" :span="1">{{ chosenUser.userMotto }}</el-descriptions-item>
                <el-descriptions-item label="个人简介" :span="2">{{ chosenUser.userIntroduction }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="promoteVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px">该用户将设置为楹联家，确定要继续吗？</div>
            <el-checkbox v-model="isSendNotice">是否自动发送如下通知</el-checkbox>
            <el-descriptions :column="1" style="padding-top: 10px" border>
                <el-descriptions-item label="通知标题">{{ noticeForm.noticeTitle }}</el-descriptions-item>
                <el-descriptions-item label="通知内容">{{ noticeForm.noticeContent }}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPromote">取 消</el-button>
                <el-button type="primary" @click="savePromote">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="setDutyVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px">请输入用户职称(只能设置单个职称)</div>
            <el-input v-model="inputDuty" placeholder="请输入职称" maxlength="15">{{ this.setDutyForm.userDuty }}</el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSetDuty">取 消</el-button>
                <el-button type="primary" @click="saveSetDuty">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="noticeVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px">请输入通知标题(不要过长)</div>
            <el-input v-model="noticeTitle" placeholder="请输入通知标题" maxlength="15"></el-input>
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px; padding-top: 30px">请输入通知内容</div>
            <el-input v-model="noticeContent" type="textarea" placeholder="请输入通知内容"></el-input>
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px; padding-top: 30px">
                如有需要，可以选择附件(doc,pdf,xls)
            </div>
            <el-upload
                ref="uploadFile"
                class="file_wrap"
                action="uploadFileURL"
                :http-request="uploadFile"
                :before-upload="beforeFileUpload"
                :limit="1"
            >
                <el-button size="small" type="primary">点击选择附件</el-button>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSendNotice">取 消</el-button>
                <el-button type="primary" @click="saveSendNotice">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'UserManage',
    data() {
        return {
            inputKey: '',
            userList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,

            promoteVisible: false,
            promoteIndex: -1,
            promoteForm: {},

            setDutyVisible: false,
            inputDuty: '',
            setDutyIndex: -1,
            setDutyForm: {},

            noticeVisible: false,
            noticeTitle: '',
            noticeContent: '',
            attachmentSrc: '',
            noticeIndex: -1,
            noticeForm: {},

            isSendNotice: true,

            noticeForm: '',

            //查看详情时点击选择的用户
            chosenUser: {},
            dialogInfoVisible: false
        };
    },
    activated() {
        this.noticeForm = utils.getNoticeTemplate(0);
        this.currentPage = 1;
        this.inputKey = '';
        this.getUserList();
    },
    methods: {
        async getUserList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.user.getUserList(params);
                res.userList.forEach((element) => {
                    element.userLoginTime = (element.userLoginTime + '').slice(0, 19);
                });
                this.userList = res.userList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取用户列表失败',
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
            this.getUserList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getUserList();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getUserList();
        },
        handlePagePrev() {
            this.currentPage--;
        },
        handlePageNext() {
            this.currentPage++;
        },

        // 设置为楹联家
        handlePromote(index, row) {
            this.promoteVisible = true;
            this.promoteIndex = index;
            this.promoteForm = JSON.parse(JSON.stringify(row));
            this.isSendNotice = true;
        },

        async savePromote() {
            this.promoteVisible = false;
            let params = {
                masterName: this.promoteForm.userName,
                masterDynasty: '当代',
                masterIntroduction: this.promoteForm.userIntroduction,
                masterPhoto: this.promoteForm.userPortrait,
                masterBindedUserId: this.promoteForm.userId
            };
            try {
                await this.$api.user.promoteUser(params);
                this.$message({
                    message: '设置楹联家成功',
                    duration: 2000,
                    type: 'success'
                });
                this.userList[this.promoteIndex].userType = this.promoteForm.userType === 0 ? 2 : 3;
                // 发送通知
                if (this.isSendNotice) {
                    setTimeout(() => {
                        utils.sendNotice(this.promoteForm.userId, 0);
                    }, 1000);
                }
            } catch (error) {
                this.$message({
                    message: '设置楹联家失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        cancelPromote() {
            this.promoteVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['promoteForm'].clearValidate();
        },

        //设置职称
        handleSetDuty(index, row) {
            this.setDutyVisible = true;
            this.setDutyIndex = index;
            this.setDutyForm = JSON.parse(JSON.stringify(row));
        },

        cancelSetDuty() {
            this.setDutyVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
        },
        async uploadFile(file) {
            try {
                const data = await utils.uploadFile('/user-server/user/uploadPortrait', file.file);
                this.messageObject.close();
                (this.attachmentSrc = data.url),
                    this.$message({
                        message: '文件上传成功',
                        duration: 2000,
                        type: 'success'
                    });
            } catch (error) {
                this.messageObject.close();
                console.log(error);
                this.$message({
                    message: '文件上传失败',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

        beforeFileUpload(file) {
            const index = file.name.lastIndexOf('.');
            const type = file.name.slice(index);
            const isFile = type === '.doc' || type === '.pdf' || type === '.xls' || type === '.xlsx' || type === '.docx';
            if (!isFile) {
                this.$message.error('上传文件只能是 doc/docx/pdf/xls/xlsx 格式!');
                return false;
            }
            const isLt10M = file.size / 1024 / 1024 < 10; //这里做文件大小限制 10M
            if (!isLt10M) {
                this.$message.error('文件大小不能超过10M!');
                return false;
            }
            this.messageObject = this.$message({
                message: '上传中',
                duration: -1
            });
            return true;
        },
        handleSendNotice(index, row) {
            this.noticeTitle = '';
            this.noticeContent = '';
            this.noticeVisible = true;
            this.noticeIndex = index;
            this.noticeForm = JSON.parse(JSON.stringify(row));
        },

        cancelSendNotice() {
            this.noticeVisible = false;
            this.noticeTitle = '';
            this.noticeContent = '';
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
        },

        async saveSendNotice() {
            if (!this.noticeTitle || !this.noticeContent) {
                this.$message({
                    message: '请先输入标题和内容',
                    type: 'warning',
                    duration: 2000
                });
            } else {
                this.noticeVisible = false;
                this.noticeContent = this.noticeForm.userName + '您好。' + this.noticeContent;
                const res = await utils.sendNotice(this.noticeForm.userId, 11, this.noticeTitle, this.noticeContent, this.attachmentSrc);
                if (res === '发送成功') {
                    this.$message.success('发送成功');
                }
                this.noticeTitle = '';
                this.noticeContent = '';
                this.$refs.uploadFile.clearFiles();
            }
        },

        //保存设置职称
        async saveSetDuty() {
            let params = {
                userId: this.userList[this.setDutyIndex].userId,
                userDuty: this.inputDuty
            };
            try {
                await this.$api.user.setUserDuty(params);
                this.$message({
                    message: '设置职称成功',
                    duration: 2000,
                    type: 'success'
                });
                this.setDutyForm.userDuty = this.inputDuty;
                this.$set(this.userList, this.setDutyIndex, this.setDutyForm);
                this.setDutyVisible = false;
                this.inputDuty = '';
                this.setDutyIndex = -1;
            } catch (error) {
                this.$message({
                    message: '设置职称失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        //查看用户详情
        handleViewDetails(row) {
            this.chosenUser = JSON.parse(JSON.stringify(row));
            this.dialogInfoVisible = true;
        },

        // 启用和禁用用户
        handleDisable(index, row) {
            if (row.userIsDisable === 0) {
                this.$confirm('该用户将被禁用，确定要继续吗？', '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                    .then(async () => {
                        let params = {
                            userId: row.userId
                        };
                        try {
                            await this.$api.user.disableUser(params);
                            this.$message({
                                message: '禁用成功',
                                duration: 2000,
                                type: 'success'
                            });
                            this.userList[index].userIsDisable = 1;
                        } catch (error) {
                            this.$message({
                                message: '禁用失败',
                                duration: 2000,
                                type: 'error'
                            });
                            console.log(error);
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '操作已取消',
                            duration: 1500,
                            type: 'info'
                        });
                    });
            } else {
                this.$confirm('该用户将被启用，确定要继续吗？', '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                    .then(async () => {
                        let params = {
                            userId: row.userId
                        };
                        try {
                            await this.$api.user.enableUser(params);
                            this.$message({
                                message: '启用成功',
                                duration: 2000,
                                type: 'success'
                            });
                            this.userList[index].userIsDisable = 0;
                        } catch (error) {
                            this.$message({
                                message: '启用失败',
                                duration: 2000,
                                type: 'error'
                            });
                            console.log(error);
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: '操作已取消',
                            duration: 1500,
                            type: 'info'
                        });
                    });
            }
        }
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
.file_wrap .el-upload {
    width: auto;
    height: auto;
    border: none;
}
</style>
