import React, { useState } from 'react';
import mockPosts from '../data/mockPosts.json'



const Dashboard = () => {
  const [posts,setPosts] = useState(mockPosts)
  
  return(
    <div>some text</div>
  );
};

export default Dashboard;
