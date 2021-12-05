<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="作者名或ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="authorList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="authorId" label="ID" width="280" align="center"></el-table-column>
                <el-table-column prop="authorName" width="80" label="作者名"></el-table-column>
                <el-table-column prop="authorIntroduction" label="作者简介"></el-table-column>
                <el-table-column prop="authorUser" width="280" label="作者绑定的用户"></el-table-column>
                <el-table-column prop="authorCreatetime" width="100" label="创建的时间"></el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :page-size="10"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @prev-click="handlePagePrev"
                    @next-click="handlePageNext"
                ></el-pagination>
            </div>
        </div>
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-form-item label="Id" prop="authorId">
                    <el-input v-model="form.authorId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="作者姓名" prop="authorName">
                    <el-input v-model="form.authorName"></el-input>
                </el-form-item>
                <el-form-item label="作者简介" prop="authorIntroduction">
                    <el-input type="textarea" autosize v-model="form.authorIntroduction"></el-input>
                </el-form-item>
                <el-form-item label="作者绑定的用户" prop="authorUser">
                    <el-input v-model="form.authorUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible"  width="30%" close-on-click-modal="false">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="90px">
                <el-form-item label="作者姓名" prop="authorName">
                    <el-input v-model="addForm.authorName"></el-input>
                </el-form-item>
                <el-form-item label="作者简介" prop="authorIntroduction">
                    <el-input type="textarea" autosize v-model="addForm.authorIntroduction"></el-input>
                </el-form-item>
                <el-form-item label="作者绑定的用户" prop="authorUser">
                    <el-input v-model="addForm.authorUser"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            searchContent: '',
            authorList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllAuthorList',
            form: {},
            idx: -1,
            id: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            rules: {
                authorName:[
                    {required: true, message: '请输入作者姓名', trigger: 'blur'}
                ]
            }
        };
    },
    created() {
        this.getPage(true);
    },
    methods: {
        getPage(resetCurrentPage){
            if(this.currentMode == 'AllAuthorList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/author/getAuthorNum',{
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                })
                    .then((response) => {
                        this.pageTotal = response.data;
                        if(resetCurrentPage === true){
                            this.currentPage = 1;
                        }       
                        this.getData();        
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/author/getSearchNum',{
                    params: {
                        searchContent: this.searchContent
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                        this.pageTotal = response.data;
                        if(resetCurrentPage === true){
                            this.currentPage = 1;
                        }
                        this.getData();    
                })
            }
        },
        getData() {
            if(this.currentMode == 'AllAuthorList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/author/getAuthor',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.authorList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/author/getSearchAuthor',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.authorList=[];
                    }
                    else{
                        this.authorList = response.data;
                    }
                    
                })
            }
        },
        // 触发刷新
        handleRefresh() {
            this.currentMode = 'AllAuthorList';
            this.searchContent = '';
            this.getPage(true);
        },
        // 触发搜索按钮
        handleSearch() {
            this.currentMode='Search';
            this.getPage(true);
        },
        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getData();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },
        handleEdit(index, row) {
            this.idx = index;
            this.form = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },
        handleAdd() {
            this.addVisible = true;
            this.addForm = {
                authorIntroduction: null,
                authorName: null,
                authorUser: null
            };
        },
        add() {
            this.addVisible = false;
            var that = this;
            this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/couplet-server/author/addAuthor',
                        data: this.addForm,
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                    .then(function (response) {
                        that.$message({
                            message: '新增成功',
                            type: 'success'
                        })
                        that.handleRefresh();
                    })
                    .catch(function (error) {
                        that.$message({
                            message: '操作失败',
                            type: 'error'
                        })
                    });
        },
        saveEdit () {
            this.editVisible = false;
            var that = this;
            this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/couplet-server/author/updateAuthor',
                        data: this.form,
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                    .then(function (response) {
                        that.$set(that.authorList, that.idx, that.form);
                        that.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                    })
                    .catch(function (error) {
                        that.$message({
                            message: '操作失败',
                            type: 'error'
                        })
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
