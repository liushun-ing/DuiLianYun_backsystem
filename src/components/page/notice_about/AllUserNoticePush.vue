<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 通知
                </el-breadcrumb-item>
                <el-breadcrumb-item>群体通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="通知名称" prop="documentName">
                        <el-input style="width:250px" v-model="form.documentName"></el-input>
                    </el-form-item>

                    <el-form-item label="通知内容" prop="documentIntroduction">
                        <el-input type="textarea" class="introduction" rows="5" v-model="form.documentIntroduction"></el-input>
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
                documentName: null,
                documentIntroduction: null,
                documentFile: null,
                documentPicture: null
            },
            imageUrl: '',
            // uploadURL: this.GLOBAL.baseURL + "/file-server/file/upload",
            // headers:{
            //     'token': this.GLOBAL.token.token
            // },
            rules: {
                documentName: [
                    {required: true, message: '请输入通知名称', trigger: 'blur'}
                ],
                documentIntroduction: [
                    {required: true, message: '请输入通知内容', trigger: 'blur'}
                ],
                documentFile: [
                    {required: true, message: '请上传资料文件', trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        onSubmit() {
            var that = this;
            this.$axios({
                method: 'post',
                url: this.GLOBAL.baseURL + '/file-server/document/createDocument',
                data: this.form,
                headers: {
                    'token': this.GLOBAL.token.token
                }
            })
                .then(function (response) {
                    that.$message({
                        message: '发送通知成功',
                        type: 'success'
                    });
                    that.form= {
                        documentName: null,
                        documentIntroduction: null,
                        documentFile: null,
                        documentPicture: null
                    };
                    that.imageUrl = '';
                    that.$refs['uploadFile'].clearFiles();
                })
                .catch(function (error) {
                    that.$message({
                        message: '发送失败',
                        type: 'error'
                    })
                });
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.$message({
                message: '图片上传成功',
                type: 'success'
            })
            this.form.documentPicture = res;
        },
        handleUploadFail() {
            this.$message({
                message: '上传失败',
                type: 'error'
            })
        },
        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            if (!isJPG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
            }
            else{
                this.$message({
                    message: '上传中'
                })
            }
            return isJPG;
        },
        beforeFileUpload() {
            this.$message({
                message: '上传中'
            })
        },
        handleFileUpload(res,file){
            this.$message({
                message: '文件上传成功',
                type: 'success'
            })
            this.form.documentFile=res;
        }
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