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
// import { use } from "echarts/types/src/extension.js";
const router = useRouter()
const route = useRoute()
const BASICURL = ''
const defaultSuccess = async (data) => data.content?data.content:data;
const defaultFailed = async function (response,code) {
  window.clarity("event", 'auth_error')
  if (response.status === 401) {
    const getPr = await Auth.getPrtoken();
    if(getPr.status=='sus'){
      ElMessage.error('发生错误');
      // ElMessageBox.alert('网络遇到问题，请刷新页面', '错误', {
      //   confirmButtonText: '确定',
      //   callback:()=>{
      //     window.location.reload()
      //   }
      // })
    } else {
      ElMessage.error('未登录或登录过期');
      // console.log(router)
      Auth.router.push('/login-needed?url='+encodeURIComponent(Auth.route.fullPath))
      // window.location.href="/login-needed?url="+encodeURIComponent(window.location.href)
      return { status: 'invalid', content: response };
    }
  } else {
    ElMessage.error('服务器错误');
    try{
      if(code==2){

      }
      if(code==3){
        throw response;
      }
        // 
      if(code==0){
        throw {
          status: 0b00000011,
          message: '这块可能是编写程序疏漏引发的错误，请点击报告错误，并把识别码发给我。感谢你的支持',
        };
      } 
      let text = (await response.text());
      throw new Error(response.url+"<br/>" + text)
    } catch (err){
      console.error(err)
      // ElMessageBox.alert('', '很抱歉，遇到了程序性错误', {
      //   dangerouslyUseHTMLString:true,
      //   customClass:'czigerr',
      //   message: 
      //   `<div class="text-sm ">正像你所看到的这样，我们的软件出现了BUG，但是并不严重，至少我们还能捕获这个错误。软件开发初期，仅用20余天开发，敬请见谅。请联系本项目负责人张新越（赤峰二中202312班）<br/>
      //   以下是可以提供的错误信息<br/><b>状态码：<span style="color:red">${response.status||'未知错误'}</span></b><br/><b>${(err.message+"</b><i>"+err.stack+"")}</i></div>`,
      //   confirmButtonText: '报告错误',
      //   showCancelButton:true,
      //   cancelButtonText:'忽略错误',
      //   'show-close':false,
      //   beforeClose:async (value,instance, done)=>{
      //     if(value=='confirm'){
            // instance.confirmButtonLoading = true
            // instance.confirmButtonText = '上传错误信息'
            const ua = navigator.userAgent;
            const r = await Auth.reportErrlog(JSON.stringify({
              ua,
              link:window.location.href,
              content:`${response.status}:${err.message+err.stack+''}`,
              time:new Date().getTime()
            }))
            console.info('[errId]',r)
            // Auth.copyText(`${r.content.id}`)
            window.clarity("set", 'reportID', r.content.id);
            // ElMessageBox.alert(`已尝试上传错误信息\n错误信息代码：${r.content.id}\n可以将以上信息提供给我，便于分析处理错误`,'提示',{})
          // }
          // done();
        // }
      // })
    }
  }
  return { status: 'error', content: response };
}
class Scheduler {
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
  router: null,
  route: null,
  init: async function init() {
    const prStatus = (await this.getPrtoken("first")).status;
    // console.log(prStatus);
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
      const response = await fetch(BASICURL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data.status === "sus") {
          window.clarity("event", 'auth_success')
          return { status: "sus", content: await success(data) };
        } else {
          return await failed(data, 0);
        }
      } else {
        return await failed(response, 1);
      }
    } catch (error) {
      return await failed(error, 2);
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
            console.log(token);
            resolve(token)
          },
          'error-callback': function(err) {
            console.log(err);
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
  getBasicInfo:/*asyncThrottle(*/async function getBasicInfo({router=Auth.router,route=Auth.route,task,to,next}){
    Auth.router = router;
    Auth.route = route;
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
    if(to?.meta?.nologin){
      next()
    }
    if(this.getBasicInfoStatus){
      next()
      return;
    }
    if(info){
      if(JSON.parse(info).avatar){
        mode = 'exist';
        next()
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
        next()
        await this.getPrtoken('force')
      } else {
        next('/login-needed?url='+encodeURIComponent(Auth.route.fullPath))
      }
    } else {
      next()
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
    return this.basicAuth("/api/reportErrlog", content);
  },
  getPrtoken: async function getPrtoken(mode) {
    // console.log(Cookies.get("czigauth"));
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
  getAIWelcome: async function getAIWelcome(){
    window.clarity("event", 'getAIWelcome')
    return this.basicAuth('/api/ai/welcome', '', );
  },
  getAIAnlysisWelcome: async function getAIAnlysisWelcome(){
    window.clarity("event", 'getAIAnlysisWelcome')
    return this.basicAuth('/api/ai/anlysisWelcome', '', );
  },
  getAISessionID: async function getAISessionID(){
    window.clarity("event", 'ApplyForAISessionID')
    await this.getPrtoken();
    let _this = this;
    return this.basicAuth('/api/ai/apply_for_sessionID', JSON.stringify({
      vf: await _this.getUserFingerprint()
    }));
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
      content: param.content
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
    return this.basicAuth('/api/ai/createWorkflow', JSON.stringify(param), );
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
        model:param.line,
      },
      {
        onmessage:param.onmessage,
        onclose:param.onclose,
        stopStatus:param.stopStatus
      }
    );
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
      if (!response.ok) {
        defaultFailed(response.statusText,3)
        throw new Error("Network response was not ok");
      }
      const model = postData.model;
      // console.log(model)
      const reader = response.body.getReader();
      let decoder = new TextDecoder();
      let tmp=''
      let errorCount = 0;
      while (true) {
        if(param.stopStatus){
          if(param.stopStatus.value) { param.onclose(); break; }
        }
        try{
          const { done, value } = await reader.read();
          // console.log('1',value)
          if (done) { 
            if(tmp != '[DONE]'){
              param.onmessage(tmp,model);
            }
            param.onclose(); 
            break; 
          }
          let textArray = (tmp+decoder.decode(value, { stream: true }).replace(/\n/g,"").trim()).split('data: ');
          tmp = textArray.pop();
          // console.log(textArray);
          for (const text of textArray) {
            if(text == '[DONE]') continue;
            // console.log(text)
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
          console.warn('getStreamText - ',e)
        }
      }
    } catch (error) {
      param.onclose();
      defaultFailed(e,3)
      console.error(error)
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
  }
}
Auth.copyText = navigator.clipboard?(text,fn,er) => {
  window.clarity("event",'copy')
  navigator.clipboard.writeText(text).then(() => {
    fn()
  }).catch((error) => {
    er()
    console.error('Error copying text to clipboard:', error);
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
    console.error('复制操作失败', err);
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
    console.error('Error copying HTML to clipboard:', error);
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
    console.error('复制HTML操作失败', err);
  }
  // document.body.removeChild(div);
};

window.onloadTurnstileCallback = function () {
  console.log('onload?')
}

export default Auth;