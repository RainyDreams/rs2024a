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
            <div 
              class="modelbox p-3 sm:p-4 cursor-pointer rounded-lg h-full border"
              @click="chat(item)"
            >
              <div class="model_banner" v-if="item.tag == 'public'">公开</div>
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
        <h2 class="text-sm md:text-xs/snug lg:text-base/snug text-center mt-40 mb-20">站在巨人的肩膀上</h2>
        <!-- <div class="mt-16">
          <h2 class="text-lg font-semibold mb-4">最新资讯</h2>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 col-xl-4" v-for="(item,i) in newsList">
            <a :href="item.link" target="_blank" class="normal-color-force flex flex-col w-full h-full p-3 sm:p-4 cursor-pointer rounded-lg  modelbox border">
              <h2 class="text-lg font-semibold hover-primary-text">{{ item.title }}</h2>
              <p class="text-gray-700 mt-1 text-xs md:text-sm/tight flex-1">{{ item.description }}</p>
              <p class="text-xs text-gray-600 mt-2">发布时间：{{ item.pubDate }}</p>
            </a>
          </div>
        </div> -->
      </div>
    </div>
    <el-dialog
      v-model="showModel.show"
      width="92%"
      :show-close="false"
      class="max-w-2xl p-8 rounded-xl border relative overflow-hidden"
    >
      <div class="flex flex-col min-h-60">
        <div class="model_banner" v-if="showModel.tag == 'public'">公开</div>
        <div class="flex justify-between items-center">
          <div class="text-lg">
            {{ (showModel?.share)?'来自分享':'' }}
          </div>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="复制"
            placement="top-start"
          >
            <div 
              @click="copyText(showModel)"
              class="py-1 px-2 hover:bg-slate-100 border-slate-100 border flex items-center transition-all rounded-md cursor-pointer">
              <Share theme="outline" class="mr-1" size="16" fill="#0005" strokeLinejoin="bevel"/>
              分享
            </div>
          </el-tooltip>
        </div>
        <div class="flex items-center h-full mb-3 p-3 sm:p-4 cursor-pointer rounded-lg mt-3 border">
          <div class="mr-1 md:mr-2 ">
            <el-avatar alt="头像" :src="showModel.img || '/logo_sm.webp'" class="mr-1" :size="38" />
          </div>
          <div class="flex flex-col justify-between h-full">
            <div class="text-lg md:text-xl font-bold mb-1">{{ showModel.name }}</div>
            <div class="text-sm/snug mb-2 flex-1">{{ showModel.desc }}</div>
            <div class="flex items-center opacity-80 text-xs mb-2">
              <el-avatar alt="头像" :src="showModel.createUser.avatar || '/logo_sm.webp'" class="mr-1" :size="18" />
              <div class="username">{{ showModel.createUser.nickname }}</div>
            </div>
            <div class="opacity-80 text-xs">创建时间：{{ showModel.createTime }}</div>
          </div>
        </div>
        <div class="mb-8 flex-1">
          <p class="truncate-multiline">{{ showModel.prompt.text }}</p>
        </div>
        <div>
          <el-button @click="to(showModel.id)" type="primary" size="large" class="w-full rounded-lg" color="#626aef">新建对话</el-button>
        </div>
      </div>
    </el-dialog>
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
          <el-form-item label="是否公开" prop="tag">
            <el-switch v-model="form.tag" />
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
import { AddressBook, Right,Order,Plus, Share } from "@icon-park/vue-next";
import { ref, onMounted, onActivated,reactive } from "vue";
import { ElAvatar,ElSkeleton,ElEmpty,ElButton,ElSwitch,ElDialog,ElForm,ElFormItem,ElInput,ElMessage, ElMessageBox} from "element-plus";
import Auth from "../../utils/auth";
import { getDateDiff,getRole } from "../../utils/helpers";
import { useRouter,useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const teamList = ref([]);
const loading = ref(true)
const dialogVisible = ref(false)
const formloading = ref(false)
const ruleFormRef = ref(null)
const newsList = ref([])
const form = reactive({
  name: '',
  desc: '',
  prompt:'',
  tag:false
});
const showModel = ref({show:false})
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
  tag: [
    { required: true, message: '请选择是否公开', trigger: 'change' }
  ]
})

const copyText = (e)=>{
  Auth.copyText(`分享给你一个智能体【${e.name}】\nhttps://lingben.chiziingiin.top/model/square?model=${e.id}`,()=>{
    ElMessage.success("复制成功")
  },()=>{
    ElMessage.error("复制失败")
  })
}
const to = (e)=>{
  // router.push('/model/m/'+e)
  router.push('/model/chat/new?model='+e)
}
const chat = (e)=>{
  showModel.value = {
    ...e,
    show:true,
    share:false,
  }
  // router.push('/model/chat/new?model='+e)
  // router.push('/model/m/'+e)
}
const submitForm = (formEl)=>{
  if (!formEl) return;
  formloading.value = true;
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await Auth.createModel({
        name:form.name,
        desc:form.desc,
        text:form.prompt,
        tag:form.tag?'public':'private'
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
            form.tag = false
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
  let model = route.query.model;
  // await // Auth.getPrtoken();
  teamList.value = (await Auth.getModelList({})).content.map((item)=>{
    return {
      id:item.id,
      name:item.name,
      desc:item.desc,
      createuser:item.createuser,
      createTime:getDateDiff(item.createtime).str,
      tag:item.tag,
      prompt:JSON.parse(item.prompt || '{}')
    }
  });
  teamList.value = await Promise.all(teamList.value.map(async (item)=>{
    return {
      ...item,
      createUser:await Auth.getUserInfoByID({id:item.createuser})
    }
  }));
  if(model){
    const search = teamList.value.find(e=>e.id==model)
    if(search){
      showModel.value = {
        ...search,
        show:true,
        share:true,
      }
    }
  }
  loading.value = false;
  newsList.value = await Auth.loadRss();

})

</script>