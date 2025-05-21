import React from 'react';
import { nodeRegistry } from '@/lib/nodeRegistry'; // Adjust path
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Placeholders

import { NodeTypeDefinition, NodeCategory } from '@/types'; // Import NodeCategory

const LeftSidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Group nodes by category
  const groupedNodes = nodeRegistry.reduce((acc, nodeDef) => {
    const category = nodeDef.category || 'Other'; // Fallback for uncategorized nodes
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(nodeDef);
    return acc;
  }, {} as Record<NodeCategory | 'Other', NodeTypeDefinition[]>);

  // Define preferred category order
  const categoryOrder: Array<NodeCategory | 'Other'> = ['Input', 'Output', 'Logic', 'AI', 'Transform', 'Utility', 'Custom'];
  
  // Get all unique categories from the registry
  const allCategoriesInRegistry = Array.from(new Set(nodeRegistry.map(n => n.category || 'Other')));
  
  // Combine preferred order with any other categories found (alphabetically sorted)
  const sortedCategories = categoryOrder
    .filter(cat => groupedNodes[cat]) // Only include categories present in groupedNodes
    .concat(
      allCategoriesInRegistry
        .filter(cat => !categoryOrder.includes(cat) && groupedNodes[cat])
        .sort()
    );


  return (
    <div className="bg-muted/40 w-64 p-4 border-r space-y-1 overflow-y-auto h-full"> {/* Reduced space-y-3 to space-y-1 */}
      <div className="sticky top-0 bg-muted/40 py-2 z-10 -mx-4 px-4"> {/* Ensure sticky header has full background */}
        <h3 className="text-lg font-semibold">Nodes</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag nodes onto the canvas to build your flow.</p>
      </div>
      
      {sortedCategories.map(categoryName => (
        <div key={categoryName} className="pt-2"> {/* Added pt-2 for spacing before category header */}
          <h4 className="font-semibold text-md mb-1 capitalize">{categoryName}</h4>
          <div className="space-y-2"> {/* Added space-y-2 for cards within a category */}
            {(groupedNodes[categoryName] || []).map((nodeDef) => (
              <Card
                key={nodeDef.type}
                className="p-2 cursor-grab shadow-sm hover:shadow-md transition-shadow bg-card"
                draggable
                onDragStart={(event) => onDragStart(event, nodeDef.type)}
              >
                <CardHeader className="p-1 flex flex-row items-center space-x-2"> {/* Use flex for icon and title */}
                  {nodeDef.icon && <nodeDef.icon size={16} className="flex-shrink-0 text-muted-foreground" />}
                  <CardTitle className="text-sm">{nodeDef.label}</CardTitle>
                </CardHeader>
                {nodeDef.description && (
                  <CardDescription className="text-xs px-1 pb-1">{nodeDef.description}</CardDescription>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;
