<template>
  <el-form 
    label-position="top"
    :model="form" 
    label-width="auto" 
    style="max-width: 600px"
    :rules="rules"
    ref="ruleFormRef"
    status-icon
    :inline-message="true"
    size="large"
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
        placeholder="简单概括一下任务的具体内容"
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
        placeholder="选择日期时间"
      />
    </el-form-item>
      <el-form-item label="参与人员" prop="members">
        <el-select
          v-model="form.members"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择参与人员"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        创建{{ type }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
const router = useRouter()
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
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
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
const options = [
  { value: "zhinan", label: "指南" },
  { value: "shejiyuanze", label: "设计原则" },
  { value: "daohang", label: "导航" },
  { value: "icon", label: "图标" },
  { value: "components", label: "组件" },
  { value: "changyong", label: "常用" },
]
const type = ref('')
function submitForm(formEl) {
  if (!formEl) {
    return
  }
}
</script>