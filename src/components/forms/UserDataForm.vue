<script setup>


import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";


const { t } = useI18n();
const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true,
  },
  form: {
    type: Object,
    required: true
  }
})


const emailValid = ref(true);
const passwordValid = ref(true);
const passwordsMatch = ref(true);

watch(() => props.form.email, (newValue) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  emailValid.value = emailPattern.test(newValue);
});

watch(() => props.form.password, (newValue) => {
  passwordValid.value = newValue.length >= 6;
});

watch([() => props.form.password, () => props.form.confirmedPassword], () => {
  passwordsMatch.value = props.form.password === props.form.confirmedPassword;
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    props.form.avatar = file;
  } else {
    alert.show('warning', 'None file attached');
  }
};

</script>

<template>

  <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
    <div
        class="relative z-0 w-full mb-5 group">
        <input
            v-model="props.form.email"
            type="email"
            name="floating_email"
            id="floating_email"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            :class="{
              'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !emailValid
            }"
            placeholder=" "
            required
        />
        <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{{ t('userForm.fields.emailPlaceholder') }}</label>
        <span v-if="!emailValid" class="text-red-400 text-xs">{{ t('common.invalid.emailFormat') }}</span>
    </div>

    <div
        class="relative z-0 w-full mb-5 group">
        <input
            v-model="props.form.username"
            type="text"
            name="floating_username"
            id="floating_username"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
        />
        <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{{ t('userForm.fields.usernamePlaceholder') }}</label>
    </div>

    <div
        class="relative z-0 w-full mb-5 group">
        <input
            v-model="props.form.password"
            type="password"
            name="floating_password"
            id="floating_password"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            :class="{
              'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !passwordsMatch
            }"
            placeholder=" "
            required
        />
        <label
            for="floating_password"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            :class="{
            'text-red-500 dark:text-red-400 peer-focus:text-red-600 peer-focus:dark:text-red-600' : !passwordsMatch
            }"
        >{{ t('userForm.fields.passwordPlaceholder') }}</label>
<!--      #TODO dodać locals do tych opisów błędów -->
        <span v-if="!passwordValid" class="text-red-400 text-xs">{{ t('userForm.message.passwordLengthInfo') }}</span>
    </div>

    <div
        class="relative z-0 w-full mb-5 group">
        <input
            v-model="props.form.confirmedPassword"
            type="password"
            name="repeat_password"
            id="floating_repeat_password"
            class="block bg- py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            :class="{
              'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !passwordsMatch
            }"
            placeholder=" "
            required
        />
        <label
            for="floating_repeat_password"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            :class="{
            'text-red-500 dark:text-red-400 peer-focus:text-red-600 peer-focus:dark:text-red-600' : !passwordsMatch
            }"
        >{{ t('userForm.fields.confirmPasswordPlaceholder') }}</label>
        <p v-if="!passwordsMatch" id="outlined_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-xs">{{ t('userForm.message.passwordDontMatchFun') }}</span> {{ t('userForm.message.passwordDontMatchInfo') }}</p>
    </div>

    <div
        class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-5 group">
          <input v-model="props.form.first_name"  type="text" name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{{ t('userForm.fields.firstNamePlaceholder') }}</label>
      </div>
      <div class="relative z-0 w-full mb-5 group">
          <input v-model="props.form.last_name"  type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{{ t('userForm.fields.lastNamePlaceholder') }}</label>
      </div>
    </div>

    <div
        class="relative z-0 w-full mb-5 group">

      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ t('userForm.fields.uploadAvatar') }}
        <input @change="handleFileChange" type="file" hidden />
        <div class="grid grid-flow-col">
          <div class="flex w-28 h-9 px-2 flex-col bg-blue-600 rounded-md shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">{{ t('userForm.fields.chooseFile') }}</div>
          <p class="mt-auto">{{ t('userForm.fields.selectedFileName') }}: {{props.form.avatar.name}}</p>
        </div>

      </label>

      <div class="mt-1 text-sm text-gray-500 dark:text-gray-300 italic" id="user_avatar_help">{{ t('userForm.fields.uploadAvatarInfo') }}</div>
    </div>
    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ t('userForm.fields.submitText') }}</button>
  </form>

</template>

<style scoped>

</style>