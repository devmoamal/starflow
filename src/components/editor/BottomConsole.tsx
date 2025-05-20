import React from 'react';

const BottomConsole: React.FC = () => {
  return (
    <div className="bg-muted/40 h-48 p-4 border-t">
      <h3 className="text-lg font-semibold mb-2">Console</h3>
      {/* Content for console output will go here */}
      <p className="text-sm text-muted-foreground">Flow execution logs and messages will appear here.</p>
    </div>
  );
};

export default BottomConsole;
