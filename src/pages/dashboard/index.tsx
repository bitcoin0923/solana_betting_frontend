import React from 'react';

import Leaderboard from './leaderboard';
import Lootbox from './lootbox';
import MyDashboard from './my_dashboard';
import Overview from './overview';

const Dashboard: React.FC = () => (
  <>
    <Overview />
    <MyDashboard />
    <Lootbox />
    <Leaderboard />
  </>
);

export default Dashboard;
