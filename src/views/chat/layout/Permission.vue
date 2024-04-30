<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
import { fetchLogin, fetchRegister } from '@/api'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)
// const token = ref('')

const username = ref('')
const password = ref('')
const Registerusername = ref('')
const Registerpassword1 = ref('')
const Registerpassword2 = ref('')
const invite = ref('')
const isLoginMode = ref(true)  // 状态来切换登录和注册模式

// const disabled = computed(() => !token.value.trim() || loading.value)
const disabled = computed(() => !username.value.trim() || !password.value.trim() || loading.value)
const Registerdisabled = computed(() => !Registerusername.value.trim() || !Registerpassword1.value.trim() || !Registerpassword2.value.trim() || loading.value)

// async function handleVerify() {
//   const secretKey = token.value.trim()

//   if (!secretKey)
//     return

//   try {
//     loading.value = true
//     await fetchVerify(secretKey)
//     authStore.setToken(secretKey)
//     ms.success('success')
//     window.location.reload()
//   }
//   catch (error: any) {
//     ms.error(error.message ?? 'error')
//     authStore.removeToken()
//     token.value = ''
//   }
//   finally {
//     loading.value = false
//   }
// }

// function handlePress(event: KeyboardEvent) {
//   if (event.key === 'Enter' && !event.shiftKey) {
//     event.preventDefault()
//     handleVerify()
//   }
// }

async function handleLogin() {
  console.log("请求登录");
  try {
    loading.value = true;
    const response: any = await fetchLogin<{ token: string }>(username.value, password.value);
    // 存储 token, 更新状态等
    console.log(response);
    authStore.setToken(response.token);
    ms.success('Login successful');
    window.location.reload();
  } catch (error: any) {
    console.error("登录失败:", error);
    ms.error(error.error ?? 'Error');
    authStore.removeToken();
    username.value = '';
    password.value = '';
  } finally {
    loading.value = false;
  }
}

function toRegister(){
  isLoginMode.value = false;
  console.log("切换到注册");
}

function toLogin(){
  isLoginMode.value = true;
  console.log("切换到登录");
}

async function handleRegister() {
  try {
    loading.value = true;
    if(Registerpassword1.value !== Registerpassword2.value){
      ms.error("两次密码不一致");
      return;
    }
    if(Registerpassword1.value.length < 6 || Registerpassword1.value.length > 12){
      ms.error("密码长度必须为6到12个字符之间");
      return;
    }
    const response: any = await fetchRegister<{ token: string }>(Registerusername.value, Registerpassword1.value, invite.value);
    // 存储 token, 更新状态等
    console.log(response);
    authStore.setToken(response.token);
    ms.success('Registration successful');
    window.location.reload();
  } catch (error: any) {
    console.log(error);
    ms.error(error.error ?? 'Error')
    authStore.removeToken()
    username.value = ''
    password.value = ''
  } finally {
    loading.value = false;
  }
}


function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLogin()
  }
}

</script>

<!-- 判断是否登录的页面 -->
<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px" v-if="isLoginMode">
    <div class="p-10 bg-white rounded dark:bg-slate-800" id="login">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
						{{ $t('common.welcome') }}
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <!-- 登录界面 -->
        <NInput v-model:value="username" placeholder="请输入用户名" @keypress="handlePress" />
        <NInput v-model:value="password" placeholder="请输入密码" type="password" @keypress="handlePress" />
        <NButton block :loading="loading" @click="handleLogin" :disabled="disabled" type="primary">
          Login
        </NButton>
        <NButton quaternary type="info" block @click="toRegister">
          注册
        </NButton>
      </div>
    </div>
  </NModal>
  <NModal :show="visible" style="width: 90%; max-width: 640px" v-if="!isLoginMode">
    <div class="p-10 bg-white rounded dark:bg-slate-800" id="login">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            {{ $t('common.welcome') }}
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            <!-- {{ $t('common.unauthorizedTips') }} -->
            注册
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <!-- 登录界面 -->
        <NInput v-model:value="Registerusername" placeholder="请输入用户名"/>
        <NInput v-model:value="Registerpassword1" placeholder="请输入密码，请确保两次输入一致" type="password"/>
        <NInput v-model:value="Registerpassword2" placeholder="请输入密码，请确保两次输入一致" type="password"/>
				<NInput v-model:value="invite" placeholder="邀请码" />
        <NButton block :loading="loading" @click="handleRegister" :disabled="Registerdisabled" type="primary">
          注册
        </NButton>
        <NButton quaternary type="info" block @click="toLogin">
          返回登录
        </NButton>
      </div>
    </div>
  </NModal>
</template>
