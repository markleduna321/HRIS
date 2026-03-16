import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Button, Modal, Input, TextArea, showSuccess, showError, showDeleteConfirm } from '@/app/components';
import { format, differenceInMonths } from 'date-fns';

const WorkExperienceModal = ({ isOpen, onClose, experience, onSave }) => {
  const [formData, setFormData] = useState({
    position_title: '',
    company_name: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    job_description: '',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (experience) {
      setFormData({
        position_title: experience.position_title || '',
        company_name: experience.company_name || '',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        currently_working: experience.currently_working || false,
        job_description: experience.job_description || '',
      });
    } else {
      setFormData({
        position_title: '',
        company_name: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        job_description: '',
      });
    }
  }, [experience]);

  useEffect(() => {
    if (isOpen) {
      // Fetch all skills when modal opens
      axios.get('/api/skills')
        .then(response => setAllSkills(response.data))
        .catch(error => console.error('Error fetching skills:', error));
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      const url = experience ? `/api/work-experiences/${experience.id}` : '/api/work-experiences';
      const method = experience ? 'put' : 'post';
      
      const response = await axios[method](url, formData);
      
      showSuccess({ 
        title: 'Success', 
        content: experience ? 'Work experience updated successfully!' : 'Work experience added successfully!' 
      });
      
      onSave(response.data);
      onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      showError({ 
        title: 'Error', 
        content: 'Please check the form and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={experience ? 'Edit Experience' : 'Add Previous Experience'}
      size="lg"
    >
      <div className="space-y-4">
        <Input
          label="Position Title"
          name="position_title"
          value={formData.position_title}
          onChange={handleInputChange}
          placeholder="e.g., Software Developer"
          required
          error={errors.position_title?.[0]}
        />

        <Input
          label="Company Name"
          name="company_name"
          value={formData.company_name}
          onChange={handleInputChange}
          placeholder="e.g., ABC Corporation"
          required
          error={errors.company_name?.[0]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
            error={errors.start_date?.[0]}
          />

          <Input
            label="End Date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
            disabled={formData.currently_working}
            error={errors.end_date?.[0]}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="currently_working"
            checked={formData.currently_working}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">I currently work here</span>
        </label>

        <TextArea
          label="Job Description"
          name="job_description"
          value={formData.job_description}
          onChange={handleInputChange}
          rows={4}
          placeholder="Describe your responsibilities, achievements, and key projects..."
          error={errors.job_description?.[0]}
        />

        {/* Skills Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills & Expertise
          </label>
          <Input
            name="skill_input"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder="Type a skill and press Enter"
          />
          <p className="text-xs text-gray-500 mt-1">Press Enter to add a skill</p>

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {experience ? 'Save Changes' : 'Add Experience'}
        </Button>
      </div>
    </Modal>
  );
};

const TimelineExperience = ({ experience, onEdit, onDelete, isLast }) => {
  const formatDate = (date) => {
    if (!date) return 'Present';
    try {
      return format(new Date(date), 'MMM yyyy');
    } catch {
      return date;
    }
  };

  const calculateDuration = () => {
    try {
      const start = new Date(experience.start_date);
      const end = experience.currently_working ? new Date() : new Date(experience.end_date);
      const months = differenceInMonths(end, start);
      
      if (months === 0) return '0 months';
      if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
      
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Timeline Line and Dot */}
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-md z-10"></div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-300 absolute top-3"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 -mt-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{experience.position_title}</h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>{experience.company_name}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(experience)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(experience)}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {formatDate(experience.start_date)} - {experience.currently_working ? 'Present' : formatDate(experience.end_date)}
          </span>
          <span className="text-gray-400">•</span>
          <span>{calculateDuration()}</span>
        </div>

        {experience.job_description && (
          <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
            {experience.job_description}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ExperiencesSection() {
  const [experiences, setExperiences] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expResponse, skillsResponse] = await Promise.all([
        axios.get('/api/work-experiences'),
        axios.get('/api/skills/user')
      ]);
      // Reverse to show from first job to most recent
      setExperiences(expResponse.data.reverse());
      setUserSkills(skillsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError({ title: 'Error', content: 'Failed to load experiences and skills' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  const handleDeleteExperience = (experience) => {
    showDeleteConfirm({
      title: 'Delete Work Experience',
      content: `Are you sure you want to delete "${experience.position_title}" at ${experience.company_name}?`,
      onOk: async () => {
        try {
          await axios.delete(`/api/work-experiences/${experience.id}`);
          setExperiences(experiences.filter(exp => exp.id !== experience.id));
          showSuccess({ title: 'Success', content: 'Work experience deleted successfully!' });
        } catch (error) {
          showError({ title: 'Error', content: 'Failed to delete work experience' });
        }
      }
    });
  };

  const handleSaveExperience = (savedExperience) => {
    if (editingExperience) {
      setExperiences(experiences.map(exp => 
        exp.id === savedExperience.id ? savedExperience : exp
      ));
    } else {
      // Add new experience and re-sort (oldest first)
      const updatedExperiences = [...experiences, savedExperience];
      updatedExperiences.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setExperiences(updatedExperiences);
    }
  };

  const handleAddSkill = async (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      try {
        const response = await axios.post('/api/skills/add', {
          skill_name: skillInput.trim()
        });
        setUserSkills([...userSkills, response.data.skill]);
        setSkillInput('');
        showSuccess({ title: 'Success', content: 'Skill added successfully!' });
      } catch (error) {
        showError({ title: 'Error', content: 'Failed to add skill' });
      }
    }
  };

  const handleRemoveSkill = async (skill) => {
    try {
      await axios.delete(`/api/skills/${skill.id}/remove`);
      setUserSkills(userSkills.filter(s => s.id !== skill.id));
      showSuccess({ title: 'Success', content: 'Skill removed successfully!' });
    } catch (error) {
      showError({ title: 'Error', content: 'Failed to remove skill' });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Work Experiences Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Previous Experience</h3>
          </div>
          <Button
            variant="primary"
            onClick={handleAddExperience}
            icon={<PlusIcon className="h-4 w-4" />}
          >
            Add Experience
          </Button>
        </div>

        {experiences.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No work experience added yet</p>
            <Button variant="primary" onClick={handleAddExperience}>
              Add Your First Experience
            </Button>
          </div>
        ) : (
          <div className="pl-4">
            {experiences.map((experience, index) => (
              <TimelineExperience
                key={experience.id}
                experience={experience}
                onEdit={handleEditExperience}
                onDelete={handleDeleteExperience}
                isLast={index === experiences.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Skills & Expertise
        </h3>
        
        <Input
          name="skill_input"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Type a skill and press Enter"
        />
        <p className="text-xs text-gray-500 mt-1 mb-3">Press Enter to add a skill</p>

        {userSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-blue-900 font-bold text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <WorkExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        experience={editingExperience}
        onSave={handleSaveExperience}
      />
    </div>
  );
}
