<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 通知
                </el-breadcrumb-item>
                <el-breadcrumb-item>会员通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="通知名称" prop="noticeTitle">
                        <el-input style="width:250px" v-model="form.noticeTitle"></el-input>
                    </el-form-item>

                    <el-form-item label="通知内容" prop="noticeContent">
                        <el-input type="textarea" class="introduction" rows="5" v-model="form.noticeContent"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" style="width:200px" @click="onSubmit">发送</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            form: {
                noticeTitle: null,
                noticeContent: null
            },
             
            rules: {
                noticeTitle: [
                    {required: true, message: '请输入通知标题', trigger: 'blur'}
                ],
                noticeContent: [
                    {required: true, message: '请输入通知内容', trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        onSubmit() {
            this.$refs[`form`].validate(async (valid) => {
                if(valid) {
                    let params = {
                        noticeTitle: this.form.noticeTitle,
                        noticeContent: this.form.noticeContent
                    }
                    try{
                        await this.$api.notice.issuedNoticeToAllUser(params);
                    } catch(error) {
                        this.$message({
                            message: '通知发送失败',
                            duration: 2000,
                            type: error
                        });
                    }

                }
                else {
                    this.$message({
                    message: '请先填写标题和内容',
                    duration: 2000,
                    type: warning
                });
                }
            })
            
        },
        
    }
};
</script>

<style>
.avatar-uploader .el-upload {
    width: 160px;
    height: 200px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.introduction{
    width: 250px;
}
</style>