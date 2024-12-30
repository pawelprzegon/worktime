<script setup>

</script>

<template>

  <div
      class="
      rounded-lg bg-mute p-2  w-24 h-24
      portrait-xs:w-14 portrait-xs:h-14
      portrait-small:w-16 portrait-small:h-16
      portrait-medium:w-20 portrait-medium:h-20
      portrait-large:w-24 portrait-large:h-24
      portrait-xl:w-24 portrait-xl:h-24
      "
  >

  </div>

</template>

<style scoped>

.empty-day {
  background: var(--vt-c-black-mute);
  border-radius: 8px;
  width: 100px;
  height: 100px;
}

@media(max-width: 875px) {
  .empty-day {
    width: 90px;
    height: 90px;
  }
}

@media(max-width: 800px) {
  .empty-day {
    width: 80px;
    height: 80px;
    border-radius: 5px;
  }
}

@media(max-width: 750px) {
  .empty-day {
    width: 75px;
    height: 75px;
    border-radius: 5px;
    padding: 4px;
  }
}

@media(max-width: 690px) {
  .empty-day {
    width: 70px;
    height: 70px;
    border-radius: 5px;
    padding: 4px;
  }
}

@media(max-width: 650px) {
  .empty-day {
    width: 65px;
    height: 65px;
    border-radius: 3px;
    padding: 4px;
  }

}

@media(max-width: 620px) {
  .empty-day {
    width: 60px;
    height: 60px;
    border-radius: 3px;
    padding: 3px;
  }

}

@media(max-width: 570px) {
  .empty-day {
    width: 55px;
    height: 55px;
    border-radius: 3px;
    padding: 3px;
  }

}

@media(max-width: 520px) {
  .empty-day {
    width: 50px;
    height: 50px;
    border-radius: 3px;
    padding: 2px;
  }

}

@media(max-width: 480px) {
  .empty-day {
    width: 45px;
    height: 45px;
    border-radius: 2px;
    padding: 2px;
  }

}

@media(max-width: 430px) {
  .empty-day {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    padding: 2px;
  }
}

</style>