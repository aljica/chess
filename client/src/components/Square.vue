<template>
  <div v-if="(this.i % 2 === 1 && this.j % 2 === 1) || (this.i % 2 === 0 && this.j % 2 === 0)">
    <b-button @click="click()" variant="light">
      <span v-if="!this.squareEmpty()">
        <img width="20" height="20" :src="require(`../assets/chess-pieces/${this.piece}.png`)" />
      </span>
      <span v-else>
        <div>
          emp
        </div>
      </span>
    </b-button>
  </div>
  <div v-else-if="(this.i % 2 === 1 && this.j % 2 === 0) || (this.i % 2 === 0 && this.j % 2 === 1)">
    <b-button @click="click()" variant="secondary">
      <span v-if="!this.squareEmpty()">
        <img width="20" height="20" :src="require(`../assets/chess-pieces/${this.piece}.png`)" />
      </span>
      <span v-else>
        <div>
          emp
        </div>
      </span>
    </b-button>
  </div>
</template>

<script>
export default {

  name: 'Square',
  props: ['i', 'j', 'coordinate', 'piece'],
  methods: {
    squareEmpty() {
      console.log('piece', this.piece);
      if (this.piece === 'e') return true;
      return false;
    },
    click() {
      this.$emit('clicked', this.i, this.j);
    },
  },
};
</script>
