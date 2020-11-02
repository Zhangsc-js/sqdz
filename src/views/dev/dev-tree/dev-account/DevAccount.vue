<template>
  <sys-dev-account :params="isEquip" />
</template>

<script>
import SysDevAccount from '@/views/sys/baseData/devTree/dev-account/index';

export default {
  name: 'DevAccount',
  components: {
    SysDevAccount
  },
  data() {
    return {
      isEquip: 1
    }
  }
}
</script>
