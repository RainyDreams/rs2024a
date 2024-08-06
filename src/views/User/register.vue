<template>
  <div class="commonPage">
    <div class="row">
      <div class="col-md-12 col-lg-8">
        <div class="panel">
          <div class="_header">
            <div class="icon"><Peoples theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">创建用户</div>
          </div>
          <div class="_content">
            <el-alert type="error" show-icon :closable="false" style="margin-bottom: 16px;">
              <p>目前仅支持测试用户注册，账户有效期1小时，1小时后自动注销</p>
            </el-alert>
            <el-form 
              :model="form" 
              label-width="auto" 
              style="max-width: 600px"
              :rules="rules"
              ref="ruleFormRef"
              status-icon
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" autofocus />
              </el-form-item>
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="form.nickname"/>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password"/>
              </el-form-item>
              <el-form-item>
                <el-button :loading="formloading" type="primary" @click="submitForm(ruleFormRef)">
                  创建团队
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted,reactive } from 'vue'
import { Peoples } from '@icon-park/vue-next'; 
import Auth from "../../utils/auth.js";
import { ElMessage,ElForm, ElFormItem,ElInput,ElButton,ElAlert,ElDialog,} from 'element-plus';
const inputRef = ref(null);
const inputValue = ref('');
const dialogTableVisible = ref(false)
const ruleFormRef = ref(null);
const formloading = ref(false);
const form = reactive({
  username: '',
  nickname: '',
  password: ''
});
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 3, max:20, message: '长度在 3 到 20 个字符',}
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})


const submitForm = (formEl) => {
  if (!formEl) return;
  formloading.value = true;
  formEl.validate(async (valid) => {
    if (valid) {
      // const prtoken = // await // Auth.getPrtoken();
      const createTeam = await Auth.userRegister({
        username:form.username,
        nickname:form.nickname,
        password:form.password
      })
      if(createTeam.status == 'sus'){
        inputValue.value = createTeam.content.inviteurl;
        dialogTableVisible.value = true;
        form.name = '';
        form.desc = '';
        // localStorage.setItem('teamInfo',{teamId:createTeam.content.teamid,teamInviteurl:createTeam.content.inviteurl});
        ElMessage({
          message: '创建成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: '创建失败',
          type: 'error',
        })
      }
      formloading.value=false;
    } else {
      console.log('error submit!')
      formloading.value=false;
      return false;
    }
  })
}

</script>

