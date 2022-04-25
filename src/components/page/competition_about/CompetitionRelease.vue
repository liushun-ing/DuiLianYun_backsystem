<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 比赛发布
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="c_title_and_action">
                <div class="c_title_wrap">比赛发布</div>
                <div class="c_button_wrap">
                    <el-button type="warning" @click="reset">重置</el-button>  
                    <el-button type="primary" @click="submit('competitionForm')">发布比赛</el-button>                  
                </div>
            </div>
            <div class="c-form-box">
                <el-form ref="competitionForm" :rules="rules" :model="competitionForm" label-width="110px">
                    <el-form-item label="比赛名称" prop="competitionName">
                        <el-input style="width: 100%;" v-model="competitionForm.competitionName"></el-input>
                    </el-form-item>
                    <el-form-item label="比赛起止时间" required style="width: 100%;">
                        <el-col :span="11">
                            <el-form-item prop="competitionStartDate">
                                <el-date-picker type="datetime" 
                                    value-format="yyyy-MM-dd HH:mm:ss" 
                                    placeholder="选择开始时间" 
                                    v-model="competitionForm.competitionStartDate" 
                                    style="width: 100%;">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="competitionEndDate">
                                <el-date-picker type="datetime" 
                                    value-format="yyyy-MM-dd HH:mm:ss" 
                                    placeholder="选择结束时间" 
                                    v-model="competitionForm.competitionEndDate" 
                                    style="width: 100%;">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="投稿起止时间" required style="width: 100%;">
                        <el-col :span="11">
                            <el-form-item prop="levyStartDate">
                                <el-date-picker type="datetime" 
                                    value-format="yyyy-MM-dd HH:mm:ss" 
                                    placeholder="选择开始时间" 
                                    v-model="competitionForm.levyStartDate" 
                                    style="width: 100%;">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col style="text-align: center" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="levyStartDate">
                                <el-date-picker type="datetime" 
                                    value-format="yyyy-MM-dd HH:mm:ss" 
                                    placeholder="选择结束时间" 
                                    v-model="competitionForm.levyEndDate" 
                                    style="width: 100%;">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label-width="0" required>
                        <el-col :span="12">
                            <el-form-item label="比赛封面图片最优宽高2:1" prop="competitionImage">
                                <el-upload
                                    ref="upload"
                                    class="c-avatar-uploader"
                                    action="uploadURL"
                                    :show-file-list="false"
                                    :limit="1"
                                    :http-request="uploadPicture"
                                    :before-upload="beforeAvatarUpload">
                                    <el-image v-if="competitionForm.competitionImage" :src="competitionForm.competitionImage" class="c-avatar" fit="contain"></el-image>
                                    <i v-else class="el-icon-plus c-avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>                            
                        </el-col>
                    </el-form-item>
                    <el-form-item label="比赛简介" prop="competitionIntroduction" required style="width: 100%;">
                        <mavon-editor v-model="competitionForm.competitionIntroduction" :toolbars="toolbars" :autofocus="false" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel"/>
                    </el-form-item>
                    
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'CompetitionRelease',
    data() {
        return {
            toolbars: utils.toolbars,
            competitionForm: {
                competitionName: '',
                competitionIntroduction: '',
                competitionStartDate: '',
                competitionEndDate: '',
                levyStartDate: '',
                levyEndDate: '',
                competitionImage: '',
                createBy: '',
            },
            rules: {
                competitionName: [
                    {required: true, message: '请输入比赛名称', trigger: 'blur'}
                ],
                competitionIntroduction: [
                    {required: true, message: '请输入比赛简介', trigger: 'blur'}
                ],
                competitionImage: [
                    {required: true, message: '请上传比赛图片', trigger: 'blur'}
                ],
                competitionStartDate:[
                    {required: true, message: '请选择比赛开始时间', trigger: 'blur'}
                ],
                competitionEndDate:[
                    {required: true, message: '请选择比赛结束时间', trigger: 'blur'}
                ],
                levyStartDate:[
                    {required: true, message: '请选择投稿开始时间', trigger: 'blur'}
                ],
                levyEndDate:[
                    {required: true, message: '请选择投稿结束时间', trigger: 'blur'}
                ]
            }
        };
    },
    activated() {
        this.competitionForm.createBy = utils.getSessionInfo('adminId')
    },
    methods: {
        
        // 绑定@imgAdd event
        async $imgAdd(pos, $file){
            if(!this.beforeAvatarUpload($file)) {
                return;
            }
            let messageObject = this.$message({
                message: '正在上传中...',
                type: 'info',
                duration: 0
            });
            try {
                // 第一步.将图片上传到服务器.
                const res = await utils.uploadFile('/post-server/manuscript/upload', $file);
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                this.$refs.md.$img2Url(pos, res.url);
                messageObject.close();
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
            } catch (error) {
                messageObject.close();
                this.$message({
                    message: '图片上传失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 删除markdown图片
        async $imgDel(pos, $file) {
            let params = {
                url: pos[0]
            };
            try {
                await this.$api.news.deleteImage(params);
                console.log("新闻内容图片删除成功");
            } catch (error) {
                console.log("新闻内容图片删除失败");
                console.log(error);
            }
        },

        submit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    if(!utils.compareCompetitionDate(this.competitionForm.competitionStartDate, this.competitionForm.competitionEndDate,
                        this.competitionForm.levyStartDate, this.competitionForm.levyEndDate)) {
                            return false;
                        }
                    try {
                        await this.$api.competition.releaseCompetition(this.competitionForm);
                        this.$message({
                            message: '比赛发布成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.reset();                        
                    } catch (error) {
                        this.$message({
                            message: '比赛发布失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }

                } else {
                    console.log('发布比赛表单验证失败');
                    return false;
                }
            });
        },

        async uploadPicture(file) {
            try {
                const data = await utils.uploadFile('/post-server/manuscript/upload', file.file);
                this.$set(this.competitionForm, 'competitionImage', data.url);
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

        // 上传前判断
        beforeAvatarUpload(file) {
            const isJPGOrPNG = (file.type === 'image/jpeg' || file.type === 'image/png');
            if (!isJPGOrPNG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
            }
            else{
                this.$message({
                    message: '上传中',
                    duration: 1000,
                    type: 'info'
                });
            }
            return isJPGOrPNG;
        },
        reset() {
            this.competitionForm = {
                competitionName: '',
                competitionIntroduction: '',
                competitionStartDate: '',
                competitionEndDate: '',
                levyStartDate: '',
                levyEndDate: '',
                competitionImage: '',
                createBy: utils.getSessionInfo('adminId')
            };
            this.$refs['competitionForm'].clearValidate();
        },
    }
};
</script>

<style>
.c-avatar-uploader .el-upload {
    width: 240px;
    height: 160px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.c-avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.c-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 160px;
    line-height: 160px;
    text-align: center;
}
.c-avatar {
    height: 100%;
    display: block;
}
.c-form-box {
    width: 700px;
}
.c_title_and_action {
    width: 700px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}
.c_title_wrap {
    font-size: 16px;
    font-family: 'Times New Roman', Times, serif;
}
</style>