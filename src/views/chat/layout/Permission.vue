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
const isLoginMode = ref(true)  // 状态来切换登录和注册模式

// const disabled = computed(() => !token.value.trim() || loading.value)
const disabled = computed(() => !username.value.trim() || !password.value.trim() || loading.value)


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
    const response = await fetchLogin<{ token: string }>(username.value, password.value);
    // 存储 token, 更新状态等
    console.log(response);
    authStore.setToken(response.token);
    ms.success('Login successful');
    window.location.reload();
  } catch (error) {
    console.error("登录失败:", error);
    ms.error(error.message ?? 'Error');
    authStore.removeToken();
    username.value = '';
    password.value = '';
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  try {
    loading.value = true;
    const response = await fetchRegister<{ token: string }>(username.value, password.value);
    // 存储 token, 更新状态等
    console.log(response);
    authStore.setToken(response.token);
    ms.success('Registration successful');
    window.location.reload();
  } catch (error:any) {
    console.log(error);
    ms.error(error.message ?? 'Error')
    authStore.removeToken()
    username.value = ''
    password.value = ''
  } finally {
    loading.value = false;
  }
}

async function handleAuth() {
  const user = username.value.trim()
  const pass = password.value.trim()

  if (!user || !pass)
    return

  try {
    loading.value = true
    // const response = isLoginMode.value ? await login(user, pass) : await register(user, pass)
    if (isLoginMode.value) {
      const response:any  = await fetchLogin<{ token: string }>(user, pass);
      authStore.setToken(response.token);
      ms.success('Success');
      window.location.reload();
    } else {
      const response:any  = await fetchRegister<{ token: string }>(user, pass);
      authStore.setToken(response.token);
      ms.success('Success');
      window.location.reload();
    }

  }
  catch (error: any) {
    ms.error(error.message ?? 'Error')
    authStore.removeToken()
    username.value = ''
    password.value = ''
  }
  finally {
    loading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleAuth()
  }
}

</script>

<!-- 判断是否登录的页面 -->
<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <!-- <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" /> -->
        <!-- <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" />
        <NButton block type="primary" :disabled="disabled" :loading="loading" @click="handleVerify">
          {{ $t('common.verify') }}
        </NButton> -->
        <!-- <div class="auth-form"> -->
        <NInput v-model:value="username" placeholder="Username" />
        <NInput v-model:value="password" placeholder="Password" type="password" />
        <NButton :loading="loading" @click="handleLogin" :disabled="disabled" type="primary">
          Login
        </NButton>
        <NButton :loading="loading" @click="handleRegister" :disabled="disabled" type="primary">
          Register
        </NButton>
        <!-- </div> -->
      </div>
    </div>
  </NModal>
</template>
