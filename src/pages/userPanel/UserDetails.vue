
<script setup>
  import Avatar from "@/components/Avatar.vue";
  import DetailsContainer from "@/pages/userPanel/DetailsContainer.vue";
  import ChangeAvatar from "@/pages/userPanel/ChangeAvatarModal.vue";

  defineProps(["avatar", "firstName", "lastName", "email", "role", "isModalActive"]);
  const emit = defineEmits(["toggleModal", "refresh"]);

  const toggleModal = () => {
    emit("toggleModal");
  };

  const refresh = () => {
    emit("refresh");
  };


</script>
<template>
  <div class="user-details">
    <section class="avatar-container">
      <Avatar :avatar="avatar" :static="true" />
      <img
        class="avatar-overlay"
        src="../../assets/img/refresh.png"
        alt="overlay"
        @click="toggleModal"
      />
      <ChangeAvatar
        v-if="isModalActive"
        @closeModal="toggleModal"
        @refresh="refresh"
      />
    </section>

    <section class="details">
      <DetailsContainer :label="'firstname'" :data="firstName" :background="'#282828'" />
      <DetailsContainer :label="'lastname'" :data="lastName" :background="'#282828'" />
      <DetailsContainer :label="'email'" :data="email" :background="'#282828'" />
      <DetailsContainer :label="'role'" :data="role" :background="'#282828'" />
    </section>
  </div>
</template>

<style scoped>

.user-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
}

.avatar-container {
  position: relative;
}

.avatar-overlay {
  position: absolute;
  filter: invert(50%);
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
}

.avatar-overlay:hover {
  filter: invert(100%);
  animation: rotateAnimation 2s linear infinite;
  cursor: pointer;
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 1300px) {
  .user-details {
    flex-direction: row;
    align-items: end;
  }

}
@media (max-width: 730px) {
  .details {
    min-width: 250px;
    max-width: 40%;
    margin: 0;
  }
  .user-details {
    flex-direction: column;
    align-items: center;
  }
}
</style>


