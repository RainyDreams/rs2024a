<template>
  <div class="commonPage">
    <div class="row">
      <div class="col-md-12 col-lg-8">
        <div class="panel">
          <div class="_header">
            <div class="icon"><Peoples theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">创建团队</div>
          </div>
          <div class="_content">
            <el-alert type="info" show-icon :closable="false">
              <p>团队创建成功后会生成分享链接，可以邀请团队成员加入。</p>
            </el-alert>
            <el-form 
              :model="form" 
              label-width="auto" 
              style="max-width: 600px"
              :rules="rules"
              ref="ruleFormRef"
              status-icon
            >
              <el-form-item label="团队名称" prop="name">
                <el-input v-model="form.name" autofocus />
              </el-form-item>
              <el-form-item label="团队描述" prop="desc">
                <el-input
                  v-model="form.desc"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  maxlength="30"
                  show-word-limit
                  type="textarea"
                  placeholder="简单概括一下你们的团队"
                />
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
    <el-dialog v-model="dialogTableVisible" title="请分享你的团队链接给你的成员们" width="90%" max-width="400px">
      <el-input readonly ref="inputRef" v-model="inputValue" @click="selectAllInput" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,onMounted,reactive } from 'vue'
import { Peoples } from '@icon-park/vue-next'; 
import Auth from "../../utils/auth.js";
const inputRef = ref(null);
const inputValue = ref('');
const dialogTableVisible = ref(false)
const ruleFormRef = ref(null);
const formloading = ref(false);
const form = reactive({
  name: '',
  desc: '',
  team: '',
  resource: ''
});
const rules = reactive({
  name: [
    { required: true, message: '请输入团队名称', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入团队描述', trigger: 'blur' }, 
    { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
  ],
  team: [
    { required: true, message: '请选择参与团队', trigger: 'change' }
  ],
  visibility: [
    { required: true, message: '请选择团队可见性', trigger: 'change' }
  ]
})
const selectAllInput = () => {
  if (inputRef.value) {
    inputRef.value.select();
  }
};

const selectAndCopy = () => {
  if (inputRef.value) {
    inputRef.value.select();
    document.execCommand('copy');
  }
};
const submitForm = (formEl) => {
  if (!formEl) return;
  formloading.value = true;
  formEl.validate(async (valid) => {
    if (valid) {
      try{await Auth.getPrtoken()}catch(e){
        if(e.status == 'invalid'){
          ElMessage({
            message: '登录已过期，请重新登录',
            type: 'error',
          })
          setTimeout(() => {
            window.location.href = 'https://auth.chiziingiin.top/?url='+window.location.href
          },1000)
        }
        return;
      }
      const response = await fetch( '/api/createTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:encodeURIComponent(form.name),
          desc:encodeURIComponent(form.desc),
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        if(data.status == 'sus'){
          console.log('[team] create success',data);
          inputValue.value = data.content.inviteurl;
          dialogTableVisible.value = true;
          form.name = '';
          form.desc = '';
          localStorage.setItem('teamInfo',{teamId:data.content.teamid,teamInviteurl:data.content.inviteurl});
          ElMessage({
            message: '创建成功！',
            type: 'success',
          });
        } else {
          console.log('[team] create error',data);
          ElMessage({
            message: '出现错误',
            type: 'error',
          });
          return { status: 'error', content: data.content };
        }
      } else {
        ElMessage({
          message: '出现错误',
          type: 'error',
        });
        return { status: 'error', content: response };
      }
      formloading.value=false;
    } else {
      console.log('error submit!')
      formloading.value=false;
      return false
    }
  })
}

</script>

