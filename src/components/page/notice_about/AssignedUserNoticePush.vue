<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 通知 </el-breadcrumb-item>
                <el-breadcrumb-item>指定用户通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="通知名称" prop="noticeTitle">
                        <el-input style="width: 250px" v-model="form.noticeTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="通知内容" prop="noticeContent">
                        <el-input type="textarea" class="introduction" rows="5" v-model="form.noticeContent"></el-input>
                    </el-form-item>
                    <el-form-item label="选择用户" prop="totalExpress">
                        <el-input v-model="form.totalExpress" style="width: 150px; padding-right: 10px" readonly></el-input>
                        <el-button type="primary" @click="dialogFormVisible = true" round>点击选择用户</el-button>
                    </el-form-item>
                    <el-form-item label="通知附件小于10M">
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
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 200px" @click="onSubmit">发送</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-dialog title="选择用户" :visible.sync="dialogFormVisible" width="60%" :close-on-click-modal="false">
            <div class="drag-box">
                <div class="to-choose-user">
                    <div style="margin-bottom: 20px">
                        <el-input
                            v-model="inputKey"
                            prefix-icon="el-icon-search"
                            placeholder="请输入关键字"
                            style="width: 200px"
                        ></el-input>
                        <el-button type="primary" icon="el-icon-search" style="margin-left: 20px" @click="searchUser">搜索</el-button>
                    </div>
                    <el-table
                        ref="toChooseTable"
                        height="300"
                        :data="userList"
                        tooltip-effect="dark"
                        empty-text="请输入关键字搜索"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" min-width="55"></el-table-column>
                        <el-table-column prop="userNickname" label="昵称" min-width="120"></el-table-column>
                        <el-table-column prop="userName" label="姓名" min-width="120"></el-table-column>
                        <el-table-column label="会员" min-width="50">
                            <template slot-scope="scope">
                                <div v-if="scope.row.userType === '1' || scope.row.userType === '3'">
                                    <el-tag type="danger">是</el-tag>
                                </div>
                                <div>
                                    <el-tag type="info">否</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 20px; text-align: right">
                        <el-button @click="addChosenUser" type="success" plain>添加</el-button>
                    </div>
                </div>

                <div class="chosen-user">
                    <div style="padding-bottom: 20px; text-align: center">
                        <div class="tip_wrap">已选中用户列表</div>
                    </div>
                    <el-table
                        height="300"
                        empty-text="还没有用户被选中"
                        ref="chosenTable"
                        :data="form.noticeUserList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChangeChosen"
                    >
                        <el-table-column type="selection" min-width="55"></el-table-column>
                        <el-table-column prop="userNickname" label="昵称" min-width="120"></el-table-column>
                        <el-table-column prop="userName" label="姓名" min-width="120"></el-table-column>
                        <el-table-column label="会员" min-width="50">
                            <template slot-scope="scope">
                                <div v-if="scope.row.userType === '1' || scope.row.userType === '3'">
                                    <el-tag type="danger">是</el-tag>
                                </div>
                                <div>
                                    <el-tag type="info">否</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 20px; text-align: right">
                        <el-button @click="cancelChoice" type="danger" plain>移除选中</el-button>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
