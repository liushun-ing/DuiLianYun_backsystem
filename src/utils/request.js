import axios from 'axios';
import qs from 'qs';

// axios拦截器
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了

    // 设置baseURL
    baseURL: 'http://47.113.192.155:8443',
    // 超时时间，超过5秒未响应，则返回错误
    timeout: 5000
});

// 请求体拦截器
service.interceptors.request.use(
    config => {
        // 设置请求头，添加token
        // const token = sessionStorage.getItem('adminToken').token;
		// token && (config.headers.token = token);
        // 有需要的话，可以转换数据格式
        if (config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 设置post请求头
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// 设置get请求头
service.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';


// 返回体拦截器
service.interceptors.response.use(
    response => {
        if(response.status === 200) {
            if (response.data.code === 20000) {
                // 这里直接将数据返回，而不是返回一个response
                return Promise.resolve(response.data.data);
            } else if(response.data.code === 20002) {
                // token过期，需要重新登陆
                // 移除token
                sessionStorage.removeItem('adminToken');
                // 提示框
                that.$message({
                    message: '登陆过期，请重新登陆',
                    type: 'warning'
                });
                // 延时回退页面
                setTimeout(() => {
                    this.$router.push('/login');
                }, 1500);
                // 返回一个失败的promise对象
                return Promise.reject(response.data.message);
            } else {
                // 后台接口返回数据失败
                return Promise.reject(response.data.message);
            }            
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;
