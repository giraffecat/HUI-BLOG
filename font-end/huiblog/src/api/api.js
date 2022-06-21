import { request } from './axios'

/**
 * @description -封装User类型的接口方法
 */
export class Article {       // 模块一
    /**
     * @description 用户登录
     * @param {string} username - 用户名
     * @return {HttpResponse} result
     */
    static async GetArticleStats() {   // 接口一
      return request('/articleStats', {} ,'GET')
    }
    static async GetArticleList(params) {
      return request('/articles', params,'GET')
    }
    static async GetArticleById(url) {
      return request(url, {},'GET')
    }
    // static async login2(params) {   // 接口二
    //     return request('/login',params, 'post')
    // }
    // static async login3(params) {   // 接口三
    //     return request('/login',params, 'post')
    // }
}

export class Archives {    
  /**
   * @description 获取地列表
   * @return {HttpResponse} result
   */
  static async GetArchiveList(params) {
      return request('/archives', params, 'GET')
  }
}

export class Category {    
  /**
   * @description 获取地列表
   * @return {HttpResponse} result
   */
  static async GetCategoryList() {
    return request('/categories', {}, 'GET')
  }

  static async GetCategoryArticleByID(url, params) {
    return request(url, params, 'GET')
  }
}
