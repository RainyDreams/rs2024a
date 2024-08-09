<template>
  <div class="commonPage">
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-xxl-8">
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
                <el-form-item label="项目名称" prop="name">
                  <el-input v-model="form.name" autofocus />
                </el-form-item>
                <el-form-item label="项目描述" prop="desc">
                  <el-input
                    v-model="form.desc"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    maxlength="30"
                    show-word-limit
                    type="textarea"
                    placeholder="简单概括一下你们的项目"
                  />
                </el-form-item>
                <el-form-item label="参与团队" prop="team">
                  <el-select 
                    v-model="form.team"
                    placeholder="选择参与项目的团队"
                    :loading="loading"
                    loading-text="获取中"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="可见性" prop="visibility">
                  <el-radio-group v-model="form.visibility">
                    <el-radio border value="public">公开可见</el-radio>
                    <el-radio border value="private">项目内部</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="createLoading" @click="submitForm(ruleFormRef)">
                    创建项目
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted,reactive, onActivated } from 'vue'
import { FileAddition } from '@icon-park/vue-next'; 
import Auth from '../../utils/auth';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElRadioGroup, ElRadio} from 'element-plus';
import { useRouter } from 'vue-router';
const ruleFormRef = ref(null);
const options = ref([]);
const loading = ref(true);
const createLoading = ref(false)
const router = useRouter()
const form = reactive({
  name: '',
  desc: '',
  team: '',
  resource: ''
});
const rules = reactive({
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入项目描述', trigger: 'blur' }, 
    { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
  ],
  team: [
    { required: true, message: '请选择参与团队', trigger: 'change' }
  ],
  visibility: [
    { required: true, message: '请选择项目可见性', trigger: 'change' }
  ]
})
const submitForm = (formEl) => {
  if (!formEl) return
 formEl.validate(async (valid) => {
    if (valid) {
      // console.log('submit!')
      // await // Auth.getPrtoken();
      createLoading.value = true;
      const createProject = await Auth.createProject({
        name: form.name,
        desc: form.desc,
        team: form.team,
        visibility: form.visibility
      })
      if(createProject.status == 'sus'){
        createLoading.value = false;
        ElMessage({
          message: '创建成功',
          type: 'success',
        })
        form.name = ''
        form.desc = ''
        form.team = ''
        form.visibility = ''
        router.push({path:'/projects/list'})
      } else {
        createLoading.value = false;
        ElMessage({
          message: '创建失败',
          type: 'error',
        })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
async function remoteMethod(query) {
  // await // Auth.getPrtoken();
  const teamList  = (await Auth.getTeamList({})).content;
  options.value = teamList.map(item => {
    return {
      value: item.id,
      label: item.name
    }
  })
  loading.value = false

  console.log(teamList)
}
onActivated(()=>{
  remoteMethod()
})
</script>

