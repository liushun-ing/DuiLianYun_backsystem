<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 协会会员管理
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
                :data="memberTrueList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="memberTrueid" label="协会会员号" width="280" align="center"></el-table-column>
                <el-table-column prop="idCard" label="身份证号"></el-table-column>
                <el-table-column prop="trueName" label="真实姓名"></el-table-column>
                <el-table-column prop="telPhone" label="电话号码"></el-table-column>
                <el-table-column label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.isDisable===true || scope.row.isDisable === null?'danger':'success'"
                        >{{scope.row.isDisable===true|| scope.row.isDisable === null?'禁用':'正常'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isDisable === true || scope.row.isDisable === null">
                            <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                class="green"
                                @click="handleDisable(scope.$index, scope.row)"
                            >启用</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button>
                        </div>
                        <div v-if="scope.row.isDisable === false">
                            <el-button
                                type="text"
                                icon="el-icon-circle-close"
                                class="red"
                                @click="handleDisable(scope.$index, scope.row)"
                            >禁用</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button>
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
            memberTrueList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllMemberTrueList'
        };
    },
    created() {
        this.getPage(true);
    },
    methods: {
        getPage(resetCurrentPage){
            if(this.currentMode == 'AllMemberTrueList'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getMemberTNum',{
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
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getSearchMemberTNum',{
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
            if(this.currentMode == 'AllMemberTrueList'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getMemberTList',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.memberTrueList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/member/getMemberTListBySearch',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.memberTrueList=[];
                    }
                    else{
                        this.memberTrueList = response.data;
                    }

                })
            }
        },
        //触发刷新
        handleRefresh() {
            this.currentMode = 'AllMemberTrueList';
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
            this.$confirm('确定要删除该协会会员吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/user-server/member/deleteMemberTrue',
                        data: this.qs.stringify({
                            memberId: this.memberTrueList[index].memberTrueid
                        }),
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                        .then(function (response) {
                            that.getPage(false);
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
        handleDisable(index, row) {
            var temp = this.memberTrueList[index];
            var that = this;
            if(this.memberTrueList[index].isDisable === false){
                this.$confirm('确定要禁用该协会会员吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$axios({
                            method: 'post',
                            url: this.GLOBAL.baseURL + '/user-server/member/disableMemberTrue',
                            data: this.qs.stringify({
                                memberId: this.memberTrueList[index].memberTrueid
                            }),
                            headers: {
                                'token': this.GLOBAL.token.token
                            }
                        })
                        .then(function (response) {
                            temp.isDisable = true;
                            Vue.set(that.memberTrueList,index, temp);
                            that.$message({
                                message: '禁用成功',
                                type: 'success'
                            })
                        })
                        .catch(function (error) {
                            temp.isDisable = false;
                            that.$set(that.memberTrueList,index, temp)
                            that.$message({
                                message: '操作失败',
                                type: 'error'
                            })
                        });
                    })
                    .catch(() => {
                        temp.isDisable = false;
                        Vue.set(that.userList,index, temp)
                    });
            }
            else{
                this.$confirm('确定要再次启用该协会会员吗？', '提示', {
                    type: 'warning'
                })
                    .then(()=>{
                        this.$axios({
                            method: 'post',
                            url: this.GLOBAL.baseURL + '/user-server/member/ableMemberTrue',
                            data: this.qs.stringify({
                                memberId: that.memberTrueList[index].memberTrueid
                            }),
                            headers: {
                                'token': this.GLOBAL.token.token
                            }
                        })
                        .then(function (response) {
                            temp.isDisable = false;
                            Vue.set(that.memberTrueList,index, temp)
                            that.$message({
                                message: '启用成功',
                                type: 'success'
                            })
                        })
                        .catch(function (error) {
                            temp.isDisable = true;
                            that.$set(that.memberTrueList,index, temp);
                            that.$message({
                                message: '操作失败',
                                type: 'error'
                            })
                        });
                })
            }
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
