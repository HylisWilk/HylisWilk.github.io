function gapify(/** @type string */ text, gapsRatio = .2) {
  const gapified = []
  const paragraphs = text.split(/[\r\n]+/)
  paragraphs.forEach(paragraph => {
    const words = paragraph.split(/[\s\t]+/)
    words.forEach(word => {
      gapified.push({
        br: false,
        gap: Math.random() < gapsRatio,
        word: word,
        input: '',
      })
    })
    gapified.push({ br: true })
  })
  return gapified
}
function normalizeWord(/** @type string */ word) {
  return word.replace(/[\s\t\n\r-]/g, '').toLowerCase()
}

const app = new Vue({
  el: '#app',
  data() {
    return {
      tab: 'gapify',
      rawtext: '',
      gapified: [],
      checking: false,
    }
  },
  template: `
  <div id="app" class="container">
    <div class="tabs">
      <ul>
        <li :class="{'is-active': tab === 'gapify'}" @click="tab = 'gapify'"><a>Gap-ify</a></li>
        <li v-if="solving" :class="{'is-active': tab === 'fill-the-gaps'}" @click="tab = 'fill-the-gaps'"><a>Fill the gaps</a></li>
      </ul>
    </div>

    <div v-if="tab === 'gapify'">
      <div class="mb-2">Paste your lyrics here:</div>
      <div class="mb-2"><textarea class="textarea" name="textarea" v-model="rawtext"></textarea></div>
      <div class="mt-4">
        <button class="button is-small" :disabled="!rawtext ? true : null" @click="gapify">Gap-ify!</button>
      </div>
    </div>

    <div v-if="tab === 'fill-the-gaps'">
      <div class="gapified-text">
        <span v-for="(word,idx) in gapified" :key="idx">
          <br v-if="word.br" class="mb-2" />
          <input
            v-else-if="word.gap"
            v-model="word.input"
            class="gap is-small mr-2"
            type="text"
            :class="{'has-background-danger-light': checking && !wordok(word), 'has-text-danger': checking && !wordok(word), 'has-background-success-light': checking && wordok(word), 'has-text-success': checking && wordok(word)}"
            @keydown="checking=false"
            />
          <span v-else class="mr-2">{{word.word}}</span>
        </span>
      </div>
      <div class="mt-4">
        <button class="button is-small" v-if="gapified.length > 0" @click="check">Check</button>
      </div>
    </div>
  </div>
  `,
  computed: {
    solving() {
      return this.gapified.length > 0
    },
  },
  methods: {
    wordok(word) {
      return normalizeWord(word.input) === normalizeWord(word.word)
    },
    gapify() {
      this.checking = false
      this.gapified = gapify(this.rawtext)
      this.tab = 'fill-the-gaps'
    },
    check() {
      this.checking = true
    },
  }
})
