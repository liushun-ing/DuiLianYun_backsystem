<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 对联库管理 </el-breadcrumb-item>
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
                <div style="float: right">
                    <el-button type="success" @click="downloadVisible = true" size="small">根据时间导出对联</el-button>
                </div>
                    <div style="float: right; margin-right: 10px;">
                                      <download-excel class="export-excel-wrapper" :fetch="getGoodList" :fields="json_fields" :header="header_good" :name="name_good">
                        <el-button type="success">导出所有优秀作品</el-button>
                    </download-excel>
                </div>
            </div>
            <el-table :data="coupletList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="coupletTitle" min-width="200" label="楹联标题" align="center"></el-table-column>
                <el-table-column min-width="100" label="是否优秀" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isGood === '0'" type="info">否</el-tag>
                        <el-tag v-else type="danger">是</el-tag>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" label="楹联作者" align="center">
                    <template slot-scope="scope">
                        <div @click="showIntroduction(scope.$index, scope.row)">{{ scope.row.coupletAuthorName }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="coupletFirstLine" min-width="300" label="楹联上联" align="center"></el-table-column>
                <el-table-column prop="coupletSecondLine" min-width="300" label="楹联下联" align="center"></el-table-column>
                <el-table-column prop="coupletCreateTime" min-width="160" label="入库时间" align="center" sortable></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.$index, scope.row)"
                            >修改</el-button
                        >
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                        <el-button
                            v-if="whetherShow(scope.$index, scope.row)"
                            type="text"
                            icon="el-icon-s-promotion"
                            class="orange"
                            @click="handleRecommend(scope.$index, scope.row)"
                            >推荐</el-button
                        >
                        <el-button v-if="scope.row.isGood === '0'" type="text" icon="el-icon-star-on" style="color: lightgreen" @click="handleSetGood(scope.$index, scope.row)"
                            >设为优秀作品</el-button
                        >
                                                <el-button v-if="scope.row.isGood === '1'" type="text" icon="el-icon-star-on" style="color: grey" @click="handlecancelGood(scope.$index, scope.row)"
                            >取消优秀作品</el-button
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="40%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="90px">
                <el-form-item label="楹联Id" prop="coupletId">
                    <el-input v-model="editForm.coupletId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="楹联标题" prop="coupletTitle">
                    <el-input v-model="editForm.coupletTitle"></el-input>
                </el-form-item>
                <el-form-item label="楹联类型" prop="coupletTypeId">
                  <el-select v-model="editForm.coupletTypeId" placeholder="请选择类型">
                      <el-option
                          v-for="item in allType"
                          :key="item.coupletTypeId"
                          :label="item.coupletTypeDetail"
                          :value="item.coupletTypeId"
                      ></el-option>
                  </el-select>                  
                </el-form-item>
                <el-form-item label="楹联上联" prop="coupletFirstLine">
                    <el-input type="textarea" autosize v-model="editForm.coupletFirstLine"></el-input>
                </el-form-item>
                <el-form-item label="楹联下联" prop="coupletSecondLine">
                    <el-input type="textarea" autosize v-model="editForm.coupletSecondLine"></el-input>
                </el-form-item>
                <el-form-item label="楹联赏析" prop="coupletAppreaciation">
                    <el-input type="textarea" autosize v-model="editForm.coupletAppreaciation"></el-input>
                </el-form-item>
                <el-form-item label="楹联注释" prop="coupletExplanation">
                    <el-input type="textarea" autosize v-model="editForm.coupletExplanation"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="推荐" :visible.sync="recommendVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <el-form ref="recommendForm" :model="recommendForm" :rules="rules" label-width="120px">
                <el-form-item label="楹联标题" prop="coupletTitle">
                    <el-input v-model="recommendForm.coupletTitle" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="推荐开始时间" prop="coupletRecommendStartDate">
                    <el-date-picker
                        v-model="recommendForm.coupletRecommendStartDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择开始推荐时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="推荐结束时间" prop="coupletRecommendEndDate">
                    <el-date-picker
                        v-model="recommendForm.coupletRecommendEndDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束推荐时间"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRecommend">取 消</el-button>
                <el-button type="primary" @click="saveRecommend('recommendForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="下载对联" :visible.sync="downloadVisible" width="30%" :show-close="false" :close-on-click-modal="false">
            <div style="margin-bottom: 20px">将下载以下时间范围内的对联:</div>
            <el-form ref="downloadForm" :model="downloadForm" :rules="rules" label-width="80px">
                <el-form-item label="起始时间" prop="coupletDownloadStartDate">
                    <el-date-picker
                        v-model="downloadForm.coupletDownloadStartDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="起始时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="终止时间" prop="coupletDownloadEndDate">
                    <el-date-picker
                        v-model="downloadForm.coupletDownloadEndDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="终止时间"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" style="display: flex; justify-content: space-around">
                <div>
                    <el-button @click="downloadVisible = false">取 消</el-button>
                </div>
                <div>
                    <download-excel class="export-excel-wrapper" :fetch="fetchData" :fields="json_fields" :header="header" :name="name">
                        <el-button type="success" @click="judgeForm">确 定</el-button>
                    </download-excel>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils';
