<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/couplet_about/MasterManage' }">
                    <i class="el-icon-lx-cascades"></i> 楹联家管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    添加楹联
                </el-breadcrumb-item>                      
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="title_and_action">
                <div class="title_wrap">楹联添加</div>
                <div>
                    <el-button type="warning" @click="reset">重置</el-button>  
                    <el-button type="primary" @click="submit('coupletForm')">添加楹联</el-button>                  
                </div>
            </div>
            <el-form ref="coupletForm" :model="coupletForm" :rules="rules">
                <el-descriptions direction="vertical" :column="4" border size="medium">
                    <el-descriptions-item label="作者" :span="1">
                        <el-form-item prop="coupletAuthorName">
                            <el-input v-model="coupletForm.coupletAuthorName" :readonly="true"></el-input>
                        </el-form-item>    
                    </el-descriptions-item>
                    <el-descriptions-item label="朝代" :span="1">
                        <el-form-item prop="coupletDynasty">
                            <el-input v-model="coupletForm.coupletDynasty" :readonly="true"></el-input>
                        </el-form-item>    
                    </el-descriptions-item>
                    <el-descriptions-item label="类型" :span="1">
                        <el-form-item prop="coupletTypeId">
                            <el-select v-model="coupletForm.coupletTypeId" placeholder="请选择类型" style="width: 100%;">
                                <el-option
                                    v-for="item in coupletTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> 
                    </el-descriptions-item>
                    <el-descriptions-item label="出处" :span="1">
                        <el-form-item prop="coupletFrom">
                            <el-input v-model="coupletForm.coupletFrom" placeholder="请输入楹联出处"></el-input>
                        </el-form-item>       
                    </el-descriptions-item>
                    <el-descriptions-item label="标题+上联+下联（以标题，上联，下联顺序，换行分隔）" :span="2">
                        <el-form-item prop="titleAndCoupletText">
                            <el-input v-model="coupletForm.titleAndCoupletText" type="textarea" :autosize="{ minRows: 4}" placeholder="请输入标题和上下联" @blur="loseBlur" @focus="getFocus"></el-input>
                        </el-form-item>     
                    </el-descriptions-item>
                    <el-descriptions-item label="注释" :span="1">
                        <el-form-item prop="coupletExplanation">
                            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="coupletForm.coupletExplanation" placeholder="请输入楹联注释"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                    <el-descriptions-item label="赏析" :span="1">
                        <el-form-item prop="coupletAppreaciation">
                            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="coupletForm.coupletAppreaciation" placeholder="请输入楹联赏析"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CoupletAdd',
    data() {
        var validateData = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入标题和上下联'));
            } else {
                let titleAndLine = value.split(/[(\r\n)\r\n]+/);
                titleAndLine = titleAndLine.filter((item, index) => {
                    return item && item != '标题: ' && item != '上联: ' && item != '下联: ';
                });
                if(titleAndLine.length != 3) {
                    callback(new Error('格式有误或输入不完全，匹配失败'));
                } else {
                    callback(); 
                }
            }
        };
        return {
            coupletForm: {
                titleAndCoupletText: '',
                coupletAuthorId: '',
                coupletAuthorName: '',
                coupletTitle: '',
                coupletFrom: '',
                coupletDynasty: '',
                coupletFirstLine: '',
                coupletSecondLine: '',
                coupletTypeId: '',
                coupletAppreaciation: '',
                coupletExplanation: ''
            },
            tempData: '',
            coupletTypeList: [],
            rules: {
                titleAndCoupletText:[
                    {required: true, validator: validateData, trigger: ['change', 'blur']}
                ],
                coupletTypeId:[
                    {required: true, message: '选择楹联类型', trigger: 'blur'}
                ],
                coupletFrom:[
                    {required: true, message: '请输入楹联出处', trigger: 'blur'}
                ],    
                coupletAppreaciation:[
                    {required: true, message: '请输入楹联赏析', trigger: 'blur'}
                ],    
                coupletExplanation:[
                    {required: true, message: '请输入楹联注释', trigger: 'blur'}
                ],   
            }
        };
    },
    activated() {
        this.coupletForm.coupletAuthorId = this.$route.query.coupletAuthorId;
        this.coupletForm.coupletDynasty = this.$route.query.coupletDynasty;
        this.coupletForm.coupletAuthorName = this.$route.query.coupletAuthorName;
        this.getCoupletType();
        // console.log(this.$route);
    },
    methods: {
        async getCoupletType() {
            // 获取楹联类型下拉框
            try {
                const res = await this.$api.couplet.getCoupletTypeList();
                this.coupletTypeList = res.coupletTypeList;
                // 替换键值对，满足下拉框
                this.coupletTypeList = this.coupletTypeList.map(function (item) {
                    return{
                        "value": item.coupletTypeId,
                        "label": item.coupletTypeDetail
                    }
                });
            } catch (error) {
                this.$message({
                    message: '自动获取楹联类型失败，请重新尝试',
                    duration: 2000,
                    type: 'error'
                });
                console.log(error);
            }
        },
        loseBlur() {
            this.tempData = this.coupletForm.titleAndCoupletText;
            if(this.coupletForm.titleAndCoupletText) {
                let titleAndLine = this.coupletForm.titleAndCoupletText.split(/[(\r\n)\r\n]+/);
                titleAndLine = titleAndLine.filter((item, index) => {
                    return item;
                });
                this.coupletForm.coupletTitle = titleAndLine[0];
                this.coupletForm.coupletFirstLine = titleAndLine[1];
                this.coupletForm.coupletSecondLine = titleAndLine[2];
                if(titleAndLine.length === 0) {
                    this.coupletForm.titleAndCoupletText = '标题: ' + ''
                        + '\n上联: ' + ''
                        + '\n下联: ' + '';  
                } else if(titleAndLine.length === 1) {
                    this.coupletForm.titleAndCoupletText = '标题: ' + titleAndLine[0]
                        + '\n上联: ' + ''
                        + '\n下联: ' + '';  
                } else if(titleAndLine.length === 2) {
                    this.coupletForm.titleAndCoupletText = '标题: ' + titleAndLine[0]
                        + '\n上联: ' + titleAndLine[1]
                        + '\n下联: ' + '';  
                } else {
                    this.coupletForm.titleAndCoupletText = '标题: ' + titleAndLine[0]
                        + '\n上联: ' + titleAndLine[1]
                        + '\n下联: ' + titleAndLine[2];  
                }
            }
        },

        getFocus() {
            this.coupletForm.titleAndCoupletText = this.tempData;
        },

        submit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let params = {
                        coupletAuthorId: this.coupletForm.coupletAuthorId,
                        coupletAuthorName: this.coupletForm.coupletAuthorName,
                        coupletTitle: this.coupletForm.coupletTitle,
                        coupletFrom: this.coupletForm.coupletFrom,
                        coupletDynasty: this.coupletForm.coupletDynasty,
                        coupletFirstLine: this.coupletForm.coupletFirstLine,
                        coupletSecondLine: this.coupletForm.coupletSecondLine,
                        coupletTypeId: this.coupletForm.coupletTypeId,
                        coupletAppreaciation: this.coupletForm.coupletAppreaciation,
                        coupletExplanation: this.coupletForm.coupletExplanation
                    }
                    try {
                        await this.$api.couplet.addCouplet(params);
                        this.$message({
                            message: '增加楹联成功',
                            duration: 2000,
                            type: 'success'
                        });
                        this.reset();
                    } catch (error) {
                        this.$message({
                            message: '增加楹联失败',
                            duration: 2000,
                            type: 'error'
                        });
                        console.log(error);
                    }                    
                } else {
                    console.log('增加楹联表单验证失败');
                    return false;
                }
            });
        },

        reset() {
            this.coupletForm = {
                titleAndCoupletText: '',
                coupletAuthorId: this.$route.query.coupletAuthorId,
                coupletAuthorName: this.$route.query.coupletAuthorName,
                coupletTitle: '',
                coupletFrom: '',
                coupletDynasty: this.$route.query.coupletDynasty,
                coupletFirstLine: '',
                coupletSecondLine: '',
                coupletTypeId: '',
                coupletAppreaciation: '',
                coupletExplanation: ''
            };
            this.tempData = '';
            setTimeout(() => {
                this.$refs['coupletForm'].clearValidate();
            }, 500);
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

.avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    padding-top: 80px;
    text-align: center;
}
.avatar {
    height: 100%;
    display: block;
}

.title_and_action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}
.title_wrap {
    font-size: 20px;
}
</style>
