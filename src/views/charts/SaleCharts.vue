<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="24">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
        <el-radio-group v-model="chartType" @change="chartTypeChange" size="small">
            <el-radio-button :label='7'>7天</el-radio-button>
            <el-radio-button :label="30">30天</el-radio-button>
            <el-radio-button :label="365">全年</el-radio-button>
        </el-radio-group>

        <el-radio-group v-model="month" v-if="chartType==365" style="margin-left:50px" @change="getMonths" size="small">
            <el-radio-button :label="0">全部</el-radio-button>
            <el-radio-button v-for="index in 12" :key='index' :label='index'>{{index}}月</el-radio-button>
        </el-radio-group>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartType:7,
                month:0,
                chartLine: null,
                chartLineData:null
            }
        },

        methods: {
            drawLineChart() {
                this.chartLineData={
                    title: {
                        text: 'Line Chart',
                        show:false
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['销售额','订单数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:[]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '销售额',
                            type: 'line',
                            stack: '总量1',
                            data: []
                        },
                        {
                            name: '订单数',
                            type: 'line',
                            stack: '总量2',
                            data: []
                        }
                    ]
                };
            },
            getDays(maxDate){
                var day=24*3600*1000;
                var data=[];
                for(var i=0;i<this.chartLineData.series[0].data.length;i++){
                    var d=new Date(maxDate.getTime()-day*i);
                    data.unshift((d.getMonth()+1)+"-"+d.getDate());
                }
               return data;
            },
            chartTypeChange(val){
                if(val==365){
                    this.month=0;
                    this.getMonths(this.month);
                    return;
                }
                var sale=[];
                var order=[];
                for(var i=0;i<val;i++){
                    sale.unshift(200+Number.parseInt(Math.random()*1000));
                    order.unshift(10+Number.parseInt(Math.random()*100));
                }
                this.chartLineData.series[0].data=sale;
                this.chartLineData.series[1].data=order;
                this.chartLineData.xAxis.data=this.getDays(new Date());
                this.chartLine.setOption(this.chartLineData);
            },
            getMonths(val){
                var sale=[];
                var order=[];
                var xdata=[];
                if(val==0){
                    for(var i=0;i<12;i++){
                        sale.unshift(200+Number.parseInt(Math.random()*1000*30));
                        order.unshift(10+Number.parseInt(Math.random()*100*30));
                        xdata.push((i+1)+"月");
                    }
                }else{
                    var year=2018;
                    var m=val+1;
                    if(val==12){
                        year++;
                        m=1;
                    }
                    var d1=new Date(year+"-"+m+"-1");
                    var month=val-1;
                    var day=24*3600*1000;
                    d1=new Date(d1.getTime()-day);
                    do{
                        sale.unshift(200+Number.parseInt(Math.random()*1000));
                        order.unshift(10+Number.parseInt(Math.random()*100));
                        xdata.unshift(d1.getDate()+"日");
                        d1=new Date(d1.getTime()-day);
                    }while(d1.getMonth()==month);
                }
                this.chartLineData.series[0].data=sale;
                this.chartLineData.series[1].data=order;
                this.chartLineData.xAxis.data=xdata;
                this.chartLine.setOption(this.chartLineData);
            }
        },
        mounted: function () {
            this.chartLine = echarts.init(document.getElementById('chartLine'));
            this.drawLineChart();
            this.chartTypeChange(this.chartType);
        }
    }
</script>

<style scoped>
</style>
