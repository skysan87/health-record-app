<script setup lang="ts">
import { dateFactory } from '@health-record/core/util/DateUtil';

// TODO:
const userName: string = 'dymmy user'
const logout = () => { }
const appVersion = '0.0.1'

const currentDate: string = dateFactory().format('YYYY/MM/DD')
</script>

<template>
  <div class="app-container select-none">
    <div class="app-top_nav bg-green-400 text-center" />
    <div class="app-workspace-layout">
      <div class="app-workspace__sidebar">
        <div class="app-workspace__task_sidebar flex flex-col flex-none bg-gray-800 pt-3 text-white">
          <PartExpandPanel right>
            <template #title>
              <h1 class="font-semibold text-xl leading-tight px-4 pb-1 cursor-pointer">
                <span class="font-mono">{{ currentDate }}</span>
              </h1>
            </template>
            <template #component>
              <div class="flex-none">
                <span class="block px-6 pt-1">Ver.{{ appVersion }}</span>
                <span class="block px-6 pt-1">{{ userName }}</span>
                <a class="block px-6 pt-1 hover:bg-blue-800 hover:opacity-75 cursor-pointer" @click.left="logout">
                  <fa :icon="['fas', 'sign-out-alt']" size="lg" />
                  <span class="pl-1">ログアウト</span>
                </a>
              </div>
            </template>
          </PartExpandPanel>

          <!-- border -->
          <div class="border-b border-gray-600 pt-1" />

          <div class="flex-1 py-4 overflow-y-scroll scrollable-container">
            <div class="mt-5 px-4 flex items-center">
              <div class="font-bold text-lg">
                メニュー
              </div>
            </div>

            <nuxt-link to="/healthcare">
              <div class="py-1 px-5 cursor-pointer hover:bg-blue-700 hover:opacity-75">
                # ヘルスケア
              </div>
            </nuxt-link>

            <nuxt-link to="/dashboard">
              <div class="py-1 px-5 cursor-pointer hover:bg-blue-700 hover:opacity-75">
                # ダッシュボード
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="app-workspace__view">
        <slot />
      </div>
    </div>
  </div>
</template>



<style scoped>
.scrollable-container {
  /* IE, Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;
}

.scrollable-container::-webkit-scrollbar {
  /* Chrome, Safari */
  display: none;
}

.app-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  grid-template-rows: min-content auto;
  grid-template-areas:
    "app-container__top-nav"
    "app-container__workspace";
}

.app-top_nav {
  grid-area: app-container__top-nav;
}

.app-workspace-layout {
  grid-area: app-container__workspace;
  display: grid;
  overflow: hidden;
  position: relative;
  grid-template-columns: 240px auto;
  grid-template-rows: 100%;
  grid-template-areas:
    "app-workspace__sidebar app-workspace__view";
}

.app-workspace__sidebar {
  grid-area: app-workspace__sidebar;

  display: grid;
  grid-template-columns: auto;
  grid-template-areas:
    "app-workspace__task_sidebar";
  grid-template-rows: auto;
  overflow: hidden;
}

.app-workspace__task_sidebar {
  grid-area: app-workspace__task_sidebar;
  width: 100%;
  min-height: 0;
  height: auto;
}

.app-workspace__view {
  grid-area: app-workspace__view;
  /* width: 100%; */
}
</style>