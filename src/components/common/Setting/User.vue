<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import pkg from '../../../../package.json'
import { fetchChatConfig, getLastVersion } from '@/api'
import { useAuthStore } from '@/store'
import { gptUsage, fetchuser } from "@/api";

interface ConfigState {
	timeoutMs?: number
	reverseProxy?: string
	apiModel?: string
	socksProxy?: string
	httpsProxy?: string
	usage?: string
	userbalance?: string
	hard_limit_usd?: string
	username?: string
}

const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()

async function fetchConfig() {
	try {
		loading.value = true
		// const { data } = await fetchChatConfig<ConfigState>()
		// config.value = data

		var tokenString: any = localStorage.getItem('SECRET_TOKEN');
		const tokenJson = JSON.parse(tokenString);
		const dd:any = await fetchuser(tokenJson.data);
		config.value = {
			usage: dd.usage ? `${dd.usage}` : '-'
			, userbalance: dd.userbalance ? `${dd.userbalance}` : '-'
			, hard_limit_usd: dd.hard_limit_usd ? `${dd.hard_limit_usd}` : '-'
			, username: dd.username ? `${dd.username}` : '-'
			,"apiModel": "ChatGPTAPI",
			"reverseProxy": "-",
			"timeoutMs": 100000,
			"socksProxy": "-",
			"httpsProxy": "-",
		};

	}
	finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchConfig();
})

</script>


<template>
	<NSpin :show="loading">
		<div class="p-4 space-y-4">
			<h2 class="text-xl font-bold">
				<!-- Version - {{ pkg.version }}
        <a class="text-red-500" href="https://github.com/Dooy/chatgpt-web-midjourney-proxy" target="_blank" v-if=" isShow  "> ({{ $t('mj.findVersion') }} {{ st.lastVersion }})</a>
        <a class="text-gray-500" href="https://github.com/Dooy/chatgpt-web-midjourney-proxy" target="_blank" v-else-if="st.lastVersion"> ({{ $t('mj.yesLastVersion') }})</a> -->
				{{ $t('setting.welcome') }}
			</h2>
			<!-- <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p v-html="$t('mj.infoStar')"></p>
      </div> -->
			<p>{{ $t("setting.hello") }} {{ config?.username ?? '-' }}</p>
			<p>{{ $t("setting.api") }}：{{ config?.apiModel ?? '-' }}</p>
			<p class=" flex items-center justify-between">
			<div>
				{{ $t("setting.monthlyUsage") }}：{{ config?.usage ?? '-' }}
			</div>
			<!-- <div>
				{{ $t("mj.totalUsage") }}：{{ config?.hard_limit_usd ? (+config?.hard_limit_usd).toFixed(2) : '-' }}
			</div> -->
			<div>
				{{ $t("setting.balance") }}：{{ config?.userbalance ?? '-' }}
			</div>
			</p>
			<div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
				<p v-html="$t('mj.infoStar')"></p>
			</div>
			<!-- <p v-if="!isChatGPTAPI">
        {{ $t("setting.reverseProxy") }}：{{ config?.reverseProxy ?? '-' }}
      </p> -->

			<!-- <p>{{ $t("setting.timeout") }}：{{ config?.timeoutMs ?? '-' }}</p>  -->
			<!-- <p>{{ $t("setting.socks") }}：{{ config?.socksProxy ?? '-' }}</p>
      <p>{{ $t("setting.httpsProxy") }}：{{ config?.httpsProxy ?? '-' }}</p> -->
		</div>
	</NSpin>
</template>
