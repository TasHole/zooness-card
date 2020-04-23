<template lang="pug">
  v-flex.section.is-size-7-touch(@click="onClick")
    canvas#canvas(
      :width="canvasWidth"
      :height="canvasHeight"
      )
    .columns
      .column
        p
          |名刺交換できないなら、Zoom背景を名刺にしておけば良いのかも。
          br
          | 原案は、Findy石川さん（
          a(href="https://twitter.com/HRBizDev1/status/1250319945629483011" target="_blank") @HRBizDev1
          | ）のツイートから。
        h3 メリット
        ol
          li 名前の読み違いが起こらない
          li 相手の視野内に必要情報を盛り込める
          li 名刺交換が楽（QRコードを相手に撮ってもらうだけ）
        .preview
          img(:src="canvasData")
        button.button.is-link(@click="onClickDownload")
          v-icon.icon="mdi-download"
          span ダウンロード

      .column
        .layer-config(v-if="currentLayer")
          .field(v-if="currentLayer")
            input.input(
            type="number"
            min="-9999"
            max="9999"
            v-model.number="currentLayer.x")
            input.input(
            type="number"
            min="-9999"
            max="9999"
            v-model.number="currentLayer.y")
            Size(
            v-if="!currentLayer.isText"
            v-model="currentLayer.size"
            :max-width="canvasWidth"
            :max-height="canvasHeight")
            Font(
              v-if="currentLayer.isText"
              v-model="currentLayer.font")
          .field
            v-text-field.input(v-model="layers[9].text" label="氏名" v-on:click="onClickEdit(9)")
          .field
            v-text-field.input(v-model="layers[8].text" label="かな" v-on:click="onClickEdit(8)")
          .field
            v-text-field.input(v-model="layers[7].text" label="会社/部署" v-on:click="onClickEdit(7)")
          .field
            v-text-field.input(v-model="layers[6].text" label="肩書" v-on:click="onClickEdit(6)")
          .field
            v-text-field.input(
              v-model="layers[5].text"
              label="QRコードURL"
              prepend-icon="mdi-qrcode"
              v-on:click="onClickEdit(5)"
              )
            qriously(:value="layers[5].text" :size="200")
          .field
            v-file-input(
              v-model="uploadedFile"
              accept="image/*"
              show-size
              label="会社ロゴ"
              prepend-icon="mdi-image"
              @change="onClickEdit(4)"
              )
          .columns
            .column
              label 色
              button.button(
                @click.stop="toggleColorPicker(layers[1].color)")
                span.color-sample(:style="{ backgroundColor: Color2CSS(layers[1].color) }")
            .column
              .color-picker(@click.stop)
                Sketch(v-model="layers[1].color")
</template>

<script>
import { Sketch } from 'vue-color'
import Dragable from 'vuedraggable'
import Font from '~/components/Font'
import Size from '~/components/Size'
import qriously from "~/plugins/qriously.js"

function Color2CSS(color) {
    if (!color) {
        return '#000'
    } else if (color.a < 1) {
        return (
            'rgba(' +
            color.rgba.r +
            ',' +
            color.rgba.g +
            ',' +
            color.rgba.b +
            ',' +
            color.a +
            ')'
        )
    } else {
        return color.hex
    }
}
class Shadow {
  constructor() {
    this.color = { hex: '#000' }
    this.colorPicker = false
    this.x = 0
    this.y = 0
    this.blur = 0
    this.isEnable = false
  }
}
class Layer {
    constructor(id, src = null) {
        this.id = id
        this.name = 'Layer' + id
        this.image = new Image()
        this.colorPicker = false
        if (src) {
            this.type = src.type
            this.x = src.x
            this.y = src.y
            this.size = Size.createDefault(src.size)
            this.shadow = JSON.parse(JSON.stringify(src.shadow))
            this.color = JSON.parse(JSON.stringify(src.color))
            this.font = Font.createDefault(src.font)
            this.text = src.text
        } else {
            this.type = 0
            this.x = 0
            this.y = 0
            this.shadow = new Shadow()
            this.size = Size.createDefault()
            this.color = { hex: '#333' }
            this.font = Font.createDefault()
            this.text = ''
        }
    }

    get isRect() {
        return this.type === 0
    }

    get isCircle() {
        return this.type === 1
    }

    get isText() {
        return this.type === 3
    }

    get isImage() {
        return this.type === 4
    }

    get width() {
        return this.isText ? 0 : this.size.width
    }

    set width(val) {
        this.size.width = val
    }

    get height() {
        return this.isText ? 0 : this.size.height
    }

    set height(val) {
        this.size.height = val
    }

