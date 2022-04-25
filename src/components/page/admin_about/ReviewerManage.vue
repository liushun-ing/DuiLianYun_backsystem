<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 评审人员管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                请选择比赛场次:&nbsp;
                <el-select v-model="selectedCompetitionId" placeholder="请选择比赛" @change="changeCompetitionOptions">
                    <el-option
                        v-for="item in competitionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-tabs type="border-card" tabPosition="left" class="tabs_wrap">
                    <el-tab-pane label="一审人员">
                        <div v-if="!isSet">
                            <div class="tabs_content">
                                <div class="left">
                                    <div class="left_title">添加一审人员</div>
                                    <div class="common_style">
                                        请选择评审账号:&nbsp;
                                        <el-select v-model="selectedAdminId" placeholder="请选择账号" style="width: 200px">
                                            <el-option
                                                v-for="item in adminOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="common_style">
                                        请输入评审数量:&nbsp;
                                        <el-input-number v-model="manuNumber" :step="step" style="width: 200px"></el-input-number>
                                    </div>
                                    <div class="common_style">
                                        剩余的投稿数量:&nbsp;
                                        <el-tag size="medium">{{manuTotal}}</el-tag>
                                    </div>
                                    <div style="text-align: right; padding-top: 58px;">
                                        <el-button type="primary" @click="add">添 加</el-button>
                                    </div>
                                </div>
                                <div class="right">
                                    <div class="right_title">已选一审人员</div>
                                    <el-table :data="selectedReviewer" style="width: 100%" size="mini" height="200px">
                                        <el-table-column prop="adminName" label="账号">
                                        </el-table-column>
                                        <el-table-column prop="manuNumber" label="评审数量">
                                        </el-table-column>
                                        <el-table-column prop="manuNumber" label="操作">
                                            <template slot-scope="scope">
                                                <el-button type="success" size="mini" @click="cancel(scope.row, scope.$index)">撤 回</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div style="text-align: right; padding-top: 10px;">
                                        <el-button type="primary" @click="submit">提 交</el-button>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                        <div v-else>
                            <div class="right_title">一审人员信息</div>
                            <el-table :data="selectedReviewer" style="width: 100%" height="200px">
                                <el-table-column prop="adminName" label="账号">
                                </el-table-column>
                                <el-table-column prop="manuNumber" label="评审数量">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="二审人员">
                        <div v-if="!isSet_1">
                            <div class="tabs_content">
                                <div class="left">
                                    <div class="left_title">添加二审人员</div>
                                    <div class="common_style">
                                        请选择评审账号:&nbsp;
                                        <el-select v-model="selectedAdminId_1" placeholder="请选择账号" style="width: 200px">
                                            <el-option
                                                v-for="item in adminOptions_1"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="common_style">
                                        请输入评审数量:&nbsp;
                                        <el-input-number v-model="manuNumber_1" :step="step" style="width: 200px"></el-input-number>
                                    </div>
                                    <div class="common_style">
                                        剩余的投稿数量:&nbsp;
                                        <el-tag size="medium">{{manuTotal_1}}</el-tag>
                                    </div>
                                    <div style="text-align: right; padding-top: 58px;">
                                        <el-button type="primary" @click="add_1">添 加</el-button>
                                    </div>
                                </div>
                                <div class="right">
                                    <div class="right_title">已选二审人员</div>
                                    <el-table :data="selectedReviewer_1" style="width: 100%" size="mini" height="200px">
                                        <el-table-column prop="adminName" label="账号">
                                        </el-table-column>
                                        <el-table-column prop="manuNumber" label="评审数量">
                                        </el-table-column>
                                        <el-table-column prop="manuNumber" label="操作">
                                            <template slot-scope="scope">
                                                <el-button type="success" size="mini" @click="cancel_1(scope.row, scope.$index)">撤 回</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div style="text-align: right; padding-top: 10px;">
                                        <el-button type="primary" @click="submit_1">提 交</el-button>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                        <div v-else>
                            <div class="right_title">二审人员信息</div>
                            <el-table :data="selectedReviewer_1" style="width: 100%" height="200px">
                                <el-table-column prop="adminName" label="账号">
                                </el-table-column>
                                <el-table-column prop="manuNumber" label="评审数量">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ReviewerManage',
    data() {
        return {
            competitionList: [],
            adminList: [],
            selectedCompetitionId: '',

            step: 20,

            // 初评
            isSet: false,
            competitionOptions: [],
            adminOptions: [],
            selectedAdminId: '',
            manuNumber: 100,
            manuTotal: 0,
            selectedReviewer: [],

            // 复评
            isSet_1: false,
            competitionOptions_1: [],
            adminOptions_1: [],
            selectedAdminId_1: '',
            manuNumber_1: 100,
            manuTotal_1: 0,
            selectedReviewer_1: [],
        };
    },
    activated() {
        this.getCompetitionList();
        this.getAllAdmin();
    },
    methods: {
        sortByTime(array) {
            return array.sort(function(a, b) {
                var time1 = new Date(a.createTime).getTime();
                var time2 = new Date(b.createtime).getTime();
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            })
        },

        async getCompetitionList() {
            try {
                const res = await this.$api.competition.getAllCompetition();
                this.competitionList = this.sortByTime(res.competitionList);
                // 将数据转换为下拉框，value是比赛id,label是名称
                let options = [];
                this.competitionList.forEach((item, index) => {
                    options.push({
                        value: item.competitionId,
                        label: item.competitionName
                    });                    
                });
                this.competitionOptions = options;
            } catch (error) {
                this.$message({
                    message: '获取比赛列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        async getAllAdmin() {
            try {
                const res = await this.$api.admin.getAdminList();
                this.adminList = res.adminList;
                // 将数据转换为下拉框，value是adminId,label是名称
                let options = [];
                this.adminList.forEach((item, index) => {
                    options.push({
                        value: item.adminId,
                        label: item.adminName
                    });                    
                });
                this.adminOptions = options;
                this.adminOptions_1 = options;
            } catch (error) {
                this.$message({
                    message: '获取管理员列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }

        },

        // 选择比赛
        async changeCompetitionOptions(value) {
            if(value) {
                this.reset();
                // 获取比赛的总投稿数manuTotal，以及一审人员名单reviewerList1(manuscriptReviewerId, manuNumber)，二审人员名单reviewerList2(manuscriptRecheckId, manuNumber)
                let params = {
                    competitionId: value
                };
                try {
                    const res = await this.$api.admin.getReviewerList(params);
                    // 设置该比赛的评审信息
                    this.manuTotal = res.manuTotal;
                    this.manuTotal_1 = res.manuTotal;
                    // 如果不为空，则说明设置过了
                    if(res.data.reviewerList1 && res.data.reviewerList1.length != 0) {
                        this.isSet = true;
                        // 对结果进行转换
                        const tempReviewerList = [];
                        // 遍历数组
                        for(let i = 0; i< res.data.reviewerList1.length; i++) {
                            // 匹配下标
                            const index = this.adminList.findIndex((item, index) => {
                                return item.adminId == res.data.reviewerList1[i].manuscriptReviewerId;
                            });
                            // 添加对象
                            let temp = {};
                            temp.adminId = this.adminList[index].adminId;
                            temp.adminName = this.adminList[index].adminName;
                            temp.manuNumber = res.data.reviewerList1[i].manuNumber;
                            tempReviewerList.push(temp);
                        }
                        this.selectedReviewer = tempReviewerList;
                    } else {
                        this.isSet = false;
                    }
                    // 对于二审同样的做法
                    if(res.data.reviewerList2 && res.data.reviewerList2.length != 0) {
                        this.isSet_1 = true;
                        // 对结果进行转换
                        const tempReviewerList = [];
                        // 遍历数组
                        for(let i = 0; i< res.data.reviewerList2.length; i++) {
                            // 匹配下表
                            const index = this.adminList.findIndex((item, index) => {
                                return item.adminId == res.data.reviewerList2[i].manuscriptRecheckerId;
                            });
                            // 添加对象
                            let temp = {};
                            temp.adminId = this.adminList[index].adminId;
                            temp.adminName = this.adminList[index].adminName;
                            temp.manuNumber = res.data.reviewerList2[i].manuNumber;
                            tempReviewerList.push(temp);
                        }
                        this.selectedReviewer_1 = tempReviewerList;
                    } else {
                        this.isSet_1 = false;
                    }
                } catch (error) {
                    this.$message({
                        message: '获取该比赛评审人员信息失败',
                        duration: 2000,
                        type: 'error'
                    });
                    console.log(error);
                }             
            }

        },

        // 添加评审人员
        add() {
            // 如果评审人员不为空，数量大于0且小于剩余总数，才准许添加
            if(this.selectedAdminId && this.manuNumber > 0 && this.manuNumber <= this.manuTotal) {
                // 找到这个管理员的下表
                const index = this.adminList.findIndex((item, index) => {
                    return item.adminId === this.selectedAdminId
                });
                // 将评审信息添加到右边列表
                this.selectedReviewer.push(
                    {
                        adminId: this.selectedAdminId,
                        manuNumber: this.manuNumber,
                        adminName: this.adminList[index].adminName
                    }
                );
                // 删除下拉框的评审管理员
                this.adminOptions = this.adminOptions.filter((item, index) => {
                    return item.value !== this.selectedAdminId
                });
                // 总数更新
                this.manuTotal -= this.manuNumber;
                this.selectedAdminId = '';
                this.manuNumber = 100;                
            } else {
                this.$message({
                    message: '未选择账号或数量不规范',
                    duration: 2000,
                    type: 'warning'
                })
            }
        },

        // 撤销评审人员
        cancel(row, index) {
            // 将管理员下拉选项添加回来
            this.adminOptions.push(
                {
                    value: row.adminId,
                    label: row.adminName
                }
            );
            // 总数还原
            this.manuTotal += row.manuNumber;
            // 删除右边数据
            this.selectedReviewer.splice(index, 1);
        },

        // 提交评审人员名单
        submit() {
            // 如果还有投稿剩余，不允许提交
            if(!this.selectedCompetitionId) {
                this.$message({
                    message: '请先选择比赛进行分配',
                    type: 'warning'
                });
                return;
            }
            if(this.manuTotal > 0) {
                this.$message({
                    message: '还有投稿剩余，请分配后再进行提交',
                    type: 'warning'
                });
            } else {
                this.$confirm('提交之后将无法修改，确定要提交吗？', '提示', {
                    type: 'warning'
                }).then(async () => {
                    // 保留应有属性
                    let reviewerList = [];
                    for (let i = 0; i < this.selectedReviewer.length; i++) {
                        let temp = {};
                        temp.adminId = this.selectedReviewer[i].adminId;
                        temp.manuNumber = this.selectedReviewer[i].manuNumber;
                        reviewerList.push(temp);
                    }
                    // 参数为比赛id和评审人员列表
                    let params = {
                        competitionId: this.selectedCompetitionId,
                        reviewers: JSON.stringify(reviewerList)
                    }
                    try {
                        await this.$api.admin.setReviewer(params);
                        this.$message({
                            message: '设置一审人员成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.isSet = true;
                    } catch (error) {
                        this.$message({
                            message: '设置一审人员失败',
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
            }
        },

        // 添加评审人员
        add_1() {
            // 如果评审人员不为空，数量大于0且小于剩余总数，才准许添加
            if(this.selectedAdminId_1 && this.manuNumber_1 > 0 && this.manuNumber_1 <= this.manuTotal_1) {
                // 找到这个管理员的下表
                const index = this.adminList.findIndex((item, index) => {
                    return item.adminId === this.selectedAdminId_1
                });
                // 将评审信息添加到右边列表
                this.selectedReviewer_1.push(
                    {
                        adminId: this.selectedAdminId_1,
                        manuNumber: this.manuNumber_1,
                        adminName: this.adminList[index].adminName
                    }
                );
                // 删除下拉框的评审管理员
                this.adminOptions_1 = this.adminOptions_1.filter((item, index) => {
                    return item.value !== this.selectedAdminId_1
                });
                // 总数更新
                this.manuTotal_1 -= this.manuNumber_1;
                this.selectedAdminId_1 = '';
                this.manuNumber_1 = 100;                
            } else {
                this.$message({
                    message: '未选择账号或数量不规范',
                    duration: 2000,
                    type: 'warning'
                })
            }
        },

        // 撤销评审人员
        cancel_1(row, index) {
            // 将管理员下拉选项添加回来
            this.adminOptions_1.push(
                {
                    value: row.adminId,
                    label: row.adminName
                }
            );
            // 总数还原
            this.manuTotal_1 += row.manuNumber;
            // 删除右边数据
            this.selectedReviewer_1.splice(index, 1);
        },

        // 提交评审人员名单
        submit_1() {
            // 如果还有投稿剩余，不允许提交
            if(this.manuTotal_1 > 0) {
                this.$message({
                    message: '还有投稿剩余，请分配后再进行提交',
                    type: 'warning'
                });
            } else {
                this.$confirm('提交之后将无法修改，确定要提交吗？', '提示', {
                    type: 'warning'
                }).then(async () => {
                    // 保留应有属性
                    let reviewerList_1 = [];
                    for (let i = 0; i < this.selectedReviewer_1.length; i++) {
                        let temp = {};
                        temp.adminId = this.selectedReviewer_1[i].adminId;
                        temp.manuNumber = this.selectedReviewer_1[i].manuNumber;
                        reviewerList_1.push(temp);
                    }
                    // 参数为比赛id和评审人员列表
                    let params = {
                        competitionId: this.selectedCompetitionId,
                        reviewers: JSON.stringify(reviewerList_1)
                    }
                    try {
                        await this.$api.admin.setRechecker(params);
                        this.$message({
                            message: '设置二审人员成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.isSet_1 = true;
                    } catch (error) {
                        this.$message({
                            message: '设置二审人员失败',
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
            }
        }, 
        reset() {
            // 初评
            this.isSet = false;
            this.adminOptions = [];
            this.selectedAdminId = '';
            this.manuNumber = 100;
            this.manuTotal = 0;
            this.selectedReviewer = [];

            // 复评
            this.isSet_1 = false;
            this.adminOptions_1 = [];
            this.selectedAdminId_1 = '';
            this.manuNumber_1 = 100;
            this.manuTotal_1 = 0;
            this.selectedReviewer_1 = [];
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
    font-size: 14px;
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
.tabs_wrap {
    height: 300px;
}
.tabs_content {
    display: flex;
}
.left {
    flex: 1;
    padding-right: 20px;
    border-right: 1px solid #cccccc;
}
.left_title {
    text-align: center;
    padding-bottom: 10px;
}
.common_style {
    font-size: 14px;
    color: #585858;
    padding-bottom: 20px;
}
    
.right {
    flex: 1;
    padding-left: 10px;
    text-align: center;
}

.right_title {
    text-align: center;
    padding-bottom: 10px;
}

</style>
