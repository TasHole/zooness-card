<template>
    <div :class="[{'-drag': isDrag == 'new'}]"
        @dragover.prevent="checkDrag($event, 'new', true)"
        @dragleave.prevent="checkDrag($event, 'new', false)"
        @drop.prevent="onDrop"
    >
        <i aria-hidden="true" class="fa fa-plus"></i>
        <div class="drop">
            <p class="drag-drop-info">ここにファイルをドロップ</p>
            <p>または</p>
            <label for="corporation_file" class="btn btn-success">
                ファイルを選択
                <input type="file" class="drop__input" style="display:none;"
                   id="corporation_file"
                   @change="onDrop"
                >
            </label>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDrag: null
        }
    },
    methods: {
        //inputタグとドラッグ&ドロップから呼ばれる
        onDrop (event, key = '', image = {}) {
            this.isDrag = null; //★ドラッグ中のクラスを外しておく。
            let fileList = event.target.files ? event.target.files : event.dataTransfer.files; //★①ファイル取得
            // ファイルが無い時は処理を中止
            if(fileList.length == 0){
                return false;
            }
            let files    = [];
            for(let i = 0; i < fileList.length; i++){
                files.push(fileList[i]);
            }
            // 今回は1ファイルのみ送ることにする。
            let file = files.length > 0 ? files[0] : [];
            let fd   = new FormData(); //★②
            fd.append('file', file);

            this.$root.ajax('post', url, fd, (data) => {
                // 同じファイル名を選択した際にchangeイベントが走るようにvalueを初期化する。//★③
                event.target.value = null;
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　// あとは、コールバック処理に色々書く。
            });
        }
    }
};
