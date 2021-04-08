<template>
  <div>
    <button class='box' @click="onClickSquare()">Sq</button>
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

<style>
.box {
  background-color: #444;
  color: #fff;
  border-radius: 1px;
  padding: 10px;
  font-size: 100%;
}
</style>
