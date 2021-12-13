import request from '../utils/request';

const user = {    
    // 用户列表    
    getUserList () {        
        return request({
            url: '',
            method: 'get',
            params: query
        }); 
    },    
    // 禁用用户    
    disableUser (id, params) {        
        return request({
            url: `xxx/${id}`,
            method: 'get',
            params: params
        });
    },
}

export default user;
