'use client';

import React, { useEffect, useState } from 'react';

const Loading = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 2000); // 1 second delay
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return <div>Loading...</div>;
};

export default Loading;
// 