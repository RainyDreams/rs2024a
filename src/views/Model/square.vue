<template>
  <div class="commonPage h-full  md:px-5">
    <div class="row">
      <div class="col-sm-12">
        <!-- <div class="big_header">
          <div class="icon"><address-book theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
          <div class="title">智能体广场</div>
        </div> -->
        <div class="panel" v-if="loading">
          <el-skeleton class="mt-3" animated :rows="5" />
        </div>
        <div class="row pt-2 md:pt-4" v-if="!loading" >
          <div class="col-12 col-xl-4 col-md-6 " v-for="(item,i) in teamList">
            <div class="modelbox p-3 sm:p-4 cursor-pointer rounded-lg h-full border"
              @click="chat(item.id)">
              <div class="flex items-center h-full">
                <div class="mr-1 md:mr-2">
                  <el-avatar alt="头像" :src="item.img || '/logo_sm.webp'" class="mr-1" :size="38" />
                </div>
                <div class="flex flex-col justify-between h-full">
                  <div class="text-lg md:text-xl font-bold mb-1">{{ item.name }}</div>
                  <div class="text-sm/snug mb-2 flex-1">{{ item.desc }}</div>
                  <div class="flex items-center opacity-80 text-xs">
                    <el-avatar alt="头像" :src="item.createUser.avatar || '/logo_sm.webp'" class="mr-1" :size="18" />
                    <div class="username">{{ item.createUser.nickname }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-xl-4 col-md-6 " >
            <div class="modelbox p-3 sm:p-4 cursor-pointer rounded-lg h-full border"
              @click="dialogVisible = true">
              <div class="flex items-center h-full md:justify-center">
                <div class="mr-1">
                  <Plus theme="outline" size="24" :strokewidth="6" fill="#635bff" strokeLinejoin="bevel" />
                  <!-- <el-avatar alt="头像" :src="item.img" class="mr-1" :size="38" /> -->
                </div>
                <div class="flex flex-col justify-center h-full">
                  <div class="text-lg md:text-xl font-bold">新建智能体</div>
                  <!-- <div class="text-sm/snug mb-2 flex-1">{{ item.desc }}</div>
                  <div class="flex items-center opacity-80 text-xs">
                    <el-avatar alt="头像" :src="item.userAvatar" class="mr-1" :size="18" />
                    <div class="username">{{ item.userNickname }}</div>
                  </div> -->
                  <!-- <div class="border-b mt-2"></div> -->
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="新建智能体"
      width="92%"
      :show-close="false"
      class="max-w-2xl p-8 rounded-xl border"
    >
      <div>
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
          <el-form-item label="智能体名称" prop="name">
            <el-input v-model="form.name" autofocus />
          </el-form-item>
          <el-form-item label="智能体描述" prop="desc">
            <el-input
              v-model="form.desc"
              :autosize="{ minRows: 1, maxRows: 3 }"
              maxlength="50"
              show-word-limit
              type="textarea"
              placeholder="简单概括一下这个智能体，比如用来干什么"
            />
          </el-form-item>
          <el-form-item label="智能体提示词" prop="prompt">
            <el-input
              v-model="form.prompt"
              :autosize="{ minRows: 2, maxRows: 6 }"
              maxlength="1500"
              show-word-limit
              type="textarea"
              placeholder="他的身份，技能或者需要TA记住的一些事情"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="formloading" @click="submitForm(ruleFormRef)">
              创建智能体
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>


<script setup>
import { AddressBook, Right,Order,Plus, ChargingTreasure } from "@icon-park/vue-next";
import { ref, onMounted, onActivated,reactive } from "vue";
import { ElAvatar,ElSkeleton,ElEmpty,ElButton,ElRow,ElCol,ElIcon,ElDialog,ElForm,ElFormItem,ElInput,ElMessage, ElMessageBox} from "element-plus";
import Auth from "../../utils/auth";
import { getDateDiff,getRole } from "../../utils/helpers";
import { useRouter } from "vue-router";
const router = useRouter();
const teamList = ref([]);
const loading = ref(true)
const dialogVisible = ref(false)
const formloading = ref(false)
const ruleFormRef = ref(null)
const form = reactive({
  name: '',
  desc: '',
  prompt:''
});
const rules = reactive({
  name: [
    { required: true, message: '请输入智能体名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入智能体描述', trigger: 'blur' }, 
    { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
  ],
  prompt: [
    { required: true, message: '请输入智能体提示词', trigger: 'blur' }, 
    { min: 10, max: 1500, message: '长度在 10 到 1500 个字符', trigger: 'blur' }
  ],
})
const chat = (e)=>{
  router.push('/model/chat/new?model='+e)
}
const submitForm = (formEl)=>{
  if (!formEl) return;
  formloading.value = true;
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await Auth.createModel({
        name:form.name,
        desc:form.desc,
        text:form.prompt
      })
      if(res.status == 'sus'){
        teamList.value = (await Auth.getModelList({})).content.map((item)=>{
          return {
            id:item.id,
            name:item.name,
            desc:item.desc,
            createuser:item.createuser,
            createTime:getDateDiff(item.createtime).str,
            createUser:{
              
            }
          }
        });
        ElMessageBox.alert('创建成功','提示' , {
          confirmButtonText: '确定',
          showClose:false,
          callback: action => {
            dialogVisible.value = false;
            formloading.value = false;
            form.name = ''
            form.desc = ''
            form.prompt = ''
          }
        })
        teamList.value = await Promise.all(teamList.value.map(async (item)=>{
          // console.log()
          return {
            ...item,
            createUser:await Auth.getUserInfoByID({id:item.createuser})
          }
        }));
      }else {
        ElMessage.error('创建错误')
        formloading.value = false;
      }
    }
  })
}
onActivated(async ()=>{
  // await // Auth.getPrtoken();
  teamList.value = (await Auth.getModelList({})).content.map((item)=>{
    return {
      id:item.id,
      name:item.name,
      desc:item.desc,
      createuser:item.createuser,
      createTime:getDateDiff(item.createtime).str,
    }
  });
  teamList.value = await Promise.all(teamList.value.map(async (item)=>{
    // console.log()
    return {
      ...item,
      createUser:await Auth.getUserInfoByID({id:item.createuser})
    }
  }))
  loading.value = false;
})

</script>