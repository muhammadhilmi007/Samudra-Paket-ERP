"use client";

/**
 * LoginHistoryPage Component
 * Displays the user's login history and active sessions
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useGetLoginHistoryQuery, useTerminateSessionMutation } from '../../store/api/authApi';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const LoginHistoryPage = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('active');
  
  // RTK Query hooks
  const { data: loginHistory, isLoading, refetch } = useGetLoginHistoryQuery();
  const [terminateSession, { isLoading: isTerminating }] = useTerminateSessionMutation();
  
  // Handle session termination
  const handleTerminateSession = async (sessionId) => {
    try {
      await terminateSession(sessionId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };
  
  // Filter sessions based on active tab
  const filteredSessions = loginHistory?.sessions?.filter(session => {
    if (activeTab === 'active') {
      return session.isActive;
    } else {
      return !session.isActive;
    }
  }) || [];
  
  // Get device icon based on device type
  const getDeviceIcon = (deviceType) => {
    if (deviceType.toLowerCase().includes('mobile') || deviceType.toLowerCase().includes('android') || deviceType.toLowerCase().includes('ios')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );
    } else if (deviceType.toLowerCase().includes('tablet') || deviceType.toLowerCase().includes('ipad')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      );
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Typography variant="h1" className="text-2xl font-bold">
              Login History
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-1">
              View your login history and manage active sessions
            </Typography>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'active'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Active Sessions
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('history')}
              >
                Login History
              </button>
            </nav>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <Typography variant="h3" className="mt-2 text-sm font-medium text-gray-900">
                No {activeTab === 'active' ? 'active sessions' : 'login history'} found
              </Typography>
              <Typography variant="body2" className="mt-1 text-sm text-gray-500">
                {activeTab === 'active'
                  ? 'You have no active sessions other than the current one.'
                  : 'Your login history will appear here.'}
              </Typography>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device / Browser
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    {activeTab === 'active' && (
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className={session.isCurrent ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                            {getDeviceIcon(session.deviceType)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {session.deviceType}
                              {session.isCurrent && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.browser}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{session.location?.city || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{session.location?.country || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{session.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === 'active' ? (
                          <div className="text-sm text-gray-900">
                            Active for {formatDistanceToNow(new Date(session.lastActivityAt), { locale: id, addSuffix: false })}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            {new Date(session.createdAt).toLocaleString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {activeTab === 'active' ? 'Last activity' : 'Login time'}
                        </div>
                      </td>
                      {activeTab === 'active' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {!session.isCurrent && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleTerminateSession(session.id)}
                              disabled={isTerminating}
                            >
                              Terminate
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        <div className="mt-8">
          <Card className="p-6">
            <Typography variant="h2" className="text-lg font-medium mb-4">
              Security Tips
            </Typography>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <Typography variant="body1" className="text-sm font-medium text-gray-900">
                    Always log out from shared devices
                  </Typography>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <Typography variant="body1" className="text-sm font-medium text-gray-900">
                    Review your login history regularly
                  </Typography>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <Typography variant="body1" className="text-sm font-medium text-gray-900">
                    Terminate unknown sessions immediately
                  </Typography>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <Typography variant="body1" className="text-sm font-medium text-gray-900">
                    Enable two-factor authentication for additional security
                  </Typography>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoginHistoryPage;
