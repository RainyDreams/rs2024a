<template>
  <div class="commonPage">
    <div class="container row">
      <div class="col-md-12 col-lg-8">
        <div class="panel">
          <div class="_header">
            <div class="icon"></div>
            <div class="title">测试</div>
          </div>
          <div class="_content">
            <div class="listbox" v-for="(item,i) in teamList">
              <div class="li">
                {{ item.name }}
                {{ item.desc }}
                {{ item.createuser }}
                {{ item.createtime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import Auth from "../../utils/auth";
const teamList = ref([]);
onMounted(async ()=>{
  await Auth.getPrtoken();
  teamList.value = (await Auth.getTeamList({})).content;
})
</script>