<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">对联云后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="adminAccount">
                    <el-input v-model="param.adminAccount" placeholder="账号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="adminPassword">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.adminPassword"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                adminAccount: '',
                adminPassword: '',
            },
            rules: {
                adminAccount: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
                adminPassword: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }],
            },
        };
    },
    created() {
        if(sessionStorage.getItem('adminSession')) {
            this.$router.replace('/');
        }
    },
    methods: {
        async submitForm() {
            let params = {
                adminAccount: this.param.adminAccount,
                adminPassword: this.param.adminPassword
            }
            try {
                const res = await this.$api.admin.login(params);
                sessionStorage.setItem('adminToken', res.adminToken);
                this.GLOBAL.adminInfo = res.adminToken.adminInfo;
                this.$message({
                    message: '登陆成功',
                    type: 'success'
                });
                this.$router.push('/');
            } catch (error) {
                this.$message({
                    message: '登录失败',
                    type: 'error'
                });
                console.log(error);                
            }
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>