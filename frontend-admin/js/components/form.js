export function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

export function fillForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;
    Object.entries(data).forEach(([key, value]) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = value || '';
    });
}

export function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}
