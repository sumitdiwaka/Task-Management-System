// import React from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// const Header = () => {
//   const { user, logout } = useAuth();

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center flex-1">
//             <div className="relative w-64">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="search"
//                 placeholder="Search tasks..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button className="relative p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
//               <BellIcon className="h-6 w-6" />
//               <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
//             </button>
            
//             <div className="flex items-center space-x-3">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-700">{user?.name}</p>
//                 <p className="text-xs text-gray-500">{user?.email}</p>
//               </div>
              
//               <div className="relative">
//                 <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
//                   {user?.name?.charAt(0).toUpperCase()}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search tasks, projects, or teams..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Task Management</p>
              <p className="text-xs text-gray-500">Dashboard v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;