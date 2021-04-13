<template>
  <div>
    <b-container fluid="xl">
      <b-row align-v="end" v-for="i in 8" :key="i">
        <b-col offset="*" lg="*" v-for="j in 8" :key="j">
          <Square :i="i" :j="j" :piece="boardAsDict[numToAlphabet[i]+''+j]" @clicked="print(i, j)"/>
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
  data() {
    return {
      numToAlphabet: {
        1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h',
      },
    };
  },
  computed: {
    boardAsDict: function createBoardAsDict() {
      const piecesEnd = this.fen.indexOf(' '); // Where FEN data stops conveying piece positions
      // The rest of the information provided by FEN
      // const gameInfo = this.fen.slice(piecesEnd + 1).split(' ');
      const boardRanks = this.fen.slice(0, piecesEnd).split('/');
      const dict = {};
      let rankNumber = 1; // The current rank on the board that is inspected
      boardRanks.forEach((rank) => {
        const alphabetiCoordinate = this.numToAlphabet[rankNumber];
        let colNumber = 1; // The current column being inspected
        [...rank].forEach((c) => {
          let pieceCoordinate = `${alphabetiCoordinate}${colNumber}`;
          if (!/\d/.test(c)) {
            dict[pieceCoordinate] = c;
            colNumber += 1;
          } else if (/\d/.test(c)) {
            dict[pieceCoordinate] = '';
            const cAsNum = Number(c);
            for (let i = 1; i < cAsNum; i += 1) {
              colNumber += 1;
              pieceCoordinate = `${alphabetiCoordinate}${colNumber}`;
              dict[pieceCoordinate] = '';
            }
            colNumber += 1;
          }
        });
        rankNumber += 1;
      });
      return dict;
    },
  },
  methods: {
    clicked() {
      console.log(this.boardAsDict);
    },
    print(i, j) {
      console.log('coordinates', i, j);
    },
    drawBoardFromFEN() {
      console.log(this.boardAsDict);
      // const piecesEnd = this.fen.indexOf(' '); // Where FEN data stops conveying piece positions
      // The rest of the information provided by FEN
      // const gameInfo = this.fen.slice(piecesEnd + 1).split(' ');
      // const boardRanks = this.fen.slice(0, piecesEnd).split('/');
      // console.log(boardRanks);
    },
  },
  created() {
    this.drawBoardFromFEN();
  },
};
</script>

<style>

</style>
