
const floatMenu = {
  state: {
    animate: false ,
  },

  actions: {
    upAnimate({ commit, state },newS) {
      commit('changeAnimate',newS);
    }
  },
  mutations: {
    changeAnimate(state,payload){
      state.animate = payload
    }
   
  },
  
}

export default floatMenu