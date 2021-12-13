<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 协会会员认证审核
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="真实姓名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="userId" label="ID" width="280" align="center"></el-table-column>
                <el-table-column prop="idCard" label="身份证号"></el-table-column>
                <el-table-column prop="trueName" label="真实姓名"></el-table-column>
                <el-table-column prop="telPhone" label="电话号码"></el-table-column>
                <el-table-column label="认证材料" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.pictureURL"
                            :preview-src-list="[scope.row.pictureURL]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="提交认证时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isaccess === false || scope.row.isaccess === null">
                            <el-button
                                type="text"
                                icon="el-icon-circle-close"
                                class="blue"
                                @click="handleAdd(scope.$index, scope.row)"
                            >通过</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                            >不通过</el-button>
                        </div>
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

        <el-dialog title="新增" :visible.sync="addVisible" width="50%">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
                <el-form-item label="用户Id" prop="userId">
                    <el-input v-model="addForm.userId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="协会会员号" prop="memberId">
                    <el-input v-model="addForm.memberId" maxlength="32" @keyup.native="changeCode"></el-input>
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
            memberList: [
            ],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllMemberList',
            form: {},
            idx: -1,
            id: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            rules: {
                memberId:[
                    {required: true, message: '请输入协会会员号', trigger: 'blur'}
                ],
            },
        };
    },
    created() {
        this.getPage(true);
    },
    methods: {
        getPage(resetCurrentPage){
            if(this.currentMode == 'AllMemberList'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getAuthenNum',{
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
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getSearchAuthenNum',{
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
            if(this.currentMode == 'AllMemberList'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getAuthenList',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.memberList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getAuthenListBySearch',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.memberList=[];
                    }
                    else{
                        this.memberList = response.data;
                    }
                    
                })
            }
        },
        //触发刷新
        handleRefresh() {
            this.currentMode = 'AllMemberList';
            this.searchContent = '';
            this.getPage(true);
        },
        // 触发搜索按钮
        handleSearch() {
            this.currentMode='Search';
            this.getPage(true);
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            var that = this;
            this.$confirm('确定不通过吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/user-server/member/disableAuthen',
                        data: this.qs.stringify({
                            userId: this.memberList[index].userId
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
                            that.handleSearch();
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
        handleAdd(index, row) {
            this.addVisible = true;
            this.idx = index;
            this.addForm = {
                userId: this.memberList[index].userId,
                memberId: ''
            };
        },
        add() {
            var temp = this.memberList[this.idx];
            this.addVisible = false;
            var that = this;
            this.$axios({
                method: 'get',
                url: this.GLOBAL.baseURL + '/user-server/member/ableAuthen',
                params : {
                    userId: this.addForm.userId,
                    memberId: this.addForm.memberId
                },
                headers: {
                    'token': this.GLOBAL.token.token
                }
            })
                .then(function (response) {
                    that.getPage(false);
                    temp.isaccess = true;
                    that.$set(that.memberList,that.idx, temp);
                    if(response.data===true){
                        that.$message({
                            message: '新增成功',
                            type: 'success'
                        })
                    }
                    else{
                        that.$message({
                            message: '数据重复或错误',
                            type: 'error'
                        })
                    }
                })
                .catch(function (error) {
                    temp.isaccess = false;
                    that.$set(that.memberList, that.index, temp)
                    that.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                });
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
        changeCode() {
            this.$nextTick(() => {
                if(this.addForm.memberId !== null){
                    this.addForm.memberId = this.addForm.memberId.replace(/[\u4e00-\u9fa5]/ig,'')
                }
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
