<template>
  <div class="commonPage">
    <routerBack name="项目详情页" :back="`/projects/detail/${projectId}`"></routerBack>
    <div class="panel">
      <div class="_header">
        <div class="icon"><file-addition theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
        <div class="title">创建{{ type }}</div>
      </div>
      <div class="_content">
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
          <el-form-item :label="`${type}名称`" prop="name">
            <el-input v-model="form.name" autofocus />
          </el-form-item>
          <el-form-item :label="`${type}描述`" prop="desc">
            <el-input
              v-model="form.desc"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="30"
              show-word-limit
              type="textarea"
              placeholder="简单概括一下你们的项目"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              创建{{ type }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted,reactive, onActivated, nextTick } from 'vue'
import { FileAddition, Refresh } from '@icon-park/vue-next'; 
import Auth from '../../utils/auth';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElRadioGroup, ElRadio} from 'element-plus';
import routerBack from '../../components/routerBack.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
const route = useRoute();
const projectId = ref('');
const createType = ref('');
const type = ref('')
function Update(){
  console.log(route)
  createType.value = route.params.type;
  projectId.value = route.params.projectId;
  type.value = {
    workflow:'工作流',
    tasks:'任务', 
    discussion:'讨论', 
    issue:'问题'
  }[createType.value] || '参数错误'
}
const ruleFormRef = ref(null);
const options = ref([]);
const loading = ref(true);
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
      await Auth.getPrtoken();
      const createProject = await Auth.createProject({
        name: form.name,
        desc: form.desc,
        team: form.team,
        visibility: form.visibility
      })
      if(createProject.status == 'sus'){
        ElMessage({
          message: '创建成功',
          type: 'success',
        })
        form.name = ''
        form.desc = ''
        form.team = ''
        form.visibility = ''
      } else {
        ElMessage({
          message: '创建失败',
          type: 'error',
        })
      }
      console.log(createProject)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
async function remoteMethod(query) {
  await Auth.getPrtoken();
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
  remoteMethod();
  Update()
})
// onBeforeRouteUpdate(()=>{
//   Update()
// })
</script>

