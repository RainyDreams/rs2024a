<template>
  <div class="flex flex-col md:flex-row h-full">
    <div class="text-white px-5 pt-4 bg-blue-800 flex flex-col md:justify-center md:w-6/12 md:px-16">
      <h1 class="text-2xl font-semibold mb-3 md:text-6xl/tight md:mb-6">零本智协项目统一身份验证</h1>
      <h5 class="hidden md:block md:text-6xl font-semibold mb-20">登录平台</h5>
    </div>
    <div class="flex-1 px-6 py-9 flex flex-col bg-white md:px-20 xxl:px-28">
      <h2 class="text-4xl mb-9 text-blue-900 font-semibold mt-3 md:mt-16 md:text-5xl">欢迎！</h2>
      <el-form 
        :model="form" 
        label-width="auto"
        :rules="rules"
        ref="ruleFormRef"
        status-icon
        size="large"
        class="big_input flex-1"
        label-position="top"
        :inline-message="true"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="输入用户名，全局唯一凭据" autofocus />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
        </el-form-item>
        <div id="turnstile-box"></div>
        <div class="text-slate-400 text-xs/tight mt-2">登录即代表同意<a target="_blank" href="https://www.chiziingiin.top/license/auth">《零本智协统一身份验证用户协议》</a></div>
        <div class="text-slate-400 text-xs/tight mt-2">没有账号？前往<router-link to="/reg">用户注册平台</router-link></div>
        <el-form-item style="margin-top: 16px;">
          <el-button :loading="formloading" type="primary" style="width: 100%;" plain @click="submitForm(ruleFormRef)">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="mt-3">
        <p class="text-slate-400 text-xs/tight mt-2">© 2024 赤子英金（张新越） 保留所有权利.</p>
        <p class="text-slate-400 text-xs/tight mt-2">赤峰二中2023级12班研究性学习项目（零本智协） 拥有完全著作权.</p>
        <p class="text-slate-400 text-xs/tight mt-2">了解我们的<a href="https://www.chiziingiin.top/project/RS2024/A">创作历程</a></p>
      </div>
    </div>
  </div>
</template>


<script setup>
import Cookies from 'js-cookie';
import { ref,onMounted,reactive, onActivated, onDeactivated } from 'vue'
import Auth from "../../utils/auth.js";
import { ElMessage,ElForm, ElFormItem,ElInput,ElButton,ElAlert, ElMessageBox,ElSelect,ElOption} from 'element-plus';
import CryptoJS from 'crypto-js';
import { useRoute, useRouter,RouterLink } from 'vue-router';
const ruleFormRef = ref(null);
const formloading = ref(false);
const route = useRoute()
const router = useRouter()
const form = reactive({
  username: '',
  password: ''
});
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名（唯一登录凭据）', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
});
const submitForm = (formEl) => {
  if (!formEl) return;
  formloading.value = true;
  formEl.validate(async (valid) => {
    if (valid) {
      ElMessage.info('正在进行人机验证')
      const verifyToken = await Auth.getRecaptchaToken({action:'signup',id:'#turnstile-box'})
      ElMessage.info('正在登录')
      const encode = CryptoJS.MD5(form.username+form.password).toString().toUpperCase();
      const createTeam = await Auth.userLogin({
        username:form.username,
        password:encode,
        token:verifyToken
      })
      if(createTeam.status == 'sus'){
        window.clarity("identify", createTeam.content.id, createTeam.content.sessionID,'login',createTeam.content.id)
        form.username = '';
        form.password = '';
        Cookies.set("czigauth", "NeedPrtoken", {
          expires: new Date(createTeam.content.expires),
          path: "/",
          secure: true,
          domain:'.chiziingiin.top'
        });
        ElMessageBox.alert('登录成功！', '提示', {}).then(() => {
          // window.location.href = 
          router.push(route.query.url || '/login-success')
        })
      } else {
        turnstile.remove('#turnstile-box')
        ElMessage({
          message: '创建失败',
          type: 'error',
        })
      }
      formloading.value = false;
    }
  })
}
</script>