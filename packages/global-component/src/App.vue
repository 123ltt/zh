<template>
  <div id="app">
    <div id="nav">
      <router-link class="mx-2" to="/">Home</router-link>
      <router-link v-for="link in links" :key="link" class="mx-2" :to="'/'+link">{{ link }}</router-link>
    </div>
    <router-view class="main" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        'conditions',
        'select',
        'upload',
        'table',
        'multipleInput',
        'cascader',
        'ossWatermark',
        'editor',
        'inputTree'
      ]
    }
  }
}
</script>

<style lang="scss">
html,body {
  font-size:12px;
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  text-align: center;
  padding: 10px;
  border-bottom: 1px #ccc solid;
  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.main {
  padding: 10px;
}
</style>
