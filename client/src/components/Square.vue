<template>
  <div v-if="(this.i % 2 === 1 && this.j % 2 === 1) || (this.i % 2 === 0 && this.j % 2 === 0)">
    <b-button @click="clicked()" variant="light">{{this.piece}}</b-button>
  </div>
  <div v-else-if="(this.i % 2 === 1 && this.j % 2 === 0) || (this.i % 2 === 0 && this.j % 2 === 1)">
    <b-button @click="clicked()" variant="dark">{{this.piece}}</b-button>
  </div>
</template>

<script>
export default {
  name: 'Square',
  props: ['i', 'j', 'coordinate', 'piece'],
  methods: {
    clicked() {
      this.$emit('clicked', this.i, this.j);
    },
  },
};
</script>
