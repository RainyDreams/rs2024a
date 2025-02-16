// src/directives/v-long-press.js
export default {
  mounted(el, binding) {
    let timer = null;
    let isLongPress = false;

    const longPressCallback = () => {
      isLongPress = true;
      binding.value(); // 执行绑定的回调函数
    };

    const startPress = () => {
      isLongPress = false;
      timer = setTimeout(longPressCallback, 1000); // 1秒触发长按回调
    };

    const cancelPress = () => {
      clearTimeout(timer);
      if (!isLongPress) {
        // 如果是短按，则可以触发短按操作
        binding.arg && binding.arg();
      }
    };

    el.addEventListener('mousedown', startPress); // 鼠标按下
    el.addEventListener('touchstart', startPress); // 移动端触摸开始
    el.addEventListener('mouseup', cancelPress);   // 鼠标抬起
    el.addEventListener('touchend', cancelPress);  // 移动端触摸结束
    el.addEventListener('mouseleave', cancelPress); // 鼠标离开

    // 清理事件监听
    el._longPressCleanup = () => {
      el.removeEventListener('mousedown', startPress);
      el.removeEventListener('touchstart', startPress);
      el.removeEventListener('mouseup', cancelPress);
      el.removeEventListener('touchend', cancelPress);
      el.removeEventListener('mouseleave', cancelPress);
    };
  },
  unmounted(el) {
    el._longPressCleanup();
  }
};
