0<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 对联课堂推荐管理
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
                :data="coupletClassList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="coupletClassTitle" min-width="200" label="课堂资料标题" align="center"></el-table-column>
                <el-table-column label="封面图(查看大图)" min-width="130" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.coupletClassImage"
                            :preview-src-list="[scope.row.coupletClassImage]"
                        ></el-image>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="coupletClassDescription" min-width="200" label="课堂资料简介" align="center"></el-table-column> -->
                <el-table-column min-width="200" label="课堂资料内容" align="center">
                    <template slot-scope="scope">
                        <el-link :href="scope.row.coupletClassSrc" type="primary" target="_blank">
                            <i class="el-icon-view"></i>课堂公众号链接</el-link>  
                    </template>
                </el-table-column>
                <el-table-column prop="coupletRecommendStartDate" width="160" label="推荐开始时间" align="center" sortable></el-table-column>
                <el-table-column prop="coupletRecommendEndDate" width="160" label="推荐结束时间" align="center" sortable></el-table-column>
                <!-- <el-table-column prop="createTime" width="160" label="创建时间" align="center" sortable></el-table-column> -->
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="handleEditRecommend(scope.$index, scope.row)"
                        >修改推荐时间</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleCancelRecommend(scope.$index, scope.row)"
                        >删除</el-button>
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
                    <el-input v-model="recommendForm.coupletClassTitle" :disabled="true"></el-input>
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
    name: 'CoupletClassRecommend',
    data() {
        return {
            inputKey: '',
            coupletClassList: [],
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
        this.getCoupletClassRecommendList();
    },

    methods: {
        async getCoupletClassRecommendList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.recommend.getCoupletClassRecommendList(params);
                this.coupletClassList = res.coupletClassList;
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
            this.getCoupletClassRecommendList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getCoupletClassRecommendList();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getCoupletClassRecommendList();
        },

        handlePagePrev(){
            this.currentPage--;
        },

        handlePageNext(){
            this.currentPage++;
        },

        handleCancelRecommend(index, row) {
            this.$confirm('该对联课堂将不在首页推荐展示，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let params = {
                    coupletClassId: row.coupletClassId
                };
                try {
                    await this.$api.recommend.cancelRecommendCoupletClass(params);
                    this.$message({
                        message: '取消推荐成功',
                        duration: 2000,
                        type: 'success'
                    });
                    this.getCoupletClassRecommendList();
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
                        coupletClassId: this.recommendForm.coupletClassId,
                        coupletRecommendStartDate: this.recommendForm.coupletRecommendStartDate,
                        coupletRecommendEndDate: this.recommendForm.coupletRecommendEndDate
                    }
                    if(!utils.compareRecommendDate(params.coupletClassRecommendStartDate, params.coupletClassRecommendEndDate)){
                        return false;
                    }
                    this.recommendVisible = false;
                    try {
                        await this.$api.document.recommendCoupletClass(params);
                        this.$message({
                            message: '修改推荐成功',
                            duration: 2000,
                            type: 'success'
                        });
                        
                        this.$set(this.coupletClassList, this.recommendIndex, this.recommendForm);
                    } catch (error) {
                        this.$message({
                            message: '修改推荐失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改推荐对联课堂表单验证失败');
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
