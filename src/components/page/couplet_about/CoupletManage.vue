<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 楹联管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="输入关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <!-- <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button> -->
            </div>
            <el-table
                :data="coupletList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="coupletTitle" label="楹联标题"></el-table-column>
                <el-table-column prop="coupletUp" label="上联"></el-table-column>
                <el-table-column prop="coupletDown" label="下联"></el-table-column>
                <el-table-column prop="coupletDate" width="100" label="入库时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
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
                    :page-size="10"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @prev-click="handlePagePrev"
                    @next-click="handlePageNext"
                ></el-pagination>
            </div>
        </div>

        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-form-item label="Id" prop="coupletId">
                    <el-input v-model="form.coupletId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="楹联标题" prop="coupletTitle">
                    <el-input v-model="form.coupletTitle"></el-input>
                </el-form-item>
                <el-form-item label="楹联上联" prop="coupletUp">
                    <el-input v-model="form.coupletUp"></el-input>
                </el-form-item>
                <el-form-item label="楹联下联" prop="coupletDown">
                    <el-input v-model="form.coupletDown"></el-input>
                </el-form-item>
                <el-form-item label="上联作者" prop="coupletUpauthor">
                    <el-input v-model="form.coupletUpauthor"></el-input>
                </el-form-item>
                <el-form-item label="下联作者" prop="coupletDownauthor">
                    <el-input v-model="form.coupletDownauthor"></el-input>
                </el-form-item>
                <el-form-item label="楹联类型" prop="coupletType">
                    <el-input v-model="form.coupletType"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="90px">
                <el-form-item label="楹联标题" prop="coupletTitle">
                    <el-input v-model="addForm.coupletTitle"></el-input>
                </el-form-item>
                <el-form-item label="楹联上联" prop="coupletUp">
                    <el-input v-model="addForm.coupletUp"></el-input>
                </el-form-item>
                <el-form-item label="楹联下联" prop="coupletDown">
                    <el-input v-model="addForm.coupletDown"></el-input>
                </el-form-item>
                <el-form-item label="上联作者" prop="coupletUpauthor">
                    <el-input v-model="addForm.coupletUpauthor"></el-input>
                </el-form-item>
                <el-form-item label="下联作者" prop="coupletDownauthor">
                    <el-input v-model="addForm.coupletDownauthor"></el-input>
                </el-form-item>
                <el-form-item label="楹联类型" prop="coupletType">
                    <el-input v-model="addForm.coupletType"></el-input>
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
import { fetchData } from '../../../api/index';
import Axios from 'axios';
import Vue from 'vue';
export default {
    name: 'basetable',
    data() {
        return {
            searchContent: '',
            allData: [],
            coupletList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllCoupletList',
            form: {},
            idx: -1,
            id: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            rules: {
                coupletTitle:[
                    {required: true, message: '请输入标题', trigger: 'blur'}
                ],
                coupletUp:[
                    {required: true, message: '请输入上联', trigger: 'blur'}
                ],
                coupletDown:[
                    {required: true, message: '请输入下联', trigger: 'blur'}
                ],
                coupletUpauthor:[
                    {required: true, message: '请输入上联作者', trigger: 'blur'}
                ],
                coupletDownauthor:[
                    {required: true, message: '请输入下联作者', trigger: 'blur'}
                ],
                coupletType:[
                    {required: true, message: '请输入楹联类型', trigger: 'blur'}
                ],
            }
        };
    },
    created() {
        this.getPage(true);
    },
    methods: {
        getPage(resetCurrentPage){
            if(this.currentMode == 'AllCoupletList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/getNewCoupletNum',{
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
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/getSearchNum',{
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
            if(this.currentMode == 'AllCoupletList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/getNewCouplet',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.coupletList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/search',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.coupletList=[];
                    }
                    else{
                        this.coupletList = response.data;
                    }
                    
                })
            }
        },
        //触发刷新
        handleRefresh() {
            this.currentMode = 'AllCoupletList';
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
        handleDelete(index, row) {
            // 二次确认删除
            var that = this;
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/couplet-server/couplet/deleteCouplet',
                        data: this.qs.stringify({
                            coupletId: this.coupletList[index].coupletId
                        }),
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                    .then(function (response) {
                        that.getPage(false);
                        if(that.searchContent == ''){
                            that.getData();
                        }
                        else{
                            that.getPage();
                        }
                        that.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                    })
                    .catch(function (error) {
                        that.$message({
                            message: '操作失败',
                            type: 'error'
                        })
                    });
                })
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },
        handleAdd() {
            this.addVisible = true;
            this.addForm = {
                coupletTitle: '',
                coupletUp: '',
                coupletDown: '',
                coupletUpauthor: '',
                coupletDownauthor: '',
                coupletType: ''
            };
        },
        add() {
            this.addVisible = false;
            var that = this;
            this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/couplet-server/couplet/addCouplet',
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
                        url: this.GLOBAL.baseURL + '/couplet-server/couplet/updateCouplet',
                        data: this.form,
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                    .then(function (response) {
                        that.$set(that.coupletList, that.idx, that.form);
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
