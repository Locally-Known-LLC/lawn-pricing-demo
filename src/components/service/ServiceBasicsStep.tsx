import { Upload } from 'lucide-react';

interface Props {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export default function ServiceBasicsStep({ name, description, onNameChange, onDescriptionChange }: Props) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Service Basics</h2>
        <p className="text-sm md:text-base text-gray-600">Set up your service name and description</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-2">This will appear on your customer-facing quote page</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Upload a service image</p>
        </div>
      </div>
    </div>
  );
}
