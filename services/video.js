import {pqrequest} from '../services/request/index'


// video页面的请求
export function getVideoList(limit=20,offset=0){
return pqrequest.get({
		  url:"/top/mv",
		  data:{
			  limit,
			  offset
		  }
	  })
 }


//  videoDetail页面的请求
 export function getVideoUrl(id){
	 return pqrequest.get({
		 url:'/mv/url',
		 data:{
			 id
		 }
	 })
 }
 export function getMvInfo(mvid){
	return pqrequest.get({
		url:'/mv/detail',
		data:{
			mvid
		}
	})
}
export function getMvRelated(id){
	return pqrequest.get({
		url:'/related/allvideo',
		data:{
			id
		}
	})
}