import type { User } from '@/components/columns';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const baseUrl = 'http://localhost:3000/api/user';
const { token } = useAuth();

interface UserResponse {
  users: User[];
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);

  async function fetchUsers(): Promise<UserResponse> {
    try {
      const response = await fetch(`${baseUrl}/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const userResponse: UserResponse = await response.json();
      users.value = userResponse.users;

      console.log('Fetched users:', userResponse);
      return userResponse;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  const addUser = async (newUserName: string) => {
    try {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ newUserName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const userResponse = await fetchUsers();
      console.log('User added successfully:', response);
      return userResponse;
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${baseUrl}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const userResponse = await fetchUsers();
      console.log(`User with ID ${userId} deleted successfully.`);
      return userResponse;
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUser = async (userId: string, updatedUserName: string) => {
    try {
      const response = await fetch(`${baseUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.value || '',
        },
        body: JSON.stringify({ updatedUserName }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit user');
      }

      const userResponse = await fetchUsers();
      console.log(`User with ID ${userId} edited successfully.`);
      return userResponse;
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  return {
    users,
    fetchUsers,
    addUser,
    deleteUser,
    updateUser,
  };
});
