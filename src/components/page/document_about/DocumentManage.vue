<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 资料管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="输入关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="documentList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="document.documentName" label="资料名称"></el-table-column>
                <el-table-column prop="document.documentIntroduction" label="资料简介"></el-table-column>
                <el-table-column prop="document.documentCreatetime" width="100" label="入库时间"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="handleDownload(scope.$index, scope.row)"
                        >查看/下载</el-button>
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
                <el-form-item label="Id" prop="documentId">
                    <el-input v-model="form.documentId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="资料名称" prop="documentName">
                    <el-input v-model="form.documentName"></el-input>
                </el-form-item>
                <el-form-item label="资料简介" prop="documentIntroduction">
                    <el-input v-model="form.documentIntroduction"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
            documentList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllDocumentList',
            form: {},
            idx: -1,
            id: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            rules: {
                documentName:[
                    {required: true, message: '请输入资料名', trigger: 'blur'}
                ],
                documentIntroduction:[
                    {required: true, message: '请输入资料简介', trigger: 'blur'}
                ]
            },
            rowTemp: {

            }
        };
    },
    created() {
        this.getPage(true);
    },
    methods: {
        getPage(resetCurrentPage){
            if(this.currentMode == 'AllDocumentList'){
                this.$axios.get(this.GLOBAL.baseURL + '/file-server/document/getNewNum',{
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
                this.$axios.get(this.GLOBAL.baseURL + '/file-server/document/getSearchNum',{
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
            if(this.currentMode == 'AllDocumentList'){
                this.$axios.get(this.GLOBAL.baseURL + '/file-server/document/getNew',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.documentList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/file-server/document/search',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.documentList=[];
                    }
                    else{
                        this.documentList = response.data;
                    }
                    
                })
            }
        },
        //触发刷新
        handleRefresh() {
            this.currentMode = 'AllDocumentList';
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
                        url: this.GLOBAL.baseURL + '/file-server/document/deleteDocument',
                        data: this.qs.stringify({
                            documentId: this.documentList[index].document.documentId
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
            this.rowTemp = row;
            this.form = JSON.parse(JSON.stringify(row.document));
            this.editVisible = true;
        },
        saveEdit () {
            this.editVisible = false;
            var that = this;
            this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/file-server/document/updateDocument',
                        data: this.form,
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                    .then(function (response) {
                        that.rowTemp.document = that.form;
                        that.$set(that.documentList, that.rowTemp, that.form);
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
        },
        handleDownload(index, row) {
            this.$axios.get(this.GLOBAL.baseURL + '/file-server/file/getFileInfoById',{
                params: {
                    documentId: row.document.documentId
                },
                headers: {
                    'token': this.GLOBAL.token.token
                }
            }).then((response) => {
                window.open(this.GLOBAL.baseURL + "/file-server/viewFile/" + response.data.fileType + "/" + response.data.fileId + "." + response.data.fileType)
            })
        },
        handleAdd(){
            this.$router.replace('/DocumentUpload')
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
