const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMAIL_VALIDATION_ERROR = 'Ой, произошла ошибка!';
export const PASSWORD_VALIDATION_ERROR = 'Некорректный пароль';

export const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(email);

export const isValidPassword = (password: string): boolean => password.length >= 6;
