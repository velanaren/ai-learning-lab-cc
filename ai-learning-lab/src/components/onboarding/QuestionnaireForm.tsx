"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestionnaireFormProps {
  onComplete: (answers: Record<string, any>) => void;
  initialAnswers?: Record<string, any>;
}

interface SectionProps {
  answers: Record<string, any>;
  updateAnswer: (key: string, value: any) => void;
}

export function QuestionnaireForm({
  onComplete,
  initialAnswers = {},
}: QuestionnaireFormProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const [answers, setAnswers] = useState(initialAnswers);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalSections = 8;
  const progress = (currentSection / totalSections) * 100;

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

    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    } else {
      startTransition(() => {
        onComplete(answers);
      });
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const updateAnswer = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 px-4">
      {/* Progress Indicator */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-zinc-700">
            Section {currentSection} of {totalSections}
          </span>
          <span className="text-zinc-500">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Content */}
      <div className="min-h-[500px] rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm transition-all duration-300">
        {currentSection === 1 && (
          <Section1 answers={answers} updateAnswer={updateAnswer} />
        )}
        {currentSection === 2 && (
          <Section2 answers={answers} updateAnswer={updateAnswer} />
        )}
        {currentSection === 3 && (
          <Section3 answers={answers} updateAnswer={updateAnswer} />
        )}
        {currentSection === 4 && (
          <Section4 answers={answers} updateAnswer={updateAnswer} />
        )}
        {currentSection === 5 && (
          <Section5 answers={answers} updateAnswer={updateAnswer} />
        )}
        {currentSection === 6 && (
          <Section6 answers={answers} updateAnswer={updateAnswer} />
        )}
        {currentSection === 7 && (
          <Section7 answers={answers} updateAnswer={updateAnswer} />
        )}
        {currentSection === 8 && (
          <Section8 answers={answers} updateAnswer={updateAnswer} />
        )}
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {validationError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentSection === 1}
          className="rounded-full border-zinc-200 px-9 py-6 text-base font-medium transition-all duration-200 hover:border-zinc-900 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isPending}
          className="rounded-full px-9 py-6 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <span className="mr-2">Processing...</span>
              <span className="animate-spin">⏳</span>
            </>
          ) : currentSection === totalSections ? (
            "Complete"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}

