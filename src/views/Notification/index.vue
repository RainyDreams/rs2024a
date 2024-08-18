<template>
  <div class="bs-container h-full">
    <div class="notificationPage h-full py-16">
      <el-empty :image-size="150" v-if="userList.length == 0">
        <template #description>
          <p>没有任何通知</p>
        </template>
      </el-empty>   
      <div class="bg-white h-full rounded-3xl flex overflow-x-hidden border overflow-y-auto" 
      v-if="userList.length > 0">
        <ul class="w-100 bg-slate-50 border-r px-4 py-4">
          <li @click="changePage(index)" v-for="(item,index) in userList" class="cursor-pointer hover:bg-slate-200 transition-all rounded-lg px-2 mb-2 last:mb-0 py-1 text-xl">{{ item }}</li>
        </ul>
        <div class="flex-1 bg-white p-4">
          <div class="message">
            <div class="message-item py-4 border-b" v-for="(item,index) in messageList">
              <div class="text-lg mb-1">
                {{ item.title }}
                <el-tag v-show="item.is_read == 'true'">已读</el-tag>
              </div>
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
import { ElButton,ElEmpty, ElMessage,ElTag } from 'element-plus';
import jsCookie from 'js-cookie';
const userList = ref([]);
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
  userList.value = content.map((e)=>{
    return e.from_user
  });
  messageList_ = content;
  messageList.value = await Promise.all(content[0].list.map(async (e)=>{
    return await renderMessage(e)
  }))
  
  await Promise.all(content.map(async (e)=>{
    const res = await Auth.readNotification({
      list:e.list.map(e=>e.id)
    })
    if(res.status == 'sus'){

    } else {
      ElMessage.error('网络错误')
    }
  }))
  
})
</script>