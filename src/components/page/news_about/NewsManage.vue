<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 新闻管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="标题/编辑人关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                :data="newsList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="newsTitle" label="新闻标题" min-width="280" align="center"></el-table-column>
                <el-table-column prop="newsEditor" label="编辑人" min-width="150" align="center"></el-table-column>
                <el-table-column prop="newsImage" label="封面图" min-width="150" align="center">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.newsImage">暂无图片</div>
                        <el-image
                            v-else
                            class="table-td-thumb"
                            :src="scope.row.newsImage"
                            :preview-src-list="[scope.row.newsImage]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="newsCreateTime" label="发布时间" width="160" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="250" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            class="green"
                            @click="handleView(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button
                            v-if="whetherShow(scope.$index, scope.row)"
                            type="text"
                            icon="el-icon-s-promotion"
                            class="orange"
                            @click="handleRecommend(scope.$index, scope.row)"
                        >推荐</el-button>
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

        <el-dialog title="推荐" :visible.sync="recommendVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="recommendForm" :model="recommendForm" :rules="rules" label-width="120px">
                <el-form-item label="新闻标题" prop="newsTitle">
                    <el-input v-model="recommendForm.newsTitle" :disabled="true"></el-input>
                </el-form-item>               
                <el-form-item label="推荐开始时间" prop="newsRecommendStartTime">
                    <el-date-picker
                        v-model="recommendForm.newsRecommendStartTime"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择开始推荐时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="推荐结束时间" prop="newsRecommendEndTime">
                    <el-date-picker
                        v-model="recommendForm.newsRecommendEndTime"
                        type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束推荐时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRecommend">取 消</el-button>
                <el-button type="primary" @click="saveRecommend('recommendForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'NewsManage',
    data() {
        return {
            inputKey: '',
            newsList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,

            recommendIndex: -1,
            recommendForm: {},
            recommendVisible: false,

            rules: {
                newsRecommendStartTime:[
                    {required: true, message: '请选择推荐开始时间', trigger: 'blur'}
                ],
                newsRecommendEndTime:[
                    {required: true, message: '请选择推荐结束时间', trigger: 'blur'}
                ],  
            }
        };
    },
    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getNewsList();
    },
    methods: {
        async getNewsList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.news.getNewsList(params);
                this.newsList = res.newsList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取新闻列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 是否显示推荐
        whetherShow(index, row) {
            if(!row.newsRecommendStartTime) {
                return true;
            } else {
                let start = new Date(row.newsRecommendStartTime).getTime();
                let end = new Date(row.newsRecommendEndTime).getTime();
                let now = new Date().getTime();
                if(now > start && now < end) {
                    return false;
                } else {
                    return true;
                }
            }
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getNewsList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getNewsList();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getNewsList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },
        // 查看
        handleView(index, row) {
            this.$router.push({name: 'NewsView', params: {newsId: row.newsId}}); // 只能用 name
        },
        // 编辑
        handleEdit(index, row) {
            this.$router.push({name: 'NewsEdit', query: {newsId: row.newsId}});
        },

        handleDelete(index, row) {
            this.$confirm('该新闻将永久删除，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                let newsImage = row.newsImage;
                let params = {
                    newsId: row.newsId
                };
                try {
                    await this.$api.news.deleteNews(params);
                    this.$message({
                        message: '删除成功',
                        duration: 2000,
                        type: 'success'
                    });
                    if(newsImage) {
                        params = {
                            url: newsImage
                        }
                        try {
                            await this.$api.news.deleteImage(params);
                            console.log('删除新闻封面图片成功');
                        } catch (error) {
                            console.log('删除新闻封面图片失败');
                        }
                    }
                    this.getNewsList();
                } catch (error) {
                    this.$message({
                        message: '删除失败',
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
            });
        },

        cancelRecommend() {
            this.recommendVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.recommendForm = {};
            this.$refs['recommendForm'].clearValidate();
        },

        handleRecommend(index, row) {
            this.recommendVisible = true;
            this.recommendIndex = index;
            this.recommendForm = JSON.parse(JSON.stringify(row));
        },

        saveRecommend(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let params = {
                        newsId: this.recommendForm.newsId,
                        newsRecommendStartTime: this.recommendForm.newsRecommendStartTime,
                        newsRecommendEndTime: this.recommendForm.newsRecommendEndTime
                    }
                    if(!utils.compareRecommendDate(params.newsRecommendStartTime, params.newsRecommendEndTime)){
                        return false;
                    }
                    this.recommendVisible = false;
                    try {
                        await this.$api.news.recommendNews(params);
                        this.$message({
                            message: '推荐成功',
                            duration: 2000,
                            type: 'success'
                        });
                        // 更新状态
                        this.$set(this.newsList, this.recommendIndex, this.recommendForm);
                    } catch (error) {
                        this.$message({
                            message: '推荐失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('推荐新闻表单验证失败');
                    return false;
                }
            });
        },
        handleAdd() {
            this.$router.push({name: 'NewsRelease'});
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
.green {
    color: green;
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
