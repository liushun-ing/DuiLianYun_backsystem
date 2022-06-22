<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 投稿管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                请先选择比赛 &nbsp;
                <el-select ref="select" v-model="selectedCompetitionId" placeholder="请选择比赛" @change="changeCompetitionOptions">
                    <el-option v-for="item in competitionOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                &nbsp;&nbsp;
                <el-input
                    @keyup.enter.native="handleSearch"
                    v-model="inputKey"
                    placeholder="姓名/省份"
                    class="handle-input mr10"
                ></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <div style="float: right">
                    <el-button v-if="allManuscript.length === 0" type="success" @click="beforeExport" size="small">导出EXCEL</el-button>
                    <download-excel
                        v-else
                        class="export-excel-wrapper"
                        :data="allManuscript"
                        :fields="json_fields"
                        :header="header"
                        :name="name"
                    >
                        <el-button type="success" size="small">导出EXCEL</el-button>
                    </download-excel>
                </div>
            </div>
            <el-table :data="manuscriptList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="manuscriptId" min-width="250" label="投稿编号" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserName" min-width="100" label="投稿人" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserProvince" min-width="80" label="省份" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserPhone" min-width="150" label="联系电话" align="center"></el-table-column>
                <el-table-column label="投稿作品" align="center" min-width="300">
                    <template slot-scope="scope">
                        <div class="content_wrap">{{ scope.row.manuscriptContent }}</div>
                    </template>
                </el-table-column>
                <el-table-column min-width="80" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === '中榜'" type="danger">中榜</el-tag>
                        <el-tag v-else type="info">落榜</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="competitionName" min-width="160" label="所属比赛" align="center"></el-table-column>
                <el-table-column prop="manuscriptCreateTime" width="160" label="投稿时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="150" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" class="green" @click="handleView(scope.$index, scope.row)"
                            >查看</el-button
                        >
                        <el-button type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.$index, scope.row)"
                            >修改</el-button
                        >
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >退稿</el-button
                        >
                        <el-button
                            type="text"
                            v-if="scope.row.manuscriptIsShortlisted === '1'"
                            disabled
                            icon="el-icon-s-promotion"
                            class="gray"
                            @click="handleSetFinalist(scope.$index, scope.row)"
                            >已入围</el-button
                        >
                        <el-button
                            type="text"
                            v-else
                            icon="el-icon-s-promotion"
                            class="blue"
                            @click="handleSetFinalist(scope.$index, scope.row)"
                            >入围</el-button
                        >
                        <el-button
                            v-if="scope.row.status === '中榜'"
                            type="text"
                            disabled
                            icon="el-icon-trophy"
                            class="gray"
                            @click="handleSetAwards(scope.$index, scope.row)"
                            >已设置奖项</el-button
                        >
                        <el-button v-else type="text" icon="el-icon-trophy" class="orange" @click="handleSetAwards(scope.$index, scope.row)"
                            >设置奖项</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                    @prev-click="handlePagePrev"
                    @next-click="handlePageNext"
                ></el-pagination>
            </div>
        </div>

        <el-dialog :visible.sync="viewVisible" width="60%">
            <el-descriptions title="投稿详情" :column="2" border>
                <el-descriptions-item label="投稿编号">
                    {{ viewForm.manuscriptUserName }}
                </el-descriptions-item>
                <el-descriptions-item label="投稿人">
                    {{ viewForm.manuscriptUserName }}
                </el-descriptions-item>
                <el-descriptions-item label="省份">
                    {{ viewForm.manuscriptUserProvince }}
                </el-descriptions-item>
                <el-descriptions-item label="详细地址">
                    {{ viewForm.manuscriptUserAddress }}
                </el-descriptions-item>
                <el-descriptions-item label="邮箱">
                    {{ viewForm.manuscriptUserEmail }}
                </el-descriptions-item>
                <el-descriptions-item label="电话">
                    {{ viewForm.manuscriptUserPhone }}
                </el-descriptions-item>
                <el-descriptions-item label="投稿比赛名称">
                    {{ viewForm.competitionName }}
                </el-descriptions-item>
                <el-descriptions-item label="投稿时间">
                    {{ viewForm.manuscriptCreateTime }}
                </el-descriptions-item>
                <el-descriptions-item label="目前是否获奖">
                    <el-tag v-if="viewForm.status === '1'" type="danger">中榜</el-tag>
                    <el-tag v-else type="info">落榜</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="投稿作品">
                    <div v-html="viewForm.manuscriptContent"></div>
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="editVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="90px">
                <el-form-item label="投稿编号" prop="manuscriptId">
                    <el-input v-model="editForm.manuscriptId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="投稿省份" prop="manuscriptUserProvince">
                    <el-input type="textarea" autosize v-model="editForm.manuscriptUserProvince"></el-input>
                </el-form-item>
                <el-form-item label="投稿内容" prop="manuscriptContent">
                    <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 12 }" v-model="editForm.manuscriptContent"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :show-close="false" :close-on-click-modal="false" :visible.sync="setFinalistVisible" width="60%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <div style="padding-bottom: 30px">请输入通知名称:</div>
                <el-form-item label="通知名称" prop="noticeTitle">
                    <el-input style="width: 250px" v-model="form.noticeTitle"></el-input>
                </el-form-item>
                <div style="padding-bottom: 20px">请输入通知名称:</div>
                <el-form-item label="通知内容" prop="noticeContent">
                    <el-input type="textarea" class="introduction" rows="5" v-model="form.noticeContent"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setFinalistVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit1">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="setAwardVisible" width="60%">
            <el-form ref="awardForm" :model="awardForm" :rules="rules">
                <el-descriptions direction="vertical" :column="1" border>
                    <el-descriptions-item label="输入奖项名称">
                        <el-form-item prop="awardDetail">
                            <el-input type="textarea" class="introduction" rows="2" v-model="awardForm.awardDetail"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="挑选获奖部分(注意排版哟)，可点击工具栏右侧预览查看最终效果">
                        <el-form-item prop="awardContent">
                            <mavon-editor
                                v-model="awardForm.awardContentMarkdown"
                                @change="changeContent"
                                :toolbars="awardToolbars"
                                :subfield="false"
                                :autofocus="false"
                                ref="md"
                            />
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setAwardVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit2">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="noticeVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 20px; font-weight: 600; padding-bottom: 30px; text-align: conter">退稿请填写退稿通知</div>
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px">请输入退稿通知标题</div>
            <el-input v-model="noticeTitle" placeholder="请输入退稿通知标题" maxlength="15"></el-input>
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px; padding-top: 30px">请输入退稿通知内容(会自动添加xxx,您好前缀)</div>
            <el-input v-model="noticeContent" type="textarea" placeholder="请输入退稿通知内容"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSendNotice">取 消</el-button>
                <el-button type="primary" @click="deleteManuscript">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'ManuscriptManage',
    data() {
        return {
            toolbars: utils.awardToolbars,
            allManuscript: [],
            inputKey: '',
            manuscriptList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,
            viewVisible: false,
            viewForm: {},

            noticeVisible: false,
            deleteForm: {},
            deleteIndex: -1,
            noticeTitle: '',
            noticeContent: '',

            editForm: {},
            editIndex: -1,
            editVisible: false,

            setFinalistVisible: false,

            setAwardVisible: false,

            //选择的比赛的id
            selectedCompetitionId: null,
            competitionList: [],
            competitionOptions: [],

            //导出excel表格
            header: '',
            name: '',
            json_fields: {
                投稿编号: 'manuscriptId',
                投稿人: 'manuscriptUserName',
                投稿人简介: 'userIntroduction',
                省份: 'manuscriptUserProvince',
                联系电话: 'manuscriptUserPhone',
                投稿作品: 'manuscriptContent',
                状态: 'status',
                所属比赛: 'competitionName',
                投稿时间: 'manuscriptCreateTime'
            },
            json_meta: [
                [
                    {
                        ' key ': ' charset ',
                        ' value ': ' utf- 8 '
                    }
                ]
            ],

            //通知
            form: {
                noticeTitle: '',
                noticeContent: ''
            },
            awardForm: {},

            rules: {
                manuscriptContent: [{ required: true, message: '请输入投稿内容', trigger: 'blur' }]
            }
        };
    },
    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        //this.getManuscriptList();
        this.getCompetitionList();
    },
    methods: {
        sortByTime(array) {
            return array.sort(function (a, b) {
                var time1 = new Date(a.manuscriptCreateTime).getTime();
                var time2 = new Date(b.manuscriptCreateTime).getTime();
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            });
        },

        //获取比赛列表
        async getCompetitionList() {
            try {
                const res = await this.$api.competition.getAllCompetition();
                this.competitionList = res.competitionList;
                // 将数据转换为下拉框，value是比赛id,label是名称
                let options = [];
                this.competitionList.forEach((item, index) => {
                    options.push({
                        value: item.competitionId,
                        label: item.competitionName
                    });
                });
                this.competitionOptions = options;
            } catch (error) {
                this.$message({
                    message: '获取比赛列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 选择比赛
        async changeCompetitionOptions(value) {
            if (value) {
                this.selectedCompetitionId = value;
                let params = {
                    selectedCompetitionId: this.selectedCompetitionId
                };
                try {
                    const res = await this.$api.competition.getAllManuscript(params);
                    this.allManuscript = this.sortByTime(res.allManuscript);
                    this.total = res.total;
                    this.currentPage = 1;
                    this.getManuscriptList();
                    // 设置exel的header
                    const index = this.competitionList.findIndex((item, index) => {
                        return (item.competitionId = this.selectedCompetitionId);
                    });
                    this.header = this.competitionList[index].competitionName + '投稿列表';
                    this.name = this.competitionList[index].competitionName + '投稿列表';
                } catch (error) {
                    this.$message({
                        message: '获取该比赛投稿信息失败',
                        duration: 2000,
                        type: 'error'
                    });
                    console.log(error);
                }
            }
        },

        //根据分页截取相应的的投稿
        getManuscriptList() {
            let _manuscriptList = this.allManuscript;
            if (this.inputKey.length != 0) {
                console.log('searching');
                _manuscriptList = this.allManuscript.filter((item, index) => {
                    return item.manuscriptUserName.indexOf(this.inputKey) + 1 || item.manuscriptUserProvince.indexOf(this.inputKey) + 1;
                });
            }

            this.manuscriptList = _manuscriptList.filter((item, index) => {
                return index < this.currentPage * this.pageSize && index >= (this.currentPage - 1) * this.pageSize;
            });
            this.total = _manuscriptList.length;
        },

        handleDelete(index, row) {
            this.noticeVisible = true;
            this.noticeTitle = '退稿通知';
            this.noticeContent = '';
            this.deleteIndex = index;
            this.deleteForm = JSON.parse(JSON.stringify(row));
        },

        cancelSendNotice() {
            this.noticeVisible = false;
            this.noticeTitle = '';
            this.noticeContent = '';
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
        },

        async saveSendNotice() {
            this.noticeVisible = false;
            this.noticeContent = this.deleteForm.manuscriptUserName + '您好。' + this.noticeContent;
            const res = await utils.sendNotice(this.deleteForm.manuscriptUserId, 11, this.noticeTitle, this.noticeContent, '');
            if (res === '发送成功') {
                this.$message.success('退稿成功，并发送了相关通知');
            }
            this.noticeTitle = '';
            this.noticeContent = '';
            this.$refs.uploadFile.clearFiles();
        },

        async deleteManuscript() {
            if (!this.noticeTitle || !this.noticeContent) {
                this.$message({
                    message: '请先输入标题和内容',
                    type: 'warning',
                    duration: 2000
                });
                return;
            }
            try {
                let params = {
                    manuscriptId: this.deleteForm.manuscriptId
                };
                await this.$api.competition.deleteManuscript(params);
                // 删除当前数据
                const index = this.allManuscript.findIndex((item) => {
                  return item.manuscriptId == this.deleteForm.manuscriptId
                })
                this.allManuscript.splice(index, 1);
                this.getManuscriptList();
                this.saveSendNotice();
            } catch (error) {
                this.$message({
                    message: '退稿失败',
                    type: 'error'
                });
            }
        },

        // 编辑操作
        handleEdit(index, row) {
            this.editIndex = index;
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },

        // 取消编辑
        cancelEdit() {
            this.editVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.editForm = {};
            this.$refs['editForm'].clearValidate();
        },

        // 提交修改
        saveEdit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.editVisible = false;
                    let params = {
                        manuscriptId: this.editForm.manuscriptId,
                        manuscriptUserProvince: this.editForm.manuscriptUserProvince,
                        manuscriptContent: this.editForm.manuscriptContent
                    };
                    try {
                        await this.$api.competition.modifyManuscript(params);
                        this.$set(this.manuscriptList, this.editIndex, this.editForm);
                        this.$set(this.allManuscript, (this.currentPage - 1) * this.pageSize + this.editIndex, this.editForm);
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
                    console.log('修改投稿表单验证失败');
                    return false;
                }
            });
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getManuscriptList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            if (this.selectedCompetitionId === null) {
                //弹窗提醒先选择比赛
                this.$message({
                    message: '请先选择比赛',
                    duration: 2000,
                    type: 'warning'
                });
            } else {
                this.currentPage = 1;
                this.getManuscriptList();
            }
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getManuscriptList();
        },
        handlePagePrev() {
            this.currentPage--;
        },
        handlePageNext() {
            this.currentPage++;
        },

        handleView(index, row) {
            this.viewVisible = true;
            let viewForm = JSON.parse(JSON.stringify(row));
            viewForm.manuscriptContent = utils.formatText(viewForm.manuscriptContent);
            this.viewForm = viewForm;
        },

        //处理入围
        handleSetFinalist(index, row) {
            this.setFinalistVisible = true;
            this.chosenUserId = row.manuscriptUserId;
            this.chosenManuscriptId = row.manuscriptId;
        },

        //处理设置奖项
        handleSetAwards(index, row) {
            this.setAwardVisible = true;
            this.awardForm.awardCompetitionId = row.competitionId;
            this.awardForm.awardUserId = row.manuscriptUserId;
            this.awardForm.awardManuscriptId = row.manuscriptId;
        },

        //若投稿列表为空，则不能导出
        beforeExport() {
            this.$message({
                message: '当前没有数据可以导出',
                duration: 2000,
                type: 'warning'
            });
        },

        //提交入围通知内容
        onSubmit1() {
            this.$refs[`form`].validate(async (valid) => {
                if (valid) {
                    let chosenUser = [this.chosenUserId];
                    let params = {
                        noticeUserList: chosenUser,
                        noticeTitle: this.form.noticeTitle,
                        noticeContent: this.form.noticeContent
                    };
                    let _params = {
                        manuscriptId: this.chosenManuscriptId
                    };
                    try {
                        await this.$api.notice.noticeSomeUsers(params);
                        await this.$api.competition.setManuscriptShortlisted(_params);
                        this.$message({
                            message: '通知发送成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.form = {
                            noticeTitle: null,
                            noticeContent: null
                        };
                        let index = 0;
                        for (let i = 0; i < this.allManuscript.length; i++) {
                            if (this.allManuscript[i].manuscriptId == this.chosenManuscriptId) {
                                index = i;
                                break;
                            }
                        }
                        let obj = this.allManuscript[index];
                        obj.manuscriptIsShortlisted = '1';
                        this.$set(this.allManuscript, index, obj);
                        this.getManuscriptList();
                        this.setFinalistVisible = false;
                        this.$refs['form'].clearValidate();
                    } catch (error) {
                        this.$message({
                            message: '通知发送失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    this.$message({
                        message: '请先填写标题和内容',
                        duration: 2000,
                        type: warning
                    });
                    return false;
                }
            });
        },

        //提交获奖通知内容
        onSubmit2() {
            this.$refs[`awardForm`].validate(async (valid) => {
                if (valid) {
                    let params = {
                        awardCompetitionId: this.awardForm.awardCompetitionId,
                        awardUserId: this.awardForm.awardUserId,
                        awardManuscriptId: this.awardForm.awardManuscriptId,
                        awardContent: this.awardForm.awardContentMarkdown,
                        awardContentMarkdown: this.awardForm.awardContentMarkdown,
                        awardDetail: this.awardForm.awardDetail
                    };
                    try {
                        await this.$api.competition.distributeAward(params);
                        await this.$api.competition.setManuscriptShortlisted(params);
                        this.$message({
                            message: '设置奖项成功',
                            duration: 2000,
                            type: 'success'
                        });

                        let index = 0;
                        for (let i = 0; i < this.allManuscript.length; i++) {
                            if (this.allManuscript[i].manuscriptId == this.awardForm.awardManuscriptId) {
                                index = i;
                                break;
                            }
                        }
                        let obj = this.allManuscript[index];
                        obj.status = '中榜';
                        this.$set(this.allManuscript, index, obj);
                        this.getManuscriptList();
                        this.$refs['form'].clearValidate();
                    } catch (error) {
                        this.$message({
                            message: '设置奖项失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    this.$message({
                        message: '请先填写内容',
                        duration: 2000,
                        type: warning
                    });
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
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
.table {
    width: 100%;
    font-size: 14px;
}
.gray {
    color: gray;
}
.green {
    color: green;
}
.blue {
    color: blue;
}
.orange {
    color: orange;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.content_wrap {
    overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
/* .content_wrap:hover{
    display: block;
} */
</style>
