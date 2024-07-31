<template>
  <div class="commonPage">  
    <div class="panel">
      <div class="chatList" style="min-height: 200px;">
        <div >
          <template v-for="(item,i) in chatList" class="chatList">
            <p class="user" v-if="item.role == 'user'">{{ item.content }}</p>
            <p class="assistant" v-if="item.role == 'assistant'">{{ item.content }}</p>
          </template>
          
        </div>
      </div>
      <div class="input" style="display: flex;">
        <el-input v-model="input" :disabled="loading"></el-input>
        <el-button @click="send()" :loading="loading">发送</el-button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.chatList{
  padding-bottom: 16px;
}
.chatList p{
  margin-bottom: 6px;
  font-size: 14px;
}
.user::before{
  content: "用户：";
  color: #409EFF;
}
.assistant::before{
  content: "助手：";
  color: #67C23A;
}
</style>
<script setup>
import { onActivated, onMounted, ref } from "vue"
import Auth from "../../utils/auth";
import { ElInput,ElButton,ElMessage } from "element-plus"; 
const messages = ref([]);
const chatList = ref([
  { role: "system", content: `### 指令 你被设定为一个能够准确理解和生成高质量中文内容的大规模语言模型，你叫赤子英金AI助手。你的任务是在中文语境下回答问题或者和用户聊天，并且需要确保回答的准确性和严谨性。请严格按照以下要求执行： 1. **语言要求**：所有回答必须使用标准的现代汉语，且语法正确、表达清晰。 2. **内容要求**： - 提供详细且准确的信息。 - 避免使用模糊不清的表述。 - 对于技术性问题，确保术语的准确性。 - 如果有数据支持，请引用可靠的来源。 3. **格式要求**： - 使用段落分隔不同的论点或信息块。 - 使用列表来组织相关项目或步骤。 - 在回答的结尾总结主要观点。 #### 回答要求 - 请在回答中使用正式的语言风格，并确保语法准确无误，一定要检查回答的内容，不要回答乱码。 ### 结束语 请按照上述要求，使用中文详细回答用户的问题或者和用户合理的聊天。如果有任何不确定的地方，请明确指出并提供可能的解决方案。`},
]);
const input = ref("你好");
const chatID = ref("")
const loading = ref(true)
const send = async ()=>{
  if(input.value == '') {
    ElMessage.warning("请输入内容")
    return;
  }
  loading.value = true;
  chatList.value.push({
    role: "user",
    content: input.value
  })
  chatList.value.push({
    role: "assistant",
    content: ""
  })
  input.value = ''
  const index = chatList.value.length - 1;
  await Auth.chatWithAI(chatList.value,{
    onmessage:(event,source) => {
      console.log(event.data,event.data == '[DONE]')
      if(event.data != '[DONE]'){
        chatList.value[index].content+=JSON.parse(event.data).response;
      } else {
        source.close();
      }
      loading.value = false;
    },
  })
}
onMounted(async ()=>{
  // loading.value = false;
  await send()
  // chatID.value = await Auth.getChatID(
  // chatID.value = await Auth.getChatID();
})
</script>