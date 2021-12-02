<template>
  <div id="app">

    <div id="nav">
      <router-link to="/">首页</router-link> |
      <router-link to="/Table2">Table2</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>
