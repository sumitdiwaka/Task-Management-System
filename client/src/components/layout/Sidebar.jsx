// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { 
//   HomeIcon, 
//   ClipboardDocumentListIcon, 
//   UserIcon,
//   ArrowLeftOnRectangleIcon,
//   ChartBarIcon
// } from '@heroicons/react/24/outline';

// const Sidebar = () => {
//   const { logout } = useAuth();

//   const navItems = [
//     { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
//     { to: '/dashboard/tasks', icon: ClipboardDocumentListIcon, label: 'Tasks' },
//     { to: '/dashboard/analytics', icon: ChartBarIcon, label: 'Analytics' },
//     { to: '/profile', icon: UserIcon, label: 'Profile' },
//   ];

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
//       <nav className="mt-6 px-4">
//         <div className="space-y-1">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               className={({ isActive }) => `
//                 flex items-center px-4 py-3 text-sm font-medium rounded-lg
//                 transition-colors duration-200
//                 ${isActive 
//                   ? 'bg-blue-50 text-blue-700' 
//                   : 'text-gray-700 hover:bg-gray-50'
//                 }
//               `}
//             >
//               <item.icon className="h-5 w-5 mr-3" />
//               {item.label}
//             </NavLink>
//           ))}
          
//           <button
//             onClick={logout}
//             className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//           >
//             <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
//             Logout
//           </button>
//         </div>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CalendarIcon,
  BellIcon,
  DocumentTextIcon,
  UsersIcon,
  FolderIcon,
  InboxIcon,
  TagIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    // Main Navigation
    { to: '/dashboard', icon: HomeIcon, label: 'Dashboard', exact: true },
    { to: '/dashboard/tasks', icon: ClipboardDocumentListIcon, label: 'Tasks' },
    { to: '/dashboard/calendar', icon: CalendarIcon, label: 'Calendar' },
    { to: '/dashboard/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { to: '/dashboard/teams', icon: UsersIcon, label: 'Teams' },
    
    // Tasks Management
    { to: '/dashboard/inbox', icon: InboxIcon, label: 'Inbox', badge: 3 },
    { to: '/dashboard/projects', icon: FolderIcon, label: 'Projects' },
    { to: '/dashboard/labels', icon: TagIcon, label: 'Labels' },
    { to: '/dashboard/schedule', icon: CalendarDaysIcon, label: 'Schedule' },
    
    // User Section
    { to: '/profile', icon: UserIcon, label: 'Profile' },
    { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
    { to: '/dashboard/notifications', icon: BellIcon, label: 'Notifications', badge: 5 },
    { to: '/dashboard/docs', icon: DocumentTextIcon, label: 'Documentation' },
  ];

  // Group navigation items
  const mainNav = navItems.slice(0, 5);
  const taskNav = navItems.slice(5, 9);
  const userNav = navItems.slice(9);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="py-4">
        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main
          </h3>
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 mx-2 rounded-lg
                  transition-colors duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Tasks Navigation */}
        <div className="mb-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tasks
          </h3>
          <nav className="space-y-1">
            {taskNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 mx-2 rounded-lg
                  transition-colors duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Navigation */}
        <div className="mb-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            User
          </h3>
          <nav className="space-y-1">
            {userNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 mx-2 rounded-lg
                  transition-colors duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-xs text-green-600 font-medium">Completed</p>
                <p className="text-lg font-bold text-green-700">12</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-xs text-blue-600 font-medium">In Progress</p>
                <p className="text-lg font-bold text-blue-700">5</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">→</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-xs text-yellow-600 font-medium">Pending</p>
                <p className="text-lg font-bold text-yellow-700">8</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-4">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 border border-gray-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Logout
            <span className="ml-auto text-xs text-gray-500">
              {user?.email?.split('@')[0]}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;