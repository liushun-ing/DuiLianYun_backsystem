<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 关于我们
                </el-breadcrumb-item> 
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="title_and_action">
                <div class="title_wrap">关于我们</div>
                <div>
                    <el-button type="warning" @click="reset">重置</el-button>  
                    <el-button type="primary" @click="submit('infoForm')">提交修改</el-button>                  
                </div>
            </div>
            <el-form :model="infoForm" ref="infoForm" :rules="rules">
                <mavon-editor v-model="infoForm.basicInfo" :toolbars="toolbars" :autofocus="false" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel"/>
                <!-- <el-descriptions direction="vertical" :column="2" border size="medium">
                    <el-descriptions-item label="协会基本信息" :span="1">
                        <el-form-item prop="basicInfo">
                            <el-input type="textarea" autosize v-model="infoForm.basicInfo"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="协会简介" :span="1">
                        <el-form-item prop="briefInfo">
                            <el-input type="textarea" autosize v-model="infoForm.briefInfo"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="协会领导机构" :span="1">
                        <el-form-item prop="leadershipInfo">
                            <el-input type="textarea" autosize v-model="infoForm.leadershipInfo"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="如何加入我们" :span="1">
                        <el-form-item prop="howToAddUs">
                            <el-input type="textarea" autosize  v-model="infoForm.howToAddUs"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import utils from '../../../utils/utils'
export default {
    name: 'AssociationInformation',
    data() {
        return {
            toolbars: utils.toolbars,
            infoForm: {
                basicInfo: "",
                briefInfo: "",
                leadershipInfo: "",
                howToAddUs: ""
            },
            // rules: {
            //     basicInfo:[
            //         {required: true, message: '请输入协会基本信息', trigger: 'blur'}
            //     ],
            //     briefInfo:[
            //         {required: true, message: '请输入协会简介', trigger: 'blur'}
            //     ],
            //     leadershipInfo:[
            //         {required: true, message: '请输入协会领导人员', trigger: 'blur'}
            //     ],
            //     howToAddUs:[
            //         {required: true, message: '请输入加入方式', trigger: 'blur'}
            //     ]
            // }
        };
    },
    activated() {
        this.getAssociationInfo();
    },
    methods: {
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

        async getAssociationInfo() {
            try {
                const res = await this.$api.admin.getAssociationInfo();
                this.infoForm = res.associationInfo;
            } catch (error) {
                this.$message({
                    message: '获取协会信息失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        submit (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    try {
                        await this.$api.admin.modifyAssociationInfo(this.infoForm);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                    } catch (error) {
                        this.$message({
                            message: '修改失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改协会信息表单验证失败');
                    return false;
                }
            });
        },

        reset() {
            this.getAssociationInfo();
            this.$refs['infoForm'].clearValidate();
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
