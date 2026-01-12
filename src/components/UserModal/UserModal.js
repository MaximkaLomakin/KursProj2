import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './UserModal.module.css';

function UserModal({ user, onClose, onUpdate, onDelete, initialEditing }) {
  const [isEditing, setIsEditing] = useState(initialEditing || false);
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user',
    password: ''
  });

  if (!user) {
    return null;
  }

  function handleChange(field, value) {
    setForm(function(previous) {
      return {
        ...previous,
        [field]: value
      };
    });
  }

  function handleSave() {
    // Создаем объект для обновления, исключая пустой пароль
    const updateData = {
      name: form.name,
      email: form.email,
      role: form.role
    };
    
    // Добавляем пароль только если он был введен
    if (form.password && form.password.trim() !== '') {
      updateData.password = form.password;
    }
    
    onUpdate(user.id, updateData);
    setIsEditing(false);
    // Очищаем поле пароля после сохранения
    setForm(function(previous) {
      return {
        ...previous,
        password: ''
      };
    });
  }

  function handleCancel() {
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      password: ''
    });
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      onDelete(user.id);
      onClose();
    }
  }

  function formatDate(dateString) {
    if (!dateString) {
      return 'Не указано';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={function(e) { e.stopPropagation(); }}>
        <div className={styles.header}>
          <h2 className={styles.title}>Информация о пользователе</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.infoRow}>
            <span className={styles.label}>ID:</span>
            <span className={styles.value}>{user.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Логин:</span>
            <span className={styles.value}>{user.username}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Дата регистрации:</span>
            <span className={styles.value}>{formatDate(user.registrationDate)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Имя:</span>
            {isEditing ? (
              <input
                type="text"
                value={form.name}
                onChange={function(e) {
                  handleChange('name', e.target.value);
                }}
                className={styles.input}
              />
            ) : (
              <span className={styles.value}>{user.name || '-'}</span>
            )}
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            {isEditing ? (
              <input
                type="email"
                value={form.email}
                onChange={function(e) {
                  handleChange('email', e.target.value);
                }}
                className={styles.input}
              />
            ) : (
              <span className={styles.value}>{user.email || '-'}</span>
            )}
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Роль:</span>
            {isEditing ? (
              <select
                value={form.role}
                onChange={function(e) {
                  handleChange('role', e.target.value);
                }}
                className={styles.input}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            ) : (
              <span className={styles.value}>{user.role}</span>
            )}
          </div>
          {isEditing && (
            <div className={styles.infoRow}>
              <span className={styles.label}>Новый пароль:</span>
              <input
                type="password"
                value={form.password}
                onChange={function(e) {
                  handleChange('password', e.target.value);
                }}
                className={styles.input}
                placeholder="Оставьте пустым, чтобы не менять"
              />
            </div>
          )}
        </div>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveButton}>
                Сохранить
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Отмена
              </button>
            </>
          ) : (
            <>
              <button onClick={function() { setIsEditing(true); }} className={styles.editButton}>
                Изменить
              </button>
              <button onClick={handleDelete} className={styles.deleteButton}>
                Удалить
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default UserModal;

