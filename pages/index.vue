<template lang="pug">
  v-container.section.is-size-7-touch(@click="onClick")
    canvas#canvas(
      :width="canvasWidth"
      :height="canvasHeight"
      )
    .columns
      .column
        p
          | そのZoom背景、名刺にしておけば良いのかも。
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
      .column
        .columns
          .column
            button.button.is-link(@click="onClickAdd")
              v-icon.icon="mdi-playlist-plus"
              span レイヤー追加
          .column
            button.button.is-link(@click="onClickDownload")
              v-icon.icon="mdi-download"
              span ダウンロード
        .columns
          Dragable.layers(v-model="layers")
            .row.is-flex(
              v-for="(layer, index) in layers"
              :key="layer.id"
              )
              span {{ layer.name }}：
              v-icon.icon="mdi-cloud"
              span.expandable {{ layer.typeName }}
              button.button.fixed-item(
                title="編集"
                @click="onClickEdit(index)"
                )
                v-icon.icon="mdi-comment-edit-outline"
              button.button.fixed-item(
                title="コピーを作成"
                @click="onClickCopy(index)"
                )
                v-icon.icon="mdi-content-duplicate"
              button.button.fixed-item(
                title="削除"
                @click="onClickRemove(index)"
                )
                v-icon.icon="mdi-delete"
        .layer-config(v-if="currentLayer")
          .field
            label 種類
            v-select(v-model="currentLayer.type" items=Layer)
              option(disabled value="")
              option(
                v-for="(name, index) in LayerTypeNames"
                :key="index"
                :value="index"
                ) {{ name }}
          .field
            label 位置
            .field.field-sub.has-addons
              .field
                label X
                .field
                  p.control
                    input.input(
                      type="number"
                      min="-9999"
                      max="9999"
                      v-model.number="currentLayer.x")
                  .field.has-addons
                    button.button(@click="onClickLeft")
                      v-icon.icon="mdi-format-horizontal-align-left"
                    button.button(@click="onClickCenter")
                      v-icon.icon="mdi-format-horizontal-align-center"
                    button.button(@click="onClickRight")
                      v-icon.icon="mdi-format-horizontal-align-right"
              .field
                label Y
                .field
                  p.control
                    input.input(
                      type="number"
                      min="-9999"
                      max="9999"
                      v-model.number="currentLayer.y")
                  .field.has-addons
                    button.button(@click="onClickTop")
                      v-icon.icon="mdi-format-vertical-align-top"
                    button.button(@click="onClickMiddle")
                      v-icon.icon="mdi-format-vertical-align-center"
                    button.button(@click="onClickBottom")
                      v-icon.icon="mdi-format-vertical-align-bottom"
          Size(
            v-if="!currentLayer.isText"
            v-model="currentLayer.size"
            :max-width="canvasWidth"
            :max-height="canvasHeight")
          Font(
            v-if="currentLayer.isText"
            v-model="currentLayer.font")
          .field(v-if="!currentLayer.isImage")
            .field.is-narrow
              label 色
              p.control.field-sub
                button.button(
                  @click.stop="toggleColorPicker(currentLayer)")
                  span.color-sample(
                    :style="{ backgroundColor: Color2CSS(currentLayer.color) }")
            .field.is-narrow
              label 枠線
              .field.field-sub.has-addons
                p.control
                  button.button(
                    @click.stop="toggleColorPicker(currentLayer.border)")
                    span.color-sample(
                      :style="{ backgroundColor: Color2CSS(currentLayer.border.color) }")
                p.control
                  input.input(
                    type="number"
                    min="0"
                    max="9999"
                    v-model.number="currentLayer.border.width")
          .columns(v-if="currentLayer.colorPicker")
            .column.has-text-centered
              .color-picker(@click.stop)
                Sketch(v-model="currentLayer.color")
          .columns(v-if="currentLayer.border.colorPicker")
            .column.has-text-centered
              .color-picker(@click.stop)
                Sketch(v-model="currentLayer.border.color")
          .field.is-horizontal
            label シャドウ
            p.control
              v-switch.v-model="currentLayer.shadow.isEnable"
            .field.is-narrow
              p.control
                button.button(
                  :disabled="!currentLayer.shadow.isEnable"
                  @click.stop="toggleColorPicker(currentLayer.shadow)")
                  span.color-sample(
                    :style="{ backgroundColor: Color2CSS(currentLayer.shadow.color) }")
            .field.is-narrow
              label ぼかし
              p.control
                input.input(
                  :disabled="!currentLayer.shadow.isEnable"
                  type="number"
                  min="0"
                  max="999"
                  v-model.number="currentLayer.shadow.blur")
            .field.is-horizontal
              .field.is-narrow
                label X
                p.control
                  input.input(
                    :disabled="!currentLayer.shadow.isEnable"
                    type="number"
                    min="-999"
                    max="999"
                    v-model.number="currentLayer.shadow.x")
              .field.is-narrow
                label Y
                p.control
                  input.input(
                    :disabled="!currentLayer.shadow.isEnable"
                    type="number"
                    min="-999"
                    max="999"
                    v-model.number="currentLayer.shadow.y")
          .columns(v-if="currentLayer.shadow.colorPicker")
            .column.has-text-centered
              .color-picker(@click.stop)
                Sketch(v-model="currentLayer.shadow.color")
          .field(v-if="currentLayer.isText")
            label テキスト
            p.control
              v-text-field.input(v-model="currentLayer.text")
          .field(v-if="currentLayer.isImage")
            v-file-input(
              v-model="uploadedFile"
              accept="image/*"
              drag-drop
              )
              .content.has-text-centered
                p
                  v-icon(
                    icon="upload"
                    size="is-large"
                  )
                p.is-size-7
                  | 画像ファイルをドロップ
                  br
                  | または、クリックしてファイルを選択
</template>

<script src="./index.js"></script>
<style lang="scss" src="./index.scss"></style>
