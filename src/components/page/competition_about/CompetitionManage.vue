<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 比赛管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="比赛名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="competitionList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="competitionName" min-width="200" label="比赛名称" align="center"></el-table-column>
                <!-- <el-table-column prop="competitionIntroduction" min-width="350" label="比赛简介" align="center"></el-table-column> -->
                <el-table-column prop="competitionStartDate" width="160" label="比赛开始时间" align="center" sortable></el-table-column>
                <el-table-column prop="competitionEndDate" width="160" label="比赛结束时间" align="center" sortable></el-table-column>
                <el-table-column prop="levyStartDate" width="160" label="投稿开始时间" align="center" sortable></el-table-column>
                <el-table-column prop="levyEndDate" width="160" label="投稿结束时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="150" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">查看/修改</el-button>
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="80%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px">
                <el-form-item label="活动名称" prop="competitionName">
                    <el-input v-model="editForm.competitionName"></el-input>
                </el-form-item>
                <el-form-item label="封面图片最优宽高2:1" prop="competitionImage">
                    <el-upload
                        ref="upload"
                        class="cm-avatar-uploader"
                        action="uploadURL"
                        :show-file-list="false"
                        :limit="1"
                        :http-request="uploadPicture"
                        :before-upload="beforeAvatarUpload"
                    >
                        <el-image
                            v-if="editForm.competitionImage"
                            :src="editForm.competitionImage"
                            class="cm-avatar"
                            fit="contain"
                        ></el-image>
                        <i v-else class="el-icon-plus cm-avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动简介" prop="competitionIntroduction">
                    <mavon-editor
                        v-model="editForm.competitionIntroduction"
                        :toolbars="toolbars"
                        :autofocus="false"
                        ref="md"
                        @imgAdd="$imgAdd"
                        @imgDel="$imgDel"
                    />
                    <!-- <el-input v-model="editForm.competitionIntroduction"></el-input> -->
                </el-form-item>
                <el-form-item label="比赛起止时间" required>
                    <el-col :span="11">
                        <el-form-item prop="competitionStartDate">
                            <el-date-picker
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择开始时间"
                                v-model="editForm.competitionStartDate"
                                style="width: 100%"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="competitionEndDate">
                            <el-date-picker
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择结束时间"
                                v-model="editForm.competitionEndDate"
                                style="width: 100%"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="投稿起止时间" required>
                    <el-col :span="11">
                        <el-form-item prop="levyStartDate">
                            <el-date-picker
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择开始时间"
                                v-model="editForm.levyStartDate"
                                style="width: 100%"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="levyStartDate">
                            <el-date-picker
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择结束时间"
                                v-model="editForm.levyEndDate"
                                style="width: 100%"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'CompetitionManage',
    data() {
        return {
            toolbars: utils.toolbars,
            inputKey: '',
            competitionList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,

            editForm: {},
            editIndex: -1,
            editVisible: false,

            rules: {
                competitionName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
                competitionIntroduction: [{ required: true, message: '请输入活动简介', trigger: 'blur' }],
                competitionStartDate: [{ required: true, message: '请选择比赛开始时间', trigger: 'blur' }],
                competitionEndDate: [{ required: true, message: '请选择比赛结束时间', trigger: 'blur' }],
                levyStartDate: [{ required: true, message: '请选择投稿开始时间', trigger: 'blur' }],
                levyEndDate: [{ required: true, message: '请选择投稿结束时间', trigger: 'blur' }]
            }
        };
    },
    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getCompetitionList();
    },
    methods: {
        // 绑定@imgAdd event
        async $imgAdd(pos, $file) {
            const isJPGOrPNG = $file.type === 'image/jpeg' || $file.type === 'image/png';
            if (!isJPGOrPNG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
            } else {
                this.$message({
                    message: '上传中',
                    duration: 1000,
                    type: 'info'
                });
            }
            if (!isJPGOrPNG) {
                return;
            }
            let messageObject = this.$message({
                message: '正在上传中...',
                type: 'info',
                duration: 0
            });
            try {
                // 第一步.将图片上传到服务器.
                const res = await utils.uploadFile('/post-server/manuscript/upload', $file);
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                this.$refs.md.$img2Url(pos, res.url);
                messageObject.close();
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
            } catch (error) {
                messageObject.close();
                this.$message({
                    message: '图片上传失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 删除markdown图片
        async $imgDel(pos, $file) {
            let params = {
                url: pos[0]
            };
            try {
                await this.$api.news.deleteImage(params);
                console.log('比赛简介内容图片删除成功');
            } catch (error) {
                console.log('比赛简介内容图片删除失败');
                console.log(error);
            }
        },

        async getCompetitionList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.competition.getCompetitionList(params);
                this.competitionList = res.competitionList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取比赛列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.inputKey = '';
            this.getCompetitionList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getCompetitionList();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getCompetitionList();
        },
        handlePagePrev() {
            this.currentPage--;
        },
        handlePageNext() {
            this.currentPage++;
        },

        handleDelete(index, row) {
            this.$confirm('该比赛将永久删除，确定要继续吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    let competitionImage = row.competitionImage;
                    let params = {
                        competitionId: row.competitionId
                    };
                    try {
                        await this.$api.competition.deleteCompetition(params);
                        this.$message({
                            message: '删除比赛成功',
                            duration: 2000,
                            type: 'success'
                        });
                        if (competitionImage) {
                            let params = {
                                url: competitionImage
                            };
                            try {
                                await this.$api.news.deleteImage(params);
                                console.log('删除比赛封面图片成功');
                            } catch (error) {
                                console.log('删除比赛封面图片失败');
                            }
                        }
                        this.getCompetitionList();
                    } catch (error) {
                        this.$message({
                            message: '删除失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                })
                .catch(() => {
                    this.$message({
                        message: '操作已取消',
                        duration: 1500,
                        type: 'info'
                    });
                });
        },

        async uploadPicture(file) {
            try {
                const data = await utils.uploadFile('/post-server/manuscript/upload', file.file);
                this.$set(this.editForm, 'competitionImage', data.url);
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
                this.$refs.upload.clearFiles();
            } catch (error) {
                console.log(error);
                this.$message({
                    message: '图片上传失败',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

        // 上传前判断
        beforeAvatarUpload(file) {
            const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJPGOrPNG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
            } else {
                this.$message({
                    message: '上传中',
                    duration: 1000,
                    type: 'info'
                });
            }
            return isJPGOrPNG;
        },

        // 编辑操作
        handleEdit(index, row) {
            this.editIndex = index;
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },
        cancelEdit() {
            this.editVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['editForm'].clearValidate();
        },
        saveEdit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let params = {
                        competitionId: this.editForm.competitionId,
                        competitionName: this.editForm.competitionName,
                        competitionImage: this.editForm.competitionImage,
                        competitionIntroduction: this.editForm.competitionIntroduction,
                        competitionStartDate: this.editForm.competitionStartDate,
                        competitionEndDate: this.editForm.competitionEndDate,
                        levyStartDate: this.editForm.levyStartDate,
                        levyEndDate: this.editForm.levyEndDate
                    };
                    if (
                        !utils.compareCompetitionDate(
                            params.competitionStartDate,
                            params.competitionEndDate,
                            params.levyStartDate,
                            params.levyEndDate
                        )
                    ) {
                        return false;
                    }
                    this.editVisible = false;
                    try {
                        await this.$api.competition.modifyCompetition(params);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.competitionList, this.editIndex, this.editForm);
                    } catch (error) {
                        this.$message({
                            message: '修改失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改比赛表单验证失败');
                    return false;
                }
            });
        },
        handleAdd() {
            this.$router.push({ name: 'CompetitionRelease' });
        }
    }
};
</script>

<style>
.cm-avatar-uploader .el-upload {
    width: 240px;
    height: 160px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.cm-avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.cm-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 160px;
    line-height: 160px;
    text-align: center;
}
.cm-avatar {
    height: 100%;
    display: block;
}

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
