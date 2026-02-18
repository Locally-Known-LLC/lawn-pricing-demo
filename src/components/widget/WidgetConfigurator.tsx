import { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Save, AlertCircle, X, RotateCcw } from 'lucide-react';
import type { WidgetVariant, WidgetStep, Service } from './types';
import { canPublishVariant } from './types';
import EntryExperience from './EntryExperience';
import LeadCapture from './LeadCapture';
import ConversionControls from './ConversionControls';
import WidgetStyling from './WidgetStyling';
import WidgetInstall from './WidgetInstall';

interface Props {
  variant: WidgetVariant;
  services: Service[];
  onUpdate: (variant: WidgetVariant) => void;
  onClose: () => void;
  onNavigateToServices: () => void;
  initialStep?: 1 | 2 | 3 | 4 | 5 | null;
  onStepConsumed?: () => void;
}

const STEPS = [
  { number: 1, title: 'Entry', subtitle: 'Display type' },
  { number: 2, title: 'Capture', subtitle: 'Lead fields' },
  { number: 3, title: 'Convert', subtitle: 'Quote rules' },
  { number: 4, title: 'Style', subtitle: 'Brand match' },
  { number: 5, title: 'Install', subtitle: 'Go live' },
];

export default function WidgetConfigurator({ variant, services, onUpdate, onClose, onNavigateToServices, initialStep, onStepConsumed }: Props) {
  const [currentStep, setCurrentStep] = useState<WidgetStep>(initialStep ?? 1);
  const [showServiceChangeModal, setShowServiceChangeModal] = useState(false);

  useEffect(() => {
    if (initialStep && onStepConsumed) {
      onStepConsumed();
    }
  }, []);
  const [pendingServiceChange, setPendingServiceChange] = useState<{ id: string; name: string; status: 'draft' | 'live' } | null>(null);

  const handleVariantChange = (updates: Partial<WidgetVariant>) => {
    const updatedVariant = { ...variant, ...updates };

    if (variant.status === 'live' && !variant.hasUnpublishedChanges) {
      updatedVariant.hasUnpublishedChanges = true;
      updatedVariant.originalLiveState = { ...variant };
    }

    onUpdate(updatedVariant);
  };

  const handleServiceChange = (serviceId: string, serviceName: string, serviceStatus: 'draft' | 'live') => {
    if (variant.status === 'live' && variant.linkedServiceId !== serviceId) {
      setPendingServiceChange({ id: serviceId, name: serviceName, status: serviceStatus });
      setShowServiceChangeModal(true);
    } else {
      handleVariantChange({
        linkedServiceId: serviceId,
        linkedServiceName: serviceName,
        linkedServiceStatus: serviceStatus,
      });
    }
  };

  const confirmServiceChange = () => {
    if (pendingServiceChange) {
      handleVariantChange({
        linkedServiceId: pendingServiceChange.id,
        linkedServiceName: pendingServiceChange.name,
        linkedServiceStatus: pendingServiceChange.status,
      });
    }
    setShowServiceChangeModal(false);
    setPendingServiceChange(null);
  };

  const handleRevertToLive = () => {
    if (variant.originalLiveState) {
      onUpdate({ ...variant.originalLiveState, originalLiveState: undefined });
    }
  };

  const handlePublish = () => {
    const publishCheck = canPublishVariant(variant);
    if (publishCheck.canPublish) {
      onUpdate({
        ...variant,
        status: 'live',
        hasUnpublishedChanges: false,
        originalLiveState: undefined,
      });
    }
  };

  const publishCheck = canPublishVariant(variant);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EntryExperience
            displayType={variant.displayType}
            config={variant.entryConfig}
            services={services}
            linkedServiceId={variant.linkedServiceId}
            linkedServiceStatus={variant.linkedServiceStatus}
            onDisplayTypeChange={(displayType) => handleVariantChange({ displayType })}
            onConfigChange={(entryConfig) => handleVariantChange({ entryConfig })}
            onServiceChange={handleServiceChange}
            onCreateService={onNavigateToServices}
          />
        );
      case 2:
        return (
          <LeadCapture
            config={variant.leadCaptureConfig}
            onConfigChange={(leadCaptureConfig) => handleVariantChange({ leadCaptureConfig })}
          />
        );
      case 3:
        return (
          <ConversionControls
            config={variant.conversionConfig}
            onConfigChange={(conversionConfig) => handleVariantChange({ conversionConfig })}
          />
        );
      case 4:
        return (
          <WidgetStyling
            config={variant.stylingConfig}
            onConfigChange={(stylingConfig) => handleVariantChange({ stylingConfig })}
          />
        );
      case 5:
        return (
          <WidgetInstall
            variantId={variant.id}
            variantName={variant.name}
            platform={variant.installPlatform}
            onPlatformChange={(installPlatform) => handleVariantChange({ installPlatform })}
            hostedPageConfig={variant.hostedPageConfig}
            linkedServiceId={variant.linkedServiceId}
            linkedServiceStatus={variant.linkedServiceStatus}
            linkedServiceName={variant.linkedServiceName}
            stylingConfig={variant.stylingConfig}
            entryConfig={variant.entryConfig}
            variantStatus={variant.status}
            onHostedPageConfigChange={(hostedPageConfig) => handleVariantChange({ hostedPageConfig })}
          />
        );
    }
  };

  const getStatusLabel = () => {
    if (variant.status === 'live' && variant.hasUnpublishedChanges) {
      return 'Draft (Unpublished Changes)';
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-4 md:space-y-6">
      {showServiceChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Change Pricing Source?</h3>
              <button
                onClick={() => {
                  setShowServiceChangeModal(false);
                  setPendingServiceChange(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This widget will begin using the selected Service configuration immediately after publishing.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowServiceChangeModal(false);
                  setPendingServiceChange(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmServiceChange}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Variants
        </button>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={variant.name}
            onChange={(e) => handleVariantChange({ name: e.target.value })}
            className="text-sm font-semibold text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none px-1 py-0.5 bg-transparent max-w-[180px]"
          />
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
          {variant.hasUnpublishedChanges && (
            <button
              onClick={handleRevertToLive}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Revert
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {STEPS.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.number as WidgetStep)}
                className={`flex-1 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  currentStep === step.number
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-xs opacity-75 hidden sm:block">{step.subtitle}</div>
                </div>
              </button>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
        {renderStep()}

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 space-y-3">
          {currentStep === 5 && !publishCheck.canPublish && (
            <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900">{publishCheck.reason}</p>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <button
              onClick={() => currentStep > 1 && setCurrentStep((currentStep - 1) as WidgetStep)}
              disabled={currentStep === 1}
              className="px-4 md:px-6 py-2 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 md:px-6 py-2 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep((currentStep + 1) as WidgetStep)}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={!publishCheck.canPublish}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish Widget
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="lg:sticky lg:top-6 h-fit">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Widget Preview</h3>
          <div className="aspect-[9/16] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 mb-2">Live preview of your widget</p>
              <p className="text-xs text-gray-400">
                Display: <span className="font-medium text-gray-600">{variant.displayType}</span>
              </p>
              {variant.linkedServiceName && (
                <p className="text-xs text-gray-400 mt-1">
                  Service: <span className="font-medium text-gray-600">{variant.linkedServiceName}</span>
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Primary Color</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: variant.stylingConfig.primaryColor }}
                />
                <span className="font-mono text-gray-700">{variant.stylingConfig.primaryColor}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Button Style</span>
              <span className="font-medium text-gray-700">{variant.stylingConfig.buttonStyle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
