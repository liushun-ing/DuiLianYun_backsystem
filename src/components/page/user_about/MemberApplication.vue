<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员申请审核
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="申请人姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="memberApplicationList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="memberName" label="申请人姓名" min-width="100" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.memberPhoto"
                            :preview-src-list="[scope.row.memberPhoto]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="memberGender" label="性别" min-width="50" align="center"></el-table-column>
                <el-table-column prop="memberIdcard" label="身份证号" min-width="200" align="center"></el-table-column>
                <el-table-column prop="memberPhone" label="电话号码" min-width="120" align="center"></el-table-column>
                <el-table-column prop="memberWechat" label="微信号" width="100" align="center"></el-table-column>
                <el-table-column prop="memberPseudonym" label="笔名" width="100" align="center"></el-table-column>
                <el-table-column prop="memberBirthday" label="生日" width="100" align="center"></el-table-column>
                <el-table-column prop="memberNation" label="民族" width="100" align="center"></el-table-column>
                <el-table-column prop="memberParties" label="党派" width="100" align="center"></el-table-column>
                <el-table-column prop="memberEducation" label="学历" width="100" align="center"></el-table-column>
                <el-table-column prop="memberNativePlace" label="籍贯" width="150" align="center"></el-table-column>
                <el-table-column prop="memberWorkUnit" label="工作单位" width="150" align="center"></el-table-column>
                <el-table-column prop="memberAddress" label="通联地址" width="150" align="center"></el-table-column>
                <el-table-column prop="memberPostalCode" label="邮政编码" width="150" align="center"></el-table-column>
                <el-table-column prop="memberAbility" label="专长" width="150" align="center"></el-table-column>
                <el-table-column prop="memberIntroduction" label="会员自我介绍" width="250" align="center"></el-table-column>
                <el-table-column prop="memberCreateTime" label="申请时间" width="160" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div v-if="scope.row.memberType === 0">
                            <el-button
                                type="text"
                                icon="el-icon-success"
                                @click="handlePass(scope.$index, scope.row)"
                            >通过</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-error"
                                class="red"
                                @click="handleDeny(scope.$index, scope.row)"
                            >不通过</el-button>
                        </div>
                        <div v-else-if="scope.row.memberType === 2">
                            <el-tag>已通过</el-tag>
                        </div>
                        <div v-else>
                            <el-tag type="info">已拒绝</el-tag>
                        </div>
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

        <el-dialog title="申请审核" :visible.sync="passVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="passForm" :model="passForm" :rules="rules" label-width="150px">
                <el-form-item label="会员名字" prop="memberName">
                    <el-input v-model="passForm.memberName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="请分配会员证编号" prop="memberUid">
                    <el-input v-model="passForm.memberUid"></el-input>
                </el-form-item>
            </el-form>
            <el-checkbox v-model="isSendNotice">是否自动发送如下通知</el-checkbox>
            <el-descriptions :column="1" style="padding-top: 10px;" border>
                <el-descriptions-item label="通知标题">{{noticeForm.noticeTitle}}</el-descriptions-item>
                <el-descriptions-item label="通知内容">{{noticeForm.noticeContent}}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPass">取 消</el-button>
                <el-button type="primary" @click="savePass('passForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="denyVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px;">将拒绝该用户的会员申请，确定要继续吗？</div>
            <el-checkbox v-model="isSendNotice">是否自动发送如下通知</el-checkbox>
            <el-descriptions :column="1" style="padding-top: 10px;" border>
                <el-descriptions-item label="通知标题">{{noticeForm.noticeTitle}}</el-descriptions-item>
                <el-descriptions-item label="通知内容">{{noticeForm.noticeContent}}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDeny">取 消</el-button>
                <el-button type="primary" @click="saveDeny">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js'
export default {
    name: 'MemberApplication',
    data() {
        return {
            inputKey: '',
            memberApplicationList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,

            passVisible: false,
            passForm: {},
            passIndex: -1,

            denyVisible: false,
            denyForm: {},
            denyIndex: -1,

            noticeForm: {},
            isSendNotice: true,

            rules: {
                memberUid:[
                    {required: true, message: '请输入会员证编号', trigger: 'blur'}
                ],
            }
        };
    },
    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getMemberApplicationList();
    },
    methods: {
        async getMemberApplicationList() {
            let params = {
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.user.getMemberApplicationList(params);
                this.memberApplicationList = res.memberApplicationList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取会员申请列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getMemberApplicationList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getMemberApplicationList();
        },

        cancelDeny() {
            this.denyVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['denyForm'].clearValidate();
        },

        handleDeny(index, row) {
            this.denyVisible = true;
            this.denyIndex = index;
            this.denyForm = JSON.parse(JSON.stringify(row));
            this.isSendNotice = true;
            this.noticeForm = utils.getNoticeTemplate(3);
        },

        async saveDeny() {
            this.denyVisible = false;
            let params = {
                memberId: this.denyForm.memberId
            };
            try {
                await this.$api.user.denyMemberApplication(params);
                this.$message({
                    message: '拒绝申请成功',
                    duration: 2000,
                    type: 'success'
                });
                this.memberApplicationList[this.denyIndex].memberType = 3;
                if(this.isSendNotice) {
                    setTimeout(() => {
                        utils.sendNotice(this.denyForm.memberBindedUserId, 3);
                    }, 1000);
                }
            } catch (error) {
                this.$message({
                    message: '拒绝申请失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            };
        },

        handlePass(index, row) {
            this.passVisible = true;
            this.passIndex = index;
            this.passForm = JSON.parse(JSON.stringify(row));
            this.isSendNotice = true;
            this.noticeForm = utils.getNoticeTemplate(2);
        },

        cancelPass() {
            this.passVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['passForm'].clearValidate();
        },

        savePass(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    this.passVisible = false;
                    let params = {
                        memberId: this.passForm.memberId,
                        memberUid: this.passForm.memberUid,
                        memberBindedUserId: this.passForm.memberBindedUserId
                    };
                    try {
                        await this.$api.user.passMemberApplication(params);
                        this.$message({
                            message: '申请已通过',
                            duration: 2000,
                            type: 'success'
                        });
                        this.memberApplicationList[this.passIndex].memberType = 2;
                        if(this.isSendNotice) {
                            setTimeout(() => {
                                utils.sendNotice(this.passForm.memberBindedUserId, 2); 
                            }, 1000);
                        }
                    } catch (error) {
                        this.$message({
                            message: '通过申请失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    };
                } else {
                    console.log('通过审核表单验证失败');
                    return false;
                }
            });

        },
        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getMemberApplicationList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
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
.red {
    color: #ff0000;
}
.green {
    color: #00ff00;
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
</style>
