<template>
  <div class="bs-container h-full">
    <div class="notificationPage h-full py-16">
      <div class="bg-white h-full rounded-3xl flex overflow-x-hidden border overflow-y-auto">
        <ul class="w-100 bg-slate-50 border-r">
          <li @click="changePage(index)" v-for="(item,index) in userList" class="cursor-pointer border-b px-4 py-2 text-xl">{{ item }}</li>
        </ul>
        <div class="flex-1 bg-white p-4">
          <div class="message">
            <div class="message-item py-4 border-b" v-for="(item,index) in messageList">
              <div class="">{{ item.title }}</div>
              <div class="" v-html="item.content"></div>
              <div class="" v-if="item.actions" v-for="(action) in item.actions">
                <el-button @click="action.fn">{{ action.text }}</el-button>
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
import { ElButton } from 'element-plus';
import jsCookie from 'js-cookie';
const userList = ref([]);
const messageList = ref([]);
let messageList_ = []
function changePage (index){
  messageList.value = messageList_[index].list
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
})
</script>