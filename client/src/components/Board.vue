<template>
  <div>
    <b-container>
      <b-row align-v="end" v-for="i in 8" :key="i">
        <b-col offset="*" sm="*" v-for="j in 8" :key="j">
          <Square :i="i" :j="j" @clicked="print(i, j)" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Square from './Square.vue';

export default {
  name: 'Board',
  props: ['fen'],
  components: {
    Square,
  },
  methods: {
    clicked() {
      console.log('Button clicked!');
    },
    print(i, j) {
      console.log('coordinates', i, j);
    },
  },
  created() {
    console.log('fen', this.fen);
  },
};
</script>

<style>

</style>
