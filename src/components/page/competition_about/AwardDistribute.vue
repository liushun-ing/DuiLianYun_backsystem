<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 奖项分配
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                请选择比赛场次:&nbsp;
                <el-select v-model="selectedCompetitionId" placeholder="请选择" @change="changeCompetitionOptions">
                    <el-option
                    v-for="item in competitionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-refresh" style="margin-left: 20px;" @click="handleRefresh">刷新</el-button>
            </div>
            <el-table
                :data="distributeList"
                border
                class="table"
                :empty-text="emptyText"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="作品" align="center" min-width="300">
                    <template slot-scope="scope">
                        <div class="limit_wrap">{{scope.row.manuscriptContent}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="score1" label="一审得分" min-width="80" align="center"></el-table-column>
                <el-table-column label="一审评语" align="center" min-width="200">
                    <template slot-scope="scope">
                        <div class="limit_wrap">{{scope.row.comment1}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="score2" label="二审得分" min-width="80" align="center"></el-table-column>
                <el-table-column label="二审评语" align="center" min-width="200">
                    <template slot-scope="scope">
                        <div class="limit_wrap">{{scope.row.comment2}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="获奖情况" min-width="80" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.awardDetail">
                            <el-tag
                                type="danger"
                            >{{scope.row.awardDetail}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="获奖作品" align="center" min-width="250">
                    <template slot-scope="scope">
                        <div class="limit_wrap">{{scope.row.awardContent}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status === '0'">
                            <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleAward(scope.$index, scope.row)"
                            >评奖</el-button>
                        </div>
                        <div v-else>
                            <el-button
                                type="text"
                                icon="el-icon-view"
                                @click="handleView(scope.$index, scope.row)"
                            >查看</el-button>
                        </div>
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

        <el-dialog title="评选" :visible.sync="awardVisible" width="70%" :show-close="false" :close-on-click-modal="false">
            <div class="award_wrap">
                <div class="award_left">
                    <el-descriptions direction="vertical" :column="2" border>
                        <el-descriptions-item label="一审得分">{{awardLeftForm.score1}}</el-descriptions-item>
                        <el-descriptions-item label="二审得分">{{awardLeftForm.score2}}</el-descriptions-item>
                        <el-descriptions-item label="一审评语">{{awardLeftForm.comment1}}</el-descriptions-item>
                        <el-descriptions-item label="二审评语">{{awardLeftForm.comment2}}</el-descriptions-item>
                        <el-descriptions-item label="投稿内容">
                            <div v-html="awardLeftForm.manuscriptContent"></div>
                        </el-descriptions-item>
                    </el-descriptions>             
                </div>
                <div class="award_right">
                    <el-form ref="awardRightForm" :model="awardRightForm" :rules="rules">
                        <el-descriptions direction="vertical" :column="1" border>
                            <el-descriptions-item label="选择奖项">            
                                <el-form-item prop="awardDetail">
                                    <el-radio-group v-model="awardRightForm.awardDetail">
                                        <el-radio label="特等奖">特等奖</el-radio>
                                        <el-radio label="一等奖">一等奖</el-radio>
                                        <el-radio label="二等奖">二等奖</el-radio>
                                        <el-radio label="三等奖">三等奖</el-radio>
                                    </el-radio-group>
                                </el-form-item>            
                            </el-descriptions-item>
                            <el-descriptions-item label="挑选获奖部分(注意排版哟)，可点击工具栏右侧预览查看最终效果">
                                <el-form-item prop="awardContent">
                                    <mavon-editor v-model="awardRightForm.awardContentMarkdown" @change="changeContent" :toolbars="awardToolbars" :subfield="false" :autofocus="false" ref="md"/>
                                </el-form-item>
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-form>               
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAward">取 消</el-button>
                <el-button type="primary" @click="saveAward('awardRightForm')">确 定</el-button>
            </span>  
        </el-dialog>

        <el-dialog title="查看" :visible.sync="viewVisible" width="70%">
            <div class="award_wrap">
                <div class="award_left">
                    <el-descriptions direction="vertical" :column="2" border>
                        <el-descriptions-item label="一审得分">{{viewForm.score1}}</el-descriptions-item>
                        <el-descriptions-item label="二审得分">{{viewForm.score2}}</el-descriptions-item>
                        <el-descriptions-item label="一审评语">{{viewForm.comment1}}</el-descriptions-item>
                        <el-descriptions-item label="二审评语">{{viewForm.comment2}}</el-descriptions-item>
                        <el-descriptions-item label="投稿内容">
                            <div v-html="viewForm.manuscriptContent"></div>
                        </el-descriptions-item>
                    </el-descriptions>            
                </div>
                <div class="award_right">
                    <el-descriptions direction="vertical" :column="1" border>
                        <el-descriptions-item label="获奖奖项">            
                            <el-tag type="danger">{{viewForm.awardDetail}}</el-tag>        
                        </el-descriptions-item>
                        <el-descriptions-item label="获奖部分作品">
                            <mavon-editor
                                class="md"
                                :value="viewForm.awardContentMarkdown"
                                :subfield="false"
                                :defaultOpen="'preview'"
                                :toolbarsFlag="false"
                                :editable="false"
                                :scrollStyle="true"
                                :ishljs="true"
                                >
                            </mavon-editor>
                        </el-descriptions-item>
                    </el-descriptions>            
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../../../utils/utils.js'
export default {
    name: 'AwardDistribute',
    data() {
        return {
            competitionList: [],
            selectedCompetitionId: '',

            competitionOptions: [],

            awardToolbars: utils.awardToolbars,

            distributeList: [],

            emptyText: '暂无数据',

            currentPage: 1,
            pageSize: 10,
            total: 0,
            totalRecheck: 0,

            awardVisible: false,
            awardIndex: -1,
            awardLeftForm: {},
            awardRightForm: {},

            viewVisible: false,
            viewIndex: -1,
            viewForm: {},

            rules: {
                awardDetail:[
                    {required: true, message: '请选择奖项', trigger: 'blur'}
                ],
                awardContent:[
                    {required: true, message: '请挑选获奖部分', trigger: 'blur'}
                ],
            }
        };
    },
    activated() {
        this.getCompetitionList();
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

        // 选择比赛
        async changeCompetitionOptions(value) {
            if(value) {
                this.selectedCompetitionId = value;
                this.reset();
                this.getDistributeList(); 
            }
        },

        async getDistributeList() {
            let params = {
                competitionId: this.selectedCompetitionId,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            try {
                const res = await this.$api.competition.getDistributeList(params);
                if(res.total == res.totalRecheck) {
                    this.distributeList = res.distributeList;
                    this.total = res.total;
                    this.totalRecheck = res.totalRecheck;
                } else {
                    this.emptyText = '一审和二审还未结束噢!';
                }
            } catch (error) {
                this.$message({
                    message: '获取投稿列表失败',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },

        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.getDistributeList();
            messageObject.close();
        },

        handleView(index, row) {
            this.viewIndex = index;
            this.viewVisible = true;
            let viewForm = JSON.parse(JSON.stringify(row));
            viewForm.manuscriptContent = utils.formatText(viewForm.manuscriptContent);
            this.viewForm = viewForm;
        },

        cancelAward() {
            this.awardVisible = false;
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['awardRightForm'].clearValidate();
        },

        handleAward(index, row){
            this.awardIndex = index;
            this.awardVisible = true;
            let awardLeftForm = JSON.parse(JSON.stringify(row));
            awardLeftForm.manuscriptContent = utils.formatText(awardLeftForm.manuscriptContent);
            this.awardLeftForm = awardLeftForm;
            this.awardRightForm = {
                awardCompetitionId: '',
                awardUserId: '',
                awardManuscriptId: '',
                awardContent: '',
                awardContentMarkdown: '',
                awardDetail: '',
            }
        },

        changeContent(value, render) {
            // 将render html转换为纯文本
            // console.log(render);
            // 去除所有的标签
            let text = render.replace(/<\/?[^>]*>/g, "");
            // console.log(text);
            this.awardRightForm.awardContent = text;
        },

        saveAward(formName) {
            this.$refs[formName].validate(async valid => {
                if(valid) {
                    this.awardVisible = false;
                    this.awardRightForm.awardCompetitionId = this.selectedCompetitionId;
                    this.awardRightForm.awardUserId = this.awardLeftForm.manuscriptUserId;
                    this.awardRightForm.awardManuscriptId = this.awardLeftForm.manuscriptId;
                    try {
                        await this.$api.competition.distributeAward(this.awardRightForm);
                        this.$message({
                            message: '分配奖项成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.$set(this.distributeList[this.awardIndex], 'awardDetail', this.awardRightForm.awardDetail);
                        this.$set(this.distributeList[this.awardIndex], 'awardContent', this.awardRightForm.awardContent);
                        this.$set(this.distributeList[this.awardIndex], 'awardContentMarkdown', this.awardRightForm.awardContentMarkdown);
                        this.$set(this.distributeList[this.awardIndex], 'status', '1');
                    } catch (error) {
                        this.$message({
                            message: '分配奖项失败',
                            duration: 2000,
                            type: 'error'
                        });
                    }
                } else {
                    console.log('设置奖项表单验证失败');
                    return false;
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getDistributeList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },
        reset() {
            this.distributeList = [];
            this.currentPage = 1;
            this.total = 0;
            this.totalRecheck = 0;
            this.awardVisible = false;
            this.awardIndex = -1;
            this.awardLeftForm = {};
            this.awardRightForm = {};
            this.viewVisible = false;
            this.viewIndex = -1;
            this.viewForm = {};
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
    font-size: 14px;
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
.award_wrap {
    display: flex;
}
.award_left {
    flex: 1;
    padding-right: 2px;
}
.award_right {
    flex: 1;
    padding-left: 2px;
}
</style>
