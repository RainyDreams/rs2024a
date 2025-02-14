import axios from 'axios';
import dayjs from 'dayjs';
import { ref } from 'vue';
const FINANCIAL_API_KEY = '1CFE15BA-3266-49BD-9F77-96B498F03C6B';
async function fetchStockList() {
  const url = `https://api.mairui.club/hslt/list/${FINANCIAL_API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

async function fetchStrongStocks(timeframe=getTimeframe()){
  const url = `https://api.mairui.club/hslt/qsgc/${timeframe}/${FINANCIAL_API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

async function fetchStockRelatedInfo(code){
  const url = `https://api.mairui.club/hszg/zg/${code}/${FINANCIAL_API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

function getTimeframe(){
  const now = dayjs();
  const isBeforeHalfPastNine = now.isBefore(now.set('hour', 9).set('minute', 30));
  return isBeforeHalfPastNine ? now.subtract(1, 'day').format('YYYY-MM-DD') : now.format('YYYY-MM-DD');
}
export default {
  fetchStockList,
  fetchStrongStocks,
  fetchStockRelatedInfo,
  getTimeframe
}