<template>
  <div v-if="(this.i % 2 === 1 && this.j % 2 === 1) || (this.i % 2 === 0 && this.j % 2 === 0)">
    <b-button @click="clicked()" variant="light">Sq</b-button>
  </div>
  <div v-else-if="(this.i % 2 === 1 && this.j % 2 === 0) || (this.i % 2 === 0 && this.j % 2 === 1)">
    <b-button @click="clicked()" variant="dark">Sq</b-button>
  </div>
</template>

<script>
export default {
  name: 'Square',
  props: ['i', 'j'],
  methods: {
    clicked() {
      this.$emit('clicked', this.i, this.j);
    },
  },
};
</script>
