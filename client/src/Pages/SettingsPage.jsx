import React from 'react';
import { Layout } from '../components/layout';

const SettingsPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <p className="text-gray-600">
            Settings page will be implemented in future updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;