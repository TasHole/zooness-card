<template>
  <div>
    <header class="header">
      <div class="header_wrap">
        <nuxt-link to="/" class="logo">
          <SVGElement name="logo" />
        </nuxt-link>
        <h1>
          はじめてのweb会議を少しだけスムーズに
        </h1>
        <div class="links">
          <a
            href="https://twitter.com/tatt_san/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SVGElement name="twitter" class="icon__twitter" />
          </a>

          <a
            href="http://b.hatena.ne.jp/add?mode=confirm&url={URL}&title={ページのタイトル}"
            target="_blank"
            rel="nofollow"
          >
            <SVGElement name="hatena" class="icon__hatena" />
          </a>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import SVGElement from '~/components/SVGElement'
export default {
  components: { SVGElement },
}
</script>

<style lang="scss" scoped>
.header {
  overflow: hidden;
  padding: 0 5%;
  width: 100%;
  background-color: #fcdb00;
  height: 10vh;
  z-index: 100;
  position: fixed;
  will-change: transform;
  transition: 0.8s all cubic-bezier(0.39, 0.575, 0.565, 1);
  h1{
    margin-left: 2em;
    font-size: 0.8rem;
    color:$color_second;
    @media only screen and (max-width: $point_sp) {
      display: none;
    }
  }
}
.header_wrap {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  max-width: 940px;
  min-height: 80px;
  margin-right: auto;
  margin-left: auto;
  .logo {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    max-width: 300px;
    vertical-align: middle;

    svg {
      width: 100%;
    }
    @media only screen and (max-width: $point_sp) {
      margin: 0 auto;
      max-width: 400px;
    }
  }
  .links {
    margin: auto 0 auto auto;
    display: flex;
    justify-content: space-between;
    svg {
      display: block;
      width: 20px;
      height: 20px;
      margin-left: 20px;
    }
  }
}
ul {
  list-style: none;
  li {
    display: inline-block;
    margin-right: 10px;
  }
  a,
  a:active,
  a:visited {
    color: $ground_color;
    text-decoration: none;
  }
}
.nuxt-link-active {
  font-weight: bold;
}
.items,
.list-move {
  transition: all 0.4s ease;
}
.list-leave-active {
  position: absolute;
}
#text {
  transform-origin: 50% 50%;
}
</style>
