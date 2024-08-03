<template>
  <div class="userPage">
    <div class="userProfile">
      <div class="userAvatar">
        <el-avatar :src="profile.avatar" :size="80"></el-avatar>
      </div>
      <div class="userBasic">
        <div class="userWelcome">
          <span class="welcome">Hi,</span>
          <span class="userNickname">{{ profile.nickname }}</span>
        </div>
        <div class="userSign">目前暂不支持签名</div>
      </div>
    </div>
    <div class="userFocusList">
    </div>
  </div>
  <!-- <p>这个页面不知道咋设计了🤷‍♀️，如果你有好的方案请联系我们</p> -->
  <div class="commonPage" style="padding: 0;">
    <div class="panel" v-if="loading">
      <el-skeleton animated :rows="5" />
    </div>
    <div class="panel" v-if="!loading" >
      <div class="_header">
        <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
        <div class="title">基本信息</div>
      </div>
      <div class="_content">
        <div >{{ profile }}</div>
        <el-upload
          class="avatar-uploader"
          action="/api/uploadAvatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="handleUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script setup>
import { IdCardH } from '@icon-park/vue-next';
import { onActivated, onMounted, ref } from 'vue';
import { ElAvatar,ElSkeleton,ElUpload,ElIcon } from 'element-plus';
import Auth from '../../utils/auth';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios';
const profile = ref({
  nickname: '加载中',
  avatar: 'https://project.chiziingiin.top/api/avatar/',
})
const imageUrl = ref('')
const loading = ref(true)
onMounted(async ()=>{
  const res = await Auth.getUserInfo();
  profile.value = res.content;
  loading.value=false;
})
function handleUpload(options) {
  const file = options.file;
  if (file.type.startsWith('image')) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const base64Image = e.target.result;
      const data = {
        imageBase64: base64Image,
      };
      axios.post('/api/uploadAvatar', data)
      .then(response => {
        // console.log(response,options);
        profile.value.avatar = 'https://project.chiziingiin.top/api/avatar/'+ response.data.content;

      })
      .catch(error => {
        console.error(error);
      });
    };
  } else {
    ElMessage.error('请上传图片文件');
    console.error('不是图片文件');
  }
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>