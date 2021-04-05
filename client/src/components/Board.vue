<template>
  <div>
    <Square v-for="index in 64" :key="index" @clicked="print()" />
    <h2>{{id}}</h2>
  </div>
</template>

<script>
import Square from './Square.vue';

export default {
  name: 'Board',
  props: ['id'],
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
