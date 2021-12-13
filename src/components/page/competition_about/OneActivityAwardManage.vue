<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 单个活动获奖作品入库管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="输入关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="eventCoupletList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="userId" label="作者Id" width="280" align="center"></el-table-column>
                <el-table-column prop="authorName" label="作者名字" align="center"></el-table-column>
                <el-table-column prop="coupletTitle" label="作品标题" width="208" align="center"></el-table-column>
                <el-table-column prop="coupletUp" label="下联" width="320" align="center"></el-table-column>
                <el-table-column prop="coupletDown" label="下联" width="320" align="center"></el-table-column>
                <el-table-column label="获奖类型" width="80" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.award === 0">
                            <el-tag
                                type="success"
                                class="green"
                            >{{'特等奖'}}</el-tag>
                        </div>
                        <div v-if="scope.row.award === 1">
                            <el-tag
                                type="success"
                                class="orange"
                            >{{'一等奖'}}</el-tag>
                        </div>
                        <div v-if="scope.row.award === 2">
                            <el-tag
                                type="success"
                                class="orange"
                            >{{'二等奖'}}</el-tag>
                        </div>
                        <div v-if="scope.row.award === 3">
                            <el-tag
                                type="success"
                                class="orange"
                            >{{'三等奖'}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isAccess === null || scope.row.isAccess === false">
                            <el-button
                                type="text"
                                icon="el-icon-edit"
                                class="blue"
                                @click="handleWare(scope.$index, scope.row)"
                            >入库</el-button>
                        </div>
                        <div v-if="scope.row.isAccess === true">
                            <el-tag
                                :type="scope.row.isAccess===false?'danger':'success'"
                            >{{scope.row.isAccess===false?'未入库':'已入库'}}</el-tag>
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
import Utils from '../../../utils/utils.js';
export default {
    name: 'basetable',
    data() {
        return {
            searchContent: '',
            eventCoupletList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllEventCoupletList',
        };
    },
    created() {
        this.getPage(true);
    },
    mounted(){
        var that=this;
        Utils.$on('demo', function (msg) {
            console.log(msg);
            that.getPage(false);
        })
    },
    methods: {
        getPage(resetCurrentPage){
            if(this.currentMode == 'AllEventCoupletList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/getBeenAwardNumByEvent',{
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
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/getBeenAwardNumByEventAndSearch',{
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
            if(this.currentMode == 'AllEventCoupletList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/getBeenAwardByEvent',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.eventCoupletList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/getBeenAwardByEventAndSearch',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.eventCoupletList=[];
                    }
                    else{
                        this.eventCoupletList = response.data;
                    }

                })
            }
        },
        //触发刷新
        handleRefresh() {
            this.currentMode = 'AllEventCoupletList';
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
                        method: 'get',
                        url: this.GLOBAL.baseURL + '/couplet-server/couplet/deleteCoupletAward',
                        params:{
                            coupletAwardId: this.eventCoupletList[index].coupletAwardId
                        },
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
        handleWare(index, row) {
            var temp = this.eventCoupletList[index];
            var that = this;
            if(this.eventCoupletList[index].isAccess === false || this.eventCoupletList[index].isAccess === null){
                this.$confirm('确定要通过该作品入库吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$axios({
                            method: 'get',
                            url: this.GLOBAL.baseURL + '/couplet-server/couplet/coupletInWarehouse?',
                            params: {
                                coupletAwardId: this.eventCoupletList[index].coupletAwardId
                            },
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
                                temp.isAccess = true;
                                Vue.set(that.eventCoupletList,index, temp);
                                that.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            })
                            .catch(function (error) {
                                temp.isaAccess = false;
                                that.$set(that.eventCoupletList,index, temp)
                                that.$message({
                                    message: '操作失败',
                                    type: 'error'
                                })
                            });
                    })
                    .catch(() => {
                        temp.isAccess = false;
                        Vue.set(that.eventCoupletList,index, temp)
                    });
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
.orange {
    color: orange;
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