    get style() {
        if (this.isImage) {
            return {}
        }
        if (this.isText) {
            if (this.border.width > 0) {
                return { color: Color2CSS(this.border.color) }
            }
            return { color: Color2CSS(this.color) }
        }
        if (this.border.width > 0) {
            return {
                color: Color2CSS(this.border.color),
                backgroundColor: Color2CSS(this.color),
            }
        }
        return { color: Color2CSS(this.color) }
    }

    static get TypeNames() {
        return [0, 1, 2, 3, 4, 5, 6]
    }

    get typeName() {
        return Layer.TypeNames[this.type]
    }

    render(context) {
        context.fillStyle = Color2CSS(this.color)
        switch (this.type) {
            case 1: //台形1
                {
                    context.setTransform(1,0,-0.5,1,this.width*0.5,0)
                    context.fillRect(this.x, this.y, this.width, this.height)
                    break
                }
            case 2: //台形2(ぼかしマスク)
                {
                    context.setTransform(1,0,-0.5,1,this.width*0.66,0)
                    context.fillStyle = "rgba(255,255,255,0.3)"
                    context.fillRect(this.x, this.y, this.width, this.height)
                    break
            }
            case 3: //文字
                {
                    if (this.text) {
                        if (this.font) {
                            let font = ''
                            if (this.font.italic) {
                                font += 'italic '
                            }
                            if (this.font.bold) {
                                font += 'bold '
                            }
                            font += this.font.size + 'px '
                            if (this.font.face) {
                                font += this.font.face.css
                            }
                            context.font = font
                            context.textAlign = this.font.align
                            context.textBaseline = this.font.baseline
                        }
                        context.fillText(this.text, this.x, this.y)
                    }
                    break
                }
            case 4: //画像
                {
                    if (this.image.src) {
                        context.drawImage(this.image, this.x, this.y, 100 * this.image.width / this.image.height, 100)
                    }
                    break
                }
            case 5: //画像(ぼかしロゴ)
                {
                    if (this.image.src) {
                        context.filter = "blur(40px) opacity(33%)";
                        context.drawImage(this.image, this.x, this.y, 1000 * this.image.width / this.image.height, 1000)
                    }
                    break
                }
            case 6: //やじるし
                {
                    if (this.image.src) {
                        context.drawImage(arrow(), this.x, this.y, 1000 * this.image.width / this.image.height, 1000)
                    }
                    break
                }
            default: //矩形
                {
                    context.fillRect(this.x, this.y, this.width, this.height)
                }
        }
    }
}

