import { createContext, useContext, ReactNode } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

interface TestFormData {
  type: string;
  basicInfo: Record<string, unknown>;
  questions: unknown[];
  results: unknown[];
}

interface TestCreationFormContextType {
  form: UseFormReturn<TestFormData>;
  getValues: UseFormReturn<TestFormData>['getValues'];
  watch: UseFormReturn<TestFormData>['watch'];
  reset: UseFormReturn<TestFormData>['reset'];
}

const TestCreationFormContext = createContext<TestCreationFormContextType | null>(null);

export function TestCreationFormProvider({ children }: { children: ReactNode }) {
  const form = useForm<TestFormData>({
    defaultValues: {
      type: 'psychology',
      basicInfo: {},
      questions: [],
      results: [],
    },
  });

  const value = {
    form,
    getValues: form.getValues,
    watch: form.watch,
    reset: form.reset,
  };

  return (
    <TestCreationFormContext.Provider value={value}>
      {children}
    </TestCreationFormContext.Provider>
  );
}

export function useTestForm() {
  const context = useContext(TestCreationFormContext);
  if (!context) {
    throw new Error('useTestForm must be used within TestCreationFormProvider');
  }
  return context;
}

