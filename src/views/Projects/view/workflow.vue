<template>
  <el-form 
    label-position="top"
    :model="form" 
    label-width="auto" 
    style="max-width: 600px"
    :rules="rules"
    ref="ruleFormRef"
    status-icon
    :inline-message="true"
    size="large"
  >
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="form.name" autofocus />
    </el-form-item>
    <el-form-item label="任务内容" prop="desc">
      <el-input
        v-model="form.desc"
        :autosize="{ minRows: 2, maxRows: 4 }"
        maxlength="100"
        show-word-limit
        type="textarea"
        placeholder="简单概括一下任务的具体内容"
      />
    </el-form-item>
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="form.name" autofocus />
    </el-form-item>
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="form.name" autofocus />
    </el-form-item>
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="form.name" autofocus />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        创建{{ type }}
      </el-button>
    </el-form-item>
  </el-form>
</template>