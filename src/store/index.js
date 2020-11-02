import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import tagsView from './tagsView'
import wei from './modules/wei/index'
import energy from './modules/energy/index'
import lims from './modules/lims/index'
import permission from '@/api/permissions'
import  sysDev from './modules/sys/sysDev'
import floatMenu from './modules/floatMenu';

Vue.use(Vuex);
// const debug = process.env.NODE_ENV !== 'production'
const store = new Vuex.Store({
  modules: {
    app,
    floatMenu,
    user,
    tagsView,
    ...energy,
    ...lims,
    ...wei,
    sysDev,
    permission
  },
  getters
  // strict: debug
});

export default store
