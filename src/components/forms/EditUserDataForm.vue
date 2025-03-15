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

</script>

<template>

  <form @submit.prevent="handleSubmit" class="max-w-full md:max-w-md">
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


    <div class="relative z-0 w-full mb-5 group">
        <input v-model="props.form.first_name"  type="text" name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{{ t('userForm.fields.firstNamePlaceholder') }}</label>
    </div>
    <div class="relative z-0 w-full mb-5 group">
        <input v-model="props.form.last_name"  type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{{ t('userForm.fields.lastNamePlaceholder') }}</label>
    </div>


    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ t('common.submitButton') }}</button>
  </form>


</template>

<style scoped>

</style>