import { HYEventStore } from "hy-event-store";
import { getPlayListDetail } from "../services/music";

const recommendStore = new HYEventStore({
  state: {
    recommendInfo: [],
  },
  actions: {
    async fetchRecommendSongsActions(ctx) {
      const songsRes = await getPlayListDetail(3778678);
			ctx.recommendInfo = songsRes;
    },
  },
});

export { recommendStore };
