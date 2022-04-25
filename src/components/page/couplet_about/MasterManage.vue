<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 楹联家管理
                </el-breadcrumb-item>          
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="inputKey" placeholder="楹联家名字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增古代楹联家</el-button>
            </div>
            <el-table
                :data="masterList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="masterName" min-width="100" label="楹联家名字" align="center"></el-table-column>
                <el-table-column prop="masterDynasty" min-width="80" label="朝代" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" min-width="130" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.masterPhoto"
                            :preview-src-list="[scope.row.masterPhoto]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="masterIntroduction" min-width="300" label="简介" align="center"></el-table-column>
                <el-table-column prop="masterCreateTime" width="160" label="创建的时间" align="center" sortable></el-table-column>
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
                        <el-button
                            type="text"
                            icon="el-icon-circle-plus"
                            class="green"
                            @click="handleAddCouplet(scope.$index, scope.row)"
                        >为他/她新增楹联</el-button>
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
                <el-form-item label="楹联家姓名" prop="masterName">
                    <el-input v-model="editForm.masterName"></el-input>
                </el-form-item>
                <el-form-item label="楹联家朝代">
                    <el-input v-model="editForm.masterDynasty" disabled></el-input>
                </el-form-item>                
                <el-form-item label="楹联家简介" prop="masterIntroduction">
                    <el-input type="textarea" autosize v-model="editForm.masterIntroduction"></el-input>
                </el-form-item>
                <el-form-item label="楹联家头像最优宽高1:1" prop="masterPhoto">
                    <el-upload
                        ref="upload"
                        class="m-avatar-uploader"
                        action="uploadUrl"
                        :show-file-list="false"
                        :limit="1"
                        :http-request="uploadPicture"
                        :before-upload="beforeAvatarUpload">
                        <el-image v-if="editForm.masterPhoto" :src="editForm.masterPhoto" fit="contain" class="m-avatar"></el-image>
                        <i v-else class="el-icon-plus m-avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible"  width="40%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
                <el-form-item label="楹联家姓名" prop="masterName">
                    <el-input v-model="addForm.masterName"></el-input>
                </el-form-item>
                <el-form-item label="楹联家朝代" prop="masterDynasty">
                    <el-input v-model="addForm.masterDynasty"></el-input>
                </el-form-item>
                <el-form-item label="楹联家简介" prop="masterIntroduction">
                    <el-input type="textarea" autosize v-model="addForm.masterIntroduction"></el-input>
                </el-form-item>
                <el-form-item label="楹联家头像最优宽高1:1" prop="masterPhoto">
                    <el-upload
                        ref="upload"
                        class="m-avatar-uploader"
                        action="uploadUrl"
                        :show-file-list="false"
                        :limit="1"
                        :http-request="uploadPicture_add"
                        :before-upload="beforeAvatarUpload">
                        <el-image v-if="addForm.masterPhoto" :src="addForm.masterPhoto" fit="contain" class="m-avatar"></el-image>
                        <i v-else class="el-icon-plus m-avatar-uploader-icon"></i>
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
                <el-button @click="cancelRecommend">取 消</el-button>
                <el-button type="primary" @click="saveRecommend('recommendForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js'
