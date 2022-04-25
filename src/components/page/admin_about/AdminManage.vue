<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 管理员管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="姓名或账号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="adminList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="adminName" label="管理员姓名" align="center"></el-table-column>
                <el-table-column prop="adminAccount" label="账号" align="center"></el-table-column>
                <el-table-column prop="adminPassword" label="密码" align="center"></el-table-column>
                <el-table-column label="账号类型" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag 
                            :type="scope.row.adminType === '0' ? 'warning' : 'success'"
                        >{{scope.row.adminType === '0' ? '超级管理员' : '普通管理员'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="adminCreateTime" label="创建时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                            v-if="scope.row.adminId !== '11111111'"
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px">
                <el-form-item label="管理员id">
                    <el-input v-model="editForm.adminId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="管理员姓名" prop="adminName">
                    <el-input v-model="editForm.adminName"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号" prop="adminAccount">
                    <el-input v-model="editForm.adminAccount"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" prop="adminPassword">
                    <el-input v-model="editForm.adminPassword"></el-input>
                </el-form-item>
                <el-form-item label="选择管理员类型" prop="adminType">
                     <el-radio-group v-model="editForm.adminType">
                        <el-radio label="1">普通管理员</el-radio>
                        <el-radio label="0">超级管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
                <el-form-item label="管理员姓名" prop="adminName">
                    <el-input v-model="addForm.adminName"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号" prop="adminAccount">
                    <el-input v-model="addForm.adminAccount"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" prop="adminPassword">
                    <el-input v-model="addForm.adminPassword"></el-input>
                </el-form-item>
                <el-form-item label="选择管理员类型" prop="adminType">
                     <el-radio-group v-model="addForm.adminType">
                        <el-radio label="1">普通管理员</el-radio>
                        <el-radio label="0">超级管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'AdminManage',
    data() {
        return {
            inputKey: '',
            allAdmin: [],
            adminList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,

            editForm: {},
            editIndex: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},

            rules: {
                adminName:[
                    {required: true, message: '请输入管理员姓名', trigger: 'blur'}
                ],
                adminAccount:[
                    {required: true, message: '请输入管理员账号', trigger: 'blur'}
                ],
                adminPassword:[
                    {required: true, message: '请输入管理员密码', trigger: 'blur'}
                ],
                adminType:[
                    {required: true, message: '请选择账号类型', trigger: 'blur'}
                ]
            }
        };
    },
    activated() {
        this.getAllAdmin();
        this.currentPage = 1;
        this.adminList = [];
    },
    methods: {
        sortByTime(array) {
            return array.sort(function(a, b) {
                var time1 = new Date(a.adminCreatetime).getTime();
                var time2 = new Date(b.adminCreatetime).getTime();
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            })
        },

        async getAllAdmin() {
            try {
                const res = await this.$api.admin.getAdminList();
                this.allAdmin = this.sortByTime(res.adminList);
                this.total = res.total;
                this.getAdminList();
            } catch (error) {
                this.$message({
                    message: '获取管理员列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }

        },

        getAdminList() {
            if(!this.inputKey) {
                this.adminList = this.allAdmin.filter((item, index) => {
                    return index < this.currentPage * this.pageSize && index >= (this.currentPage - 1) * this.pageSize;
                })
            } else {
                let list1 = this.allAdmin.filter((item, index) => {
                    return item.adminName.includes(this.inputKey);
                });
                let list2 = this.allAdmin.filter((item, index) => {
                    return item.adminAccount.includes(this.inputKey);
                });
                list1 = list1.concat(list2);
                this.adminList = list1.filter((item, index) => {
                    return index < this.currentPage * this.pageSize && index >= (this.currentPage - 1) * this.pageSize;
                });
            }
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getAdminList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getAdminList();
            this.total = this.adminList.length;
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getAdminList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },

        // 编辑操作
        handleEdit(index, row) {
            this.editIndex = index;
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },

        handleAdd() {
            this.addVisible = true;
            this.addForm = {
                adminName: '',
                adminAccount: '',
                adminPassword: '',
                adminType: '1',
            };
        },

        cancelEdit() {
            this.editVisible = false;
            this.editForm = {};
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['editForm'].clearValidate();
        },

        cancelAdd() {
            this.addVisible = false;
            this.addForm = {};
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['addForm'].clearValidate();
        },

        saveAdd(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let isExist = false;
                    this.allAdmin.forEach(item => {
                        if (item.adminAccount === this.addForm.adminAccount) {
                            isExist = true;
                        }
                    });
                    if(isExist) {
                        this.$message({
                            message: '该账号已存在,请修改账号后再次提交',
                            duration: 3000,
                            type: 'warning'
                        });
                        return false;
                    }
                    this.addVisible = false;
                    try {
                        await this.$api.admin.addAdmin(this.addForm);
                        this.$message({
                            message: '新增成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.getAllAdmin();
                        this.getAdminList();
                    } catch (error) {
                        this.$message({
                            message: '新增管理员失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('新增管理员验证表单失败');
                    return false;
                }
            });
        },

        saveEdit (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    this.editVisible = false;
                    try {
                        await this.$api.admin.modifyAdmin(this.editForm);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.adminList, this.editIndex, this.editForm);
                        this.$set(this.allAdmin, (this.currentPage - 1) * this.pageSize + this.editIndex, this.editForm);
                    } catch (error) {
                        this.$message({
                            message: '修改失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('验证修改管理员表单失败');
                    return false;
                }
            });
        },

        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('该管理员账号将永久删除，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let params = {
                    adminId: row.adminId
                };
                try {
                    await this.$api.admin.deleteAdmin(params);
                    this.$message({
                        message: '删除成功',
                        duration: 2000,
                        type: 'success'
                    });
                    this.getAllAdmin();
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
            })
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
