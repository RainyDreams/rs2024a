<template>
  <div class="commonPage">
    <div class="container row">
      <div class="col-md-12 col-lg-8">
        <div class="big_header">
          <div class="icon"><address-book theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
          <div class="title">团队列表</div>
        </div>
        <div class="panel">
          <div class="_header">
            <div class="icon"></div>
            <div class="title">测试</div>
          </div>
          <div class="_content">
            <div class="listbox row" v-for="(item,i) in teamList">
              <div class="col-md-6 col-xxl-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { AddressBook } from "@icon-park/vue-next";
import { ref, onMounted } from "vue";
import Auth from "../../utils/auth";
const teamList = ref([]);
onMounted(async ()=>{
  await Auth.getPrtoken();
  teamList.value = (await Auth.getTeamList({})).content;
})
</script>