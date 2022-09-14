import { pqrequest } from "./request/index";


export function getMusicBanner(type= 0){
    return pqrequest.get({
        url:"/banner",
        data:{
            type
        }
    })
}

export function getPlayListDetail(id){
    return pqrequest.get({
        url:'/playlist/detail',
        data:{
            id
        }
    })
}

export function getSongMenuList(cat=  '全部',limit = 6,offset = 0){
    return pqrequest.get({
        url:'/top/playlist',
        data:{
            cat,
            limit,
            offset
        }
    })
}

export function getAllMenuTag(){
    return pqrequest.get({
        url:"/playlist/hot"
    })
}