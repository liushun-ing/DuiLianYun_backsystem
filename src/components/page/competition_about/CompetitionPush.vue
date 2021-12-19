<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 活动
                </el-breadcrumb-item>
                <el-breadcrumb-item>活动发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="活动主题" prop="eventName">
                        <el-input style="width:250px" v-model="form.eventName"></el-input>
                    </el-form-item>
                    <el-form-item label="活动开始时间" prop="eventDateFrom">
                        <el-date-picker
                            v-model="form.eventDateFrom"
                            type="datetime" value-format="yyyy-MM-dd HH:mm:ss" class="input-class">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="比赛结束时间" prop="eventDateTo">
                        <el-date-picker
                            v-model="form.eventDateTo"
                            type="datetime" value-format="yyyy-MM-dd HH:mm:ss" class="input-class">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动图片" prop="pictureId">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadURL"
                            :headers="headers"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-error="handleUploadFail"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="活动内容" prop="eventIntroduce">
                        <el-input type="textarea" class="introduction" rows="5" v-model="form.eventIntroduce"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width:200px" @click="onSubmit">发布</el-button>
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
                eventName: null,
                eventIntroduce: null,
                pictureId: null,
                eventDateFrom:null,
                eventDateTo:null
            },
            imageUrl: '',
            // uploadURL: this.GLOBAL.baseURL + "/couplet-server/event/uploadPicture",
            // headers:{
            //     'token': this.GLOBAL.token.token
            // },
            rules: {
                eventName: [
                    {required: true, message: '请输入活动主题', trigger: 'blur'}
                ],
                eventIntroduce: [
                    {required: true, message: '请输入活动内容', trigger: 'blur'}
                ],
                pictureId: [
                    {required: true, message: '请上传活动图片', trigger: 'blur'}
                ],
                eventDateFrom: [
                    {required: true, message: '请上传活动开始时间', trigger: 'blur'}
                ],
                eventDateTo: [
                    {required: true, message: '请上传活动结束时间', trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        onSubmit() {
            var that = this;
            this.$axios({
                method: 'post',
                url: this.GLOBAL.baseURL + '/couplet-server/event/addEvent',
                data: this.form,
                headers: {
                    'token': this.GLOBAL.token.token
                }
            })
                .then(function (response) {
                    that.$message({
                        message: '活动发布成功',
                        type: 'success'
                    });
                    that.form= {
                        eventName: null,
                        eventIntroduce: null,
                        pictureId: null,
                        eventDateFrom:null,
                        eventDateTo:null
                    };
                    that.imageUrl = '';
                })
                .catch(function (error) {
                    that.$message({
                        message: '发布失败',
                        type: 'error'
                    })
                });
        },
        handleAvatarSuccess(res, event) {
            this.imageUrl = URL.createObjectURL(event.raw);
            this.$message({
                message: '图片上传成功',
                type: 'success'
            })
            this.form.pictureId = res;
        },
        handleUploadFail() {
            this.$message({
                message: '上传失败',
                type: 'error'
            })
        },
        beforeAvatarUpload(event) {
            const isJPG = (event.type === 'image/jpeg' || event.type === 'image/png');
            if (!isJPG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
            }
            else{
                this.$message({
                    message: '上传中'
                })
            }
            return isJPG;
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