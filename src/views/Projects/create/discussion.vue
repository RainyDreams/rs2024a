<template>
  <el-form 
    :model="form" 
    label-width="auto" 
    style="max-width: 600px"
    :rules="rules"
    ref="ruleFormRef"
    status-icon
    label-position="top"
    :inline-message="true"
  >
    <el-form-item label="讨论主题" prop="name">
      <el-input v-model="form.name" autofocus />
    </el-form-item>
    <el-form-item label="描述一下具体讨论的话题或方向" prop="desc">
      <el-input
        v-model="form.desc"
        :autosize="{ minRows: 2, maxRows: 4 }"
        maxlength="100"
        show-word-limit
        type="textarea"
        placeholder="描述一下具体讨论的话题或方向"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)">
        创建讨论
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage,ElForm,ElFormItem,ElButton,ElSelect,ElInput,ElDatePicker,ElOption,ElAvatar, ElMessageBox } from "element-plus"
import Auth from "../../../utils/auth";
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref(null)
const form = reactive({
  name: "",
  desc: "",
  members: [],
  discussion:[]
})
const loading = ref(false)
const rules = reactive({
  name: [
    { required: true, message: "请输入讨论主题", trigger: "blur" },
    { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" }
  ],
  desc: [
    { required: true, message: "请描述一下具体讨论的话题或方向", trigger: "blur" },
    { min: 3, max: 100, message: "长度在 3 到 100 个字符", trigger: "blur" }
  ],
})
const persons = ref([])
const projectId = ref('')
onMounted(async ()=>{
  await Auth.getPrtoken();
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectDetail({id:projectId.value})
  if(res.status == 'sus'){
    // projectDetail.value = res.content;
    // // console.log(res.content)
    persons.value = res.content.persons.map((item)=>{
      return {label:item.nickname,value:item.id,avatar:item.avatar}
    })
  }
})
async function submitForm(formEl) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const res = await Auth.createProjectItem({
        type:"discussion",
        projectId:projectId.value,
        ...form
      })
      if(res.status == 'sus'){
        ElMessageBox.alert('创建成功','提示' , {
          confirmButtonText: '确定',
          showClose:false,
          callback: action => {
            router.push({
              path: '/projects/detail/'+projectId.value,
            })
          }
        })
      } else {
        ElMessage.error('创建错误')
      }
      loading.value = false;
    }
  })
}
</script>