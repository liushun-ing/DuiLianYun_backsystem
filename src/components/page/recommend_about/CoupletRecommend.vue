0<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 楹联推荐管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="输入关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="coupletList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="楹联标题" align="center" min-width="200">
                    <template slot-scope="scope">
                        <div class="couplet_wrap">{{scope.row.coupletTitle}}</div>
                    </template>  
                </el-table-column>
                <el-table-column prop="coupletAuthorName" min-width="100" label="楹联作者" align="center"></el-table-column>
                <el-table-column label="楹联上联" align="center" min-width="300">
                    <template slot-scope="scope">
                        <div class="couplet_wrap">{{scope.row.coupletFirstLine}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="楹联下联" align="center" min-width="300">
                    <template slot-scope="scope">
                        <div class="couplet_wrap">{{scope.row.coupletSecondLine}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="coupletRecommendStartDate" width="160" label="推荐开始时间" align="center" sortable></el-table-column>
                <el-table-column prop="coupletRecommendEndDate" width="160" label="推荐结束时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
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
                <el-form-item label="楹联标题" prop="coupletTitle">
                    <el-input v-model="recommendForm.coupletTitle" :disabled="true"></el-input>
                </el-form-item>               
                <el-form-item label="推荐开始时间" prop="coupletRecommendStartDate">
                    <el-date-picker
                        v-model="recommendForm.coupletRecommendStartDate"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择开始推荐时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="推荐结束时间" prop="coupletRecommendEndDate">
                    <el-date-picker
                        v-model="recommendForm.coupletRecommendEndDate"
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
    name: 'CoupletRecommend',
    data() {
        return {
            inputKey: '',
            coupletList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,

            // 推荐
            recommendForm: {},
            recommendIndex: -1,
            recommendVisible: false,
            rules: {
                coupletRecommendStartDate:[
                    {required: true, message: '请选择推荐开始时间', trigger: 'blur'}
                ],
                coupletRecommendEndDate:[
                    {required: true, message: '请选择推荐结束时间', trigger: 'blur'}
                ],
            }
        };
    },

    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getCoupletRecommendList();
    },

    methods: {
        async getCoupletRecommendList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.recommend.getCoupletRecommendList(params);
                this.coupletList = res.coupletList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取楹联推荐列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.inputKey = '';
            this.currentPage = 1;
            this.getCoupletRecommendList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getCoupletRecommendList();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getCoupletRecommendList();
        },

        handlePagePrev(){
            this.currentPage--;
        },

        handlePageNext(){
            this.currentPage++;
        },

        handleCancelRecommend(index, row) {
            this.$confirm('该楹联将不在首页推荐展示，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let params = {
                    coupletId: row.coupletId
                };
                try {
                    await this.$api.recommend.cancelRecommendCouplet(params);
                    this.$message({
                        message: '取消推荐成功',
                        duration: 2000,
                        type: 'success'
                    });
                    this.getCoupletRecommendList();
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

        // 处理推荐
        handleEditRecommend(index, row) {
            this.recommendVisible = true;
            this.recommendIndex = index;
            this.recommendForm = JSON.parse(JSON.stringify(row));
        },

        cancelEditRecommend() {
            this.recommendVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.recommendForm = {};
        },

        saveEditRecommend(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let params = {
                        coupletId: this.recommendForm.coupletId,
                        coupletRecommendStartDate: this.recommendForm.coupletRecommendStartDate,
                        coupletRecommendEndDate: this.recommendForm.coupletRecommendEndDate
                    }
                    if(!utils.compareRecommendDate(params.coupletRecommendStartDate, params.coupletRecommendEndDate)){
                        return false;
                    }
                    this.recommendVisible = false;
                    try {
                        // 沿用couplet的推荐函数
                        await this.$api.couplet.recommendCouplet(params);
                        this.$message({
                            message: '修改推荐成功',
                            duration: 2000,
                            type: 'success'
                        });
                        
                        this.$set(this.coupletList, this.recommendIndex, this.recommendForm);
                    } catch (error) {
                        this.$message({
                            message: '修改推荐失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改推荐楹联表单验证失败');
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
.orange{
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
.couplet_wrap {
    overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
/* .couplet_wrap:hover {
    display: block;
} */
</style>
