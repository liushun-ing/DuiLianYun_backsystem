<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 对联课堂管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="标题/简介关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建</el-button>
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
                <!-- <el-table-column prop="createTime" width="160" label="创建时间" align="center" sortable></el-table-column> -->
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="50%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="120px">
                <el-form-item label="课堂资料标题" prop="coupletClassTitle">
                    <el-input v-model="editForm.coupletClassTitle"></el-input>
                </el-form-item>
                <el-form-item label="课堂资料链接" prop="coupletClassSrc">
                    <el-input type="textarea" autosize v-model="editForm.coupletClassSrc"></el-input>
                </el-form-item>
                <!-- <el-form-item label="课堂资料简介" prop="coupletClassDescription">
                    <el-input type="textarea" autosize v-model="editForm.coupletClassDescription"></el-input>
                </el-form-item> -->
                <el-form-item label="课堂资料封面图最优宽高2:1" prop="coupletClassImage">
                    <el-upload
                        ref="upload"
                        class="cc-avatar-uploader"
                        action="uploadUrl"
                        :show-file-list="false"
                        :limit="1"
                        :http-request="uploadPicture"
                        :before-upload="beforeAvatarUpload">
                        <el-image v-if="editForm.coupletClassImage" :src="editForm.coupletClassImage" fit="contain" class="cc-avatar"></el-image>
                        <i v-else class="el-icon-plus cc-avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible" width="50%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
                <el-form-item label="课堂资料标题" prop="coupletClassTitle">
                    <el-input v-model="addForm.coupletClassTitle"></el-input>
                </el-form-item>
                <el-form-item label="课堂资料公众号文章链接" prop="coupletClassSrc">
                    <el-input type="textarea" autosize v-model="addForm.coupletClassSrc"></el-input>
                </el-form-item>
                <!-- <el-form-item label="课堂资料简介" prop="coupletClassDescription">
                    <el-input type="textarea" autosize v-model="addForm.coupletClassDescription"></el-input>
                </el-form-item> -->
                <el-form-item label="课堂资料封面图最优宽高2:1" prop="coupletClassImage">
                    <el-upload
                        ref="upload"
                        class="cc-avatar-uploader"
                        action="uploadUrl"
                        :show-file-list="false"
                        :limit="1"
                        :http-request="uploadPicture_add"
                        :before-upload="beforeAvatarUpload">
                        <el-image v-if="addForm.coupletClassImage" :src="addForm.coupletClassImage" fit="contain" class="cc-avatar"></el-image>
                        <i v-else class="el-icon-plus cc-avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="推荐" :visible.sync="recommendVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="recommendForm" :model="recommendForm" :rules="rules" label-width="120px">
                <el-form-item label="课堂资料标题" prop="coupletClassTitle">
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
                <el-button @click="cancelRecommend">取 消</el-button>
                <el-button type="primary" @click="saveRecommend('recommendForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js';
