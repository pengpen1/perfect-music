// 也可以封装成一个函数，封装类可以定义更多的方法,在加baseurl
class PQRequest{
    constructor(baseURL){
        this.baseURL = baseURL
    }
    request(options){
        const {url} = options
        return new Promise((resolve,reject)=>{
            wx.request({
             ...options,
             url:this.baseURL + url,
             success(res){
                resolve(res.data)
             },
             fail:reject
            })
        })
    }
    get(options){
        return this.request({...options,method:'GET'})
    }
    post(options){
        return this.request({...options,method:'POST'})
    }
}

export default PQRequest