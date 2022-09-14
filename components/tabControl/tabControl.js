// components/tabControl/tabControl.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        listData:{
            type:Array,
            value:[]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentIndex:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onItemTap(e){
            this.setData({
                currentIndex:e.currentTarget.dataset.index
            })
            this.triggerEvent('indexChange',this.data.currentIndex)
        },
        changeCurrentIndex(index){
            this.setData({
                currentIndex:index
            })
        }
    }
})
