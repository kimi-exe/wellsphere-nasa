import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Leaf 
            className="text-green-400 animate-spin mx-auto mb-4" 
            size={48} 
          />
          <div className="absolute inset-0 animate-pulse">
            <Leaf 
              className="text-red-400 opacity-50 mx-auto" 
              size={48} 
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
          Oasis
        </h2>
        <p className="text-gray-400 text-sm">
          Loading environmental data...
        </p>
      </div>
    </div>
  );
}