export default {
    components: {
        Sketch,
        Dragable,
        Font,
        Size,
    },
    data() {
        return {
            canvasWidth: 1920,
            canvasHeight: 1080,
            layers: [],
            indexLayers: -1,
            maxId: 0,
            canvasData: null,
            blobUrl: null,
            uploadedFile: null,
            linkElements: [],
            updateTimer: null,
            uploadImageUrl: '',
            url: '',
            rules: {
              url: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || '英数字で入力してください。'
              },
            },
        }
    },
    computed: {
        LayerTypeNames() {
            return Layer.TypeNames
        },
        currentLayer() {
            if (typeof this.layers[this.indexLayers] !== 'undefined') {
                return this.layers[this.indexLayers]
            }
            return null
        },
        arrow() {
          return () => import(`~/assets/img/Vector.svg`)
        },
    },
    watch: {
        canvasWidth(newVal) {
            this.updateCanvas()
        },
        canvasHeight(newVal) {
            this.updateCanvas()
        },
        layers: {
            deep: true,
            handler(to, from) {
                this.updateCanvas()
            },
        },
        uploadedFile(to, from) {
          const reader = new FileReader()
          reader.onload = e => {
            this.layers[4].image.src = this.currentLayer.imageSrc =
              e.target.result
            this.layers[2].image.src = this.currentLayer.imageSrc =
              e.target.result
          }
          reader.readAsDataURL(to)
          this.updateCanvas()
        }
    },
    mounted() {
        for (var i = 0; i <= 10; i++) {
            this.maxId++
            const layer = new Layer(this.maxId)
            layer.width = this.canvasWidth
            layer.height = this.canvasHeight
            this.layers.push(layer)
            this.indexLayers = this.layers.length - 1
        }
        /* 初期化 */
        //矢印
        this.layers[10].type = 6
        this.layers[10].x = 1235
        this.layers[10].y = 310
        //氏名
        this.layers[9].type = 3
        this.layers[9].color = { hex: '#fff' }
        this.layers[9].text = "佐藤 達也"
        this.layers[9].font.size = 84
        this.layers[9].font.bold = true
        this.layers[9].font.align = "right"
        this.layers[9].x = 1600
        this.layers[9].y = 190
        //かな
        this.layers[8].type = 3
        this.layers[8].color = { hex: '#fff' }
        this.layers[8].text = "さとう　たつや"
        this.layers[8].font.size = 32
        this.layers[8].font.align = "right"
        this.layers[8].x = 1590
        this.layers[8].y = 130
        //会社/部署
        this.layers[7].type = 3
        this.layers[7].color = { hex: '#333' }
        this.layers[7].text = "webインテグレーション事業部"
        this.layers[7].font.size = 32
        this.layers[7].x = 148
        this.layers[7].y = 286
        //肩書
        this.layers[6].type = 3
        this.layers[6].color = { hex: '#333' }
        this.layers[6].text = "開発ディレクター"
        this.layers[6].font.size = 60
        this.layers[6].font.bold = true
        this.layers[6].x = 146
        this.layers[6].y = 340
        //QRコードURL
        this.layers[5].type = 3
        this.layers[5].color = { hex: '#333' }
        this.layers[5].text = "https://8card.net/p/"
        this.layers[5].font.size = 64
        //会社ロゴ
        this.layers[4].type = 4
        this.layers[4].x = 128
        this.layers[4].y = 128
        this.layers[4].image.onload = () => {
            this.onLoadImage(layer)
        }
        //ぼかしマスク
        this.layers[3].type = 2
        //会社ロゴ（ぼかし）
        this.layers[2].type = 5
        this.layers[2].x = 1000
        this.layers[2].y = 300
        //テーマカラー
        this.layers[1].type = 1
        this.layers[1].color = { hex: '#1B4884' }
        //背景イメージ
        this.layers[0].type = 0
        this.layers[0].color = { hex: '#fff' }

        /* キャンバスの描画 */
        this.updateCanvas()
    },
    methods: {
        toggleColorPicker(obj) {
            const b = obj.colorPicker
            this.currentLayer.colorPicker = false
            obj.colorPicker = !b
        },
        Color2CSS(color) {
            return Color2CSS(color)
        },
        onClick() {
            this.currentLayer.colorPicker = false
        },
        onImagePicked(file) {
          if (file !== undefined && file !== null) {
            if (file.name.lastIndexOf('.') <= 0) {
              return
            }
            const fr = new FileReader()
            fr.readAsDataURL(file[0])
            fr.addEventListener('onload', () => {
              this.uploadImageUrl = fr.result
            })
          } else {
            this.uploadImageUrl = ''
          }
        },
        onClickDownload() {
            if (this.blobUrl) {
                URL.revokeObjectURL(this.blobUrl)
            }
            this.blobUrl = this.Base64toBlob(this.canvasData)
            const url = URL.createObjectURL(this.blobUrl)
            const a = document.createElement('a')
            a.download = 'CanvasData.png'
            a.href = url
            a.click()
        },
        onClickEdit(index) {
            if (this.currentLayer) {
                this.currentLayer.colorPicker = false
            }
            this.indexLayers = index
        },
        updateCanvas() {
            if (this.updateTimer) {
                clearTimeout(this.updateTimer)
                this.updateTimer = null
            }

            this.updateTimer = setTimeout(() => {
                // 使用するWebフォントを列挙する
                const usingFonts = []
                this.layers.forEach((layer) => {
                        if (layer.isText && layer.font && layer.font.face.href) {
                            usingFonts.push(layer.font.face.href)
                        }
                    })
                    // 使うものを残し、使わないものを削除する
                const newLinkElements = []
                this.linkElements.forEach((e) => {
                        const isFound = usingFonts.find((href) => {
                            return href === e.href
                        })
                        if (isFound) {
                            newLinkElements.push(e)
                        } else {
                            const head = document.getElementsByTagName('head')[0]
                            head.removeChild(e)
                        }
                    })
                    // 追加されたものをロードする
                usingFonts.forEach((href) => {
                    const isFound = newLinkElements.find((e) => {
                        return e.href === href
                    })
                    if (!isFound) {
                        const e = document.createElement('link')
                        e.rel = 'stylesheet'
                        e.href = href
                        const head = document.getElementsByTagName('head')[0]
                        head.appendChild(e)
                        newLinkElements.push(e)
                    }
                })
                this.linkElements = newLinkElements

                const cv = document.getElementById('canvas')
                const ctx = cv.getContext('2d')
                ctx.clearRect(0, 0, cv.width, cv.height)
                this.layers.forEach((layer) => {
                    ctx.save()
                    layer.render(ctx)
                    ctx.restore()
                })
                this.canvasData = cv.toDataURL('image/png')
                this.updateTimer = null
            }, 500)
        },
        Base64toBlob(base64) {
            const b64 = atob(base64.split(',')[1])
            const u8 = Uint8Array.from(b64.split(''), (e) => e.charCodeAt())
            return new Blob([u8], { type: 'image/png' })
        },
    },
}
</script>
<style lang="scss" src="./index.scss"></style>
