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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventsParams?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue?: string;
    options: OptionItem[];
  }>(),
  {
    propsParams: () => ({}),
    eventsParams: () => ({}),
    defaultValue: '',
    options: () => [],
  },
);

const value = ref(props.defaultValue);
</script>
