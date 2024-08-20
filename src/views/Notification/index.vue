<template>
  <div class="bs-container h-full">
    <div class="notificationPage h-full">
      <el-empty :image-size="150" v-if="messageList.length == 0">
        <template #description>
          <p>没有任何通知</p>
        </template>
      </el-empty>   
      <div class="h-full flex flex-col" v-if="messageList.length > 0">
        <div class="border-b py-4 px-5 border-slate-100 flex hover:bg-slate-50 transition-all first:rounded-t-xl last:rounded-b-xl bg-white" v-for="item in messageList">
          <div class="flex items-top pr-2"><el-avatar :src="item.FormatFromUser.avatar" :size="40"></el-avatar></div>
          <div class="flex-1">
            <p class="text-base">
              {{ item.FormatFromUser.nickname }}
              <span class="text-xs text-slate-400 mr-2">{{ item.FormatFromUser.username }}</span>
              <el-tag v-show="item.is_read !== 'false'">已读</el-tag>
            </p>       
            <p class="text-xs text-slate-400">通知时间：{{ item.formatCreateTime }}</p>
            <div class="mt-2">
              <div class="text-base md:text-lg/tight">{{ item.title }}</div>
              <div class="text-base/tight mb-2" v-html="item.content"></div>
              <div class="flex " v-if="item.actions" >
                <el-button @click="action.fn" v-for="(action) in item.actions">{{ action.text }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onActivated, ref } from 'vue';
import Auth from '../../utils/auth';
import { dayjs, ElButton,ElEmpty, ElMessage,ElTag,ElAvatar } from 'element-plus';
import jsCookie from 'js-cookie';
const messageList = ref([]);
let messageList_ = []
async function changePage (index){
  messageList.value = await Promise.all(messageList_[index].list.map(async (e)=>{
    return await renderMessage(e)
  }))
}
async function renderMessage (message){
  const {content,time} = message;
  if(content.type == 'function'){
    if(content.functionID == 'apply_to_join_team'){
      const targetUser = (await Auth.getUserInfo({uid:content.data.userid})).content;
      return {
        time:dayjs(time).format('YYYY年M月DD日 HH:mm:ss'),
        title:content.title,
        content:`<div><img src="${targetUser.avatar}" class="rounded-full size-8 inline-block mr-2"/>${targetUser.nickname}申请加入团队</div>`,
        actions:content.actions.map((e)=>{
          return {
            text:{confirm:'接受',reject:'拒绝'}[e.type],
            fn:function(){
              jsCookie.set('apply_join_team_id',content.data.teamid)
              jsCookie.set('apply_join_team_user',content.data.userid)
              jsCookie.set('apply_join_team_note',content.sessionID)
              return Auth.openWindow(e.url,()=>{})
            }
          }
        })
      }
    }
  } else if (content.type == 'text') {
    return {
      time:dayjs(time).format('YYYY年M月DD日 HH:mm:ss'),
      title:content.title,
      text:content.text || '',
      actions:content.links.map(e=>{
        return {
          text:e.text,
          fn:function(){
            window.location.href = e.url
          }
        }
      })
    }
  }
}
onActivated(async ()=>{
  const {content} = await Auth.getNotification();
  messageList.value = await Promise.all(content.map(async (e,i)=>{
    return {
      ...await renderMessage(e),
      from_user:e.from_user,
      formatCreateTime:dayjs(e.time).format('YYYY年M月DD日 HH:mm:ss'),
      is_read:e.is_read,
      id:e.id,
      FormatFromUser:{
        avatar:'',
        nickname:'',
        username:''
      }
    }
  }))
  messageList.value.map(async (e,i)=>{
    Auth.mainTaskThread.add(async ()=>{
      // console.log(messageList.value,i,)
      // debugger;
      messageList.value[i].FormatFromUser= await Auth.getUserInfoByID({id:e.from_user})
    })
  })
  
  // await Promise.all(content.map(async (e)=>{
  //   const res = await Auth.readNotification({
  //     list:e.map(e=>e.id)
  //   })
  //   if(res.status == 'sus'){

  //   } else {
  //     ElMessage.error('网络错误')
  //   }
  // }))
  
})
</script>