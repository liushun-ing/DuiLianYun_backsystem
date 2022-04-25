<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 楹联家推荐管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="楹联家名字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="masterList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="masterName" min-width="150" label="楹联家名字" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" min-width="140" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.masterPhoto"
                            :preview-src-list="[scope.row.masterPhoto]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="简介" align="center" min-width="300">
                    <template slot-scope="scope">
                        <div class="master_wrap">{{scope.row.masterIntroduction}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="masterRecommendStartDate" width="160" label="推荐开始时间" align="center" sortable></el-table-column>
                <el-table-column prop="masterRecommendEndDate" width="160" label="推荐结束时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="handleEditRecommend(scope.$index, scope.row)"
                        >修改时间</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleCancelRecommend(scope.$index, scope.row)"
                        >取消推荐</el-button>
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

        <el-dialog title="修改推荐" :visible.sync="recommendVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="recommendForm" :model="recommendForm" :rules="rules" label-width="120px">
                <el-form-item label="楹联家名字" prop="masterName">
                    <el-input v-model="recommendForm.masterName" :disabled="true"></el-input>
                </el-form-item>               
                <el-form-item label="推荐开始时间" prop="masterRecommendStartDate">
                    <el-date-picker
                        v-model="recommendForm.masterRecommendStartDate"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择开始推荐时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="推荐结束时间" prop="masterRecommendEndDate">
                    <el-date-picker
                        v-model="recommendForm.masterRecommendEndDate"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束推荐时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEditRecommend">取 消</el-button>
                <el-button type="primary" @click="saveEditRecommend('recommendForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'MasterRecommend',
    data() {
        return {
            inputKey: '',
            masterList: [],

            currentPage: 1,
            pageSize: 10,
            total: 0,

            recommendIndex: -1,
            recommendVisible: false,
            recommendForm: {},
            rules: {
                masterRecommendStartDate:[
                    {required: true, message: '请选择推荐开始时间', trigger: 'blur'}
                ],
                masterRecommendEndDate:[
                    {required: true, message: '请选择推荐结束时间', trigger: 'blur'}
                ],   
            }
        };
    },
    activated() {
        this.inputKey = '';
        this.currentPage = 1;
        this.getMasterRecommendList();
    },
    methods: {
        async getMasterRecommendList() {
            let params = {
                inputKey: this.inputKey,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            try {
                const res = await this.$api.recommend.getMasterRecommendList(params);
                this.total = res.total;
                this.masterList = res.masterList;
            } catch (error) {
                this.$message({
                    message: '获取楹联家推荐列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getMasterRecommendList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getMasterRecommendList()
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getMasterRecommendList();
        },

        handlePagePrev(){
            this.currentPage--;
        },

        handlePageNext(){
            this.currentPage++;
        },
      
        handleCancelRecommend(index, row) {
            this.$confirm('该楹联家将不在首页推荐展示，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let params = {
                    masterId: row.masterId
                }
                try {
                    await this.$api.recommend.cancelRecommendMaster(params);
                    this.$message({
                        message: '取消推荐成功',
                        duration: 2000,
                        type: 'success'
                    });
                    this.getMasterRecommendList();
                } catch (error) {
                    this.$message({
                        message: '取消推荐失败',
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

        cancelEditRecommend() {
            this.recommendVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.recommendForm = {};
            this.$refs['recommendForm'].clearValidate();
        },

        handleEditRecommend(index, row) {
            this.recommendVisible = true;
            this.recommendIndex = index;
            this.recommendForm = JSON.parse(JSON.stringify(row));
        },

        saveEditRecommend(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let params = {
                        masterId: this.recommendForm.masterId,
                        masterRecommendStartDate: this.recommendForm.masterRecommendStartDate,
                        masterRecommendEndDate: this.recommendForm.masterRecommendEndDate
                    }
                    if(!utils.compareRecommendDate(params.masterRecommendStartDate, params.masterRecommendEndDate)){
                        return false;
                    }
                    this.recommendVisible = false;
                    try {
                        await this.$api.couplet.recommendMaster(params);
                        this.$message({
                            message: '修改推荐成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.masterList, this.recommendIndex, this.recommendForm);
                    } catch (error) {
                        this.$message({
                            message: '修改推荐失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改推荐楹联家表单验证失败');
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

.orange {
    color: orange;
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
    color: yellowgreen;
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}
.avatar {
    width: 150px;
    height: 150px;
    display: block;
}
.master_wrap {
    overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
/* .master_wrap:hover {
    display: block;
} */
</style>
