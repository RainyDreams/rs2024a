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
    <el-form-item label="问题名称" prop="name">
      <el-input v-model="form.name" autofocus />
    </el-form-item>
    <el-form-item label="问题涉及人员" prop="members">
      <el-select
        v-model="form.members"
        multiple 
        placeholder="请选择参与人员"
      >
        <el-option
          v-for="item in persons"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div class="" style="display:flex;align-items: center;">
            <el-avatar alt="头像" :size="22" :src="item.avatar"></el-avatar>
            <span>{{ item.label }}</span>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="问题描述" prop="desc">
      <el-input
        v-model="form.desc"
        :autosize="{ minRows: 2, maxRows: 4 }"
        maxlength="100"
        show-word-limit
        type="textarea"
        placeholder="描述一下问题的具体内容"
      />
    </el-form-item>
    <el-form-item label="问题出现时间" prop="startTime">
      <el-date-picker
        v-model="form.startTime"
        type="datetime"
        placeholder="选择日期时间"
      />
    </el-form-item>
    <el-form-item label="标签" prop="tags">
      <el-tag
        v-for="tag in form.tags"
        :key="tag"
        closable
        size="large"
        :disable-transitions="false"
        class="mr-2"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="mt-2"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag"  @click="showInput">
        + 新标签
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)">
        提出问题
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated,nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage,ElTag,ElForm,ElFormItem,ElButton,ElSelect,ElInput,ElDatePicker,ElOption,ElAvatar, ElMessageBox } from "element-plus"
import Auth from "../../../utils/auth";
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref(null)
const form = reactive({
  name:'',
  members:[],
  desc:'',
  startTime:'',
  tags:[]
})
const loading = re(false);
const rules = reactive({
  name: [
    { required: true, message: '请输入问题名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  members: [
    { required: true, message: '请选择参与人员', trigger: 'change' }
  ],
  desc: [
    {required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择问题出现时间', trigger: 'change' }
  ],
  tags: [
    { required: true, message: '请设置标签', trigger: 'change' }
  ]
})
const persons = ref([])
const projectId = ref('')
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()
onMounted(async ()=>{
  await Auth.getPrtoken();
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectDetail({id:projectId.value})
  if(res.status == 'sus'){
    // // console.log(res.content)
    persons.value = res.content.persons.map((item)=>{
      return {label:item.nickname,value:item.id,avatar:item.avatar}
    })
  }
})
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    form.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
async function submitForm(formEl) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const res = await Auth.createProjectItem({
        type:"issue",
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
        ElMessage.error('创建失败')
      }
      loading.value = false;
    }
  })
}
</script>