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
            <el-alert type="info" show-icon :closable="false"  style="margin-bottom: 16px;">
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
    <input style="height: 1px;width:1px;opacity: 0;visibility: hidden;" type="text" ref="inputRef" v-model="inputValue">
  </div>
</template>

<script setup>
import { ref,onMounted,reactive } from 'vue'
import { Peoples } from '@icon-park/vue-next'; 
import Auth from "../../utils/auth.js";
import { ElMessage,ElForm, ElFormItem,ElInput,ElButton,ElAlert,ElDialog, ElMessageBox,} from 'element-plus';
import { useRouter } from 'vue-router';
const inputRef = ref(null);
const inputValue = ref('');
const dialogTableVisible = ref(false)
const ruleFormRef = ref(null);
const formloading = ref(false);
const router = useRouter()
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
const selectAndCopy = () => {
  if (inputRef.value) {
    navigator.clipboard.writeText(inputRef.value.value).then(() => {
      console.log('文本已复制到剪贴板');
    }, (err) => {
      inputRef.value.select();
      document.execCommand('copy');
    });
  }
};
const submitForm = (formEl) => {
  if (!formEl) return;
  formloading.value = true;
  formEl.validate(async (valid) => {
    if (valid) {
      // const prtoken = // await // Auth.getPrtoken();
      const createTeam = await Auth.createTeam({
        name:form.name,
        desc:form.desc
      })
      if(createTeam.status == 'sus'){
        inputValue.value = createTeam.content.inviteurl;
        form.name = '';
        form.desc = '';
        ElMessage({
          message: '创建成功',
          type: 'success',
        });
        ElMessageBox.alert(`<p>请分享你的团队链接给你的成员们</p><p><b>${inputValue.value}</b></p>`, '提示', {
          dangerouslyUseHTMLString:true,
          confirmButtonText: '复制',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              selectAndCopy();
              done();
            }
          }
        })
        router.push({path:'/team/list'})
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

