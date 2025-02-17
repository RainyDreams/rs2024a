/*
 * @Author: Zhang Xinyue
 * @LastEditors: Zhang Xinyue
 * @Description: 登录模块、主要逻辑模块
 * @FilePath: \RS2024-A\project\src\auth.js
 * @Software: VS Code
 * @Copyright: Copyright (c) 2024 CHIZIINGIIN
*/
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Cookies from 'js-cookie';
import Dexie from 'dexie';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from "vue-router";
// import { da } from "element-plus/es/locales.mjs";
import { asyncThrottle } from "./helpers";
import dayjs, { Dayjs } from "dayjs";
import { status } from "nprogress";
// import { use } from "echarts/types/src/extension.js";
const router = useRouter()
const route = useRoute()
const BASICURL = ''
const defaultSuccess = async (data) => data.content?data.content:data;
const defaultFailed = async function (response,code) {
  window.clarity("event", 'auth_error')
  if(!navigator.onLine){
    return { status: 'offline' }
  }
  const ua = navigator.userAgent;
  const err = new Error(
    `Content:${code}\n${response}<br/>
    UA:${ua}<br/>
    Link:${window.location.href}<br/>
    time:${new Date().getTime()}`)
  const r = await Auth.reportErrlog(`${err.message}<br/>${err.stack}`)
  window.clarity("set", 'reportID', r.id);
  return { status: 'error', content: response };
}
export class Scheduler {
  constructor(max){
    this.max = max;this.count = 0 ;this.queue = new Array();
  }
  async add(promiseCreator){
    if(this.count>=this.max) await new Promise((resolve,reject)=>this.queue.push(resolve));   
    this.count ++;let res = await promiseCreator();this.count--;
    if(this.queue.length){this.queue.shift()();}
    return res;
  }
}
let Auth = {
  acceptPermission:()=>{
    window.clarity("set", 'permission', 'accept');
    window.clarity('event', 'permission_accept')
    Cookies.set('permission',true,{expires:7})
  },
  rejectPermission:()=>{
    window.clarity("set", 'permission', 'reject');
    window.clarity('event', 'permission_reject')
    Cookies.set('permission',false,{expires:7})
  },
  mainTaskThread: new Scheduler(5),
  chatTaskThread: new Scheduler(1),
  basicInfoTaskThread: new Scheduler(1),
  router: null,
  route: null,
  init: async function init() {
    const prStatus = (await this.getPrtoken("first")).status;
    if (prStatus == "invalid") {
      ElMessage.info("正在尝试使用访客身份登录，请稍等");
      const res = await this.guestLogin();
      if (res.status == "sus") {
        ElMessage.success("以访客身份登录成功");
      }
    }
  },
  basicAuth:async function basicAuth(
    url = BASICURL,
    body = "",
    { success = defaultSuccess, failed = defaultFailed } = {
      success: defaultSuccess,
      failed: defaultFailed,
    }
  ) {
    try {
      if(!navigator.onLine){
        return { status: 'offline' }
      }
      const response = await fetch(BASICURL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      if (response.status === 200) {
        let fdata = await response.text();
        let data = {status:'decodeError'}
        try{
           data = JSON.parse(fdata);
        }catch(err){}
        if (data.status === "sus") {
          window.clarity("event", 'auth_success')
          return { ...data,status: "sus", content: await success(data), };
        } else if (data.status === "error" && data.code === 4) {
          let a = await this.getPrtoken();
          if(a.status == 'notExist'){
            if(Auth.router){
              Auth.router.push('/login-needed?url='+encodeURIComponent(window.location.pathname))
            } else {
              window.location.href = ('/login-needed?url='+encodeURIComponent(window.location.pathname))
            }
          } else{
            return await this.basicAuth(url, body);
          }
        } else {
          console.error(url,fdata);
          return await failed(data.status+'\n'+fdata, url);
        }
      } else {
        console.error(url,fdata);
        return await failed(await response.text(), url);
      }
    } catch (error) {
      console.error(error);
      return await failed(error, url);
    }
  },
  getRecaptchaToken:async function getRecaptchaToken({action="default",id='#turnstile-box'}){
    window.clarity("event", 'getRecaptchaToken')
    return new Promise((resolve,reject)=>{
      // window.turnstile.ready(function () {
        window.turnstile.render(id, {
          sitekey: '0x4AAAAAAAgyM4dGoERAGuG2',
          action: action,
          callback: function(token) {
            // // console.log(token);
            resolve(token)
          },
          'error-callback': function(err) {
            // // console.log(err);
            reject(err)
          },
          'refresh-expired':'auto'
        });
      // });
    })
  },
  guestLogin:async function guestLogin(param) {
    window.clarity("event", 'guestLogin')
    const res = await this.basicAuth(
      "/api/guestlogin",
      JSON.stringify({ username: "guest" })
    );
    if (res.status == "sus") {
      const rt = await this.getPrtoken();
      return rt;
    } else {
      ElMessage.error("以访客身份登录：失败");
      return { status: "error", content: res.content };
    }
  },
  userRegister:async function userRegister(param){
    await this.getUserFingerprint();
    window.clarity("event", 'userRegister')
    return this.basicAuth("/api/reg", JSON.stringify(param))
  },
  userLogin:async function userLogin(param) {
    await this.getUserFingerprint();
    window.clarity("event", 'userLogin')
    return this.basicAuth("/api/login", JSON.stringify(param))
  },
  getBasicInfoStatus:false,
  getBasicInfo:/*asyncThrottle(*/async function getBasicInfo({task}){
    window.clarity("event", 'getBasicInfo')
    // const getPr = await Auth.getPrtoken();
    // debugger;
    if((!Cookies.get('czigauth'))){
      Cookies.set('czigauth','logout',{
        expires: 7,
        path: "/",
        secure: true,
        domain:'.chiziingiin.top'
      })
    }
    const info = sessionStorage.getItem('userInfo');
    let mode;
    if(info){
      if(JSON.parse(info).avatar){
        mode = 'exist';
      }
    }
    this.getBasicInfoStatus = true
    const res = (await Auth.basicAuth("/api/getBasicInfo",`{"mode":"${mode}"}`)).content;
    sessionStorage.setItem('userInfo',JSON.stringify({
      ...JSON.parse(info),
      ...res,
      expirationTime: new Date().getTime() + 30 * 60 * 1000,
    }))
    if(!res.isLogined){
      if(res.AlreadyAuthenticated == true){
        await this.getPrtoken('force')
      } else {
        // next('/login-needed?url='+encodeURIComponent(Auth.route.fullPath))
      }
    } else {
    }
    // debugger;
    window.clarity("set", 'userTag', res.identityType || 'normal');
    this.getBasicInfoStatus = false;
    return task({
      ...JSON.parse(info),
      ...res,
      expirationTime: new Date().getTime() + 30 * 60 * 1000,
    });
  },/*5000,({task})=>{
    const info = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    return task(info)
  })*/
  getUser:async function getUser(){
    window.clarity("event", 'getUser')
    const stmtGet = sessionStorage.getItem('userInfo')
    if(stmtGet){
      return JSON.parse(stmtGet)
    } else {
      return this.getBasicInfo()
    }
  },
  logout: async function logout(){
    window.clarity("event", 'logout')
    await this.getPrtoken()
    return this.basicAuth("/api/logout")
  },
  checkUsername:async function checkUsername(value){
    await this.getUserFingerprint();
    window.clarity("event", 'checkUsername')
    return this.basicAuth("/api/checkUsername", JSON.stringify({username:value}))
  },
  test:async function test() {
    await this.getUserFingerprint();
    window.clarity("event", 'test')
    return this.basicAuth("/api/test");
  },
  reportErrlog:async function reportErrlog(content) {
    await this.getUserFingerprint();
    window.clarity("event", 'reportErrlog')
    let t = {}
    try{
      t = this.basicAuth("/api/reportErrlog", content,{failed:async ()=>{}});
    }catch(err){}
    return t
  },
  getPrtoken: async function getPrtoken(mode) {
    // // console.log(Cookies.get("czigauth"));
    let userAuth = sessionStorage.getItem("userInfo");
    if (userAuth) {
      userAuth = JSON.parse(userAuth);
    } else {
      userAuth = {};
    }
    const userAuthStatus = userAuth && userAuth?.isLogined;
    if(mode == 'force'){

    }
    else if (Cookies.get("czigauth") == 'AlreadyAuthenticated') {
      return { status: "exist", content: Cookies.get("czigauth") };
    } else if (!Cookies.get("czigauth") && !userAuthStatus && !userAuth?.AlreadyAuthenticated){
      return { status: "notExist", content: Cookies.get("czigauth") };
    }
    window.clarity("event", 'getPrtoken')
    return this.basicAuth("/api/prtoken", "", {
      success: async (data) => {
        Cookies.set("czigauth", "AlreadyAuthenticated", {
          expires: new Date(data.content.expires),
          path: "/",
          secure: true,
          domain:'.chiziingiin.top'
        });
        await this.getUserFingerprint();
        window.clarity("set", 'userID', data.content.customID);
        window.clarity("identify", data.content.customID, data.content.sessionID,'getPrtoken',data.content.customID)
        return data.content;
      },
      failed: async (response, type) => {
        Cookies.set("czigauth", "ERROR", {
          expires: new Date(),
          path: "/",
          secure: true,
          domain:'.chiziingiin.top'
        });
        await this.getUserFingerprint();
        if (response.status === 401) {
          window.clarity("event", 'getPrtoken_401')
          return { status: 'invalid', content: response };
        } else {
          window.clarity("event", 'getPrtoken_Error')
          return { status: 'error', content: response };
        }
      }
    });
  },
  createTeam:async function createTeam(param) {
    window.clarity("event", 'createTeam')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/createTeam",
      JSON.stringify({ name: param.name, desc: param.desc })
    );
  },
  joinTeam:async function joinTeam(param) {
    window.clarity("event","joinTeam")
    await this.getPrtoken();
    return this.basicAuth(
      "/api/joinTeam",
      JSON.stringify({ pid: param.pid })
    );
  },
  getTeamInfo:async function getTeamInfo(param = {}) {
    window.clarity("event", 'getTeamInfo')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/teamInfo",
      JSON.stringify({ uid: param.uid || "", pid: param.pid })
    );
  },
  getTeamList:async function getTeamList(param = {}) {
    window.clarity("event", 'getTeamList')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/teamList",
      JSON.stringify({ uid: param.uid || "" })
    );
  },
  getJoinedTeamList: async function getJoinedTeamList(param = {}) {
    window.clarity("event", 'getJoinedTeamList')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/joinedTeamList",
      JSON.stringify({ uid: param.uid || "" })
    );
  },
  removeTeamUser:async function removeTeamUser(param={}){
    window.clarity("event", 'removeTeamUser')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/teamRemoveMember",
      JSON.stringify(param)
    );
  },
  teamChangeRole:async function teamChangeRole(param){
    window.clarity("event", 'changeRole')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/teamChangeRole",
      JSON.stringify(param)
    );
  },
  getDashboard:async function getDashboard() {
    window.clarity("event", 'getDashboard')
    await this.getPrtoken();
    return this.basicAuth("/api/dashboard", JSON.stringify({}));
  },
  getDashboardAnlysis:async function getDashboardAnlysis(param){
    window.clarity("event", 'getDashboardAnlysis')
    await this.getPrtoken();
    return await this.getStreamText('/api/dashboardAnlysis', { content: JSON.stringify(),}, {
      onmessage:param.onmessage,
      onclose:param.onclose
    });
  },
  createProject: async function createProject(param) {
    window.clarity("event", 'createProject')
    await this.getPrtoken();
    return this.basicAuth("/api/createProject", JSON.stringify({ ...param }));
  },
  getProjectDetail:async function getProjectDetail(param = {}) {
    window.clarity("event", 'getProjectDetail')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/projectDetail",
      JSON.stringify({ projectid: param.id })
    );
  },
  getProjectList:async function getProjectList(param = {}) {
    window.clarity("event", 'getProjectList')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/projectList",
      JSON.stringify({ uid: param.uid || "" })
    );
  },
  getJoinedProjectList:async function getJoinedProjectList(param = {}) {
    window.clarity("event", 'getJoinedProjectList')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/joinedProjectList",
      JSON.stringify({ uid: param.uid || "" })
    );
  },
  createProjectItem:async function createProjectItem(param = {}){
    window.clarity("event", 'createProjectItem')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/project/create-item",
      JSON.stringify({ ...param })
    );
  },
  getProjectItem:async function getProjectItem(param={}){
    window.clarity("event", 'getProjectItem')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/project/get-item",
      JSON.stringify({ projectId: param.projectId, type: param.type })
    );
  },
  getProjectItemByID:async function getProjectItemByID(param={}){
    window.clarity("event", 'getProjectItemByID')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/project/get-item-by-id",
      JSON.stringify({ id: param.id,type: param.type })
    );
  },
  addDiscussion:async function addDiscussion(param={}){
    window.clarity("event", 'addDiscussion')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/project/add-discussion",
      JSON.stringify({ ...param })
    );
  },
  getDiscussionAnlysis:async function getDiscussionAnlysis(param,fns){
    window.clarity("event", 'getDiscussionAnlysis')
    await this.getPrtoken();
    return await this.getStreamText('/api/project/DiscussionAnlysis', { ...param}, {
      onmessage:fns.onmessage,
      onclose:fns.onclose
    });
  },
  removeProjectItem:async function removeProjectItem(param={}){
    window.clarity("event", 'removeProjectItem')
    await this.getPrtoken();
    return this.basicAuth(
      "/api/project/remove-item",
      JSON.stringify({ id: param.id,type: param.type })
    );
  },
  getUserInfo:async function getUserInfo(param = {}) {
    window.clarity("event", 'getUserInfo')
    await this.getPrtoken();
    return this.basicAuth('/api/userinfo', JSON.stringify({ uid: param.uid||'' }), );
  },
  getUpdateList:async function getUpdateList(param = {}){
    window.clarity("event", 'getUpdateList')
    return this.basicAuth('/api/getUpdateList', JSON.stringify({ page:param.page }), );
  },
  getNotification:async function getNotification(param={}){
    window.clarity("event", 'getNotification')
    await this.getPrtoken();
    return this.basicAuth('/api/getNotification', JSON.stringify({ page:param.page }), );
  },
  readNotification: async function readNotification(param={}){
    window.clarity("event", 'readNotification')
    await this.getPrtoken();
    return this.basicAuth('/api/readNotification', JSON.stringify({ list:param.list }), );
  },
  openWindow:async function openWindow(url,callback){
    window.clarity("event", 'openWindow')
    let width = 500;
    let height = 500;
    let left = (screen.width - width) / 2;
    let top = (screen.height - height) / 2;
    let newWindow = window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
    let intervalId;
    intervalId = setInterval(() => {
      if (newWindow.closed) {
        callback();
        clearInterval(intervalId);
      }
    }, 1000);
  },
  /* 实验性功能 */
  getModelList: async function getModelList(){
    window.clarity("event", 'getModelList');
    return this.basicAuth('/api/ai/modelList', '', );
  },
  createModel: async function createModel(param){
    window.clarity("event", 'createModel')
    return this.basicAuth('/api/ai/createModel', JSON.stringify(param), );
  },
  getAIWelcome: async function getAIWelcome(param){
    window.clarity("event", 'getAIWelcome')
    return this.basicAuth('/api/ai/welcome', JSON.stringify(param || {}), );
  },
  getAIAnlysisWelcome: async function getAIAnlysisWelcome(param){
    window.clarity("event", 'getAIAnlysisWelcome')
    return this.basicAuth('/api/ai/anlysisWelcome', JSON.stringify(param || {}), );
  },
  getAISessionID: async function getAISessionID(param){
    window.clarity("event", 'ApplyForAISessionID')
    await this.getPrtoken();
    let _this = this;
    return this.basicAuth('/api/ai/apply_for_sessionID', JSON.stringify({
      vf: await _this.getUserFingerprint(),
      model:param.model,
    }));
  },
  getServerStatus:async function getServerStatus(){
    window.clarity("event", 'getServerStatus')
    return this.basicAuth('/api/getServerStatus', JSON.stringify({
      time:(new Date()).getTime()
    }), );
  },
  getAiChatHistory: async function getAiChatHistory(param){
    window.clarity("event", 'getAiChatHistory')
    await this.getPrtoken();
    return this.basicAuth('/api/ai/get_history');
  },
  getAIChatList: async function getAIChatList(param){
    window.clarity("event", 'getAIChatList')
    await this.getPrtoken();
    return this.basicAuth('/api/ai/get_chat_history', JSON.stringify({
      sessionID: param.sessionID
    }));
  },
  setAIChatResponse: async function setAIChatResponse(param){
    window.clarity("event", 'setAIChatResponse')
    await this.getPrtoken();
    return this.basicAuth('/api/ai/set_chat_response', JSON.stringify({
      sessionID: param.sessionID,
      content: param.content,
      tokens:param.tokens,
      title:param.title
    }));
  },
  setAIChatResponse_test: async function setAIChatResponse(param){
    window.clarity("event", 'setAIChatResponse')
    await this.getPrtoken();
    return this.basicAuth('/api/ai/set_chat_response_test', JSON.stringify({
      sessionID: param.sessionID,
      content: param.content
    }));
  },
  AI_createWorkflow:async function AI_createWorkflow(param){
    window.clarity("event", 'AI_createWorkflow')
    await this.getPrtoken();
    // return this.basicAuth('/api/ai/createWorkflow', JSON.stringify(param), );
    // debugger;
    // // console.log('AI_createWorkflow', param)
    await this.getStreamText('/api/ai/createWorkflow', 
      { projectId: param.projectId, content: param.content,
      },
      {
        onmessage:param.onmessage,
        onclose:param.onclose,
        // stopStatus:param.stopStatus
      }
    );
  },
  chatWithAIAnlysis:async function chatWithAIAnlysis(list, param){
    window.clarity("event", 'chatWithAIAnlysis')
    await this.getPrtoken();
    const res = await this.basicAuth(
      "/api/ai/send",
      JSON.stringify({ content: JSON.stringify(list), vf: param.fingerprint })
    );
    if (res.status === "sus") {
      await this.getStreamText('/api/ai/stream_anlysis', { content: JSON.stringify(list),}, {
        onmessage:param.onmessage,
        onclose:param.onclose
      });
    }
  },
  chatWithAI_Analysis:async function chatWithAI_Analysis(param) {
    window.clarity("event", 'chatWithAI')
    await this.getPrtoken();
    let _this = this;
    if(!param.useAnalysis){
      return param.onclose();
    }
    await this.getStreamText('/api/ai/stream_chat_analysis', 
      { sessionID: param.sessionID, content: param.content,vf:param.vf,
        model:param.line,
      }, {
      onmessage:param.onmessage,
      onclose:param.onclose,
      stopStatus:param.stopStatus
    });
  },
  chatWithAI:async function chatWithAI(param) {
    window.clarity("event", 'chatWithAI')
    await this.getPrtoken();
    let _this = this;
    await this.getStreamText('/api/ai/stream', 
      { sessionID: param.sessionID, content: param.content,analysis:param.analysis,vf:param.vf,
        useAnalysis:param.useAnalysis,
        useInternet:param.useInternet,
        model:param.line,
        time:(dayjs().format('YYYY年MM月DD日 ') )+new Date().toTimeString(),
        sendTime:param.time
      },
      {
        onmessage:param.onmessage,
        onclose:param.onclose,
        stopStatus:param.stopStatus,
        onerror:param.onerror||(()=>{})
      }
    );
  },


  deepMind_Analysis:async function chatWithAI_Analysis(param) {
    window.clarity("event", 'chatWithAI')
    await this.getPrtoken();
    const res = await this.basicAuth('/api/ai/deepMind_Analysis', 
      JSON.stringify({ sessionID: param.sessionID, content: param.content,vf:param.vf,
        model:param.line,time:(dayjs().format('YYYY年MM月DD日 ') )+new Date().toTimeString(),
      }));
    param.onclose(res.content)
    return res.content;
  },
  deepMind_Try:async function chatWithAI_Analysis(param) {
    window.clarity("event", 'chatWithAI')
    await this.getPrtoken();
    await this.getStreamText('/api/ai/deepMind_Try', 
      { sessionID: param.sessionID, content: param.content,vf:param.vf,
        model:param.line,analysis:param.analysis[0],time:(dayjs().format('YYYY年MM月DD日 ') )+new Date().toTimeString(),
      }, {
      onmessage:param.onmessage,
      onclose:param.onclose,
      onerror:param.onerror,
      stopStatus:param.stopStatus
    });
  },
  deepMind_Summary:async function chatWithAI_Analysis(param) {
    window.clarity("event", 'chatWithAI')
    await this.getPrtoken();
    await this.getStreamText('/api/ai/deepMind_Summary', 
      { sessionID: param.sessionID, content: param.content,vf:param.vf,
        model:param.line,analysis:param.analysis[0],analysis2:param.analysis[1]||'无',time:(dayjs().format('YYYY年MM月DD日 ') )+new Date().toTimeString(),
      }, {
      onmessage:param.onmessage,
      onclose:param.onclose,
      onerror:param.onerror,
      stopStatus:param.stopStatus
    });
  },




  chatWithAI_test:async function chatWithAI(param) {
    window.clarity("event", 'chatWithAI')
    await this.getPrtoken();
    let _this = this;
    await this.getStreamText('/api/ai/stream_test', { sessionID: param.sessionID, content: param.content,vf:param.vf}, {
      onmessage:param.onmessage,
      onclose:param.onclose,
      stopStatus:param.stopStatus
    });
  },
  getStreamText:async function getStreamText(url,postData,param) {
    window.clarity("event", 'getStreamText')
    try{
      await this.getPrtoken();
      const postOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        credentials: "include",
      };
      const response = await fetch(url, postOptions);
      if (response.status != 200) {
        if(param.onerror) param.onerror();
        // defaultFailed(response.statusText,3)
        throw new Error("Network response was not ok");
      }
      const model = postData.model;
      // // console.log(model)
      const reader = response.body.getReader();
      let decoder = new TextDecoder();
      let tmp=''
      let errorCount = 0;
      while (true) {
        if(param.stopStatus){
          if(param.stopStatus.value) { param.onclose(false,postData.model); break; }
        }
        try{
          const { done, value } = await reader.read();
          // // console.log('1',value)
          if (done) { 
            if(tmp != '[DONE]'){
              param.onmessage(tmp,model);
            }
            param.onclose(false,postData.model); 
            break; 
          }
          let textArray = (tmp+decoder.decode(value, { stream: true }).replace(/\n/g,"").trim()).split('data: ');
          tmp = textArray.pop();
          // // console.log(textArray);
          for (const text of textArray) {
            if(text == '[DONE]') continue;
            // // console.log(text)
            if(text){
              param.onmessage(text,model);
            }
          }
        } catch(e) {
          errorCount++;
          if(errorCount > 100){
            param.onclose();
            defaultFailed(e,3)
            break;
          }
          // // console.warn('getStreamText - ',e)
        }
      }
    } catch (error) {
      param.onclose(true,postData.model);
      // if(param.onerror) param.onerror(error);
      // defaultFailed(error,3)
      // // console.error(error)
      // defaultFailed(error,2)
    }
  },
  getAIGuestList:async function getAIGuestList() {
    window.clarity("event", 'getAIGuestList')
    await this.getPrtoken();
    return this.basicAuth("/api/danger/viewAIGuest");
  },
  getUserFingerprint:async function getUserFingerprint() {
    window.clarity("event", 'getUserFingerprint')
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    window.clarity("set", 'Fingerprint',result.visitorId);
    return visitorId;
  },
  db:{

  },
  db_init:async function db_init(){
    if (!this.db.version) {
      this.db = new Dexie('lingben_zhixie');
      this.db.version(2).stores({
        user_profile_cache: 'id, avatar, username, nickname, expirationTime'
      });
      return await this.db.open();
    }
  },
  getUserInfoByID:async function getUserInfoByID(user){
    await this.db_init()
    let this_ = this;
    window.clarity("event", 'getUserInfoByID')
    this.db.transaction('rw', this.db.user_profile_cache, async () => {
      const now = Date.now();
      const expiredItems = await this_.db.user_profile_cache.where('expirationTime').below(now).toArray();
      for (const item of expiredItems) {
        await this_.db.user_profile_cache.delete(item.id);
      }
    });
    const result = await this.db.user_profile_cache.where('id').equals(user.id).first();
    if(result){
      return {
        ...user,
        ...result
      }
    } else {
      return await this.mainTaskThread.add(async() => {
        const {content} = await this_.getUserInfo({uid:user.id})
        // debugger;
        try{
          await this_.db.user_profile_cache.add({
            id: content.id,
            avatar: content.avatar,
            username: content.username,
            nickname: content.nickname,
            expirationTime:Date.now() + 60*60*1000
          })
          return {
            ...user,
            ...content
          }
        }catch(e){
          const result = await this.db.user_profile_cache.where('id').equals(user.id).first();
          return {
            ...user,
            ...result
          }
        }
        
      })
     
    }
  },
  getIP:async function getIP(ip){
    // const res = fetch('https://apis.map.qq.com/ws/location/v1/ip?key=L66BZ-OHFCU-DVZVU-BNPTD-KPAF5-CCFPO&ip='+ip)
    return await this.basicAuth('/api/getIP', JSON.stringify({ip:ip}));
  },
  loadRss:async function loadRss(opt){
    try {
      const response = await fetch(BASICURL +'/api/news.xml',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opt)
      });
      const xmlData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
      const items = xmlDoc.getElementsByTagName('item');
      let list = []
      for (let i = 0; i < items.length; i++) {
        const title = items[i].getElementsByTagName('title')[0].textContent;
        const link = items[i].getElementsByTagName('link')[0].textContent;
        const description = items[i].getElementsByTagName('description')[0].textContent;
        const pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;
        // const content = items[i].getElementsByTagName('content:encoded')[0].textContent;
        list.push({
          title: title,
          link: link,
          description: description,
          pubDate: pubDate,
          // content: content
        })
      }
      return list;
    } catch (error) {
      // // console.error('获取 RSS 数据出错：', error);
    }
  },
}
Auth.copyText = navigator.clipboard?(text,fn,er) => {
  window.clarity("event",'copy')
  navigator.clipboard.writeText(text).then(() => {
    fn()
  }).catch((error) => {
    er()
    // // console.error('Error copying text to clipboard:', error);
  });
}:(text,fn,er)=>{
  window.clarity("event",'copy')
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    fn()
  } catch (err) {
    er()
    // // console.error('复制操作失败', err);
  }
  document.body.removeChild(textarea);
}
Auth.copyHtml = false? (html, fn, er) => {
  window.clarity("event", 'copy');
  // 对于现代浏览器，尝试使用Clipboard API复制HTML（如果支持）
  navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], {type: "text/html"})
    })
  ]).then(() => {
    fn();
  }).catch((error) => {
    er();
    // // console.error('Error copying HTML to clipboard:', error);
  });
} : (html,fn,er) => {
  window.clarity("event", 'copy');
  // 对于旧浏览器，使用document.execCommand方式
  const div = document.createElement('div');
  div.innerHTML = html;
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  document.body.appendChild(div);
  const range = document.createRange();
  range.selectNode(div);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  try {
    document.execCommand('copy');
    fn();
  } catch (err) {
    er();
    // // console.error('复制HTML操作失败', err);
  }
  // document.body.removeChild(div);
};
window.copyHtml = Auth.copyHtml;
window.copyText = Auth.copyText;
Auth.functionCall = async function(obj,opt){
  // // console.log(obj)
  if(obj.name == 'get_weather'){
    let info = await Auth.basicAuth('/api/getWeather', JSON.stringify({
      city:obj.args.city
    }))
    let str = `\n\n\`\`\`lingben_bash\n\n> \`get_weather(${info.content.adcode})\`\n\n# ${info.content.city}${info.content.district}天气\n\n${info.content.infos.weather}\n\n温度：${info.content.infos.temperature}℃\n\n风向：${info.content.infos.wind_direction}\n\n风力：${info.content.infos.wind_power}\n\n湿度：${info.content.infos.humidity}%\n\n\`\`\` `
    opt.renderHtml(str)
    return opt.alert({
      title:'天气信息',
      content:`\n\n更新时间${info.content.update_time}\n\n城市：${info.content.city} ${info.content.district}\n\n天气：${info.content.infos.weather}\n\n温度：${info.content.infos.temperature}℃\n\n风向：${info.content.infos.wind_direction}\n\n风力：${info.content.infos.wind_power}\n\n湿度：${info.content.infos.humidity}%\n\n`
    })
  } else if (obj.name == 'get_news'){
    let type = {
      'china':'时政',
      'scroll-news':'即时',
      'world':'国际',
      'finance':'财经'
    }
    let str = `\n\n\`\`\`lingben_bash\n\n> \`get_news(type=${obj.args.type})\`\n\n# ${type[obj.args.type]}新闻 \n\n`
    const list = await Auth.loadRss({type:obj.args.type});
    list.slice(0,5).forEach(item => {
      str+=
      // `<a href="${item.link}" target="_blank" class="normal-color-force flex flex-col w-full h-full p-3 sm:p-4 cursor-pointer rounded-lg  modelbox border">
      //   <h2 class="text-lg font-semibold hover-primary-text">${ item.title }</h2>
      //   <p class="text-gray-700 mt-1 text-xs md:text-sm/tight flex-1">${ item.description }</p>
      //   <p class="text-xs text-gray-600 mt-2">发布时间：${ item.pubDate }</p>
      // </a>`
      `### ${item.title}\n\n> ${ item.pubDate }\n${ item.description }\n\n`
    });
    // // console.log(str);
    str+='\`\`\`\n\n'
    return opt.renderHtml(str)
  } else if (obj.name == 'web_search'){ 
    for(let i = 0; i < obj.args.keywords.length; i++){
      let info = await Auth.basicAuth('/api/webSearch', JSON.stringify({
        keywords:obj.args.keywords[i]
      }));
      // opt.renderHtml(`**查询到的互联网信息**\n\n`)
      for (let j = 0; j < info.content.length; j++) {
        opt.renderHtml(`- [${info.content[j].title}](${info.content[j].link})\n\n> ${info.content[j].snippet}\n\n`)
      }
    }
  }
}
window.onloadTurnstileCallback = function () {
  // // console.log('onload?')
}

export default Auth;