<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 二审投稿 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                请先选择比赛:&nbsp;
                <el-select ref="select" v-model="selectedCompetitionId" placeholder="请选择比赛" filterable @change="handleSelected">
                    <el-option
                        v-for="item in competitionList"
                        :key="item.competitionId"
                        :label="item.competitionName"
                        :value="item.competitionId"
                    >
                    </el-option>
                </el-select>
                <!-- <el-button style="margin-left: 10px" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button> -->
                <el-button style="margin-left: 10px" type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
            </div>

            <el-table :data="displayManuscriptList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="userName" label="作者姓名"></el-table-column>
                <el-table-column prop="userPrivince" label="作者省份"></el-table-column>
                <el-table-column prop="manuscriptTime" label="投稿时间"></el-table-column>
                <el-table-column prop="firstScore" label="一审分数"></el-table-column>
                <el-table-column prop="manuscriptScore" label="评审分数"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button v-if='!scope.row.manuscriptScore' type="text" icon="el-icon-edit" class="blue" @click="handleReview(scope.$index, scope.row)"
                            >作品评审</el-button
                        >
                        <el-button v-if='scope.row.manuscriptScore' disabled type="text" icon="el-icon-edit" class="blue"
                            >已评审</el-button
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

        <el-dialog title="作品评审" :visible.sync="dialogFormVisible" :showClose="false" :close-on-click-modal="false" ref="dialog">
            <div style="display:flex; align-content: space-around;" >
                <div class='manuscript-content-box'>
                    <el-form :model="manuscriptData" >
                        <el-form-item label="作品内容" >
                            <el-input readonly type="textarea" rows='10' v-model="manuscriptData.manuscriptContent"></el-input>
                        </el-form-item>
                        <el-form-item label="一审评价" >
                            <el-input readonly type="textarea" rows='10' v-model="manuscriptData.firstComment"></el-input>
                        </el-form-item>
                        <el-form-item label="一审得分" >
                            <el-input type="text" readonly v-model="manuscriptData.firstScore" ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class='review-box'>
                    <el-form :model="reviewData" :rules="rules" ref='review'> 
                        <el-form-item label="评分" prop="score">
                            <el-input type="text" v-model="reviewData.score" placeholder="请输入评分"></el-input>
                        </el-form-item>
                        <el-form-item label="评论" prop="comment">
                            <el-input type="textarea" rows='5' v-model="reviewData.comment" placeholder="请输入评论"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            //选择的比赛的id
            selectedCompetitionId: null,

            //控制弹出框
            dialogFormVisible: false,

            //比赛列表
            competitionList: [
                {
                    competitionId: '0001',
                    competitionName: '第一届金鸽诗词奖',
                    startTime: '2021-12-01'
                },
                {
                    competitionId: '0002',
                    competitionName: '第二届金鸽诗词奖',
                    startTime: '2021-11-01'
                }
            ],

            //分页
            currentPage: 1,
            total: 0,
            pageSize: 10,
            

            //获取的投稿列表
            manuscriptList: [],

            //筛选出的投稿列表
            displayManuscriptList: [],

            //选择评审的投稿
            manuscriptData: {
                manuscriptId: '',
                competitionId: '',
                userName: '',
                userPrivince: '',
                firstScore: '',
                firstComment: '',
                manuscriptTime: '',
                manuscriptContent: '',
            },

            //对投稿的评审信息
            reviewData: {
                adminId: '',
                manuscriptId: null,
                score: '',
                comment: ''
            },

            //表单验证规则
            rules:{
                score: [
                    {required: true, message: '请输入评分', trigger: 'blur'}
                ],
                comment:[
                    {required: true, message:'请输入评论', trigger: 'blur'}
                ]
            }
        };
    },
    mounted() {
        this.currentPage = 1;

        this.displayManuscriptList = this.manuscriptList;
        this.total = this.displayManuscriptList.length;
        this.displayManuscriptList = this.displayManuscriptList.slice(0, 10);
        
        this.reviewData = {
            adminId: this.$api.GLOBAL.adminInfo.adminId,
            comment: '无语子，太棒了',
            score: 100,
            manuscriptId: '00001'
        };
        this.competitionList = this.sortByTime(this.competitionList);
    },
    methods: {
        //根据创建时间排序
        sortByTime(array){
            return array.sort(function(a,b){
                let time1 = a.startTime;
                let time2 = b.startTime;
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            })
        },
        async getAllCompetition() {
            try {
                let res = await this.$api.competition.getAllCompetition();
                this.competitionList = res.competitionList;
            } catch (error) {
                console.log(error);
            }
        },

        async getFirstReviewManuscript() {
            let params = {
                adminId: this.GLOBAL.adminInfo.adminId,
                competitionId: this.selectedCompetitionId
            };
            try {
                let res = await this.$api.competition.getManuscriptFirst(params);
                this.manuscriptList = res.manuscriptList;
            } catch (error) {
                console.log(error);
            }
        },

        // 分页管理
        handlePageChange(val) {
            this.currentPage = val;
            this.changePageContent();
        },

        handlePagePrev() {
            this.currentPage--;
            this.changePageContent();
        },

        handlePageNext() {
            this.currentPage++;
            this.changePageContent();
            
        },

        //根据currentPage显示内容
        changePageContent() {
            this.displayManuscriptList = this.manuscriptList.slice(
                (this.currentPage - 1) * this.pageSize,
                (this.currentPage ) * this.pageSize >= this.selectedManuscript.length
                    ? this.selectedManuscript.length
                    : (this.currentPage ) * this.pageSize
            );
        },

        //点击之后评审
        handleReview(index, row) {
            this.manuscriptData = this.manuscriptList[index];
                
            this.dialogFormVisible = true;
            this.reviewData.manuscriptId = this.manuscriptData.manuscriptId;
            console.log(this.reviewData)
        },

        //dialog中的取消，应该提醒用户
        handleCancel() {
            this.$confirm('取消将不保存已填写的内容，是否继续?', '提示', {
                confirmButttonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.dialogFormVisible = false;
                    this.reviewData = {
                        manuscriptId: null,
                        score: '',
                        comment: ''
                    };
                })
                .catch(() => {});
        },

        //筛选
        handleSelected() {
            this.getFirstReviewManuscript();
            // let _this = this;
            // this.selectedManuscript = this.manuscriptList.filter(this.selectFilter(_this));
            this.currentPage = 1;
            this.total = this.manuscriptList.length;
            this.changePageContent();
        },
        /*
        selectFilter(_this) {
            let selectedCompetitionId = _this.selectedCompetitionId;
            console.log(selectedCompetitionId);
            return (manuscript) => {
                return manuscript.competitionId === selectedCompetitionId;
            };
        },
        */

        //处理重置
        handleReset() {
            this.displayManuscriptList = this.manuscriptList.slice(0,10);
            this.currentPage = 1;
            this.total = this.selectedManuscript.length;
        },

        //处理刷新
        handleRefresh() {
            this.getFirstReviewManuscript();
            this.handleReset();
        },

        async handleConfirm() {
            this.$refs['review'].validate(async (valid) => {
                if(!valid) {
                    let reviewData = this.reviewData;
                    try {  
                        await this.$competition.uploadReviewData(reviewData);
                        this.$message({
                            message: '评审成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.displayManuscriptList.forEach((item) => {
                            if(item.manuscriptId === this.reviewData.manuscriptId) {
                                item.manuscriptScore = this.reviewData.score;
                            }
                        })
                        this.manuscriptList.forEach((item) => {
                            if(item.manuscriptId === this.reviewData.manuscriptId) {
                                item.manuscriptScore = this.reviewData.score;
                            }
                        })
                        this.dialogFormVisible = false;
                    } catch(error) {
                        console.log(error);
                    }
                } else {
                    this.$message({
                        message: '请先填写评分和评论',
                        duration: 2000,
                        type: warning
                    })
                }
            })
            
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
.manuscript-content-box{
    width: 50%;
    height: 100%;
    border-right: #c9c9c9 solid 1px;
    padding-right: 10px;
}
.review-box{
    width: 50%;
    height: 100%;
    padding-left: 10px;
}
</style>
