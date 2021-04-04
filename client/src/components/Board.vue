<template>
  <div>
    <Square v-for="index in 64" :key="index" @clicked="print()" />
  </div>
</template>

<script>
import Square from './Square.vue';

export default {
  name: 'Board',
  components: {
    Square,
  },
  methods: {
    do(index) {
      console.log(index);
    },
    print() {
      console.log('clicked');
    },
  },
};
</script>
