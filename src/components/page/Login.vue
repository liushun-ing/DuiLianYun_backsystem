<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">对联云后台管理系统</div>
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
                <el-form-item prop="adminAccount">
                    <el-input v-model="loginForm.adminAccount" placeholder="账号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="adminPassword">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="loginForm.adminPassword"
                        @keyup.enter.native="submitForm('loginForm')"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import utils from '../../utils/utils';
export default {
    data: function() {
        return {
            loginForm: {
                adminAccount: '',
                adminPassword: '',
            },
            rules: {
                adminAccount: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
                adminPassword: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }],
            },
        };
    },
    activated() {
        if(utils.getSessionInfo('adminToken')) {
            this.$router.replace('/');
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if(valid) {
                    let params = {
                        adminAccount: this.loginForm.adminAccount,
                        adminPassword: this.loginForm.adminPassword
                    }
                    try {
                        const res = await utils.login(params);
                        sessionStorage.setItem('adminToken', JSON.stringify(res.adminToken));
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
                } else {
                    console.log('登陆表单提交失败');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.png);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: rgb(108, 127, 212);
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