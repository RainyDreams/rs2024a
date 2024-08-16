<template>
  <div class="commonPage dark bg-slate-900" style="height:calc(100dvh - 0px);display: flex;flex-direction: column;">  
    <routerBack name="项目详情" theme="dark" back="/projects/list"></routerBack>
    <div class="scroll">
      <div class="panel bg-slate-800 text-slate-200">
        <div v-show="!!loading" class=" px-3">
          <el-progress
            :percentage="100"
            :show-text="false"
            :indeterminate="true"
            :duration="2"
            :color="[{ color: '#904df5', percentage: 100 }]"
          />
          <p class="text-sm text-slate-400 mt-3 py-8">正在加载，请等待</p>
        </div>
        <div v-if="!loading" >
          <div class="text-lg md:text-xl lg:text-2xl mb-2">{{ ds.name }}</div>
          <el-collapse class="border-slate-400">
            <el-collapse-item title="详细信息" name="1">
              <div class="mt-1 mb-3 text-base/loose lg:text-lg/loose break-all">{{ ds.desc }}</div>
              <p class="text-xs text-slate-400">创建人</p>
              <div class="flex mt-2 bg-white border rounded-xl w-fit py-2 px-3 mb-3">
                <div class="flex items-center "><el-avatar :src="ds.createUserInfo.avatar" :size="40"></el-avatar></div>
                <div class="flex-1 ml-2">
                  <p class="text-base md:text-lg/tight">{{ ds.createUserInfo.nickname }}</p>
                  <p class="text-xs text-slate-400">用户名：{{ ds.createUserInfo.username }}</p>
                </div>
              </div>
              <div v-if="ds.createuser == user" class="mb-3">
                <el-button type="danger" plain @click="remove">删除讨论</el-button>
              </div>
              <p class="text-xs text-slate-400">创建时间</p>
              <div class="text-base md:text-lg/tight">{{ ds.formatCreateTime }}</div>
            </el-collapse-item>
          </el-collapse>

          <div class="">
            <div v-if="ds.discussion.length==0">
              <p class="text-center py-11">还没有讨论内容</p>
            </div>
            <div class="row" v-else>
              <div class="col-12 col-md-8">
                <div class="border-b py-4 px-5 border-slate-700 flex hover:bg-slate-900 transition-all" v-for="item in ds.discussion">
                  <div class="flex items-top pr-2"><el-avatar :src="item.createUserInfo.avatar" :size="40"></el-avatar></div>
                  <div class="flex-1">
                    <p class="text-base">
                      {{ item.createUserInfo.nickname }}
                      <span class="text-xs text-slate-400">{{ item.createUserInfo.username }}</span>
                    </p>
                    <!--  -->
                    <p class="text-xs text-slate-400">发表时间：{{ item.formatCreateTime }}</p>
                    <div class="mt-2">
                      <div class="text-base md:text-lg/tight">{{ item.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div>
                  <h3 class="text-slate-300 my-3">AI智能总结</h3>
                  <div class="mt-4 text-slate-300">
                    <div v-html="md.render(ai)"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ainput" ref="ainput">
      <div :class="`ainput__wrapper bg-slate-800 text-slate-200`">
        <el-input
          ref="askRef"
          v-model.lazy="input"
          :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea"
          resize="none"
          size="large"
          autofocus
          class="_input text-slate-100"
          :maxlength="1000"
          @keyup="onChange"
          @change="onChange"
          :disabled="loading || loading2"
          :placeholder="placeholder"
          @keydown.enter="handleEnter"
        ></el-input>
        <div class="_number">
          <span class="text-slate-200">{{ now }} / 1000</span>
          <el-button 
            @click="send()" 
            :loading="loading || loading2"
            style="margin-top: 16px;"
            type="primary"
            color="rgba(144, 77, 245,1)"
          >
            发表
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import markdownIt from 'markdown-it';
import routerBack from '../../../components/routerBack.vue'
import { onActivated, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Auth from '../../../utils/auth';
import dayjs from 'dayjs';
import { ElSkeleton,ElProgress,ElAvatar,ElButton, ElMessage, ElMessageBox,ElInput,ElCollapse,ElCollapseItem } from 'element-plus';
import { throttle } from '../../../utils/helpers';
const md = new markdownIt()
const route = useRoute();
const router = useRouter()
const loading = ref(true);
const loading2 = ref(false);
const ds = ref({
  createUserInfo:{

  }
})
const ds_id = ref(route.params.id)
const user = ref()
const askRef = ref();
const placeholder = ref("来发表你的意见");
const input = ref('')
const ainput = ref()
const now = ref(0)
const ai = ref('')
const onFocus = () => {
  throttledScrollToBottom();
}
const onChange = () => {
  now.value = input.value.length
}
const handleEnter = async (event) => {
  if (event.shiftKey) {
    return;
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if(!loading.value){
      // loading.value=true;
      throttledSend()
    }
  }
}
const send = async ()=>{
  loading2.value=true;
  const res = await Auth.addDiscussion({
    id:ds_id.value,
    content:input.value
  })
  if(res.status == 'sus'){
    input.value=''
    now.value=0
    await update()
    ElMessage.success('发表成功')
  } else {
    ElMessage.error('发表失败')
  }
  loading2.value=false;
}
const remove = async () => {
  ElMessageBox.alert('确定删除该讨论？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton: true,
    showClose: false,
    type: 'warning',
    callback: async (action) => {
      if (action == 'confirm') {
        const res = await Auth.removeProjectItem({
          type:'discussion',
          id:ds_id.value
        })
        if(res.status == 'sus'){
          ElMessage.success('删除成功')
          router.back()
        }
      }
    }
  })
}
const update = async () => {
  const res = await Auth.getProjectItemByID({
    type:'discussion',
    id:ds_id.value
  })
  ds.value={
    ...res.content,
    discussion:await Promise.all(res.content.discussion.map(async (e)=>{
      return {
        ...e,
        createUserInfo:await Auth.getUserInfoByID({id:e.user}),
        formatCreateTime:dayjs(e.createtime).format('YYYY年M月DD日 HH:mm:ss')
      }
    })),
    createUserInfo:await Auth.getUserInfoByID({id:res.content.createuser}),
    formatCreateTime:dayjs(res.content.createtime).format('YYYY年M月DD日 HH:mm:ss')
  };
}
const throttledSend = throttle(send, 100);
onActivated(async ()=>{
  await Promise.all([
    (async function(){
      user.value = (await Auth.getUser()).id
      ds_id.value = route.params.id
      await update()
      loading.value=false;
    })(),
    (async function(){
      (await Auth.getDiscussionAnlysis({
        id:ds_id.value
      },{
        onclose:()=>{
          loading2.value = false
        },
        onmessage:(e)=>{
          ai.value += JSON.parse(e).response;
        }
      })).content;
    })()
  ])
})
</script>


<style scoped>
</style>