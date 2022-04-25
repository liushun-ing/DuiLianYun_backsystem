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
                        <el-input type="textarea" style="width:250px" rows="5" v-model="form.noticeContent"></el-input>
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
    name: 'AllMemberNoticePush',
    data() {
        return {
            form: {
                noticeTitle: null,
                noticeContent: null
            },
             
            rules: {
                noticeTitle: [
                    {required: true, message: '请输入通知标题', trigger: 'blur'},
                    {min: 1, max: 10, message: '长度在 1 到 10 个字符'}
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
                        await this.$api.notice.noticeAllMembers(params);

                        this.$message({
                            message: '通知发送成功',
                            duration: 2000,
                            type: 'success'
                        })
                        this.form = {
                            noticeTitle: null,
                            noticeContent: null
                        }
                        this.$refs['form'].clearValidate();
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
                    return false;
                }
            })
            
        },
        
    }
};
</script>

<style scoped>

</style>