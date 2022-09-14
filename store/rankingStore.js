import {HYEventStore} from 'hy-event-store'
import { getPlayListDetail } from '../services/music'

const rankingsIdsMap = {
  newRanking:3779629,
  orginRanking:2884035,
  upRanking:19723756
}
const rankingStore = new HYEventStore({
  state:{
    newRanking:{},
    orginRanking:{},
    upRanking:{}
  },
  actions:{
    fetchRankingDataAction(ctx){
      for (const key in rankingsIdsMap) {
        const id = rankingsIdsMap[key]
        getPlayListDetail(id).then((res)=>{
            ctx[key] = res
        })
      }
    }
  }
})

export {
  rankingStore
}
