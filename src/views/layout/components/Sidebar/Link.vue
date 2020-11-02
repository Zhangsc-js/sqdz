
<template>
<div>
  <a v-if="isExternalLink(to)" :href="to"  target="_blank"  rel='noopener'><slot/></a>
  <router-link v-else :to="to"><slot/></router-link>
</div>
  <!-- eslint-disable vue/require-component-is-->
  <!-- <component v-bind="linkProps(to)">
    <slot/>
  </component> -->
</template>

<script>
import { isExternal } from '@/utils'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    // linkProps(url) {
    //   if (this.isExternalLink(url.path)) {
    //     return {
    //       is: 'a',
    //       href: url.path,
    //       target: '_blank',
    //       rel: 'noopener'
    //     }
    //   }
    //   return {
    //     to: url
    //   }
    // }
  }
}
</script>
