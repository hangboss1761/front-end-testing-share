<template>
  <section>
    <el-select
      v-bind="propsParams"
      @change="handleChange"
      @clear="handleClear"
      @visible-change="handleVisibleChange"
      clearable
      v-model="value"
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
      </el-option>
    </el-select>
    <div class="pw-change">{{ changeTriggered }}</div>
    <div class="pw-visible-change">{{ visibleChangeTriggered }}</div>
    <div class="pw-clear">{{ clearTriggered }}</div>
  </section>
</template>

<script>
export default {
  props: {
    // component props
    propsParams: {
      type: Object,
      default: () => ({}),
    },
    // custom props
    defaultValue: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      value: this.defaultValue,
      changeTriggered: false,
      visibleChangeTriggered: false,
      clearTriggered: false,
    };
  },
  methods: {
    handleChange() {
      this.changeTriggered = true;
    },
    handleVisibleChange() {
      this.visibleChangeTriggered = true;
    },
    handleClear() {
      this.clearTriggered = true;
    },
  },
};
</script>
