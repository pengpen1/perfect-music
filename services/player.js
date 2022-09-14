import {pqrequest} from './request/index'

export function getSongDetail(ids){
	return pqrequest.get({
		url:"/song/detail",
		data:{
			ids
		}
	})
}

export function getSongLyric(id){
	return pqrequest.get({
		url:"/lyric",
		data:{
			id
		}
	})
}