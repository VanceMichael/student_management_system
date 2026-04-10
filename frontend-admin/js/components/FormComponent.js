class FormComponent {
  constructor(formId, options = {}) {
    this.form = typeof formId === 'string' ? document.getElementById(formId) : formId;
    if (!this.form) {
      console.error('Form element not found');
      return;
    }
    this.options = {
      fields: options.fields || [],
      onSubmit: options.onSubmit || (() => {}),
      validationRules: options.validationRules || {}
    };
    this.bindEvents();
  }

  bindEvents() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        const formData = this.getFormData();
        this.options.onSubmit(formData, e);
      }
    });

    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        const feedbackEl = field.parentElement.querySelector('.invalid-feedback') || 
                          field.nextElementSibling;
        if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
          feedbackEl.style.display = 'none';
          field.classList.remove('is-invalid');
        }
      });
    });
  }

  validate() {
    let isValid = true;
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  validateField(field) {
    const rules = this.options.validationRules[field.name];
    if (!rules) return true;

    let isValid = true;
    let errorMessage = '';
    const value = field.value;

    if (rules.required && !value) {
      isValid = false;
      errorMessage = rules.message || '此字段为必填项';
    } else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `最少需要 ${rules.minLength} 个字符`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `最多允许 ${rules.maxLength} 个字符`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = rules.patternMessage || '格式不正确';
    } else if (rules.custom && typeof rules.custom === 'function') {
      const customResult = rules.custom(value, this.getFormData());
      if (customResult !== true) {
        isValid = false;
        errorMessage = customResult;
      }
    }

    this.setFieldState(field, isValid, errorMessage);
    return isValid;
  }

  setFieldState(field, isValid, errorMessage) {
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid);

    let feedbackEl = field.parentElement.querySelector('.invalid-feedback');
    if (!feedbackEl && errorMessage) {
      feedbackEl = document.createElement('div');
      feedbackEl.className = 'invalid-feedback';
      field.parentNode.insertBefore(feedbackEl, field.nextSibling);
    }
    
    if (feedbackEl) {
      feedbackEl.textContent = errorMessage;
      feedbackEl.style.display = isValid ? 'none' : 'block';
    }
  }

  getFormData() {
    if (!this.form) return {};
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });
    return data;
  }

  setFormData(data) {
    if (!this.form) return;
    Object.keys(data).forEach(key => {
      const field = this.form.querySelector(`[name="${key}"]`);
      if (field) {
        field.value = data[key] ?? '';
      }
    });
  }

  reset() {
    if (this.form) this.form.reset();
    this.form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });
    this.form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
  }

  setValues(values) {
    this.setFormData(values);
  }

  getValues() {
    return this.getFormData();
  }
}

export default FormComponent;
