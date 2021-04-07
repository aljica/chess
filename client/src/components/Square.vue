<template>
  <div>
    <button class='btn' @click="onClickSquare()">Sq</button>
    <h2>{{idx}}</h2>
  </div>
</template>

<script>
export default {
  name: 'Square',
  props: ['idx'],
  methods: {
    onClickSquare() {
      this.$emit('clicked', this.idx);
    },
  },
};
</script>
