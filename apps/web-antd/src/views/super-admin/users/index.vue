<script setup lang="ts">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { geUserList, type UsersApi } from '#/api/super-admin/users';

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入用户名',
      },
      // 字段名
      fieldName: 'username',
      // 界面显示的label
      label: '用户名',
    },
  ],
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-5',
});
function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
const state = reactive({
  total: 0,
  listData: [],
});

async function getListData(params: UsersApi.GetUserListParams) {
  const res = await geUserList(params);
  state.total = res.total;
  state.listData = res.list;
  return {
    total: res.total,
    items: res.list,
  };
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'avatar', title: '头像' },
    { field: 'id', title: 'id', width: 50 },
    { field: 'createdAt', title: '注册时间' },
    { field: 'nickname', title: '昵称' },
    { field: 'username', title: '用户名' },
    { field: 'email', title: '邮箱' },
    { field: 'phone', title: '手机号' },
    { field: 'status', title: '状态' },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getListData({
          page,
          pageSize: 10,
        });
      },
    },
  },
  data: [],
  // height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  stripe: true,
};

const gridEvents: VxeGridListeners<RowType> = {
  cellClick: ({ row }) => {
    message.info(`cell-click: ${row.username}`);
  },
};

const [Grid] = useVbenVxeGrid({ gridEvents, gridOptions });
</script>

<template>
  <div class="p-5">
    <QueryForm />
    <div class="w-full">
      <Grid />
    </div>
  </div>
</template>
