import { useState } from 'react';
import { 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  User,
  CheckCircle,
  XCircle,
  Mail
} from 'lucide-react';
import { showToast } from '../../components/ui/Toaster';

// Mock user data
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'user' | 'admin';
  lastLogin: string;
  orders: number;
  totalSpent: number;
}

const mockUsers: UserData[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    status: 'active',
    role: 'admin',
    lastLogin: '2023-09-15 09:30:22',
    orders: 5,
    totalSpent: 499.95,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-09-14 14:23:10',
    orders: 8,
    totalSpent: 839.92,
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alicejohnson@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-09-13 11:15:45',
    orders: 3,
    totalSpent: 245.50,
  },
  {
    id: '4',
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bobwilliams@example.com',
    status: 'inactive',
    role: 'user',
    lastLogin: '2023-08-25 16:08:30',
    orders: 2,
    totalSpent: 159.98,
  },
  {
    id: '5',
    firstName: 'Emma',
    lastName: 'Brown',
    email: 'emmabrown@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-09-12 13:45:12',
    orders: 12,
    totalSpent: 1243.75,
  },
  {
    id: '6',
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'michaeldavis@example.com',
    status: 'active',
    role: 'user',
    lastLogin: '2023-09-10 10:20:18',
    orders: 6,
    totalSpent: 678.30,
  },
  {
    id: '7',
    firstName: 'Sarah',
    lastName: 'Miller',
    email: 'sarahmiller@example.com',
    status: 'inactive',
    role: 'user',
    lastLogin: '2023-08-15 08:55:40',
    orders: 1,
    totalSpent: 89.99,
  },
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    status: 'active',
  });
  
  // Filter users based on search
  const filteredUsers = searchQuery
    ? users.filter(
        user =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const openEditModal = (user: UserData) => {
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (user: UserData) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentUser(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Update user in the state
    setUsers(prev =>
      prev.map(user =>
        user.id === currentUser.id
          ? {
              ...user,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              role: formData.role as 'user' | 'admin',
              status: formData.status as 'active' | 'inactive',
            }
          : user
      )
    );
    
    showToast(`User ${formData.firstName} ${formData.lastName} has been updated`, 'success');
    closeModal();
  };
  
  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    // Remove user from the state
    setUsers(prev => prev.filter(user => user.id !== currentUser.id));
    showToast(`User ${currentUser.firstName} ${currentUser.lastName} has been deleted`, 'success');
    closeModal();
  };
  
  const sendInvite = (email: string) => {
    showToast(`Invitation sent to ${email}`, 'success');
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Users Management</h1>
        <button
          onClick={() => sendInvite('user@example.com')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Mail size={16} className="mr-2" />
          Invite User
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md"
                defaultValue=""
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md"
                defaultValue=""
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? (
                        <>
                          <CheckCircle size={12} className="mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.orders} orders</div>
                    <div className="text-sm text-gray-500">${user.totalSpent.toFixed(2)} spent</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{users.length}</span> users
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit User Modal */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete User Modal */}
      {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                  <User size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete the user <strong>{currentUser.firstName} {currentUser.lastName}</strong>? All of their data will be permanently removed from our servers. This action cannot be undone.
              </p>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;