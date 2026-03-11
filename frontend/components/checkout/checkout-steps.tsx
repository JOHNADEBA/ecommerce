interface CheckoutStepsProps {
  currentStep: number;
  canProgress: boolean;
}

export function CheckoutSteps({
  currentStep,
  canProgress,
}: CheckoutStepsProps) {
  const steps = [
    { number: 1, label: "Information" },
    { number: 2, label: "Shipping" },
    { number: 3, label: "Payment" },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              step.number === currentStep
                ? "bg-primary text-primary-foreground"
                : step.number < currentStep
                  ? "bg-green-100 text-green-600"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {step.number < currentStep ? "✓" : step.number}
          </div>
          <span className="ml-2 text-sm hidden sm:inline">{step.label}</span>
          {index < steps.length - 1 && (
            <div className="w-12 h-0.5 bg-muted mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
