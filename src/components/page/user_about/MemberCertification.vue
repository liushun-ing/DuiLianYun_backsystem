<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员认证审核
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="memberCertificationList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="memberPhone" label="电话号码" align="center"></el-table-column>
                <el-table-column label="认证材料" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.memberApplicationReason"
                            :preview-src-list="[scope.row.memberApplicationReason]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="memberCreateTime" label="提交认证时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div v-if="scope.row.memberType === 1">
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

        <el-dialog title="认证" :visible.sync="passVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="passForm" :model="passForm" :rules="rules" label-width="100px">
                <el-form-item label="认证材料" prop="memberApplicationReason">
                    <el-image
                        class="passImage"
                        :src="passForm.memberApplicationReason"
                        :preview-src-list="[passForm.memberApplicationReason]"
                    ></el-image>
                </el-form-item>
                <el-form-item label="会员姓名" prop="memberName">
                    <el-input v-model="passForm.memberName"></el-input>
                </el-form-item>
                <el-form-item label="会员身份证" prop="memberIdcard">
                    <el-input v-model="passForm.memberIdcard" :maxlength="18" :minlength="15"></el-input>
                </el-form-item>
                <el-form-item label="会员证编号" prop="memberUid">
                    <el-input v-model="passForm.memberUid"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="memberGender">
                    <el-radio-group v-model="passForm.memberGender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="memberBirthday">
                    <el-date-picker
                        v-model="passForm.memberBirthday"
                        type="date" value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="入会时间" prop="memberCreateTime">
                    <el-date-picker
                        v-model="passForm.memberCreateTime"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                    </el-date-picker>
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
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px;">将拒绝该用户的会员认证，确定要继续吗？</div>
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
import utils from '../../../utils/utils';
export default {
    name: 'MemberCertification',
    data() {
        var validateIdcard = (rules, value, callback) => {
            if(!value) {
                callback(new Error('请输入身份证号'));
            } else if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(value)) {
                callback(new Error('身份证不合法'));
            } else {
                callback();
            }
        }
        return {
            inputKey: '',
            allData: [],
            memberCertificationList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,

            passForm: {},
            passIndex: -1,
            passVisible: false,

            denyVisible: false,
            denyIndex: -1,
            denyForm: {},
            noticeForm: {},
            isSendNotice: true,

            rules: {
                memberUid:[
                    {required: true, message: '请输入会员证编号', trigger: 'blur'}
                ],
                memberName:[
                    {required: true, message: '请输入会员证姓名', trigger: 'blur'}
                ],
                memberIdcard:[
                    {required: true, validator: validateIdcard, trigger: 'blur'}
                ],
                memberGender:[
                    {required: true, message: '请选择会员性别', trigger: 'blur'}
                ],
                memberCreateTime:[
                    {required: true, message: '请选择入会时间', trigger: 'blur'}
                ],
                memberBirthday:[
                    {required: true, message: '请选择出生日期', trigger: 'blur'}
                ]
            },
        };
    },
    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getMemberCertificationList();
    },
    methods: {
        async getMemberCertificationList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.user.getMemberCertificationList(params);
                this.memberCertificationList = res.memberCertificationList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取认证会员列表失败',
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
            this.getMemberCertificationList();
            messageObject.close();
        },
        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getMemberCertificationList();
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
            this.noticeForm = utils.getNoticeTemplate(5);
        },

        async saveDeny() {
            this.denyVisible = false;
            let params = {
                memberId: this.denyForm.memberId
            };
            try {
                await this.$api.user.denyMemberCertification(params);
                this.$message({
                    message: '拒绝会员认证成功',
                    duration: 2000,
                    type: 'success'
                });
                this.memberCertificationList[this.denyIndex].memberType = 3;
                if(this.isSendNotice) {
                    setTimeout(() => {
                        utils.sendNotice(this.denyForm.memberBindedUserId, 5);
                    }, 1000);
                }
            } catch (error) {
                this.$message({
                    message: '拒绝会员认证失败',
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
            this.noticeForm = utils.getNoticeTemplate(4);
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
                        memberGender: this.passForm.memberGender,
                        memberUid: this.passForm.memberUid,
                        memberName: this.passForm.memberName,
                        memberIdcard: this.passForm.memberIdcard,
                        memberCreateTime: this.passForm.memberCreateTime,
                        memberBirthday: this.passForm.memberBirthday,
                        memberBinderUserId: this.passForm.memberBinderUserId,
                    };
                    try {
                        await this.$api.user.passMemberCertification(params);
                        this.$message({
                            message: '通过会员认证成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.memberCertificationList[this.passIndex].memberType = 2;  
                        if(this.isSendNotice) {
                            setTimeout(() => {
                                utils.sendNotice(this.passForm.memberBindedUserId, 4);
                            }, 1000);
                        }                      
                    } catch (error) {
                        this.$message({
                            message: '通过会员认证失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('通过会员认证表单验证失败');
                    return false;
                }
            });
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getMemberCertificationList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },
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
.passImage {
    width: 200px;
    height: 200px;
}
</style>
