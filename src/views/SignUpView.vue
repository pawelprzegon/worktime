<script setup>
import {ref} from 'vue';
import {registerUser, saveAvatar} from "@/composables/fetchers.js";
import { useRouter } from "vue-router";
import {useI18n} from "vue-i18n";
import UserDataForm from "@/components/forms/UserDataForm.vue";

const { t } = useI18n();
const router = useRouter()
const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  confirmedPassword: '',
  avatar: 'default.png'
});


const handleSubmit = async () => {
  const avatar_file = form.value.avatar
  form.value.avatar = avatar_file.name
  const response = await registerUser(form.value)
  const avatarSaveResponse = await saveAvatar(response.id, avatar_file)
  router.push('/')

};


</script>

<template>
<section class="bg-white dark:bg-primary">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div class="flex flex-col justify-center">
            <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{{ t('signup.text.header') }}</h1>
            <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">{{ t('signup.text.info') }}</p>
            <a class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">{{ t('signup.text.more') }}
                <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
        <div>
            <div class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-neutral-900">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">
                    {{ t('signup.form.header') }}
                </h2>
                <UserDataForm
                    :handle-submit="handleSubmit"
                    :form="form"
                />

            </div>
        </div>
    </div>
</section>

</template>

<style scoped>

</style>
