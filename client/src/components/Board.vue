<template>
  <div class='wrapper'>
    <Square v-for="index in 64" :key="index" :idx="index" @clicked="print(index)" />
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

<style>
.wrapper {
  display: grid;
  grid-template-columns: 25px 25px 25px;
  grid-gap: 10px;
  background-color: #fff;
  color: #444;
}
</style>