export default {
    name: 'CoupletManage',
    data() {
        return {
            inputKey: '',
            coupletList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,
            allType: [],

            //导出excel
            downloadVisible: false,
            downloadForm: {
                coupletDownloadStartDate: '',
                coupletDownloadEndDate: ''
            },
            header: '中华对联库',
            name: '中华对联库',
                        header_good: '中华对联库优秀作品',
            name_good: '中华对联库优秀作品',
            json_fields: {
                楹联标题: 'coupletTitle',
                楹联作者: 'coupletAuthorName',
                楹联上联: 'coupletFirstLine',
                楹联下联: 'coupletSecondLine',
                入库时间: 'coupletCreateTime',
                楹联注释: 'coupletExplanation',
                楹联赏析: 'coupletAppreaciation',
                作者简介: 'coupletAuthorIntroduction'
            },
            json_meta: [
                [
                    {
                        ' key ': ' charset ',
                        ' value ': ' utf- 8 '
                    }
                ]
            ],

            // 编辑
            editForm: {},
            editIndex: -1,
            editVisible: false,
            // 推荐
            recommendForm: {},
            recommendIndex: -1,
            recommendVisible: false,
            rules: {
                coupletTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                coupletTypeId: [{ required: true, message: '请选择类型', trigger: 'blur' }],
                coupletFirstLine: [{ required: true, message: '请输入上联', trigger: 'blur' }],
                coupletSecondLine: [{ required: true, message: '请输入下联', trigger: 'blur' }],
                coupletAppreaciation: [{ required: true, message: '请输入赏析', trigger: 'blur' }],
                coupletExplanation: [{ required: true, message: '请输入注释', trigger: 'blur' }],
                coupletRecommendStartDate: [{ required: true, message: '请选择推荐开始时间', trigger: 'blur' }],
                coupletRecommendEndDate: [{ required: true, message: '请选择推荐结束时间', trigger: 'blur' }],
                coupletDownloadStartDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
                coupletDownloadEndDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
            }
        };
    },

    activated() {
        this.currentPage = 1;
        this.inputKey = '';
        this.getCoupletList();
    },

    methods: {
        // 从后端获取整个类型，保存起来
        async getAllType() {
            try {
                const res = await this.$api.couplet.getCoupletTypeList();
                this.allType = this.sortByCoupletTypeId(res.coupletTypeList);
            } catch (error) {
                this.$message({
                    message: '获取类型失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 根据id排序
        sortByCoupletTypeId(array) {
            return array.sort(function (a, b) {
                var id1 = a.coupletTypeId;
                var id2 = b.coupletTypeId;
                return id1 < id2 ? -1 : id1 > id2 ? 1 : 0;
            });
        },

        async getCoupletList() {
            let params = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                inputKey: this.inputKey
            };
            try {
                const res = await this.$api.couplet.getCoupletList(params);
                this.coupletList = res.coupletList;
                this.total = res.total;
            } catch (error) {
                this.$message({
                    message: '获取楹联列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        // 是否显示推荐
        whetherShow(index, row) {
            if (!row.coupletRecommendStartDate) {
                return true;
            } else {
                let start = new Date(row.coupletRecommendStartDate).getTime();
                let end = new Date(row.coupletRecommendEndDate).getTime();
                let now = new Date().getTime();
                if (now > start && now < end) {
                    return false;
                } else {
                    return true;
                }
            }
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.inputKey = '';
            this.currentPage = 1;
            this.getCoupletList();
            messageObject.close();
        },

        // 触发搜索按钮
        handleSearch() {
            this.currentPage = 1;
            this.getCoupletList();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getCoupletList();
        },

        handlePagePrev() {
            this.currentPage--;
        },

        handlePageNext() {
            this.currentPage++;
        },

        async showIntroduction(index, row) {
            let params = {
                authorId: row.coupletAuthorId
            };
            try {
                const res = await this.$api.couplet.getAuthorIntroduction(params);
                this.$alert(res.masterIntroduction ? res.masterIntroduction : '未查询到简介', '作者简介', {
                    confirmButtonText: '确定'
                });
            } catch (error) {
                this.$message({
                    message: '获取简介失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        handleSetGood(index, row) {
            this.$confirm('该楹联将设置为优秀作品，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(async () => {
                    let params = {
                        coupletId: row.coupletId
                    };
                    try {
                        await this.$api.couplet.setGood(params);
                        this.$message({
                            message: '设置成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.coupletList[index], 'isGood', '1');
                    } catch (error) {
                        this.$message({
                            message: '设置失败',
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

        handlecancelGood(index, row) {
            this.$confirm('该楹联将取消优秀作品，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(async () => {
                    let params = {
                        coupletId: row.coupletId
                    };
                    try {
                        await this.$api.couplet.cancelGood(params);
                        this.$message({
                            message: '取消成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.coupletList[index], 'isGood', '0');
                    } catch (error) {
                        this.$message({
                            message: '取消失败',
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

        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            let sendNotice = row.coupletDynasty == '当代';
            let userId = row.coupletAuthorId;
            let title = row.coupletTitle;
            this.$confirm('该楹联将永久删除，确定要继续吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
                .then(async () => {
                    let params = {
                        coupletId: row.coupletId
                    };
                    try {
                        await this.$api.couplet.deleteCouplet(params);
                        this.$message({
                            message: '删除成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.getCoupletList();
                        if (sendNotice) {
                            setTimeout(() => {
                                utils.sendNotice(userId, 8, title);
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
                })
                .catch(() => {
                    this.$message({
                        message: '操作已取消',
                        duration: 1500,
                        type: 'info'
                    });
                });
        },

        // 编辑操作
        handleEdit(index, row) {
            this.editIndex = index;
            // 为了保证修改这个表单时，不会同步修改原有的数据
            this.editForm = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
            this.getAllType();
        },

        // 取消编辑
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

        // 提交修改
        saveEdit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.editVisible = false;
                    let params = {
                        coupletId: this.editForm.coupletId,
                        coupletTypeId: this.editForm.coupletTypeId,
                        coupletTitle: this.editForm.coupletTitle,
                        coupletFirstLine: this.editForm.coupletFirstLine,
                        coupletSecondLine: this.editForm.coupletSecondLine,
                        coupletAppreaciation: this.editForm.coupletAppreaciation,
                        coupletExplanation: this.editForm.coupletExplanation
                    };
                    try {
                        await this.$api.couplet.modifyCouplet(params);
                        this.$set(this.coupletList, this.editIndex, this.editForm);
                        this.$message({
                            message: '修改成功',
                            duration: 2000,
                            type: 'success'
                        });
                    } catch (error) {
                        this.$message({
                            message: '修改失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('修改楹联表单验证失败');
                    return false;
                }
            });
        },

        // 处理推荐
        handleRecommend(index, row) {
            this.recommendVisible = true;
            this.recommendIndex = index;
            this.recommendForm = JSON.parse(JSON.stringify(row));
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
                if (valid) {
                    let params = {
                        coupletId: this.recommendForm.coupletId,
                        coupletRecommendStartDate: this.recommendForm.coupletRecommendStartDate,
                        coupletRecommendEndDate: this.recommendForm.coupletRecommendEndDate
                    };
                    if (!utils.compareRecommendDate(params.coupletRecommendStartDate, params.coupletRecommendEndDate)) {
                        return false;
                    }
                    this.recommendVisible = false;
                    try {
                        await this.$api.couplet.recommendCouplet(params);
                        this.$message({
                            message: '推荐成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.coupletList, this.recommendIndex, this.recommendForm);
                    } catch (error) {
                        this.$message({
                            message: '推荐失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    console.log('推荐楹联表单验证失败');
                    return false;
                }
            });
        },

        judgeForm() {
            this.$refs['downloadForm'].validate(async (valid) => {
                if (valid) {
                    this.downloadVisible = false;
                } else {
                    return false;
                }
            });
        },
        //导出excel前获取数据
        async fetchData() {
            let returnList = [];
            if (!this.downloadForm.coupletDownloadStartDate || !this.downloadForm.coupletDownloadEndDate) {
                return returnList;
            }
            let params = {
                coupletRecommendStartDate: this.downloadForm.coupletDownloadStartDate,
                coupletRecommendEndDate: this.downloadForm.coupletDownloadEndDate
            };
            this.downloadVisible = false;
            // console.log(params);
            try {
                const res = await this.$api.couplet.getCoupletChosen(params);
                if (res.total == 0) {
                    this.$message({
                        type: 'warning',
                        message: '该时间段没有对联',
                        duration: 2000
                    });
                }
                returnList = res.coupletList;
            } catch (error) {
                this.$message({
                    message: '获取对联失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
            // console.log(returnList);
            return returnList;
        },

        async getGoodList() {
            try {
                const res = await this.$api.couplet.getGoodList();
                if (res.total == 0) {
                    this.$message({
                        type: 'warning',
                        message: '还未设置优秀作品',
                        duration: 2000
                    });
                }
                return res.goodList;
            } catch (error) {
                this.$message({
                    message: '获取优秀作品失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
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
</style>
