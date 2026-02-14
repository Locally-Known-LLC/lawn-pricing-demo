import { Upload, FileText } from 'lucide-react';

interface UploadAddressesProps {
  onNext: () => void;
}

export default function UploadAddresses({ onNext }: UploadAddressesProps) {
  const exampleData = [
    { address: '123 Maple St', city: 'Springfield', state: 'IL', zip: '62701' },
    { address: '456 Oak Ave', city: 'Springfield', state: 'IL', zip: '62702' },
    { address: '789 Pine Rd', city: 'Springfield', state: 'IL', zip: '62703' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Upload Target Addresses</h1>
        <p className="text-sm md:text-base text-gray-600">Import your neighborhood addresses to generate automated quotes</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8 mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 text-center hover:border-green-400 transition-colors cursor-pointer">
          <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-base md:text-lg font-medium text-gray-900 mb-2">Drop your CSV file here</p>
          <p className="text-sm text-gray-500 mb-4">or click to browse</p>
          <button className="px-4 py-2.5 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Select File
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Example CSV Format</h3>
            <p className="text-sm text-gray-500">Your CSV should include these columns</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 md:px-4 py-2 text-left font-medium text-gray-700">Address</th>
                <th className="px-3 md:px-4 py-2 text-left font-medium text-gray-700">City</th>
                <th className="px-3 md:px-4 py-2 text-left font-medium text-gray-700">State</th>
                <th className="px-3 md:px-4 py-2 text-left font-medium text-gray-700">Zip</th>
              </tr>
            </thead>
            <tbody>
              {exampleData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-3 md:px-4 py-2 text-gray-600">{row.address}</td>
                  <td className="px-3 md:px-4 py-2 text-gray-600">{row.city}</td>
                  <td className="px-3 md:px-4 py-2 text-gray-600">{row.state}</td>
                  <td className="px-3 md:px-4 py-2 text-gray-600">{row.zip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-6">
        <p className="text-sm text-blue-800">
          We will automatically measure each property and generate a quote based on lawn size and your pricing rules.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="w-full sm:w-auto px-4 md:px-6 py-3 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
        >
          Next: Generate Quotes
        </button>
      </div>
    </div>
  );
}
