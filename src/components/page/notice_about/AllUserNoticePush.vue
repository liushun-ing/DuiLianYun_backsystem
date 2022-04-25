<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 通知 </el-breadcrumb-item>
                <el-breadcrumb-item>群体通知</el-breadcrumb-item>
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
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'AllUserNoticePush',
    data() {
        return {
            form: {
                noticeTitle: '',
                noticeContent: '',
                attachmentSrc: ''
            },
            messageObject: '',

            rules: {
                noticeTitle: [
                    { required: true, message: '请输入通知名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符' }
                ],
                noticeContent: [{ required: true, message: '请输入通知内容', trigger: 'blur' }]
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

        onSubmit() {
            this.$refs[`form`].validate(async (valid) => {
                if (valid) {
                    let params = {
                        noticeTitle: this.form.noticeTitle,
                        noticeContent: this.form.noticeContent,
                        attachmentSrc: this.form.attachmentSrc
                    };

                    try {
                        await this.$api.notice.noticeAllUsers(params);

                        this.$message({
                            message: '通知发送成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.form = {
                            noticeTitle: null,
                            noticeContent: null
                        };
                        this.$refs.uploadFile.clearFiles();
                        this.$refs['form'].clearValidate();
                    } catch (error) {
                        this.$message({
                            message: '通知发送失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    this.$message({
                        message: '请先填写标题和内容',
                        duration: 2000,
                        type: warning
                    });
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.introduction {
    width: 250px;
}
.file_wrap .el-upload{
    width: auto;
    height: auto;
    border: none;
}
</style>