export default {
    name: 'CoupletClassManage',
    data() {
        return {
            inputKey: '',
            coupletClassList: [],

            pageSize: 10,
            currentPage: 1,
            total: 0,

            editForm: {},
            editIndex: -1,
            editVisible: false,

            addForm: {
                coupletClassTitle: '',
                coupletClassDescription: '暂无',
                coupletClassSrc: '',
                coupletClassImage: '',
            },
            addVisible: false,

            recommendVisible: false,
            recommendIndex: -1,
            recommendForm: {},

            whetherChange: false,

            rules: {
                coupletClassTitle:[
                    {required: true, message: '请输入资料标题', trigger: 'blur'}
                ],
                // coupletClassDescription:[
                //     {required: true, message: '请输入资料简介', trigger: 'blur'}
                // ],
                coupletClassSrc: [
                    {required: true, message: '请输入公众号文章链接', trigger: 'blur'}
                ],
                coupletClassImage: [
                    {required: true, message: '请选择图片', trigger: 'blur'}
                ]
            },
        };
    },
    activated() {
        this.inputKey = '';
        this.currentPage = 1;
        this.getCoupletClassList();
    },
    methods: {

        async getCoupletClassList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.document.getCoupletClassList(params);
                this.coupletClassList = res.coupletClassList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取课堂资料列表失败',
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
            this.getCoupletClassList();
            messageObject.close();
        },
        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getCoupletClassList();
        },
        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getCoupletClassList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },

        async deletePhoto(coupletClassImage) {
            let params = {
                url: coupletClassImage
            }
            try {
                await this.$api.document.deletePicture(params);
                console.log("课堂资料原有图片删除成功");
            } catch (error) {
                console.log("课堂资料原有图片删除失败");
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
                this.$set(this.editForm, 'coupletClassImage', data.url);
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

        async uploadPicture_add(file) {
            try {
                const data = await utils.uploadFile('/file-server/document/back/uploadPicture', file.file);
                this.$set(this.addForm, 'coupletClassImage', data.url);
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
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
                    coupletClassId: row.coupletClassId
                };
                try {
                    await this.$api.document.deleteCoupletClass(params);
                    this.$message({
                        message: '删除资料成功',
                        duration: 2000,
                        type: 'success'
                    });
                    params = {
                        url: row.coupletClassImage
                    };
                    try {
                        await this.$api.document.deletePicture(params);
                        console.log('资料图片删除成功');
                    } catch (error) {
                        console.log('资料图片删除失败');  
                        console.log(error);                  
                    }
                    this.getCoupletClassList();
                } catch (error) {
                    this.$message({
                        message: '删除资料失败',
                        duration: 2000,
                        type: 'error'
                    });
                    console.log(error);
                }
                this.getCoupletClassList();
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

        cancelAdd() {
            this.addVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['addForm'].clearValidate();
        },

        handleAdd(index, row) {
            this.addVisible = true;
        },

        // 编辑操作
        handleEdit(index, row) {
            this.editIndex = index;
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editForm.coupletClassDescription = '暂无',
            this.editVisible = true;
        },
        saveEdit (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let coupletClassImage = this.coupletClassList[this.editIndex].coupletClassImage;
                    this.editVisible = false;
                    let params = {
                        coupletClassId: this.editForm.coupletClassId,
                        coupletClassTitle: this.editForm.coupletClassTitle,
                        coupletClassSrc: this.editForm.coupletClassSrc,
                        coupletClassImage: this.editForm.coupletClassImage,
                        coupletClassDescription: this.editForm.coupletClassDescription
                    };
                    try {
                        await this.$api.document.modifyCoupletClass(params);
                        this.$message({
                            message: '修改课堂资料成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.coupletClassList, this.editIndex, this.editForm);
                        if(this.whetherChange) {
                            this.deletePhoto(coupletClassImage);
                        }
                    } catch (error) {
                        this.$message({
                            message: '修改课堂资料失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改课堂资料表单验证失败');
                    return false;
                }
            });
        },
        saveAdd (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    this.addVisible = false;
                    try {
                        await this.$api.document.addCoupletClass(this.addForm);
                        this.$message({
                            message: '增加课堂资料成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.reset();
                        this.currentPage = 1;
                        this.getCoupletClassList();
                    } catch (error) {
                        this.$message({
                            message: '增加课堂资料失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('增加课堂资料表单验证失败');
                    return false;
                }
            });
        },

        reset() {
            this.addForm = {
                coupletClassImage: '',
                coupletClassSrc: '',
                coupletClassDescription: '',
                coupletClassTitle: ''
            }
            this.$refs['addForm'].clearValidate();
        },

        //点击推荐事件
        handleRecommend(index, row) {
            this.recommendVisible = true;
            this.recommendIndex = index;
            this.recommendForm = JSON.parse(JSON.stringify(row));
        },

        // 是否显示推荐
        whetherShow(index, row) {
            if(!row.coupletRecommendStartDate) {
                // 还没有推荐过
                return true;
            } else {
                let start = new Date(row.coupletRecommendStartDate).getTime();
                let end = new Date(row.coupletRecommendEndDate).getTime();
                let now = new Date().getTime();
                // 推荐时间过期了，或者还没有到推荐时间
                if(now > start && now < end) {
                    return false;
                } else {
                    return true;
                }
            }
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

        saveRecommend(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let params = {
                        coupletClassId: this.recommendForm.coupletClassId,
                        coupletRecommendStartDate: this.recommendForm.coupletRecommendStartDate,
                        coupletRecommendEndDate: this.recommendForm.coupletRecommendEndDate
                    }
                    if(!utils.compareRecommendDate(params.coupletRecommendStartDate, params.coupletRecommendEndDate)){
                        return false;
                    }
                    this.recommendVisible = false;
                    try {
                        await this.$api.document.recommendCoupletClass(params);
                        this.$message({
                            message: '推荐成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.coupletClassList, this.recommendIndex, this.recommendForm);
                    } catch (error) {
                        this.$message({
                            message: '推荐失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('推荐对联课堂表单验证失败');
                    return false;
                }
            });
        },
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
.orange {
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
.cc-avatar-uploader .el-upload{
    width: 300px;
    height: 150px;
}
.cc-avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.cc-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}
.cc-avatar {
    height: 100%;
    display: block;
}
</style>
