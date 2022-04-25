<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 会员管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="姓名/会员证编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="memberList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="memberUid" label="会员证编号" min-width="150" align="center"></el-table-column>
                <el-table-column prop="memberName" label="会员姓名" min-width="100" align="center"></el-table-column>
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
                <el-table-column prop="memberCreateTime" label="入会时间" width="160" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
                <el-form-item label="会员姓名" prop="memberName">
                    <el-input v-model="editForm.memberName"></el-input>
                </el-form-item>
                <el-form-item label="会员证编号" prop="memberUid">
                    <el-input v-model="editForm.memberUid"></el-input>
                </el-form-item> 
                <el-form-item label="性别" prop="memberGender">
                    <el-radio-group v-model="editForm.memberGender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>       
                </el-form-item>          
                <el-form-item label="电话" prop="memberPhone">
                    <el-input v-model="editForm.memberPhone"></el-input>
                </el-form-item>
                <el-form-item label="微信号" prop="memberWechat">
                    <el-input v-model="editForm.memberWechat"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="memberIdcard">
                    <el-input v-model="editForm.memberIdcard"></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="memberBirthday">
                    <el-date-picker
                        v-model="editForm.memberBirthday"
                        type="date" value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="入会时间" prop="memberCreateTime">
                    <el-date-picker
                        v-model="editForm.memberCreateTime"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="笔名" prop="memberPseudonym">
                    <el-input v-model="editForm.memberPseudonym"></el-input>
                </el-form-item>
                <el-form-item label="民族" prop="memberNation">
                    <el-input v-model="editForm.memberNation"></el-input>
                </el-form-item>
                <el-form-item label="党派" prop="memberParties">
                    <el-input v-model="editForm.memberParties"></el-input>
                </el-form-item>
                <el-form-item label="学历" prop="memberEducation">
                    <el-input v-model="editForm.memberEducation"></el-input>
                </el-form-item>
                <el-form-item label="籍贯" prop="memberNativePlace">
                    <el-input v-model="editForm.memberNativePlace"></el-input>
                </el-form-item>
                <el-form-item label="专长" prop="memberAbility">
                    <el-input v-model="editForm.memberAbility"></el-input>
                </el-form-item>
                <el-form-item label="工作单位" prop="memberWorkUnit">
                    <el-input v-model="editForm.memberWorkUnit"></el-input>
                </el-form-item>
                <el-form-item label="联通地址" prop="memberAddress">
                    <el-input v-model="editForm.memberAddress"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码" prop="memberPostalCode">
                    <el-input v-model="editForm.memberPostalCode"></el-input>
                </el-form-item>
                <el-form-item label="个人介绍" prop="memberIntroduction">
                    <el-input type="textarea" autosize v-model="editForm.memberIntroduction"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'MemberManage',
    data() {
        var validateMemberPhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入会员电话'));
            } else if(!(/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(value))) {
                callback(new Error('电话号码不规范'));
            } else {
                callback();
            }
        };
        var validateMemberIdcard = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入会员身份证号'));
            } else if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
                callback(new Error('身份证号不规范'));
            } else {
                callback();
            }
        };
        return {
            inputKey: '',
            memberList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,

            editIndex: -1,
            editForm: {},
            editVisible: false,
            rules: {
                memberUid:[
                    {required: true, message: '请输入会员证编号', trigger: 'blur'}
                ],
                memberName:[
                    {required: true, message: '请输入会员姓名', trigger: 'blur'}
                ],
                memberPhone:[
                    {required: true, validator: validateMemberPhone, trigger: 'blur'}
                ],
                memberGender:[
                    {required: true, message: '请选择会员性别', trigger: 'blur'}
                ],
                memberIdcard:[
                    {required: true, validator: validateMemberIdcard, trigger: 'blur'}
                ],
                memberBirthday:[
                    {required: true, message: '请选择生日', trigger: 'blur'}
                ],
                memberWechat:[
                    {required: true, message: '请输入会员微信号', trigger: 'blur'}
                ],
                memberPseudonym:[
                    {required: true, message: '请输入会员笔名', trigger: 'blur'}
                ],
                memberNation:[
                    {required: true, message: '请输入会员民族', trigger: 'blur'}
                ],
                memberParties:[
                    {required: true, message: '请输入会员党派', trigger: 'blur'}
                ],
                memberEducation:[
                    {required: true, message: '请输入会员学历', trigger: 'blur'}
                ],
                memberNativePlace:[
                    {required: true, message: '请输入会员籍贯', trigger: 'blur'}
                ],
                memberAbility:[
                    {required: true, message: '请输入会员专长', trigger: 'blur'}
                ],
                memberWorkUnit:[
                    {required: true, message: '请输入会员工作单位', trigger: 'blur'}
                ],
                memberAddress:[
                    {required: true, message: '请输入会员通联地址', trigger: 'blur'}
                ],
                memberPostalCode:[
                    {required: true, message: '请输入会员邮政编码', trigger: 'blur'}
                ],
                memberIntroduction:[
                    {required: true, message: '请输入会员个人介绍', trigger: 'blur'}
                ],
            }
        };
    },
    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getMemberList();
    },
    methods: {
        async getMemberList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.user.getMemberList(params);
                this.memberList = res.memberList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取会员列表失败',
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
            this.getMemberList();
            messageObject.close();
        },
        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getMemberList();
        },
        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getMemberList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },

        handleEdit(index, row) {
            this.editIndex = index;
            this.editVisible = true;
            this.editForm = JSON.parse(JSON.stringify(row));
        },

        cancelEdit() {
            this.editVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['editForm'].clearValidate();
        },

        saveEdit(formName) {
            this.$refs[formName].validate( async (valid) => {
                if(valid) {
                    this.editVisible = false;
                    try {
                        await this.$api.user.modifyMember(this.editForm);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.memberList, this.editIndex, this.editForm);
                    } catch (error) {
                        this.$message({
                            message: '修改失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改会员表单验证失败');
                    return false;
                }
            })

        },

        // 删除会员
        handleDelete(index, row) {
            this.$confirm('该会员将永久删除，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                let params = {
                    memberId: row.memberId
                };
                try {
                    await this.$api.user.deleteMember(params);
                    this.$message({
                        message: '删除成功',
                        duration: 2000,
                        type: 'success'
                    });
                    this.getMemberList();
                } catch (error) {
                    this.$message({
                        message: '删除失败',
                        duration: 2000,
                        type: 'error'
                    });
                    console.log(error);
                }
            }).catch(() => {
                this.$message({
                    message: '操作已取消',
                    duration: 1500,
                    type: 'info'
                });
            });
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
