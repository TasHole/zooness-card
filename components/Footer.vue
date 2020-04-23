<template>
  <section class="footer">
    <div class="writes">
    <p class="please">
    ＼よかったら
    <a
      href="https://twitter.com/tatt_san/"
      target="_blank"
      rel="noopener noreferrer"
    >
      フォロー
    </a>
    してください／
    </p>
    <a href="https://tatsuya.tokyo">
      <div>
        <SVGElement name="stayhome" class="stayhome" />
        <p>&copy; 2020 Tatsuya Sato</p>
      </div>
    </a>
    </div>
  </section>
</template>

<script>
import SVGElement from '~/components/SVGElement'
export default {
  components: { SVGElement },
}
</script>

<style lang="scss" scoped>
a:hover{
  svg{
    transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
    transform: scale(1.2);
  }
}
.footer {
  .please{
    font-size:0.8em;
  }
  display: flex;
  text-align: center;
  background-color: $ground_color;
  height: 10vh;
  .writes {
    flex-direction: column;
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      sans-serif;
    color: $color_second;
    text-align: center;
    font-weight: 900;
    margin: 0 auto;
    display: flex;
    .stayhome {
      width: 40px;
      margin: 0 auto;
    }
    p {
      margin: 10px 0 0;
    }
  }
}
</style>
