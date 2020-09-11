import request from '@/utils/request'

export function login(ruleForm) {
  return request({
    url: '/User/Login',
    method: 'post',
    data: ruleForm
  })
}

export function getInfo(params) {
  return request({
    url: '/User/GetUserInfo',
    method: 'get',
    params: params
  })
}

export function logout(ruleForm) {
  return request({
    url: '/User/Logout',
    method: 'post',
    data: ruleForm
  })
}
