<template>
  <span>
    <span class="jt-badge-status-dot" :class="status"></span>
    <span class="jt-badge-status-text">{{ textValue }}</span>
  </span>
</template>

<script>
export default {
  name: 'JtBadge',
  props: {
    status: {
      type: String,
      default: 'success'
    },
    textValue: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.jt-badge-status-dot {
  position: relative;
  top: -1px;
  display: inline-block;
  width: 10px;
  height: 10px;
  vertical-align: middle;
  border-radius: 50%;
}

.error {
  background-color: #f5222d;
}

.processing {
  position: relative;
  background-color: #1890ff;
}

.processing:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #1890ff;
  border-radius: 50%;
  animation: jtStatusProcessing 1.2s ease-in-out infinite;
  content: "";
}

@keyframes jtStatusProcessing {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

.jt-badge-status-text {
  margin-left: 8px;
  color: rgba(0,0,0,.65);
  font-size: 14px;
}

.success {
  background-color: #52c41a;
}

.warning {
  background-color: #faad14;
}

.unactivated {
  background: #9e9e9e;
}
</style>
