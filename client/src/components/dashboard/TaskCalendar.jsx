import React, { useState, useEffect } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Spinner } from '../common/Index';
import * as taskService from '../..Services/taskService';
import { formatDate } from '../../utils/helpers';

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const result = await taskService.getTasks();
      
      if (result.success) {
        setTasks(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({
        date: prevDate,
        isCurrentMonth: false,
        tasks: getTasksForDate(prevDate)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
        tasks: getTasksForDate(date)
      });
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks
    while (days.length < totalCells) {
      const nextDate = new Date(year, month, days.length - firstDay + 1);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        tasks: getTasksForDate(nextDate)
      });
    }
    
    // Split into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const weeks = renderCalendar();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="h-6 w-6 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Task Calendar</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Today
          </button>
          
          <div className="flex items-center">
            <button
              onClick={goToPreviousMonth}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <h3 className="mx-4 text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <button
              onClick={goToNextMonth}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 py-2 text-center">
            <span className="text-sm font-medium text-gray-700">{day}</span>
          </div>
        ))}
        
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => {
              const isSelected = selectedDate && selectedDate.toDateString() === day.date.toDateString();
              
              return (
                <div
                  key={dayIndex}
                  onClick={() => setSelectedDate(day.date)}
                  className={`
                    min-h-32 p-2 bg-white border border-gray-100
                    ${day.isCurrentMonth ? '' : 'bg-gray-50'}
                    ${day.isToday ? 'bg-blue-50' : ''}
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    ${day.isCurrentMonth ? 'hover:bg-gray-50' : ''}
                    cursor-pointer transition-colors
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`
                      text-sm font-medium
                      ${day.isToday ? 'text-blue-600' : ''}
                      ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                      ${day.isToday ? 'bg-blue-100 px-2 py-0.5 rounded-full' : ''}
                    `}>
                      {day.date.getDate()}
                    </span>
                    {day.tasks.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                        {day.tasks.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {day.tasks.slice(0, 3).map((task) => (
                      <div
                        key={task._id}
                        className={`text-xs p-1 rounded truncate ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {day.tasks.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{day.tasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            Tasks for {formatDate(selectedDate)}
          </h3>
          {getTasksForDate(selectedDate).length === 0 ? (
            <p className="text-sm text-gray-500">No tasks due on this date</p>
          ) : (
            <ul className="space-y-2">
              {getTasksForDate(selectedDate).map((task) => (
                <li key={task._id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.priority} priority</p>
                  </div>
                  <span className={`
                    text-xs font-medium px-2 py-1 rounded-full
                    ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'}
                  `}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;