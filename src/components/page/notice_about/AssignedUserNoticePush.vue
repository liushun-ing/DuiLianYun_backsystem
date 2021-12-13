<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 通知
                </el-breadcrumb-item>
                <el-breadcrumb-item>向指定用户发送通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    

                    <el-form-item label="通知名称" prop="noticeTitle">
                        <el-input style="width:250px" v-model="form.noticeTitle"></el-input>
                    </el-form-item>

                    <el-form-item label="通知内容" prop="noticeContent">
                        <el-input type="textarea" class="introduction" rows="5" v-model="form.noticeContent"></el-input>
                    </el-form-item>
                    
                    
                    
                    <el-form-item label="选择用户" prop="noticeUserList">
                        <el-button type="primary" @click="dialogFormVisible = true" round>选择用户</el-button>
                    
                        <el-dialog title="选择用户" :visible.sync="dialogFormVisible">
                            <div class="drag-box"> 
                                <div class="to-choose-user">
                                    <div style="margin-bottom: 20px;">
                                        <el-autocomplete 
                                        ref="searchInput"
                                        value-key="userName"
                                        style="width:70%"
                                        placeholder="请输入用户名" 
                                        v-model="state" 
                                        :fetch-suggestions="querySearchAsync"
                                        @select="handleSelect">
                                        </el-autocomplete>
                                        <el-button class="add-button" type="primary" :plain="true" @mousedown.native="addIntoList">添加</el-button>
                                    </div>
                                    
                                    <el-table
                                    height="300"
                                    empty-text="暂无数据"
                                    ref="multipleTable"
                                    :data="userList"
                                    tooltip-effect="dark"
                                    style="width: 100%;"
                                    @selection-change="handleSelectionChange">
                                        <el-table-column
                                        type="selection"
                                        width="55">
                                        </el-table-column>
                                        <!-- <el-table-column
                                        prop="userNickName"
                                        label="昵称"
                                        width="120">
                                        <template slot-scope="scope">{{ scope.data.userNickName }}</template>
                                        </el-table-column> -->
                                        <el-table-column
                                        sortable
                                        prop="userName"
                                        label="姓名"
                                        width="120">
                                        </el-table-column>
                                        <!-- <el-table-column
                                        prop="address"
                                        label="地址"
                                        show-overflow-tooltip>
                                        </el-table-column> -->
                                    </el-table>
                                    <div style="margin-top: 20px">
                                        <el-button @click="addChosenUser">添加</el-button>
                                    </div>
                                </div>

                                <div class="chosen-user">
                                    <div style="padding-bottom:20px">
                                        <p>已选中</p>
                                    </div>

                                    <el-table
                                    height="300"
                                    empty-text="暂无数据"
                                    ref="multipleTable"
                                    :data="form.noticeUserList"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    @selection-change="handleSelectionChangeChosen">
                                        <el-table-column
                                        type="selection"
                                        width="55">
                                        </el-table-column>
                                        
                                        <!-- <el-table-column
                                        prop="userNickName"
                                        label="昵称"
                                        width="120">
                                        <template slot-scope="scope">{{ scope.data.userNickName }}</template>
                                        </el-table-column> -->
                                        <el-table-column
                                        sortable
                                        prop="userName"
                                        label="姓名"
                                        width="120">
                                        </el-table-column>
                                        <!-- <el-table-column
                                        prop="address"
                                        label="地址"
                                        show-overflow-tooltip>
                                        </el-table-column> -->
                                    </el-table>

                                    <div style="margin-top: 20px">
                                        <el-button @click="cancleChoice">移除选中</el-button>
                                    </div>
                                    
                                </div>
                            </div>
                        </el-dialog>

                    </el-form-item>
                    
                    

                    <el-form-item>
                        <el-button type="primary" style="width:200px" @click="onSubmit">发送</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'baseform',
    
    data() {
        let checkNoticeUserList = (rules, value, callback) => {
            console.log("调用check")
            if(!value.length) {
                callback(new Error("选择用户不能为空"))
            } else{
                callback();
            }
        }
        return {
            dialogFormVisible: false,
            
            form: {
                noticeTitle: null,
                noticeContent: null,
                noticeUserList: [],
            },

            chosenUserList:[],

            multipleSelection: [],
            multipleSelectionChose: [],
            selectUser:null,
            userList:[],
            state: '',
            timeout:  null,
            
            rules: {
                noticeTitle: [
                    {required: true, message: '请输入通知标题', trigger: 'blur'}
                ],
                noticeContent: [
                    {required: true, message: '请输入通知内容', trigger: 'blur'}
                ],
                noticeUserList: [
                    {validator: checkNoticeUserList, trigger: 'blur' }
                ]
            }
        };
    },

    methods: {
        //querySearchAsync和createStateFilter，handleSelect都是用于处理搜索框的。
        querySearchAsync(queryString, cb) {
            this.selectUser = null;
            var userList = this.userList;
            //var results = userList.filter(this.createStateFilter(queryString));
            var results = queryString ? userList.filter(this.createStateFilter(queryString)) : userList;
            
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
            cb(results);
            }, 1000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => {
            return (state.userName.toLowerCase().includes(queryString.toLowerCase()));
            };
        },
        handleSelect(item) {
            //console.log(item);
            this.selectUser = item;
        },
        async loadAll(){
            try {
                this.userList = await this.$api.notice.getAllUsers();
            } catch (error){
                console.log(error);
                this.$message({
                    message: '获取用户列表失败，请重新进入',
                    duration: 2000,
                    type: error
                })
            }
            // return [
            //     {'userId':'00000001','userName':'肖宇'},
            //     {'userId':'00000002','userName':'刘顺'},
            //     {'userId':'00000003','userName':'亚托克斯'},
            //     {'userId':'00000004','userName':'艾瑞利亚'},
            //     {'userId':'00000005','userName':'瑟提'},
            //     {'userId':'00000006','userName':'德莱厄斯'},
            //     {'userId':'00000007','userName':'五条悟'},
            //     {'userId':'00000008','userName':'柯南'},
            //     {'userId':'00000009','userName':'基德'},
            //     {'userId':'000000010','userName':'佐助'},
            //     {'userId':'000000011','userName':'小李'},
            //     {'userId':'000000012','userName':'小王'},
            //     {'userId':'000000013','userName':'老秦'},
            //     {'userId':'000000014','userName':'一朵云'},
            //     {'userId':'000000015','userName':'小帆帆'},
            //     {'userId':'000000016','userName':'乌鱼子'},
            //     {'userId':'000000017','userName':'句子'},
            //     {'userId':'000000018','userName':'梨花'}
            // ]
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        handleSelectionChangeChosen(val){
            this.multipleSelectionChose = val;
        },
        
        
        
        addIntoList(){
            console.log("响应click")
            this.$refs.searchInput.focus();
            let selectUser = this.selectUser;
            if(!selectUser) this.$message('请先搜索并选中用户');
            else{
                let isNecessary = true;
                this.form.noticeUserList.forEach((item) => {
                    if(selectUser.userId === item.userId) isNecessary = false;
                })
                if(isNecessary) {
                    this.form.noticeUserList.push(this.selectUser);
                    for(let index = 0; index < this.userList.length; index ++){
                        if(this.userList[index].userId === selectUser.userId) {
                            this.userList.splice(index, 1);
                        }
                    }
                    
                    this.$message('添加用户成功');
                    this.state = null; 
                    this.selectUser = null;
                } else {
                    this.$message('用户已被选择');
                }
            }
            console.log(this.form.noticeUserList)
        },

        //添加选中的用户
        addChosenUser() {
            if(this.multipleSelection){
                this.form.noticeUserList = this.form.noticeUserList.concat(this.multipleSelection);
                this.multipleSelection.forEach( (item,index) => {
                    for(let userListIndex = 0; userListIndex < this.userList.length; userListIndex ++){
                        if(this.userList[userListIndex].userId === item.userId) {
                            this.userList.splice(userListIndex, 1);
                            break;
                        }
                    }
                })
                this.multipleSelection = null;
                
                console.log(this.multipleSelection);
            } else{
                this.$message('请先选中用户');
            }
        },

        //相应“取消选中”按钮点击事件，取消选中的用户
        cancleChoice(){
            if(this.multipleSelectionChose){
                this.userList = this.userList.concat(this.multipleSelectionChose)
                this.multipleSelectionChose.forEach( (item, index) => {
                    
                    for(let i = 0; i < this.form.noticeUserList.length; i ++) {
                        if(this.form.noticeUserList[i].userId === item.userId) {
                            this.form.noticeUserList.splice(i, 1);
                            break;
                        }
                    }
                })
                this.multipleSelectionChose = null;
                console.log(this.multipleSelectionChose);
            } else{
                this.$message('请先选中用户');
            }
            
        },
        
    
        async onSubmit() {
            try {
                let params = {
                    'noticeTitle': this.form.noticeTitle,
                    'noticeContent': this.form.noticeContent,
                    'noticeUserList': this.form.noticeUserList
                };
                await this.$api.notice.noticeSomeUsers(params);
            } catch (error) {
                this.$message({
                    message: '通知发送失败',
                    duration: 2000,
                    type: error
                })
            }
        },
    },
    mounted() {
        this.loadAll();
    }
};
</script>

<style>
.avatar-uploader .el-upload {
    width: 160px;
    height: 200px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.introduction{
    width: 250px;
}
.add-button{
    margin-left: 20px;
}
.to-choose-user{
    display: flex;
    flex-direction: column;
    width:40%;
    height:500px;
    padding-right: 20px;
    border-right: #8c939d solid 1px;
}
.chosen-user{
    display: flex;
    flex-direction: column;
    width:40%;
    height:500px;
}
.drag-box{
    display:flex;
    justify-content: space-around;
    
}
</style>