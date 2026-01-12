import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersList from '../../components/UsersList/UsersList';
import PopularRequests from '../../components/PopularRequests/PopularRequests';
import Loading from '../../components/Loading/Loading';
import styles from './AdminPanel.module.css';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [popularRequests, setPopularRequests] = useState([]);
  const [statistics, setStatistics] = useState({ totalUsers: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(
    function() {
      loadData();
    },
    []
  );

  function getToken() {
    return localStorage.getItem('token');
  }

  async function loadData() {
    setLoading(true);
    try {
      const token = getToken();
      const [usersResponse, requestsResponse, statisticsResponse] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/popular-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/statistics`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setUsers(usersResponse.data.users);
      setPopularRequests(requestsResponse.data.requests);
      setStatistics(statisticsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(userId, data) {
    try {
      const token = getToken();
      await axios.put(`${API_URL}/admin/users/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.response?.data?.error || 'Ошибка обновления пользователя');
    }
  }

  async function deleteUser(userId) {
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Ошибка удаления пользователя');
    }
  }

  async function resetRequests(city) {
    try {
      const token = getToken();
      const url = city ? `${API_URL}/admin/popular-requests?city=${encodeURIComponent(city)}` : `${API_URL}/admin/popular-requests`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error) {
      console.error('Error resetting requests:', error);
      alert(error.response?.data?.error || 'Ошибка обнуления запросов');
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Админ панель</h1>
      <div className={styles.statistics}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{statistics.totalUsers}</div>
          <div className={styles.statLabel}>Зарегистрировано пользователей</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{statistics.totalRequests}</div>
          <div className={styles.statLabel}>Всего запросов погоды</div>
        </div>
      </div>
      <div className={styles.tabs}>
        <button
          onClick={function() {
            setActiveTab('users');
          }}
          className={activeTab === 'users' ? styles.activeTab : styles.tab}
        >
          Пользователи
        </button>
        <button
          onClick={function() {
            setActiveTab('requests');
          }}
          className={activeTab === 'requests' ? styles.activeTab : styles.tab}
        >
          Популярные запросы
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'users' && (
          <UsersList users={users} onUpdate={updateUser} onDelete={deleteUser} />
        )}
        {activeTab === 'requests' && (
          <PopularRequests requests={popularRequests} onReset={resetRequests} />
        )}
      </div>
    </div>
  );
}

export default AdminPanel;

