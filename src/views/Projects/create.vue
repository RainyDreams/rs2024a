<template>
  <div class="commonPage">
    <div class="container">
      <div class="panel">
        <div class="_header">
          <div class="icon"><file-addition theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
          <div class="title">创建项目</div>
        </div>
        <div class="_content">
          <el-form 
            :model="form" 
            label-width="auto" 
            style="max-width: 600px"
            :rules="rules"
            ref="ruleFormRef"
            status-icon
          >
            <el-form-item label="项目名称">
              <el-input v-model="form.name" autofocus />
            </el-form-item>
            <el-form-item label="项目描述">
              <el-input
                v-model="form.desc"
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="30"
                show-word-limit
                type="textarea"
                placeholder="简单概括一下你们的项目"
              />
            </el-form-item>
            <el-form-item label="参与团队">
              <el-select v-model="form.team" placeholder="选择参与项目的团队">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="Resources">
              <el-radio-group v-model="form.resource">
                <el-radio border value="Sponsor">公开可见</el-radio>
                <el-radio border value="Venue">项目内部</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(ruleFormRef)">
                创建项目
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileAddition } from '@icon-park/vue-next'; 
import { reactive,ref } from 'vue'
const ruleFormRef = ref(null);
//自动生成form和rules
const form = ref({
  name: '',
  desc: '',
  team: '',
  resource: ''
});
const rules = ref({
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入项目描述', trigger: 'blur' },    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  team: [
    { required: true, message: '请选择参与团队', trigger: 'change' }
  ],
  resource: [
    { required: true, message: '请选择项目可见性', trigger: 'change' }
  ]
})
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

