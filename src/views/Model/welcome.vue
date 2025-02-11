<template></template>
<script setup>
import { onActivated, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Auth from '../../utils/auth'
const route = useRoute()
const router = useRouter()
onActivated(async () => {
  console.log(1)
  let model = route.query.model
  const {content} = await Auth.getAISessionID({model})
  router.push('/chat/'+content)
})
</script>