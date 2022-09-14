
const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricString){
	const lyricInfos = []
	// 1.切割
	const array = lyricString.split("\n")
	// 2.转化
	for (const lineString of array) {
		// 因为在结束时也有'/n'，所以最后一个空字符串应该跳过
		if(lineString.length === 0) continue
	 const results =timeReg.exec(lineString)
	//  字符串隐式转化为数字
	 const minute = results[1] * 60 *1000
	 const second = results[2] * 1000
	 const millisecond = results[3].length === 3 ?  results[3] * 1 : results[3]*10
	 const time = minute + second + millisecond
	//  替换掉匹配的时间字符串，剩下的就是文本
	const text = lineString.replace(timeReg,'')
		lyricInfos.push({
			text,
			time
		})
	}
	return lyricInfos
}