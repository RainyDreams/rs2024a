<template>
  <div class="commonPage">
    <routerBack name="上一页" ></routerBack>
    <div class="row">
      <div class="col-md-12 col-lg-8">
        <div class="panel">
          <div class="_header">
            <div class="icon"><Peoples theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">零本智协统一身份验证 测试用户创建通道</div>
          </div>
          <div class="_content">
            <el-alert type="info" show-icon :closable="false" style="margin-bottom: 8px;">
              <!-- <p>版权说明：本项目的注册登录（身份验证系统）为本研究性学习团队原创</p> -->
              <p>推荐使用电脑访问</p>
            </el-alert>
            <!-- <el-alert type="warning" show-icon :closable="false" style="margin-bottom: 16px;"> -->
              <!-- <p>目前仅支持对于本研究性学习项目进行预览的老师和学生账户注册</p> -->
              <!-- <p>我们在项目预览期间，可以在不告知的情况下注销测试账户，注销后会删除与此账户所有关联的项目、团队、任务、工作流等</p> -->
            <!-- </el-alert> -->
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
              <el-form-item label="账户类别" prop="type">
                <el-select
                  v-model="form.type"
                  placeholder="请选择"
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" name="username" placeholder="输入用户名，全局唯一凭据" autofocus />
              </el-form-item>
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="form.nickname"/>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请设置一个较强的密码"/>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="form.password2" type="password" placeholder="再次输入密码"/>
              </el-form-item>
              <el-form-item label="备注（非必填）" prop="note">
                <el-input v-model="form.note" autosize type="textarea" placeholder="可以填写你注册此项目账户的目的，你是哪位老师/学生，方便我们识别" autofocus />
              </el-form-item>
              <div id="turnstile-box"></div>
              <el-form-item style="margin-top: 16px;">
                <el-button :loading="formloading" type="primary" @click="submitForm(ruleFormRef)">
                  创建临时账户
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
import { ref,onMounted,reactive, onActivated, onDeactivated } from 'vue'
import { Peoples } from '@icon-park/vue-next'; 
import Auth from "../../utils/auth.js";
import routerBack from '/src/components/routerBack.vue'
import { ElMessage,ElForm, ElFormItem,ElInput,ElButton,ElAlert, ElMessageBox,ElSelect,ElOption} from 'element-plus';
import CryptoJS from 'crypto-js';
import { useRouter } from 'vue-router';
const ruleFormRef = ref(null);
const formloading = ref(false);
const router = useRouter()
const form = reactive({
  username: '',
  nickname: '',
  password: '',
  password2: ''
});
const options = [
  { value: 'teacher', label: '赤峰二中教师' },
  { value: 'student24', label: '赤峰二中24级学生' },
  { value: 'student23', label: '赤峰二中23级学生' },
  { value: 'student22', label: '赤峰二中22级学生' },
  { value: 'social', label: '社会人员' },
  { value: 'guest', label: '其他访客' },
]
const rules = reactive({
  type: [
    { required: true, message: '请选择账户类别', trigger: 'change' }
  ],
  username: [
    { type: 'string', pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '用户名必须以字母开头且只能包含字母、数字和下划线', trigger: 'change' },
    { required: true, message: '请输入用户名（唯一登录凭据）', trigger: 'change' },
    { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' },
    {
      validator: async (rule, value, callback) => {
        if(!value) return;
        try {
          const isValid = (await Auth.checkUsername(value)).content.verified;
          // // console.log(isValid);
          if (isValid) {
            callback();
          } else {
            callback(new Error('用户名已被占用'));
          }
        } catch (error) {
          callback(new Error('验证失败（网络错误）'));
        }
      },
      trigger: 'blur'
    }
  ],
  nickname: [
    // 必须是中文数字字母以及常见的符号
    { type: 'string', pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '用户昵称应符合中文、字母、数字和下划线', trigger: 'change' },
    { required: true, message: '请输入用户昵称', trigger: 'change' },
    { min: 3, max:20, message: '长度在 3 到 25 个字符', trigger: 'change'}
  ],
  password: [
    { type: 'string', pattern: /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,20}$/, message: '密码必须严格包含大小写字母、数字、特殊字符至少3个组合，且长度在 8 到 20 个字符', trigger: 'blur' },
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  password2: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ]
})


const submitForm = (formEl) => {
  if (!formEl) return;
  formloading.value = true;
  formEl.validate(async (valid) => {
    if (valid) {
      ElMessage.info('正在进行人机验证')
      const verifyToken = await Auth.getRecaptchaToken({action:'signup',id:'#turnstile-box'})
      ElMessage.info('正在注册')
      const encode = CryptoJS.MD5(form.username+form.password).toString().toUpperCase();
      const createTeam = await Auth.userRegister({
        username:form.username,
        nickname:form.nickname,
        info:{identityNote:form.note,identityType:form.type},
        password:encode,
        avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        token:verifyToken
      })
      if(createTeam.status == 'sus'){
        window.clarity("identify", createTeam.content.id, createTeam.content.sessionID,'register',createTeam.content.id)
        form.username = '';
        form.nickname = '';
        form.password = '';
        form.note = '';
        form.type = '';
        ElMessageBox.alert('注册成功，将前往登录页面', '提示', {}).then(() => {
          // window.location.href = 'https://auth.chiziingiin.top/newreg'
          router.push('/login')
        })
      } else {
        turnstile.remove('#turnstile-box')
        ElMessage({
          message: '创建失败',
          type: 'error',
        })
      }
      formloading.value=false;
    } else {
      turnstile.remove('#turnstile-box')
      // // console.log('error submit!')
      formloading.value=false;
      return false;
    }
  })
}

</script>
