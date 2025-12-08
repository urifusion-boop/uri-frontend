import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calculator, CheckCircle2, Clock, DollarSign, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { useState } from 'react';

interface FormData {
  salesReps: number;
  avgSalary: number;
  hoursPerWeek: number;
  conversionRate: number;
  avgDealSize: number;
}

const ROICalculator = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    salesReps: 10,
    avgSalary: 60000,
    hoursPerWeek: 10,
    conversionRate: 15,
    avgDealSize: 5000,
  });
  const [showResults, setShowResults] = useState(false);

  const steps = [
    {
      title: 'Team Size',
      description: 'How many sales reps do you have?',
      icon: <Trophy className="h-8 w-8" />,
      field: 'salesReps' as keyof FormData,
      type: 'slider',
      min: 1,
      max: 100,
      suffix: 'reps',
    },
    {
      title: 'Average Salary',
      description: "What's the average annual salary per rep?",
      icon: <DollarSign className="h-8 w-8" />,
      field: 'avgSalary' as keyof FormData,
      type: 'input',
      prefix: '$',
    },
    {
      title: 'Time Lost',
      description: 'Hours per week spent on data entry & manual tasks?',
      icon: <Clock className="h-8 w-8" />,
      field: 'hoursPerWeek' as keyof FormData,
      type: 'slider',
      min: 1,
      max: 40,
      suffix: 'hrs/week',
    },
    {
      title: 'Conversion Rate',
      description: 'Current lead-to-customer conversion rate?',
      icon: <TrendingUp className="h-8 w-8" />,
      field: 'conversionRate' as keyof FormData,
      type: 'slider',
      min: 1,
      max: 50,
      suffix: '%',
    },
    {
      title: 'Deal Size',
      description: "What's your average deal value?",
      icon: <Sparkles className="h-8 w-8" />,
      field: 'avgDealSize' as keyof FormData,
      type: 'input',
      prefix: '$',
    },
  ];

  const calculateROI = () => {
    const hourlyRate = formData.avgSalary / 52 / 40;
    const annualHoursWasted = formData.hoursPerWeek * 52 * formData.salesReps;
    const costOfWastedTime = annualHoursWasted * hourlyRate;

    const timeRecovered = annualHoursWasted * 0.75; // URI recovers 75% of wasted time
    const hoursForSelling = timeRecovered;
    const additionalLeads = (hoursForSelling / 2) * formData.salesReps; // 1 lead per 2 hours
    const additionalDeals = additionalLeads * (formData.conversionRate / 100) * 1.3; // 30% conversion boost
    const additionalRevenue = additionalDeals * formData.avgDealSize;

    const uriCost = formData.salesReps * 99 * 12; // $99/user/month
    const netBenefit = additionalRevenue + costOfWastedTime - uriCost;
    const roi = (netBenefit / uriCost) * 100;

    return {
      costOfWastedTime: Math.round(costOfWastedTime),
      timeRecovered: Math.round(timeRecovered),
      additionalRevenue: Math.round(additionalRevenue),
      uriCost: Math.round(uriCost),
      netBenefit: Math.round(netBenefit),
      roi: Math.round(roi),
      additionalDeals: Math.round(additionalDeals),
    };
  };

  const results = calculateROI();
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setShowResults(false);
  };

  const updateFormData = (field: keyof FormData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Calculator className="h-4 w-4" />
            <span className="text-sm font-semibold">Interactive ROI Calculator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Calculate Your Potential ROI</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Take the test and discover how much time and money you could save with URI</p>
        </motion.div>

        <Card className="p-8 bg-card shadow-2xl">
          {/* Progress Bar */}
          {!showResults && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">
                  {step + 1} of {steps.length}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                {/* Step Content */}
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full text-primary">{steps[step].icon}</div>
                  <h3 className="text-2xl font-bold">{steps[step].title}</h3>
                  <p className="text-muted-foreground">{steps[step].description}</p>
                </div>

                {/* Input Field */}
                <div className="space-y-4 max-w-md mx-auto">
                  {steps[step].type === 'slider' ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-primary">{formData[steps[step].field]}</span>
                        <span className="text-xl text-muted-foreground ml-2">{steps[step].suffix}</span>
                      </div>
                      <Slider
                        value={[formData[steps[step].field]]}
                        onValueChange={(value) => updateFormData(steps[step].field, value[0])}
                        min={steps[step].min}
                        max={steps[step].max}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor={steps[step].field}>Amount</Label>
                      <div className="relative">
                        {steps[step].prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{steps[step].prefix}</span>}
                        <Input
                          id={steps[step].field}
                          type="number"
                          value={formData[steps[step].field]}
                          onChange={(e) => updateFormData(steps[step].field, parseInt(e.target.value) || 0)}
                          className={steps[step].prefix ? 'pl-8' : ''}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                  {step > 0 && (
                    <Button variant="outline" onClick={handleBack} className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <Button onClick={handleNext} className="gap-2 min-w-[140px]" size="lg">
                    {step === steps.length - 1 ? (
                      <>
                        <Calculator className="h-4 w-4" />
                        Calculate ROI
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
                {/* Results Header */}
                <div className="text-center space-y-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-flex p-6 bg-primary/10 rounded-full text-primary">
                    <Trophy className="h-12 w-12" />
                  </motion.div>
                  <h3 className="text-3xl font-bold">Your ROI Potential</h3>
                  <p className="text-muted-foreground">Here's what you could achieve with URI</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-semibold">ROI</span>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-1">{results.roi.toLocaleString()}%</div>
                    <p className="text-sm text-muted-foreground">Return on Investment</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Net Benefit</span>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-1">${results.netBenefit.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Annual Savings</p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-secondary/50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-foreground" />
                      <span className="font-semibold">Time Recovered</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{results.timeRecovered.toLocaleString()} hrs</div>
                    <p className="text-sm text-muted-foreground">Per Year</p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-secondary/50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="h-5 w-5 text-foreground" />
                      <span className="font-semibold">Additional Revenue</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">${results.additionalRevenue.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">From {results.additionalDeals} new deals</p>
                  </motion.div>
                </div>

                {/* Breakdown */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-secondary/30 p-6 rounded-lg space-y-3">
                  <h4 className="font-semibold mb-4">Cost Breakdown</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cost of Wasted Time</span>
                    <span className="font-semibold">${results.costOfWastedTime.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Additional Revenue</span>
                    <span className="font-semibold text-primary">+${results.additionalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">URI Investment</span>
                    <span className="font-semibold">-${results.uriCost.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-bold">Net Annual Benefit</span>
                    <span className="font-bold text-primary text-xl">${results.netBenefit.toLocaleString()}</span>
                  </div>
                </motion.div>

                {/* Achievement Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold mb-1">Assessment Complete!</p>
                  <p className="text-sm text-muted-foreground">Ready to unlock this potential? Let's talk.</p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Start Over
                  </Button>
                  <Button size="lg" className="gap-2" onClick={() => (window.location.href = '#enterprise')}>
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  );
};

export default ROICalculator;
