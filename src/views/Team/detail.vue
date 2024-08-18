<template>
  <div class="commonPage">
    <routerBack name="团队列表" back="/team/list"></routerBack>
    <div class="panel" style="padding-top: 12px;">
      <el-skeleton :rows="6" animated v-show="loading"></el-skeleton>
      <div class="row" v-show="!loading">
        <div class="col-md-6">
          <div class="text-xs mb-1 text-slate-400">团队名称</div>
          <h1 class="text-2xl/tight font-semibold md:text-3xl/tight">{{ teamDetail.name }}</h1>
          <p class="text-xs mb-1 text-slate-400 break-all">ID:{{ teamDetail.id }}</p>
          <p class="text-xs mb-1 text-slate-400">邀请链接</p>
          <p class="text-sm mb-2 break-all"><a target="_blank" :href="teamDetail.inviteurl">{{ teamDetail.inviteurl }}</a></p>
          <div class="text-xs mb-1 text-slate-400">团队描述</div>
          <p class="text-lg/tight break-all mb-2">{{ teamDetail.desc }}</p>
          <div class="text-xs mb-1 text-slate-400">创建时间</div>
          <p class="text-lg/tight break-all mb-2">{{ teamDetail.formatCreateTime }}</p>
          <p class="text-xs mb-1 text-slate-400">我的身份</p>
          <div class="teamidentity">
            <div class="useravatar">
              <el-avatar alt="头像" :src="teamDetail.myProfile.avatar" :size="38" />
            </div>
            <div class="userinfo">
              <div class="username">{{ teamDetail.myProfile.nickname }}</div>
              <div class="userrole">{{ getRole(teamDetail.myProfile.role) }}</div>
            </div>
          </div>
          <div class="text-xs mb-2 text-slate-400">团队人员</div>
          <div class="row">
            <div class="col-12 " v-for="(item,index) in teamDetail.persons">
              <div class="border py-2 px-3 rounded-lg flex items-center">
                <el-avatar :src="item.avatar"></el-avatar>
                <div class="ml-2 flex-1">
                  <p class="text-base md:text-lg/tight">{{ item.nickname }}</p>
                  <p class="text-xs text-slate-400">用户名：{{ item.username }}</p>
                </div>
                <div>
                  <el-select 
                    v-model="item.role"
                    :disabled="item.disabled || item.loading" 
                    placeholder="加载中" 
                    style="width: 120px"
                    @change="changeRole(item.id,item.role,index)"
                  >
                    <el-option
                      v-for="role in options"
                      :key="role.value"
                      :label="getRole(role.value)"
                      :value="role.value"
                    />
                  </el-select>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="移出团队"
                    placement="top"
                  >
                    <el-button v-if="item.canbedeleted" @click="removeuser(item.id,index)" type="danger" class="ml-2" plain>
                      <Logout theme="outline" size="16" fill="currentColor" strokeLinejoin="bevel"/>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <h4 class="text-xl mb-3">参与项目</h4>
          <div >
            <router-link :to="`/projects/detail/${item.id}`" class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,index) in teamDetail.projects">
              <div class="flex-1 shrink break-all">
                <div class="text-md">{{ item.name }}</div>
                <div class="text-xs text-slate-400">ID:{{ item.id }}</div>
                <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Auth from '../../utils/auth';
import { onActivated,ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import routerBack from '../../components/routerBack.vue';
import { dayjs, ElAvatar,ElSelect,ElOption,ElButton,ElTooltip, ElMessage,ElSkeleton } from 'element-plus';
import { Logout } from '@icon-park/vue-next';
import { commonRoleMap,getRole } from '../../utils/helpers';
const options = commonRoleMap || [];
const route = useRoute();
const loading = ref(true)
const router = useRouter();
const teamId = ref(route.params.teamId);
const teamDetail = ref({
  "id": "", 
  "persons": [], 
  "projects": [],
  "createuser":"",
  "createtime":"",
  "myProfile":{ },
  "name":"",
  "desc":"",
  "inviteurl":""
})
const removeuser = async (id,index)=>{
  ElMessage.info('操作中')
  teamDetail.value.persons[index].loading = true
  const r=await Auth.removeTeamUser({userid:id,teamid:teamId.value})
  teamDetail.value.persons[index].loading = false
  if(r.status == 'sus')
    ElMessage.success('操作成功')
  loading.value = true;
  await update()
  loading.value = false;
}
const changeRole = async (id,role,index)=>{
  ElMessage.info('操作中')
  teamDetail.value.persons[index].loading = true
  const r = await Auth.teamChangeRole({userid:id,teamid:teamId.value,role})
  teamDetail.value.persons[index].loading = false
  if(r.status == 'sus')
  ElMessage.success('操作成功')
  loading.value = true;
  await update()
  loading.value = false;
}

const update = async ()=>{
  const res = await Auth.getTeamInfo({pid:teamId.value})
  if(res.status == 'sus'){
    teamDetail.value = {
      ...res.content,
      persons:res.content.persons.map(e=>{
        if(res.content.myProfile.id == e.id){
          e.disabled = true
        } else if(res.content.myProfile.role == 'member'){
          e.disabled = true
        } else if (res.content.myProfile.role == 'admin'){
          if(e.role == 'owner' || e.role == 'admin') e.disabled = true;
          e.canbedeleted = true;
        } else if (res.content.myProfile.role == 'owner'){
          e.canbedeleted = true;
        }
        return e;
      }),
      formatCreateTime:dayjs(res.content.createtime).format('YYYY年M月DD日 HH:mm:ss')
    };
  }
}
onActivated(async ()=>{
  loading.value = true;
  teamId.value = route.params.teamId;
  await update()
  loading.value = false;
})
</script>