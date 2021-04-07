<template>
  <div>
    <Square v-for="index in 64" :key="index" :idx="index" @clicked="print(index)" />
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
    print(idx) {
      console.log(idx);
    },
  },
};
</script>
