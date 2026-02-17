import { useState } from 'react';
import { Plus, Circle, CheckCircle2, Layers, AlertTriangle } from 'lucide-react';
import WidgetConfigurator from './widget/WidgetConfigurator';
import {
  type WidgetVariant,
  type Service,
  DISPLAY_TYPE_LABELS,
  LEAD_CAPTURE_MODE_LABELS,
  getLeadCaptureMode,
  createDefaultVariant,
} from './widget/types';

const MAX_VARIANTS = 5;

const MOCK_SERVICES: Service[] = [
  { id: 'service-1', name: 'Lawn Mowing Service', status: 'live' },
  { id: 'service-2', name: 'Garden Maintenance', status: 'draft' },
];

interface Props {
  onNavigate?: (page: string) => void;
}

export default function Widget({ onNavigate }: Props) {
  const [variants, setVariants] = useState<WidgetVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || null;

  const handleNavigateToServices = () => {
    if (onNavigate) {
      onNavigate('pricing');
    }
  };

  const handleCreateVariant = () => {
    if (variants.length >= MAX_VARIANTS) return;
    const id = crypto.randomUUID();
    const name = `Widget ${variants.length + 1}`;
    const newVariant = createDefaultVariant(id, name);
    setVariants([...variants, newVariant]);
    setSelectedVariantId(id);
  };

  const handleUpdateVariant = (updated: WidgetVariant) => {
    setVariants(variants.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
    if (selectedVariantId === id) setSelectedVariantId(null);
  };

  if (selectedVariant) {
    return (
      <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
        <WidgetConfigurator
          variant={selectedVariant}
          services={MOCK_SERVICES}
          onUpdate={handleUpdateVariant}
          onClose={() => setSelectedVariantId(null)}
          onNavigateToServices={handleNavigateToServices}
        />
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Widget</h1>
          <p className="text-sm md:text-base text-gray-600">Configure your conversion engine</p>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Widget Created Yet</h2>
            <p className="text-sm text-gray-600 mb-6">
              Create your first widget to activate your conversion engine.
            </p>
            <button
              onClick={handleCreateVariant}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Widget
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Widget</h1>
          <p className="text-sm md:text-base text-gray-600">Configure your conversion engine</p>
        </div>
        <button
          onClick={handleCreateVariant}
          disabled={variants.length >= MAX_VARIANTS}
          className="w-full sm:w-auto px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Create New Widget Variant
        </button>
      </div>

      {variants.length >= MAX_VARIANTS && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">Maximum of {MAX_VARIANTS} widget variants reached.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variants.map((variant) => {
          const leadMode = getLeadCaptureMode(variant.leadCaptureConfig);
          const getStatusLabel = () => {
            if (variant.status === 'live' && variant.hasUnpublishedChanges) {
              return 'Draft (Unpublished)';
            }
            return variant.status === 'live' ? 'Live' : 'Draft';
          };
          const getStatusColor = () => {
            if (variant.status === 'live' && variant.hasUnpublishedChanges) {
              return 'bg-yellow-100 text-yellow-800';
            }
            return variant.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600';
          };
          return (
            <div
              key={variant.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
              onClick={() => setSelectedVariantId(variant.id)}
            >
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {variant.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor()}`}>
                    {getStatusLabel()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Display</span>
                    <span className="text-gray-900 font-medium">{DISPLAY_TYPE_LABELS[variant.displayType]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Lead Capture</span>
                    <span className="text-gray-900 font-medium">{LEAD_CAPTURE_MODE_LABELS[leadMode]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Service</span>
                    {variant.linkedServiceName ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-900 font-medium">{variant.linkedServiceName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          variant.linkedServiceStatus === 'live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {variant.linkedServiceStatus === 'live' ? 'Live' : 'Draft'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
                        <span className="text-yellow-700 font-medium">Not configured</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Install</span>
                    <span className="flex items-center gap-1.5">
                      {variant.installStatus === 'installed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-700 font-medium">Installed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-500">Not Installed</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 md:px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantId(variant.id);
                  }}
                  className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Configure
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVariant(variant.id);
                  }}
                  className="text-xs text-gray-400 hover:text-red-600 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
