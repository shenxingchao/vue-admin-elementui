import request from '@/utils/request'

export function login(ruleForm) {
  return request({
    url: '/User/login',
    method: 'post',
    data: ruleForm,
  })
}

export function getInfo(params) {
  return request({
    url: '/User/getInfo',
    method: 'get',
    params: params,
  })
}

export function logout(ruleForm) {
  return request({
    url: '/User/logout',
    method: 'post',
    data: ruleForm,
  })
}
