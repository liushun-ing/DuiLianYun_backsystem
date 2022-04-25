<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 一审投稿 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                请先选择比赛:&nbsp;
                <el-select ref="select" v-model="selectedCompetitionId" placeholder="请选择比赛" @change="handleSelected">
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
                <el-table-column label='投稿内容' min-width="500" align='center'>
                    <template slot-scope='scope'>
                        <div class='limit_wrap'>{{scope.row.manuscriptContent}}</div>    
                    </template> 
                </el-table-column>
                <el-table-column prop="manuscriptCreateTime" width="160" label="投稿时间" align='center' sortable></el-table-column>
                <el-table-column label="一审分数" align="center" min-width="100"> 
                    <template slot-scope="scope">
                        <div v-if='scope.row.score != -1'>{{scope.row.score}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="一审评语" align="center" prop="comment" min-width="250"></el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if='scope.row.score == -1' type="text" icon="el-icon-edit" class="blue" @click="handleReview(scope.$index, scope.row)"
                            >作品评审</el-button
                        >
                        <el-button v-else disabled type="text" icon="el-icon-edit" class="blue"
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
                    </el-form>
                </div>
                <div class='review-box'>
                    <el-form :model="reviewData" :rules="rules" ref='review'> 
                        <el-form-item label="评分" prop="score">
                            <el-input type="text" v-model="reviewData.score" placeholder="请输入评分"></el-input>
                        </el-form-item>
                        <el-form-item label="评语" prop="comment">
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
import utils from '../../../utils/utils';
export default {
    name: 'FirstReview',
    data() {
        var checkScore = (rule, value, callback) => {
            if(!value) {
                return callback(new Error('请输入评审分数'));
            } else if(value < 0 || value > 100) {
                return callback(new Error('分数应该在0~100'))
            } else {
                callback();
            }

        }
        return {
            //选择的比赛的id
            selectedCompetitionId: null,

            //控制弹出框
            dialogFormVisible: false,

            //比赛列表
            competitionList: [],

            //分页
            currentPage: 1,
            total: 0,
            pageSize: 10,
            

            //获取的投稿列表
            manuscriptList: [],

            //筛选出的投稿列表
            displayManuscriptList: [],

            //选择评审的投稿
            manuscriptData: {},

            //对投稿的评审信息
            reviewData: {
                reviewerId: '',
                manuscriptId: '',
                score: '',
                comment: ''
            },

            //表单验证规则
            rules:{
                score: [
                    {required: true, message:'请输入评审分数', trigger: 'blur'},
                    {validator: checkScore, trigger: 'blur'}
                ],
                comment:[
                    {required: true, message:'请输入评论', trigger: 'blur'}
                ]
            }
        };
    },
    activated() {
        this.getAllCompetition();
    },
    methods: {
        //根据创建时间排序
        sortByTime(array){
            return array.sort(function(a, b) {
                var time1 = new Date(a.createTime).getTime();
                var time2 = new Date(b.createtime).getTime();
                return time1 > time2 ? -1 : time1 < time2 ? 1 : 0;
            })
        },
        async getAllCompetition() {
            try {
                let res = await this.$api.competition.getAllCompetition();
                this.competitionList = this.sortByTime(res.competitionList);
            } catch (error) {
                this.$message({
                    message: '获取比赛列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        async getFirstReviewManuscript() {
            let params = {
                adminId: utils.getSessionInfo('adminId'),
                competitionId: this.selectedCompetitionId
            };
            try {
                let res = await this.$api.competition.getManuscriptFirst(params);
                this.manuscriptList = res.manuscriptList;
                this.total = this.manuscriptList.length;
                this.changePageContent();
                // console.log(this.manuscriptList);
            } catch (error) {
                this.$message({
                    message: '获取投稿失败',
                    duration: 2000,
                    type: 'error'
                });
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
        },

        handlePageNext() {
            this.currentPage++;   
        },

        //根据currentPage显示内容
        changePageContent() {
            this.displayManuscriptList = this.manuscriptList.slice(
                (this.currentPage - 1) * this.pageSize,
                (this.currentPage ) * this.pageSize >= this.manuscriptList.length
                    ? this.manuscriptList.length
                    : (this.currentPage ) * this.pageSize
            );
        },

        //点击之后评审
        handleReview(index, row) {
            this.manuscriptData = JSON.parse(JSON.stringify(row));
            this.dialogFormVisible = true;
            // console.log(this.reviewData);
        },

        //dialog中的取消，应该提醒用户
        handleCancel() {
            this.$confirm('取消将不保存已填写的内容，是否继续?', '提示', {
                confirmButttonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dialogFormVisible = false;
                this.$message({
                    message: '操作已取消',
                    duration: 1500,
                    type: 'info'
                });
                this.reviewData = {
                    reviewerId: '',
                    manuscriptId: '',
                    score: '',
                    comment: ''
                };
            }).catch(() => {

            });
        },

        //筛选
        handleSelected() {
            this.currentPage = 1;
            this.getFirstReviewManuscript();
            // let _this = this;
            // this.selectedManuscript = this.manuscriptList.filter(this.selectFilter(_this));
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
        // handleReset() {
        //     this.displayManuscriptList = this.manuscriptList.slice(0,10);
        //     this.currentPage = 1;
        //     this.total = this.selectedManuscript.length;
        // },

        //处理刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.getFirstReviewManuscript();
            messageObject.close();
        },

        handleConfirm() {
            this.$refs['review'].validate(async (valid) => {
                if(valid) {
                    this.dialogFormVisible = false;
                    this.reviewData.reviewerId = utils.getSessionInfo('adminId');
                    this.reviewData.manuscriptId = this.manuscriptData.manuscriptId;
                    let reviewData = this.reviewData;
                    try {  
                        await this.$api.competition.uploadReviewDataFirst(reviewData);
                        this.$message({
                            message: '评审成功',
                            duration: 2000,
                            type: 'success'
                        });
                        for(let i = 0; i < this.displayManuscriptList.length; i ++){
                            if(this.displayManuscriptList[i].manuscriptId === this.reviewData.manuscriptId) {
                                this.displayManuscriptList[i].score = this.reviewData.score;
                                this.displayManuscriptList[i].comment = this.reviewData.comment;
                                // console.log("this.displayManuscriptList[i].manuscriptScore"+this.displayManuscriptList[i].manuscriptScore)
                                // console.log("score:"+this.reviewData.score)
                            }
                        }
                        for(let i = 0; i < this.manuscriptList.length; i ++){
                            if(this.manuscriptList[i].manuscriptId === this.reviewData.manuscriptId) {
                                this.manuscriptList[i].score = this.reviewData.score;
                                this.manuscriptList[i].comment = this.reviewData.comment;
                            }
                        }
                        this.reviewData = {
                            reviewerId: '',
                            manuscriptId: '',
                            score: '',
                            comment: ''
                        };
                    } catch(error) {
                        this.$message({
                            message: '评审失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }
                } else {
                    this.$message({
                        message: '请先填写评分和评论',
                        duration: 2000,
                        type: 'warning'
                    });
                    return false;
                }
            });
        }
    }
}
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
.limit_wrap {
    overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
/* .limit_wrap:hover {
    display: block;
} */
</style>