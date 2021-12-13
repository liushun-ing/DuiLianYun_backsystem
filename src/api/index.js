/** 
 * api接口的统一出口
 */

// 导入模块接口js文件
import user from './user';
import admin from './admin';
import post from './post';
import couplet from './couplet';
import competition from './competition';
import notice from './notice';
import document from './document';

// 导出接口
export default {    
    user,
    admin,
    post,
    couplet,
    competition,
    notice,
    document
}

/*
    使用：
    在main.js里面，全局导出
    引用：
    this.$api.接口名.方法名([参数])
    .then(res => {
        const data = res.data.xxx
        ...
    })
    .catch(err => {
        console.log(err);
    })
*/
