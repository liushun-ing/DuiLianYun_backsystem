<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 楹联类型管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="类型名或ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="coupletTypeList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="coupletTypeId" label="ID" width="280" align="center"></el-table-column>
                <el-table-column prop="coupletType" label="类型名"></el-table-column>
                <el-table-column prop="coupletTypeCreateTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-form-item label="Id">
                    <el-input v-model="form.coupletTypeId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="类型名称" prop="coupletType">
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
                <el-form-item label="类型名称" prop="coupletType">
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
            coupletTypeList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllTypeList',
            form: {},
            idx: -1,
            id: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            rules: {
                coupletType:[
                    {required: true, message: '请输入楹联类型', trigger: 'blur'}
                ]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        sortByTime(array){
            return array.sort(function(a,b){
                var time1 = a.coupletTypeCreateTime;
                var time2 = b.coupletTypeCreateTime;
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            })
        },
        getData() {
            this.$axios.get(this.GLOBAL.baseURL + '/couplet-server/couplet/type',{
                headers: {
                    'token': this.GLOBAL.token.token
                }
            }).then((response) => {
                this.allData = this.sortByTime(response.data);
                console.log(this.allData)
                this.pageTotal = this.allData.length;
                this.getList();
            })
        },
        getList() {
            var that = this;
            if(this.searchContent == ''){
                this.coupletTypeList = this.allData.filter((item, index) =>
                    index < this.currentPage * 10 && index >= 10 * (this.currentPage - 1)
                );
                this.pageTotal = this.allData.length;
            }
            else {
                let list = this.allData.filter((item, index) =>
                    item.coupletType.includes(this.searchContent));
                let list2 = this.allData.filter(function(item) {
                    return item.coupletTypeId == that.searchContent
                });
                list = list.concat(list2);
                this.coupletTypeList = list.filter((item, index) =>
                    index < this.currentPage * 10 && index >= 10 * (this.currentPage - 1)
                );
                this.pageTotal = this.coupletTypeList.length;
            }
            
        },
        //触发刷新
        handleRefresh() {
            this.currentPage = 1;
            this.searchContent = '';
            this.getData();
        },
        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getList();
        },
        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
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
                coupletType: ''
            };
        },
        add() {
            this.addVisible = false;
            var that = this;
            console.log(this.addForm)
            this.$axios({
                        method: 'post',
                        url: this.GLOBAL.baseURL + '/couplet-server/couplet/addCoupletType/' + this.addForm.coupletType,
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
                        url: this.GLOBAL.baseURL + '/couplet-server/couplet/updateCoupletType',
                        data: this.form,
                        headers: {
                            'token': this.GLOBAL.token.token
                        }
                    })
                    .then(function (response) {
                        that.$set(that.coupletTypeList, that.idx, that.form);
                        that.$set(that.allData, (that.currentPage-1)*10 + that.idx, that.form);
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
