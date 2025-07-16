import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, ArrowLeft, Code, Zap, Flag, CheckCircle } from 'lucide-react';
import { Button, Input, Textarea, Card, Badge } from '../ui';
import { challengeApi, type Challenge } from '../../services/challengeApi';

interface ChallengeFormProps {
  challenge?: Challenge;
  onSave: (challenge: Challenge) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({
  challenge,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Challenge>({
    title: '',
    algorithmicProblem: {
      description: '',
      inputFormat: '',
      outputFormat: '',
      constraints: '',
      examples: [{ input: '', output: '', explanation: '' }]
    },
    buildathonProblem: {
      description: '',
      requirements: [''],
      techStack: [''],
      deliverables: ['']
    },
    correctFlag: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (challenge) {
      setFormData(challenge);
    }
  }, [challenge]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedChange = (section: 'algorithmicProblem' | 'buildathonProblem', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: 'buildathonProblem', field: 'requirements' | 'techStack' | 'deliverables', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section][field] || []).map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (section: 'buildathonProblem', field: 'requirements' | 'techStack' | 'deliverables') => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section][field] || []), '']
      }
    }));
  };

  const removeArrayItem = (section: 'buildathonProblem', field: 'requirements' | 'techStack' | 'deliverables', index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section][field] || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleExampleChange = (index: number, field: 'input' | 'output' | 'explanation', value: string) => {
    setFormData(prev => ({
      ...prev,
      algorithmicProblem: {
        ...prev.algorithmicProblem,
        examples: prev.algorithmicProblem.examples.map((example, i) =>
          i === index ? { ...example, [field]: value } : example
        )
      }
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      algorithmicProblem: {
        ...prev.algorithmicProblem,
        examples: [...prev.algorithmicProblem.examples, { input: '', output: '', explanation: '' }]
      }
    }));
  };

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      algorithmicProblem: {
        ...prev.algorithmicProblem,
        examples: prev.algorithmicProblem.examples.filter((_, i) => i !== index)
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.algorithmicProblem.description.trim()) {
      newErrors.algDescription = 'Algorithmic problem description is required';
    }

    if (!formData.algorithmicProblem.inputFormat.trim()) {
      newErrors.inputFormat = 'Input format is required';
    }

    if (!formData.algorithmicProblem.outputFormat.trim()) {
      newErrors.outputFormat = 'Output format is required';
    }

    if (!formData.algorithmicProblem.constraints.trim()) {
      newErrors.constraints = 'Constraints are required';
    }

    if (!formData.buildathonProblem.description.trim()) {
      newErrors.buildDescription = 'Buildathon problem description is required';
    }

    if (!formData.correctFlag.trim()) {
      newErrors.correctFlag = 'Correct flag is required';
    }

    // Validate examples
    const hasValidExample = formData.algorithmicProblem.examples.some(
      example => example.input.trim() && example.output.trim()
    );
    if (!hasValidExample) {
      newErrors.examples = 'At least one complete example is required';
    }

    // Validate requirements
    const hasValidRequirement = formData.buildathonProblem.requirements.some(req => req.trim());
    if (!hasValidRequirement) {
      newErrors.requirements = 'At least one requirement is required';
    }

    // Validate deliverables
    const hasValidDeliverable = formData.buildathonProblem.deliverables.some(del => del.trim());
    if (!hasValidDeliverable) {
      newErrors.deliverables = 'At least one deliverable is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Clean up empty array items
        const cleanedData = {
          ...formData,
          buildathonProblem: {
            ...formData.buildathonProblem,
            requirements: formData.buildathonProblem.requirements.filter(req => req.trim()),
            techStack: formData.buildathonProblem.techStack?.filter(tech => tech.trim()),
            deliverables: formData.buildathonProblem.deliverables.filter(del => del.trim())
          }
        };

        let result;
        if (challenge?._id) {
          // Update existing challenge
          result = await challengeApi.updateChallenge(challenge._id, cleanedData);
        } else {
          // Create new challenge
          result = await challengeApi.createChallenge(cleanedData);
        }

        onSave(result);
      } catch (error: any) {
        console.error('Error saving challenge:', error);
        // You might want to show a toast notification here
        alert(error.message || 'Failed to save challenge');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl transform rotate-1"></div>
          <div className="relative bg-white rounded-2xl shadow-large border border-gray-100 p-6 sm:p-8">
            <div className="flex items-start space-x-4">
              <button
                onClick={onCancel}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {challenge ? 'Edit Challenge' : 'Create New Challenge'}
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                      Configure algorithmic and buildathon problems
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="overflow-hidden border-0 shadow-large bg-white/80 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Flag className="w-6 h-6" />
                <h2 className="text-xl sm:text-2xl font-bold">Basic Information</h2>
              </div>
              <p className="text-blue-100 mt-1">Set up the foundation of your challenge</p>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="group">
                <Input
                  label="Challenge Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                  placeholder="Enter a descriptive challenge title"
                  className="transition-all duration-200 group-hover:border-blue-300"
                  required
                />
              </div>
              <div className="group">
                <Input
                  label="Correct Flag"
                  value={formData.correctFlag}
                  onChange={(e) => handleInputChange('correctFlag', e.target.value)}
                  error={errors.correctFlag}
                  placeholder="DUOTHON{flag_format_here}"
                  helperText="The expected output/flag that participants need to discover"
                  className="font-mono transition-all duration-200 group-hover:border-blue-300"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Algorithmic Problem */}
          <Card className="overflow-hidden border-0 shadow-large bg-white/80 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Code className="w-6 h-6" />
                <h2 className="text-xl sm:text-2xl font-bold">Algorithmic Problem</h2>
              </div>
              <p className="text-green-100 mt-1">Design the coding challenge component</p>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <Textarea
                label="Problem Description"
                value={formData.algorithmicProblem.description}
                onChange={(e) => handleNestedChange('algorithmicProblem', 'description', e.target.value)}
                error={errors.algDescription}
                placeholder="Describe the algorithmic problem clearly..."
                rows={4}
                className="transition-all duration-200 hover:border-green-300"
                required
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Textarea
                  label="Input Format"
                  value={formData.algorithmicProblem.inputFormat}
                  onChange={(e) => handleNestedChange('algorithmicProblem', 'inputFormat', e.target.value)}
                  error={errors.inputFormat}
                  placeholder="Describe the input format..."
                  rows={3}
                  className="font-mono transition-all duration-200 hover:border-green-300"
                  required
                />
                <Textarea
                  label="Output Format"
                  value={formData.algorithmicProblem.outputFormat}
                  onChange={(e) => handleNestedChange('algorithmicProblem', 'outputFormat', e.target.value)}
                  error={errors.outputFormat}
                  placeholder="Describe the expected output format..."
                  rows={3}
                  className="font-mono transition-all duration-200 hover:border-green-300"
                  required
                />
              </div>

              <Textarea
                label="Constraints"
                value={formData.algorithmicProblem.constraints}
                onChange={(e) => handleNestedChange('algorithmicProblem', 'constraints', e.target.value)}
                error={errors.constraints}
                placeholder="Specify the problem constraints..."
                rows={2}
                className="font-mono transition-all duration-200 hover:border-green-300"
                required
              />

              {/* Enhanced Examples Section */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-lg font-semibold text-green-800">
                      Examples <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addExample} 
                    className="self-start sm:self-auto border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Add Example</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
                
                {errors.examples && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-600">{errors.examples}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {formData.algorithmicProblem.examples.map((example, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 hover:shadow-medium transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900">Example {index + 1}</h4>
                        </div>
                        {formData.algorithmicProblem.examples.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExample(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Textarea
                          label="Input"
                          value={example.input}
                          onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                          placeholder="Sample input..."
                          rows={3}
                          className="font-mono bg-gray-50"
                        />
                        <Textarea
                          label="Output"
                          value={example.output}
                          onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                          placeholder="Expected output..."
                          rows={3}
                          className="font-mono bg-gray-50"
                        />
                      </div>
                      <div className="mt-4">
                        <Textarea
                          label="Explanation (Optional)"
                          value={example.explanation || ''}
                          onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                          placeholder="Explain the example..."
                          rows={2}
                          className="bg-blue-50 border-blue-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Buildathon Problem */}
          <Card className="overflow-hidden border-0 shadow-large bg-white/80 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6" />
                <h2 className="text-xl sm:text-2xl font-bold">Buildathon Problem</h2>
              </div>
              <p className="text-purple-100 mt-1">Define the project building challenge</p>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <Textarea
                label="Project Description"
                value={formData.buildathonProblem.description}
                onChange={(e) => handleNestedChange('buildathonProblem', 'description', e.target.value)}
                error={errors.buildDescription}
                placeholder="Describe the buildathon project requirements..."
                rows={4}
                className="transition-all duration-200 hover:border-purple-300"
                required
              />

              {/* Enhanced Requirements */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-lg font-semibold text-purple-800">
                      Requirements <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addArrayItem('buildathonProblem', 'requirements')}
                    className="self-start sm:self-auto border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Add Requirement</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
                
                {errors.requirements && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-600">{errors.requirements}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {formData.buildathonProblem.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-200">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                        <span className="text-purple-600 font-bold text-xs">{index + 1}</span>
                      </div>
                      <Input
                        value={requirement}
                        onChange={(e) => handleArrayChange('buildathonProblem', 'requirements', index, e.target.value)}
                        placeholder="Enter requirement..."
                        className="flex-1 border-0 bg-transparent"
                      />
                      {formData.buildathonProblem.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('buildathonProblem', 'requirements', index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Tech Stack */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-lg font-semibold text-blue-800">
                      Suggested Tech Stack (Optional)
                    </label>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addArrayItem('buildathonProblem', 'techStack')}
                    className="self-start sm:self-auto border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Add Technology</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.buildathonProblem.techStack?.map((tech, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-200">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                        <Code className="w-3 h-3 text-blue-600" />
                      </div>
                      <Input
                        value={tech}
                        onChange={(e) => handleArrayChange('buildathonProblem', 'techStack', index, e.target.value)}
                        placeholder="e.g., React, Node.js, MongoDB..."
                        className="flex-1 border-0 bg-transparent"
                      />
                      {(formData.buildathonProblem.techStack?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('buildathonProblem', 'techStack', index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Deliverables */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Flag className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-lg font-semibold text-emerald-800">
                      Deliverables <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addArrayItem('buildathonProblem', 'deliverables')}
                    className="self-start sm:self-auto border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Add Deliverable</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
                
                {errors.deliverables && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-600">{errors.deliverables}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {formData.buildathonProblem.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-200">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-2">
                        <span className="text-emerald-600 font-bold text-xs">{index + 1}</span>
                      </div>
                      <Input
                        value={deliverable}
                        onChange={(e) => handleArrayChange('buildathonProblem', 'deliverables', index, e.target.value)}
                        placeholder="Enter deliverable..."
                        className="flex-1 border-0 bg-transparent"
                      />
                      {formData.buildathonProblem.deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('buildathonProblem', 'deliverables', index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Enhanced Action Buttons */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-2xl shadow-large border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={onCancel} 
                  className="w-full sm:w-auto hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  isLoading={isLoading} 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {challenge ? 'Update Challenge' : 'Create Challenge'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeForm;
