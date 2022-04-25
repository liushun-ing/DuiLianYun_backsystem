<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/news_about/NewsManage' }">
                    <i class="el-icon-lx-cascades"></i> 新闻管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    查看新闻
                </el-breadcrumb-item>     
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-descriptions title="新闻详情" direction="vertical" :column="3" border size="medium">
                <el-descriptions-item label="标题" :span="1">{{newsDetail.newsTitle}}</el-descriptions-item>
                <el-descriptions-item label="编辑人" :span="1">{{newsDetail.newsEditor}}</el-descriptions-item>
                <el-descriptions-item label="发布时间" :span="1">{{newsDetail.newsCreateTime}}</el-descriptions-item>
                <el-descriptions-item label="封面图" :span="3">
                    <el-image :src="newsDetail.newsImage" style="height: 300px" fit="container"></el-image>
                </el-descriptions-item>
                <el-descriptions-item label="内容" :span="3">
                    <mavon-editor
                        class="md"
                        :value="newsDetail.newsContent"
                        :subfield = "false"
                        :defaultOpen = "'preview'"
                        :toolbarsFlag = "false"
                        :editable="false"
                        :scrollStyle="true"
                        :ishljs = "true"
                        >
                    </mavon-editor>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsView',
    props: ['newsId'],
    data() {
        return {
            newsDetail: {
                newsId: '',
                newsTitle: '',
                newsEditor: '',
                newsContent: '',
                newsImage: '',
                newsCreateTime: ''
            }
        };
    },
    activated() {
        this.getNewsDetail();
    },
    methods: {
        async getNewsDetail() {
            let params = {
                newsId: this.$route.params.newsId
            };
            try {
                const res = await this.$api.news.getNewsDetail(params);
                this.newsDetail = res.newsDetail;
            } catch (error) {
                this.$message({
                    message: '获取新闻详情失败',
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

.mr10 {
    margin-right: 10px;
}

</style>
