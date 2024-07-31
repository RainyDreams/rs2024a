<template>
  <div class="div" style="padding: 8px;">
    <el-table
      :data="paginatedList"
      style="width: 800px; height: 600px;"
      :default-sort="{ prop: 'time', order: sortState.order }"
      @sort-change="onSortChange"
    >
      <el-table-column
        prop="content"
        label="内容"
        width="300"
      >
        <template #default="scope">
          <ul>
            <li style="border-bottom: 1px solid rgb(34, 98, 251);" v-for="(item,i) in scope.row.content">{{ item }}</li>
          </ul>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="time"
        label="时间"
        width="50"
        sortable
      />

      <el-table-column
        prop="formatTime"
        label="格式化时间"
        width="150"
        :filters="timeFilters"
        :filter-method="filterMethod"
      />

      <el-table-column
        prop="fingerprint"
        label="指纹"
        width="150"
        :filters="fingerprintFilters"
        :filter-method="filterMethod"
      />

      <el-table-column
        prop="userid"
        label="用户ID"
        width="150"
        :filters="userIdFilters"
        :filter-method="filterMethod"
      />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItems"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElMessage } from 'element-plus'
import Auth from '../../utils/auth';
import dayjs from 'dayjs';

const _list = ref([])
const paginatedList = ref([])
const totalItems = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const sortState = ref({
  key: 'time',
  order: 'ascending',
})

const timeFilters = ref([])
const fingerprintFilters = ref([])
const userIdFilters = ref([])

const onSortChange = (column) => {
  if (column.prop === 'time') {
    _list.value = _list.value.sort((a, b) => {
      if (column.order === 'ascending') {
        return a.time - b.time;
      } else {
        return b.time - a.time;
      }
    })
    sortState.value = column
    handlePageChange(currentPage.value)
  }
}

function showMessage(content) {
  ElMessage({
    message: content,
    type: 'info',
    duration: 0, // 不自动关闭
    showClose: true,
  });
}

const filterMethod = (value, row, column) => {
  const property = column['property'];
  if (property === 'formatTime') {
    const now = dayjs();
    if (value === 'last24hours') {
      return dayjs(row.time).isAfter(now.subtract(24, 'hour'));
    } else if (value === 'last7days') {
      return dayjs(row.time).isAfter(now.subtract(7, 'day'));
    } else if (value === 'last30days') {
      return dayjs(row.time).isAfter(now.subtract(30, 'day'));
    }
  }
  return row[property] === value;
}

const handlePageChange = async (newPage) => {
  currentPage.value = newPage;
  const response = await Auth.getAIGuestList(newPage);
  _list.value = response.content.map((item) => ({
    ...item,
    content: item.content.split("[Last END]"),
    formatTime: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
  }));
  paginatedList.value = _list.value.slice(
    (newPage - 1) * pageSize.value,
    newPage * pageSize.value
  );
  totalItems.value = response.totalCount;

  // Generate filters dynamically
  timeFilters.value = [...new Set(_list.value.map(item => item.formatTime))].map(time => ({ text: time, value: time }));
  fingerprintFilters.value = [...new Set(_list.value.map(item => item.fingerprint))].map(fingerprint => ({ text: fingerprint, value: fingerprint }));
  userIdFilters.value = [...new Set(_list.value.map(item => item.userid))].map(userid => ({ text: userid, value: userid }));
}

onMounted(async () => {
  
  await handlePageChange(currentPage.value);
})
</script>