// Section 1: Background & Baseline
function Section1({ answers, updateAnswer }: SectionProps) {
  const handleSkillToggle = (skill: string, checked: boolean) => {
    const currentSkills = answers.baselineSkills || [];
    if (checked) {
      updateAnswer("baselineSkills", [...currentSkills, skill]);
    } else {
      updateAnswer(
        "baselineSkills",
        currentSkills.filter((s: string) => s !== skill)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Background & Baseline
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          Tell us about your current role and experience
        </p>
      </div>

      {/* Q1: Current Role */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What best describes your current role?
        </Label>
        <RadioGroup
          value={answers.role}
          onValueChange={(value) => updateAnswer("role", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Application Support Engineer" id="role-support" />
            <Label
              htmlFor="role-support"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700 leading-normal break-words"
            >
              Application Support Engineer
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Software Developer" id="role-developer" />
            <Label
              htmlFor="role-developer"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Software Developer
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="DevOps-SRE" id="role-devops" />
            <Label
              htmlFor="role-devops"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              DevOps / SRE
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Student" id="role-student" />
            <Label
              htmlFor="role-student"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Student
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Other" id="role-other" />
            <Label
              htmlFor="role-other"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Other
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q2: Baseline Skills */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What are you already comfortable with? (Select all that apply)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Linux CLI", label: "Linux command line (CLI)" },
            { value: "Bash scripting", label: "Bash scripting" },
            { value: "Python", label: "Python programming" },
            { value: "Git", label: "Git version control" },
            { value: "Debugging", label: "Debugging and troubleshooting" },
            { value: "None", label: "None of the above" },
          ].map((skill) => (
            <div
              key={skill.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`skill-${skill.value}`}
                checked={answers.baselineSkills?.includes(skill.value)}
                onCheckedChange={(checked) =>
                  handleSkillToggle(skill.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`skill-${skill.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {skill.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Q3: Prior Experience */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How much have you used this topic before?
        </Label>
        <RadioGroup
          value={answers.priorExperience}
          onValueChange={(value) => updateAnswer("priorExperience", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Never" id="exp-never" />
            <Label
              htmlFor="exp-never"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Never used it
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Used basics" id="exp-basics" />
            <Label
              htmlFor="exp-basics"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Used the basics
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Built small things" id="exp-small" />
            <Label
              htmlFor="exp-small"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Built small things with it
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Used in CI-CD" id="exp-cicd" />
            <Label
              htmlFor="exp-cicd"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Used it in CI/CD pipelines
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Used professionally" id="exp-pro" />
            <Label
              htmlFor="exp-pro"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Used it professionally
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Section2({ answers, updateAnswer }: SectionProps) {
  const handleGoalToggle = (goal: string, checked: boolean) => {
    const currentGoals = answers.learningGoals || [];
    if (checked) {
      // Limit to max 2 selections
      if (currentGoals.length < 2) {
        updateAnswer("learningGoals", [...currentGoals, goal]);
      }
    } else {
      updateAnswer(
        "learningGoals",
        currentGoals.filter((g: string) => g !== goal)
      );
    }
  };

  const handleOutcomeToggle = (outcome: string, checked: boolean) => {
    const currentOutcomes = answers.desiredOutcomes || [];
    if (checked) {
      updateAnswer("desiredOutcomes", [...currentOutcomes, outcome]);
    } else {
      updateAnswer(
        "desiredOutcomes",
        currentOutcomes.filter((o: string) => o !== outcome)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Goals & Outcomes
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          What do you want to achieve?
        </p>
      </div>

      {/* Q1: Why learning now (max 2) */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          Why do you want to learn this topic right now? (Pick up to 2)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Career transition", label: "Career transition into this field" },
            { value: "Improve current role", label: "Improve performance in current role" },
            { value: "Prepare for next topic", label: "Prepare for next advanced topic" },
            { value: "Fundamentals", label: "Build strong fundamentals" },
            { value: "Interview prep", label: "Interview preparation" },
          ].map((goal) => (
            <div
              key={goal.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`goal-${goal.value}`}
                checked={answers.learningGoals?.includes(goal.value)}
                onCheckedChange={(checked) =>
                  handleGoalToggle(goal.value, checked as boolean)
                }
                disabled={
                  !answers.learningGoals?.includes(goal.value) &&
                  (answers.learningGoals?.length >= 2)
                }
              />
              <Label
                htmlFor={`goal-${goal.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {goal.label}
              </Label>
            </div>
          ))}
        </div>
        {answers.learningGoals?.length >= 2 && (
          <p className="text-sm text-zinc-500">Maximum 2 selections reached</p>
        )}
      </div>

      {/* Q2: Desired outcomes */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What outcomes matter most to you? (Select all that apply)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Build real apps", label: "Build real applications" },
            { value: "Use in CI-CD", label: "Use in CI/CD pipelines" },
            { value: "Understand internals", label: "Understand how it works internally" },
            { value: "Troubleshoot", label: "Troubleshoot production issues" },
            { value: "Interview-ready", label: "Be interview-ready" },
          ].map((outcome) => (
            <div
              key={outcome.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`outcome-${outcome.value}`}
                checked={answers.desiredOutcomes?.includes(outcome.value)}
                onCheckedChange={(checked) =>
                  handleOutcomeToggle(outcome.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`outcome-${outcome.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {outcome.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Q3: Depth preference */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How deep do you want to go?
        </Label>
        <RadioGroup
          value={answers.depthPreference}
          onValueChange={(value) => updateAnswer("depthPreference", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="use confidently" id="depth-confident" />
            <Label
              htmlFor="depth-confident"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Use it confidently in my work
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="devops-grade mastery" id="depth-mastery" />
            <Label
              htmlFor="depth-mastery"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              DevOps-grade mastery
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Section3({ answers, updateAnswer }: SectionProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Learning Structure
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          How do you prefer to learn?
        </p>
      </div>

      {/* Q1: Learning flow preference */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How do you prefer to start learning?
        </Label>
        <RadioGroup
          value={answers.learningFlow}
          onValueChange={(value) => updateAnswer("learningFlow", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="concepts-first" id="flow-concepts" />
            <Label
              htmlFor="flow-concepts"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Concepts first, then practice
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="build-first" id="flow-build" />
            <Label
              htmlFor="flow-build"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Build first, learn concepts as needed
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="mix" id="flow-mix" />
            <Label
              htmlFor="flow-mix"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Mix of both
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q2: Complexity increase preference */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How should complexity increase?
        </Label>
        <RadioGroup
          value={answers.complexityIncrease}
          onValueChange={(value) => updateAnswer("complexityIncrease", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="gradually one layer at a time" id="complexity-gradual" />
            <Label
              htmlFor="complexity-gradual"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Gradually, one layer at a time
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="through realistic projects" id="complexity-projects" />
            <Label
              htmlFor="complexity-projects"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Through realistic projects
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q3: Troubleshooting importance */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How important is troubleshooting practice?
        </Label>
        <RadioGroup
          value={answers.troubleshootingPref}
          onValueChange={(value) => updateAnswer("troubleshootingPref", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="low" id="troubleshoot-low" />
            <Label
              htmlFor="troubleshoot-low"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Low priority
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="some" id="troubleshoot-some" />
            <Label
              htmlFor="troubleshoot-some"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Some practice is good
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="very important" id="troubleshoot-high" />
            <Label
              htmlFor="troubleshoot-high"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Very important - include lots of it
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Section4({ answers, updateAnswer }: SectionProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Platform & Tooling
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          Your development environment
        </p>
      </div>

      {/* Q1: Operating system */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What operating system will you use?
        </Label>
        <RadioGroup
          value={answers.operatingSystem}
          onValueChange={(value) => updateAnswer("operatingSystem", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="macOS Intel" id="os-mac-intel" />
            <Label
              htmlFor="os-mac-intel"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              macOS (Intel)
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="macOS Apple Silicon" id="os-mac-silicon" />
            <Label
              htmlFor="os-mac-silicon"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              macOS (Apple Silicon)
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Linux" id="os-linux" />
            <Label
              htmlFor="os-linux"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Linux
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="Windows WSL" id="os-wsl" />
            <Label
              htmlFor="os-wsl"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Windows (WSL)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q2: Installation comfort */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How comfortable are you with software installation?
        </Label>
        <RadioGroup
          value={answers.installationComfort}
          onValueChange={(value) => updateAnswer("installationComfort", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="yes" id="install-yes" />
            <Label
              htmlFor="install-yes"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Comfortable installing tools myself
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="prefer minimal setup" id="install-minimal" />
            <Label
              htmlFor="install-minimal"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Prefer minimal local setup
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="prefer cloud where possible" id="install-cloud" />
            <Label
              htmlFor="install-cloud"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Prefer cloud-based solutions
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Section5({ answers, updateAnswer }: SectionProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Time & Consistency
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          How much time can you dedicate?
        </p>
      </div>

      {/* Q1: Daily time budget */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          On most days, how much time can you realistically spend?
        </Label>
        <RadioGroup
          value={answers.dailyMinutes}
          onValueChange={(value) => updateAnswer("dailyMinutes", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="15" id="daily-15" />
            <Label
              htmlFor="daily-15"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              10-15 minutes
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="30" id="daily-30" />
            <Label
              htmlFor="daily-30"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              20-30 minutes
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="60" id="daily-60" />
            <Label
              htmlFor="daily-60"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              45-60 minutes
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q2: Weekly time commitment */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How many hours per week can you commit?
        </Label>
        <RadioGroup
          value={answers.weeklyHours}
          onValueChange={(value) => updateAnswer("weeklyHours", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="5" id="weekly-5" />
            <Label
              htmlFor="weekly-5"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Less than 5 hours
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="10" id="weekly-10" />
            <Label
              htmlFor="weekly-10"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              5-10 hours
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="15" id="weekly-15" />
            <Label
              htmlFor="weekly-15"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              10+ hours
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q3: Missed day behavior */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          If you miss a day, what should happen?
        </Label>
        <RadioGroup
          value={answers.missedDayBehavior}
          onValueChange={(value) => updateAnswer("missedDayBehavior", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="recap+continue" id="missed-recap" />
            <Label
              htmlFor="missed-recap"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Quick recap, then continue
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="slow down automatically" id="missed-slow" />
            <Label
              htmlFor="missed-slow"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Slow down pace automatically
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="ask before adjusting" id="missed-ask" />
            <Label
              htmlFor="missed-ask"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Ask me before adjusting
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Section6({ answers, updateAnswer }: SectionProps) {
  const handleHelperToggle = (helper: string, checked: boolean) => {
    const currentHelpers = answers.understandingHelpers || [];
    if (checked) {
      updateAnswer("understandingHelpers", [...currentHelpers, helper]);
    } else {
      updateAnswer(
        "understandingHelpers",
        currentHelpers.filter((h: string) => h !== helper)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Learning Style & Depth
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          How do you understand concepts best?
        </p>
      </div>

      {/* Q1: What helps understanding */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What helps you understand complex systems? (Select all that apply)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Analogies", label: "Analogies to familiar concepts" },
            { value: "Step-by-step labs", label: "Step-by-step hands-on labs" },
            { value: "Diagrams", label: "Diagrams and visual models" },
            { value: "All of the above", label: "All of the above" },
          ].map((helper) => (
            <div
              key={helper.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`helper-${helper.value}`}
                checked={answers.understandingHelpers?.includes(helper.value)}
                onCheckedChange={(checked) =>
                  handleHelperToggle(helper.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`helper-${helper.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {helper.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Q2: What frustrates */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What frustrates you most when learning?
        </Label>
        <RadioGroup
          value={answers.frustrationTrigger}
          onValueChange={(value) => updateAnswer("frustrationTrigger", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="oversimplified explanations" id="frustrate-simple" />
            <Label
              htmlFor="frustrate-simple"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Oversimplified explanations that skip important details
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="too much theory without practice" id="frustrate-theory" />
            <Label
              htmlFor="frustrate-theory"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Too much theory without practical application
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q3: Depth philosophy */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What's your depth philosophy?
        </Label>
        <RadioGroup
          value={answers.depthPhilosophy}
          onValueChange={(value) => updateAnswer("depthPhilosophy", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="keep it simple first" id="depth-simple" />
            <Label
              htmlFor="depth-simple"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Keep it simple first, dive deeper later
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="never compromise on accuracy and depth" id="depth-accurate" />
            <Label
              htmlFor="depth-accurate"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Never compromise on accuracy and depth
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function Section7({ answers, updateAnswer }: SectionProps) {
  const handleFormatToggle = (format: string, checked: boolean) => {
    const currentFormats = answers.preferredFormats || [];
    if (checked) {
      if (currentFormats.length < 2) {
        updateAnswer("preferredFormats", [...currentFormats, format]);
      }
    } else {
      updateAnswer(
        "preferredFormats",
        currentFormats.filter((f: string) => f !== format)
      );
    }
  };

  const handleTriggerToggle = (trigger: string, checked: boolean) => {
    const currentTriggers = answers.overwhelmTriggers || [];
    if (checked) {
      if (currentTriggers.length < 2) {
        updateAnswer("overwhelmTriggers", [...currentTriggers, trigger]);
      }
    } else {
      updateAnswer(
        "overwhelmTriggers",
        currentTriggers.filter((t: string) => t !== trigger)
      );
    }
  };

  const handleToggleUI = (toggle: string, checked: boolean) => {
    const currentToggles = answers.uiToggles || [];
    if (checked) {
      updateAnswer("uiToggles", [...currentToggles, toggle]);
    } else {
      updateAnswer(
        "uiToggles",
        currentToggles.filter((t: string) => t !== toggle)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Learning Comfort & Accessibility
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          Customize your learning experience
        </p>
      </div>

      {/* Q1: Best format (max 2) */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          Which format helps you learn best? (Pick up to 2)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Text-first", label: "Text-first explanations" },
            { value: "Step-by-step labs", label: "Step-by-step hands-on labs" },
            { value: "Diagrams", label: "Diagrams and mental models" },
            { value: "Short clips", label: "Short video clips (≤3 min only)" },
            { value: "No videos", label: "No videos — transcript/text only" },
          ].map((format) => (
            <div
              key={format.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`format-${format.value}`}
                checked={answers.preferredFormats?.includes(format.value)}
                onCheckedChange={(checked) =>
                  handleFormatToggle(format.value, checked as boolean)
                }
                disabled={
                  !answers.preferredFormats?.includes(format.value) &&
                  (answers.preferredFormats?.length >= 2)
                }
              />
              <Label
                htmlFor={`format-${format.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {format.label}
              </Label>
            </div>
          ))}
        </div>
        {answers.preferredFormats?.length >= 2 && (
          <p className="text-sm text-zinc-500">Maximum 2 selections reached</p>
        )}
      </div>

      {/* Q2: Audio/video preference */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How do you feel about audio/video content?
        </Label>
        <RadioGroup
          value={answers.audioVideoPreference}
          onValueChange={(value) => updateAnswer("audioVideoPreference", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="avoid audio-video" id="av-avoid" />
            <Label
              htmlFor="av-avoid"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Avoid audio/video completely
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="short clips only" id="av-short" />
            <Label
              htmlFor="av-short"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Short clips only (≤3 min)
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="5-10 min occasionally" id="av-medium" />
            <Label
              htmlFor="av-medium"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              5-10 min videos occasionally
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="longer videos ok" id="av-long" />
            <Label
              htmlFor="av-long"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Longer videos are fine
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q3: Overwhelm triggers (max 2) */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What triggers overwhelm for you? (Pick up to 2)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Too many terms", label: "Too many new terms at once" },
            { value: "Long explanations", label: "Long blocks of explanation" },
            { value: "Too many links", label: "Too many external links" },
            { value: "Too much UI", label: "Too much UI clutter" },
            { value: "Setup friction", label: "Complex setup or installation steps" },
          ].map((trigger) => (
            <div
              key={trigger.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`trigger-${trigger.value}`}
                checked={answers.overwhelmTriggers?.includes(trigger.value)}
                onCheckedChange={(checked) =>
                  handleTriggerToggle(trigger.value, checked as boolean)
                }
                disabled={
                  !answers.overwhelmTriggers?.includes(trigger.value) &&
                  (answers.overwhelmTriggers?.length >= 2)
                }
              />
              <Label
                htmlFor={`trigger-${trigger.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {trigger.label}
              </Label>
            </div>
          ))}
        </div>
        {answers.overwhelmTriggers?.length >= 2 && (
          <p className="text-sm text-zinc-500">Maximum 2 selections reached</p>
        )}
      </div>

      {/* Q4: Daily session style */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What's your preferred daily session style?
        </Label>
        <RadioGroup
          value={answers.sessionStyle}
          onValueChange={(value) => updateAnswer("sessionStyle", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="one concept per day" id="session-one" />
            <Label
              htmlFor="session-one"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              One concept per day
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="one concept + small application" id="session-concept-app" />
            <Label
              htmlFor="session-concept-app"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              One concept + small application
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="project flow" id="session-project" />
            <Label
              htmlFor="session-project"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Multi-day project flow
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q5: Content order preference */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How do you prefer content to be ordered?
        </Label>
        <RadioGroup
          value={answers.contentOrder}
          onValueChange={(value) => updateAnswer("contentOrder", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="TL;DR → details" id="order-tldr" />
            <Label
              htmlFor="order-tldr"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              TL;DR first, then details
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="details → summary" id="order-details" />
            <Label
              htmlFor="order-details"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Build up to summary
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="example → explanation" id="order-example" />
            <Label
              htmlFor="order-example"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Example first, explanation after
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q6: UI comfort toggles */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          UI comfort preferences (Select any that apply)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Focus Mode", label: "Focus Mode (minimal distractions)" },
            { value: "Reduced motion", label: "Reduced motion" },
            { value: "Larger text", label: "Larger text" },
            { value: "High contrast", label: "High contrast / dark mode" },
          ].map((toggle) => (
            <div
              key={toggle.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`toggle-${toggle.value}`}
                checked={answers.uiToggles?.includes(toggle.value)}
                onCheckedChange={(checked) =>
                  handleToggleUI(toggle.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`toggle-${toggle.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {toggle.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section8({ answers, updateAnswer }: SectionProps) {
  const handleAppTypeToggle = (appType: string, checked: boolean) => {
    const currentTypes = answers.applicationTypes || [];
    if (checked) {
      updateAnswer("applicationTypes", [...currentTypes, appType]);
    } else {
      updateAnswer(
        "applicationTypes",
        currentTypes.filter((t: string) => t !== appType)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-medium text-zinc-900">
          Application & Proof-of-Work
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          How do you want to track your progress?
        </p>
      </div>

      {/* Q1: Comfortable application types */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What kinds of application are you comfortable with? (Select all that apply)
        </Label>
        <div className="space-y-2">
          {[
            { value: "Code snippets", label: "Writing code/config snippets" },
            { value: "Terminal commands", label: "Running terminal commands" },
            { value: "GitHub links", label: "Linking GitHub commits/PRs" },
            { value: "Reflections", label: "Writing short reflections" },
          ].map((appType) => (
            <div
              key={appType.value}
              className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Checkbox
                id={`app-${appType.value}`}
                checked={answers.applicationTypes?.includes(appType.value)}
                onCheckedChange={(checked) =>
                  handleAppTypeToggle(appType.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`app-${appType.value}`}
                className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
              >
                {appType.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Q2: Tracking preference */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          What would you like the system to track?
        </Label>
        <RadioGroup
          value={answers.trackingPreference}
          onValueChange={(value) => updateAnswer("trackingPreference", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="learning only" id="track-learning" />
            <Label
              htmlFor="track-learning"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Learning progress only
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="learning + applications" id="track-learning-app" />
            <Label
              htmlFor="track-learning-app"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Learning + applications
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="learning + applications + evidence" id="track-all" />
            <Label
              htmlFor="track-all"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Learning + applications + evidence (GitHub, screenshots)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q3: Proof-of-work importance */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-zinc-900">
          How important is it to answer later: "What have I actually done in this topic?"
        </Label>
        <RadioGroup
          value={answers.proofOfWorkImportance}
          onValueChange={(value) => updateAnswer("proofOfWorkImportance", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="nice-to-have" id="pow-nice" />
            <Label
              htmlFor="pow-nice"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Nice to have
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="important" id="pow-important" />
            <Label
              htmlFor="pow-important"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Important
            </Label>
          </div>
          <div className="flex items-center space-x-3 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50">
            <RadioGroupItem value="very important" id="pow-very" />
            <Label
              htmlFor="pow-very"
              className="flex-1 cursor-pointer text-sm font-normal text-zinc-700"
            >
              Very important
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
