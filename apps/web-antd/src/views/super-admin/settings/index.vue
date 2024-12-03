<script setup lang="ts">
import { onMounted } from 'vue';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getOptions, setOptions } from '#/api/super-admin/option';

const [BaseForm, baseFormApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      // class: 'w-full',
    },
  },
  handleSubmit: handleSetOptions,
  layout: 'vertical',
  submitButtonOptions: {
    content: '保存',
  },
  schema: [
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            label: '是',
            value: 'true',
          },
          {
            label: '否',
            value: 'false',
          },
        ],
      },
      defaultValue: 'true',
      fieldName: 'register',
      label: '开放注册',
      rules: 'required',
    },
  ],
});

const getOptionsData = async () => {
  const res = await getOptions();
  const formValue: Record<string, any> = {};
  res.items.forEach((item) => {
    formValue[item.key] = item.value;
  });
  baseFormApi.setValues(formValue);
};

async function handleSetOptions(values: Record<string, any>) {
  await setOptions(values);
  message.success('设置成功');
  await getOptionsData();
}

onMounted(async () => {
  getOptionsData();
});
</script>

<template>
  <div class="p-5">
    <Card title="基本设置">
      <BaseForm />
    </Card>
  </div>
</template>
