"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, User, Target, Layers, Monitor, Clock, Brain, Eye, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveQuestionnaire } from "@/app/onboarding/questionnaire/actions";
import type { CategoryOptions } from "@/lib/config/topic-categories";

interface QuestionnaireFormProps {
  initialAnswers?: Record<string, any>;
  categoryOptions?: CategoryOptions;
  topicId?: string;
}

interface SectionProps {
  answers: Record<string, any>;
  updateAnswer: (key: string, value: any) => void;
}

interface DynamicSectionProps extends SectionProps {
  options?: CategoryOptions;
}

// Reusable Option Card Component
interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

function OptionCard({ selected, onClick, children, disabled }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
          : disabled
            ? "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-50"
            : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          selected
            ? "border-white bg-white"
            : "border-zinc-300"
        }`}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="h-4 w-4 text-zinc-900" />
          </motion.div>
        )}
      </div>
      <span className={`flex-1 text-sm font-medium leading-relaxed ${selected ? "text-white" : "text-zinc-700"}`}>
        {children}
      </span>
    </motion.button>
  );
}

// Multi-select Option Card
interface MultiOptionCardProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

function MultiOptionCard({ selected, onClick, children, disabled }: MultiOptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? "border-zinc-900 bg-zinc-50"
          : disabled
            ? "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-50"
            : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
          selected
            ? "border-zinc-900 bg-zinc-900"
            : "border-zinc-300 bg-white"
        }`}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="h-4 w-4 text-white" />
          </motion.div>
        )}
      </div>
      <span className={`flex-1 text-sm font-medium leading-relaxed ${selected ? "text-zinc-900" : "text-zinc-700"}`}>
        {children}
      </span>
    </motion.button>
  );
}

// Section Header Component
interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  step: number;
  totalSteps: number;
}

function SectionHeader({ icon: Icon, title, description, step, totalSteps }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>
      <h2 className="text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-zinc-500">
        {description}
      </p>
    </div>
  );
}

// Question Label Component
interface QuestionLabelProps {
  children: React.ReactNode;
  maxSelections?: number;
}

function QuestionLabel({ children, maxSelections }: QuestionLabelProps) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-medium text-zinc-900">{children}</h3>
      {maxSelections && (
        <p className="mt-1 text-sm text-zinc-500">Select up to {maxSelections}</p>
      )}
    </div>
  );
}

