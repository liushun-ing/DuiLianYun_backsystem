<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 所有用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="昵称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="userList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <!-- <el-table-column prop="userId" label="用户ID" width="280" align="center"></el-table-column> -->
                <el-table-column prop="userNickname" label="昵称" align="center"></el-table-column>
                <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.userPortrait"
                            :preview-src-list="[scope.row.userPortrait]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.userIsdisable === false ? 'success' : 'danger'"
                        >{{scope.row.userIsdisable === false ? '正常' : '禁用'}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="userLoginTime" label="注册时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.userIsDisable === false">
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
                                @click="handlePromote(scope.$index, scope.row)"
                            >设为楹联家</el-button>
                        </div>
                        <div v-if="scope.row.userIsDisable === true">
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
                                @click="handlePromote(scope.$index, scope.row)"
                            >设为楹联家</el-button>
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
import Vue from 'vue';
export default {
    name: 'UserManage',
    data() {
        return {
            searchContent: '',
            userList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllUserList'
        };
    },
    created() {
        this.getPage(true);
    },
    methods: {
        getPage(resetCurrentPage){
            if(this.currentMode == 'AllUserList'){
                this.getData();
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/user/getUserNum',{
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                })
                    .then((response) => {
                        this.pageTotal = response.data;
                        if(resetCurrentPage === true){
                            this.currentPage = 1;
                        }               
                        
                })

            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/user/getSearchNum',{
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
            if(this.currentMode == 'AllUserList'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/user/getUserInformation',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.userList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/user-server/user/adminSearch',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.userList=[];
                    }
                    else{
                        this.userList = response.data;
                    }
                    
                })
            }
        },
        //触发刷新
        handleRefresh() {
            this.currentMode = 'AllUserList';
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
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/user-server/user/deleteUser',
                        data: this.qs.stringify({
                            userId: this.userList[index].userId
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
        handleDisable(index, row) {
            var temp = this.userList[index];
            var that = this;
            if(this.userList[index].userIsdisable === false){
                this.$confirm('确定要禁用该用户吗？', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/user-server/user/disableUser',
                        data: this.qs.stringify({
                            userId: this.userList[index].userId
                        }),
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                    .then(function (response) {
                        temp.userIsdisable = true;
                        Vue.set(that.userList,index, temp);
                        that.$message({
                            message: '禁用成功',
                            type: 'success'
                        })
                    })
                    .catch(function (error) {
                        temp.userIsdisable = false;
                        that.$set(that.userList,index, temp)
                        that.$message({
                            message: '操作失败',
                            type: 'error'
                        })
                    });
                })
                .catch(() => {
                    temp.userIsdisable = false;
                    Vue.set(that.userList,index, temp)
                });
            }
            else{
                this.$confirm('确定要再次启用该用户吗？', '提示', {
                    type: 'warning'
                })
                    .then(()=>{
                        this.$axios({
                            method: 'post',
                            url: this.GLOBAL.baseURL + '/user-server/user/ableUser',
                            data: this.qs.stringify({
                                userId: that.userList[index].userId
                            }),
                            headers: {
                                'token': this.GLOBAL.token.token
                            }
                        })
                            .then(function (response) {
                                temp.userIsdisable = false;
                                Vue.set(that.userList,index, temp)
                                that.$message({
                                    message: '启用成功',
                                    type: 'success'
                                })
                            })
                            .catch(function (error) {
                                temp.userIsdisable = true;
                                that.$set(that.userList,index, temp);
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