export default {
    name: 'MasterManage',
    data() {
        var validateDynasty = (rules, value, callback) => {
            if(!value) {
                callback(new Error('请输入楹联家朝代'));
            } else if(value == '当代' || value == '现代') {
                callback(new Error('当/现代楹联家只能从用户中设置'));
            } else {
                callback();
            }
        };

        return {
            inputKey: '',
            masterList: [],
            coupletTypeList: [],

            currentPage: 1,
            pageSize: 10,
            total: 0,

            whetherChange: false,

            editIndex: -1,
            recommendIndex: -1,
            editVisible: false,
            addVisible: false,
            recommendVisible: false,
            editForm: {},
            addForm: {},
            recommendForm: {},

            rules: {
                masterName:[
                    {required: true, message: '请输入楹联家姓名', trigger: 'blur'}
                ],
                masterIntroduction:[
                    {required: true, message: '请输入楹联家简介', trigger: 'blur'}
                ],
                masterPhoto:[
                    {required: true, message: '请选择楹联家头像', trigger: 'blur'}
                ],
                masterDynasty:[
                    {required: true, validator: validateDynasty, trigger: 'blur'}
                ],
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
        this.getMasterList();
    },
    methods: {
        async getMasterList() {
            let params = {
                inputKey: this.inputKey,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            try {
                const res = await this.$api.couplet.getMasterList(params);
                this.total = res.total;
                this.masterList = res.masterList;
            } catch (error) {
                this.$message({
                    message: '获取楹联家失败',
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
            this.getMasterList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getMasterList()
        },

        // 是否显示推荐
        whetherShow(index, row) {
            if(!row.masterRecommendStartDate) {
                // 还没有推荐过
                return true;
            } else {
                let start = new Date(row.masterRecommendStartDate).getTime();
                let end = new Date(row.masterRecommendEndDate).getTime();
                let now = new Date().getTime();
                // 推荐时间过期了，或者还没有到推荐时间
                if(now > start && now < end) {
                    return false;
                } else {
                    return true;
                }
            }
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getMasterList();
        },

        handlePagePrev(){
            this.currentPage--;
        },

        handlePageNext(){
            this.currentPage++;
        },

        async uploadPicture_add(file) {
            try {
                const data = await utils.uploadFile('/couplet-server/master/back/uploadPhoto', file.file);
                this.$set(this.addForm, 'masterPhoto', data.url);
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

        async uploadPicture(file) {
            try {
                const data = await utils.uploadFile('/couplet-server/master/back/uploadPhoto', file.file);
                this.$set(this.editForm, 'masterPhoto', data.url);
                this.$message({
                    message: '图片上传成功',
                    duration: 2000,
                    type: 'success'
                });
                this.whetherChange = true;
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

        // 删除头像
        async deletePhoto() {
            let params = {
                url: this.masterList[this.editIndex].masterPhoto
            }
            try {
                await this.$api.couplet.deletePhoto(params);
                console.log(this.masterList[this.editIndex].masterName + "的原有图片删除成功");
            } catch (error) {
                console.log(this.masterList[this.editIndex].masterName + "的原有图片删除失败");
                console.log(error);
            }
        },

        // 上传前判断
        beforeAvatarUpload(file) {
            const isJPGOrPNG = (file.type === 'image/jpeg' || file.type === 'image/png');
            if (!isJPGOrPNG) {
                this.$message.error('上传封面图片只能是 JPG或者PNG 格式!');
            }
            else{
                this.$message({
                    message: '上传中',
                    duration: 1000,
                    type: 'info'
                });
            }
            return isJPGOrPNG;
        },

        handleEdit(index, row) {
            this.editIndex = index;
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
            this.whetherChange = false;
        },

        cancelEdit() {
            this.editVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.editForm = {};
            this.$refs['editForm'].clearValidate();
        },

        handleDelete(index, row) {
            let whetherSendNotice = row.masterBindedUserId;
            this.$confirm('该楹联家将永久删除，确定要继续吗？\r\n 删除后，将会自动通知用户结果', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                let masterPhoto = row.masterPhoto;
                let masterBindedUserId = row.masterBindedUserId;
                let params;
                if(row.masterBindedUserId) {
                    params = {
                        masterId: row.masterId,
                        coupletAuthorId: row.masterBindedUserId,
                        userId: row.masterBindedUserId
                    };
                } else {
                    params = {
                        masterId: row.masterId,
                        coupletAuthorId: row.masterId,
                        userId: ''
                    };                    
                }
                try {
                    await this.$api.couplet.deleteMaster(params);
                    this.$message({
                        message: '删除成功',
                        duration: 2000,
                        type: 'success'
                    });
                    // 只有古代楹联家的头像需要删掉
                    if(masterPhoto && !masterBindedUserId) {
                        let params = {
                            url: masterPhoto
                        };
                        try {
                            await await this.$api.couplet.deletePhoto(params);
                            console.log('删除楹联家头像图片成功');
                        } catch (error) {
                            console.log('删除楹联家头像图片失败');
                        }
                    }
                    this.getMasterList();
                    if(whetherSendNotice) {
                        setTimeout(() => {
                            utils.sendNotice(whetherSendNotice, 6);
                        }, 1000);
                    }
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

        handleAdd() {
            this.addVisible = true;
            this.addForm = {
                masterIntroduction: '',
                masterName: '',
                masterDynasty: '',
                masterPhoto: ''
            };
        },

        cancelAdd() {
            this.addVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.addForm = {};
            this.$refs['addForm'].clearValidate();
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

        async handleAddCouplet(index, row) {
            if(row.masterBindedUserId) {
                this.$router.push({
                    name: 'CoupletAdd',
                    query: {
                        coupletAuthorId: row.masterBindedUserId,
                        coupletAuthorName: row.masterName,
                        coupletDynasty: '当代'
                    }
                });             
            } else {
                this.$router.push({
                    name: 'CoupletAdd',
                    query: {
                        coupletAuthorId: row.masterId,
                        coupletAuthorName: row.masterName,
                        coupletDynasty: row.masterDynasty
                    }
                });                        
            }
        },

        saveAdd(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    this.addVisible = false;
                    try {
                        await this.$api.couplet.addMaster(this.addForm);
                        this.$message({
                            message: '添加成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.getMasterList();
                    } catch (error) {
                        this.$message({
                            message: '添加失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('增加楹联家表单验证失败');
                    return false;
                }
            });
        },

        saveEdit (formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    this.editVisible = false;
                    let params = {
                        masterId: this.editForm.masterId,
                        masterName: this.editForm.masterName,
                        masterIntroduction: this.editForm.masterIntroduction,
                        masterPhoto: this.editForm.masterPhoto
                    };
                    try {
                        await this.$api.couplet.modifyMaster(params);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.masterList, this.editIndex, this.editForm);
                        if (this.whetherChange) {
                            this.deletePhoto();
                        }
                    } catch (error) {
                        this.$message({
                            message: '修改失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改楹联家表单验证失败');
                    return false;
                }
            });
        },

        saveRecommend(formName) {
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
                            message: '推荐成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.masterList, this.recommendIndex, this.recommendForm);
                    } catch (error) {
                        this.$message({
                            message: '推荐失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('推荐楹联家表单验证失败');
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
.m-avatar-uploader .el-upload {
    width: 150px;
    height: 150px;
    overflow: hidden;
}
.m-avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.m-avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}
.m-avatar {
    height: 100%;
    border: none;
}
</style>
