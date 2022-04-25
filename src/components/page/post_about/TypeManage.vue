<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 帖子/楹联类型管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="类型名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="postTypeList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="postTypeId" label="类型id" align="center"></el-table-column>
                <el-table-column prop="postTypeDetail" label="类型名" align="center"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
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

        <el-dialog title="修改" :visible.sync="editVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="90px">
                <el-form-item label="类型Id">
                    <el-input v-model="editForm.postTypeId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="类型名称" prop="postTypeDetail">
                    <el-input v-model="editForm.postTypeDetail"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="90px">
                <el-form-item label="类型名称" prop="postTypeDetail">
                    <el-input v-model="addForm.postTypeDetail"></el-input>
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
    name: 'TypeManage',
    data() {
        return {
            inputKey: '',
            allType: [],
            postTypeList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            editForm: {},
            editIndex: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            rules: {
                postTypeDetail:[
                    {required: true, message: '请输入类型', trigger: 'blur'}
                ]
            }
        };
    },
    activated() {
        // 获取帖子类型，同步更改帖子类型和楹联类型
        this.getAllType();
    },
    methods: {
        // 从后端获取整个类型，保存起来
        async getAllType() {
            try {
                const res = await this.$api.post.getPostTypeList();
                this.allType = this.sortByPostTypeId(res.postType);   
                this.total = res.total;    
                this.getPostTypeList();        
            } catch (error) {
                this.$message({
                    message: '获取类型失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 自己实现分页和查询
        getPostTypeList() {
            if(!this.inputKey) {
                let list = this.allType.filter((item, index) => {
                    return index < (this.currentPage * this.pageSize) && index >= ((this.currentPage - 1) * this.pageSize)
                });
                this.postTypeList = list;
            } else {
                let list = this.allType.filter((item, index) => {
                    return item.postTypeDetail.includes(this.inputKey);
                });
                list = list.filter((item, index) => {
                    return index < (this.currentPage * this.pageSize) && index >= ((this.currentPage - 1) * this.pageSize)
                });
                this.postTypeList = list;
            }
        },

        // 根据id排序
        sortByPostTypeId(array){
            return array.sort(function(a, b) {
                var id1 = a.postTypeId;
                var id2 = b.postTypeId;
                return id1 < id2 ? -1 : id1 > id2 ? 1 : 0;
            })
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getAllType();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getPostTypeList();
            this.total = this.postTypeList.length;
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getPostTypeList();
        },

        handlePagePrev(){
            this.currentPage--;
        },

        handlePageNext(){
            this.currentPage++;
        },

        // 删除操作
        handleDelete(index, row) {
            this.$confirm('该类型将永远删除，确定要继续吗', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let postParams = {
                    postTypeId: row.postTypeId
                };
                let coupletParams = {
                    coupletTypeId: row.postTypeId
                };
                try {
                    await Promise.all([
                        this.$api.deletePostType(postParams),
                        this.$api.deleteCoupletType(coupletParams)
                    ]);
                    this.$message({
                        message: '删除成功',
                        duration: 2000,
                        type: 'success'
                    });
                    this.getAllType();
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
        },

        // 编辑操作
        handleEdit(index, row) {
            this.editIndex = index;
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },

        // 提交修改
        saveEdit (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    this.editVisible = false;
                    let coupletForm = {
                        coupletTypeId: this.editForm.postTypeId,
                        coupletTypeDetail: this.editForm.postTypeDetail
                    };
                    try {
                        await Promise.all([
                            this.$api.post.modifyPostType(this.editForm),
                            this.$api.couplet.modifyCoupletType(coupletForm)
                        ]);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                        // 触发更新视图，如果是新增的属性，双向绑定不会同步更改
                        this.$set(this.postTypeList, this.editIndex, this.editForm);
                        this.$set(this.allType, (this.currentPage - 1) * this.pageSize + this.editIndex, this.editForm);
                    } catch (error) {
                        this.$message({
                            message: '更新失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }                    
                } else {
                    console.log('修改类型表单验证失败');
                    return false;
                }
            });
        },

        // 撤销修改
        cancelEdit() {
            this.editVisible = false;
            this.$message({
                message: '操作取消',
                duration: 1500,
                type: 'info'
            });
            this.editForm = {};
            this.$refs['editForm'].clearValidate();
        },

        // 添加操作
        handleAdd() {
            this.addVisible = true;
            this.addForm = {
                postTypeDetail: ''
            };
        },

        cancelAdd() {
            this.addVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.addForm = {};
            this.$refs['addForm'].clearValidate();
        },

        saveAdd(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    this.addVisible = false;
                    let coupletParams = {
                        coupletTypeDetail: this.addForm.postTypeDetail
                    };
                    try {
                        await Promise.all([
                            this.$api.post.addPostType(this.addForm),
                            this.$api.couplet.addCoupletType(coupletParams)
                        ]);
                        this.$message({
                            message: '添加成功',
                            duration: 2000,
                            type: 'success'
                        });
                        // 重新拉取数据
                        this.getAllType();
                        this.getPostTypeList();
                    } catch (error) {
                        this.$message({
                            message: '添加失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('新增类型表单验证失败');
                    return false;
                }
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
