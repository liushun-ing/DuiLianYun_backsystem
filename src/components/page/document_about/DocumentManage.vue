<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 资料管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="名称/简介关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建</el-button>
            </div>
            <el-table
                :data="documentList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="documentName" min-width="200" label="资料名称" align="center"></el-table-column>
                <el-table-column label="封面图(查看大图)" min-width="130" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.documentPicture"
                            :preview-src-list="[scope.row.documentPicture]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="documentIntroduction" min-width="300" label="资料简介" align="center"></el-table-column>
                <el-table-column prop="documentCreateTime" width="160" label="入库时间" align="center" sortable></el-table-column>
                <el-table-column prop="documentScore" min-width="100" label="评分" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-download"
                            class="green"
                            @click="handleDownload(scope.$index, scope.row)"
                        >查看/下载</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
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
                    :total="total"
                    @current-change="handlePageChange"
                    @prev-click="handlePagePrev"
                    @next-click="handlePageNext"
                ></el-pagination>
            </div>
        </div>

        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="90px">
                <el-form-item label="资料名称" prop="documentName">
                    <el-input v-model="editForm.documentName"></el-input>
                </el-form-item>
                <el-form-item label="资料简介" prop="documentIntroduction">
                    <el-input type="textarea" autosize v-model="editForm.documentIntroduction"></el-input>
                </el-form-item>
                <el-form-item label="资料封面图最优宽高3:4" prop="masterPhoto">
                    <el-upload
                        ref="upload"
                        class="do-avatar-uploader"
                        action="uploadUrl"
                        :show-file-list="false"
                        :limit="1"
                        :http-request="uploadPicture"
                        :before-upload="beforeAvatarUpload">
                        <el-image v-if="editForm.documentPicture" :src="editForm.documentPicture" fit="contain" class="do-avatar"></el-image>
                        <i v-else class="el-icon-plus do-avatar-uploader-icon"></i>
                    </el-upload>
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
    name: 'DocumentManage',
    data() {
        return {
            inputKey: '',
            documentList: [],

            pageSize: 10,
            currentPage: 1,
            total: 0,

            editForm: {},
            editIndex: -1,
            editVisible: false,

            whetherChange: false,

            rules: {
                documentName:[
                    {required: true, message: '请输入资料名', trigger: 'blur'}
                ],
                documentIntroduction:[
                    {required: true, message: '请输入资料简介', trigger: 'blur'}
                ],
                documentPicture: [
                    {required: true, message: '请选择图片', trigger: 'blur'}
                ]
            },
        };
    },
    activated() {
        this.inputKey = '';
        this.currentPage = 1;
        this.getDocumentList();
    },
    methods: {

        async getDocumentList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.document.getDocumentList(params);
                this.documentList = res.documentList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取资料列表失败',
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
            this.getDocumentList();
            messageObject.close();
        },
        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getDocumentList();
        },
        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getDocumentList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },

        async deletePhoto(documentPicture) {
            let params = {
                url: documentPicture
            }
            try {
                await this.$api.document.deletePicture(params);
                console.log("新闻原有图片删除成功");
            } catch (error) {
                console.log("新闻原有图片删除失败");
                console.log(error);
            }
        },

        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            if (!isJPG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
            }
            else{
                this.$message({
                    message: '上传中'
                })
            }
            return isJPG;
        },

        async uploadPicture(file) {
            try {
                const data = await utils.uploadFile('/file-server/document/back/uploadPicture', file.file);
                this.$set(this.editForm, 'documentPicture', data.url);
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
                this.whetherChange = true;
                this.$refs.upload.clearFiles();
            } catch (error) {
                this.$refs.upload.clearFiles();
                console.log(error);
                this.$message({
                    message: '图片上传失败',
                    duration: 2000,
                    type: 'error'
                });
            }
        },

        handleDelete(index, row) {
            this.$confirm('该资料将永久删除，确定要继续吗', '提示', {
                type: 'warning'
            }).then(async () => {
                let params = {
                    documentId: row.documentId
                };
                try {
                    await this.$api.document.deleteDocument(params);
                    this.$message({
                        message: '删除资料成功',
                        duration: 2000,
                        type: 'success'
                    });
                    // 资料删除成功才删除配套文件和封面图
                    params = {
                        fileId: row.documentFileId
                    }
                    try {
                        await this.$api.document.deleteFile(params);
                        console.log('资料配套文件删除成功');
                    } catch (error) {
                        console.log('资料配套文件删除失败');
                        console.log(error);
                    }
                    params = {
                        url: row.documentPicture
                    };
                    try {
                        await this.$api.document.deletePicture(params);
                        console.log('资料图片删除成功');
                    } catch (error) {
                        console.log('资料图片删除失败');  
                        console.log(error);                  
                    }
                    this.getDocumentList();
                } catch (error) {
                    this.$message({
                        message: '删除资料失败',
                        duration: 2000,
                        type: 'error'
                    });
                    console.log(error);
                }
                this.getDocumentList();
            }).catch(() => {
                this.$message({
                    message: '操作已取消',
                    duration: 1500,
                    type: 'info'
                });
            });

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

        // 编辑操作
        handleEdit(index, row) {
            this.editIndex = index;
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
        },
        saveEdit (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let documentPicture = this.documentList[this.editIndex].documentPicture;
                    this.editVisible = false;
                    let params = {
                        documentId: this.editForm.documentId,
                        documentName: this.editForm.documentName,
                        documentIntroduction: this.editForm.documentIntroduction
                    };
                    try {
                        await this.$api.document.modifyDocument(params);
                        this.$message({
                            message: '修改资料成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.documentList, this.editIndex, this.editForm);
                        if(this.whetherChange) {
                            this.deletePhoto(documentPicture);
                        }
                    } catch (error) {
                        this.$message({
                            message: '修改资料失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改资料表单验证失败');
                    return false;
                }
            });
        },

        async handleDownload(index, row) {
            let params = {
                fileId: row.documentFileId
            };
            try {
                const res = await this.$api.document.getFile(params);
                // 如果是文件地址，会自动下载
                window.open(res.filePath);
            } catch (error) {
                this.$message({
                    message: '获取相关文件失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        handleAdd() {
            this.$router.push({name: 'DocumentUpload'});
        }
    }
};
</script>

<style>
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
.green {
    color: green;
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
.do-avatar-uploader .el-upload{
    width: 160px;
    height: 200px;
}
.do-avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.do-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 200px;
    line-height: 200px;
    text-align: center;
}
.do-avatar {
    height: 100%;
    display: block;
}
</style>
