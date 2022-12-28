<template>
  <section>
    <el-select
      v-bind="propsParams"
      v-model="value"
      clearable
      placeholder="请选择"
      @change="handleChange"
      @clear="handleClear"
      @visible-change="handleVisibleChange"
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

<script lang="ts" setup>
import { ref } from 'vue';

interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    propsParams?: Record<string, any>;
    defaultValue?: string;
    options: OptionItem[];
  }>(),
  {
    propsParams: () => ({}),
    defaultValue: '',
    options: () => [],
  },
);

const value = ref(props.defaultValue);
const changeTriggered = ref(false);
const visibleChangeTriggered = ref(false);
const clearTriggered = ref(false);

const handleChange = () => {
  changeTriggered.value = true;
};

const handleVisibleChange = () => {
  visibleChangeTriggered.value = true;
};

const handleClear = () => {
  clearTriggered.value = true;
};
</script>
