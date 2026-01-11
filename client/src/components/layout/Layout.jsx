// import React from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';

// const Layout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="flex">
//         <Sidebar />
//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { 
//   HomeIcon, 
//   ClipboardDocumentListIcon, 
//   UserIcon,
//   ArrowLeftOnRectangleIcon,
//   Cog6ToothIcon
// } from '@heroicons/react/24/outline';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold text-gray-900">
//                 Task Management
//               </h1>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-700">{user?.name}</p>
//                 <p className="text-xs text-gray-500">{user?.email}</p>
//               </div>
              
//               <div className="relative">
//                 <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
//                   {user?.name?.charAt(0).toUpperCase() || 'U'}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
//           <nav className="mt-6 px-4">
//             <div className="space-y-1">
//               <NavLink
//                 to="/dashboard"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-3 text-sm font-medium rounded-lg
//                   transition-colors duration-200
//                   ${isActive 
//                     ? 'bg-blue-50 text-blue-700' 
//                     : 'text-gray-700 hover:bg-gray-50'
//                   }
//                 `}
//               >
//                 <HomeIcon className="h-5 w-5 mr-3" />
//                 Dashboard
//               </NavLink>
              
//               <NavLink
//                 to="/dashboard/tasks"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-3 text-sm font-medium rounded-lg
//                   transition-colors duration-200
//                   ${isActive 
//                     ? 'bg-blue-50 text-blue-700' 
//                     : 'text-gray-700 hover:bg-gray-50'
//                   }
//                 `}
//               >
//                 <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
//                 My Tasks
//               </NavLink>
              
//               <NavLink
//                 to="/profile"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-3 text-sm font-medium rounded-lg
//                   transition-colors duration-200
//                   ${isActive 
//                     ? 'bg-blue-50 text-blue-700' 
//                     : 'text-gray-700 hover:bg-gray-50'
//                   }
//                 `}
//               >
//                 <UserIcon className="h-5 w-5 mr-3" />
//                 Profile
//               </NavLink>
              
//               <NavLink
//                 to="/settings"
//                 className={({ isActive }) => `
//                   flex items-center px-4 py-3 text-sm font-medium rounded-lg
//                   transition-colors duration-200
//                   ${isActive 
//                     ? 'bg-blue-50 text-blue-700' 
//                     : 'text-gray-700 hover:bg-gray-50'
//                   }
//                 `}
//               >
//                 <Cog6ToothIcon className="h-5 w-5 mr-3" />
//                 Settings
//               </NavLink>
              
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//               >
//                 <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
//                 Logout
//               </button>
//             </div>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;