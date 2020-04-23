<template lang="pug">
  .field.is-grouped.is-wrap
    .field.is-horizontal
      v-select.font-size(v-model="fontFace" item-text="name" item-value="css" :items="fontList" label="フォント" dense return-object)
      v-text-field.font-size.input( label="サイズ" type="number" min="0" max="999" dense v-model.number="fontSize")
    .field.is-horizontal
      .field.font-style
        v-select(v-model="fontAlign" :items="fontAlignList" label="横方向" dense)
      .field.font-style
        v-select(v-model="fontBaseline" :items="fontBaselineList" label="縦方向" dense)
      button.font-style(
        @click="onClickBold"
        :class="val.bold ? 'is-success' : ''")
        v-icon.icon="mdi-format-bold"
      button.font-style(
        @click="onClickItalic"
        :class="val.italic ? 'is-success' : ''")
        v-icon.icon="mdi-format-italic"
</template>

<script>
const _fontList = [
  {
    name: 'Noto Sans JP',
    css: '"Noto Sans JP"',
    href: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP',
  },
    {
    name: 'ヒラギノ角ゴ Pro W3',
    css: '"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro"',
  },
  {
    name: 'ヒラギノ角ゴ ProN W3',
    css: '"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN"',
  },
  {
    name: 'ヒラギノ角ゴ Pro W6',
    css: '"ヒラギノ角ゴ Pro W6","HiraKakuPro-W6"',
  },
  {
    name: 'ヒラギノ角ゴ ProN W6',
    css: '"ヒラギノ角ゴ ProN W6","HiraKakuProN-W6"',
  },
  {
    name: 'ヒラギノ角ゴ Std W8',
    css: '"ヒラギノ角ゴ Std W8","Hiragino Kaku Gothic Std"',
  },
  {
    name: 'ヒラギノ角ゴ StdN W8',
    css: '"ヒラギノ角ゴ StdN W8","Hiragino Kaku Gothic StdN"',
  },
  {
    name: 'ヒラギノ丸ゴ Pro W4',
    css: '"ヒラギノ丸ゴ Pro W4","Hiragino Maru Gothic Pro"',
  },
  {
    name: 'ヒラギノ丸ゴ ProN W4',
    css: '"ヒラギノ丸ゴ ProN W4","Hiragino Maru Gothic ProN"',
  },
  {
    name: 'ヒラギノ明朝 Pro W3',
    css: '"ヒラギノ明朝 Pro W3","Hiragino Mincho Pro"',
  },
  {
    name: 'ヒラギノ明朝 ProN W3',
    css: '"ヒラギノ明朝 ProN W3","Hiragino Mincho ProN"',
  },
  {
    name: 'ヒラギノ明朝 Pro W6',
    css: '"ヒラギノ明朝 Pro W6","HiraMinPro-W6"',
  },
  {
    name: 'ヒラギノ明朝 ProN W6',
    css: '"ヒラギノ明朝 ProN W6","HiraMinProN-W6"',
  },
  { name: 'メイリオ', css: '"メイリオ","Meiryo"' },
  {
    name: '游ゴシック',
    css: '"游ゴシック","Yu Gothic","游ゴシック体","YuGothic"',
  },
  { name: '游明朝', css: '"游明朝","Yu Mincho","游明朝体","YuMincho"' },
  {
    name: 'M PLUS 1p',
    css: '"M PLUS 1p"',
    href: 'https://fonts.googleapis.com/css?family=M+PLUS+1p',
  },
  {
    name: 'M PLUS Rounded 1c',
    css: '"M PLUS Rounded 1c"',
    href: 'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c',
  },
  {
    name: 'はんなり明朝',
    css: '"Hannari"',
    href: 'https://fonts.googleapis.com/earlyaccess/hannari.css',
  },
  {
    name: 'こころ明朝',
    css: 'Kokoro',
    href: 'https://fonts.googleapis.com/earlyaccess/kokoro.css',
  },
  {
    name: 'さわらび明朝',
    css: '"Sawarabi Mincho"',
    href: 'https://fonts.googleapis.com/css?family=Sawarabi+Mincho',
  },
  {
    name: 'さわらびゴシック',
    css: '"Sawarabi Gothic"',
    href: 'https://fonts.googleapis.com/css?family=Sawarabi+Gothic',
  },
  {
    name: 'ニクキュウ',
    css: '"Nikukyu"',
    href: 'https://fonts.googleapis.com/earlyaccess/nikukyu.css',
  },
  {
    name: 'ニコモジ',
    css: '"Nico Moji"',
    href: 'https://fonts.googleapis.com/earlyaccess/nicomoji.css',
  },
]

function _fontData(data) {
  let face = {
    name: 'Noto Sans JP',
    css: '"Noto Sans JP"',
    href: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP',
  }
  if (data && typeof data.face !== 'undefined') {
    face = data.face
  }

  let bold = false
  if (data && typeof data.bold !== 'undefined') {
    bold = data.bold
  }

  let italic = false
  if (data && typeof data.italic !== 'undefined') {
    italic = data.italic
  }

  let size = 64
  if (data && typeof data.size !== 'undefined') {
    size = data.size
  }

  let align = 'left'
  if (data && typeof data.align !== 'undefined') {
    align = data.align
  }

  let baseline = 'top'
  if (data && typeof data.baseline !== 'undefined') {
    baseline = data.baseline
  }

  return {
    face,
    bold,
    italic,
    size,
    align,
    baseline,
  }
}

export default {
  name: 'Font',
  props: ['value'],
  data() {
    return {
      val: _fontData(this.value),
      fontAlignList: ['start', 'end', 'left', 'right', 'center'],
      fontBaselineList : ['top', 'middle', 'bottom'],
    }
  },
  computed: {
    fontList() {
      return _fontList
    },
    fontFace: {
      get() {
        return this.val.face
      },
      set(newVal) {
        this.val.face = newVal
        this.$emit('input', this.val)
      },
    },
    fontSize: {
      get() {
        return this.val.size
      },
      set(newVal) {
        this.val.size = newVal
        this.$emit('input', this.val)
      },
    },
    fontAlign: {
      get() {
        return this.val.align
      },
      set(newVal) {
        this.val.align = newVal
        this.$emit('input', this.val)
      },
    },
    fontBaseline: {
      get() {
        return this.val.baseline
      },
      set(newVal) {
        this.val.baseline = newVal
        this.$emit('input', this.val)
      },
    },
  },
  watch: {
    value(newVal) {
      this.val = _fontData(newVal)
    },
  },
  methods: {
    onClickBold() {
      this.val.bold = !this.val.bold
      this.$emit('input', this.val)
    },
    onClickItalic() {
      this.val.italic = !this.val.italic
      this.$emit('input', this.val)
    },
  },
  createDefault(src) {
    return _fontData(src)
  },
}
</script>
