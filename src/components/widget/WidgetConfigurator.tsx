import { useState } from 'react';
import { ChevronRight, ArrowLeft, Save } from 'lucide-react';
import type { WidgetVariant, WidgetStep } from './types';
import EntryExperience from './EntryExperience';
import LeadCapture from './LeadCapture';
import ConversionControls from './ConversionControls';
import WidgetStyling from './WidgetStyling';
import WidgetInstall from './WidgetInstall';

interface Props {
  variant: WidgetVariant;
  onUpdate: (variant: WidgetVariant) => void;
  onClose: () => void;
}

const STEPS = [
  { number: 1, title: 'Entry', subtitle: 'Display type' },
  { number: 2, title: 'Capture', subtitle: 'Lead fields' },
  { number: 3, title: 'Convert', subtitle: 'Quote rules' },
  { number: 4, title: 'Style', subtitle: 'Brand match' },
  { number: 5, title: 'Install', subtitle: 'Go live' },
];

export default function WidgetConfigurator({ variant, onUpdate, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState<WidgetStep>(1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EntryExperience
            displayType={variant.displayType}
            config={variant.entryConfig}
            onDisplayTypeChange={(displayType) => onUpdate({ ...variant, displayType })}
            onConfigChange={(entryConfig) => onUpdate({ ...variant, entryConfig })}
          />
        );
      case 2:
        return (
          <LeadCapture
            config={variant.leadCaptureConfig}
            onConfigChange={(leadCaptureConfig) => onUpdate({ ...variant, leadCaptureConfig })}
          />
        );
      case 3:
        return (
          <ConversionControls
            config={variant.conversionConfig}
            onConfigChange={(conversionConfig) => onUpdate({ ...variant, conversionConfig })}
          />
        );
      case 4:
        return (
          <WidgetStyling
            config={variant.stylingConfig}
            onConfigChange={(stylingConfig) => onUpdate({ ...variant, stylingConfig })}
          />
        );
      case 5:
        return (
          <WidgetInstall
            variantId={variant.id}
            variantName={variant.name}
            platform={variant.installPlatform}
            onPlatformChange={(installPlatform) => onUpdate({ ...variant, installPlatform })}
          />
        );
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
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
            onChange={(e) => onUpdate({ ...variant, name: e.target.value })}
            className="text-sm font-semibold text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none px-1 py-0.5 bg-transparent max-w-[180px]"
          />
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            variant.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {variant.status === 'live' ? 'Live' : 'Draft'}
          </span>
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

        <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
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
                onClick={() => onUpdate({ ...variant, status: 'live' })}
                className="px-4 md:px-6 py-2 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
              >
                Publish Widget
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
