<template>
  <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 通知
                </el-breadcrumb-item>
                <el-breadcrumb-item>获奖通知</el-breadcrumb-item>
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
                    

                    <el-form-item label='比赛' prop='competitionId'>
                        <el-select v-model="selectedCompetitionId" placeholder="请选择比赛" >
                            <el-option
                            v-for="item in competitionList"
                            :key="item.competitionId"
                            :label="item.competitionName"
                            :value="item.competitionId">
                            </el-option>
                        </el-select>
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
    data() {
        return {
            form: {
                noticeTitle: null,
                noticeContent: null,
                competitionId: null
            },

            selectedCompetitionId: '',
            competitionList: [{
                competitionId: null,
                competitionName: null
            }],
             
            rules: {
                noticeTitle: [
                    {required: true, message: '请输入通知标题', trigger: 'blur'}
                ],
                noticeContent: [
                    {required: true, message: '请输入通知内容', trigger: 'blur'}
                ],
                competitionId: [
                    {required: true, message: '请选择比赛', trigger: 'blur'}
                ]
            }
        };
    },
    created() {
        this.initCompetitionList();
        this.sortByTime(this.competitionList);
    },
    methods: {
        sortByTime(array){
            return array.sort(function(a,b){
                let time1 = a.startTime;
                let time2 = b.startTime;
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            })
        },

        //获取比赛列表
        async initCompetitionList(){
            try {
                let res = await this.$api.competition.getAllCompetition();
                this.competitionList = res.competitionList;
            } catch(error) {
                console.log(error);
                this.$message({
                    message: "获取比赛列表失败",
                    duration: 2000,
                    type: warning
                })
            }

        },

        onSubmit() {
            this.$refs[`form`].validate(async (valid) => {
                if(valid) {
                    let params = {
                        noticeTitle: this.form.noticeTitle,
                        noticeContent: this.form.noticeContent,
                        competitionId: this.selectedCompetitionId
                    }
                    try{
                        await this.$api.notice.noticeAwardUsers(params);

                        this.$message({
                            message: '通知发送成功',
                            duration: 2000,
                            type: 'success'
                        })
                        this.form = {
                            noticeTitle: null,
                            noticeContent: null
                        }
                        console.log(this.form);
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
}
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