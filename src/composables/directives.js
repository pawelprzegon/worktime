export const breakEmail = {
  mounted(el, binding) {
    updateElementContent(el, binding.value);
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      updateElementContent(el, binding.value);
    }
  }
};

function updateElementContent(el, value) {

  if (!el) {
    return;
  }

  const stringValue = Array.isArray(value) ? value[0] : value;

  if (typeof stringValue !== 'string' || !stringValue) {
    el.textContent = '';
    return;
  }

  try {
    el.innerHTML = stringValue.replace("@", "<wbr>@");
  } catch (error) {
    el.textContent = stringValue;
  }
}