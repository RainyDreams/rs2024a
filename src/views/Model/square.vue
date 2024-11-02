<template>
  <div class="h-full bg-white md:px-5">
    <div class="row">
      <div class="col-sm-12">
        <!-- <div class="big_header">
          <div class="icon"><address-book theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
          <div class="title">智能体广场</div>
        </div> -->
        <div class="panel" v-if="loading">
          <el-skeleton class="mt-3" animated :rows="5" />
        </div>
        <div class="panel" v-if="!loading && teamList.length==0">
          <el-empty :image-size="150" >
            <template #description>
              <p>没有加入团队</p>
            </template>
            <template #default>
              <router-link to="/team/create"><el-button type="primary">
                去创建团队<el-icon class="el-icon--right"><Right /></el-icon>
              </el-button></router-link>
            </template>
          </el-empty>
        </div>
        <div class="row md:pt-6" v-if="!loading && teamList.length>0" >
          <div class="col-12 col-xl-4 col-md-6 mb-0 md:mb-4" v-for="(item,i) in teamList">
            <div class="modelbox p-3 border-b sm:p-4 cursor-pointer md:rounded-lg h-full md:border">
              <div class="flex items-center h-full">
                <div class="mr-1 md:mr-2">
                  <el-avatar alt="头像" :src="item.img" class="mr-1" :size="38" />
                </div>
                <div class="flex flex-col justify-between h-full">
                  <div class="text-xl font-bold mb-1">{{ item.name }}</div>
                  <div class="text-sm/snug mb-2 flex-1">{{ item.desc }}</div>
                  <div class="flex items-center opacity-80 text-xs">
                    <el-avatar alt="头像" :src="item.userAvatar" class="mr-1" :size="18" />
                    <div class="username">{{ item.userNickname }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-xl-4 col-md-6 mb-0 md:mb-4" >
            <div class="modelbox p-3 border-b sm:p-4 cursor-pointer md:rounded-lg h-full md:border lg:py-5">
              <div class="flex items-center h-full lg:justify-center">
                <div class="mr-1">
                  <Plus theme="outline" size="24" :strokewidth="6" fill="#635bff" strokeLinejoin="bevel" />
                  <!-- <el-avatar alt="头像" :src="item.img" class="mr-1" :size="38" /> -->
                </div>
                <div class="flex flex-col justify-center h-full">
                  <div class="text-xl font-bold">新建智能体</div>
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
  </div>
</template>


<script setup>
import { AddressBook, Right,Order,Plus } from "@icon-park/vue-next";
import { ref, onMounted, onActivated } from "vue";
import { ElAvatar,ElSkeleton,ElEmpty,ElButton,ElRow,ElCol,ElIcon} from "element-plus";
import Auth from "../../utils/auth";
import { getDateDiff,getRole } from "../../utils/helpers";
const teamList = ref([]);
const loading=ref(true)
onActivated(async ()=>{
  // await // Auth.getPrtoken();
  teamList.value = (await Auth.getJoinedTeamList({})).content.map((item)=>{
    const mine = item.persons.find(p=>item.myId==p.id)
    return {
      id:item.id,
      name:item.name,
      desc:item.desc,
      createuser:item.persons.find(p=>item.createuser==p.id).nickname,
      userRole:getRole(mine.role),
      userAvatar:mine.avatar,
      userNickname:mine.nickname,
      createTime:getDateDiff(item.createtime).str,
      personNummber: item.persons.length,
      personList: item.persons.slice(0,3).map(p=>({id:p.id,avatar:p.avatar,nickname:p.nickname,role:getRole(p.role)}))
    }
  });
  loading.value = false;
})

</script>