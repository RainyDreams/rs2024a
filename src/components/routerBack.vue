<template>
  <div class="routerBack" @click="routerBack" >
    <Left theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/>
    <p>返回{{ props.name }}</p>
  </div>
</template>
<style scoped>
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
  margin-bottom: 12px;
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
<script setup>
import { Left } from '@icon-park/vue-next';
import { useRouter } from 'vue-router';
// 接受:name传值
const router = useRouter()
const props = defineProps({
  name: {
    type: String,
    default: '上一页'
  },
  back: {
    type: String,
    default: ''
  }
})
const routerBack = () => {
  if(props.back){
    router.push(props.back)
  } else {
    router.back()
  }
}
</script>