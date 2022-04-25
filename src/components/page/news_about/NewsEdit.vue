<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/news_about/NewsManage' }">
                    <i class="el-icon-lx-cascades"></i> 新闻管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    编辑新闻
                </el-breadcrumb-item>     
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="title_and_action">
                <div class="title_wrap">编辑新闻</div>
                <div>
                    <el-button type="warning" @click="reset">重置</el-button>  
                    <el-button type="primary" @click="submit('newsForm')">提交修改</el-button>                  
                </div>
            </div>
            <el-form :model="newsForm" ref="newsForm" :rules="rules">
                <el-descriptions direction="vertical" :column="3" border size="medium">
                    <el-descriptions-item label="标题" :span="1">
                        <el-form-item prop="newsTitle">
                            <el-input v-model="newsForm.newsTitle" type="textarea" autosize></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="编辑人" :span="1">
                        <el-form-item prop="newsEditor">
                            <el-input v-model="newsForm.newsEditor"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="发布时间" :span="1">
                        <el-form-item prop="newsCreateTime">
                            <el-date-picker
                                v-model="newsForm.newsCreateTime"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="封面图（可选项），<<最优宽高比为2:1>>" :span="3">
                        <el-form-item>
                            <el-upload
                                ref="upload"
                                class="ne-avatar-uploader"
                                action="uploadUrl"
                                :limit="1"
                                :show-file-list="false"
                                :http-request="uploadPicture"
                                :before-upload="beforeAvatarUpload">
                                <el-image v-if="newsForm.newsImage" :src="newsForm.newsImage" fit="contain" class="ne-avatar"></el-image>
                                <i v-else class="el-icon-plus ne-avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="内容" :span="3">
                        <el-form-item prop="newsContent">
                            <mavon-editor v-model="newsForm.newsContent" :toolbars="toolbars" :autofocus="false" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel"/>
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>
            </el-form>
        </div>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'NewsEdit',
    props: ['newsId'],
    data() {
        return {
            toolbars: utils.toolbars,
            newsForm: {
                newsId: '',
                newsTitle: '',
                newsEditor: '',
                newsContent: '',
                newsImage: '',
                newsCreateTime: ''
            },
            whetherChange: false,
            rules: {
                newsTitle:[
                    {required: true, message: '请输入新闻标题', trigger: 'blur'}
                ],
                newsEditor:[
                    {required: true, message: '请输入新闻编辑人', trigger: 'blur'}
                ],
                newsCreateTime:[
                    {required: true, message: '请输入新闻发布时间', trigger: 'blur'}
                ],
                newsContent:[
                    {required: true, message: '请输入新闻内容', trigger: 'blur'}
                ]
            }
        };
    },
    activated() {
        // console.log(this.$route);
        this.getNewsDetail();
    },
    methods: {
        async getNewsDetail() {
            let params = {
                newsId: this.$route.query.newsId
            };
            try {
                const res = await this.$api.news.getNewsDetail(params);
                this.newsForm = res.newsDetail;
            } catch (error) {
                this.$message({
                    message: '获取新闻详情失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 绑定@imgAdd event
        async $imgAdd(pos, $file){
            if(!this.beforeAvatarUpload($file)) {
                return;
            }
            // console.log($file);
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
                    message: '上传成功',
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

        async uploadPicture(file) {
            try {
                const data = await utils.uploadFile('/post-server/manuscript/upload', file.file);
                this.$set(this.newsForm, 'newsImage', data.url);
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
                this.whetherChange = true;
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

        async deletePhoto() {
            let params = {
                url: this.newsForm.newsImage
            }
            try {
                await this.$api.news.deleteImage(params);
                console.log("新闻原有图片删除成功");
            } catch (error) {
                console.log("新闻原有图片删除失败");
                console.log(error);
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

        submit (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    try {
                        await this.$api.news.modifyNews(this.newsForm);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                        // 修改成功之后需要把原来的图片给删了
                        if(this.whetherChange) {
                            this.whetherChange = false;
                            this.deletePhoto();
                        }
                    } catch (error) {
                        this.$message({
                            message: '修改失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改新闻表单验证失败');
                    return false;
                }
            });
        },

        reset() {
            this.getNewsDetail();
            this.$refs['newsForm'].clearValidate();
        },
    }
};
</script>

<style>
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

.mr10 {
    margin-right: 10px;
}

.ne-avatar-uploader .el-upload {
    width: 250px;
    height: 160px;
}
.ne-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 160px;
    text-align: center;
}
.ne-avatar {
    height: 100%;
    display: block;
}

.title_and_action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}
.title_wrap {
    font-size: 20px;
}
</style>
