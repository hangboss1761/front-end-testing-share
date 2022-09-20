<template>
  <el-select v-bind="propsParams" v-model="value" placeholder="请选择" v-on="eventsParams">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    // component props
    propsParams: {
      type: Object,
      default: () => ({}),
    },
    // component events
    eventsParams: {
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
    };
  },
};
</script>
