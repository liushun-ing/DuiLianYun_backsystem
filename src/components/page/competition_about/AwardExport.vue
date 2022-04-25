<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 获奖作品导出
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div>
                    请选择比赛场次:&nbsp;
                    <el-select v-model="selectedCompetitionId" placeholder="请选择" @change="changeCompetitionOptions">
                        <el-option
                            v-for="item in competitionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                    
                </div>
                <div>
                    <el-button v-if="allAward.length === 0" type="success" @click="beforeExport" size="small">导出EXCEL</el-button>
                    <download-excel
                        v-else
                        class="export-excel-wrapper"
                        :data="allAward"
                        :fields="json_fields"
                        :header="header"
                        :name="name">
                        <el-button type="success" size="small">导出EXCEL</el-button>
                    </download-excel>
                </div>
            </div>
            <el-table
                :data="awardList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="awardNumber" label="获奖编号" min-width="150" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserName" label="获奖人" min-width="150" align="center"></el-table-column>
                <el-table-column prop="userIntroduction" label="获奖人简介" min-width="250" align="center"></el-table-column>
                <el-table-column prop="awardContent" label="获奖作品" min-width="300" align="center"></el-table-column>
                <el-table-column prop="awardDetail" min-width="150" label="奖项" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserProvince" min-width="150" label="省份" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserAddress" min-width="200" label="详细地址" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserPhone" min-width="150" label="电话" align="center"></el-table-column>
                <el-table-column prop="manuscriptUserEmail" min-width="180" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="awardCreateTime" width="160" label="获奖时间" align="center" sortable></el-table-column>
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
    </div>
</template>

<script>
export default {
    name: 'AwardExport',
    data() {
        return {
            allAward: [],
            awardList: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,

            selectedCompetitionId: '',
            competitionList: [],
            competitionOptions: [],
            header: '',
            name: '',

            json_fields: {
                获奖编号: "awardNumber",
                获奖人: "manuscriptUserName",
                获奖人简介: "userIntroduction",
                获奖作品: "awardContent",
                奖项: "awardDetail",
                获奖人省份: "manuscriptUserProvince",
                获奖人详细地址: "manuscriptUserAddress",
                获奖人电话: "manuscriptUserPhone",
                获奖人邮箱: "manuscriptUserEmail",
                获奖时间: "awardCreateTime"    //如果命名的标题有空格,需要用双引号
            },
            json_meta: [
                [
                    {
                        " key ": " charset ",
                        " value ": " utf- 8 "
                    }
                ]
            ]
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

        sortByAwardNumber(array) {
            // 自定义函数，返回值为-1表示的是此次不需要交换，保持原来顺序
            return array.sort(function(a, b) {
                var num1 = a.awardNumber;
                var num2 = b.awardNumber;
                return num1 < num2 ? -1 : num1 > num2 ? 1 : 0;
            })
        },

        // 选择比赛
        async changeCompetitionOptions(value) {
            if(value) {
                this.selectedCompetitionId = value;
                let params = {
                    awardCompetitionId: value
                };
                try {
                    const res = await this.$api.competition.getAllAward(params);
                    this.allAward = this.sortByAwardNumber(res.awardList);
                    this.total = res.total;
                    this.getAwardList();
                    // 设置exel的header
                    const index = this.competitionList.findIndex((item, index) => {
                        return item.competitionId = this.selectedCompetitionId;
                    });
                    this.header = this.competitionList[index].competitionName + '获奖作品列表';
                    this.name = this.competitionList[index].competitionName + '获奖作品列表'
                } catch (error) {
                    this.$message({
                        message: '获取该比赛获奖作品信息失败',
                        duration: 2000,
                        type: 'error'
                    });
                    console.log(error);
                }             
            }
        },

        getAwardList() {
            this.awardList = this.allAward.filter((item, index) => {
                return index < this.currentPage * this.pageSize && index >= (this.currentPage - 1) * this.pageSize;
            })
            this.total = this.awardList.length;
        },

        //触发刷新
        handleRefresh() {
            let messageObject = this.$message('刷新中');
            this.currentPage = 1;
            this.getAwardList();
            messageObject.close();
        },

        // 分页导航
        handlePageChange(val) {
            this.currentPage = val;
            this.getAwardList();
        },
        handlePagePrev(){
            this.currentPage--;
        },
        handlePageNext(){
            this.currentPage++;
        },
      
        beforeExport() {
            this.$message({
                message: '当前没有数据可以导出',
                duration: 2000,
                type: 'warning'
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
</style>
