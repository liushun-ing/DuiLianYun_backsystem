<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 资料上传
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="d-form-box">
                <el-form ref="documentForm" :rules="rules" :model="documentForm" label-width="80px">
                    <el-form-item label="资料名称" prop="documentName">
                        <el-input style="width:500px" v-model="documentForm.documentName"></el-input>
                    </el-form-item>
                    <div style="display: flex;">
                        <el-form-item label="资料封面最优宽高3:4" prop="documentPicture">
                            <el-upload  
                                ref="upload"
                                class="d-avatar-uploader"
                                action="uploadPictureURL"
                                :show-file-list="false"
                                :limit="1"
                                :http-request="uploadPicture"
                                :before-upload="beforeAvatarUpload">
                                <el-image v-if="documentForm.documentPicture" :src="documentForm.documentPicture" fit="contain" class="d-avatar"></el-image>
                                <i v-else class="el-icon-plus d-avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>   
                        <el-form-item label="资料简介" prop="documentIntroduction" style="padding-left: 10px;">
                            <el-input type="textarea" class="introduction" :autosize="{minRows: 9, maxRows: 9}" v-model="documentForm.documentIntroduction"></el-input>
                        </el-form-item>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <el-form-item label="资料文件小于10M" prop="documentFileId">
                            <el-upload
                                ref="uploadFile"
                                class="file_wrap"
                                action="uploadFileURL"
                                :http-request="uploadFile"
                                :before-upload="beforeFileUpload"
                                :limit="1"
                                >
                                <el-button size="small" type="primary">点击选择文件</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="onSubmit('documentForm')">确 认 上 传</el-button>
                        </el-form-item>                         
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js'
export default {
    name: 'DocumentUpload',
    data() {
        return {
            documentForm: {
                documentName: '',
                documentIntroduction: '',
                documentFileId: '',
                documentPicture: '',
                documentUploaderId: utils.getSessionInfo('adminId')
            },

            messageObject: '',

            rules: {
                documentName: [
                    {required: true, message: '请输入资料名称', trigger: 'blur'}
                ],
                documentIntroduction: [
                    {required: true, message: '请输入资料简介', trigger: 'blur'}
                ],
                documentFileId: [
                    {required: true, message: '请上传资料文件', trigger: 'blur'}
                ],
                documentPicture: [
                    {required: true, message: '请上传资料封面', trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        async onSubmit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    try {
                        await this.$api.document.addDocument(this.documentForm);
                        this.$message({
                            message: '资料上传成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.documentForm = {
                            documentName: '',
                            documentIntroduction: '',
                            documentFileId: '',
                            documentPicture: '',
                            documentUploaderId: utils.getSessionInfo('adminId')
                        };
                        this.$refs.uploadFile.clearFiles(); //上传成功之后清除历史记录
                    } catch (error) {
                        this.$message({
                            message: '资料上传失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('上传资料表单验证失败');
                    return false;
                }
            });
        },

        async uploadPicture(file) {
            try {
                const data = await utils.uploadFile('/file-server/document/back/uploadPicture', file.file);
                this.$set(this.documentForm, 'documentPicture', data.url);
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
                this.$refs.upload.clearFiles();
            } catch (error) {
                console.log(error);
                this.$message({
                    message: '图片上传失败',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

        async uploadFile(file) {
            try {
                const data = await utils.uploadFile('/file-server/document/back/uploadFile', file.file);
                this.messageObject.close();
                this.$set(this.documentForm, 'documentFileId', data.fileId);
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

        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            if (!isJPG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
                return false;
            } else {
                this.$message({
                    message: '上传中',
                });                
            }
            return isJPG;
        },

        beforeFileUpload(file) {
            const index = file.name.lastIndexOf('.');
            const type = file.name.slice(index);
            const isFile = (type === '.doc' || type === '.pdf' || type === '.xls' || type === '.xlsx' || type === '.docx');
            if (!isFile) {
                this.$message.error('上传文件只能是 doc/docx/pdf/xls/xlsx 格式!');
                return false;
            }
            const isLt10M = file.size / 1024 / 1024 < 10;     //这里做文件大小限制 10M
            if(!isLt10M) {
                this.$message.error('文件大小不能超过10M!');
                return false;
            }
            this.messageObject = this.$message({
                message: '上传中',
                duration: -1
            });
            return true;
        },
    }
};
</script>

<style>
.d-form-box {
    width: 580px;
}
.d-avatar-uploader .el-upload{
    width: 160px;
    height: 200px;
}
.d-avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.d-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 200px;
    line-height: 200px;
    text-align: center;
}
.d-avatar {
    height: 100%;
    display: block;
}
.introduction{
    width: 250px;
}
.file_wrap .el-upload{
    width: auto;
    height: auto;
    border: none;
}
</style>