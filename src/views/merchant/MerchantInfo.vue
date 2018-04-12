<template>
	<section>
		<!--工具条-->
        <el-form>
            <el-form-item label="商户名称">
            </el-form-item>

        </el-form>
	
	</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import * as Api from '../../api/api.js'


export default {
	data() {
		return {

            merchantModel:{


            }
		
		}
    },
    methods:{

        loadData(){

        }

    },
	mounted() {
        
        this.loadData()
	
	}
}

</script>

<style scoped>

</style>