export default {
    name: 'AssignedUserNoticePush',

    data() {
        var totalExpress = (rules, value, callback) => {
            let index = value.lastIndexOf(':');
            let num = value.slice(index + 1);
            if (num == '0') {
                callback(new Error('选择用户不能为空'));
            } else {
                callback();
            }
        };
        return {
            dialogFormVisible: false,

            form: {
                totalExpress: '已选中人数:0',
                noticeTitle: '',
                noticeContent: '',
                attachmentSrc: '',
                noticeUserList: []
            },

            messageObject: '',
            chosenUserList: [],

            multipleSelection: [],
            multipleSelectionChose: [],

            inputKey: '',

            userList: [],

            rules: {
                noticeTitle: [
                    { required: true, message: '请输入通知名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符' }
                ],
                noticeContent: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
                totalExpress: [{ required: true, validator: totalExpress, trigger: ['blur', 'change'] }]
            }
        };
    },

    methods: {
        async uploadFile(file) {
            try {
                const data = await utils.uploadFile('/user-server/user/uploadPortrait', file.file);
                this.messageObject.close();
                this.$set(this.form, 'attachmentSrc', data.url);
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

        async searchUser() {
            if (!this.inputKey) {
                this.$message({
                    message: '请先输入搜索关键字',
                    duration: 1500,
                    type: 'warning'
                });
                return;
            }
            let params = {
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.notice.getSearchUsers(params);
                this.userList = res.userList;
                this.initUserList();
            } catch (error) {
                console.log(error);
                this.$message({
                    message: '获取用户列表失败，刷新页面',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

        initUserList() {
            this.userList.forEach((row) => {
                for (let index = 0; index < this.form.noticeUserList.length; index++) {
                    if (row.userId === this.form.noticeUserList[index].userId) {
                        this.$refs.toChooseTable.toggleRowSelection(row);
                        break;
                    }
                }
            });
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        handleSelectionChangeChosen(val) {
            this.multipleSelectionChose = val;
        },

        //添加选中的用户
        addChosenUser() {
            if (this.multipleSelection.length != 0) {
                this.form.noticeUserList = this.form.noticeUserList.concat(this.multipleSelection);
                this.multipleSelection.forEach((item, index) => {
                    for (let userListIndex = 0; userListIndex < this.userList.length; userListIndex++) {
                        if (this.userList[userListIndex].userId === item.userId) {
                            this.userList.splice(userListIndex, 1);
                            break;
                        }
                    }
                });
                this.multipleSelection = [];
                this.form.totalExpress = '已选中人数:' + this.form.noticeUserList.length;
            } else {
                this.$message('请先选中用户');
            }
        },

        //相应“取消选中”按钮点击事件，取消选中的用户
        cancelChoice() {
            if (this.multipleSelectionChose != 0) {
                this.userList = this.userList.concat(this.multipleSelectionChose);
                this.multipleSelectionChose.forEach((item, index) => {
                    for (let i = 0; i < this.form.noticeUserList.length; i++) {
                        if (this.form.noticeUserList[i].userId === item.userId) {
                            this.form.noticeUserList.splice(i, 1);
                            break;
                        }
                    }
                });
                this.multipleSelectionChose = [];
                this.form.totalExpress = '已选中人数:' + this.form.noticeUserList.length;
            } else {
                this.$message('请先选中用户');
            }
        },

        async uploadNoticeData() {
            try {
                let tmpList = [];
                this.form.noticeUserList.forEach((item) => {
                    tmpList.push(item.userId);
                });
                let params = {
                    noticeTitle: this.form.noticeTitle,
                    noticeContent: this.form.noticeContent,
                    attachmentSrc: this.form.attachmentSrc,
                    noticeUserList: tmpList
                };
                await this.$api.notice.noticeSomeUsers(params);
                this.$message({
                    message: '通知发送成功',
                    duration: 2000,
                    type: 'success'
                });
            } catch (error) {
                this.$message({
                    message: '通知发送失败',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.uploadNoticeData();
                    this.$refs.uploadFile.clearFiles();
                    this.reset();
                } else {
                    return false;
                }
            });
        },

        reset() {
            this.dialogFormVisible = false;
            this.form = {
                noticeTitle: '',
                noticeContent: '',
                noticeUserList: [],
                attachmentSrc: '',
                totalExpress: '已选中人数:0'
            };
            this.multipleSelection = [];
            this.multipleSelectionChose = [];
            this.inputKey = '';
            this.userList = [];
            this.$refs['form'].clearValidate();
        }
    }
};
</script>

<style scoped>
.introduction {
    width: 250px;
}
.add-button {
    margin-left: 20px;
}
.to-choose-user {
    flex: 1;
    padding-right: 10px;
    border-right: #8c939d solid 1px;
}
.chosen-user {
    flex: 1;
    padding-left: 10px;
}
.drag-box {
    display: flex;
    justify-content: space-around;
}
.tip_wrap {
    display: inline-block;
    line-height: 1;
    padding: 9px 15px;
    color: #67c23a;
    background: #f0f9eb;
    border: 1px solid #c2e7b0;
    font-size: 12px;
    border-radius: 3px;
    font-weight: 500;
}
.file_wrap .el-upload{
    width: auto;
    height: auto;
    border: none;
}
</style>