<template>

</template>


<script setup>
import { onMounted, ref } from 'vue';
import Cookies from 'js-cookie';
async function loginUser() {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username:username.value, password:password.value })
  });
  if (response.status === 200) {
    const data = await response.json();
    if(data.status == 'sus'){
      Cookies.set('czigauth', `${(new Date().getTime()).toString(36)}`, { expires: new Date(data.content.expires),Domain:'.chiziingiin.top' });
    }
  } else {
    console.error('登录失败');
  }
}
async function getPrToken() {
  const response = await fetch('/api/prtoken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.status === 200) {
    const data = await response.json();
    console.log('Received prtoken:', data.prtoken);
  } else {
    console.error('Failed to get prtoken:', response.statusText);
  }
}
onMounted(async ()=>{
  await loginUser();
  await getPrToken();
})
</script>