<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 通知 </el-breadcrumb-item>
                <el-breadcrumb-item>获奖通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="display: flex; align-content: space-between">
                <div class="form-box">
                    <div style="width: 500px; border-right: #e6e6e6 solid 1px">
                        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                            <el-form-item label="通知名称最多十字" prop="noticeTitle">
                                <el-input style="width: 250px" v-model="form.noticeTitle" placeholder="如:比赛获奖通知"></el-input>
                            </el-form-item>

                            <el-form-item label="通知内容" prop="noticeContent">
                                <el-input
                                    type="textarea"
                                    class="introduction"
                                    rows="5"
                                    v-model="form.noticeContent"
                                    placeholder="只需输入通知正文内容"
                                ></el-input>
                            </el-form-item>

                            <el-form-item label="比赛" prop="competitionId">
                                <el-select v-model="form.competitionId" placeholder="请选择比赛" @change="handleSelected">
                                    <el-option
                                        v-for="item in competitionList"
                                        :key="item.competitionId"
                                        :label="item.competitionName"
                                        :value="item.competitionId"
                                    >
                                    </el-option>
                                </el-select>
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
                <div class="template-box">
                    <el-descriptions title="通知预览">
                        <el-descriptions-item label="用户">沉梦昂志</el-descriptions-item>
                        <el-descriptions-item label="奖项">一等奖</el-descriptions-item>
                    </el-descriptions>
                    <el-input
                        type="textarea"
                        class="introduction"
                        rows="5"
                        v-model="templateNoticeCreator"
                        placeholder="只需输入通知正文内容"
                    ></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script scoped>
export default {
    name: 'AwardNoticePush',
    data() {
        return {
            form: {
                noticeTitle: '',
                noticeContent: '',
                attachmentSrc: '',
                competitionId: ''
            },

            noticeTemplate: {
                userName: '沉梦昂志',
                award: '一等奖',
                competitionName: ''
            },

            messageObject: '',

            selectedCompetitionId: '',
            competitionList: [],

            rules: {
                noticeTitle: [
                    { required: true, message: '请输入通知标题', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符' }
                ],
                noticeContent: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
                competitionId: [{ required: true, message: '请选择比赛', trigger: ['blur', 'change'] }]
            }
        };
    },
    activated() {
        this.initCompetitionList();
    },
    computed: {
        templateNoticeCreator() {
            // console.log(this);
            return (
                '恭喜您，' +
                this.noticeTemplate.userName +
                '\n您在' +
                this.noticeTemplate.competitionName +
                '中荣获' +
                this.noticeTemplate.award +
                '!\n' +
                this.form.noticeContent
            );
        }
    },
    methods: {
        handleSelected() {
            this.selectedCompetitionId = this.form.competitionId;
            for (let index = 0; index < this.competitionList.length; index++) {
                if (this.competitionList[index].competitionId == this.selectedCompetitionId)
                    this.noticeTemplate.competitionName = this.competitionList[index].competitionName;
            }
        },

        sortByTime(array) {
            return array.sort(function (a, b) {
                var time1 = new Date(a.createTime).getTime();
                var time2 = new Date(b.createtime).getTime();
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            });
        },

        //获取比赛列表
        async initCompetitionList() {
            try {
                let res = await this.$api.competition.getAllCompetition();
                this.competitionList = this.sortByTime(res.competitionList);
            } catch (error) {
                console.log(error);
                this.$message({
                    message: '获取比赛列表失败',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

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
                        noticeContent:
                            '恭喜您，{manuscriptUserName}\n您在' +
                            this.noticeTemplate.competitionName +
                            '中荣获{awardDetail}!\n' +
                            this.form.noticeContent,
                        competitionId: this.selectedCompetitionId,
                        attachmentSrc: this.form.attachmentSrc
                    };
                    try {
                        await this.$api.notice.noticeAwardUsers(params);
                        this.$message({
                            message: '通知发送成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.selectedCompetitionId = '';
                        this.form = {
                            competitionId: '',
                            noticeTitle: null,
                            noticeContent: ''
                        };
                        this.$refs.uploadFile.clearFiles();
                        this.$refs['form'].clearValidate();
                    } catch (error) {
                        this.$message({
                            message: error,
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('发送获奖通知表单验证失败');
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
.template-box {
    display: flex;
    flex-direction: column;
    width: 500px;
    padding-left: 40px;
}
.template-content {
    margin-top: 20px;
    padding: 10px;
    width: 300px;
    height: 300px;
    border: #e6e6e6 solid 1px;
}
.file_wrap .el-upload{
    width: auto;
    height: auto;
    border: none;
}
</style>