<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 帖子管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input
                    @keyup.enter.native="handleSearch"
                    v-model="inputKey"
                    placeholder="输入关键词"
                    class="handle-input mr10"
                ></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-s-flag" @click="handleViewAll">标记此页已读</el-button>
                <el-button type="warning" icon="el-icon-upload2" @click="handleAddManyToCouplet">将所选入库</el-button>
            </div>
            <el-table
                :data="postList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column align="center" min-width="100" label="是否已读">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.postStatus == 0" type="danger">未读</el-tag>
                        <el-tag v-else type="info">已读</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="postTitle" label="帖子标题" min-width="200" align="center"></el-table-column>
                <el-table-column prop="postUserName" label="帖子作者" min-width="100" align="center"></el-table-column>
                <el-table-column prop="postFirstLine" label="帖子上联" min-width="300" align="center"></el-table-column>
                <el-table-column prop="postSecondLine" label="帖子下联" min-width="300" align="center"></el-table-column>
                <el-table-column prop="postCreateTime" width="160" label="创作时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            style="color: orange"
                            v-if="postList[scope.$index].postStatus !== '2'"
                            type="text"
                            icon="el-icon-upload2"
                            @click="handleAddToCouplet(scope.$index, scope.row)"
                            >加入楹联库</el-button
                        >
                        <el-button style="color: rgb(144, 147, 153)" v-else disabled type="text" icon="el-icon-upload2"
                            >已在楹联库</el-button
                        >
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
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
        <el-dialog title="提示" :visible.sync="addToCoupletVisible" width="45%" :show-close="false" :close-on-click-modal="false">
            <div style="font-size: 18px; font-weight: 600; padding-bottom: 30px">该帖子将加入楹联库，确定要继续吗？</div>
            <el-checkbox v-model="isSendNotice">是否自动发送如下通知</el-checkbox>
            <el-descriptions :column="1" style="padding-top: 10px" border>
                <el-descriptions-item label="通知标题">{{ noticeForm.noticeTitle }}</el-descriptions-item>
                <el-descriptions-item label="通知内容">{{ noticeForm.noticeContent }}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddToCouplet">取 消</el-button>
                <el-button type="primary" @click="saveAddToCouplet">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'PostManage',
    data() {
        return {
            inputKey: '',
            postList: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,

            noticeForm: '',

            // 多选项数组
            multipleSelection: [],

            addToCoupletIndex: -1,
            addToCoupletForm: {},
            addToCoupletVisible: false,
            isSendNotice: true
        };
    },
    activated() {
        this.noticeForm = utils.getNoticeTemplate(1);
        this.inputKey = '';
        this.currentPage = 1;
        this.getPostList();
    },
    methods: {
        async getPostList() {
            let params = {
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.post.getPostList(params);
                this.postList = res.postList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取帖子列表失败',
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
            this.getPostList();
            messageObject.close();
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
        handlePagePrev() {
            this.currentPage--;
        },

        // 下一页
        handlePageNext() {
            this.currentPage++;
        },

        // 删除帖子
        handleDelete(index, row) {
            let sendNotice = row.postUserId;
            let postTitle = row.postTitle;
            this.$confirm('该帖子将永远删除，确定要继续吗？\r\n删除后将会自动发送一条删除通知给用户', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(async () => {
                    let params = {
                        postId: row.postId
                    };
                    try {
                        await this.$api.post.deletePost(params);
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                        // 重新获取该页数据
                        this.getPostList();
                        setTimeout(() => {
                            utils.sendNotice(sendNotice, 7, postTitle);
                        }, 1000);
                    } catch (error) {
                        this.$message({
                            message: '删除失败',
                            type: 'error',
                            duration: 2000
                        });
                        console.log(error);
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '操作已取消',
                        type: 'info',
                        duration: 1500
                    });
                });
        },

        cancelAddToCouplet() {
            this.addToCoupletVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['addToCoupletForm'].clearValidate();
        },

        handleAddToCouplet(index, row) {
            this.addToCoupletVisible = true;
            this.addToCoupletForm = JSON.parse(JSON.stringify(row));
            this.addToCoupletIndex = index;
            this.noticeForm.setPostTitle(this.addToCoupletForm.postTitle);
            this.isSendNotice = true;
        },

        async saveAddToCouplet() {
            this.addToCoupletVisible = false;
            let params = {
                coupletId: this.addToCoupletForm.postId, // 这里取名是为了方便后端接收，本来应该是postId,让后端去修改post表的数据
                coupletTitle: this.addToCoupletForm.postTitle,
                coupletFirstLine: this.addToCoupletForm.postFirstLine,
                coupletSecondLine: this.addToCoupletForm.postSecondLine,
                coupletAuthorId: this.addToCoupletForm.postUserId,
                coupletAuthorName: this.addToCoupletForm.postUserName,
                coupletDynasty: '当代',
                coupletTypeId: this.addToCoupletForm.postTypeId,
                coupletFrom: '创作',
                coupletAppreaciation: this.addToCoupletForm.postAppreaciation,
                coupletExplanation: this.addToCoupletForm.postExplanation
            };
            try {
                await this.$api.post.addToCouplet(params);
                this.$message({
                    message: '入库成功',
                    type: 'success',
                    duration: 2000
                });
                // 将加入楹联家图标去掉
                this.postList[this.addToCoupletIndex].postStatus = '2';
                if (this.isSendNotice) {
                    setTimeout(() => {
                        utils.sendNotice(this.addToCoupletForm.postUserId, 1, this.addToCoupletForm.postTitle);
                    }, 1000);
                }
            } catch (error) {
                this.$message({
                    message: '入库失败',
                    type: 'error',
                    duration: 2000
                });
                console.log(error);
            }
        },

        async handleViewAll() {
            let postViewList = [];
            this.postList.forEach((item, index) => {
                postViewList.push(item.postId);
            });
            let params = {
                postViewList: postViewList
            };
            try {
                await this.$api.post.viewAll(params);
                this.$message({
                    message: '标记已读成功',
                    duration: 2000,
                    type: 'success'
                });
                this.postList.forEach((item, index) => {
                    if (item.postStatus == 0) {
                        this.$set(this.postList[index], 'postStatus', '1');
                    }
                });
            } catch (error) {
                console.log(error);
                this.$message({
                    message: '标记已读失败',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleAddManyToCouplet() {
            this.$confirm('确定将所选帖子加入对联库吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(async () => {
                    let params = [];
                    this.multipleSelection.forEach((item) => {
                        if (item.postStatus !== '2') {
                            let param = {
                                coupletId: item.postId,
                                coupletTitle: item.postTitle,
                                coupletFirstLine: item.postFirstLine,
                                coupletSecondLine: item.postSecondLine,
                                coupletAuthorId: item.postUserId,
                                coupletAuthorName: item.postUserName,
                                coupletDynasty: '当代',
                                coupletTypeId: item.postTypeId,
                                coupletFrom: '创作',
                                coupletAppreaciation: item.postAppreaciation,
                                coupletExplanation: item.postExplanation
                            };
                            params.push(param);
                        }
                    });
                    try {
                        // let req = {
                        //     postArray: params
                        // };
                        await this.$api.post.addManyToCouplet(params);
                        this.$message({
                            message: '入库成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.multipleSelection.forEach((item, index) => {
                            if (item.postStatus !== '2') {
                                this.$set(this.postList[index], 'postStatus', '2');
                            }
                        });
                    } catch (error) {
                        this.$message({
                            message: '入库失败',
                            type: 'error',
                            duration: 2000
                        });
                        console.log(error);
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '操作已取消',
                        type: 'info',
                        duration: 1500
                    });
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
