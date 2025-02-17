<template>
  <div class="flex mb-3">
    <div :class="`routerBack shrink-0 mr-2 ${(props.theme=='dark')?'bg-slate-700 text-slate-400 hover:bg-slate-800':''}`" @click="routerBack" >
      <Left theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/>
      <p>返回{{ props.name }}</p>
    </div>
    <!-- <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item>homepage</el-breadcrumb-item>
    </el-breadcrumb> -->
  </div>
</template>
<script setup>
import { Left } from '@icon-park/vue-next';
import { useRouter } from 'vue-router';
import { ElBreadcrumb,ElBreadcrumbItem } from 'element-plus';
const router = useRouter()
const props = defineProps({
  name: {
    type: String,
    default: '上一页'
  },
  back: {
    type: String,
    default: ''
  },
  theme:{
    type: String,
    default: 'light'
  }
})
// // console.log(props.back)
const routerBack = () => {
  if(props.back){
    router.push(props.back)
  } else {
    router.back()
  }
}
</script>

<style>
.routerBack {
  display: flex;
  /* align-items: center; */
  font-size: 0;
  font-weight: 600;
  color: #5F6388;
  cursor: pointer;
  background-color: #fff;
  padding:8px 12px;
  width:fit-content;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.routerBack:hover {
  background-color:#eff1f4;
}
p{
  margin-left: 4px;
  font-size: 14px;
  letter-spacing: 1px;
}
</style>