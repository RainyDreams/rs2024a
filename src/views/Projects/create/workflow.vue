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
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="form.name" autofocus />
    </el-form-item>
    <el-form-item label="任务内容" prop="desc">
      <el-input
        v-model="form.desc"
        :autosize="{ minRows: 2, maxRows: 4 }"
        maxlength="100"
        show-word-limit
        type="textarea"
        placeholder="描述一下任务的具体内容"
      />
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker
        v-model="form.startTime"
        type="datetime"
        placeholder="选择日期时间"
      />
    </el-form-item>
    <el-form-item label="截止时间" prop="endTime">
      <el-date-picker
        v-model="form.endTime"
        type="datetime"
        :editable="false"
        placeholder="选择日期时间"
      />
    </el-form-item>
      <el-form-item label="参与人员" prop="members">
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
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        创建任务
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
  startTime: "",
  endTime: "",
  members: []
})
const rules = reactive({
  name: [
    { required: true, message: "请输入任务名称", trigger: "blur" },
    { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" }
  ],
  desc: [
    { required: true, message: "请输入任务内容", trigger: "blur" },
    { min: 3, max: 100, message: "长度在 3 到 100 个字符", trigger: "blur" }
  ],
  startTime: [
    { required: true, message: "请选择开始时间", trigger: "change" }
  ],
  endTime: [
    { required: true, message: "请选择截止时间", trigger: "change" }
  ],
  members: [
    { required: true, message: "请选择参与人员",trigger: "change" }
  ]
})
const persons = ref([])
const projectId = ref('')
onMounted(async ()=>{
  await Auth.getPrtoken();
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectDetail({id:projectId.value})
  if(res.status == 'sus'){
    // projectDetail.value = res.content;
    console.log(res.content)
    persons.value = res.content.persons.map((item)=>{
      return {label:item.nickname,value:item.id,avatar:item.avatar}
    })
  }
})
async function submitForm(formEl) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await Auth.createProjectItem({
        type:"workflow",
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
      }
    }
  })
}
</script>