export function QuestionnaireForm({
  initialAnswers = {},
  categoryOptions,
  topicId,
}: QuestionnaireFormProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const [answers, setAnswers] = useState(initialAnswers);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [direction, setDirection] = useState(1);

  const totalSections = 8;
  const progress = (currentSection / totalSections) * 100;

  const sectionIcons = [User, Target, Layers, Monitor, Clock, Brain, Eye, Briefcase];

  const validateSection = (section: number): string | null => {
    switch (section) {
      case 1:
        if (!answers.role) return "Please select your current role";
        if (!answers.baselineSkills || answers.baselineSkills.length === 0)
          return "Please select at least one skill you're comfortable with";
        if (!answers.priorExperience) return "Please indicate your prior experience";
        break;
      case 2:
        if (!answers.learningGoals || answers.learningGoals.length === 0)
          return "Please select at least one learning goal";
        if (!answers.desiredOutcomes || answers.desiredOutcomes.length === 0)
          return "Please select at least one desired outcome";
        if (!answers.depthPreference) return "Please select your depth preference";
        break;
      case 3:
        if (!answers.learningFlow) return "Please select your learning flow preference";
        if (!answers.complexityIncrease) return "Please select complexity preference";
        if (!answers.troubleshootingPref) return "Please indicate troubleshooting importance";
        break;
      case 4:
        if (!answers.operatingSystem) return "Please select your operating system";
        if (!answers.installationComfort) return "Please indicate installation comfort";
        break;
      case 5:
        if (!answers.dailyMinutes) return "Please select your daily time budget";
        if (!answers.weeklyHours) return "Please select weekly time commitment";
        if (!answers.missedDayBehavior) return "Please select missed day behavior";
        break;
      case 6:
        if (!answers.understandingHelpers || answers.understandingHelpers.length === 0)
          return "Please select at least one understanding helper";
        if (!answers.frustrationTrigger) return "Please indicate what frustrates you";
        if (!answers.depthPhilosophy) return "Please select your depth philosophy";
        break;
      case 7:
        if (!answers.preferredFormats || answers.preferredFormats.length === 0)
          return "Please select at least one preferred format";
        if (!answers.audioVideoPreference) return "Please select audio/video preference";
        if (!answers.overwhelmTriggers || answers.overwhelmTriggers.length === 0)
          return "Please select at least one overwhelm trigger";
        if (!answers.sessionStyle) return "Please select your session style";
        if (!answers.contentOrder) return "Please select content order preference";
        break;
      case 8:
        if (!answers.applicationTypes || answers.applicationTypes.length === 0)
          return "Please select at least one application type";
        if (!answers.trackingPreference) return "Please select tracking preference";
        if (!answers.proofOfWorkImportance) return "Please indicate proof-of-work importance";
        break;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateSection(currentSection);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setDirection(1);

    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    } else {
      startTransition(async () => {
        await saveQuestionnaire(answers, topicId);
      });
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setDirection(-1);
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const updateAnswer = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (validationError) setValidationError(null);
  };

  // Warn before leaving page with incomplete questionnaire
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentSection < totalSections) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentSection, totalSections]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  const renderSection = () => {
    const props = { answers, updateAnswer };
    const dynamicProps = { ...props, options: categoryOptions };

    switch (currentSection) {
      case 1:
        return <Section1 {...dynamicProps} />;
      case 2:
        return <Section2 {...dynamicProps} />;
      case 3:
        return <Section3 {...props} />;
      case 4:
        return <Section4 {...props} />;
      case 5:
        return <Section5 {...props} />;
      case 6:
        return <Section6 {...props} />;
      case 7:
        return <Section7 {...props} />;
      case 8:
        return <Section8 {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSections }, (_, i) => (
              <motion.div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                  i + 1 <= currentSection ? "bg-zinc-900" : "bg-zinc-200"
                }`}
                initial={false}
                animate={{
                  scale: i + 1 === currentSection ? 1.1 : 1,
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-zinc-500">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Section Content */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSection}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Validation Error */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            {validationError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentSection === 1}
          className="h-14 rounded-2xl border-2 border-zinc-200 px-6 text-base font-medium transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isPending}
          className="group h-14 flex-1 rounded-2xl bg-zinc-900 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
              />
              Processing...
            </span>
          ) : currentSection === totalSections ? (
            <span className="flex items-center gap-2">
              Complete
              <Check className="h-5 w-5" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

// Default options for Section 1 (fallback if no category options provided)
const DEFAULT_SECTION1_OPTIONS = {
  roles: [
    { value: "Software Developer", label: "Software Developer" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "Support Engineer", label: "Support Engineer" },
    { value: "Student", label: "Student" },
    { value: "Other", label: "Other" },
  ],
  skills: [
    { value: "Linux CLI", label: "Linux command line (CLI)" },
    { value: "Bash scripting", label: "Bash scripting" },
    { value: "Python", label: "Python programming" },
    { value: "Git", label: "Git version control" },
    { value: "Debugging", label: "Debugging and troubleshooting" },
    { value: "None", label: "None of the above" },
  ],
  priorExperience: [
    { value: "Never", label: "Never used it" },
    { value: "Used basics", label: "Used the basics" },
    { value: "Built small things", label: "Built small things with it" },
    { value: "Used professionally", label: "Used it professionally" },
  ],
};

// Section 1: Background & Baseline
function Section1({ answers, updateAnswer, options }: DynamicSectionProps) {
  const roles = options?.roles || DEFAULT_SECTION1_OPTIONS.roles;
  const skills = options?.skills || DEFAULT_SECTION1_OPTIONS.skills;
  const priorExperienceOptions = options?.priorExperience || DEFAULT_SECTION1_OPTIONS.priorExperience;

  const handleSkillToggle = (skill: string) => {
    const currentSkills = answers.baselineSkills || [];
    if (currentSkills.includes(skill)) {
      updateAnswer("baselineSkills", currentSkills.filter((s: string) => s !== skill));
    } else {
      updateAnswer("baselineSkills", [...currentSkills, skill]);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={User}
        title="Background & Baseline"
        description="Tell us about your current role and experience"
        step={1}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Current Role */}
        <div>
          <QuestionLabel>What best describes your current role?</QuestionLabel>
          <div className="space-y-3">
            {roles.map((role) => (
              <OptionCard
                key={role.value}
                selected={answers.role === role.value}
                onClick={() => updateAnswer("role", role.value)}
              >
                {role.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Baseline Skills */}
        <div>
          <QuestionLabel>What are you already comfortable with?</QuestionLabel>
          <div className="space-y-3">
            {skills.map((skill) => (
              <MultiOptionCard
                key={skill.value}
                selected={answers.baselineSkills?.includes(skill.value)}
                onClick={() => handleSkillToggle(skill.value)}
              >
                {skill.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>

        {/* Q3: Prior Experience */}
        <div>
          <QuestionLabel>How much have you used this topic before?</QuestionLabel>
          <div className="space-y-3">
            {priorExperienceOptions.map((exp) => (
              <OptionCard
                key={exp.value}
                selected={answers.priorExperience === exp.value}
                onClick={() => updateAnswer("priorExperience", exp.value)}
              >
                {exp.label}
              </OptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default options for Section 2
const DEFAULT_SECTION2_OPTIONS = {
  learningGoals: [
    { value: "Career transition", label: "Career transition into this field" },
    { value: "Improve current role", label: "Improve performance in current role" },
    { value: "Prepare for next topic", label: "Prepare for next advanced topic" },
    { value: "Fundamentals", label: "Build strong fundamentals" },
    { value: "Interview prep", label: "Interview preparation" },
  ],
  outcomes: [
    { value: "Build real apps", label: "Build real applications" },
    { value: "Understand internals", label: "Understand how it works internally" },
    { value: "Troubleshoot", label: "Troubleshoot production issues" },
    { value: "Interview-ready", label: "Be interview-ready" },
  ],
  depthOptions: [
    { value: "use confidently", label: "Use it confidently in my work" },
    { value: "expert-level mastery", label: "Expert-level mastery" },
  ],
};

function Section2({ answers, updateAnswer, options }: DynamicSectionProps) {
  const learningGoals = DEFAULT_SECTION2_OPTIONS.learningGoals;
  const outcomes = options?.outcomes || DEFAULT_SECTION2_OPTIONS.outcomes;
  const depthOptions = options?.depthOptions || DEFAULT_SECTION2_OPTIONS.depthOptions;

  const handleGoalToggle = (goal: string) => {
    const currentGoals = answers.learningGoals || [];
    if (currentGoals.includes(goal)) {
      updateAnswer("learningGoals", currentGoals.filter((g: string) => g !== goal));
    } else if (currentGoals.length < 2) {
      updateAnswer("learningGoals", [...currentGoals, goal]);
    }
  };

  const handleOutcomeToggle = (outcome: string) => {
    const currentOutcomes = answers.desiredOutcomes || [];
    if (currentOutcomes.includes(outcome)) {
      updateAnswer("desiredOutcomes", currentOutcomes.filter((o: string) => o !== outcome));
    } else {
      updateAnswer("desiredOutcomes", [...currentOutcomes, outcome]);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Target}
        title="Goals & Outcomes"
        description="What do you want to achieve?"
        step={2}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Learning Goals (max 2) */}
        <div>
          <QuestionLabel maxSelections={2}>Why do you want to learn this topic right now?</QuestionLabel>
          <div className="space-y-3">
            {learningGoals.map((goal) => (
              <MultiOptionCard
                key={goal.value}
                selected={answers.learningGoals?.includes(goal.value)}
                onClick={() => handleGoalToggle(goal.value)}
                disabled={
                  !answers.learningGoals?.includes(goal.value) &&
                  answers.learningGoals?.length >= 2
                }
              >
                {goal.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Desired Outcomes */}
        <div>
          <QuestionLabel>What outcomes matter most to you?</QuestionLabel>
          <div className="space-y-3">
            {outcomes.map((outcome) => (
              <MultiOptionCard
                key={outcome.value}
                selected={answers.desiredOutcomes?.includes(outcome.value)}
                onClick={() => handleOutcomeToggle(outcome.value)}
              >
                {outcome.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>

        {/* Q3: Depth Preference */}
        <div>
          <QuestionLabel>How deep do you want to go?</QuestionLabel>
          <div className="space-y-3">
            {depthOptions.map((depth) => (
              <OptionCard
                key={depth.value}
                selected={answers.depthPreference === depth.value}
                onClick={() => updateAnswer("depthPreference", depth.value)}
              >
                {depth.label}
              </OptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section3({ answers, updateAnswer }: SectionProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Layers}
        title="Learning Structure"
        description="How do you prefer to learn?"
        step={3}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Learning Flow */}
        <div>
          <QuestionLabel>How do you prefer to start learning?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "concepts-first", label: "Concepts first, then practice" },
              { value: "build-first", label: "Build first, learn concepts as needed" },
              { value: "mix", label: "Mix of both" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.learningFlow === option.value}
                onClick={() => updateAnswer("learningFlow", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Complexity Increase */}
        <div>
          <QuestionLabel>How should complexity increase?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "gradually one layer at a time", label: "Gradually, one layer at a time" },
              { value: "through realistic projects", label: "Through realistic projects" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.complexityIncrease === option.value}
                onClick={() => updateAnswer("complexityIncrease", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q3: Troubleshooting */}
        <div>
          <QuestionLabel>How important is troubleshooting practice?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "low", label: "Low priority" },
              { value: "some", label: "Some practice is good" },
              { value: "very important", label: "Very important - include lots of it" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.troubleshootingPref === option.value}
                onClick={() => updateAnswer("troubleshootingPref", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section4({ answers, updateAnswer }: SectionProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Monitor}
        title="Platform & Tooling"
        description="Your development environment"
        step={4}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Operating System */}
        <div>
          <QuestionLabel>What operating system will you use?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "macOS Intel", label: "macOS (Intel)" },
              { value: "macOS Apple Silicon", label: "macOS (Apple Silicon)" },
              { value: "Linux", label: "Linux" },
              { value: "Windows WSL", label: "Windows (WSL)" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.operatingSystem === option.value}
                onClick={() => updateAnswer("operatingSystem", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Installation Comfort */}
        <div>
          <QuestionLabel>How comfortable are you with software installation?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "yes", label: "Comfortable installing tools myself" },
              { value: "prefer minimal setup", label: "Prefer minimal local setup" },
              { value: "prefer cloud where possible", label: "Prefer cloud-based solutions" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.installationComfort === option.value}
                onClick={() => updateAnswer("installationComfort", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section5({ answers, updateAnswer }: SectionProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Clock}
        title="Time & Consistency"
        description="How much time can you dedicate?"
        step={5}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Daily Time */}
        <div>
          <QuestionLabel>On most days, how much time can you realistically spend?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "15", label: "10-15 minutes" },
              { value: "30", label: "20-30 minutes" },
              { value: "60", label: "45-60 minutes" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.dailyMinutes === option.value}
                onClick={() => updateAnswer("dailyMinutes", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Weekly Hours */}
        <div>
          <QuestionLabel>How many hours per week can you commit?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "5", label: "Less than 5 hours" },
              { value: "10", label: "5-10 hours" },
              { value: "15", label: "10+ hours" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.weeklyHours === option.value}
                onClick={() => updateAnswer("weeklyHours", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q3: Missed Day Behavior */}
        <div>
          <QuestionLabel>If you miss a day, what should happen?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "recap+continue", label: "Quick recap, then continue" },
              { value: "slow down automatically", label: "Slow down pace automatically" },
              { value: "ask before adjusting", label: "Ask me before adjusting" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.missedDayBehavior === option.value}
                onClick={() => updateAnswer("missedDayBehavior", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section6({ answers, updateAnswer }: SectionProps) {
  const handleHelperToggle = (helper: string) => {
    const currentHelpers = answers.understandingHelpers || [];
    if (currentHelpers.includes(helper)) {
      updateAnswer("understandingHelpers", currentHelpers.filter((h: string) => h !== helper));
    } else {
      updateAnswer("understandingHelpers", [...currentHelpers, helper]);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Brain}
        title="Learning Style & Depth"
        description="How do you understand concepts best?"
        step={6}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Understanding Helpers */}
        <div>
          <QuestionLabel>What helps you understand complex systems?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "Analogies", label: "Analogies to familiar concepts" },
              { value: "Step-by-step labs", label: "Step-by-step hands-on labs" },
              { value: "Diagrams", label: "Diagrams and visual models" },
              { value: "All of the above", label: "All of the above" },
            ].map((option) => (
              <MultiOptionCard
                key={option.value}
                selected={answers.understandingHelpers?.includes(option.value)}
                onClick={() => handleHelperToggle(option.value)}
              >
                {option.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Frustration Trigger */}
        <div>
          <QuestionLabel>What frustrates you most when learning?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "oversimplified explanations", label: "Oversimplified explanations that skip important details" },
              { value: "too much theory without practice", label: "Too much theory without practical application" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.frustrationTrigger === option.value}
                onClick={() => updateAnswer("frustrationTrigger", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q3: Depth Philosophy */}
        <div>
          <QuestionLabel>What&apos;s your depth philosophy?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "keep it simple first", label: "Keep it simple first, dive deeper later" },
              { value: "never compromise on accuracy and depth", label: "Never compromise on accuracy and depth" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.depthPhilosophy === option.value}
                onClick={() => updateAnswer("depthPhilosophy", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section7({ answers, updateAnswer }: SectionProps) {
  const handleFormatToggle = (format: string) => {
    const currentFormats = answers.preferredFormats || [];
    if (currentFormats.includes(format)) {
      updateAnswer("preferredFormats", currentFormats.filter((f: string) => f !== format));
    } else if (currentFormats.length < 2) {
      updateAnswer("preferredFormats", [...currentFormats, format]);
    }
  };

  const handleTriggerToggle = (trigger: string) => {
    const currentTriggers = answers.overwhelmTriggers || [];
    if (currentTriggers.includes(trigger)) {
      updateAnswer("overwhelmTriggers", currentTriggers.filter((t: string) => t !== trigger));
    } else if (currentTriggers.length < 2) {
      updateAnswer("overwhelmTriggers", [...currentTriggers, trigger]);
    }
  };

  const handleToggleUI = (toggle: string) => {
    const currentToggles = answers.uiToggles || [];
    if (currentToggles.includes(toggle)) {
      updateAnswer("uiToggles", currentToggles.filter((t: string) => t !== toggle));
    } else {
      updateAnswer("uiToggles", [...currentToggles, toggle]);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Eye}
        title="Learning Comfort & Accessibility"
        description="Customize your learning experience"
        step={7}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Preferred Formats (max 2) */}
        <div>
          <QuestionLabel maxSelections={2}>Which format helps you learn best?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "Text-first", label: "Text-first explanations" },
              { value: "Step-by-step labs", label: "Step-by-step hands-on labs" },
              { value: "Diagrams", label: "Diagrams and mental models" },
              { value: "Short clips", label: "Short video clips (≤3 min only)" },
              { value: "No videos", label: "No videos — transcript/text only" },
            ].map((option) => (
              <MultiOptionCard
                key={option.value}
                selected={answers.preferredFormats?.includes(option.value)}
                onClick={() => handleFormatToggle(option.value)}
                disabled={
                  !answers.preferredFormats?.includes(option.value) &&
                  answers.preferredFormats?.length >= 2
                }
              >
                {option.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Audio/Video Preference */}
        <div>
          <QuestionLabel>How do you feel about audio/video content?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "avoid audio-video", label: "Avoid audio/video completely" },
              { value: "short clips only", label: "Short clips only (≤3 min)" },
              { value: "5-10 min occasionally", label: "5-10 min videos occasionally" },
              { value: "longer videos ok", label: "Longer videos are fine" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.audioVideoPreference === option.value}
                onClick={() => updateAnswer("audioVideoPreference", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q3: Overwhelm Triggers (max 2) */}
        <div>
          <QuestionLabel maxSelections={2}>What triggers overwhelm for you?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "Too many terms", label: "Too many new terms at once" },
              { value: "Long explanations", label: "Long blocks of explanation" },
              { value: "Too many links", label: "Too many external links" },
              { value: "Too much UI", label: "Too much UI clutter" },
              { value: "Setup friction", label: "Complex setup or installation steps" },
            ].map((option) => (
              <MultiOptionCard
                key={option.value}
                selected={answers.overwhelmTriggers?.includes(option.value)}
                onClick={() => handleTriggerToggle(option.value)}
                disabled={
                  !answers.overwhelmTriggers?.includes(option.value) &&
                  answers.overwhelmTriggers?.length >= 2
                }
              >
                {option.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>

        {/* Q4: Session Style */}
        <div>
          <QuestionLabel>What&apos;s your preferred daily session style?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "one concept per day", label: "One concept per day" },
              { value: "one concept + small application", label: "One concept + small application" },
              { value: "project flow", label: "Multi-day project flow" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.sessionStyle === option.value}
                onClick={() => updateAnswer("sessionStyle", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q5: Content Order */}
        <div>
          <QuestionLabel>How do you prefer content to be ordered?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "TL;DR → details", label: "TL;DR first, then details" },
              { value: "details → summary", label: "Build up to summary" },
              { value: "example → explanation", label: "Example first, explanation after" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.contentOrder === option.value}
                onClick={() => updateAnswer("contentOrder", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q6: UI Toggles */}
        <div>
          <QuestionLabel>UI comfort preferences (optional)</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "Focus Mode", label: "Focus Mode (minimal distractions)" },
              { value: "Reduced motion", label: "Reduced motion" },
              { value: "Larger text", label: "Larger text" },
              { value: "High contrast", label: "High contrast / dark mode" },
            ].map((option) => (
              <MultiOptionCard
                key={option.value}
                selected={answers.uiToggles?.includes(option.value)}
                onClick={() => handleToggleUI(option.value)}
              >
                {option.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section8({ answers, updateAnswer }: SectionProps) {
  const handleAppTypeToggle = (appType: string) => {
    const currentTypes = answers.applicationTypes || [];
    if (currentTypes.includes(appType)) {
      updateAnswer("applicationTypes", currentTypes.filter((t: string) => t !== appType));
    } else {
      updateAnswer("applicationTypes", [...currentTypes, appType]);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Briefcase}
        title="Application & Proof-of-Work"
        description="How do you want to track your progress?"
        step={8}
        totalSteps={8}
      />

      <div className="space-y-8">
        {/* Q1: Application Types */}
        <div>
          <QuestionLabel>What kinds of application are you comfortable with?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "Code snippets", label: "Writing code/config snippets" },
              { value: "Terminal commands", label: "Running terminal commands" },
              { value: "GitHub links", label: "Linking GitHub commits/PRs" },
              { value: "Reflections", label: "Writing short reflections" },
            ].map((option) => (
              <MultiOptionCard
                key={option.value}
                selected={answers.applicationTypes?.includes(option.value)}
                onClick={() => handleAppTypeToggle(option.value)}
              >
                {option.label}
              </MultiOptionCard>
            ))}
          </div>
        </div>

        {/* Q2: Tracking Preference */}
        <div>
          <QuestionLabel>What would you like the system to track?</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "learning only", label: "Learning progress only" },
              { value: "learning + applications", label: "Learning + applications" },
              { value: "learning + applications + evidence", label: "Learning + applications + evidence (GitHub, screenshots)" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.trackingPreference === option.value}
                onClick={() => updateAnswer("trackingPreference", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>

        {/* Q3: Proof-of-Work Importance */}
        <div>
          <QuestionLabel>How important is it to answer: &quot;What have I actually done?&quot;</QuestionLabel>
          <div className="space-y-3">
            {[
              { value: "nice-to-have", label: "Nice to have" },
              { value: "important", label: "Important" },
              { value: "very important", label: "Very important" },
            ].map((option) => (
              <OptionCard
                key={option.value}
                selected={answers.proofOfWorkImportance === option.value}
                onClick={() => updateAnswer("proofOfWorkImportance", option.value)}
              >
                {option.label}
              </OptionCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
