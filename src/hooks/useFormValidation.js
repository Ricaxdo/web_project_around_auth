// src/hooks/useFormValidation.js
import { useCallback, useState } from 'react';

export function useFormValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (name, value, target) => {
    let error = '';

    if (target) {
      if (!target.validity.valid) {
        error = target.validationMessage;
      }

      // Regla personalizada tipo FormValidator: URL debe empezar con https://
      if ((name === 'link' || name === 'avatar') && value) {
        if (!value.startsWith('https://')) {
          error = 'La URL debe comenzar con https://';
        }
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const form = e.target.closest('form');

    setValues((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => {
      const fieldError = validateField(name, value, e.target);
      const newErrors = { ...prevErrors, [name]: fieldError };

      if (form) {
        const formIsValid =
          form.checkValidity() && Object.values(newErrors).every((msg) => !msg || msg.length === 0);

        setIsValid(formIsValid);
      } else {
        setIsValid(false);
      }

      return newErrors;
    });
  };

  const resetForm = useCallback((nextValues = {}, nextErrors = {}, nextIsValid = false) => {
    setValues(nextValues);
    setErrors(nextErrors);
    setIsValid(nextIsValid);
  }, []);

  return {
    values,
    errors,
    isValid,
    handleChange,
    resetForm,
    setValues,
    setErrors,
    setIsValid,
  };
}
