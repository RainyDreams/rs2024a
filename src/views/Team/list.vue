<template>
  <div class="commonPage">
    <div class="container row">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xxl-8">
        <div class="big_header">
          <div class="icon"><address-book theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
          <div class="title">团队列表</div>
        </div>
        <div class="panel" v-if="loading">
          <el-skeleton animated :rows="5" />
        </div>
        <div class="panel" v-if="!loading && teamList.length==0">
          <el-empty :image-size="150" >
            <template #description>
              <p>没有加入团队</p>
            </template>
            <template #default>
              <router-link to="/projects/create"><el-button type="primary">
                去创建团队<el-icon class="el-icon--right"><Right /></el-icon>
              </el-button></router-link>
            </template>
          </el-empty>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xxl-6" v-for="(item,i) in teamList">
            <div class="panel teambox">
              <div class="teamname">{{ item.name }}</div>
              <div class="teamdesc">{{ item.desc }}</div>
              <div class="hr"></div>
              <div class="teamtitle">创建时间</div>
              <div class="teamShow">{{ item.createTime }}</div>
              <div class="teamtitle">团队人数</div>
              <div class="teamShow">{{ item.personNummber }}</div>
              <div class="teamtitle">我的身份</div>
              <div class="teamidentity">
                <div class="useravatar">
                  <el-avatar :src="item.userAvatar" :size="38" />
                </div>
                <div class="userinfo">
                  <div class="username">{{ item.userNickname }}</div>
                  <div class="userrole">{{ item.userRole }}</div>
                </div>
              </div>
              <div class="more">
                <el-button size="large" color="#626aef" plain type="primary" style="width:100%">查看团队</el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="panel" v-if="!loading && teamList.length>0" v-for="(item,i) in teamList">
          <div class="_content">
            <el-row class="listbox">
              <el-col :span="12">
                <div class="li">
                  <div class="_header">{{ item.name }}</div>
                  <div class="_content">
                    <p>{{ item.desc }}</p>
                  </div>
                  <div class="_footer">
                    <div class="avatar_list">
                      <el-avatar :size="20"></el-avatar>
                    </div>
                    <div class="el-button"></div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div> -->
      </div>
      <div v-if="!loading" class="col-sm-12 col-md-12 col-lg-12 col-xxl-4 ">
        <div class="stikyPanel">
          <div class="big_header">
            <div class="icon"><Order theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">意见征集</div>
          </div>
          <div class="panel">
            <div class="doc">
              <h2>你觉得这样设计好看吗</h2>
              <p>来参加我们的调研</p>
              <p><a href="https://wj.qq.com/s2/15033628/565d/">赤子英金研究性学习项目网站设计意见征集</a></p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>


<script setup>
import { AddressBook, Right,Order } from "@icon-park/vue-next";
import { ref, onMounted, onActivated } from "vue";
import { ElAvatar,ElSkeleton,ElEmpty,ElButton,ElRow,ElCol} from "element-plus";
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