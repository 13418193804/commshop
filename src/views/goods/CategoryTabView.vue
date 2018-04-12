<template>
    <div>

        <div style="margin-bottom:20px;">

            <span style="width:100px;"> 主类：</span>
            <el-cascader style="width:300px;" placeholder="选择分类" v-model="catIdList1" :options="options" filterable @change="doSelect(1)"></el-cascader>
        </div>

        <div style="margin-bottom:20px;">
            <span style="width:100px;"> 次类：</span>
            <el-cascader style="width:300px;" placeholder="选择分类" v-model="catIdList2" :options="options" filterable @change="doSelect(2)"></el-cascader>
        </div>

        <div>
            <span style="width:100px;"> 其他：</span>
            <el-cascader style="width:300px;" placeholder="选择分类" v-model="catIdList3" :options="options" filterable @change="doSelect(3)"></el-cascader>
        </div>

    </div>
</template>

<script>
import util from '../../common/js/util'
import * as Api from '../../api/api.js'


export default {
    data() {
        return {
            catIdList1: [""],
            catIdList2: [""],
            catIdList3: [""],
            options: [{ value: "111", label: "最新分类" }, { value: "222", label: "最新分类2" }, { value: "333", label: "最新分类333" }]

        }
    },

    updated() {
    },
    activated() {

    },
    mounted() {

        Api.requestQueryTree().then(res => {
            this.options = res.data.children

        })

        console.log("maount ==========")

        console.log(this.catIdOne)
        console.log(this.catIdTwo)
        console.log("xxxxxxxxxxmaount ==========")
     




    },
    watch: {

        catIdOne() {
           console.log("==============")
      
            console.log("idone="+this.catIdOne)

            Api.requestParenttCat(this.catIdOne).then(res=>{

                this.catIdList1 = res.data;
            })






        },
        catIdTwo() {
                 
            console.log("idtwo="+this.catIdTwo)
            this.catIdList2.push(this.catIdTwo)

            Api.requestParenttCat(this.catIdTwo).then(res=>{

                this.catIdList2 = res.data;
            })


 
        },
        catIdThree() {
            console.log("id3"+this.catIdThree)

            Api.requestParenttCat(this.catIdThree).then(res=>{

                this.catIdList3 = res.data;
            })

        }


    },
    props: ['catIdOne', 'catIdTwo', 'catIdThree'],
    methods: {

        doSelect(index) {

            let catId = "";
            if (index == 1) {

                console.log(this.catIdList1)

                catId = this.catIdList1[this.catIdList1.length- 1];
            }

            if (index == 2) {

                catId = this.catIdList2[this.catIdList2.length - 1];
            }

            if (index == 3) {

                catId = this.catIdList3[this.catIdList3.length - 1];
            }

            this.$emit("change", index,catId)

        },

    }
}


</script>

<style scoped>
.sku-attr-layout {
    display: flex;
    width: 90%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-left: 40px;
    align-items: center;
}
</style>
