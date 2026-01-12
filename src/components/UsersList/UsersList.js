import React, { useState } from 'react';
import UserModal from '../UserModal/UserModal';
import styles from './UsersList.module.css';

function UsersList({ users, onUpdate, onDelete }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingMode, setIsEditingMode] = useState(false);

  if (!users || users.length === 0) {
    return <div className={styles.empty}>Пользователи не найдены</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Список пользователей</h2>
      <div className={styles.table}>
        <div className={styles.headerRow}>
          <div className={styles.cell}>ID</div>
          <div className={styles.cell}>Логин</div>
          <div className={styles.cell}>Имя</div>
          <div className={styles.cell}>Email</div>
          <div className={styles.cell}>Роль</div>
          <div className={styles.cell}>Действия</div>
        </div>
        {users.map(function(user) {
          return (
            <div
              key={user.id}
              className={styles.row}
              onClick={function() {
                setSelectedUser(user);
                setIsEditingMode(false);
              }}
            >
              <div className={styles.cell} data-label="ID">{user.id}</div>
              <div className={styles.cell} data-label="Логин">{user.username}</div>
              <div className={styles.cell} data-label="Имя">{user.name || '-'}</div>
              <div className={styles.cell} data-label="Email">{user.email || '-'}</div>
              <div className={styles.cell} data-label="Роль">{user.role}</div>
              <div className={styles.cell} data-label="Действия" onClick={function(e) { e.stopPropagation(); }}>
                <button
                  onClick={function() {
                    setSelectedUser(user);
                    setIsEditingMode(true);
                  }}
                  className={styles.editButton}
                >
                  Редактировать
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {selectedUser && (
        <UserModal
          user={selectedUser}
          initialEditing={isEditingMode}
          onClose={function() {
            setSelectedUser(null);
            setIsEditingMode(false);
          }}
          onUpdate={function(userId, data) {
            onUpdate(userId, data);
            setSelectedUser(null);
            setIsEditingMode(false);
          }}
          onDelete={function(userId) {
            onDelete(userId);
            setSelectedUser(null);
            setIsEditingMode(false);
          }}
        />
      )}
    </div>
  );
}

export default UsersList;

