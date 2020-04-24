<template lang="pug">
  v-flex.section.is-size-7-touch(@click="onClick")
    canvas#canvas(
      :width="canvasWidth"
      :height="canvasHeight"
      )
    .columns
      .column
        h2 バーチャル背景を名刺にして、“データで”交換しませんか？
        p
          | 原案は、Findy石川さん（
          a(href="https://twitter.com/HRBizDev1/status/1250319945629483011" target="_blank") @HRBizDev1
          | ）のツイートから。
          br
          | フォームに入力すると簡単に生成できます。不要な項目は未入力でOK。
        h3 メリット
        ol
          li 名前の読み違いが起こらない
          li 相手の視野内に必要情報を盛り込める
          li 名刺交換が楽（QRコードを相手に撮ってもらうだけ）
        .preview
          img(:src="canvasData")
      .column
        .layer-config(v-if="currentLayer")
          .field
              v-file-input(
                v-model="uploadedFile"
                accept="image/*"
                show-size
                label="会社ロゴ"
                prepend-icon="mdi-image"
                @change="onClickEdit(4)"
                )
          .field
            v-text-field.input(v-model="layers[7].text" label="会社/部署" v-on:click="onClickEdit(7)" prepend-icon="mdi-city")
          .field
            v-text-field.input(v-model="layers[6].text" label="肩書" v-on:click="onClickEdit(6)" prepend-icon="mdi-tie")
          .field
            v-text-field.input(v-model="layers[8].text" label="かな" v-on:click="onClickEdit(8)" prepend-icon="mdi-alphabetical")
          .field
            v-text-field.input(v-model="layers[9].text" label="氏名" v-on:click="onClickEdit(9)" prepend-icon="mdi-feather")

          .field
            v-text-field.input(
              v-model="layers[5].text"
              label="QRコードURL"
              prepend-icon="mdi-qrcode"
              v-on:click="onClickEdit(5)"
              )
            qriously#qriously(:value="layers[5].text" :size="200")

          .field.columns
            label 色
            button.button(
              @click="toggleColorPicker(layers[1].color)")
              span.color-sample(:style="{ backgroundColor: Color2CSS(layers[1].color) }")
            .field(v-if="colorPickerActive")
              .color-picker(@click.stop)
                Sketch(v-model="layers[1].color")
          button.download.is-link(@click="onClickDownload")
            span ダウンロード
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
                    context.setTransform(1,0,-0.5,1,this.width*0.62,0)
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
                    let p1 = new Path2D("M1364.94 357.909C1362.56 357.909 1360.62 359.823 1360.62 362.249C1360.62 364.642 1362.56 366.588 1364.94 366.588C1367.33 366.588 1369.26 364.642 1369.26 362.249C1369.26 359.823 1367.29 357.909 1364.94 357.909ZM1364.94 360.079C1366.09 360.079 1367.1 361.004 1367.1 362.249C1367.1 363.493 1366.09 364.418 1364.94 364.418C1363.73 364.418 1362.78 363.461 1362.78 362.249C1362.78 361.068 1363.73 360.079 1364.94 360.079ZM1340.21 362.312V367.354H1358.49C1357.54 373.417 1355.5 380.374 1342.21 382.831L1344.5 387.617C1350.67 386.405 1355.37 383.596 1358.46 380.278C1361.41 377.087 1362.84 373.194 1363.73 368.599L1358.46 362.312H1340.21Z")
                    let p2 = new Path2D("M1369.52 362.281V386.149H1394.12V362.281H1369.52ZM1388.97 381.395H1374.67V367.067H1388.97V381.395Z")
                    let p3 = new Path2D("M1398.06 362.217V367.258H1417.26C1416.15 374.598 1412.81 380.469 1400.16 382.831L1402.42 387.585C1420.19 383.852 1422.54 372.3 1423.05 362.217H1398.06Z")
                    let p4 = new Path2D("M1442.6 374.63C1444.7 373.034 1447.11 371.056 1449.78 367.929L1445.91 364.993C1441.23 370.992 1434.18 375.491 1427.34 377.502L1429.41 381.618C1432.33 380.661 1435.16 379.352 1437.9 377.789V388H1442.6V374.63Z")
                    let p5 = new Path2D("M1454.04 371.375V376.64H1481.25V371.375H1454.04Z")
                    let p6 = new Path2D("M1490.95 361.61H1485.9V369.205C1485.9 376.385 1484.85 380.278 1481.44 384.011L1485.29 387.936C1488.69 384.649 1490.95 379.544 1490.95 368.758V361.61ZM1499.56 360.813H1494.51V387.266C1506.68 386.787 1509.67 378.204 1511.01 372.556L1506.18 370.481C1504.9 378.331 1501.6 379.927 1499.56 380.884V360.813Z")
                    let p7 = new Path2D("M1528.39 310.292L1534.71 316.638C1535.1 317.028 1535.1 317.659 1534.71 318.048L1528.39 324.394C1528 324.784 1527.37 324.784 1526.98 324.394C1526.59 324.005 1526.59 323.374 1526.98 322.984L1531.61 318.34L1235.99 318.34C1235.44 318.34 1235 317.894 1235 317.343C1235 316.792 1235.44 316.346 1235.99 316.346L1531.61 316.346L1526.98 311.702C1526.59 311.313 1526.59 310.681 1526.98 310.292C1527.37 309.903 1528 309.903 1528.39 310.292Z")
                    context.fillStyle = "white"
                    context.fill(p1)
                    context.fill(p2)
                    context.fill(p3)
                    context.fill(p4)
                    context.fill(p5)
                    context.fill(p6)
                    context.fill(p7)
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
            qrData: null,
            blobUrl: null,
            uploadedFile: null,
            linkElements: [],
            updateTimer: null,
            uploadImageUrl: '',
            url: '',
            colorPickerActive: false,
            rules: {
              url: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || '英数字で入力してください。'
              },
            },
        }
    },
    computed: {
        currentLayer() {
            if (typeof this.layers[this.indexLayers] !== 'undefined') {
                return this.layers[this.indexLayers]
            }
            return null
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
        for (var i = 0; i <= 11; i++) {
            this.maxId++
            const layer = new Layer(this.maxId)
            layer.width = this.canvasWidth
            layer.height = this.canvasHeight
            this.layers.push(layer)
            this.indexLayers = this.layers.length - 1
        }
        /* 初期化 */
        // QR
        this.layers[11].type = 4
        this.layers[11].x = 1235
        this.layers[11].y = 310
        //矢印
        this.layers[10].type = 6
        this.layers[10].x = 1235
        this.layers[10].y = 310
        //氏名
        this.layers[9].type = 3
        this.layers[9].color = { hex: '#fff' }
        this.layers[9].text = ""
        this.layers[9].font.size = 72
        this.layers[9].font.bold = true
        this.layers[9].font.align = "right"
        this.layers[9].x = 1550
        this.layers[9].y = 190
        //かな
        this.layers[8].type = 3
        this.layers[8].color = { hex: '#fff' }
        this.layers[8].text = ""
        this.layers[8].font.size = 32
        this.layers[8].font.align = "right"
        this.layers[8].x = 1540
        this.layers[8].y = 130
        //会社/部署
        this.layers[7].type = 3
        this.layers[7].color = { hex: '#333' }
        this.layers[7].text = ""
        this.layers[7].font.size = 32
        this.layers[7].x = 148
        this.layers[7].y = 286
        //肩書
        this.layers[6].type = 3
        this.layers[6].color = { hex: '#333' }
        this.layers[6].text = ""
        this.layers[6].font.size = 60
        this.layers[6].font.bold = true
        this.layers[6].x = 146
        this.layers[6].y = 340
        //QRコードURL
        this.layers[5].type = 3
        this.layers[5].text = "https://8card.net/p/"
        this.layers[5].font.size = 0
        //会社ロゴ
        this.layers[4].type = 4
        this.layers[4].x = 128
        this.layers[4].y = 128
        //ぼかしマスク
        this.layers[3].type = 2
        //会社ロゴ（ぼかし）
        this.layers[2].type = 5
        this.layers[2].x = 1150
        this.layers[2].y = 350
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
        toggleColorPicker() {
            if(this.colorPickerActive){
              this.colorPickerActive=false
              return
            }else{
              this.colorPickerActive=true
              return
            }
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
            this.updateCanvas()
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
                const qr = document.getElementById('qriously').querySelector("canvas")
                const qrImage = new Image()
                this.qrData = qr.toDataURL('image/png')
                qrImage.src = this.qrData
                ctx.clearRect(0, 0, cv.width, cv.height)
                this.layers.forEach((layer) => {
                    ctx.save()
                    layer.render(ctx)
                    ctx.restore()
                })
                ctx.save()
                ctx.drawImage (qrImage, 1620, 170, 200, 200)
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
