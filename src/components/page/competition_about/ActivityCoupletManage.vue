<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 活动作品评选
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="输入活动名称关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="eventList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="eventId" label="活动ID"></el-table-column>
                <el-table-column prop="eventName" label="活动名称"></el-table-column>
                <el-table-column prop="eventIntroduce" label="活动简介"></el-table-column>
                <el-table-column prop="eventDateFrom" width="100" label="开始时间"></el-table-column>
                <el-table-column prop="eventDateTo" width="100" label="结束时间"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="saveEdit(scope.$index, scope.row)"
                        >进入作品评选</el-button>
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
            allData: [],
            eventList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllEventList',
            form: {},
            idx: -1,
            id: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            rules: {
                eventName:[
                    {required: true, message: '请输入活动名称', trigger: 'blur'}
                ],
                eventIntroduce:[
                    {required: true, message: '请输入活动简介', trigger: 'blur'}
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
            if(this.currentMode == 'AllEventList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/event/getEndEventNum',{
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
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/event/getEndEventNumBySearch',{
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
            if(this.currentMode == 'AllEventList'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/event/getEndEvent',{
                    params: {
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    this.eventList = response.data;
                })
            }
            else if(this.currentMode == 'Search'){
                this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/event/getEndEventBySearch',{
                    params: {
                        searchContent: this.searchContent,
                        pageStart: (this.currentPage-1)*10
                    },
                    headers: {
                        'token': this.GLOBAL.token.token
                    }
                }).then((response) => {
                    if(response.data.length == 0){
                        this.eventList=[];
                    }
                    else{
                        this.eventList = response.data;
                    }

                })
            }
        },
        //触发刷新
        handleRefresh() {
            this.currentMode = 'AllEventList';
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
        saveEdit (index, row) {
            this.editVisible = false;
            var that = this;
            this.$confirm('确定要进入该活动作品评选吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: 'get',
                        url: this.GLOBAL.baseURL + '/couplet-server/couplet/setCurrentEventId?eventId=' + this.eventList[index].eventId,
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                        .then(function (response) {
                            that.getPage(false);
                            that.$router.replace('/OneActivityCoupletManage');
                            Utils.$emit('demo','msg');
                            that.$message({
                                message: '进入成功',
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
