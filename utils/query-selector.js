export function querySelector(selector){
    return new Promise((resolve,reject)=>{
        const query = wx.createSelectorQuery();
        query.select(selector).boundingClientRect((res) => {
          resolve(res)
        });  
        query.exec();
    })
}