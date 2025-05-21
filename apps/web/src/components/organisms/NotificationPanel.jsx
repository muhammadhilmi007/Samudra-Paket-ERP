'use client';

/**
 * NotificationPanel Component
 * Displays recent notifications and alerts for the user
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Check, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { uiActions } from '../../store/index';
import { formatDistanceToNow } from 'date-fns';
import { id, enUS } from 'date-fns/locale';

/**
 * NotificationPanel component
 * @returns {React.ReactElement} NotificationPanel component
 */
const NotificationPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.ui.notifications || []);
  const unreadCount = useSelector(state => state.ui.unreadNotificationsCount || 0);
  const currentLanguage = useSelector(state => state.ui.language || 'id');
  const [activeTab, setActiveTab] = useState('all');

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    dispatch(uiActions.markNotificationsAsRead());
  };

  // Dismiss a notification
  const handleDismiss = (id) => {
    dispatch(uiActions.removeNotification(id));
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Format date based on current language
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true,
        locale: currentLanguage === 'id' ? id : enUS
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
            <TabsTrigger value="error" className="flex-1">Alerts</TabsTrigger>
          </TabsList>
        </div>
        <CardContent className="pt-2">
          <ScrollArea className="h-[300px] pr-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`mb-3 p-3 rounded-md relative ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.timestamp)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-2 right-2"
                      onClick={() => handleDismiss(notification.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <Bell className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="outline" size="sm" className="w-full">
          View all notifications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationPanel;
