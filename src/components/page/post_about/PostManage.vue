<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 帖子管理
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
                :data="postList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="postTitle" width="200" label="帖子标题" align="center"></el-table-column>
                <el-table-column prop="postFirstLine" label="帖子上联" align="center"></el-table-column>
                <el-table-column prop="postSecondLine" label="帖子下联" align="center"></el-table-column>
                <el-table-column prop="postUserName" label="帖子作者" align="center"></el-table-column>
                <el-table-column prop="postCreateTime" width="100" label="创作时间" align="center"></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
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
export default {
    name: 'PostManage',
    data() {
        return {
            inputKey: '',
            postList: [
                {
                    postId: '1',
                    postTitle: '哩吧啦',
                    postCreateTime: '2021-10-10 21:20:45'
                }
            ],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
        };
    },
    created() {
        this.getPostList();
    },
    methods: {
        async getPostList() {
            let params = {
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                inputKey: this.inputKey
            }
            try {
                const res = await this.$api.post.getPostList(params); 
                this.post = res.postList;
                this.pageTotal = Math.ceil(res.total / this.pageSize);
            } catch (error) {
                this.$message({
                    message: '获取帖子列表失败',
                    duration: 2000
                });
                console.log(error);
            }
        },
   
        // 触发刷新
        handleRefresh() {
            this.currentPage = 1;
            this.inputKey = '';
            this.getPostList();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getPostList();
        },

        // 页数改变触发
        handlePageChange(val) {
            this.currentPage = val;
            this.getPostList();
        },

        // 上一页
        handlePagePrev(){
            this.currentPage--;
        },

        // 下一页
        handlePageNext(){
            this.currentPage++;
        },

        // 删除帖子
        handleDelete(index, row) {
            this.$confirm('该帖子将永远删除，确定要继续吗', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let params = {
                    postId: this.postList[index].postId,
                }
                try {
                    await this.$api.post.deletePost(params);
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                    // 重新获取该页数据
                    this.getPostList();
                } catch (error) {
                    this.$message({
                        message: '删除失败',
                        type: 'error',
                        duration: 2000
                    });
                    console.log(error);
                }
            }).catch((error) => {
                this.$message({
                    message: '删除失败',
                    type: 'error',
                    duration: 2000
                });
                console.log(error);
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
